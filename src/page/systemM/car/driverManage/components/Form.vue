<template>
	<el-dialog
		class="dialog"
		:title="title"
		@open="open"
		:close-on-click-modal="false"
		width="500px"
		:visible.sync="isShow"
		:before-close="close"
	>
		<el-form :rules="rules" :model="listLi" ref="ruleForm">
			<el-form-item :label="listLi.drvName.label" label-width="120px" prop="drvName">
				<el-input
					v-model="listLi.drvName.model"
					auto-complete="off"
					:placeholder="listLi.drvName.placeholder"
				></el-input>
			</el-form-item>

			<el-form-item :label="listLi.drvGender.label" label-width="120px" prop="drvGender">
				<el-radio
					v-model="listLi.drvGender.model"
					v-for="(item, index) in listLi.drvGender.children"
					:key="index"
					:label="index"
				>
					{{ item }}
				</el-radio>
			</el-form-item>

			<el-form-item :label="listLi.drvMobile.label" label-width="120px" prop="drvMobile">
				<el-input
					v-model="listLi.drvMobile.model"
					auto-complete="off"
					:placeholder="listLi.drvMobile.placeholder"
				/>
			</el-form-item>

			<el-form-item :label="listLi.drvIdCards.label" label-width="120px" prop="drvIdCards">
				<el-input
					v-model="listLi.drvIdCards.model"
					auto-complete="off"
					:placeholder="listLi.drvIdCards.placeholder"
				/>
			</el-form-item>

			<el-form-item :label="listLi.fileImage.label" label-width="120px" prop="fileImage">
				<el-upload
					class="upload-demo"
					drag
					accept="image/*"
					action=""
					:auto-upload="false"
					:file-list="listLi.fileImage.model"
					ref="upload"
					@drop.native.prevent="handleChange"
					@change.native="handleChange"
				>
					<el-button slot="trigger" size="small" type="primary">选取图片</el-button>
				</el-upload>
			</el-form-item>
			
			<el-form-item :label="listLi.sortNum.label" label-width="120px" prop="sortNum">
				<el-input-number
					v-model="listLi.sortNum.model"
					controls-position="right"
					class="input-max"
				/>
			</el-form-item>

			<el-form-item :label="listLi.memo.label" label-width="120px" prop="memo">
				<el-input
					type="textarea"
					:autosize="{ minRows: 4, maxRows: 6 }"
					v-model="listLi.memo.model"
					class="input-max"
				/>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="close">{{ $t('button.cancel') }}</el-button>
			<el-button size="small" type="primary" @click="handleConfirm('ruleForm')">
				{{ $t('button.confirm')	}}
			</el-button>
		</div>
	</el-dialog>
</template>

<style scoped lang="scss">
.dialog {
	::v-deep .el-form-item {
		display: flex;
		justify-content: center;
		.el-form-item__content {
			margin: 0 !important;
			padding: 0 10px 0 0;
			width: 220px;
			.el-input, .input-max {
				width: 220px;
			}
		}
		.upload-demo {
			line-height: 0;
			width: 220px;
			.el-upload, .el-upload-dragger {
				width: 220px;
				height: 40px;
				overflow: hidden;
			}
			.el-upload-dragger {
				float: left;
				button {
					float: left;
					margin: 3px 0 0 8px;
				}
			}
			ul {
				li {
					margin: 5px 0 0;
				}
			}
		}
	}
}
</style>

<script>
	import { Dialog, Form, FormItem, Input, Radio, InputNumber, Upload, Message } from 'element-ui'
	import { getCopyObj } from '@/utils/util'
	import { rule } from '@/utils'
	import { addDriver, upDriver } from '@/api/sysetsmM/car'

	export default {
		name: 'MyForm',
		components: {
			ElDialog: Dialog,
			ElForm: Form,
      ElInput: Input,
      ElRadio: Radio,
      ElInputNumber: InputNumber,
			ElUpload: Upload,
			ElFormItem: FormItem
		},
		data() {
			const listLi = getCopyObj(this.$t('driverManage.listLi'))
			const msgRules = this.$t('driverManage.rules')
		    const rules = {
		      drvName: rule('isEmpty', msgRules.drvName)
		      // drvIdCards: rule('isIdCard', msgRules.drvIdCards)
		    }
			return {
				listLi,
				rules,
				curNode: null
			}
		},
		props: {
			isShow: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: ''
			}
		},
		methods: {
			/**
			 * 关闭的回调
			 */
			close() {
				const { listLi } = this
				for (const v of Object.values(listLi)) {
					if (typeof v.default !== 'undefined') {
						v.model = v.default
					} else {
						v.model = ''
					}
				}
				this.$emit('update:isShow', false)
				this.curNode = null
			},
			/**
			 * 打开弹窗的回调
			 */
			open() {
				const { $refs } = this
				if (!$refs.ruleForm) return
				$refs.ruleForm.clearValidate()
			},
			/**
			 * 点击修改初始化表单
			 * @param { Object } row 点击当前行的数据
			 */
			initEdit(row) {
				const { listLi } = this
				this.curNode = row
				for (const [k, v] of Object.entries(listLi)) {
			        v.model = row[k]
			    }
			    const drvGender = +row.drvGender
			    listLi.drvGender.model = drvGender
			},
			 /**
		     * 选取图片
		     */
		    handleChange(e) {
		    	const { listLi } = this
	    		let file = null
				if (e.dataTransfer) {
					// 拖拽进来的时候
					file = e.dataTransfer.files[0]
				} else {
					// 鼠标选择的时候
					file = e.target.files[0]
				}
				// console.log(file);
				const isLt4M = file.size
				// 不能大于1M
				if (isLt4M / 1024 / 1024 >= 1) {
					Message(this.$t('carManage.uploadInfo.max4M'))
					return
				}

				this.$set(listLi.fileImage, 'file', file)
				this.$set(listLi.fileImage, 'model', [])
				listLi.fileImage.model.push(file)
    		},
    		/**
		     * 点击确认
		     */
		    handleConfirm(ref) {
		    	const { $refs, listLi, curNode } = this
		    	const oForm = $refs[ref]
		    	oForm.validate((valid) => {
					if (valid) {
				    	const fd = new FormData()
				    	const { model, file } = listLi.fileImage
					    for (const [k, v] of Object.entries(listLi)) {
					    	fd.append(k, v.model)
					    }
					    const drvGender = fd.get('drvGender')
					    fd.set('drvGender', !!drvGender)
					    if (model instanceof Array && model.length) {
					    	fd.set('fileImage', file)
					    } else {
					    	fd.delete('fileImage')
					    }

					    if (curNode) {
				    		fd.append('id', curNode.id)
				    		this.editRequest(fd)
				    	} else {
				    		this.addRquest(fd)
				    	}
					} else {
						return false
					}
				})
		    },
		    /**
		     * 修改的请求
		     */
		    async editRequest(data) {
		    	try {
			    	const res = await upDriver(data)
			    	Message({
			            type: 'success',
			            message: this.$t('success.revise')
			        })
		    		this.close()
			        this.$emit('request')
			    } catch (err) {

			    }
		    },
		    /**
		     * 添加的修改
		     */
		    async addRquest(data) {
		    	try {
			    	const res = await addDriver(data)
			    	Message({
			            type: 'success',
			            message: this.$t('success.add')
			        })
		    		this.close()
			        this.$emit('request')
			    } catch (err) {

			    }
		    }
		}
	}
</script>