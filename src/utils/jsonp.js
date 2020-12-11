import { Loading } from 'element-ui'

/**
 * jsonp获取数据，回调请统一使用info
 * @param url 请求地址
 * @param id script标签的id
 * @param callback 回调函数
 * @param isLoading 是否需要loading
 */
export function jsonp(opt) {
  return new Promise(resolve => {
    let loading = null
    if (opt.isLoading) {
      loading = Loading.service({
        text: 'Loading',
        target: opt.dom || 'body',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
    }
  
    const script = document.createElement('script')
    const fnName = opt.fnName || 'info'
  
    window[fnName] = res => {
      if (loading) {
        loading.close()
        loading = null
      }
      
      script.onerror = null
      window[fnName] = null
      
      removeNode(opt.id)
      resolve(res)
    }
  
    script.onerror = message => {
      console.log(`jsonp: ${message}`)
      window[fnName](false)
    }
    
    script.id = opt.id
    script.type = 'text/javascript'
    script.src = opt.url + '&' + fnName
    document.body.appendChild(script)
  
    // 如果10秒之后还没请求成功就关闭loading
    const tid = setTimeout(() => {
      if (loading) {
        loading.close()
        loading = null
      }
  
      clearTimeout(tid)
    }, 10000)
  })
}

/**
 * 删除一个dom节点
 * @param {String} id 节点ID
 */
export function removeNode(id) {
  const oDiv = document.getElementById(id)
  if (oDiv) {
    // 必须知道父级节点和自己的节点才能删除
    oDiv.parentNode.removeChild(oDiv)
  }
}

/**
 * 百度地图逆地址解析
 */
export function getLocation(lng, lat) {
  const fnName = 'renderReverse'
  const data = {
    url: `http://api.map.baidu.com/geocoder/v2/?ak=5MWOgkeOzdp3913PE6Ti4Mw7VhsyKCwW&callback=${fnName}&location=${lat},${lng}&output=json&pois=10`,
    fnName,
  }  
  return jsonp(data)
}
// ajax jsonp 跨域方式
export function ttxjsonp(opt){
  return new Promise(resolve => {
  // var param = [];
  // param.push({name: 'account', value: opt.account});
  // param.push({name: 'password', value: opt.password}); 
    let loading = null
    if (opt.isLoading) {
      loading = Loading.service({
        text: 'Loading',
        target: opt.dom || 'body',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
    } 
  $.ajax({
      type: 'GET',
      url: opt.url,
      data: opt.data,
      cache: false,
      dataType: 'JSONP',
      success: function (data) { 
        if(data){
          if(loading){
            loading.close() 
          }                  
          resolve(data)
        }        
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
          try {
              if (p.onError) p.onError(XMLHttpRequest, textStatus, errorThrown);
          } catch (e) {
          }
          loading.close()           
      }
  });
  const tid = setTimeout(() => {
    if (loading) {
      loading.close()
      loading = null
    }

    clearTimeout(tid)
  }, 10000)
  })
}