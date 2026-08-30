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
        "topLevel:": true,
    }
    //if current leaf exists, set as edit form, if not (when add node is hit), then make form blank
    const [node, setNode] = useState(isSelectLeaf.id ? () => {
        setShowAdminScreen(false)
        setShowAdminForm(true)
        return isSelectLeaf
    } : newNode)

    return (
        <div className="admin-form">
            <form onSubmit={
                isSelectLeaf.id ?
                    (e) => {
                        e.preventDefault();
                        console.log('true')
                        apiCalls.updateNode(isSelectLeaf.id, { ...node })
                        setShowAdminForm(false)
                        setShowAdminScreen(true)
                        setIsSelectLeaf({})
                    }
                    :
                    (e) => {
                        e.preventDefault();
                        apiCalls.createNode(node)
                        setShowAdminForm(false)
                        setShowAdminScreen(true)
                        setData([...data, node])
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
                                () => {
                                    apiCalls.deleteNode(node.id)
                                    let newData = data.filter((node) => node.id != isSelectLeaf.id)
                                    setData(newData)
                                    setShowAdminForm(false);
                                    setShowAdminScreen(true)
                                    setIsSelectLeaf({})
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