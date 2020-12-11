<template>
  <div class="left-box">
    <div class="title">{{ $t('divisionManage.leftTitle.title') }}</div>
    <div class="left-content">
      <div class="type-bar row-PL">
        <tab-bar ref="tabBar" isBoxMin :listLi="listLi" :operButton="operButton" :rules="rules" @clickAdd="clickAddInfo" @addConfirm="addConfirm" @clickRevise="handleRevise" @reviseConfirm="reviseConfirm" @clickDelete="clickDelete" @clickRefresh="clickReloadNode('#left-tree')" />
        <div class="search-bar">
          <el-input v-model="searchVal" :placeholder="$t('placeholder.dptName')" class="search-input" size="small" @keyup.enter.native="upEnter">
            <i slot="suffix" class="el-input__icon search el-icon-search" @click="upEnter"></i>
          </el-input>
        </div>
      </div>
      <el-scrollbar class="scroll-y" id="left-tree" width="100%" style="flex:1;">
        <el-tree class="border-blue" :expand-on-click-node="false" empty-text :default-expanded-keys="openKeys" :data="tree" @node-click="handleNode" node-key="id" highlight-current ref="leftTree" draggable :props="defaultProps" :filter-node-method="filterNode" @node-drop="nodeDrop" :allow-drop="allowDrop">
          <!-- draggable该属性用于拖拽 -->
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <!-- 父节点展开的图标 -->
            <span v-if="data.child && data.child.length && node.expanded" style="color:#00a8d4;font-size:12px;" class="icon iconfont">&#xe602;</span>
            <!-- 父节点闭合的图标 -->
            <span v-if="data.child && data.child.length && !node.expanded" style="color:#00a8d4;font-size:14px;" class="icon iconfont">&#xe642;</span>
            <span v-if="data.select" style="font-size: 14px;background: #00a8d4;color: #fff;padding: 0 5px;" >{{ node.label }}</span>
            <span v-if="!data.select" style="font-size: 14px;padding: 0 5px;">{{ node.label }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, parentId, testTreeName, notIsChild } from '@/utils/data'
