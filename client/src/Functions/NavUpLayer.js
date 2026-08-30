export default function navUpLayer({ oldData, setData, data, setOldData }) {
    if (oldData.length > 0) {
        setData(oldData[oldData.length - 1])
        const newData = oldData.slice(0, oldData.length - 1)
        setOldData(newData)
    }

}