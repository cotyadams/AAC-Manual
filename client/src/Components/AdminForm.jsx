import react, { useState, useEffect } from "react"
import * as apiCalls from "../Nodeapi"
import "../styles/admin.css"
import fetchData from "../Functions/fetchData"


// {
//     label: "Eat",
//     icon: "🍎",
//     description: "I want to eat",
//     children: [],
//     parents: []
// }

export default function AdminForm({ setShowAdminForm, setShowAdminScreen, isSelectLeaf, setIsSelectLeaf }) {
    const newNode = {
        "label": "",
        "icon": "",
        "description": "",
        "children": [],
        "parents": []
    }
    const [node, setNode] = useState(isSelectLeaf.id ? () => {
        setShowAdminForm(true)
        return isSelectLeaf
    } : newNode)

    return (
        <div className="admin-form">
            <form onSubmit={
                node.id ?
                    (e) => {
                        e.preventDefault();
                        console.log('true')
                        apiCalls.updateNode(isSelectLeaf.id, { ...node })
                        setShowAdminForm(false)
                        setIsSelectLeaf({})
                    }
                    :
                    () => {
                        console.log('false')
                        apiCalls.createNode(node)
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
                            setShowAdminForm(false)
                        }}
                    >Children</button>
                    <button
                        className="parents-selection"
                        placeholder="parents"
                        onChange={(e) => { setNode({ ...node, parents: e.target.value }) }}
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
                                    setNode(newNode);
                                    setShowAdminForm(false);
                                    setIsSelectLeaf({})
                                }
                                :
                                () => {
                                    setNode(newNode)
                                    setShowAdminForm(false)
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