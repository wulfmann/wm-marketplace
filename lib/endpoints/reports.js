'use strict'

const defaults = {
  name: 'Reports',
  endpoint: '/getReport',
  version: '/v2'
}

const requests = {
  GetReport: {
    method: 'GET',
    params: {
      type: {
        value: null
      },
    }
  }
}

module.exports = {
  requests,
  defaults
}