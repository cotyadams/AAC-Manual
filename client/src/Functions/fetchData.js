import { useState, useEffect } from "react"
import * as apiCalls from '../Nodeapi'

export default function fetchData() {
    const [data, setData] = useState([])

    useEffect(() => {
        apiCalls.fetchAllNodes().then(setData).then(console.log((data)));
    }, [])
    return [data, setData]
}