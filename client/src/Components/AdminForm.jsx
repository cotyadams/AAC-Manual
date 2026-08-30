import react, { useState, useEffect } from "react"
import * as apiCalls from "../Nodeapi"
import "../styles/admin.css"
import fetchData from "../Functions/fetchData"
import navUpLayer from "../Functions/NavUpLayer"


// {
//     label: "Eat",
//     icon: "🍎",
//     description: "I want to eat",
//     children: [],
//     topLevel: bool,
// }

export default function AdminForm({
    setShowAdminForm,
    setShowAdminScreen,
    isSelectLeaf,
    setIsSelectLeaf,
    addChild,
    setAddChild,
    data,
    setData,
    showAllNodes,
    currentParentId,
    setCurrentParentId,
    oldData,
    setOldData,
    oldParentIds,
    setOldParentIds
}) {
    const newNode = {
        "label": "",
        "icon": "",
        "description": "",
        "children": [],
        "topLevel": false,
    }
    //if current leaf exists, set as edit form, if not (when add node is hit), then make form blank
    const [node, setNode] = useState(isSelectLeaf.id ? isSelectLeaf : newNode)

    // Children/Parents selection works by updating a node's relations by id,
    // so a brand-new node (no id yet) has to be persisted first -- otherwise
    // the selection screen tries to update a node with an undefined/NaN id.
    async function selectRelations() {
        try {
            let target = node;
            if (!target.id) {
                target = await apiCalls.createNode(node);
                setNode(target);
                setData([...data, target]);
            }
            setIsSelectLeaf(target);
            setShowAdminForm(false);
            setShowAdminScreen(true);
            setAddChild(true);
        } catch (err) {
            alert(`Failed to save node: ${err.message}`);
        }
    }

    return (
        <div className="admin-form">
            <form onSubmit={
                isSelectLeaf.id ?
                    async (e) => {
                        e.preventDefault();
                        try {
                            const updated = await apiCalls.updateNode(isSelectLeaf.id, { ...node })
                            setData(data.map((n) => n.id === isSelectLeaf.id ? updated : n))
                            setShowAdminForm(false)
                            setShowAdminScreen(true)
                            setIsSelectLeaf({})
                        } catch (err) {
                            alert(`Failed to save changes: ${err.message}`)
                        }
                    }
                    :
                    async (e) => {
                        e.preventDefault();
                        try {
                            const created = await apiCalls.createNode(node)
                            setShowAdminForm(false)
                            setShowAdminScreen(true)
                            setData([...data, created])
                        } catch (err) {
                            alert(`Failed to create node: ${err.message}`)
                        }
                    }
            }>
                <div className="form-field">
                    <label htmlFor="label-input">Label</label>
                    <input
                        id="label-input"
                        className="text-input"
                        value={node.label}
                        placeholder="e.g. Eat"
                        onChange={(e) => { setNode({ ...node, label: e.target.value }) }}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="icon-input">Icon</label>
                    <input
                        id="icon-input"
                        className="text-input icon-input"
                        value={node.icon}
                        placeholder="e.g. 🍎"
                        onChange={(e) => { setNode({ ...node, icon: e.target.value }) }}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="description-input">Description</label>
                    <input
                        id="description-input"
                        className="text-input"
                        value={node.description}
                        placeholder="e.g. I want to eat"
                        onChange={(e) => { setNode({ ...node, description: e.target.value }) }}
                    />
                </div>
                <div className="selection-container">
                    <button
                        type="button"
                        className="btn btn--soft"
                        onClick={selectRelations}
                    >Children</button>
                    <div className="checkbox-field">
                        <input
                            type="checkbox"
                            id="top-level-checkbox"
                            checked={!!node.topLevel}
                            onChange={
                                () => {
                                    setNode({...node, topLevel: !node.topLevel})
                                }
                            }
                        />
                        <label htmlFor="top-level-checkbox">Show on Home?</label>
                    </div>
                    <button
                        type="button"
                        className="btn btn--soft"
                        onClick={selectRelations}
                    >Parents</button>
                </div>
                <div className="node-options-container">
                    <button
                        className="btn btn--primary"
                        type="submit"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="btn btn--danger"
                        onClick={
                            node.id ?
                                async () => {
                                    try {
                                        let updatedParent = null;
                                        if (!showAllNodes && currentParentId) {
                                            // tree mode with a parent above it: just unlink from that parent
                                            updatedParent = await apiCalls.updateNode(currentParentId, { removeChildren: [node.id] })
                                        } else {
                                            // view-all mode (or no parent context): delete the node entirely,
                                            // which cascades and removes it from every parent's children in the database
                                            await apiCalls.deleteNode(node.id)
                                        }

                                        // the deleted node's id (and, if we just unlinked it,
                                        // the parent's fresh children list) is now stale wherever
                                        // it's cached -- patch every level so nothing needs a refresh
                                        const stripDeleted = (n) =>
                                            updatedParent && n.id === updatedParent.id
                                                ? updatedParent
                                                : n.children && n.children.includes(node.id)
                                                    ? { ...n, children: n.children.filter((id) => id !== node.id) }
                                                    : n
                                        const newData = data.filter((n) => n.id !== node.id).map(stripDeleted)
                                        const newOldData = oldData.map((level) => level.filter((n) => n.id !== node.id).map(stripDeleted))

                                        setShowAdminForm(false);
                                        setIsSelectLeaf({})

                                        if (!showAllNodes && currentParentId && newData.length === 0) {
                                            // that was the last child in this branch -- back out
                                            // to the level showing this branch's parent instead of
                                            // stranding the view on an empty child list
                                            navUpLayer({
                                                data: newData,
                                                setData,
                                                oldData: newOldData,
                                                setOldData,
                                                oldParentIds,
                                                setOldParentIds,
                                                setCurrentParentId
                                            })
                                        } else {
                                            setData(newData)
                                            setOldData(newOldData)
                                        }

                                        setShowAdminScreen(true)
                                    } catch (err) {
                                        alert(`Failed to delete node: ${err.message}`)
                                    }
                                }
                                :
                                () => {
                                    setNode(newNode)
                                    setShowAdminForm(false)
                                    setShowAdminScreen(true)
                                    setIsSelectLeaf({})
                                }
                        }
                    >
                        Delete
                    </button>

                </div>
            </form>

        </div>
    )
}