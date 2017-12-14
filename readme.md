# wm-marketplace

This is a simple sdk to use when interacting with the [Walmart Marketplace API][apiDocs]
Under a lot of work right now and is not safe to use in production. PR's welcome.

Promise based and uses many es6 features so you will need to either use a babel step or use a node version >4

[![forthebadge](http://forthebadge.com/badges/no-ragrets.svg)](http://forthebadge.com)

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
```

Usage:

```js
wmc.Inventory.GetInventory({
  sku: 'your-sku'
})
.then((result) => {
  // API Response
})
```

## Roadmap
* Update the host to accept countries other than the US
* Finish adding all of the endpoints
* Add in throttling / pagification
* Add File upload

# Available Endpoints (updated as more are added)

## Orders: ([Walmart Documentation][walmart-orders])

### GetAllReleased ([Walmart Documentation][walmart-orders-getallrealeased])

Available Parameters:
* limit: string. Restrictions: Less than 200
* createdStartDate: string. Available formats: [UTC date, timestamp]

Usage:
```js
mws.Orders.GetAllReleased({
  // Your parameters
})
```

### GetAll ([Walmart Documentation][walmart-orders-getall])

Available Parameters:
* sku: string
* customerOrderId: string
* purchaseOrderId: string
* status: string. Available Statuses: [Created, Acknowledged, Shipped, Canceled]
* createdStartDate: string. Available formats: [UTC date, timestamp]
* toExpectedShipDate: string. Format: YYYY-MM-DD
* limit: string. Restrictions: Less than 200

Usage:
```js
mws.Orders.GetAll({
  // Your parameters
})
```

### GetAnOrder ([Walmart Documentation][walmart-orders-getorder])

Available Parameters:
* sku: string
* customerOrderId: string
* purchaseOrderId: string
* status: string. Available Statuses: [Created, Acknowledged, Shipped, Canceled]
* createdStartDate: string. Available formats: [UTC date, timestamp]
* toExpectedShipDate: string. Format: YYYY-MM-DD
* limit: string. Restrictions: Less than 200

Usage:
```js
mws.Orders.GetAnOrder({
  // Your parameters
})
```

## Inventory ([Walmart Documentation][walmart-inventory])

### GetInventory ([Walmart Documentation][walmart-inventory-get])

Available Parameters:
* sku: string

Usage:
```js
mws.Inventory.GetInventory({
  // Your parameters
})
```

## Prices ([Walmart Documentation][walmart-prices])

### ItemPrice ([Walmart Documentation][walmart-prices-item])

Endpoint to update an individual sku's price.

Available Parameters:
* sku: string. Required
* price: string. Required

Usage:
```js
mws.Prices.ItemPrice({
  // your parameters
})
```

## Reports ([Walmart Documentation][walmart-reports])

Reports has a single endpoint, that can generate different types of reports based on the url query.

Available Parameters:
* type: string

Available Queries:
* item
* buyBox
* cpa

Usage:
```js
mws.Reports.GetReport({
  type: 'item'
})
```

[apiDocs]: https://developer.walmart.com/#/apicenter/marketPlace/latest
[credentials]: https://seller.walmart.com/api-key

[walmart-orders]: https://developer.walmart.com/#/apicenter/marketPlace/latest#orderManagement
[walmart-orders-getallrealeased]: https://developer.walmart.com/#/apicenter/marketPlace/latest#getAllReleasedOrders
[walmart-orders-getall]: https://developer.walmart.com/#/apicenter/marketPlace/latest#getAllOrders
[walmart-orders-getorder]: https://developer.walmart.com/#/apicenter/marketPlace/latest#getAnOrder

[walmart-inventory]: https://developer.walmart.com/#/apicenter/marketPlace/latest#inventoryManagement
[walmart-inventory-get]: https://developer.walmart.com/#/apicenter/marketPlace/latest#getInventoryForAnItem

[walmart-prices]: https://developer.walmart.com/#/apicenter/marketPlace/latest#priceManagement
[walmart-prices-get]: https://developer.walmart.com/#/apicenter/marketPlace/latest#updateAPrice

[walmart-reports]: https://developer.walmart.com/#/apicenter/marketPlace/latest#getReport