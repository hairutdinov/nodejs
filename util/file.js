const fs = require('fs')

const deleteFile = filePath => {
    fs.unlink(filePath, e => {
        if (e) throw e
    })
}

exports.deleteFile = deleteFile