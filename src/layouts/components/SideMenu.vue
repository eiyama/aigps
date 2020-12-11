<template>
  <el-scrollbar
    class="scroll-y"
    style="height:100%;max-width:210px;background: #333744;"
  >
    <div
      class="open"
      @click="changeOpen"
    >
      <div class="line-icon">
        <span class="line"></span>
        <span class="line"></span>
        <span class="line"></span>
      </div>
    </div>
    <div
      class="left-aside"
    >
      <el-menu
        :default-active="curPath"
        text-color="#fff"
        active-text-color="#fff"
        background-color="#333744"
        class="el-menu-vertical-demo"
        @select="handSelect"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
      >
        <el-submenu
          :index="v.id"
          v-for="v of activeMenuList"
          :key="v.id"
        >
          <template slot="title">
            <i :class="v.icon ? v.icon + ' icon iconfont' : ''"></i>
            <span
              class="name"
              slot="title"
            >{{ v.name }}</span>
          </template>
          <div
            v-for="item of v.child"
            :key="item.id"
          >
            <el-submenu
              v-if="item.child && item.child.length > 0 && item.type == '1'"
              :index="item.id"
            >
              <template slot="title">
                <i :class="item.icon ? item.icon + ' icon iconfont' : ''"></i>
                <span
                  class="name"
                  slot="title"
                >{{ item.name }}</span>
              </template>
              <div
                v-for="items of item.child"
                :key="items.id"
              >
                <el-menu-item
                  v-if="items.child && items.child.length > 0 && items.type != '3'"
                  :index="items.url"
                >
                  <span :class="items.icon ? items.icon + ' icon iconfont' : ''"></span>
                  <span class="name">{{ items.name }}</span>
                </el-menu-item>
              </div>
            </el-submenu>
            <el-menu-item
              v-else
              :index="item.url"
            >
              <span :class="item.icon ? item.icon + ' icon iconfont' : ''"></span>
              <span class="name">{{ item.name }}</span>
            </el-menu-item>
          </div>
        </el-submenu>
        <el-menu-item
          :index="v.url"
          v-for="(v,index) of activeMenuList2"
          :key="index"
        >
          <i :class="v.icon ? v.icon + ' icon iconfont' : ''"></i>
          <span class="name">{{ v.name }}</span>
        </el-menu-item>
      </el-menu>
    </div>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import { Menu, Submenu, MenuItem, Scrollbar } from 'element-ui'

export default {
  name: 'SideMenu',
  components: {
    ElMenu: Menu,
    ElSubmenu: Submenu,
    ElMenuItem: MenuItem,
    ElScrollbar: Scrollbar
  },
  data() {
    return {
      curPath: '',
      isCollapse: false,
      menuList: []
    }
  },
  computed: {
    // 由于v-if和v-for不能混合使用，所以这里使用计算属性的方式来返回
    // 菜单有两级以上
    activeMenuList() {
      const list = this.menuList.filter(res => {
        if (res.type == '1') {
          return true
        }
        return false
      })
      return list
    },
    // 菜单只有一级
    activeMenuList2() {
      return this.menuList.filter(res => {
        if (res.type == '2') {
          return true
        }
        return false
      })
    },
    ...mapGetters([
      'menuTree'
    ])
  },
  created() {
    this.curPathActive()
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
      this.$emit('open', key)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
      this.$emit('close', key)
    },
    handSelect(path) {
      const { $route: { query }, $router } = this
      this.curPath = path;    
      $router.push({ path, query: { code: query.code } })
    },
    changeOpen() {
      this.isCollapse = !this.isCollapse
    },
    // 设置当前li的样式
    curPathActive() {
      const { menuTree, $route: { meta, path } } = this
      const item = menuTree.find(e => e.code === meta.code)
      this.menuList = item.child || []
      this.curPath = path
    }
  },
  watch: {
    $route() {
      this.curPathActive()
    }
  }
}
</script>

<style scoped>
.left-aside {
  max-width: 200px;
  background: #333744;
}
.el-menu-vertical-demo {
  max-width: 200px;
  border: none;
  overflow: hidden;
}
.name {
  padding-left: 5px;
}
.open {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.open .line-icon {
  overflow: hidden;
  cursor: pointer;
}
.open .line {
  display: block;
  width: 2px;
  height: 12px;
  background: #fff;
  margin: 0 4px 0 0;
  float: left;
}
.open .line:last-child {
  margin-right: 8px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
