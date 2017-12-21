'use strict'

/* Dependencies */
const NodeRSA = require('node-rsa')
const request = require('request')

const Walmart = {

  /*
  *| Sensible defaults for each requests.
  */
  defaults: {
    host: 'marketplace.walmartapis.com',
    contentType: 'application/json',
    appName: 'Walmart Marketplace'
  },

  Client (passedSettings) {
    /*
    *| These are the required credentials to initialize an api connection
    */
    const required = {
      consumerId: passedSettings.consumerId,
      privateKey: passedSettings.privateKey,
      correlationId: passedSettings.correlationId,
      channelType: passedSettings.channelType
    }

    /* Make sure all required properties are present */
    const validateRequired = this.checkRequired(required)

    /* If all required properties are present, build the object */
    if (validateRequired) {
      return this.init(required)
    }
  },

  /*
  *| Check and make sure all of the required properties are present.
  *| If they aren't, throw an error
  */
  checkRequired (reqd) {
    /*
    *| Check for the presence of each required property in the passed args.
    */
    const isMissing = x => (x === undefined || x === null)
    const missing = Object.keys(reqd).filter(isMissing)

    /*
    *| If there were any missing required properties. Throw an error.
    */
    if (missing.length > 0) {
      throw new Error(`Missing Parameter${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}!`)
    } else {
      return true
    }
  },

  // Add the settings to the object, and pull in the api
  init (options) {
    /*
    *| Merge the passed options and the defaults together.
    */
    const settings = Object.assign({}, this.defaults, options)

    /*
    *| Set each property to the main root for use by other functions later.
    */
    this.host = settings.host
    this.contentType = settings.contentType
    this.appName = settings.appName
    this.credentials = {
      consumerId: settings.consumerId,
      privateKey: settings.privateKey,
      correlationId: settings.correlationId,
      channelType: settings.channelType
    }

    /*
    *| Pull in all of the currently available endpoints.
    *| Generate their functions with all of the correct properties
    */
    return Object.assign(this, require('./api')(this))
  },

  /*
  *| When an endpoint function is invocated, this method is called.
  */
  invoke (req) {
    /*
    *| req.query() is important because it provides access to the req's scope.
    */
    return req.query().then((q) => this.call(req, q))
  },

  // The actual request that is made to walmart
  request (req, q) {
    return new Promise((resolve, reject) => {
      /* Generate the timestamp for the url encryption */
      const ts = new Date().getTime()

      /* The main request api */
      const api = req.api

      /* The credentials from the root of the client */
      const credentials = this.credentials

      /* Actual scope for the request object */
      const query = q

      /* Method for the request */
      const method = query.url.method

      // If Content type is presented, use it.
      if ('contentType' in query.url) {
        this.contentType = query.url.contentType
      }

      /*
      *| Merge all of the path propeties together into a valid url
      */
      let path = `${Object.values(query.url.path).join('/')}`

      /*
      *| Create the base URI for the request.
      *| Query parameters and other data for the request
      *| are added to the request later.
      */
      const uri = `https://${this.host}${api.version}${api.endpoint}${path}`

      /* Build complete URL for the request. Needs to be signed for the signature. */
      const urlForSigning = this.generateSignatureUrl(uri, query)

      /* Build the complete string for the signature */
      const dataToSign = `${credentials.consumerId}\n${urlForSigning}\n${method}\n${ts}\n`

      /* Generage the signature */
      const signature = this.sign(credentials.privateKey, dataToSign)

      /* Request Headers */
      const headers = {
        'WM_SVC.NAME': this.appName,
        'WM_CONSUMER.ID': credentials.consumerId,
        'WM_SEC.TIMESTAMP': ts,
        'WM_SEC.AUTH_SIGNATURE': signature,
        'WM_QOS.CORRELATION_ID': credentials.correlationId,
        'WM_CONSUMER.CHANNEL.TYPE': credentials.channelType,
        'content-type': this.contentType
      }

      /* Create request options object */
      const options = {
        url: uri,
        host: this.host,
        headers,
        method
      }

      /* If a query is present, add it to the qs key on the request options */
      if ('query' in query.url) {
        options['qs'] = Object.entries(query.url.query).reduce((result, [key, val]) => {
          if (val.value !== null) {
            result[key] = val.value
          }
          return result
        }, {})
      }

      /* If a body is passed, add it to the request options */
      if ('body' in query.url) {
        options['body'] = query.url.body
      }

      /* Make the request */
      request(options, (error, response, body) => {
        if (error) reject(error)
        resolve(body)
      })
    })
  },

  generateSignatureUrl (uri, query) {
    let urlObject = query.url
    let urlForSigning

    /* If a query is called */
    if ('query' in urlObject) {
      /*
      *| Generate a chain of all of the passed query arguments in the correct format.
      *| Example: key=val&key=val
      */
      let queryList = Object.entries(urlObject.query).reduce((result, [key, val]) => {
        /* If the query is being used, add it. */
        if (val.value !== null) {
          result.push(`${key}=${val.value}`)
        }
        return result
      }, [])

      /* Add each query that is called to the base uri */
      urlForSigning = `${uri}?${queryList.map(q => q).join('&')}`
    } else {
      /* If no queries are passed, set the url to the base uri */
      urlForSigning = uri
    }
    return urlForSigning
  },

  // Sign the string for the request
  sign (secret, data) {
    /* Initialize new RSA Key */
    const key = new NodeRSA()
    /* Convert secret to base64 buffer */
    key.importKey(Buffer.from(secret, 'base64'), 'pkcs8-private-der')

    /* get the pkcs8 base64 key */
    const privateKey = key.exportKey()

    /* Sign the key and convert back into base64 */
    return new NodeRSA(privateKey, {signingScheme: 'sha256'}).sign(data).toString('base64')
  },

  /* Make the request, and return the result. this.request returns a promise. */
  call (req, q) {
    return this.request(req, q)
  }
}

module.exports = Walmart
