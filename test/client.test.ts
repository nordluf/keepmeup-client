import keepmeup from '../src/'
import { strictEqual, rejects, throws } from 'assert'

import { createServer } from 'https'
import { readFileSync } from 'fs'

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

beforeAll((done) => server.listen(8081, done))
test('Correct call', async () => {
  const result = await keepmeup('checkName', 'secretString')
  strictEqual(result, true)
})
test('Wrong call', async () => {
  await rejects(() => keepmeup('checkWrongName', 'secretString'))
})
test('Correct call without secret', async () => {
  const result = await keepmeup('checkWrongName', undefined, false)
  strictEqual(result, undefined)
})
test('Incorrect call', async () => {
  // @ts-ignore
  throws(keepmeup, { name: 'Error' })
  // @ts-ignore
  throws(() => keepmeup(null, null), { name: 'Error' })
  // @ts-ignore
  throws(() => keepmeup(1, 1), { name: 'Error' })
})
afterAll((done) => server.close(done))
