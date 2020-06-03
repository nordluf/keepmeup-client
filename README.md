# KeepMeUpBot NodeJS client

![](https://github.com/nordluf/keepmeup-client/workflows/Node%20CI/badge.svg)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![semantic-release](https://img.shields.io/badge/semver-semantic%20release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![NPM](https://nodei.co/npm/keepmeup-client.png)](https://nodei.co/npm/keepmeup-client/)

NodeJS client for sending checks via [@KeepMeUpBot](https://t.me/keepmeupbot) Telegram bot. 

Usage:
```javascript
import client from 'keepmeup-client'

await client('checkName', 'secretString')
await client('checkName', secretVariable, false) // to not throw if secret is not defined
```
