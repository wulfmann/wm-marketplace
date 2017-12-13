'use strict'

const defaults = {
  name: 'Orders',
  endpoint: '/orders',
  version: '/v3'
}

const requests = {
  GetAll: {
    method: 'GET',
    params: {
      sku: {
        value: null
      },
      customerOrderId: {
        value: null
      },
      purchaseOrderId:{
        value: null
      },
      status: {
        value: null
      },
      createdStartDate: {
        required: true,
        value: null
      },
      createdEndDate: {
        value: null,
        requiredProp: 'toExpectedShipDate'
      },
      toExpectedShipDate: {
        value: null
      },
      limit: {
        value: null
      }
    }
  }
}

module.exports = {
  requests,
  defaults
}