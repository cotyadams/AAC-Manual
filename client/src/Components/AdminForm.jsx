import react, { useState, useEffect } from "react"
import * as apiCalls from "../Nodeapi"
import "../styles/admin.css"
import fetchData from "../Functions/fetchData"


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
    setData
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
                        onClick={() => {
                            setIsSelectLeaf(node);
                            setShowAdminForm(false);
                            setShowAdminScreen(true);
                            setAddChild(true)
                        }}
                    >Children</button>
                    <div className="checkbox-field">
                        <input
                            type="checkbox"
                            id="top-level-checkbox"
                            checked={!!node.topLevel}
                            onChange={() => {
                                setNode({ ...node, topLevel: !node.topLevel })
                            }}
                        />
                        <label htmlFor="top-level-checkbox">Show on Home?</label>
                    </div>
                    <button
                        type="button"
                        className="btn btn--soft"
                        onClick={() => {
                            setIsSelectLeaf(node);
                            setShowAdminForm(false);
                            setShowAdminScreen(true);
                            setAddChild(true)
                        }}
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
                                        await apiCalls.deleteNode(node.id)
                                        let newData = data.filter((node) => node.id != isSelectLeaf.id)
                                        setData(newData)
                                        setShowAdminForm(false);
                                        setShowAdminScreen(true)
                                        setIsSelectLeaf({})
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