

// 作业 1
// 实现播放器的基本界面(不要求 css, 只写 html 即可)
//     0, 页面中添加一个 audio 标签, 设置一个 音乐文件（最好取名 1.mp3）
//     1, 页面中添加 2 个按钮分别是(播放 暂停)
//     2, 给 2 个按钮分别绑定上播放和暂停 audio 的事件
// a.play()
// a.pause()
// a.autoplay
// a.src
// a.volume
// a.duration
// a.currentTime = 1
// a.playbackRate
var playSong = function(target, audio) {
    // 默认停止播放歌曲
    // 点击切换开关歌曲
    var isOn = target.classList.toggle('button-play')
    log('isOn', isOn)
    if (isOn) {
        audio.play()
        // 文字切换为 停止
        target.src = 'off.png'
        log('播放歌曲:', audio.dataset.index)
    } else {
        audio.pause()
        // 文字切换为 播放
        target.src = 'on.png'
        log('停止歌曲:', audio.dataset.index)

    }
}

var regain = function() {
    var audio = e('#id-audio-player')
    var actions = e('.div-audio-actions')
    // 播放按钮改变，停止播放歌曲
    var on = actions.querySelector('.audio-on-off')
    audio.pause()
    if (on.classList.contains('button-play')) {
        on.classList.remove('button-play')
    }
    on.src = 'on.png'
}

var switchSong = function(event) {
    // 恢复原状态
    regain()
    var audio = e('#id-audio-player')
    var actions = e('.div-audio-actions')
    // 获取上/下一首歌的下标
    var currentIndex = Number(audio.dataset.index)
    var totalSong = Number(audio.dataset.songs)
    var offset = Number(event.dataset.offset)
    var nextIndex = (totalSong + currentIndex + offset) % totalSong
    // 切换歌曲
    // 改变 audio 的 src，改变当前歌曲下标
    audio.src = `${nextIndex}.mp3`
    audio.dataset.index = nextIndex
}

var chooseLoop = function(event) {
    if (event.classList.contains('single-loop')) {
        log('singleLoop')
        singleLoop()
    } else if (event.classList.contains('list-loop')) {
        log('listLoop')
        listLoop()
    } else if (event.classList.contains('random-loop')) {
        log('randomLoop')
        randomLoop()
    }
}

var bindEventBts = function() {
    var audio = e('#id-audio-player')
    var actions = e('.div-audio-actions')
    actions.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('audio-on-off')) {
            // 1 绑定点击事件，点击播放歌曲，切换文字
            playSong(self, audio)
        } else if (self.classList.contains('audio-switch')) {
            // 2 上/下一首歌曲切换
            switchSong(self)
        } else if (self.classList.contains('loop')) {
            // 循环播放歌曲：单曲循环 列表循环 随机循环
            log('click loop style')
            // 清除所有循环歌曲上操作？待完成
            chooseLoop(self)
        }
    })

}

// 作业 2
// 加入当前时间和总时间显示
//     0, 页面中添加 2 个 span 标签分别用来显示当前时间和总时间
//     1, 总时间根据上课资料很好得到
//     2, 当前时间是一个动态变化的数据, 最简单的方式是设置一个 setInterval 定时器
//         来定时(比如 1s)把 audio 的 currentTime 更新到界面中
//

var appendTime = function() {
    var p = document.querySelector('#id-audio-player')
    // 由于音频加载需要时间，因此需要绑定 canplay 事件判断是否完成加载，否则 输出 NaN
    p.addEventListener('canplay', function(){
        // *** 获取总时间
        var tTime = Math.ceil(p.duration)
        // 插入到页面中
        var t = e('.span-total')
        t.innerHTML = `${tTime}`

        // *** 获取当前时间
        // 定时器获取动态时间
        // 并把获取到的动态时间插入到页面中
        var clockId = setInterval(function(){
            var cTime = Math.ceil(p.currentTime)
            var s = e(".span-current")
            s.innerHTML = `${cTime}`
        }, 1000)

        // 消除定时器
        // clearInterval(clockId)
    })
}

