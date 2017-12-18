'use strict'

const defaults = {
  name: 'Prices',
  endpoint: '/price',
  version: '/v3'
}

const requests = {
  ItemPrice: {
    contentType: 'application/xml',
    method: 'PUT',
    params: {
      price: {
        required: true,
        value: null
      },
      sku: {
        required: true,
        value: null
      }
    },
    xsd: {
      file: 'Price',
      function: 'itemPrice'
    }
  }
}

module.exports = {
  requests,
  defaults
}