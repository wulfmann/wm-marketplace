'use strict'
const WalmartRequest = require('./request')

/* Import each endpoint */
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

    /*
    *| Create a new function for the current endpoint.
    */
    result[requestName] = (args) => {
      let reqArgs = {} // Request Arguments
      let reqSettings = {} // Request Settings

      /*
      *| This is an array of all of the arguments that are passed at the
      *| time of initialization.
      */
      const passedArgs = Object.keys(args)

      /*
      *| These three properties are the only three that
      *| may be passed as arguments, so these are the only
      *| ones that we need to check.
      */
      const reqProperties = ['params', 'query', 'path']

      /*
      *| Set the request method to the method from the endpoint
      */
      reqSettings.method = properties.method

      /*
      *| If the request passes an XSD key, add it to the
      *| request arguments object
      */
      if ('xsd' in properties) {
        reqArgs['xsd'] = properties.xsd
      }

      /*
      *| If the request passes a contentType key (required to use an XSD),
      *| add it to the request arguments object
      */
      if ('contentType' in properties) {
        reqSettings.contentType = properties.contentType
      }

      reqProperties.forEach((prop) => {
        /*
        *| This checks each property on the endpoint to see if it is
        *| required, or has a property that requires ANOTHER property
        */
        if (prop in properties) {
          let currentProp = properties[prop]

          Object.keys(currentProp).forEach((p) => {
            let currentKey = currentProp[p]

            /*
            *| If the selected endpoint has a property that is required
            *| and that property wasn't passed in the argument
            *| throw an error requiring that property.
            */
            if (currentKey.required && !(p in args)) {
              throw new Error(`${p} is Required for ${endpoint.defaults.endpoint}`)
            }

            /*
            *| If the selected endpoint has a property that requires
            *| the presence of another property to be used and that
            *| property wasn't passed in the argument
            *| throw an error requiring that property.
            */
            if ('requiredProp' in currentKey) {
              if ((currentKey.requiredProp in args) && !(currentKey in args)) {
                throw new Error(`${p} is Required if ${currentKey.requiredProp} is used with ${endpoint.defaults.endpoint}`)
              }
            }
          })
        }

        /*
        *| Different endpoints require different combinations of the required properties.
        *| This loop checks each arg to find where on the endpoint it needs to be placed.
        */
        passedArgs.forEach((arg) => {
          /*
          *| If the current endpoint property has the current argument key,
          *| Find the match on the endpoint property.
          */
          if (prop in properties && arg in properties[prop]) {
            /*
            *| Check if that prop is already in the request arguments object.
            */

            /* If it isn't, add it. */
            if (!(prop in reqArgs)) {
              reqArgs[prop] = properties[prop]
            }

            /* If it is, update the value. */
            reqArgs[prop][arg]['value'] = args[arg]
          }
        })
      })

      /* Create a new request object. */
      const req = WalmartRequest.create(reqData)

      /*
      *| Create new object by merging the request
      *| settings and request arguments
      */
      const newReq = Object.assign(reqSettings, reqArgs)

      /* Set the settings and argument object on the request object. */
      req.set(newReq)

      /* Invoke is a function on the main client object. */
      return this.invoke(req)
    }
    return result
  }, {})
}

module.exports = function (context) {
  const bindRequest = createRequests.bind(context)

  return {
    Inventory: bindRequest(Inventory),
    Orders: bindRequest(Orders),
    Items: bindRequest(Items),
    Reports: bindRequest(Reports),
    Prices: bindRequest(Prices)
  }
}
