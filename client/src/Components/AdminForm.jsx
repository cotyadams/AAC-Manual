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
                <input
                    className="label-input"
                    value={node.label}
                    placeholder="label"
                    onChange={(e) => { setNode({ ...node, label: e.target.value }) }}
                />
                <input
                    className="icon-input"
                    value={node.icon}
                    placeholder="icon"
                    onChange={(e) => { setNode({ ...node, icon: e.target.value }) }}
                />
                <input
                    className="description-input"
                    value={node.description}
                    placeholder="description"
                    onChange={(e) => { setNode({ ...node, description: e.target.value }) }}
                />
                <div className="selection-container">
                    <button
                        className="children-selection"
                        placeholder="children"
                        onClick={() => {
                            setIsSelectLeaf(node);
                            setShowAdminForm(false);
                            setShowAdminScreen(true);
                            setAddChild(true)
                        }}
                    >Children</button>
                    <div className="top-level-checkbox-div">
                        <input
                            type="checkbox"
                            className="top-level-checkbox"
                        />
                        <h1
                            className="top-level-label"
                        >Show on Home?</h1>
                    </div>
                    <button
                        className="children-selection"
                        placeholder="children"
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
                        className="save-button"
                        type="submit"
                    >
                        Save
                    </button>
                    <button
                        className="delete-button"
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