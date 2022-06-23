$(function () {

  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage;

  // 定义美化事件的过滤器
  template.defaults.imports.dataFormat = function (data) {
    const dt = new Date(data)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())
    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 定义一个查询的对象，将来请求数据的时候需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, //页面值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示两条
    cate_id: '', // 文章的分类 Id
    state: ''// 文章的发布状态
  }

  // 获取文章列表数据
  initTable()
  // 初始化文章分类
  initCate()

  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) return layer.msg('获取文章列表失败')
        // 使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res)

        $('tbody').html(htmlStr)
        // 调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败!')
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 通知 layui 重新渲染表单区域的 UI 结构
        form.render()
      }
    })
  }

  // 为筛选表单绑定 submit 事件
  $('#form-search').on('submit', (e) => {
    e.preventDefault()
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()

    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用 laypage.render() 方法渲染分页结构 
    laypage.render({
      elem: 'pageBox', // 分页容器的 Id 
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      limits: [2, 3, 5, 10],
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      // 分页发生切换的时候， 触发 jump 回调
      // 触发 jump 回调的方式有两种:
      // 1. 点击页码的时候，会触发 jump
      // 2. 只要调用 laypage.render() 就会触发 jump 回调
      // 补：只要更改了 limit的值 也会触发 jump 回调
      jump: function (obj, first) {
        // 可以通过 first的值，来判断是通过哪种方式，触发的jump回调
        // 如果 first 的值 为true, 证明是方式2触发的，否则是方式1触发的
        // 把最新的页码值，复制到 q 这个查询参数对象中
        // console.log(obj.curr);
        q.pagenum = obj.curr
        // 把最新的条目数，赋值到 q 这个查询参数对象的 pageSize 属性中
        q.pagesize = obj.limit

        // 根据最新的 q 获取对应的数据列表，并渲染表格
        // 解决 jump 死循环问题
        if (!first) {
          initTable()
        }
      }
    })
  }

  // 通过代理的方式，为删除按钮绑定 点击 事件
  $('tbody').on('click', '.btn-delete', function () {
    // 获取删除按钮的个数
    var len = $('.btn-delete').length
    // 获取到文章的 id
    var id = $(this).attr('data-id')
    // 询问用户是要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败!')
          }
          layer.msg('删除文章成功!')
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了，则让页码值 -1 之后，再重新调用 initTable 方法
          if (len === 1) {
            // 如果 len 的值等于1，则证明删除完毕之后，页面上就没有任何数据了
            // 页码之最小是1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      layer.close(index);
    })
  })
})