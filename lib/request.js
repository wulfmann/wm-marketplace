'use strict'

const xsd = require('./xsd/xsd.js')

const WalmartRequest = {
  create (options) {
    this.api = Object.assign(options)
    return Object.assign(this)
  },
  set (requestOptions) {
    this.additional = requestOptions.additional
    this.params = requestOptions.params
    this.method = requestOptions.method
      
    if (requestOptions.xsd !== undefined) {
      const template = requestOptions.xsd
      const selectedTemplate = xsd[template.file][template.function]
      const args = Object.values(this.params).map(p => p.value)
      this.body = selectedTemplate(args)
    }
  },
  query () {
    const self = this
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
}

module.exports = WalmartRequest