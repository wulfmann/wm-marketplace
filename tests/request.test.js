const request = require('../lib/request.js')

const options = {one: 1}
const req = request.create(options)

test('passed options are set to the api key on the request object', () => {
  expect(req.api).toEqual({ one: 1})
})

test('passed options are set to the url key and merged with default request settings', () => {
  const reqSettings = {
    path: ''
  }

  const setOptions = {
    method: 'GET',
    contentType: 'application/xml'
  }

  const expected = Object.assign({}, reqSettings, setOptions)
  request.set(setOptions)
  expect(req.url).toEqual(expected)
})