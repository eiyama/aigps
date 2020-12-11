<template>
  <ul class="nav">
    <li v-for="(v,index) in menuTree" :key="index" @mouseenter="moveover(index)"
      @mouseleave="moveout" :class="{ active:curIndex == index || moveIndex == index }">
      <a @click="changeActive(v.child[0].url, index)" href="javascript:;">{{ v.name }}</a>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.nav {
  float: left;
  height: 50px;
  margin-left: 87px;
}

.nav li {
  float: left;
  height: 50px;
  font-size: 16px;
  line-height: 50px;
  margin-left: 40px;
  position: relative;
}

.nav a {
  display: block;
}

.nav .active a,
.nav li:hover a {
  color: #00a8d4;
}

.nav li a {
  font-size: 16px;
}
</style>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      curIndex: 0,
      moveIndex: null
    }
  },
  computed: {
    ...mapGetters([
      'menuTree'
    ])
  },
  created() {
    this.setCurIndex()
  },
  methods: {
    /**
     * 光标移入当前导航
     * @param {Number} index 当前导航的下标
     */
    moveover(index) {
      this.moveIndex = index
    },
    /**
     * 光标移出当前导航
     */
    moveout() {
      this.moveIndex = null
    },
    /**
     * 点击跳转新页面
     * @param {String} url 要跳转的地址
     * @param {Number} index 点击导航的下标
     */
    changeActive(url, index) {
      const curPath = this.$route.path;
      // 点击的当前页面
      if (curPath === url) return

      const list = this.menuTree[index]
      if (url.indexOf('http://') > -1) {
        open(url)
      } else {
        this.$router.push({
          path: url,
          query: {
            code: list.code
          }
        })
      }
    },
    /**
     * 根据当前路由来判断当前选中的导航
     */
    setCurIndex() {
      const routeName = location.hash;
      if (Array.isArray(this.menuTree)) {
        const code = this.$route.query.code;
        for (const [i, v] of this.menuTree.entries()) {
          if (routeName.indexOf(v.url) > -1 || code == v.code) {
            this.curIndex = i;
            break;
          }
        }
      }
    }
  },
  watch: {
    $route: 'setCurIndex'
  }
}
</script>