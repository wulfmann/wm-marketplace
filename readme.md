# wm-marketplace

This is a simple sdk to use when interacting with the [Walmart mMrketplace API][apiDocs]
Under a lot of work right now and is not safe to use in production. PR's welcome.

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
  sku: 'yourSku'
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


[apiDocs]: https://developer.walmart.com/#/apicenter/marketPlace/latest
[credentials]: https://seller.walmart.com/api-key