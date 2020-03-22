const { merge }           = require('lodash');
const { sync }            = require('glob');
const path                = require('path');
const { VueLoaderPlugin } = require('vue-loader');

const build = (mode, dir, config) => {
    return merge({
        mode: mode,
        context: dir,
        output: {
            path: dir
        },
        externals: {
            'vue': 'Vue',
            'uikit': 'Uikit'
        },
        module: {
            rules: [
                { test: /\.vue$/, use: 'vue-loader' },
                { test: /\.js$/,  exclude: [/node_modules/, /assets/, /vendor/],  use: ['babel-loader']}
            ]
        },
        plugins: [
            new VueLoaderPlugin()
        ]
    }, config);
};

const buildExports = (env, argv) => {
    let mode = argv.mode || 'development';
    console.log('Mode:', mode);
    let exports = [];
    // Original string for sync: '{app/modules/**,app/installer/**,app/system/**,packages/**}/webpack.config.js'
    sync('{app/system/,app/system/modules/dashboard/**,app/system/modules/user/**,app/system/modules/settings/**,app/system/modules/mail/**,app/system/modules/cache/**}webpack.config.js', {ignore: 'packages/**/node_modules/**'}).forEach(file => {
        let dir = path.join(__dirname, path.dirname(file));
        exports = exports.concat(require('./' + file).map(config => build(mode, dir, config)));
    });
    return exports;
}

module.exports = buildExports;
