/**
 * 此处不是源码，根据业务需要新增
 */
import { createPoint } from '../base/factory.js'

export default {
  /**
   * 计算多点之间距离的方法（至少需要两个经纬度点）
   * @param {Array} points 经纬度点
   */
  getDistances(points) {
    if (!(points instanceof Array) || points.length < 2) {
      return 0
    }
    const { BMap, map } = this
    let oldVal = {}
    return points.reduce((count, v) => {
      if (oldVal.lng && oldVal.lat) {
        count += map.getDistance(createPoint(BMap, oldVal), createPoint(BMap, v))
      }
      oldVal = v
      return count
    }, 0)
  },
  /**
   * 校验是否在可视区
   * @param {Object} opt 参数
   */
  isVisualArea(opt) {
    const { BMap, map } = this
    let pt = opt.pt
    if (!opt.pt) {
      pt = createPoint(BMap, { lng: opt.lng, lat: opt.lat })
    }
    if (map.getBounds().containsPoint(pt)) {
      return true
    } else {
      return false
    }
  },
  /**
   * 地图平移
   * @param {String} lng 
   * @param {String} lat 
   * @param {Number|Null} zoom 地图缩放等级
   * @param {Object} pt 地图的point点
   */
  setPanToCenter(opt) {
    const { BMap, map } = this
    // 需要校验可视区且在可视区就不移动
    if (opt.isVisualArea && this.isVisualArea(opt)) {
      return
    }
    let pt = opt.pt
    if (!opt.pt) {
      pt = createPoint(BMap, { lng: opt.lng, lat: opt.lat })
    }
    if (opt.zoom) {
      map.setZoom(opt.zoom)
    }
    map.panTo(pt)
  },
  /**
   * 根据经纬度获取地址
   * @param {Object} opt 参数
   */
  getLocation(opt) {
    const { BMap } = this
    return new Promise(resolve => {
      let pt = opt.pt
      if (!opt.pt) {
        pt = createPoint(BMap, opt)
      }
      const geocoder = new BMap.Geocoder()
      geocoder.getLocation(pt, (geocoderResult) => {
        let poi = ''
        const opoint = geocoderResult.point
        let npoint
        let tmpValue = Math.pow(opoint.lat, 2) * Math.pow(opoint.lng, 2)
        for (const v of geocoderResult.surroundingPois.values()) {
          npoint = v.point
          const ntmpValue = Math.abs(
            Math.pow(opoint.lat, 2) * Math.pow(opoint.lng, 2) - Math.pow(npoint.lat, 2) * Math.pow(npoint.lng, 2)
          )

          if (tmpValue > ntmpValue) {
            poi = `,${v.title}`
            tmpValue = ntmpValue
          }
        }
        const address = `${geocoderResult.address}${poi || ''}`
        resolve(address)
        return
      })
    })
  },
  /**
   * 根据所有的point点来缩放地图全部展示出来
   * @param {Array} arr point点的集合或者经纬度的集合
   * @param {Boolean} isLngLat 为正则是经纬度数据，false是point数据
   */
  setViewports(arr, isLngLat) {
    const { BMap, map } = this
    const arr2 = []
    if (isLngLat) {
      for (const v of arr.values()) {
        const pt = createPoint(BMap, v)
        arr2.push(pt)
      }
    }
    const pts = isLngLat ? arr2 : arr
    map.setViewport(pts)
  },
  /**
   * 获取覆盖物的经纬度
   * @param {Object} overlay 覆盖物的对象
   */
  getPath(overlay) {
    if (overlay.getPosition) {
      return overlay.getPosition()
    } else {
      return overlay.getPath()
    }
  }
}