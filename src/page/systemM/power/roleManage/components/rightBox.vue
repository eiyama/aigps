<template>
  <div class="right-content" id="right-main" ref="rightContent">
    <el-tabs v-model="activeName" class="tabs-head" :before-leave="() => tabsBeforLeave" @tab-click="changeCurIndex($event)">
      <el-tab-pane v-for="(v,index) in tabTitle" :key="index" :label="v.value" :name="v.name"></el-tab-pane>
    </el-tabs>
    <!-- 分配权限 -->
    <power-tree ref="powerTree" :curIndex="curIndex" :curNode="curNode" />
    <!-- 用户列表 -->
    <tables ref="tables" :curIndex="curIndex" :parentId="parentId" />
  </div>
</template>

<script>
import { Tabs, TabPane, Message } from 'element-ui';
import { parentId, testTreeName, notIsChild } from '@/utils/data'
import { getCopyObj } from '@/utils/util'
import { getSmRole, addSmRole, upSmRole, delSmRole } from '@/api/sysetsmM/power'
import PowerTree from './powerTree'
import Tables from './tables'
export default {
  components: {
    PowerTree,
    Tables,
    ElTabs: Tabs,
    ElTabPane: TabPane
  },
  data() {
    const activeName = this.$t('roleManage.curTitle')[0].name;
    const tabTitle = this.$t('roleManage.curTitle');
    return {
      activeName,
      parentId,
      curIndex: 0,
      curNode: {},
      tabTitle
    }
  },
  props: {
    evBus: {
      type: Object
    }
  },
  mounted() {
    this.evBus.$on('handleNode', this.handleNode);
  },
  beforeDestroy() {
    this.evBus.$off('handleNode', this.handleNode);
  },
  methods: {
    /**
     * 左侧树点击节点
     */
    handleNode(data) {
      this.curNode = data;
      this.changeCurIndex({ index: this.curIndex }, true);
    },
    /**
     * 右边tab点击切换
     */
    changeCurIndex(event, isMsg) {
      const id = this.curNode.id;
      if (id == this.parentId) {
        if (!isMsg) {
          const msg = this.$t('roleManage.selectRoleMsg');
          Message.error(msg);
        }
        this.tabsBeforLeave = false;
        return;
      }
      this.tabsBeforLeave = true;
      this.curIndex = +event.index;
      // 0是权限分配，1是用户列表
      if (this.curIndex === 1) {
        this.$refs.tables.requestInfo(id);        
      } else {
        // 根据角色获取权限树
        this.$refs.powerTree.requestInfo(id);
      }
    }
  }
}
</script>

<style scoped>
.right-content {
  flex: 1;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-left: 5px;
  overflow: hidden;
}
.right-content .current-tab {
  overflow: hidden;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ddd;
  padding: 0 10px;
}
.right-content .tab-title {
  float: left;
  margin-right: 5px;
  cursor: pointer;
}
.right-content .search-bar,
.right-content .name {
  float: right;
}
.right-content .search-bar {
  width: 160px;
}
.submit-bar {
  padding: 10px;
}
.submit-bar .btn {
  margin: 0 5px;
}
.margin-top {
  margin-top: 4px !important;
}
.user-list {
  display: flex;
  flex: 1;
}
.center-box,
.right-box {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.center-box .input,
.right-box .input {
  width: 245px !important;
}
.move-info {
  margin: 0 5px;
}
.user-list .title-bar {
  height: 32px;
  padding: 4px 5px;
  line-height: 32px;
}
.table-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding: 0 1px;
  overflow: hidden;
}
.block {
  display: flex;
  justify-content: center;
  padding: 20px 0 0;
}
</style>