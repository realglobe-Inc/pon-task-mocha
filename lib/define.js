/**
 * Define task
 * @function define
 * @param {string|string[]} - Source file name pattern
 * @param {Object} [options={}] - Optional settings
 * @param {string} [options.reporter='spec'] - Mocha reporter
 * @param {number} [options.timeout=3000] - Mocha test timeout
 * @param {string|string[]} - Test source filename (Used as watch target)
 * @returns {function} Defined task
 */
'use strict'

const co = require('co')
const aglob = require('aglob')
const path = require('path')
const Mocha = require('mocha')
const watch = require('pon-task-watch')

/** @lends define */
function define (pattern = 'test/**/*.js', options = {}) {
  let {
    reporter = 'spec',
    timeout = 3000,
    src = []
  } = options

  const doTest = (filenames, ctx) => co(function * () {
    let cwd = process.cwd()
    const mocha = new Mocha({
      reporter,
      timeout
    })
    for (let filename of filenames) {
      mocha.addFile(path.resolve(cwd, filename))
    }
    return yield new Promise((resolve) =>
      mocha.run((failures) => resolve(failures))
    )
  })

  function task (ctx) {
    let { cwd = process.cwd() } = ctx
    return co(function * () {
      let filenames = yield aglob(pattern, { cwd })
      let failures = yield doTest(filenames, ctx)
      process.on('exit', () => process.exit(failures))
      return failures
    })
  }

  return Object.assign(task,
    // Define sub tasks here
    {
      watch: (ctx) => co(function * () {
        let { cwd = process.cwd() } = ctx
        return watch(
          [].concat([].concat(pattern, src)).map((pattern) => path.join(cwd, pattern)),
          (event, filename) => doTest([ filename ], ctx)
        )(ctx)
      })
    }
  )
}

module.exports = define


