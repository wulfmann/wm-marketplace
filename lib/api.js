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
      // If nothing is passed. throw error
      if (args === undefined || args === null) {
        throw new Error('No properties passed')
      }

      let reqArgs = {}
      let reqSettings = {}
      const passedArgs = Object.keys(args)
      const reqProperties = ['params', 'query', 'path']

      // Make sure method was defined on the request
      if (!('method' in properties)) {
        throw new Error('METHOD REQUIRED')
      }

      // if method is put or post, make sure xsd is present
      if ((properties.method === 'PUT' || properties.method === 'POST') && !('xsd' in properties)) {
        throw new Error(`XSD required for ${method}`)
      }

      if ('xsd' in properties) {
        reqArgs['xsd'] = properties.xsd
      }

      reqSettings.method = properties.method

      if ('contentType' in properties) {
        reqSettings.contentType = properties.contentType
      }
      
      reqProperties.forEach((prop) => {
        // If endpoint has a required property, and that property is not passed. throw an error
        if (prop in properties) {
          Object.keys(properties[prop]).forEach((el) => {
            if (properties[prop][el].required && !(el in args)) {
              throw new Error(`${el} is Required for ${endpoint.defaults.endpoint}`)
            }

            if ('requiredProp' in properties[prop][el]) {
              let propRequired = properties[prop][el].requiredProp

              if (propRequired in args && !(properties[prop[el]] in args)) {
                throw new Error(`${el} is Required if ${propRequired} is used with ${endpoint.defaults.endpoint}`)
              }
            }

            if (!properties[prop][el].required && properties[prop][el].value !== null) {
              reqArgs[prop] = properties[prop][el]
            }
          })
        }

        passedArgs.forEach((arg) => {
          // If the request has the property from reqProperties and it matches one of the passed args
          if (prop in properties && arg in properties[prop]) {
            // if prop hasn't been added yet to reqArgs
            if (!(prop in reqArgs)) {
              reqArgs[prop] = properties[prop]
            }
            reqArgs[prop][arg]['value'] = args[arg]
          }
        })
      })

      //Add the request object
      const req = WalmartRequest.create(reqData)

      const newReq = Object.assign(reqSettings, reqArgs)

      req.set(newReq)
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