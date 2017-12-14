'use strict'
const WalmartRequest = require('./request')

// Import the endpoint files
const Inventory = require('./endpoints/inventory')
const Orders = require('./endpoints/orders')
const Items = require('./endpoints/items')
const Reports = require('./endpoints/reports')
const Prices = require('./endpoints/prices')

function createRequests (endpoint) {
  const requests = endpoint.requests
  const defaults = endpoint.defaults

  return Object.entries(requests).reduce((result, [requestName, properties]) => {
    const reqData = Object.assign(requestName, {properties}, requests, defaults)

    // Add the function for each request in the endpoint
    result[requestName] = (args) => {
      const defaultParams = properties.params

      // Format the passed arguments into the expected format
      const formattedArgs = Object.entries(args).reduce((results, [key, value]) => {
        results[key] = {value: value}
        return results
      }, {})

      // Merge default parameters with the passed arguments
      const params = Object.assign(defaultParams, formattedArgs)

      //Add the request object
      const req = WalmartRequest.create(reqData)

      const requestDefaults = {
        params: null,
        method: null,
        additional: null,
        xsd: null
      }

      let method, additional, xsd

      // Make sure method is not undefined
      if (properties.method !== undefined) {
        method = properties.method
      } else {
        throw new Error('METHOD REQUIRED')
      }

      // if additional is present, set it. otherwise add empty string
      if (properties.additional !== undefined) {
        additional = properties.additional
      } else {
        additional = ''
      }

      // if method is put or post, make sure xsd is present
      if ((method === 'PUT' || method === 'POST') && properties.xsd === undefined) {
        throw new Error(`XSD required for ${method}`)
      }

      // If xsd is present, set it.
      if (properties.xsd !== undefined) {
        xsd = properties.xsd
      }

      const passedSettings = {
        params: params,
        method: method,
        additional: additional,
        xsd: xsd
      }

      if (properties.contentType !== undefined) {
        this.contentType = properties.contentType
      }

      const requestSettings = Object.assign(requestDefaults, passedSettings)
      req.set(requestSettings)
      return this.invoke(req) 
    }
    return result
  }, {})
}

module.exports = function (context) {
  const createBoundRequest = createRequests.bind(context)

  return {
    Inventory: createBoundRequest(Inventory),
    Orders: createBoundRequest(Orders),
    Items: createBoundRequest(Items),
    Reports: createBoundRequest(Reports),
    Prices: createBoundRequest(Prices)
  }
}