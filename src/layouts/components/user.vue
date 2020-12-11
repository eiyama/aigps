<template>
  <div class="my-name">
    <el-dropdown @command="handleCommand" trigger="click">
      <img src="@/assets/image/myself.png">
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command="index" :key="index" v-for="(v,index) in setUserInfo">{{ v.name }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-tooltip class="item" effect="dark" :content="$t('button.quit')" placement="bottom">
      <h5 class="quit icon iconfont icon-tuichu" @click="logout"></h5>
    </el-tooltip>
    <span class="name">{{ userInfo.userName }}</span>
    <update-pwd ref="pswPop" @close="close"/>
  </div>
</template>

<style lang="scss" scoped>
.my-name {
  overflow: hidden;
  float: right;
  margin: 12px 0 0;
}

.my-name img {
  float: left;
  width: 22px;
  height: 22px;
  margin-right: 10px;
  cursor: pointer;
}

.my-name .name {
  display: block;
  float: right;
  font-size: 14px;
  color: #fff;
  line-height: 22px;
}
.quit {
  cursor: pointer;
  float: right;
  color: #fff;
  font-size: 22px;
  line-height: 22px;
  margin-left: 10px;
}
</style>

<script>
import { mapGetters } from 'vuex'
import { resetRouter } from '@/router'
import UpdatePwd from './updatePwd'
import { Dropdown, Tooltip, DropdownMenu, DropdownItem } from 'element-ui'

export default {
  components: {
    ElDropdown: Dropdown,
    ElTooltip: Tooltip,
    ElDropdownMenu: DropdownMenu,
    ElDropdownItem: DropdownItem,
    UpdatePwd
  },
  data() {
    const setUserInfo = this.$t('home.setUserInfo')
    return {
      pswPop: false,
      setUserInfo
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    /**
     * 点击菜单项
     * @param {Number} val dropdown-item的指令
     */
    handleCommand(index) {
      const { setUserInfo, $router } = this
      const item = setUserInfo[index]

      if (item.type === 'psd') {
        this.$refs.pswPop.setState(true)
      } else if (item.type === 'link') {
        $router.push({ path: item.path })
      }
    },
    /**
     * 关闭弹窗
     */
    close() {
      this.$refs.pswPop.setState(false)
    },
     /**
     * 页面退出
     */
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$store.dispatch('permission/clearRoutes')
      this.$router.replace('/login')
    }
  }
}
</script>