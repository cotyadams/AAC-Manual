import { useState, useEffect } from 'react'
import * as apiCalls from '../Nodeapi'

export default function AdminScreen() {
    let [data, setData] = useState([])
    useEffect(() => {
        apiCalls.fetchAllNodes().then(setData).then(console.log((data)));
    }, [])
    return (
        <div className="admin-form-container">
            <button className="grid-node" >
                <span> + </span>
                <span>add</span>
            </button>
        </div>
    )
}