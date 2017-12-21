'use strict'

const defaults = {
  name: 'Orders',
  endpoint: '/orders',
  version: '/v3'
}

const requests = {
  GetAllReleased: {
    method: 'GET',
    path: {
      released: {
        value: '/released'
      }
    },
    query: {
      limit: {
        value: null
      },
      createdStartDate: {
        required: true,
        value: null
      }
    }
  },
  GetAll: {
    method: 'GET',
    query: {
      sku: {
        value: null
      },
      customerOrderId: {
        value: null
      },
      purchaseOrderId: {
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
  },
  GetOrder: {
    method: 'GET',
    path: {
      purchaseOrderId: {
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
