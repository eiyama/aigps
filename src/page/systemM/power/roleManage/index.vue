<!-- 角色管理 -->
<template>
  <div class="content-box">
    <!-- 左侧树 -->
    <left-tree :evBus="evBus" />
    <!-- 右侧tabs -->
    <right-box :evBus="evBus" />
  </div>
</template>
<script>
import Vue from 'vue';
import LeftTree from './components/leftTree';
import RightBox from './components/rightBox';

export default {
  name: 'RoleManage',
  components: {
    LeftTree,
    RightBox
  },
  data() {
    const evBus = new Vue();
    return {
      evBus
    }
  }
}
</script>

<style scoped>
.content-box {
  flex: 1;
  background:#fff;
  padding: 5px;
  display: flex;
  overflow: hidden;
}
</style>