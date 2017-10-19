#!/usr/bin/env node

const redbird = require('redbird')
const argv = require('minimist')(process.argv.slice(2))
const pathHelper = require('path')
const pem = require('pem')
const fs = require('fs')
const temp = require('temp')

temp.track()

const defaultOptions = {
  p: 3000,
  q: 3001,
  r: 3002,
  h: 'localhost',
  i: 'localhost',
}

pem.createCertificate({ days: 100, selfSigned: true }, (err, keys) => {
  if (err) {
    throw err
  }
  const certFile = temp.openSync('ssl-proxy.cert')
  const keyFile = temp.openSync('ssl-proxy.key')
  fs.writeFileSync(certFile.path, keys.certificate, {
    encoding: 'utf8',
    flag: 'w',
  })
  fs.writeFileSync(keyFile.path, keys.serviceKey, {
    encoding: 'utf8',
    flag: 'w',
  })

  const options = Object.assign({}, defaultOptions, argv)
  proxy = redbird({
    port: options.r,
    ssl: {
      port: options.p,
      key: pathHelper.resolve(keyFile.path),
      cert: pathHelper.resolve(certFile.path),
    },
  })

  // Since we will only have one https host, we dont need to specify additional certificates.
  proxy.register(options.h, `http://${options.i}:${options.q}`, { ssl: true })
})
