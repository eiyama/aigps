<template>
  <el-dialog
    title="车藉地"
    width="646px"
    :close-on-click-modal="false"
    :visible.sync="isShow"
    @close="handleClose">
    <div class="wrapper">
      <div class="row">
        <el-select v-model="province.val" size="small" @change="changeProvince">
          <el-option
            v-for="item of province.list"
            :key="item.id"
            :label="item.text"
            :value="item.id"
          />
        </el-select>
        <el-select v-model="city.val" size="small" @change="changeCity">
          <el-option
            v-for="item of city.list"
            :key="item.id"
            :label="item.text"
            :value="item.id"
          />
        </el-select>
        <el-select v-model="area.val" size="small">
          <el-option
            v-for="item of area.list"
            :key="item.id"
            :label="item.text"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="info-box border">
        <div class="title">【数据核对区】</div>
        <div class="li">
          <span class="label">省编号：</span>
          <span class="val">{{ province.val }}</span>
        </div>
        <div class="li">
          <span class="label">市编号：</span>
          <span class="val">{{ city.val }}</span>
        </div>
        <div class="li">
          <span class="label">区编号：</span>
          <span class="val">{{ area.val }}</span>
        </div>
        <div class="li">
          <span class="label">手动输入：</span>
          <el-input v-model="val" size="small" @input.native="changeInput" @keydown="changeInput" />
          <span class="msg">如果编码不匹配可采取手动输入</span>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="isShow = false">取 消</el-button>
      <el-button type="primary" size="small" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Select, Option, Button, Input, Dialog, Message } from 'element-ui'
import address from '@/utils/address'

export default {
  components: {
    ElSelect: Select,
    ElButton: Button,
    ElInput: Input,
    ElOption: Option,
    ElDialog: Dialog
  },
  data() {
    return {
      isShow: false,
      province: {
        val: '',
        list: []
      },
      city: {
        val: '',
        list: []
      },
      area: {
        val: '',
        list: []
      },
      val: ''
    }
  },
  created() {
    
  },
  methods: {
    /**
     * 关闭弹窗前的回调
     */
    handleClose(next) {
      const { province, city, area } = this
      this.$set(province, 'val', '')
      this.$set(city, 'val', '')
      this.$set(city, 'list', [])
      this.$set(area, 'val', '')
      this.$set(area, 'list', [])
      this.val = ''
    },
    /**
     * 改变显示隐藏的状态
     * @param {Boolean} state true显示，false隐藏
     */
    changeState(state) {
      this.isShow = state
    },
    /**
     * 初始化
     * @param {String} id 区编码
     */
    initData(id) {
      const { province } = this
      this.changeState(true)
      if (!province.list.length) {
        const rule = /0{4}$/
        for (const [k, v] of Object.entries(address)) {
          if (rule.test(k)) {
            const obj = {
              id: k,
              text: v
            }
            this.province.list.push(obj)
          }
        }
      }
      if (id) {
        this.changeInput(id)
      }
    },
    /**
     * 选择省份
     */
    changeProvince(val) {
      const { province, city, area } = this
      area.list = []
      city.list = []
      // 新疆特殊的市级区
      const othere = ['659001', '659002', '659003', '659004', '659005', '659006', '659007', '659008', '659009']
      this.$set(area, 'val', '')
      this.$set(city, 'val', '')
      this.$set(province, 'val', val)
      const str = val.substring(0, 2)
      const rule2 = eval(`/^${str}/`)
      const rule = /0{2}$/
      const arr = []
      const boole = rule2.test(othere[0])
      for (const [k, v] of Object.entries(address)) {
        if (rule2.test(k) && k !== val) {
          const obj = {
            id: k,
            text: v
          }
          arr.push(obj)
        }
      }

      if (!arr.length) {
        const obj = province.list.find(e => e.id === val)
        if (obj) {
          city.list.push(obj)
        }
        return
      }

      const arr2 = arr.reduce((initArr, v) => {
        if (rule.test(v.id)) {
          initArr.push(v)
        } else if (boole) {
          const i = othere.findIndex(e => e === v.id)
          if (i > -1) {
            initArr.push(v)
          }
        }
        return initArr
      }, [])

      if (arr2.length) {
        this.$set(city, 'list', arr2)
      } else {
        this.$set(city, 'list', arr)
      }
    },
    /**
     * 选择城市
     */
    changeCity(val) {
      const { city, area } = this
      this.$set(area, 'list', [])
      this.$set(area, 'val', '')
      this.$set(city, 'val', val)
      const rule2 = /0{2}$/
      const rule3 = /0{4}$/
      
      if (rule2.test(val) && !rule3.test(val)) {
        const str = val.substring(0, 4)
        const rule = eval(`/^${str}/`)
        for (const [k, v] of Object.entries(address)) {
          if (rule.test(k) && k !== val) {
            const obj = {
              id: k,
              text: v
            }
            area.list.push(obj)
          }
        }
      }


      // 市下面没有区、市级区与香港台湾等特殊地区
      if (!area.list.length) {
        const obj = city.list.find(e => e.id === val)
        if (obj) {
          area.list.push(obj)
        }
      }
    },
    /**
     * 输入框编辑
     */
    async changeInput(e) {
      let key = e
      if (e.target) {
        key = e.target.value.trim()
      }
      if (key.length !== 6) {
        return
      }

      const val = address[key]
      if (!address[key]) {
        Message.error('请输入正确的区编号！')
        return
      }
      const { province, city, area } = this
      let provinceCode = `${key.substring(0, 2)}0000`
      let cityCode = `${key.substring(0, 4)}00`
      let areaCode
      let rule = eval(`/^${key.substring(0, 2)}/`)
      let boole = true

      // 市下面没有区、市级区与香港台湾等特殊地区
      if (provinceCode === key || (provinceCode !== key && cityCode === key)) {
        boole = false
        if (provinceCode !== key) {
          rule = eval(`/^${key.substring(0, 4)}/`)
        }
        for (const [k, v] of Object.entries(address)) {
          if (k !== key && rule.test(k)) {
            boole = true
            break
          }
        }
      }
      
      if (provinceCode !== key && provinceCode !== cityCode && address[cityCode] && cityCode !== key) {
        areaCode = key
      } else if ((provinceCode !== key  && !address[cityCode] &&  cityCode !== key) || !boole) {
        cityCode = key
        areaCode = key
      } else {
        Message.error('请输入正确的区编号！')
        return
      }
      this.changeProvince(provinceCode)
      await this.$nextTick()
      this.changeCity(cityCode)
      await this.$nextTick()
      this.$set(area, 'val', areaCode)
    },
    /**
     * 点击确认
     */
    handleOk() {
      const { area } = this
      this.isShow = false
      if (!area.val) {
        return
      }
      const obj = area.list.find(e => e.id === area.val)
      this.$emit('handleOk', obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body {
  padding: 10px 20px 20px;
}
.wrapper {
  .row {
    display: flex;
    justify-content: space-between;
  }
  .info-box {
    // border: 1px solid #DCDFE6;
    margin: 10px 0 0;
    padding: 20px 10px 10px;
    .title {
      font-size: 16px;
      font-weight: bold;
      padding: 0 0 10px;
    }
    .li {
      display: flex;
      line-height: 32px;
      .el-input {
        width: 160px;
      }
      .msg {
        color: red;
        margin: 0 0 0 10px;
        font-size: 12px;
      }
    }
  }
}
</style>