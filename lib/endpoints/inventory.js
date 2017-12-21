'use strict'

const defaults = {
  name: 'Inventory',
  endpoint: '/inventory',
  version: '/v2'
}

const requests = {
  GetInventory: {
    method: 'GET',
    query: {
      sku: {
        required: true,
        value: ''
      }
    }
  },
  UpdateInventory: {
    contentType: 'application/xml',
    method: 'PUT',
    params: {
      lag: {
        value: 1
      },
      quantity: {
        required: true,
        value: null
      }
    },
    query: {
      sku: {
        required: true,
        value: null
      }
    },
    xsd: {
      file: 'Inventory',
      function: 'itemInventory'
    }
  }
}

module.exports = {
  requests,
  defaults
}
