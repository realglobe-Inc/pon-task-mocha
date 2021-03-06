
'use strict'

const aglob = require('aglob')
const path = require('path')
const watch = require('pon-task-watch')

/**
 * Define task
 * @function define
 * @param {string|string[]} pattern - Source file name pattern
 * @param {Object} [options={}] - Optional settings
 * @param {string} [options.reporter='spec'] - Mocha reporter
 * @param {number} [options.timeout=3000] - Mocha test timeout
 * @returns {function} Defined task
 */
function define (pattern = 'test/**/*.js', options = {}) {
  const {
    reporter = 'spec',
    timeout = 3000,
    src = [],
  } = options

  const doTest = async (filenames, ctx) => {
    const Mocha = require('mocha')
    const cwd = process.cwd()
    const mocha = new Mocha({
      reporter,
      timeout,
    })
    for (const filename of filenames) {
      mocha.addFile(path.resolve(cwd, filename))
    }
    return new Promise((resolve) =>
      mocha.run((failures) => {
        resolve(failures)
      })
    )
  }

  async function task (ctx) {
    const {cwd = process.cwd()} = ctx
    const filenames = await aglob(pattern, {cwd})
    const failures = await doTest(filenames, ctx)
    console.log(failures)
    if(failures !== 0){
      process.exitCode = failures
      throw new Error(`Test failed`)
    }
  }

  return Object.assign(task,
    // Define sub tasks here
    {
      watch: async (ctx) => {
        const {cwd = process.cwd()} = ctx
        return watch(
          [].concat([].concat(pattern, src)).map((pattern) => path.join(cwd, pattern)),
          (event, filename) => doTest([filename], ctx)
        )(ctx)
      }
    }
  )
}

module.exports = define


