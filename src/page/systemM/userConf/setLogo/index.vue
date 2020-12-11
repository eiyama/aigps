<template>
	<div class="content">
		<el-upload
			class="upload-demo"
			drag
			accept="image/*"
			action=""
			:auto-upload="false"
			:file-list="upImg.fileList || []"
			ref="upload"
			@drop.native.prevent="handleChange"
			@change.native="handleChange"
		>
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">将Logo拖到此处，或<em>点击上传</em></div>
			<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1M(建议大小：40 * 40)</div>
		</el-upload>
		<div :style="{ paddingBottom: upImg.formData ? '0' : '36px' }" class="empty"></div>
		<span slot="footer" class="dialog-footer">
			<el-button size="small" style="width: 360px;" type="primary" @click="uploadConfirm">
				{{ $t('button.submit') }}</el-button>
		</span>
	</div>
</template>

<style lang="scss" scoped>
.content {
	flex: 1;
	padding: 22px 0 0 40px;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background: #fff;
	position: relative;
}
.upload-demo {
	width: 360px;
}
.dialog-footer {
	padding: 10px 0 0;
}
</style>

<script>
import { Upload, Message } from 'element-ui'

export default {
	components: {
		ElUpload: Upload
	},
	name: 'SetLogo',
	data() {
		return {
			upImg: {}
		}
	},
	methods: {
		// 原生的选择文件之后的事件
		handleChange(e) {
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
			let fd = new FormData()
			fd.append('formFile', file)
			this.$set(this.upImg, 'formData', fd)
			this.$set(this.upImg, 'fileList', [])
			this.upImg.fileList.push(file)
		},
		/**
		 * 提交图片
		 */
		uploadConfirm() {
			const data = this.upImg.formData
			if (!data) {
				Message.error('请选择要上传的Logo')
				return
			}
			this.$store
				.dispatch('user/upLogo', data)
				.then((res) => {
					Message({
						type: 'success',
						message: 'Logo上传成功！'
					})
				})
				.catch((err) => {})
		}
	}
}
</script>
