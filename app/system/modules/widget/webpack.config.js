module.exports = [

    {
        entry: {
            "widgets": "./app/widgets",
            "edit": "./app/views/edit",
            "index": "./app/views/index"
        },
        output: {
            filename: "./app/bundle/[name].js"
        }
    }

];
