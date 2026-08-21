import { useState, useEffect } from 'react'
import * as apiCalls from '../Nodeapi'

export default function AdminScreen() {
    let [data, setData] = useState([])
    useEffect(() => {
        apiCalls.fetchAllNodes().then(setData).then(console.log((data)));
    }, [])
    return (
        <div className="admin-screen-container">
            <button className="grid-node" >
            </button>
        </div>
    )
}