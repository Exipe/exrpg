
module.exports = {

    mode: "development",

    devtool: "source-map",

    target: "electron-renderer",

    output: {
        path: __dirname + "/dev",
        filename: 'script.js'
    },

    resolve: {
        extensions: [".js", ".ts", ".tsx"]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            }
        ]
    },

    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "redux": "Redux",
        "react-redux": "ReactRedux"
    }

}