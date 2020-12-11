<template>
	<popup-view
		:isShow.sync="isShow"
		:isZoom="false"
		:title="info.AlarmDisplay"
		:css="{ width: '440px', height: 'auto' }"
		@handClose="handleClose"
	>
		<div class="content">
			<el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
		        <el-form-item :label="alarmForm.plateNo.label">{{ info.PlateNo }}</el-form-item>
		        <el-form-item :label="alarmForm.vehTerminalNo.label">{{ info.VehTerminalNo }}</el-form-item>
		        <el-form-item :label="alarmForm.context.label">
		            <el-input type="textarea" v-model="alarmForm.context.model"></el-input>
		        </el-form-item>
		    </el-form>
		    <div class="foot">
		    	<el-button size="small" @click="handleClose">{{$t('button.cancel')}}</el-button>
      			<el-button size="small" type="primary" @click="handleConfirm">{{$t('button.confirm')}}</el-button>
		    </div>
		</div>
	</popup-view>
</template>

<style scoped lang="scss">
.content {
	flex: 1;
	background: #fff;
	padding: 20px;
	.foot {
		text-align: right;
	}
}
</style>

<script>
import PopupView from '@/components/map/PopupView'
import { getCopyObj, getDateStr } from '@/utils/util'
import { Form, Message, FormItem } from 'element-ui'
import { sendInstructionsText } from '@/api/vehicle'

export default {
	name: 'SendAlarm',
	components: {
		ElForm: Form,
		ElFormItem: FormItem,
		PopupView
	},
	data() {
		const alarmForm = getCopyObj(this.$t('allMonitor.alarmForm'))

		return {
			isShow: true,
			alarmForm
		}
	},
	props: {
		info: {
			type: Object,
			default: ()=> new Object
		}
  },
  beforeDestroy() {
    this.alarmForm = {}
  },
	methods: {
		handleClose() {
			const { PlateNo } = this.info
			this.$emit('handleConfirm', PlateNo)
		},
		async handleConfirm() {
			const { alarmForm, info } = this
			const content = alarmForm.context.model
			const { VehTerminalNo, AlarmTime, PlateNo } = info
			const alarmTime = getDateStr(AlarmTime)
			const data = {
				vehTerminalNo: VehTerminalNo,
				alarmTime,
				content
			}
			try {
				const res = await sendInstructionsText(data)
				 Message({
		            message: this.$t('success.sendCommand'),
		            type: 'success'
		        })
				this.$emit('handleConfirm', PlateNo)
			} catch(err) {

			}
		}
	}
}
</script>