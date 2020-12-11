<template>
	<el-dialog
	  :title="btns.audit"
	  :visible.sync="isShow"
	  :close-on-click-modal="false"
	  width="400px"
	  @close="handleClose">
	 		<div class="content">
	 			<div class="li">
	 				<el-radio v-model="formData.auditJudgeResult" :label="0">正常</el-radio>
  				<el-radio v-model="formData.auditJudgeResult" :label="1">异常</el-radio>
	 			</div>
	 			<div class="li">
	 				<span class="label">备注：</span>
					<el-input
					  type="textarea"
					  clearable
					  v-model="formData.remark"
					  show-word-limit
					/>
	 			</div>
	 			<div class="li" v-if="row.allowedUploadImage">
	 				<span class="label">图片：</span>
					<el-upload
						class="upload-demo"
						drag
						accept="image/*"
						action=""
						:auto-upload="false"
						:file-list="formData.fileList || []"
						ref="upload"
						@drop.native.prevent="handleChange"
						@change.native="handleChange"
					>
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
					</el-upload>
				</div>	
	 		</div>
	  <span slot="footer" class="dialog-footer">
	    <el-button size="small" @click="isShow = false">{{ i18n.cancel }}</el-button>
	    <el-button size="small" type="primary" @click="handleConfirm">{{ i18n.confirm }}</el-button>
	  </span>
	</el-dialog>
</template>

<style lang="scss" scoped>
	.el-dialog__wrapper {
		::v-deep .el-dialog__body {
			padding: 10px 20px;
			.content {
				overflow: hidden;
				.left {
					float: left;
					width: 50%;
				}
				.right {
					float: right;
					width: 50%;
				}
				.li {
					line-height: 28px;
					margin: 10px 0 0;
					display: flex;
					.label {
						color: #666;
						display: block;
					}
					.el-button {
						margin: 0 0 0 14px;
					}
					.upload-demo, .el-textarea {
						flex: 1;
						overflow: hidden;
					}
					.el-upload {
						width: 100%;
						.el-upload-dragger {
							width: 100%;
						}
					}
				}
			}
		}
	}	
</style>

<script>
	import { Dialog, Radio, Upload, Message } from 'element-ui'

	import { checkOperator } from '@/api/loadManage/flowControl'

	export default {
		name: 'Examine',
		components: {
			ElDialog: Dialog,
			ElRadio: Radio,
			ElUpload: Upload
		},
		data() {
			return {
				isShow: false,
				row: {},
				formData: {}
			}
		},
		props: {
			curNode: {
				type: Object,
				default: () => new Object()
			}
		},
		created() {
			this.i18n = this.$t('button')
			this.btns = this.$t('taskLatitude.buttons')
			this.dptLabel = this.$t('taskLatitude.auditLabel')
			this.examineLabel = this.$t('taskLatitude.examineLabel')
			this.mapping = this.$t('taskLatitude.mapping')
		},
		methods: {
			setState(isShow, row) {
				const { formData } = this
				this.isShow = isShow
				if (row) {
					this.row = row
					this.$set(formData, 'auditJudgeResult', row.auditJudgeResult)
				}
			},
			handleClose() {
				this.flowControlTask = {}
				this.auditConfig = {}
				this.formData = {}
			},
			/**
			 * 点击确认
			 */
			handleConfirm() {
				const { row, formData, curNode } = this
				const data = {
					flowControlTaskId: curNode.id,
					auditDepartmentLevel: row.level,
					remark: formData.remark,
					auditJudgeResult: formData.auditJudgeResult
				}
				const fd = new FormData()
				for (const [k, v] of Object.entries(data)) {
					fd.append(k, v)
				}
				if (formData.fileList && formData.fileList.length) {
					fd.append('fileImage', formData.fileList[0])
				}
				this.checkOperator(fd)
			},
			async checkOperator(data) {
				const { btns, row } = this
				try {
					const res = await checkOperator(data)
					Message({
	          message: `${btns.audit}${this.$t('success.success')}`,
	          type: 'success'
	        })
	        this.isShow = false
	        this.$emit('checkOperator', row.id)
				} catch(err) {
					
				}
			},
			/**
			 * 原生的选择文件之后的事件
			 */
			handleChange(e) {
				const { formData } = this
				formData.fileList = []
				let file = null
				if (e.dataTransfer) {
					// 拖拽进来的时候
					file = e.dataTransfer.files[0]
				} else {
					// 鼠标选择的时候
					file = e.target.files[0]
				}
				formData.fileList.push(file)
			}
		}
	}
</script>