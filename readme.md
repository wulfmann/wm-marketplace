# wm-marketplace

This is a simple sdk to use when interacting with the [Walmart Marketplace API][apiDocs]
Under a lot of work right now and is not safe to use in production. PR's welcome.

Promise based and uses many es6 features so you will need to either use a babel step or a version of node > 6

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

## Examples

Installation:

```js
npm i mws-marketplace -S
```

Initialization:

You will need your api credentials from walmart which can be gotten [here][credentials]
The walmart docs don't really say much on this, but your correlation id is any arbitrary string.
Channel type will appear beneath your consumer and private keys.

```js
const WMClient = require('wm-marketplace')
const wmc = WMClient({
  consumerId: 'your-consumer-id',
  privateKey: 'your-private-key',
  correlationId: 'your-correlation-id',
  channelType: 'your-channel-type'
})

## Currently Available Endpoints

### Inventory
GetInventory
UpdateInventory

### Items
GetAll
GetItem

### Orders
GetAllReleased
GetAll
GetOrder

### Prices
ItemPrice

### Reports
GetReport

[apiDocs]: https://developer.walmart.com/#/apicenter/marketPlace/latest
[credentials]: https://seller.walmart.com/api-key