var log = console.log.bind(console)

var e = function(selector) {
    var element = document.querySelector(selector)
    if (element == null) {
        var s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return element
    }
}

var es = function(selector) {
    var elements = document.querySelectorAll(selector)
    if (elements.length == 0) {
        var s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return elements
    }
}

var bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

var bindAll = function(selector, eventName, callback) {
    var elements = es(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

var removeClassAll = function(className) {
    var selector = '.' + className
    var elements = es(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        // log('classname', className, e)
        e.classList.remove(className)
    }
}

// *** 切换图片
var showImg = function(currentIndex) {
    var index = currentIndex
    var className2 = 'active'
    // 删除拥有 dot-white 类元素的该类名
    removeClassAll(className2)
    // 获取需要切换的元素
    var imgSelector = '#id-img-' + index
    // 添加 dot-white
    img = e(imgSelector)
    img.classList.add(className2)
}

// *** 切换小圆点
var toggleIndi = function(currentIndex) {
    var index = currentIndex
    // 删除拥有 dot-white 类元素的该类名
    var className1 = 'dot-white'
    removeClassAll(className1)
    // 获取需要切换的元素
    var indiSelector = '#id-indi-' + index
    // 添加 dot-white
    indi = e(indiSelector)
    indi.classList.add(className1)
}

var playNextPic = function(index) {
    // 获取当前图片的下标和图片总数
    // var container = e('.main-slide')
    // var totalImgs = Number(container.dataset.imgs)
    // var currentIndex = Number(container.dataset.index)

    // 切换图片
    showImg(index)

    // 切换小圆点
    toggleIndi(index)

    // 改变当前图片 index
    // container.dataset.index = nextIndex
}

var nextIndex = function(self) {
    // 获取当前图片的下标和图片总数
    var container = e('.main-slide')
    var totalImgs = Number(container.dataset.imgs)
    var currentIndex = Number(container.dataset.index)

    // 计算切换图片的下标
    var offset = Number(self.dataset.offset)
    var nextIndex = (currentIndex + offset + totalImgs) % (totalImgs)

    // 改变当前图片 index
    container.dataset.index = nextIndex

    return nextIndex
}

var bindEventButton = function() {
    // 绑定左右 button 点击事件
    bindAll('.button-angle', 'click', (event) => {
        var self = event.target
        // log('self', self)
        var index = nextIndex(self)
        // 切换上/下图片，切换圆点
        playNextPic(index)

    })
}

var bindEventDot = function() {
    // 绑定小圆点点击事件
    var selector = '.main-slide-indi'
    bindAll(selector, 'click', function(event){
        var dot = event.target
        // 获取自定义属性的index值
        var index = String(dot.dataset.index)

        // 切换上/下图片，切换圆点
        playNextPic(index)
    })
}

var clockId = setInterval(() => {
    log('test')
    // 获取当前 index
    var container = e('.main-slide')
    var totalImgs = Number(container.dataset.imgs)
    var currentIndex = Number(container.dataset.index)

    // 下一张图片 下标
    var nextIndex = (currentIndex + 1) % (totalImgs)
    playNextPic(nextIndex)
    container.dataset.index = nextIndex
}, 3000)

// 清除定时器
// clearInterval(clockId)

// 3 自动轮播
//     定时器，自动切换下一张图片 playNextPic()

// 2 小圆点切换图片
//     小圆点改变css
//     切换对应图片
//     修改父节点当前图片 index

// 1 左右箭头，点击切换上/下一张
//     箭头左右两侧
//     绑定事件，点击切换对应图片
//     修改父节点当前图片 index

var __main = function() {
    bindEventButton()
    bindEventDot()
}
__main()


// 待完成
// 自动轮播有问题，抽出的函数 nextindex 有问题
// 当自动轮播与其它两个点击事件冲突时如何解决

//
