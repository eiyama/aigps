<template>
  <div class="alarm-setting">
    <el-dropdown trigger="click">
      <el-tooltip class="item" effect="dark" :content="$t('button.setAlarm')" placement="bottom">
        <h5 class="setting icon el-icon-setting"></h5>
      </el-tooltip>
      <el-dropdown-menu ref="alarmSet" class="set-alarm" slot="dropdown">
        <div class="set-box">
          <h5>报警过滤</h5>
          <div class="ul">
            <div v-for="(v, i) of alarmList" :key="i" class="li">
              <div class="all">
                <h6>{{ v.label }}</h6>
                <el-checkbox v-model="v.checked" @change="handleCheckAllChange(i)">{{ v.title }}</el-checkbox>
              </div>
              <ul>
                <li v-for="(item, j) of v.options" :key="j">
                  <el-checkbox v-model="item.checked" @change="handleCheckChange(i, j)">{{ item.label }}</el-checkbox>
                </li>
              </ul>
            </div>
          </div>
          <el-button @click="handleSetAlarm" class="alarm-btn" size="small" type="primary">{{ $t('button.confirm') }}</el-button>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<style scoped>
.setting {
  cursor: pointer;
  color: #fff;
  font-size: 22px;
  line-height: 22px;
  margin: 12px 0 0;
}

.alarm-setting {
  float: right;
  position: relative;
}

.set-alarm >>> .set-box {
  width: 800px;
}
.set-alarm >>> h5 {
  padding: 0 14px 10px;
  border-bottom: #d3dce6 1px solid;
}
.set-alarm >>> .ul {
  padding: 0 20px;
}
.set-alarm >>> .li {
  border-bottom: #d3dce6 1px solid;
}
.set-alarm >>> .li:last-child {
  border: none;
}
.set-alarm >>> .all {
  overflow: hidden;
  padding: 6px 0 0;
}
.set-alarm >>> .all h6, .set-alarm >>> .all label {
  float: left;
}
.set-alarm >>> .all h6 {
  margin: 0 10px 0 0;
  width: 120px;
}
.set-alarm >>> ul {
  overflow: hidden;
  padding: 0 0 10px;
  margin: 0 -10px 0 0;
}
.set-alarm >>>  .li:last-child ul {
  padding: 0;
}
.set-alarm >>> ul li {
  float: left;
  padding: 6px 0 0;
  margin: 0 10px 0 0;
}
.set-alarm >>> label .el-checkbox__label {
  padding-left: 5px;
  font-size: 13px;
}
.set-alarm >>> .alarm-btn {
  display: block;
  margin: 20px auto 0;
}
</style>

<script>
import { updateAlarmConfigByUserId } from '@/api/alarm'
import { getCopyObj } from '@/utils/util'

import { Dropdown, DropdownMenu, Tooltip, Checkbox, Message } from 'element-ui'

export default {
  components: {
    ElDropdown: Dropdown,
    ElDropdownMenu: DropdownMenu,
    ElTooltip: Tooltip,
    ElCheckbox: Checkbox
  },
  data() {
    return {
      alarmList: []
    }
  },
  created() {
    this.alarmList = getCopyObj(this.$t('home.alarmData'))
    this.getAlarmConfigByUserId()
  },
  methods: {
    /**
     * 报警弹窗设置全选
     * @param {Numer} i 第一层下标
     */
    handleCheckAllChange(i) {
      const checked = this.alarmList[i].checked;
      const child = this.alarmList[i].options;
      // 全选或取消全选
      for (const [i, v] of child.entries()) {
        v.checked = checked;
      }
    },
    /**
     * 报警弹窗单选
     * @param {Number} i 第一层下标
     * @param {Number} j 第二层下标
     */
    handleCheckChange(i, j) {
      const checked = this.alarmList[i].options[j].checked;
      // 是否全选
      if (checked) {
        const child = this.alarmList[i].options;
        let boole = true;
        for (const [i, v] of child.entries()) {
          if (checked !== v.checked) {
            boole = false;
          }
        }
        if (boole) {
          this.$set(this.alarmList[i], 'checked', checked);
        }
      } else {
        this.$set(this.alarmList[i], 'checked', checked);
      }
    },
    /**
     * 确认报警并提交请求
     */
    handleSetAlarm() {
      const data = this.getAlarmNameId();
      updateAlarmConfigByUserId(data).then(res => {
        if (res.success) {
          this.getAlarmConfigByUserId();
          Message({
            type: 'success',
            message: this.$t('success.revise')
          });
          // 隐藏报警弹窗
          this.$refs.alarmSet.$el.style.display = 'none';
        }
      })
    },
    /**
     * 请求报警数据
     */
    getAlarmConfigByUserId() {
      const list = getCopyObj(this.alarmList)
      this.$store.dispatch('alarm/getAlarmConfigByUserId', list).then(res => {
        this.alarmList = res
      })
    },
    /**
     * 获取报警设置的name以及id
     */
    getAlarmNameId() {
      const data = [];
      for(const v of this.alarmList.values()) {
        let isCheck = false;
        const obj = {};
        obj.alarmCategory = v.label;
        obj.alarmTypeConfigs = [];
        if (Array.isArray(v.options)) {
          for (const e of v.options.values()) {
            const obj2 = {};
            if (e.checked) {
              isCheck = true;
            }
            // 间隔时间
            obj2.alarmInterval = 0;
            // 是否勾选
            obj2.isCloseAlarm = !!e.checked;
            obj2.alarmValue = e.id;
            obj2.alarmDisplay = e.label;
            obj.alarmTypeConfigs.push(getCopyObj(obj2));
          }
        }
        // 只要有一个子级选中了就把title存起来
        data.push(getCopyObj(obj));
      }
      return data;
    }
  }
}
</script>