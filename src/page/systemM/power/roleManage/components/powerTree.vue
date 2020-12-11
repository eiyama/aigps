<template>
  <div v-show="curIndex === 0" class="wrap">
    <!-- 分配权限 -->
    <el-scrollbar class="scroll-y" style="flex:1;width: 100%;">
      <el-tree class="float-children border-blue" :expand-on-click-node="false" empty-text
        :data="treeData" show-checkbox node-key="code" highlight-current
        default-expand-all ref="tree" :props="defaultProps">
        <!-- type为3添加一个node-left使用js使其父级浮动 -->
        <span :class="data.type == '3' ? 'node-left' : ''" class="custom-tree-node" slot-scope="{ node, data }">
          <!--文件图标闭合  -->
          <span v-if="data.child && data.child.length > 0 && !node.expanded"
            style="color:#00a8d4;font-size:14px;" class="icon iconfont">&#xe642;</span>
          <!-- 文件图标展开 -->
          <span v-if="data.child && data.child.length > 0 && node.expanded"
            style="color:#00a8d4;font-size:12px;" class="icon iconfont">&#xe602;</span>
          <span style="font-size: 14px;padding: 0 5px;">{{ node.label }}</span>
        </span>
      </el-tree>
    </el-scrollbar>
    <div class="submit-bar row-center">
      <el-button class="btn" @click="submit" type="primary" size="small">{{ $t('button.submit') }}</el-button>
    </div>
  </div>
</template>

<script>
import { testTreeName, notIsChild, getOperationId } from '@/utils/data'
import { getOperationTree, submitRole } from '@/api/sysetsmM/power'
import { Message, Scrollbar, Tree } from 'element-ui'

export default {
  components: {
    ElScrollbar: Scrollbar,
    ElTree: Tree
  },
  data() {
    return {
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      treeData: []
    }
  },
  props: {
    curIndex: {
      type: Number,
      default: 0
    },
    curNode: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    /**
     * 请求数据
     */
    requestInfo(id) {
      getOperationTree(id).then(res => {
        if (res.result) {
          const tree = res.result.items;
          this.treeData = tree;
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(tree[0].id);
            var ids = getOperationId(tree);
            for (const v of Object.values(ids)) {
              this.$refs.tree.setChecked(v, true);
            }
            // 先获取所有的node-left的元素
            const aAnode = document.getElementsByClassName('node-left');
            let i = 0;
            while (i < aAnode.length) {
              // 获取该元素的父级元素
              const parentNode = aAnode[i].parentNode;
              const prevClass = parentNode.className;
              // 在父级原来的基础上添加一个浮动的类名
              parentNode.className = `${prevClass} floatLeft`;
              i++;
            }
          });
        }
      })
      .catch(err => {

      });
    },
    /**
     * 点击提交按钮
     */
    submit() {
      if (!this.treeData.length) return
      // 获取所有选中的节点返回一个array
      const arr = this.$refs.tree.getCheckedNodes();
      const data = {
        moduleOperationIds: this.getOperationIds(arr),
        roleId: this.curNode.id
      }
      submitRole(data).then(res => {
        if (res.result) {
          if (res.success) {
            Message({
              type: 'success',
              message: this.$t('success.add')
            })
          }
        }
      })
      .catch(err => {

      })
    },
    /**
     * 获取树节点选中的模块id
     */
    getOperationIds(tree) {
      let ids = []
      for (const v of tree.values()) {
        if (v.type === 3) {
          ids.push(v.id)
        }
      }
      return ids
    }
  }
}
</script>

<style scoped>
.wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.submit-bar {
  padding: 10px;
}
.submit-bar .btn {
  margin: 0 5px;
}
</style>