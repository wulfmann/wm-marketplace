'use strict'

const defaults = {
  name: 'Inventory',
  endpoint: '/inventory',
  version: '/v2'
}

const requests = {
  GetInventory: {
    method: 'GET',
    params: {
      sku: {
        required: true,
        value: ''
      }
    }
  },
  UpdateInventory: {
    method: 'PUT',
    xsd: {
      file: 'Inventory',
      function: 'itemInventory'
    },
    contentType: 'application/xml',
    params: {
      sku: {
        required: true,
        value: null
      },
      quantity: {
        required: true,
        value: null
      },
      lag: {
        required: false,
        value: 1
      }
    }
  }
}

module.exports = {
  requests,
  defaults
}