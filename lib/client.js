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
      // Generate Timestamp
      const ts = (new Date).getTime()
      const api = req.api
      const credentials = this.credentials
      const query = q
      const method = query.url.method

      // If Content type is presented, use it.
      if ('contentType' in query.url) {
        this.contentType = query.url.contentType
      }
      
      let path = `${Object.values(query.url.path).join('/')}`

      console.log(path)

      // Uri for Request
      const uri = `https://${this.host}${api.version}${api.endpoint}${path}`

      // Build URL to Cryptographically Sign for the request
      let urlForSigning
      if ('query' in query.url) {
        const queryList = Object.entries(query.url.query).reduce((result, [key, val]) => {
          if (val.value !== null) {
            result.push(`${key}=${val.value}`)
          }
          return result
        }, [])

        // Add all of the query items to the initial uri
        urlForSigning = `${uri}?${queryList.map(q => q).join('&')}`
      } else {
        urlForSigning = uri
      }

      console.log(urlForSigning)

      // Build complete string to pass to the sign function
      const dataToSign = `${credentials.consumerId}\n${urlForSigning}\n${method}\n${ts}\n`

      console.log(dataToSign)

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
      }

      // If a query is passed, add it to the request object
      if ('query' in query.url) {
        options['qs'] = Object.entries(query.url.query).reduce((result, [key, val]) => {
          if (val.value !== null) {
            result[key] = val.value
          }
          return result
        }, {})
      }

      // If a body is passed, add it to the request object
      if ('body' in query.url) {
        options['body'] = query.url.body
      }

      console.log(options)

      request(options, (error, response, body) => {
        if (error) reject(error)
        resolve(body)
      })
    })
  },

  // Sign the string for the request
  sign (secret, data) {
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