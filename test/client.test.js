const keepmeup = require('../dist/index.js')
const { strictEqual, rejects, throws } = require('assert')
const { createServer } = require('https')
const { readFileSync } = require('fs')

const server = createServer(
  {
    key: readFileSync('./test/server.key'),
    cert: readFileSync('./test/server.cert')
  }
  , (req, res) => {
    if (req.method === 'POST') {
      let data = ''

      req.on('data', (chunk) => {
        data += chunk
      })

      req.on('end', () => {
        if (data === 'check=checkName&secret=secretString') {
          res.end('OK')
        } else {
          res.statusCode = 404
          res.statusMessage = 'Not found'
          res.end('Not found')
        }
      })
    } else {
      res.end('Everything works')
    }
  }
)

process.env.KEEPMEUP_HOST = 'localhost:8081'

describe('keepmeup client', function () {
  before(function (done) {
    server.listen(8081, done)
  })

  it('Correct call', async function () {
    const result = await keepmeup('checkName', 'secretString')
    strictEqual(result, true)
  })

  it('Wrong call', async function () {
    await rejects(() => keepmeup('checkWrongName', 'secretString'))
  })

  it('Correct call without secret', async function () {
    const result = await keepmeup('checkWrongName', undefined, false)
    strictEqual(result, undefined)
  })

  it('Incorrect call', function () {
    throws(keepmeup, { name: 'Error' })
    throws(() => keepmeup(null, null), { name: 'Error' })
    throws(() => keepmeup(1, 1), { name: 'Error' })
  })

  after(function (done) {
    server.close(done)
  })
})
