'use strict'

function itemInventory ([sku, lag, quantity]) {
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<wm:inventory xmlns:wm="http://walmart.com/">`,
    `<wm:sku>${lag}</wm:sku>`,
    `<wm:quantity>`,
    `<wm:unit>EACH</wm:unit>`,
    `<wm:amount>${quantity}</wm:amount>`,
    `</wm:quantity>`,
    `<wm:fulfillmentLagTime>${lag}</wm:fulfillmentLagTime>`,
    `</wm:inventory>`
  ].join('')
}

module.exports = {itemInventory}