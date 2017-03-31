'use strict'

const pon = require('pon')
const mocha = require('pon-task-mocha')

async function tryExample () {
  let run = pon({
    'test:mocha': mocha('test/**/*.js'),
    'test': [ 'test:mocha' ]
  })

  run('test')
}

tryExample()
