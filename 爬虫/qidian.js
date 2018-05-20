var request = require('sync-request')
var cheerio = require('cheerio')

// ES6 定义一个类
class Novel {
    constructor() {
        // 分别是电影名/评分/引言/排名/封面图片链接
        this.ranking = 0
        this.name = ''
        this.writer = ''
        // this.coverUrl = ''
    }
}

// 清洗数据的例子
var clean = (movie) => {
    var m = movie
    var o = {
        name: m.Name,
        score: Number(m.score),
        quote: m.quote,
        ranking: m.ranking,
        coverUrl: m.coverUrl,
        otherNames: m.otherNames,
    }
    return o
}

var log = console.log.bind(console)

var novelFromLi = (li) => {
    var e = cheerio.load(li)

    // 创建一个小说类的实例并且获取数据
    // 这些数据都是从 html 结构里面人工分析出来的
    var novel = new Novel()

    var novelName = e('.book-mid-info').find('h4').find('a').text()
    novel.name = novelName

    var novelRanking = e('.book-img-box').find('span').text()
    novel.ranking = Number(novelRanking)

    var novelWriter = e('.book-mid-info').find('.author').find('a').text()
    novel.writer = novelWriter
    // 网站数据格式问题，该数据跳过
    // var novel = e('.book-right-info').find('.total').find('span').text()
    // novel.ranking = Number(novel)

    return novel
}

var cachedUrl = (url) => {
    // 1. 确定缓存的文件名
    var cacheFile = 'cached_html/' + url.slice(-1) + '.html'
    // 2. 检查缓存文件是否存在
    // 如果存在就读取缓存文件
    // 如果不存在就下载并且写入缓存文件
    var fs = require('fs')
    var exists = fs.existsSync(cacheFile)
    if (exists) {
        var data = fs.readFileSync(cacheFile)
        return data
        // return fs.readFileSync(cacheFile)
    } else {
        // 用 GET 方法获取 url 链接的内容
        // 相当于你在浏览器地址栏输入 url 按回车后得到的 HTML 内容
        var r = request('GET', url)
        // utf-8 是网页文件的文本编码
        var body = r.getBody('utf-8')
        // 写入缓存
        fs.writeFileSync(cacheFile, body)
        return body
    }
}

var novelsFromUrl = (url) => {
    // 调用 cachedUrl 来获取 html 数据
    // 我们不关心这个函数怎么获取到 HTML, 只要知道它可以根据 url 返回我们想要的数据(HTML)就可以
    var body = cachedUrl(url)
    // cheerio.load 用来把 HTML 文本(字符串)解析为一个可以操作的 DOM(对象)
    var e = cheerio.load(body)

    log('url', url)
    // 一共有 20 个 li
    // var novelLis = e('.book-img-text').find('li')
    var novelLis = e('.book-img-text').find('ul').find('li')
    // 循环处理 20 个 li
    var novels = []
    for (var i = 0; i < novelLis.length; i++) {
        var li = novelLis[i]
        // 扔给 novelFromLi 函数来获取到一个 novel 对象
        var n = novelFromLi(li)
        novels.push(n)
    }
    return novels
}

var downloadCovers = (movies) => {
    // 使用 request 库来下载图片
    var request = require('request')
    var fs = require('fs')
    for (var i = 0; i < movies.length; i++) {
        var m = movies[i]
        var url = m.coverUrl
        // 保存图片的路径
        var path = 'covers/' + m.name.split('/')[0] + '.jpg'
        // 下载并且保存图片的套路
        request(url).pipe(fs.createWriteStream(path))
    }
}

var saveNovel = (novels) => {
    // JSON.stringify 第 2 3 个参数配合起来是为了让生成的 json
    // 数据带有缩进的格式，第三个参数表示缩进的空格数
    // 建议当套路来用
    // 如果你一定想要知道原理，看下面的链接（不建议看）
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
    var s = JSON.stringify(novels, null, 2)
    // 把 json 格式字符串写入到 文件 中
    var fs = require('fs')
    var path = 'qidian.json'
    fs.writeFileSync(path, s)
}


var __main = () => {
    // 主函数
    var novels = []
    for (var i = 0; i < 3; i++) {
        var start = i + 1
        var url = `https://www.qidian.com/rank/collect?style=1&page=${start}`
        var novelsInPage = novelsFromUrl(url)
        // 注意这个是 ES6 的语法
        novels = [...novels, ...novelsInPage]
        // 常规语法
        // movies = movies.concat(moviesInPage)
    }
    saveNovel(novels)
}
__main()
