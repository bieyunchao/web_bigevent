$(function () {
  var form = layui.form
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格!'
    ],
    newPwd: function (value, item) { //value：表单的值、item：表单的DOM对象
      if (value === $('[name=oldPwd]').val())
        return '新旧密码不能相同!'
    },
    rePwd: function (value, item) { //value：表单的值、item：表单的DOM对象
      if (value !== $('[name=newPwd]').val())
        return '两次密码输入不一致!'
    }
  })



  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    // 发送 ajax 请求
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0)
          return layer.msg('重置密码失败!')
        layer.msg('重置密码成功!')
        // 调用 DOM元素的 重置表单方法
        $('.layui-form')[0].reset()
      }
    })
  })
})