const deleteUnchangedValue = (beforeData, lastData) => {
    let changedData = {}

    const fields = Object.keys(lastData)
    fields.forEach(field => {
        if(JSON.stringify(beforeData[field]) !== JSON.stringify(lastData[field])){
            changedData[field] = lastData[field]
        }
    })

    return changedData
}

module.exports = {
    deleteUnchangedValue
}