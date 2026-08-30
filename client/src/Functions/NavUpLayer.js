export default function navUpLayer({ oldData, setData, data, setOldData, oldParentIds, setOldParentIds, setCurrentParentId }) {
    if (oldData.length > 0) {
        setData(oldData[oldData.length - 1])
        const newData = oldData.slice(0, oldData.length - 1)
        setOldData(newData)
        setCurrentParentId(oldParentIds[oldParentIds.length - 1])
        setOldParentIds(oldParentIds.slice(0, oldParentIds.length - 1))
    }

}