<template>
  <div class="popup">
    <!-- 点击导入的弹窗 -->
    <el-dialog :title="$t('carManage.uploadInfo.title')" :close-on-click-modal="false" width="570px" :visible.sync="isShow1">
      <span>{{ $t('carManage.uploadInfo.tip') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isShow1 = false">{{ $t('button.cancel') }}</el-button>
        <el-button size="small" type="primary" @click="downloadTemplate">{{ $t('carManage.uploadInfo.downTemplate') }}</el-button>
        <el-button size="small" type="primary" @click="upload">{{ $t('carManage.uploadInfo.upload') }}</el-button>
      </span>
    </el-dialog>
    <!-- 点击上传文件的弹窗 -->
    <el-dialog :title="$t('carManage.uploadInfo.title')" :close-on-click-modal="false" @close="uploadPopupClose"
      width="620px" :visible.sync="isShow2">
      <div class="upload-box">
        <!-- 部门选择 -->
        <div class="tree-model margin-bottom">
          <div @click.stop class="el-input input-max el-input--small">
            <el-input v-model="uploadInfo.dptName" :placeholder="$t('carManage.uploadInfo.msgMenu')"
              size="small" @click.native.stop="focus" @input.native="changeVal" @clear="clear" auto-complete="off" clearable/>
          </div>
          <div v-show="isShow3" @click.stop class="tree-box border">
            <el-scrollbar class="dtp-tree scroll-y">
              <el-tree class="border-blue" ref="dptTree" :expand-on-click-node="false"
                empty-text :default-expanded-keys="openKeys" :data="dptTree" accordion
                @node-click="uploadHandleNodeClick" node-key="id" highlight-current
                :props="defaultProps" :filter-node-method="filterNode"></el-tree>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <el-upload ref="upload" class="upload-demo" drag action="" :auto-upload="false" :file-list="fileList" 
      @drop.native.prevent="handleChange" @change.native="handleChange" :on-remove="clearFile"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{ $t('carManage.uploadInfo.drapUpload') }}
          <em>{{ $t('carManage.uploadInfo.clickUpload') }}</em>
        </div>
        <div class="el-upload__tip" slot="tip">{{ $t('carManage.uploadInfo.msgXlsx') }}</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isShow2 = false">{{ $t('button.cancel') }}</el-button>
        <el-button size="small" type="primary" @click="uploadConfirm">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Upload, Input, Button, Dialog, Tree, Scrollbar, Message } from 'element-ui'
// import { copyObj } from '@/utils/util'
import { uploadFlowControl } from '@/api/loadManage/flowControl'

export default {
  components: {
    ElUpload: Upload,
    ElInput: Input,
    ElButton: Button,
    ElDialog: Dialog,
    ElTree: Tree,
    ElScrollbar: Scrollbar
  },
  data() {
    return {
      isShow1: false,
      isShow2: false,
      isShow3: false,
      uploadInfo: {},
      fileList: [],
      formData: null,
      oldVal: '',
      dptTree: [],
      openKeys: [],
      defaultProps: {
        children: 'child',
        label: 'dptName'
      },
      isRoot: false
    }
  },
  created() {
    
  },
  mounted() {
    document.documentElement.addEventListener('click', this.handleWin)
  },
  beforeDestroy() {
    document.documentElement.removeEventListener('click', this.handleWin)
  },
  methods: {
        /**
     * 设置部门名称的tree数据
     */
    setDptNameTree(tree) {
      this.dptTree = tree
      this.openKeys.push(tree[0].id)
    },
    /**
     * 点击导入打开导入弹窗
     */
    setState(state) {
      this.isShow1 = state;
    },
    /**
     * 点击窗口关闭树节点
     */
    handleWin() {
      this.isShow3 = false;
    },
    /**
     * 下载模板
     */
    downloadTemplate() {
      location.href = process.env.VUE_APP_BASEURL + 'report/templateFlow.xlsx';
    },
    /**
     * 点击导入
     */
    upload() {
      this.isShow1 = false;
      this.isShow2 = true;
    },
    /**
     * 上传文件弹窗关闭
     */
    uploadPopupClose() {
      // 清除文件列表
      this.fileList = [];
      this.formData = null;
      // 清除输入框的参数
      for (var key in this.uploadInfo) {
        this.uploadInfo[key] = '';
      }
    },
    /**
     * 选择部门树的输入框触发焦点
     */
    focus() {
      this.isShow3 = true;
    },
    /**
     * 导入的部门选择的输入框的input事件
     */
    changeVal(ev) {
      const val = ev.target.value;
      // 通过优化输入来尽量减少调用过滤的方法
      if (this.oldVal === val) return;
      this.uploadInfo.dptId = '';
      this.oldVal = val;
      setTimeout(() => {
        if (val === this.oldVal) {
          if (!val || val.length >= 2) {
            this.$refs.dptTree.filter(val);
          }
        }
      }, 400)
    },
    /**
     * 点击输入框的清除
     */
    clear() {
      this.uploadInfo.dptId = '';
      this.$refs.dptTree.filter('');
    },
    /**
     * 导入的部门树点击节点
     */
    uploadHandleNodeClick(data, node) {
      this.$set(this.uploadInfo, 'dptName', data.dptName);
      this.uploadInfo.dptId = data.id;
      this.isShow3 = false;
    },
    /**
     * 树过滤
     */
    filterNode(value, data) {
      if (!value) return true;
      // 搜索框的值
      var val = value.toUpperCase();
      var dptName = data.dptName.toUpperCase();
      if (dptName.indexOf(val) !== -1) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * 原生的选择文件之后的事件
     */
    handleChange(e) {
      let file = null;
      if (e.dataTransfer) {
        // 拖拽进来的时候
        file = e.dataTransfer.files[0];
      } else {
        // 鼠标选择的时候
        file = e.target.files[0];
      }
      // console.log(file);
      const isLt4M = file.size;
      if (isLt4M / 1024 / 1024 > 4) {
        Message(this.$t('carManage.uploadInfo.max4M'));
        return;
      }
      let fd = new FormData();
      fd.append('uploadFile', file);
      this.formData = fd;
      this.fileList = [];
      this.fileList.push(file);
    },
    /**
     * 清除文件
     */
    clearFile(file, fileList) {
      this.fileList = [];
      this.formData = null;
    },
    /**
     * 确认上传文件
     */
    uploadConfirm() {
      const i18n = this.$t('carManage.uploadInfo');
      const dptId = this.uploadInfo.dptId;
      if (!dptId) {
        Message.error(i18n.msgMenu);
        return;
      } else if (!this.formData) {
        Message.error(i18n.msgFile);
        return;
      }
      uploadFlowControl(this.formData, { dptId }).then(res => {
        if (res.success) {
          Message({
            type: 'success',
            message: `${i18n.msgSuccess}${res.result}${i18n.unit}`
          });
          this.fileList = [];
          this.formData = null;
          // 成功关闭弹窗
          this.isShow2 = false;
        }
      })
      .catch(err => {

      });
    }
  }
}
</script>

<style scoped>
.upload-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tree-model {
  position: relative;
  width: 220px;
  display: inline-block;
}
.input-max {
  width: 100%;
}
.tree-box {
  position: absolute;
  top: 42px;
  left: -10px;
  z-index: 999999;
  background: #fff;
  width: 240px;
  height: 300px;
  box-shadow: 0 1px 5px #666;
  display: flex;
  flex-direction: column;
}
.dtp-tree {
  flex: 1;
}
</style>