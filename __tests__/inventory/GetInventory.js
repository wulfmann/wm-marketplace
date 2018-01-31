jest.mock('../inventory/GetInventory')

// Initialize
const WMClient = require('../../lib/client.js')

const wmc = WMClient.Client({
    consumerId: 'consumerid',
    privateKey: 'privatekey',
    correlationId: 'your-correlation-id',
    channelType: 'your-channel-type'
})

describe('wmc', () => {
    it('should allow an inventory get for sku', async () => {
        const data = await wmc.Inventory.GetInventory({ sku: 'mysku' })
        expect(data).toBeDefined()
        expect(data.quantity.amount).toEqual(5)
    })
})
