/* eslint-disable */

const webpack = require('webpack');
const execa = require('execa');

function logErrorsAndWarnings(err, stats) {
  if (err) {
    console.error(err.stack || err);
    if (err.details) console.error(err.details);
    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) info.errors.forEach(e => console.error(e));

  if (stats.hasWarnings()) info.warnings.forEach(w => console.warn(w))
}

function FileRunner(exec, require) {
  let lastHash = null;
  return function runner(err, stats) {
    logErrorsAndWarnings(err, stats);

    // Don't execute if there are errors
    if (err || stats.hasErrors()) {
      lastHash = null;
      return;
    }

    // Don't execute if the bundle has not changed
    if (lastHash === stats.hash) return;
    lastHash = stats.hash;

    const file = stats.compilation.assets['main.js'].existsAt;
    const opts = { stdio: 'inherit' };
    const args = [];
    require.forEach((r) => {
      args.push('-r');
      args.push(r);
    });
    args.push(file);

    // Log status message to stderr to avoid polluting stdout
    console.warn(" ");
    console.warn("Bundle compiled, executing...");

    execa(exec, args, opts).catch(() => { });
  };
}

module.exports = function compile(exec, config, watch = false, require = []) {
  const compiler = webpack(config);
  const runner = new FileRunner(exec, require);
  if (watch) {
    compiler.watch({}, runner);
  } else {
    compiler.run(runner);
  }
};
