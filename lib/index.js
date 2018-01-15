/**
 * Pon tasks to run mocha tests
 * @module pon-task-mocha
 * @version 1.0.2
 */

'use strict'

const define = require('./define')

let lib = define.bind(this)

Object.assign(lib, define, {
  define
})

module.exports = lib
