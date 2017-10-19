#!/usr/bin/env node

const redbird = require('redbird')
const argv = require('minimist')(process.argv.slice(2))
const pathHelper = require('path')
const pem = require('pem')
const fs = require('fs')

const defaultOptions = {
  p: 3000,
  q: 3001,
  h: 'localhost',
  i: 'localhost',
}

pem.createCertificate({ days: 100, selfSigned: true }, (err, keys) => {
  if (err) {
    throw err
  }
  fs.writeFileSync('__cert', keys.certificate, { encoding: 'utf8', flag: 'w' })
  fs.writeFileSync('__key', keys.serviceKey, { encoding: 'utf8', flag: 'w' })

  const options = Object.assign({}, defaultOptions, argv)
  proxy = redbird({
    ssl: {
      port: options.p,
      key: pathHelper.resolve('__key'),
      cert: pathHelper.resolve('__cert'),
    },
  })

  // Since we will only have one https host, we dont need to specify additional certificates.
  proxy.register(options.h, `http://${options.i}:${options.q}`, { ssl: true })
})
