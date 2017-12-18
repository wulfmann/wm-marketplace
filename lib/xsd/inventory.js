'use strict'

function itemInventory (obj) {
  const template = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<wm:inventory xmlns:wm="http://walmart.com/">`,
    `<wm:sku>${obj.sku.value}</wm:sku>`,
    `<wm:quantity>`,
    `<wm:unit>EACH</wm:unit>`,
    `<wm:amount>${obj.quantity.value}</wm:amount>`,
    `</wm:quantity>`,
    `<wm:fulfillmentLagTime>${obj.lag.value}</wm:fulfillmentLagTime>`,
    `</wm:inventory>`
  ]
  console.log(template)
  return template.join('')
}

module.exports = {itemInventory}