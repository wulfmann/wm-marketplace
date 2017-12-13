'use strict'

//module.exports = require('./lib/client')
const Walmart = require('./lib/client')

const credentials = {
  privateKey: 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALJf+EBPoWW3KtmcrMjpHdDw9cVyKncmzqaRmG0+2iOag2jQOliIIKiCG2oVv0g98L/ulwCfQjN0RluFtrV4PVf01Aot6G47KP35sEbzzmaJYk2aVUzDhMYlYQWIh8Y1a+kElvI4wxXGy+TGW6C14cb1/RFAPwzJgVoMJFXUN8SNAgMBAAECgYEAk73dlxbdrav69+dHTdmX8pnCV1nqRmqEO37Ya5PlhhvSwBvIV8/YjPnGzyVYG/QB1lc+Byvh31BtfhzQapo+45fUxz2+bO51odn+rWPDGuFY8JFQ/IeEjc6qDiH1Ch92qsB9aY0HY/zwByfn1QZq82lak2xlDW+yLT6fm+X7o9kCQQD1yut0NuHgCPNDCckTub/MRBYK1TsMk/JC51oZ0chpE8O9utznPCGDphKAQz/l1i81Ch21cOYOLHgFyP60ig+bAkEAuchQygW1dRlORzwDpBu2iRwOtVguWTUmAVtl3D3mYpO6W2ln9icbyCHxvXIovKcaSOojUj9WupQtmfn85aKC9wJAcQfiA02Bzf8Pr1J+r52KACuHX2/zebNHg1DU9G6ulPPL3iJil8vlNZ9XfrhuWAmJKAEA7IGAqh/1CeQGjYu35QJALeUcgCvU3e64dcSPqbTm7QwvXgFAweztTJyFl1j7VxLjkL2DXz3eERzBmWlgQuqNBcJBo4neJQ2CDm3BWgFBlQJBAOnLnNl7OWIOzxw8wV+uAW34YIp7SR6sv0CDhP1Y9xeBicoyDWBVYe5duU9noFZvtuvqSsTFVKX7wYC4gOrFRp0',
  consumerId: '9f80c0a1-090d-4316-92e0-c83138278812',
  correlationId: 'fineartstoreCorrelation',
  channelType: '0f3e4dd4-0514-4346-b39d-af0e00ea066d'
}

const wmc = Walmart.Client(credentials)

wmc.Orders.GetAll({
  createdStartDate: '2017-12-10'
})
.then((response) => {
  console.log(response)
})
.catch((err) => {
  console.error(err)
})