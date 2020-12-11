<template>
  <div class="tree-aside border">
    <div class="current">
      <h5 class="cur-title">{{ $t('menuManage.curMenuTitle') }}</h5>
    </div>
    <!-- <h5 class="current border-bottom title-color">{{$t('menuManage.curMenuTitle')}}</h5> -->
    <tab-bar class="row-PL" ref="tabBarTree" :listLi="listLi" :operButton="operButton" :rules="rules" formLabelWidth="120px" @clickAdd="menuClickAddInfo" @addConfirm="addConfirm" @clickRevise="reviseMenuInfo" @reviseConfirm="reviseConfirm" @clickDelete="clickDelete"/>
    <el-scrollbar class="aside scroll-y">
      <el-tree
        class="border-blue"
        :expand-on-click-node="false"
        empty-text
        default-expand-all
        :data="treeData"
        @node-click="clickNode"
        node-key="id"
        highlight-current
        ref="menuTree"
        :props="defaultProps"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span
            v-if="!data.child || data.child.length == 0"
            style="color:#00a8d4;font-size:14px;"
            class="icon iconfont"
          >&#xe606;</span>
          <!-- 文件图标闭合 -->
          <span
            v-if="data.child && data.child.length > 0 && !node.expanded"
            style="color:#00a8d4;font-size:14px;"
            class="icon iconfont"
          >&#xe642;</span>
          <!-- 文件图标展开 -->
          <span
            v-if="data.child && data.child.length > 0 && node.expanded"
            style="color:#00a8d4;font-size:12px;"
            class="icon iconfont"
          >&#xe602;</span>
          <span style="font-size: 14px;padding: 0 5px;">{{ node.label }}</span>
        </span>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
import { getOperButton, notIsChild, testTreeName } from '@/utils/data'
import { rule } from '@/utils'
import { addSmMenu, upSmMenu, delSmMenu } from '@/api/sysetsmM/menu'
import { mapGetters } from 'vuex'
import TabBar from '@/components/tabBar'
import { Message, Scrollbar, Tree } from 'element-ui'

