<template>
  <div class="left-content">
    <div class="type-bar">
      <tab-bar ref="tabBar" isBoxMin :listLi="listLi" :operButton="operButton" :rules="rules" @clickAdd="clickAddInfo" @addConfirm="addConfirm" @clickRevise="handleRevise" @reviseConfirm="reviseConfirm" @clickDelete="clickDelete" @clickRefresh="requestInfo('#left-tree')" />
      <el-input v-if="operButton.search" v-model="inputVal" :placeholder="$t('placeholder.roleName')" clearable @input.native="valueChange" @clear="clear" class="input" size="small" />
    </div>
    <el-scrollbar class="scroll-y" id="left-tree" style="flex:1;width: 100%;">
      <el-tree class="border-blue" :expand-on-click-node="false" empty-text :default-expanded-keys="openKeys" :data="tree"
        @node-click="handleNode" node-key="id" highlight-current ref="leftTree" :props="defaultProps" :filter-node-method="filterNode">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span v-if="!data.child || !data.child.length" style="color:#00a8d4;font-size:14px;" class="icon iconfont">&#xe606;</span>
          <!-- 文件图标展开 -->
          <span v-if="data.child && data.child.length && !node.expanded" style="color:#00a8d4;font-size:14px;" class="icon iconfont">&#xe642;</span>
          <!-- 文件图标闭合 -->
          <span v-if="data.child && data.child.length && node.expanded" style="color:#00a8d4;font-size:12px;" class="icon iconfont">&#xe602;</span>
          <span style="font-size: 14px;padding: 0 5px;">{{ node.label }}</span>
        </span>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, parentId, testTreeName, notIsChild } from '@/utils/data'
import { getCopyObj } from '@/utils/util'
import { getStrTrim } from '@/utils/validate'
import { rule } from '@/utils'
import { getSmRole, addSmRole, upSmRole, delSmRole } from '@/api/sysetsmM/power'
import TabBar from '@/components/tabBar'

import { MessageBox, Message, Scrollbar, Tree } from 'element-ui'

