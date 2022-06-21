$(function () {
  // 点击 “去注册账号” 的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').slideDown()
  })

  // 点击 “去登录” 的链接
  $('#link_login').on('click', function () {
    $('.reg-box').hide()
    $('.login-box').slideDown()
  })


  // 从 layui 中获取到 form 对象
  var form = layui.form
  var layer = layui.layer
  // 通过 form.verify()函数自定义校验规则
  form.verify({
    // 自定义了一个叫做 pwd 检验规则
    pwd: [
      /^[\S]{6,12}$/,
      '密码必须6到12位，且不能出现空格'
    ],
    // 校验两次密码是否一致的规则
    repwd: function (value, item) { //value：表单的值、item：表单的DOM对象
      // 通过形参拿到的是确认密码框的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败，则return一个提示消息即可
      var pwd = $('.reg-box [name=password]').val()
      if (pwd != value) return '两次密码不一致'
    }
  })

  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    // 1. 阻止默认提交行为
    e.preventDefault()
    // 2. 发起 Ajax 请求
    var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      layer.msg('注册成功，请登录! ')
      // 手动点击链接
      $('#link_login').click()
    })
  })

  // 监听登录表单的提交行为
  $('#form_login').submit(function (e) {
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          // 登录失败
          return layer.msg(res.message)
        }
        // 登录成功
        layer.msg(res.message)
        // 将登陆成功相应回的token字符串，保存到 localStorage中
        localStorage.setItem('token', res.token)
        // 跳转到 后台主页
        location.href = '/index.html'
      }
    })
  })
})