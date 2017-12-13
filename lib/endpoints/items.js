'use strict'

const defaults = {
  name: 'items',
  endpoint: '/items',
  version: '/v3'
}

const requests = {
  GetAll: {
    method: 'GET',
    params: {
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
  }
}

module.exports = {
  requests,
  defaults
}