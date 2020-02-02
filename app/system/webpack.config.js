var assets = __dirname + "/../assets";

module.exports = [

    {
        entry: {
            "vue": "./app/vue"
        },
        output: {
            filename: "./app/bundle/[name].js"
        },
        module: {
            loaders: [
                { test: /\.vue$/, loader: "vue" },
                { test: /\.json$/, loader: "json" },
                { test: /\.html$/, loader: "vue-html" }
            ]
        }
    }

];
