'use strict'

const defaults = {
  name: 'items',
  endpoint: '/items',
  version: '/v3'
}

const requests = {
  GetAll: {
    method: 'GET',
    query: {
      sku: {
        value: null
      },
      limit: {
        value: null
      },
      offset: {
        value: null
      }
    }
  },
  GetItem: {
    method: 'GET',
    path: {
      sku: {
        value: null,
        required: true
      }
    }
  }
}

module.exports = {
  requests,
  defaults
}
