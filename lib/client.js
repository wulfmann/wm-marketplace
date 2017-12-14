'use strict';

// Used to sign the key for each request
const NodeRSA = require('node-rsa')

// For the requests
const request = require('request')

// Main Factory
const Walmart = {
  defaults: {
    host: 'marketplace.walmartapis.com',
    contentType: 'application/json',
    appName: 'Walmart Marketplace'
  },

  Client (settings) {
    const required = {
      consumerId: settings.consumerId,
      privateKey: settings.privateKey,
      correlationId: settings.correlationId,
      channelType: settings.channelType
    }

    // Make sure all of the required keys are present
    if (!settings.consumerId || !settings.privateKey || !settings.correlationId || !settings.channelType) {
      const missing = Object.entries(required).reduce((result, [key, value]) => {
        if (value === undefined) {
          result.push(key)
        }
      }, [])
      throw new Error(`Missing Parameter${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}!`)
    } else {
      return this.init(required)
    }
  },
  // Add the settings to the object, and pull in the api
  init (options) {
    const settings = Object.assign({}, this.defaults, options)
    this.host = settings.host
    this.contentType = settings.contentType
    this.appName = settings.appName
    this.credentials = {
      consumerId: settings.consumerId,
      privateKey: settings.privateKey,
      correlationId: settings.correlationId,
      channelType: settings.channelType
    }

    return Object.assign(this, require('./api')(this))
  },

  // This gets called when a method is used
  invoke (req) {
    return req.query().then((q) => this.call(req, q))
  },

  // The actual request that is made to walmart
  request (req, q) {
    return new Promise((resolve, reject) => {
      const api = req.api
      const method = req.method
      const query = Object.assign({}, q)
      const credentials = this.credentials

      // Generate Timestamp
      const ts = (new Date).getTime()

      // Uri for Request
      const uri = `https://${this.host}${api.version}${api.endpoint}${additional}`

      // Format all params, throw errors if breaking rules
      const allParams = Object.entries(req.params).reduce((result, [key, value]) => {
        //console.log(`${key}: ${value}`)

        // Check if the value is required and not provided
        if (value.required && value.value.length < 1) {
          throw new Error(`WARNING: ${key} is required for this request`)
        }

        // Does the value require the presence of another key?
        if (value.requiredProp !== undefined && req.params[value.requiredProp].length < 1) {
          throw new Error(`WARNING: ${value.requiredProp} is required to use ${key} in this request`)
        }

        if (value.value !== null) {
          result[key] = value.value
        }
        
        return result
      }, {})

      // Signing requires full url of request. build that here
      const paramList = Object.entries(allParams).map(([key, value]) => {
        return `${key}=${value}`
      })

      // Build url to sign
      let urlForSigning
      if (method === 'POST' || method === 'PUT') {
        urlForSigning = uri
      } else {
        urlForSigning = `${uri}?${ paramList.map(p => p).join('&') }`
      }

      // Build complete string to pass to the sign function
      const dataToSign = `${credentials.consumerId}\n${urlForSigning}\n${method}\n${ts}\n`

      // Signed data
      const signature = this.sign(credentials.privateKey, dataToSign)

      const headers = {
        "WM_SVC.NAME": this.appName,
        "WM_CONSUMER.ID": credentials.consumerId,
        "WM_SEC.TIMESTAMP": ts,
        "WM_SEC.AUTH_SIGNATURE": signature,
        "WM_QOS.CORRELATION_ID": credentials.correlationId,
        "WM_CONSUMER.CHANNEL.TYPE": credentials.channelType,
        "content-type": this.contentType
      }

      const options = {
        url: uri,
        host: this.host,
        headers,
        method,
        qs: allParams
      }

      if (req.body) {
        options['body'] = req.body
      }

      if (method === 'POST' || method === 'PUT') {
        delete options.qs
      }

      request(options, (error, response, body) => {
        if (error) reject(error)
        resolve(body)
      })
    })
  },

  // Sign the string for the request
  sign (secret, data) {
    console.log(secret, data)
    const key = new NodeRSA()
    key.importKey(new Buffer(secret, 'base64'), 'pkcs8-private-der')
    const privateKey = key.exportKey()
    const signature = new NodeRSA(privateKey, {signingScheme: 'sha256'}).sign(data).toString('base64');
    return signature
  },

  // Actual call site of the request. Also returns the response
  call (req, q) {
    return this.request(req, q)
  }
}

module.exports = Walmart