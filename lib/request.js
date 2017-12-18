'use strict'

const WalmartRequest = {
  settings: {
    path: ''
  },

  create (options) {
    this.api = options
    return Object.assign(this)
  },

  set (requestOptions) {
    this.url = Object.assign(this.settings, requestOptions)
    
    /*
    ** Check if the route has an xsd template defined.
    ** If it does, use the provided keys to access the template.
    ** Each 'template' is a function that returns a string in the
    ** required xml format.
    */

    if ('xsd' in requestOptions) {
      const xsd = require('./xsd/xsd.js')
      const template = requestOptions.xsd
      const selectedTemplate = xsd[template.file][template.function]
      const args = Object.assign({}, this.url.query, this.url.params)
      const xml = selectedTemplate(args)
      this.url.body = xml
    }
  },

  query () {
    return new Promise((resolve, reject) => {
      resolve(this)
    })
  }
}

module.exports = WalmartRequest