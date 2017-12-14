'use strict'

const defaults = {
  name: 'Prices',
  endpoint: '/price',
  version: '/v3'
}

const requests = {
  ItemPrice: {
    method: 'PUT',
    params: {
      sku: null,
      price: null
    },
    xsd: {
      file: 'Price',
      function: 'itemPrice'
    },
    contentType: 'application/xml'
  }
}

module.exports = {
  requests,
  defaults
}