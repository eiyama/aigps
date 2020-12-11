<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <!-- 地图弹窗 -->
    <map-popup ref="map" :mapId="'home_map'"/>
  </div>
</template>
<!-- 如果要给elementui的组件加上一个原生的vue事件加@click.native -->
<!-- 在隐藏元素的时候如果频繁的切换显示隐藏请使用v-show,如果只是偶尔切换请使用v-if -->
<!-- v-show的dom一直存在，并且条件不管满不满足在初始页面都会加载出来，只是修改了display的值 -->
<!-- v-if是惰性的，是删除和添加dom来进行操作，并且初始不加载，只在条件满足才加载 -->
<!-- 模板里面可以用来写简单的运算，复杂的可以用计算属性，以保证代码的可读性 -->
<!--prevent清除事件的默认行为 -->
<!-- production生产环境，需要打包；development开发环境，不需要打包 -->
<style type="text/css">
@import url("conmon/css/base.css");
@import url("conmon/css/drawingManager.css");
/* @import url("assets/image/icon/iconFont/iconfont.css"); */
html,
body,
#app {
  height: 100%;
}
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0.3s;
}
.router-fade-enter,
.router-fade-leave-active {
  opacity: 0;
}
.row {
  display: flex;
  flex-wrap: wrap;
}
.row-center {
  display: flex;
  justify-content: center;
}
.row-PL {
  padding-left: 5px;
}
.model-input {
  line-height: 33px;
  margin-right: 20px;
  width: auto;
}
.model-input .name {
  color: #333;
}
.input {
  width: 160px !important;
}
.button {
  margin: 0 10px 0 0 !important;
  height: 32px;
}
.margin-r {
  margin-right: 20px !important;
}
.margin-r10 {
  margin-right: 10px !important;
}
/*标题的文字颜色*/
.title-color {
  color: #333;  
}
/*内容的文字颜色*/
.content-color {
  color: #666;
}
/*弱提示文字颜色*/
.msg-color {
  color: #999;
}
/*强提示文字颜色*/
.max-msg-color {
  color: #e84907;
}
/*选中的字体颜色*/
.select-color {
  color: #00a8d4;
}
/*导航栏的背景颜色*/
.nav-bg {
  background: #1c2327;
}
/*导航栏选中的时候的背景颜色*/
.select-nav-bg {
  background: #00a8d4;
}
/*边框线颜色*/
.border {
  border: 1px solid #DCDFE6;
}
.border-left {
  border-left: 1px solid #DCDFE6;
}
.border-right {
  border-right: 1px solid #DCDFE6;
}
.border-top {
  border-top: 1px solid #DCDFE6;
}
.border-bottom {
  border-bottom: 1px solid #DCDFE6;
}
/*辅色*/
.deep-bg {
  background: #373d40;
}
.shallow-bg {
  background: #9ca3ac;
}
.select-bg1 {
  background: #f2f4f5;
}
.select-bg2 {
  background: #b3edfc;
}
/*小型按钮*/
.mini-btn {
  width: 32px;
  height: 32px;
  display: block;
  border: 1px solid #fff;
  box-sizing: border-box;
  font-size: 20px;
  line-height: 32px !important;
  text-align: center;
  color: #00a8d4;
  cursor: pointer;
}
.mini-btn:hover {
  border: 1px solid #dedede;
  border-radius: 2px;
}
/* 输入框去掉圆角 */
.el-input__inner {
  border-radius: 0;
}
/** maps inforWindow ;begin */
.mapInfoWindow {
  width: auto;
  padding: 0 0 20px;
  z-index: 9999;
}
.mapInfoWindow p {
  line-height: 30px;
  padding: 0 20px;
}
.mapInfoWindow p span {
  font-size: 14px;
  color: #666;
}
.mapInfoWindow p b {
  font-size: 14px;
  color: #333;
}

