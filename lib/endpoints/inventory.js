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
  }
}

module.exports = {
  requests,
  defaults
}