'use strict'

const WalmartRequest = {
  create (options) {
    this.api = Object.assign(options)
    return Object.assign(this)
  },
  set (params, method, additional) {
    this.params = params
    this.method = method
    if (additional.additionalPath !== undefined) {
      this.additional = additional.additionalPath
    }

    console.log(this)
  },
  query () {
    const self = this
    return new Promise((resolve, reject) => {
      resolve('test')
    })
  }
}

module.exports = WalmartRequest