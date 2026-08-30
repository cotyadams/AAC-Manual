import react, { useState, useEffect } from "react"
import * as apiCalls from "../Nodeapi"
import "../styles/admin.css"
import fetchData from "../Functions/fetchData"
import navUpLayer from "../Functions/NavUpLayer"
import isImageIcon from "../Functions/isImageIcon"
import resizeImageToDataUrl from "../Functions/resizeImageToDataUrl"


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
    addParent,
    setAddParent,
    relationTarget,
    setRelationTarget,
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
    const [iconError, setIconError] = useState("")

    async function handleIconFile(e) {
        const file = e.target.files[0]
        e.target.value = "" // allow re-selecting the same file later
        if (!file) return
        try {
            setIconError("")
            const dataUrl = await resizeImageToDataUrl(file)
            setNode((prev) => ({ ...prev, icon: dataUrl }))
        } catch (err) {
            setIconError(err.message || "Failed to load image")
        }
    }

    // Children/Parents selection works by updating a node's relations by id,
    // so a brand-new node (no id yet) has to be persisted first -- otherwise
    // the selection screen tries to update a node with an undefined/NaN id.
    async function selectRelations(mode) {
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
            if (mode === "parent") {
                setAddParent(true);
            } else {
                setAddChild(true);
            }
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
                            let updatedData = [...data, created]

                            // created via "+" while picking children/parents for another
                            // node -- link the new node into that node's relations instead
                            // of just dropping it in the flat node list
                            if (relationTarget && relationTarget.id) {
                                const parentId = addParent ? created.id : relationTarget.id
                                const childId = addParent ? relationTarget.id : created.id
                                const updatedNode = await apiCalls.updateNode(parentId, { addChildren: [childId] })
                                const patchNode = (n) => (n.id === updatedNode.id ? updatedNode : n)
                                updatedData = updatedData.map(patchNode)
                                setOldData(oldData.map((level) => level.map(patchNode)))
                                setIsSelectLeaf(addParent ? relationTarget : updatedNode)
                                setRelationTarget({})
                            }

                            setData(updatedData)
                            setShowAdminForm(false)
                            setShowAdminScreen(true)
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
                    {isImageIcon(node.icon) ? (
                        <div className="icon-preview-row">
                            <img className="icon-preview-img" src={node.icon} alt="Selected icon preview" />
                            <button
                                type="button"
                                className="btn btn--soft"
                                onClick={() => setNode({ ...node, icon: "" })}
                            >
                                Remove image
                            </button>
                        </div>
                    ) : (
                        <input
                            id="icon-input"
                            className="text-input icon-input"
                            value={node.icon}
                            placeholder="e.g. 🍎"
                            onChange={(e) => { setNode({ ...node, icon: e.target.value }) }}
                        />
                    )}
                    <label htmlFor="icon-upload-input" className="icon-upload-label">
                        {isImageIcon(node.icon) ? "Replace with a different photo" : "Or upload a photo from your device"}
                    </label>
                    <input
                        id="icon-upload-input"
                        type="file"
                        accept="image/*"
                        className="icon-upload-input"
                        onChange={handleIconFile}
                    />
                    {iconError && <p className="icon-upload-error">{iconError}</p>}
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
                        onClick={() => selectRelations("child")}
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
                        onClick={() => selectRelations("parent")}
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
                                        let deleted, updatedNode;
                                        if (showAllNodes) {
                                            // show-all screen: delete the node entirely, which cascades
                                            // and removes it from every parent (and Home) in the database
                                            await apiCalls.deleteNode(node.id)
                                            deleted = true
                                            updatedNode = null
                                        } else if (currentParentId) {
                                            // tree mode with a parent above it: unlink just that one
                                            // occurrence -- the node only goes away entirely if it has
                                            // no other parents left and isn't shown on Home
                                            ({ deleted, node: updatedNode } = await apiCalls.removeNodeOccurrence(node.id, { parentId: currentParentId }))
                                        } else {
                                            // home level: remove just its "show on Home" placement
                                            ({ deleted, node: updatedNode } = await apiCalls.removeNodeOccurrence(node.id, { fromTopLevel: true }))
                                        }

                                        // if this was its last occurrence, it's gone from the database
                                        // entirely -- strip it (and any now-dangling child references to
                                        // it) out of every cached level. Otherwise it still exists under
                                        // its other parents/Home, so just refresh its own fields and drop
                                        // it from the one parent's children list we actually unlinked it from
                                        const stripChildRef = (n) =>
                                            n.children && n.children.includes(node.id)
                                                ? { ...n, children: n.children.filter((id) => id !== node.id) }
                                                : n
                                        const patch = deleted
                                            ? (n) => {
                                                return n.id === node.id ? null : stripChildRef(n)
                                            }
                                            : (n) => {
                                                if (n.id === node.id) return updatedNode
                                                if (currentParentId && n.id === currentParentId) return stripChildRef(n)
                                                return n
                                            }
                                        const applyPatch = (level) => level.map(patch).filter(Boolean)
                                        const newData = applyPatch(data)
                                        const newOldData = oldData.map(applyPatch)

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
                                    // restore the in-progress children/parents selection
                                    // context if this blank form was opened via "+" from there
                                    setIsSelectLeaf(relationTarget && relationTarget.id ? relationTarget : {})
                                    setRelationTarget({})
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