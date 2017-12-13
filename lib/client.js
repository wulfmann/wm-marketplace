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
      const missing = Object.entries(required).map(el => {
        const [key, value] = el
        if (value === undefined) {
          return key
        }
        throw new Error(`Missing Parameter${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}!`)
      })
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
      const uri = `https://${this.host}${api.version}${api.endpoint}`
      const query = Object.assign({}, q)
      const credentials = this.credentials
      const ts = (new Date).getTime()
      const requestedParam = Object.entries(req.params)[0]
      const fullUrl = `${uri}?${requestedParam[0]}=${requestedParam[1]}`
      const dataToSign = `${credentials.consumerId}\n${fullUrl}\n${method}\n${ts}\n`
      const signature = this.sign(credentials.privateKey, dataToSign)

      const headers = {
        "WM_SVC.NAME": this.appName,
        "WM_CONSUMER.ID": credentials.consumerId,
        "WM_SEC.TIMESTAMP": ts,
        "WM_SEC.AUTH_SIGNATURE": signature,
        "WM_QOS.CORRELATION_ID": credentials.correlationId,
        "WM_CONSUMER.ID.CHANNEL.TYPE": credentials.channelType,
        "content-type": this.contentType
      }

      const options = {
        url: uri,
        headers,
        method,
        qs: req.params
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