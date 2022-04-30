module.exports = {
    pwa: {
        manifestOptions: {
            "theme_color": "#2169F6",
            "background_color": "#2169F6",
            "display": "standalone",
            "scope": "/",
            "start_url": "/",
            "name": "Interactive Map - Embed",
            "short_name": "Interactive Map",
            "icons": [
                {
                    "src": "/img/icons/icon-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "/img/icons/icon-256x256.png",
                    "sizes": "256x256",
                    "type": "image/png"
                },
                {
                    "src": "/img/icons/icon-384x384.png",
                    "sizes": "384x384",
                    "type": "image/png"
                },
                {
                    "src": "/img/icons/icon-512x512.png",
                    "sizes": "512x512",
                    "type": "image/png"
                }
            ]
        },
      
        themeColor: "#2169F6",
        msTileColor: "#2169F6",
        appleMobileWebAppCapable: "yes",
        appleMobileWebAppStatusBarStyle: "black",

        // configure the workbox plugin
        //workboxPluginMode: 'InjectManifest',
        /*workboxOptions: {
            //swSrc: 'dev/sw.js',
        }*/

    },
    configureWebpack:{
        performance: {
            hints: false,
            maxEntrypointSize: 1000000,
            maxAssetSize: 1000000
        }
    },
    lintOnSave: false,
    chainWebpack: (config) => {
        if (process.env.NODE_ENV === 'test') {
            const scssRule = config.module.rule('scss');
            scssRule.uses.clear();
            scssRule.use('null-loader').loader('null-loader');
        }
    },
    productionSourceMap: false
}
