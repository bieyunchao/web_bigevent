$(function () {
  var layer = layui.layer
  var form = layui.form
  // 1. 获取文章分类的列表
  initArtCateList()

  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类列表失败!')
        }
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 为添加类名按钮绑定点击事件
  var index = null
  $('#btnAddCate').on('click', function () {
    index = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '添加文章分类',
      content: $('#dialog-add').html(),
    })
  })


  // 通过代理的形式 为form-add 表单绑定 submit事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    // 发起 ajax请求
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('添加文章分类失败!')
        }
        initArtCateList()
        layer.msg('添加文章分类成功!')
        // 索引关闭对应的弹出层
        layer.close(index)
      }
    })
  })


  var indexEdit = null
  // 通过代理的方式为 btn-edit 按钮绑定点击事件
  $('tbody').on('click', '.btn-edit', function (e) {
    // 弹出修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })

    var id = $(this).attr('data-id')
    // 发请求获取对应的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // 快速指定 表单中的值
        form.val('form-edit', res.data)
      }
    })
  })

  // 通过代理的形式，为修改分类的表单绑定 submit 事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg('更新分类数据失败!')
        layer.msg('更新分类数据成功!')
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })

  // 通过 代理方式，为每个删除按钮 绑定 click 事件
  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).data('id')
    // 提示用户是否要删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) return layer.msg('删除分类失败!')
          layer.msg('删除分类成功')
          layer.close(index);
          initArtCateList()
        }
      })
    });
  })
})