.info-win-title {
  line-height: 36px;
  color: #fff;
  font-size: 16px;
  padding: 0 20px;
  font-weight: bold;
}
.mapInfoWindow .order {
  overflow: hidden;
  padding: 9px 10px 0 20px;
}
.mapInfoWindow .order li {
  float: left;
  margin: 0 8px 5px 0;
  width: 70px;
  height: 26px;
  background: #00a8d4;
  line-height: 26px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.mapInfoWindow .order b:hover {
  background-color: #9ecff1;
  color: White;
}
.center .el-tabs__nav-scroll {
  display: flex !important;
  justify-content: center !important;
}
.el-tabs__content .el-tab-pane {
  height: 100%;
}
.tabs-head .el-tabs__header {
  margin: 0 !important;
}
.tabs-head .el-tabs__nav-scroll {
  padding: 0 5px !important;
}
.scroll-y .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.el-tabs__content {
  flex: 1;
}
.el-submenu .el-menu-item {
  height: 40px !important;
  line-height: 40px !important;
}
.el-menu-item,
.el-submenu__title {
  height: 36px !important;
  line-height: 36px !important;
}
.el-submenu__title i {
  color: #fff !important;
}
/* el的表格展开更多的css  */
.demo-table-expand {
  font-size: 0;
  overflow: hidden;
}
.demo-table-expand label {
  width: 120px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0 !important;
  margin-bottom: 0 !important;
  width: 50% !important;
  float: left !important;
  display: flex !important;
}
.demo-table-expand .wid-active {
  width: 100% !important;
}
.el-table .el-form-item .el-form-item__content {
  flex: 1;
  text-align: left;
  padding-right: 12px;
  overflow: hidden;
  word-wrap: break-word;
}
.el-table .cell {
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  padding: 0 5px !important;
}
/* 表格当前行的背景颜色 */
.el-table .current-row {
  background: #b3edfc;
}
/* 表格头的css */
.has-gutter tr th {
  background: #f5f6fa;
}
.el-table__body tr td .cell button {
  display: inline;
  padding: 0;
}
.el-table__body tr td .cell .active {
  color: #00a8d4;
  cursor: pointer;
}
/* 表格边框颜色 */
.el-table--border,
.el-table--group {
  border: 1px solid #f5f6fa;
}
/* 左侧菜单栏的css */
.el-menu-item:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #00a8d4 !important;
}
.el-menu .is-active {
  background: #00a8d4 !important;
  color: #fff !important;
}
.el-menu .el-submenu:hover,
.el-menu .el-submenu .el-submenu__title:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #00a8d4 !important;
}
/* 分页的css */
.el-input--mini .el-input__inner {
  height: 28px !important;
}
/* 表格高亮的样式 */
.el-table .current-row td {
  background: #b3edfc !important;
}
/* 去掉button的圆角 */
.el-button {
  border-radius: 0 !important;
}
/* 暂无数据 */
.no-data {
  color: #909399;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
}
/* 搜索栏的上下margin */
.margin-bottom {
  margin-bottom: 5px !important;
}
.current {
  border-bottom: 1px solid #00a8d4;
  padding: 0 !important;
  margin-bottom: 3px;
}
.current .cur-title {
  padding: 0 15px;
  height: 32px;
  line-height: 32px;
  color: #fff;
  background: #00a8d4;
  display: inline-block;
}
.dialog-flex {
  display: flex;
  flex-direction: column;
}
.dialog-flex .el-dialog {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 20px auto !important;
}
.dialog-flex .el-dialog__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.el-dialog--center .el-dialog__body {
  padding: 10px 20px !important;
}
/* 设置弹窗padding为0 */
.padding0 .el-dialog__body {
  padding: 0 20px !important;
}

