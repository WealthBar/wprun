# Webpack Runner

This provides a simple Node.js script to run webpacked files as Node scripts. This is particularly useful when paired with test runners like [tape](https://github.com/substack/tape).

## Basic Usage

```
# Run a single file as a script after passing it through webpack

wprun my-script.js

# Run a glob pattern of files after passing it through webpack

wprun **/*.test.js
```

## Options

- `-c` pass a webpack config files, by default it assumes `webpack.config.js` is available
- `-w` enable webpack's watch mode and re-runs the scripts when any files change
- `-r` require files or modules before the script(s) are run. This should be a comma separated list if more than one is required and will not be processed by webpack
- `-s` enable sourcemap support (enabled by default pass 'false' to this if you want to disable it)

## Example Use Case

The problem this was specifically created to solve was running tests on Vue single-file components with `tape`. Generally `vue-loader` is the best way to process `.vue` files which requires Webpack.

Despite being built for testing `wprun` is completely agnostic (aside from webpack) and simply passes the files you supply first through Webpack and then through the Node executable in a child process created with `execa`.



