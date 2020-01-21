/**
 * Test case for define.
 * Runs with mocha.
 */
'use strict'

const define = require('../lib/define.js')
const ponContext = require('pon-context')
const { strict: { ok } } = require('assert')

describe('define', function () {
  this.timeout(3000)

  it('Define', async () => {
    const ctx = ponContext()
    const task = define(`${__dirname}/../misc/mocks/*-test.js`, {})
    ok(task)

    await Promise.resolve(task(ctx))
  })

  it('Test to fail', async () => {
    const ctx = ponContext()
    const task = define(`${__dirname}/../misc/mocks/*-test-to-fail.js`, {})
    ok(task)
    const caught = await Promise.resolve(task(ctx))
      .then(() => null)
      .catch((e) => e)
    ok(!!caught)
  })
})

/* global describe, before, after, it */
