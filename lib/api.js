'use strict'
const WalmartRequest = require('./request');
const Inventory = require('./endpoints/inventory')

function createRequests (endpoint) {
  const requests = endpoint.requests
  const defaults = endpoint.defaults

  return Object.entries(requests).reduce((result, [requestName, properties]) => {
    const reqData = Object.assign(requestName, {properties}, requests, defaults)

    // Add the function for each request in the endpoint
    result[requestName] = (args) => {
      const params = properties.params
      const method = properties.method

      //Add the request object
      const req = WalmartRequest.create(reqData)
      req.set(args, method)
      return this.invoke(req) 
    }
    return result
  }, {})
}

module.exports = function (context) {
  const createBoundRequest = createRequests.bind(context)

  return {
    Inventory: createBoundRequest(Inventory)
  }
}