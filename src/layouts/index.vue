<template>
  <div class="box">
    <div class="head clearFloat nav-bg">
      <logo />
      <!-- 导航栏 -->
      <my-nav />
      <!-- 个人中心 -->
      <user />
      <!-- 报警图标与报警表格 -->
      <!-- <query-alarm /> -->
      <QueryAlarmNew />
      <!-- 报警设置 -->
      <set-alarm />
      <!-- 报警处理弹窗 -->
      <handle-alarm />
      <!-- 主动安全报警处理 -->
      <active-alarm />
    </div>
    <div class="container">
      <!-- 左侧菜单栏 -->
      <side-menu v-if="$route.meta.isSideMenu" />
      <div class="content">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import MyNav from './components/nav'
import Logo from './components/logo'
import User from './components/user'
import SetAlarm from './components/setAlarm'
import QueryAlarm from './components/queryAlarm'
import HandleAlarm from './components/handleAlarm'
import ActiveAlarm from './components/activeAlarm'
import SideMenu from './components/SideMenu'
import QueryAlarmNew from './alarm'
// import {loginTtx} from '@/utils/jsonp'
export default {
  components: {
    MyNav,
    Logo,
    User,
    SetAlarm,
    QueryAlarm,
    HandleAlarm,
    ActiveAlarm,
    SideMenu,
    QueryAlarmNew
  },
  data() {
    return {
      logPageSize: 20, // 日志弹窗每页的条数
      logPopupShow: false, // 控制日志弹窗显示的变量
      logTable: [] // 日志表格的数据
    }
  },
 async created() {
   
    this.loginTTX()
  },
  methods: {
    /**
     * 获取通天星视频的session并且30分钟轮询一次
     */
    loginTTX() {         
      this.$store.dispatch('user/loginTTX',)
      // 30分钟再执行一次
      const tid = setTimeout(() => {
        this.loginTTX()
        clearTimeout(tid)
      }, 30 * 60 * 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .head {
    padding: 0 20px;
  }
  .container {
    flex: 1;
    display: flex;
    overflow: hidden;
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }
}

</style>
