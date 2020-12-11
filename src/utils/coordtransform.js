/**
 * 各平台之间经纬度转换
 * name bd09togcj02 百度转国测局
 * name gcj02tobd09 国测局转百度
 */
import coordtransform from 'coordtransform'
/**
 * 
 * @param {String} name 方法名
 * @param {String} lng 经度
 * @param {String} lat 纬度
 * @return {Array} 新的[lng, lat]
 */
const getLngLat = (lng, lat, name) => {
  const lnglat = coordtransform[name](lng, lat)
  return {
    lng: lnglat[0],
    lat: lnglat[1]
  }
}
export default getLngLat