export default {
  components: {
    TabBar,
    ElScrollbar: Scrollbar,
    ElTree: Tree
  },
  data() {
    const listLi = getCopyObj(this.$t('roleManage.listLi'));
    const rules = {
      roleName: rule('isEmpty', this.$t('roleManage.rules.roleName'))
    }
    return {
      listLi,
      rules,
      parentId,
      defaultProps: {
        children: 'child',
        label: 'roleName'
      },
      inputVal: '',
      openKeys: [],
      operButton: {},
      tree: [],
      curNode: {}
    }
  },
  computed: {
    ...mapGetters([
      'menuTree'
    ])
  },
  props: {
    evBus: {
      type: Object
    }
  },
  created() {
    const { $route, $store, menuTree } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)
    this.operButton = {
      ...getOperButton(menuTree, url),
      refresh: true,
      export: false
    }
    this.requestInfo()
  },
  methods: {
    /**
     * 树过滤
     */
    filterNode(value, data) {
      if (!value) return true;
      const veh = data.roleName ? data.roleName.toUpperCase() : '';
      const val = value.toUpperCase();
      if (veh.indexOf(val) !== -1) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * 请求数据
     */
    requestInfo(dom, curId) {
      getSmRole(this.parentId, dom).then(res => {
        if (res.success) {
          const list = res.result.items;
          this.tree = list;
          if (!curId) {
            this.curNode = list[0];
            this.evBus.$emit('handleNode', this.curNode);
          }
          const id = curId || list[0].id;
          this.openKeys.push(id);
          this.$nextTick(() => {
            this.$refs.leftTree.setCurrentKey(id);
          });
        }
      })
      .catch(err => {

      });
    },
    /**
     * 添加点击
     */
    clickAddInfo() {
      this.$refs.tabBar.addShowAndHide(true);
    },
    /**
     * 添加确认
     */
    addConfirm(listLi) {
      const id = this.curNode.id;
      const name = listLi.roleName.model;
      const isRepeat = testTreeName({
        tree: this.tree,
        nameK: 'roleName',
        idK: 'id',
        name,
        id
      });
      if (isRepeat) {
        Message.error(this.$t('error.nameRepeat'));
        return;
      }
      var obj = {};
      for (const [k, v] of Object.entries(listLi)) {
        obj[k] = v.model;
      }
      obj.roleParentId = id;
      addSmRole(obj).then(res => {
        if (res.success) {
          Message({
            message: this.$t('success.add'),
            type: 'success'
          });
          this.$refs.tabBar.addShowAndHide(false);          
          this.requestInfo(null, id);
        }
      });
    },
    /**
     * 修改点击
     */
    handleRevise() {
      if (this.curNode.id === this.parentId) {
        Message.error(this.$t('error.menuRoot'));
        return;
      }
      for (const [k, v] of Object.entries(this.listLi)) {
        v.model = this.curNode[k];
      }
      this.$refs.tabBar.reviseShowAndHide(true);
    },
    /**
     * 修改确认
     */
    reviseConfirm(listLi) {
      const id = this.curNode.id;
      const name = listLi.roleName.model;
      const isRepeat = testTreeName({
        tree: this.tree,
        isUp: true,
        nameK: 'roleName',
        idK: 'id',
        name,
        id
      });
      if (isRepeat) {
        Message.error(this.$t('error.nameRepeat'));
        return;
      }
      var obj = {};
      for (const [k, v] of Object.entries(listLi)) {
        obj[k] = v.model;
      }
      obj.roleParentId = this.curNode.roleParentId;
      obj.id = id;
      upSmRole(obj).then(res => {
        if (res.success) {
          this.$refs.tabBar.reviseShowAndHide(false);
          this.curNode = res.result;
          Message({
            message: this.$t('success.revise'),
            type: 'success'
          });
          this.requestInfo(null, id);
        }
      });
    },
    /**
     * 点击删除
     */
    clickDelete() {
      const id = this.curNode.id;
      if (this.parentId === id) {
        Message.error(this.$t('error.menuRoot'));
        return;
      }
      const boole = notIsChild(this.tree, id);
      if (!boole) {
        Message.error(this.$t('error.roleNode'));
        return;
      }
      MessageBox.confirm(
        this.$t('message.delete'),
        this.$t('message.title'),
        {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          delSmRole(id).then(res => {
            if (res.success) {
              this.$refs.leftTree.remove(id);
              Message({
                type: 'success',
                message: this.$t('success.delete')
              });
              // 删除成功之后默认选中根节点
              this.curNode = this.tree[0];
              this.evBus.$emit('handleNode', this.curNode);
              this.$refs.leftTree.setCurrentKey(this.curNode.id);
            }
          })
          .catch(err => {
            
          });
        })
        .catch(() => {});
      
    },
    /**
     * 输入框的input事件
     */
    valueChange(event) {
      let val = event.target.value;
      val = getStrTrim(val);
      if (!val || val.length >= 2) {
        this.$refs.leftTree.filter(val);
      }
    },
    /**
     * 清空输入框
     */
    clear() {
      this.$refs.leftTree.filter('');
    },
    /**
     * 树的节点点击
     */
    handleNode(data) {
      if (data.id === this.curNode.id) {
        return;
      }
      this.curNode = data;
      this.evBus.$emit('handleNode', data);
    }
  }
}
</script>

<style scoped>
.left-content {
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 400px;
}
.move-info {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0 0;
}
.move-info span {
  display: block;
  width: 40px;
  height: 28px;
  line-height: 28px;
  color: #fff;
  text-align: center;
  background: #00a8d4;
  font-size: 16px;
  margin: 10px auto;
  border-radius: 2px;
  cursor: pointer;
}
.type-bar {
  overflow: hidden;
  height: 40px;
  padding: 0 5px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
}
.type-bar >>> .row .button {
  margin: 4px 10px 0 0 !important;
}
.type-bar span {
  display: block;
  float: left;
  width: 32px;
  height: 32px;
  font-size: 20px;
  color: #00a8d4;
  line-height: 32px;
  text-align: center;
  cursor: pointer;
  margin: 4px 5px 0 0;
  box-sizing: border-box;
  border: 1px solid #fff;
}
.type-bar >>> .input {
  margin: 4px 0 0;
}
</style>