'use strict'

const WalmartRequest = {
  create (options) {
    this.api = Object.assign(options)
    return Object.assign(this)
  },
  set (params, method) {
    this.params = params
    this.method = method
  },
  query () {
    const self = this
    return new Promise((resolve, reject) => {
      resolve('test')
    })
  }
}

module.exports = WalmartRequest