import { getCopyObj } from '@/utils/util'
import { rule } from '@/utils'
import { getDepartmentAll, smMove, addSmDpt, upSmDpt, delSmDpt } from '@/api/sysetsmM/dpt'
import TabBar from '@/components/tabBar'
import { MessageBox, Message, Scrollbar, Tree } from 'element-ui'
export default {
  components: {
    TabBar,
    ElTree: Tree,
    ElScrollbar: Scrollbar
  },
  data() {
    const listLi = getCopyObj(this.$t('divisionManage.leftTitle.listLi'));
    const rules = {
      dptName: rule('isEmpty', this.$t('divisionManage.leftTitle.rules.dptName')),
      dptCode: rule('isEmpty', this.$t('divisionManage.leftTitle.rules.dptCode')),
      contractPhone: rule('isPhone', this.$t('divisionManage.leftTitle.rules.contractPhone'), true)
    }
    return {
      listLi,
      rules,
      parentId,
      operButton: {},
      searchVal: '',
      openKeys: [],
      tree: [],
      defaultProps: {
        children: "child",
        label: "dptName"
      },
      curNode: {},
      parentNode: {}
    }
  },
  props: {
    evBus: {
      type: Object,
      default: {}
    }
  },
  computed: {
    ...mapGetters([
      'menuTree',
      'userInfo'
    ])
  },
  created() {
    var code = this.$route.query.code;
    var url = this.$route.path;
    for (const v of this.menuTree.values()) {
      if (v.code == code) {
        this.operButton = getOperButton(v.child, url);
        this.operButton.refresh = true;
        break;
      }
    }
    this.clickReloadNode();
  },
  methods: {
    /**
     * 根据参数过滤树
     */
    filterNode(value, data) {
      if (!value) return true;
      if (data.dptName.toUpperCase().indexOf(value.toUpperCase()) !== -1) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * 点击刷新部门
     */
    clickReloadNode(dom, id) {
      const { userInfo } = this
      getDepartmentAll({ id: userInfo.id, dom }).then(res => {
        if (res.success) {
          var list = res.result.items;
          this.tree = list;
          if (!id) {
            this.curNode = list[0];
            this.parentNode = list[0];
            this.openKeys.push(list[0].id);
          } else {
            this.evBus.$emit('handleNode', this.curNode);
          }
          this.$nextTick(() => {
            this.$refs.leftTree.setCurrentKey(id || list[0].id);
          });
        }
      })
      .catch(err => {

      });
    },
    /**
     * 点击添加
     */
    clickAddInfo() {
      this.$refs.tabBar.addShowAndHide(true);
    },
    /**
     * 点击添加确定
     */
    addConfirm(res) {
      const name = res.dptName.model;
      const id = this.curNode.id;
      const isRepeat = testTreeName({
        tree: this.tree,
        id,
        name,
        idK: 'id',
        nameK: 'dptName'
      });
      
      if (isRepeat) {
        Message.error(this.$t('error.nameRepeat'));
        return;
      }
      var obj = {};
      for (var key in res) {
        obj[key] = res[key].model;
      }
      obj.dptParentId = id;
      addSmDpt(obj).then(res => {
        if (res.success) {
          Message({
            message: this.$t('success.add'),
            type: 'success'
          });
          this.$refs.tabBar.addShowAndHide(false);
          this.$refs.leftTree.append(res.result, obj.dptParentId);
        }
      })
      .catch(err => {

      });
    },
    /**
     * 点击修改部门
     */
    handleRevise() {
      const curId = this.curNode.id;
      const parentId = this.parentNode.id;
      const dataFlag = this.parentNode.dataFlag;
      if (curId == parentId && dataFlag) {
        Message.error(this.$t('error.menuRoot'));
        return;
      }
      for (const [k, v] of Object.entries(this.listLi)) {
        // 选中修改的参数赋值给弹窗
        v.model = this.curNode[k];
      }
      this.$refs.tabBar.reviseShowAndHide(true);
    },
    /**
     * 点击修改确定
     */
    reviseConfirm(listLi) {
      const id = this.curNode.id;
      const name = listLi.dptName.model;
      const isRepeat = testTreeName({
        tree: this.tree,
        id,
        name,
        idK: 'id',
        nameK: 'dptName',
        isUp: true
      });
      // 调用方法true证明有相同的menuName
      if (isRepeat) {
        Message.error(this.$t('error.nameRepeat'));
        return;
      }
      var obj = {};
      for (var key in listLi) {
        obj[key] = listLi[key].model;
      }
      obj.dptParentId = this.curNode.dptParentId;
      obj.id = id;
      const sortNum = this.curNode.sortNum;
      upSmDpt(obj).then(res => {
        if (res.success) {
          this.$refs.tabBar.reviseShowAndHide(false);
          this.curNode = res.result;
          this.clickReloadNode(null, res.result.id);
          Message({
            message: this.$t('success.revise'),
            type: "success"
          });
        }
      })
      .catch(err => {

      });
    },
    /**
     * 点击删除
     */
    clickDelete() {
      var id = this.curNode.id;
      if (this.parentNode.id == id) {
        Message.error(this.$t('error.menuRoot'));
        return;
      }
      const isRepeat = notIsChild(this.tree, id);
      if (!isRepeat) {
        Message.error(this.$t('error.dptNode'));
        return;
      }
      MessageBox.confirm(this.$t('message.delete'), this.$t('message.title'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: "warning"
      })
        .then(() => {
          delSmDpt(id).then(res => {
            if (res.success) {
              this.$refs.leftTree.remove(id);
              Message({
                type: "success",
                message: this.$t('success.delete')
              });
              //删除成功之后默认选中根节点
              this.curNode = this.tree[0];
              this.$refs.leftTree.setCurrentKey(id);
            }
          })
          .catch(err => {
          });
        })
        .catch(() => {});
    },
    /**
     * 部门节点被拖拽之后能否放置
     */
    allowDrop(draggingNode, dropNode, type) {
      // 'prev'、'inner' 和 'next',分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
      var parentId = this.tree[0].id;
      // 拖拽之前的节点父级id
      var oldParentID = draggingNode.data.dptParentId;
      // 拖拽之后父级的id
      var newParentID = dropNode.parent.data.id;
      if (type == "prev" || type == "next") {
        // 不允许拖拽到根节点之外
        if (dropNode.data.id == parentId) {
          return false;
        } else {
          // id相同证明只是同一级拖拽，不允许在同一级拖拽
          if (oldParentID == newParentID) {
            return false;
          } else {
            return true;
          }
          return true;
        }
      } else {
        return true;
      }
    },
    /**
     * 拖拽成功之后
     */
    nodeDrop(draggingNode, dropNode, type) {
      // 当前节点id
      const curId = draggingNode.data.id;
      // 拖拽之前父级的id
      this.dropRequst(curId);
    },
    /**
     * 拖拽之后的请求
     * @param {String} currentID 当前id
     */
    dropRequst(currentID) {
      // 获取拖拽之后的node节点，注意nodeDrop的回调dropNode参数有问题
      const node = this.$refs.leftTree.getNode(currentID);
      // 拖拽之后父级的id
      var newParentID = node.parent.data.id;
      smMove({ currentID, newParentID }).then(res => {
        if (res.success) {
          node.data.dptParentId = newParentID;
          Message({
            type: 'success',
            message: this.$t('divisionManage.nodeDropSuc'),
          });
        } else {
          Message.error(this.$t('divisionManage.nodeDropErr'));
          this.clickReloadNode();
        }
      })
      .catch(err => {
      });
    },
    //点击左边树
    handleNode(data, node, my) {
      this.curNode = data;
      if (data.id === this.parentNode.id) return;
      // 中间初始化选中的节点id
      this.evBus.$emit('handleNode', data, true);
    },
    /**
     * 回车键或点击搜索图标过滤树
     */
    upEnter() {
      const val = this.searchVal;
      if (!val || val.length >= 2) {
        this.$refs.leftTree.filter(val);
      }
    }
  }
}
</script>

<style scoped>
.title {
  height: 30px;
  padding: 10px 0 0;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
}
.left-box,
.center-box,
.right-box {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-right: 20px;
}
.right-box {
  margin: 0 0 0 20px;
}
.left-box .left-content,
.center-box .center-content,
.right-box .right-content {
  flex: 1;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 1px;
}

.type-bar {
  overflow: hidden;
  height: 40px;
  border-bottom: 1px solid #ddd;
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
  margin: 4px 0 0 !important;
  box-sizing: border-box;
  border: 1px solid #fff;
}
.type-bar span:hover {
  border: 1px solid #dedede;
  border-radius: 2px;
}
.type-bar .search-bar {
  float: right;
  position: relative;
  top: 4px;
  right: 5px;
}
.type-bar .search-bar .search-input {
  width: 160px;
}
.type-bar .search-bar .search {
  cursor: pointer;
  font-size: 16px;
}

.type-bar .left {
  float: left;
  margin: 11px 0 0 10px;
  line-height: 19px;
  font-size: 14px;
  color: #00a8d4;
}
</style>