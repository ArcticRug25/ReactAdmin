const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        proxy('/api1', {
            target: 'http://zlx.cool:5000',
            changeOrigin: true,
            pathRewrite: {
                '^/api1': ''
            }
        }),
        proxy('/api2',{
			target:'http://api.map.baidu.com/weather/v1/',
			changeOrigin:true,
			pathRewrite:{'^/api2':''}
		}),
    )
}