.center td .cell {
  text-align: center !important;
}
.center th .cell {
  text-align: center !important;
}
.controller .el-slider__runway {
  height: 3px !important;
  margin: 7px 0 !important;
}
.controller .el-slider__runway .el-slider__bar {
  height: 3px !important;
}
.controller .el-slider__runway .el-slider__button-wrapper {
  width: 30px !important;
  height: 30px !important;
  top: -14px;
}
.controller .el-slider__runway .el-slider__button,
.controller .el-slider__button-wrapper .hover {
  width: 6px !important;
  height: 6px !important;
}
.border-blue .el-checkbox__inner {
  border-color: #00a8d4 !important;
}
.border-blue .el-tree-node__expand-icon.expanded {
  color: #00a8d4 !important;
  font-size: 14px !important;
}
.el-menu-vertical-demo .el-menu-item-group__title {
  padding: 0 !important;
}
/** maps end */
/* 车辆监控轮播图 */
.videos .el-carousel__container {
  height: 100% !important;
  display: flex !important;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}
.videos .el-carousel__flex .el-scrollbar__view {
  display: flex !important;
  flex-direction: column !important;
  height: 100%;
  /* overflow-y: scroll; */
}
.videos .el-carousel__float {
  /* overflow-y: scroll; */
  background: #f0f0f0;
}
/* 下拉组件 */
.el-dropdown-menu .active {
  color: #43bfe0 !important;
  background: #e6f6fb !important;
}
/* home页面的tab样式 */
.tab-border-top .el-tabs__nav-wrap::after, .tab-border-top .el-tabs__active-bar {
  top: 0 !important;
}
.tab-border-top {
  position: relative;
}
.tab-border-top .el-tabs__content {
  position: static !important;
}
.el-notification__group {
  width: 100%;
}
/* home页面的报警设置样式 */
video {
  object-fit: fill;
}
</style>

<script>
import MapPopup from '@/components/mapPopup'

export default {
  name: 'app',
  components: {
    MapPopup
  },
  data() {
    return {

    }
  },
  created() {
    this.tokenLogin();
    // var session = window.sessionStorage.getItem('token');
  },
  mounted() {
    // 优化性能，全局只有一个地图弹窗,监听其他页面的地图弹窗页面
    this.setTitle();
    eventBus.$on('changeMapPop', this.changeMapPop)
  },
  //页面卸载之后关闭清除内存
  beforeDestroy() {
    eventBus.$off('changeMapPop', this.changeMapPop)
  },
  methods: {
    /**
     * 点击显示或者隐藏地图弹窗
     * @param {Array} res 数据
     */
    changeMapPop(res) {
      if (res) {
        this.$refs.map.show(res);
      } else {
        this.$refs.map.hide();
      }
    },
    /**
     * 修改网页的title
     */
    setTitle() {
      // 正式的不修改
      if (process.env.VUE_APP_CURRENTMODE !== 'formal') {
        const oTitle = document.getElementById("title");
        oTitle.text = process.env.VUE_APP_CURRENTMODE;
      }
    },
    /**
     * token登录
     */
    async tokenLogin() {
       const token = this.$store.getters.token
      if (!token) {
        // 第三方跳转本页面
        const token = this.getUrl('token');
        if (token) {
          try {
            await this.$store.dispatch('user/tokenLogin', token)
            await this.$store.dispatch('user/logo')
          } catch(err) {

          }
        } else {
          this.$router.push('/login')
        }
      }
    },
    /**
     * 根据key来获取url的参数
     * @param {String} key 要获取url参数的key
     * @return {String} 返回需要的值,没有改字段就返回空字符串
     */
    getUrl(key) {
      const url = location.href;
      const i = url.indexOf(key);
      if (i > -1) {
        const data = url.substring(i);
        const j = data.indexOf('&');
        if (j > -1) {
          return data.substring(0, j).replace(`${key}=`, '');
        } else {
          return data.replace(`${key}=`, '');
        }
      } else {
        return '';
      }
    }
  },
  watch: {
    $route(to, from) {
      //监听路由
      var routeName = to.name;
      // 路由改变的时候把地图弹窗的控制值变成false
      this.$refs.map.hide();
      // this.init();
    }
  }
}
</script>