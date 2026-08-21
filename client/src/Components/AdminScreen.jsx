import { useState, useEffect } from 'react'
import * as apiCalls from '../Nodeapi'


// {
//     label: "Eat",
//     icon: "🍎",
//     description: "I want to eat",
//     children: [],
//     parents: []
// }

export default function AdminScreen() {
    let [data, setData] = useState([])
    useEffect(() => {
        apiCalls.fetchAllNodes().then(setData).then(console.log((data)));
    }, [])
    return (
        <div className="admin-screen-container">
            { data ? data.map(node =>
                <button className="grid-node" aria-label={node.label} >
                    <span className="grid-node-icon" aria-hidden="true">{node.icon}</span>
                    <span className="grid-node-label">{node.label}</span>
                </button>
            ) : null }
        </div>
    )
}