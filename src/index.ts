import { request } from 'https'

export default function (check: string, secret: string) {
  if ((check?.length ?? 0) < 2 || (secret?.length ?? 0) < 2) {
    throw new Error('Wrong usage, incorrect set of parameters.')
  }

  const [host, port = '443'] = (process.env.KEEPMEUP_HOST ?? 'keepmeup.gth.wtf').split(':')
  const postData = `check=${check}&secret=${secret}`
  const options = {
    protocol: 'https:',
    host,
    port,
    path: '/check',
    method: 'POST',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  return new Promise((resolve, reject) => {
    const req = request(options, (res) => {
      let str = ''
      res.on('data', (chunk) => {
        str += chunk
      }).on('end', () => {
        if (str === 'OK' && res.statusCode === 200) {
          resolve(true)
        } else {
          reject(new Error(`HTTP${res.statusCode}: ${str}`))
        }
      })
    }).on('error', (err) => {
      console.error(`Error happened while sending keepmeup.gth.wtf check: ${err.message}`)
      reject(err.message)
    })
    req.write(postData)
    req.end()
  })
}
