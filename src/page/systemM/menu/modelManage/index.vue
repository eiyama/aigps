<!-- 模块操作管理 -->
<template>
	<div class="container" >
		<div class="tree-box">
			<el-scrollbar class="scroll-y" style="flex:1;width: 100%;">
				<el-tree class="float-children border-blue" :expand-on-click-node="false" empty-text :data="treeData" show-checkbox node-key="code" highlight-current default-expand-all ref="tree" :props="defaultProps">
					<!-- type为3添加一个node-left使用js使其父级浮动 -->
					<span :class="data.type == '3' ? 'node-left' : ''" class="custom-tree-node" slot-scope="{ node, data }">
            <!-- 文件夹图标展开 -->
						<span v-if="data.child && data.child.length > 0 && node.expanded" style="color:#00a8d4;font-size:12px;" class="icon iconfont">&#xe602;</span>
            <!-- 文件夹图标闭合 -->
						<span v-if="data.child && data.child.length > 0 && !node.expanded" style="color:#00a8d4;font-size:14px;" class="icon iconfont">&#xe642;</span>
						<span>{{ node.label }}</span>
					</span>
				</el-tree>
			</el-scrollbar>
			<div class="submit-bar row-center">
				<el-button class="button" @click="submit" type="primary" size="small">{{ $t('button.submit') }}</el-button>
				<!-- <el-button class="button" type="primary" size="small">{{ $t('button.prve') }}</el-button> -->
			</div>
		</div>
	</div>
</template>

<script>
import { getModuleOperationAll, addModuleOperationAll } from '@/api/sysetsmM/menu'
import { Tree, Scrollbar, Message } from 'element-ui'

export default {
  name: 'ModelManage',
  components: {
    ElScrollbar: Scrollbar,
    ElTree: Tree
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      }
    }
  },
  created() {
    this.getTree();
  },
  methods: {
    //获取树的dom节点
    getTreeDom() {
      var Anode = document.getElementsByClassName('node-left');
      if (Anode.length > 0) {
        for (var i = 0; i < Anode.length; i++) {
          // 获取该元素的父级元素
          var parentNode = Anode[i].parentNode;
          var prevClass = parentNode.className;
          // 在父级原来的基础上添加一个浮动的类名
          parentNode.className = `${prevClass} floatLeft`;
        }
      } else {
        setTimeout(() => {
          this.getTreeDom();
        }, 100);
      }
    },
    getTree() {
      getModuleOperationAll().then(res => {
        if (res.success && res.result.items) {
          var tree = res.result.items;
          this.treeData = tree;
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(tree[0].id);
            var ids = this.getOperationId(tree);
            // 由于mounted里面获取不到节点，所以使用递归，如果没有值就100ms调用一次
            this.getTreeDom();
            for (const v of ids.values()) {
              this.$refs.tree.setChecked(v, true);
            }
          });
        }
      })
      .catch(err => {

      });
    },
    /**
     * 递归获取需要勾选的id
     * @param {Array} tree 树数据
     */
    getOperationId(tree) {
      let ids = [];
      for (const v of tree.values()) {
        if (v.type == '3' && v.state) {
          ids.push(v.code);
        }
        if (v.child && v.child.length) {
          ids = [...this.getOperationId(v.child), ...ids];
        }
      }
      return ids;
    },
    /**
     * 提交请求
     */
    submit() {
      //获取所有选中的节点返回一个array
      var curNode = this.$refs.tree.getCheckedNodes();
      //获取半选中的节点返回一个array
      var halfNode = this.$refs.tree.getHalfCheckedNodes();
      var modelIdList = {};
      modelIdList.inputs = [];
      //调用这个方法，将所有的选中的type为3的操作返回出来
      var arr = [],
      arr2 = [];
      arr = this.getModelOperationId(curNode, curNode);
      arr2 = this.getModelOperationId(halfNode, curNode);
      arr = [...arr, ...arr2];
      modelIdList.inputs = arr;
      addModuleOperationAll(modelIdList).then(res => {
        if (res.success) {
          Message({
            type: 'success',
            message: this.$t('success.add')
          });
        }
      })
      .catch(err => {
        
      });
    },
    /**
     * 获取模块和id和操作id组成的数组
     */
    getModelOperationId(arr, selectArr) {
      var arr2 = [];
      for (const v of arr.values()) {
        if (v.type == '2' && v.child && v.child.length) {
          arr2.push({
            moduleId: v.id,
            operationId: this.getArrayId(v.child, selectArr),
          });
        }
      }
      return arr2;
    },
    /**
     * 遍历将操作id拼接成一个数组
     */
    getArrayId(arr, selectArr) {
      var arr2 = [];
      for (const v of arr.values()) {
        for (const e of selectArr.values()) {
          if (v.type == '3' && v.code == e.code) {
            arr2.push(v.id);
          }
        }
      }
      return arr2;
    }
  }
}
</script>

<style scoped>
.container {
  flex: 1;
  padding: 5px;
  background: #fff;
  display: flex;
  border: none;
  flex-direction: column;
  overflow: hidden;
}
.tree-box {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid #ddd;
  border-top: none;
  overflow: hidden;
}
.submit-bar {
  padding: 10px;
  overflow: hidden;
}
.submit-bar .btn {
  float: right;
  margin-left: 10px;
}
</style>