// 作业 3
// 实现播放列表
//     0, 在目录中放 3 首歌 1.mp3 2.mp3 3.mp3
//     1, 界面中显示 3 个 div, 在 data-path 属性中 存储 1.mp3 这样的文件名
//     2, 给 3 个 div 绑定 click 事件, 在点击的时候切换 audio 的 src 属性
//     3, 需要注意的是, 你切换 audio.src 后调用 audio.play() 是无效的
//         因为浏览器需要一定的时间加载音乐文件, 你必须等待加载完成后才能播放
//         audio 标签有一个 canplay 事件, 会在加载结束后触发
//         在这个事件中调用播放函数即可解决问题

var bindEventSong = function() {
    var audio = e('#id-audio-player')
    bindAll('.div-song', 'click', function(event){
        regain()
        var self = event.target
        var path = Number(self.dataset.path)
        // 改变 player 的src，达到切换歌曲的功能
        // 当歌曲加载完后，调用bindEventBts()
        audio.src = `${path}.mp3`
        audio.dataset.index = path
        // audio.addEventListener('canplay',function(){
        // })
    })
}

// 作业 4
// 实现单曲循环播放
//     0, audio 标签有一个 ended 事件, 会在播放结束后触发
//         用这个事件实现播放结束自动播放当前这首
//         (注意, 这里并不是使用 loop 属性实现的)

var singleLoop = function() {
    // 绑定 audio 标签，ended事件
    // 自动循环播放当前这首
    var a = e('#id-audio-player')
    a.addEventListener('ended', function(event){
        a.currentTime = 0
        a.play()
    })
}

// 作业 5
// 实现循环播放列表
//     0, 用一个数组存储所有的音乐路径
//     1, audio 标签有一个 ended 事件, 会在播放结束后触发
//         用这个事件实现播放结束自动播放下一首
var listLoop = function() {
    var audio = e('#id-audio-player')
    // 绑定ended事件，结束时触发播放下一首
    audio.addEventListener('ended', function(event){
        var self = event.target
        // 获取上/下一首歌的下标
        var currentIndex = Number(audio.dataset.index)
        var totalSong = Number(audio.dataset.songs)
        var nextIndex = (currentIndex + 1) % totalSong
        // 切换下一首歌
        // 改变 audio 的 src，改变当前歌曲下标
        audio.src = `${nextIndex}.mp3`
        audio.dataset.index = nextIndex
        audio.play()
    })
}

// 作业 6
// 实现随机播放
//     0, 用一个数组存储所有的音乐路径
//     1, audio 标签有一个 ended 事件, 会在播放结束后触发
//         用这个事件实现播放结束自动播放一首歌(这首歌是从数组中随机选择的, 不需要考虑随机的还是当前这首歌的情况)
//
//     提示: 实现一个 choice 函数，随机返回数组中的一个元素
//     var choice = function(array) {
//         // 1. 得到  0 - 1 之间的小数 a
//         // 2. 把 a 转成 0 - array.length 之间的小数
//         // 3. 得到 0 - array.length - 1 之间的整数作为下标
//         // 4. 得到 array 中的随机元素
//     }
var random = function(audio) {
    var len = Number(audio.dataset.songs)
    var n = Math.random()
    var r = Math.floor(len * n)
    log('随机 r： ', r)
    return r
}

var randomLoop = function() {
    var audio = e('#id-audio-player')
    // 随机生成数字，确认随机播放的歌
    var r = random(audio)

    // 绑定ended事件，结束时触发随机播放下一首
    audio.addEventListener('ended', function(){
        var nextIndex = r
        // 改变 audio 的 src值
        audio.src = `${r}.mp3`
        audio.dataset.index = nextIndex
        audio.play()
        log('audio', audio)
    })
}

var __main = function() {
    // 显示歌曲当前时间和总时间
    appendTime()
    // 暂停/播放
    bindEventBts()
    bindEventSong()

}
__main()
// 1 播放暂停功能
//     绑定点击事件
// 2 上/下一首歌曲切换
// 3 单曲循环
// 4 顺序播放
// 5 随机播放
// 6 当前时间和总时间

// **** 进度 ****

// 问题：一首歌结束后，点击播放需要点击两次才能成功播放歌曲
// 原因：一首歌结束时，其还是有button-play 类名，当点击时，删除类名，再次点击时才能播放
// 解决方案：歌曲结束时，清除该类名
// 理清多事件之间的关系，是否有冲突，有冲突如何解决
//
// 1 进度条
// 3 单曲循环 随机 顺序 ，页面插入button，绑定事件
// 2 图标选择，css 样式，主图选择
// 4 拆分函数
// 5 整理整个流程