export default {
  components: {
    TabBar,
    ElScrollbar: Scrollbar,
    ElTree: Tree
  },
  data() {
    const listLi = JSON.parse(JSON.stringify(this.$t('menuManage.listLi')));
    const rules = {
      menuCode: rule('isEmpty', this.$t("menuManage.menuRules.menuCode")),
      menuName: rule('isEmpty', this.$t("menuManage.menuRules.menuName"))
    }
    return {
      listLi,
      operButton: {},
      rules,
      defaultProps: {
        children: 'child',
        label: 'menuName'
      }
    }
  },
  computed: {
    ...mapGetters([
      'menuTree'
    ])
  },
  props: {
    treeData: {
      type: [Array, Object],
      default: []
    },
    curNode: {
      type: Object,
      default: {}
    },
    tableData: {
      type: [Array, Object],
      default: []
    },
    parentId: {
      type: String,
      default: ''
    }
  },
  created() {
    var code = this.$route.query.code;
    var url = this.$route.path;
    for (const v of this.menuTree.values()) {
      if (v.code == code) {
        this.operButton = getOperButton(v.child, url);
        break;
      }
    }
  },
  methods: {
    /**
     * 设置默认选中的值
     * @param {String} id 要选中的值
     */
    setCurrentKey(id) {
      this.$refs.menuTree.setCurrentKey(id);
    },
    /**
     * 点击添加菜单按钮
     */
    menuClickAddInfo() {
      this.$refs.tabBarTree.addShowAndHide(true)
    },
    /**
     * 点击增菜单加确认的回调
     */
    addConfirm(res) {
      const name = this.listLi.menuName.model;
      // 调用方法true证明有相同的menuName
      const id = this.curNode.id;
      const boole = testTreeName({ 
        tree: this.treeData,
        name,
        id,
        nameK: 'menuName',
        idK: 'id'
      });
      if (boole) {
        Message.error(this.$t('error.nameRepeat'));
        return;
      }
      var data = {};
      for (var key in res) {
        data[key] = res[key].model;
      }
      data.menuParentId = id;
      addSmMenu(data).then(res => {
        if (res.success) {
          Message({
            message: this.$t('success.add'),
            type: 'success'
          });
          this.$refs.tabBarTree.addShowAndHide(false)
          this.$emit('getMenuAll', data.menuParentId);
        }
      })
      .catch(err => {

      })
    },
    /**
     * 子组件点击修改菜单
     */
    reviseMenuInfo() {
      if (this.curNode.id == this.parentId) {
        Message.error(this.$t('error.menuRoot'));
        return;
      }
      for (var key in this.listLi) {
        //选中修改的参数赋值给弹窗
        var val = this.curNode[key];
        if (isNaN(+val) || !val) {
          this.listLi[key].model = val;
        } else {
          this.listLi[key].model = +val;
        }
      }
      this.$refs.tabBarTree.reviseShowAndHide(true)
    },
    /**
     * 子组件点击修改菜单确认
     */
    reviseConfirm(listLi) {
      const name = this.listLi.menuName.model;
      const id = this.curNode.id;
      // 调用方法true证明有相同的menuName
      const boole = testTreeName({
        tree: this.treeData,
        isUp: true,
        name,
        id,
        nameK: 'menuName',
        idK: 'id'
      });
      if (boole) {
        Message.error(this.$t('error.nameRepeat'));
        return;
      }
      var data = {};
      var that = this;
      for (var key in listLi) {
        data[key] = listLi[key].model;
      }
      data.menuParentId = this.curNode.menuParentId;
      data.id = id;
      upSmMenu(data).then(res => {
        if (res.success) {
          Message({
            message: this.$t('success.revise'),
            type: 'success'
          });
          this.$refs.tabBarTree.reviseShowAndHide(false)
          this.$emit('getMenuAll', id);
          this.$emit('setCurNode', res.result);
        }
      })
      .catch(err => {

      })
    },
    /**
     * 递归修改参数
     */
    reviseMenuTree(oldTree, id, curObj) {
      //obj为修改前的树，修改的节点id，curObj修改之后返回的对象
      for (const v of oldTree.values()) {
        //id相同的时候把返回的值除了child之外赋值给修改前的
        if (v.id == id) {
          for (var key in v) {
            if (key != 'child') {
              v[key] = curObj[key];
            }
          }
        } else {
          if (v.child && v.child.length) {
            this.reviseMenuTree(v.child, id, curObj);
          }
        }
      }
      return oldTree;
    },
    /**
     * 点击菜单删除
     */
    clickDelete() {
      const id = this.curNode.id;
      if (this.parentId === id) {
        Message.error(this.$t('error.menuRoot'));
        return;
      }
      var that = this;
      const boole = notIsChild(this.treeData, id);
      if (!boole) {
        Message.error(this.$t('error.menuNode'));
        return;
      }
      if (this.tableData.length > 0) {
        Message.error(this.$t('error.menuNextModel'));
        return;
      }
      delSmMenu(id).then(res => {
        if (res.success) {
          this.$refs.menuTree.remove(id);
          Message({
            type: 'success',
            message: this.$t('success.delete')
          });
          // 删除成功之后默认选中根节点
          this.$emit('setCurNode', this.treeData[0]);
          this.$refs.menuTree.setCurrentKey(this.treeData[0].id);
        }
      })
      .catch(err => {

      })
    },
    /**
     * 点击树节点
     */
    clickNode(data, node, parent) {
      this.$emit('setCurNode', data);
    },
  }
}
</script>

<style scoped>
.tree-aside {
  width: 250px;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.row-between {
  justify-content: space-between;
}
.row-center {
  justify-content: center;
}
.aside {
  flex: 1;
  width: 250px;
  margin-top: 10px;
}
.current {
  height: 32px;
}
</style>