'use strict'
const WalmartRequest = require('./request')

// Import the endpoint files
const Inventory = require('./endpoints/inventory')
const Orders = require('./endpoints/orders')

function createRequests (endpoint) {
  const requests = endpoint.requests
  const defaults = endpoint.defaults

  return Object.entries(requests).reduce((result, [requestName, properties]) => {
    const reqData = Object.assign(requestName, {properties}, requests, defaults)

    // Add the function for each request in the endpoint
    result[requestName] = (args) => {
      const defaultParams = properties.params
      const method = properties.method

      // Format the passed arguments into the expected format
      const formattedArgs = Object.entries(args).reduce((results, [key, value]) => {
        results[key] = {value: value}
        return results
      }, {})

      // Merge default parameters with the passed arguments
      const params = Object.assign(defaultParams, formattedArgs)

      //Add the request object
      const req = WalmartRequest.create(reqData)
      req.set(params, method)
      return this.invoke(req) 
    }
    return result
  }, {})
}

module.exports = function (context) {
  const createBoundRequest = createRequests.bind(context)

  return {
    Inventory: createBoundRequest(Inventory),
    Orders: createBoundRequest(Orders)
  }
}