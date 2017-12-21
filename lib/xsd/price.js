'use strict'

function itemPrice (obj) {
  return [
    `<Price xmlns="http://walmart.com/">`,
    `<itemIdentifier>`,
    `<sku>${obj.sku.value}</sku>`,
    `</itemIdentifier>`,
    `<pricingList>`,
    `<pricing>`,
    `<currentPrice>`,
    `<value currency="USD" amount="${obj.price.value}"/>`,
    `</currentPrice>`,
    `</pricing>`,
    `</pricingList>`,
    `</Price>`
  ].join('')
}

module.exports = {itemPrice}
