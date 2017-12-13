'use strict'

const defaults = {
  name: 'Orders',
  endpoint: '/orders',
  version: '/v3'
}

const requests = {
  GetAllReleased: {
    method: 'GET',
    additionalPath: '/released',
    params: {
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
  },
  GetAnOrder: {
    method: 'GET',
    params: {
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