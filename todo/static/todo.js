// *** 前端
var log = console.log.bind(console)

var e = selector => document.querySelector(selector)

var ajax = function(method, path, data, callback) {
    var r = new XMLHttpRequest()
    r.open(method, path, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = function() {
        if (r.readyState == 4) {
            callback(r.response)
        }
    }
    r.send(data)
}

// 1 提交按钮绑定点击事件，增加 todo
var templateTodo = function(todo) {
    // 获取todo对象
    var todoValue = todo.task
    var todoId = todo.id
    var html = `
        <div class="div-todo-cell" data-id=${todoId}>
            <div class="div-complete">完成</div>
            <div class="div-todo-content">${todoValue}</div>
            <div class="div-delete">删除</div>
        </div>
    `
    return html
}

var appendHtml = function(element, html) {
    element.insertAdjacentHTML('beforeend', html)
}

var insertTodo = function(todo) {
    var container = e('#id-div-container')
    // 选中 container 元素，添加 html（模板 todo-cell）
    var html = templateTodo(todo)
    appendHtml(container, html)
}

var insertTodos = function(todos) {
    for (var i = 0; i < todos.length; i++) {
        var todo = todos[i]
        // todo 插入到页面中
        insertTodo(todo)
    }
}

var loadTodos = function() {
    var method = 'GET'
    var route = 'all'
    var path = "http://localhost:8000/todo/" + route
    ajax(method, path, '', function(t) {
        var todos = JSON.parse(t)
        // todos 插入到页面
        insertTodos(todos)
    })
}

var apiTodoAdd = function(value, callback) {
    var data = {
        'task': value,
    }
    var method = 'POST'
    var route = 'add'
    var path = "http://localhost:8000/todo/" + route
    data = JSON.stringify(data)
    ajax(method, path, data, function(t) {
        var todo = JSON.parse(t)
        callback(todo)
    })
}

var apiTodoDelete = function(todoId, callback) {
    var method = 'GET'
    var route = `delete/${todoId}`
    var path = "http://localhost:8000/todo/" + route
    ajax(method, path, '', function(t) {
        var todo = JSON.parse(t)
        callback(todo)
    })
}

var apiTodoUpdate = function(todo, callback) {
    // 获取 todoId
    var todoCell = todo.closest('.div-todo-cell')
    var todoId = todoCell.dataset.id
    var value = todo.innerHTML
    // 发送请求修改 todo
    var data = {
        'task': `${value}`,
    }
    var method = 'POST'
    var route = 'update/' + todoId
    var path = "http://localhost:8000/todo/" + route
    data = JSON.stringify(data)
    ajax(method, path, data, function(t) {
        var todo = JSON.parse(t)
        callback(todo)
    })
}

var bindEventAdd = function() {
    // 获取按钮元素
    var button = e('.button-todo-add')
    // 绑定点击事件
    button.addEventListener('click', function(event) {
        var value = e('#id-input-todo').value
        apiTodoAdd(value, (todo) => {
            // 页面插入新 todo
            insertTodo(todo)
            log('插入新 todo 成功', todo)
        })
    })
}

// 2 container 事件委托，左侧点击事件完成 todo
var bindEventComplete = function() {
    // 获取 container 元素，绑定子元素完成的点击事件
    var container = e('#id-div-container')
    container.addEventListener('click', function(event) {
        var self = event.target
        var isComplete = self.classList.contains('div-complete')
        if (isComplete) {
            // 点击完成，寻找其祖先元素 todocell，实现 todo 颜色变灰色
            var todoCell = self.closest('.div-todo-cell')
            var content = todoCell.querySelector('.div-todo-content')
            content.classList.toggle('active-complete')
            log('todoCell', todoCell)
        }
    })

}

// 3 右侧点击事件删除 todo
var bindEventDelete = function() {
    // 获取 container 元素，事件委托
    var container = e('#id-div-container')
    container.addEventListener('click', function(event) {
        var self = event.target
        // 当点击元素是删除元素时，触发事件
        var isDelete = self.classList.contains('div-delete')
        if (isDelete) {
            // 删除todo
            var todoCell = self.closest('.div-todo-cell')
            var todoId = todoCell.dataset.id
            apiTodoDelete(todoId, function(todo) {
                log('删除 todo 成功', todo)
                todoCell.remove()
            })
        }
    })
}

// 4 中间内容部分，点击事件可编辑内容
var bindEventEdit = function() {
    // 获取 container 元素，事件委托
    var container = e('#id-div-container')
    container.addEventListener('click', function(event) {
        var self = event.target
        var isEdit = self.classList.contains('div-todo-content')
        if (isEdit) {
            // 点击内容区域，绑定点击事件
            // 给 todo 增加 可编辑功能
            var todoCell = self.closest('.div-todo-cell')
            var todoEdit = todoCell.querySelector('.div-todo-content')
            todoEdit.contentEditable = true
            todoEdit.focus()
            // 删除编辑元素的默认行为,回车更新 todo
            // **** 未成功，待查找问题
            bindEventUpdate(todoCell)
            log('todoEdit', todoEdit)
        }
    })
}

var bindEventUpdate = function(todo) {
    todo.addEventListener('keydown', function(event) {
        var key = event.key
        var self = event.target
        if (key == 'Enter') {
            // 取消默认行为
            // 回车内容不能再被编辑
            event.preventDefault()
            self.contentEditable = false

            // 更新 todo
            apiTodoUpdate(self, function(t) {
                self.innerHTML = t.task
                log('修改 todo 成功', t)
            })
        }
    })
}

var bindEventMouseOver = function() {
    // 事件委托，获取 container
    var container = e('#id-div-container')

    // 鼠标悬停事件
    container.addEventListener('mouseover', function(event) {
        var self = event.target
        var condition = self.classList.contains('div-todo-content')
        if (condition) {
            // 边框变色
            var todoCell = self.closest('.div-todo-cell')
            todoCell.classList.add('active-border')
            bindEventMouseOut(todoCell)
        }

    })
}

var bindEventMouseOut = function(todoCell) {
    // 鼠标移开事件
    todoCell.addEventListener('mouseout', function(event) {
        var self = event.target
        // 边框取消变色
        todoCell.classList.remove('active-border')


    })
}

var bindEvents = function() {
    bindEventAdd()
    bindEventComplete()
    bindEventDelete()
    bindEventEdit()
    bindEventMouseOver()

}

var __main = function() {
    bindEvents()
    loadTodos()
}
__main()
// ***  已完成
// 1 添加 todo，向后端发送 todo
//     后端处理接收的todo，加todo-id，
//     回调函数中接收返回的todo，
//     插入到页面中，

// 2 刷新页面，载入todos，插入todos
//     前端ajax请求
//     后端返回todos
//     浏览器插入到页面中

// 3 删除后端todo，删除页面todo
//     获取todo-id

// 4 更新todo
//     获取 todo-id
// bindEventMouseOut 和 bindEventMouseOver函数有错误
// 盒模型的原因，事件流
// 问题原因：在 todocell 上面绑了鼠标事件，todocell盒模型有margin，因此鼠标移动到margin上时触发事件，但找不到子元素所以报错
// 解决方案：在鼠标移入函数内绑定了移出函数，并且修改的todocell的margin

// ***  待完成
// 编辑框太大
// 添加 css
// 完成状态该有什么行为
