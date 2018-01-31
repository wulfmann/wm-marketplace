const fs = require('fs')

const GetInventory = ({ sku }) => new Promise((resolve, reject) => {
    fs.readFile(`./inventory.json`. 'utf8', (err, data) => {
        if (err) reject(err)
        resolve(JSON.parse(data[sku]))
    })
})

export default GetInventory