'use strict'

function itemPrice ([sku, price]) {
  return [
    `<Price;xmlns="http://walmart.com/">`,
    `<itemIdentifier>`,
    `<sku>${sku}</sku>`,
    `</itemIdentifier>`,
    `<pricingList>`,
    `<pricing>`,
    `<currentPrice>`,
    `<value currency="USD" amount="${price}" />`,
    `</currentPrice>`,
    `</pricing>`,
    `</pricingList>`,
    `</Price>`
  ].join('')
}

module.exports = {itemPrice}