<template>
  <!-- 提示用户是否替换视频 -->
  <el-dialog title="预览提示" :visible.sync="isShow" width="420px">
    <span>是否替换当前预览的窗口焦点？</span>
    <div slot="footer" class="dialog-foot">
      <el-checkbox v-model="check">以后不再提示</el-checkbox>
      <el-button size="small" @click="isShow = false">取 消</el-button>
      <el-button size="small" type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { Dialog, Checkbox } from 'element-ui'

export default {
  components: {
    ElDialog: Dialog,
    ElCheckbox: Checkbox
  },
  data() {
    return this.getData()
  },
  computed: {
    ...mapGetters([
      'isMsg'
    ])
  },
  methods: {
    getData() {
      return {
        isShow: false,
        check: false
      }
    },
    /**
     * 点击确认替换
     */
    handleConfirm() {
      if (this.check)
        this.$store.dispatch('alarm/upIsMsg', this.check)
      this.isShow = false
      this.$emit('handleConfirm')
    },
    /**
     * 显示弹窗
     */
    show() {
      this.isShow = true
    }
  }
}
</script>