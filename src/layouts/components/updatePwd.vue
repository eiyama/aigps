<template>
  <!-- 修改密码 -->
  <el-dialog :title="$t('home.revisePsw.title')" :close-on-click-modal="false"
   center :visible.sync="pswPop" :before-close="beforeClose" width="360px">
    <el-input v-model="revisePsw.oldPsw" type="password" :placeholder="$t('home.revisePsw.oldPsw')"></el-input>
    <el-input style="margin-top: 10px;" type="password" v-model="revisePsw.newPsw"
     :placeholder="$t('home.revisePsw.newPsw')"></el-input>
    <el-input style="margin-top: 10px;" type="password" v-model="revisePsw.confirmPsw"
     :placeholder="$t('home.revisePsw.confirmPsw')" @keyup.enter.native="confirmPsw"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button style="width: 100%;" type="primary" @click="confirmPsw">{{ $t('button.confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updatePassword } from '@/api/user'
import { Dialog, Message } from 'element-ui'

export default {
  components: {
    ElDialog: Dialog
  },
  data() {
    return {
      revisePsw: {},
      pswPop: false
    }
  },
  methods: {
    /**
     * 设置弹窗状态
     * @param {Boolean} state true显示，false隐藏
     */
    setState(state) {
      this.pswPop = state
    },
    /**
     * 关闭之前的回调
     * @param {Function} done 用来关闭弹窗
     */
    beforeClose(done) {
      this.$emit('close')
      this.revisePsw = {}
      done()
    },
    /**
     * 确认修改密码
     */
    confirmPsw() {
      if (!this.revisePsw.oldPsw) {
        Message.error(this.$t('error.msgOldPsw'));
        return;
      } else if (!this.revisePsw.newPsw) {
        Message.error(this.$t('error.msgNewPsw'));
        return;
      } else if (!this.revisePsw.confirmPsw) {
        Message.error(this.$t('error.msgConfirmPsw'));
        return;
      } else if (this.revisePsw.newPsw !== this.revisePsw.confirmPsw) {
        Message.error(this.$t('error.errorConfirmPsw'));
        return;
      } else if (this.revisePsw.newPsw === this.revisePsw.oldPsw) {
        Message.error(this.$t('error.pswNotTheSame'));
        return;
      }

      const data = {
        newPassword: this.revisePsw.newPsw,
        oldPassword: this.revisePsw.oldPsw
      }

      updatePassword(data).then(res => {
        if (res.success) {
          this.$emit('close')
          Message({
            message: this.$t('success.revisePsw'),
            type: 'success'
          })
        }
      })
    }
  }
}
</script>