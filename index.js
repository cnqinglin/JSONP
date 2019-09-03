var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var path = request.url
    var query = ''
    if (path.indexOf('?') >= 0) {
        query = path.substring(path.indexOf('?'))
    }
    var pathNoQuery = parsedUrl.pathname
    var queryObject = parsedUrl.query
    var method = request.method

    /*******  从这里开始看，上面不要看 *******/
    /****服务器返回的javascript方法 SRJ(server rendered javascript )*****/
    if (path === '/') { //如果用户请求的是 / 路径
        var string = fs.readFileSync('./index.html', 'utf8')
        //通过读db.xxxx文件
        var amount = fs.readFileSync('./db', 'utf8') //db的值为100，类型为string
        //把db.xxxx文件中的数据放进来
        string = string.replace('&&&amount&&&', amount)
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(string)
        response.end()
    } else if (path === '/style.css') {
        var string = fs.readFileSync('./style.css', 'utf8')
        response.setHeader('Content-Type', 'text/css')
        response.write(string)
        response.end()
    } else if (path === '/main.js') {
        var string = fs.readFileSync('./main.js', 'utf8')
        response.setHeader('Content-Type', 'application/javascript')
        response.write(string)
        response.end()
    } else if (path === '/pay') {
        //如果浏览器发起的请求成功了，服务器返回javascript响应
        var amount = fs.readFileSync('./db', 'utf8') //db的值为100，类型为string
        var newAmount = amount - 1
        fs.writeFileSync('./db', newAmount)
        response.setHeader('Content-Type', 'application/javascript')
        response.statusCode = 200
        //响应内容就是操作页面局部刷新,括号里的代码会被当作js执行是基于http协议
        response.write(`
        ${jQuery.callback}.call(undefined,'success')
        `)
        response.end()
    } else {
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write('找不到对应的路径,你需要自行修改路径 index.js')
        response.end()
    }


    /******* 代码结束，下面不要看*******/
    console.log(method + ' ' + request.url)
})


server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)