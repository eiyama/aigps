<template>
	<div class="form-box">
		<el-dialog
			class="dialog"
			:title="title"
			@open="open"
			:close-on-click-modal="false"
			width="760px"
			:visible.sync="isShow"
			:before-close="close"
		>
			<el-form :rules="rules" :model="listLi" ref="ruleForm">
				<!-- 车辆主要信息 -->
				<animation-box :title="listTitle.mainInfo.title">
					<el-form-item :label="listLi.vehPlateNo.label" label-width="120px" prop="vehPlateNo">
						<el-input
							v-model="listLi.vehPlateNo.model"
							auto-complete="off"
							:placeholder="listLi.vehPlateNo.placeholder"
							:disabled="listLi.vehPlateNo.disabled"
						></el-input>
					</el-form-item>

					<el-form-item :label="listLi.vehTerminalNo.label" label-width="120px" prop="vehTerminalNo">
						<el-input
							v-model="listLi.vehTerminalNo.model"
							auto-complete="off"
							:placeholder="listLi.vehTerminalNo.placeholder"
							:disabled="listLi.vehTerminalNo.disabled"
						></el-input>
					</el-form-item>
					
					<el-form-item :label="listLi.deviceTypeId.label" label-width="120px" prop="deviceTypeId">
						<el-select
							@change="changeSelect"
							class="input-max"
							v-model="listLi.deviceTypeId.model"
							:placeholder="listLi.deviceTypeId.placeholder"
							:disabled="listLi.deviceTypeId.disabled"
						>
							<el-option
								v-for="(item, index) in listLi.deviceTypeId.list"
								:key="index"
								:label="item.devtName"
								:value="item.id"
							></el-option>
						</el-select>
					</el-form-item>
					
					<el-form-item :label="listLi.dptName.label" label-width="120px" prop="dptName">
						<el-input
							v-model="listLi.dptName.model"
							clearable
							auto-complete="off"
							:placeholder="listLi.dptName.placeholder"
							:disabled="listLi.dptName.disabled"
							@click.native.stop="handleClick"
							@input.native="changeInput"
							@clear="handleClear"
						/>
						<popup-tree
							:tree="listLi.dptName.tree"
							:defaultProps="defaultProps"
							:isShow.sync="popupTreeIsShow"
							:labels="labels"
							:opendIdArr="opendIdArr"
							@handleNode="handleNode"
							ref="popupTree"
						/>
					</el-form-item>
					
					<el-form-item :label="listLi.vehSimno.label" label-width="120px" prop="vehSimno">
						<el-input
							v-model="listLi.vehSimno.model"
							auto-complete="off"
							:placeholder="listLi.vehSimno.placeholder"
							:disabled="listLi.vehSimno.disabled"
						></el-input>
					</el-form-item>
				</animation-box>
				<!-- 车辆基础信息 -->
				<animation-box
					isAnimation
					:title="listTitle.basicsInfo.title"
					:isSwitch.sync="listTitle.basicsInfo.isSwitch"
				>
					<el-form-item :label="listLi.vehVin.label" label-width="120px" prop="vehVin">
						<el-input
							v-model="listLi.vehVin.model"
							auto-complete="off"
							:placeholder="listLi.vehVin.placeholder"
						></el-input>
					</el-form-item>

					<el-form-item :label="listLi.vehOverSpeed.label" label-width="120px" prop="vehOverSpeed">
						<el-input
							v-model="listLi.vehOverSpeed.model"
							auto-complete="off"
							:placeholder="listLi.vehOverSpeed.placeholder"
						></el-input>
					</el-form-item>

					<el-form-item :label="listLi.vehOilPercent.label" label-width="120px" prop="vehOilPercent">
						<el-input
							v-model="listLi.vehOilPercent.model"
							auto-complete="off"
							:placeholder="listLi.vehOilPercent.placeholder"
						></el-input>
					</el-form-item>

					<el-form-item :label="listLi.vehOilsize.label" label-width="120px" prop="vehVin">
						<el-input
							v-model="listLi.vehOilsize.model"
							auto-complete="off"
							:placeholder="listLi.vehOilsize.placeholder"
						></el-input>
					</el-form-item>

					<el-form-item :label="listLi.vehOilmark.label" label-width="120px" prop="vehOilmark">
						<el-input
							v-model="listLi.vehOilmark.model"
							auto-complete="off"
							:placeholder="listLi.vehOilmark.placeholder"
						></el-input>
					</el-form-item>

					<el-form-item :label="listLi.vehDisPercent.label" label-width="120px" prop="vehDisPercent">
						<el-input
							v-model="listLi.vehDisPercent.model"
							auto-complete="off"
							:placeholder="listLi.vehDisPercent.placeholder"
						></el-input>
					</el-form-item>

					<el-form-item :label="listLi.vehInstaller.label" label-width="120px" prop="vehInstaller">
						<el-input
							v-model="listLi.vehInstaller.model"
							auto-complete="off"
							:placeholder="listLi.vehInstaller.placeholder"
							:disabled="listLi.vehInstaller.disabled"
						></el-input>
					</el-form-item>

					<el-form-item :label="listLi.vehBrand.label" label-width="120px" prop="vehBrand">
						<el-input
							v-model="listLi.vehBrand.model"
							auto-complete="off"
							:placeholder="listLi.vehBrand.placeholder"
						></el-input>
					</el-form-item>

					<el-form-item :label="listLi.vehTon.label" label-width="120px" prop="vehTon">
						<el-input
							v-model="listLi.vehTon.model"
							auto-complete="off"
							:placeholder="listLi.vehTon.placeholder"
						></el-input>
					</el-form-item>

					<el-form-item :label="listLi.vehTransno.label" label-width="120px" prop="vehTransno">
						<el-input
							v-model="listLi.vehTransno.model"
							auto-complete="off"
							:placeholder="listLi.vehTransno.placeholder"
						></el-input>
					</el-form-item>

					<el-form-item :label="listLi.masterDriverId.label" label-width="120px" prop="masterDriverId">
						<el-select
							clearable
							class="input-max"
							v-model="listLi.masterDriverId.model"
							:placeholder="listLi.masterDriverId.placeholder"
						>
							<el-option
								v-for="(v, i) in listLi.masterDriverId.list"
								:key="i"
								:label="v.drvName"
								:value="v.id"
							></el-option>
						</el-select>
					</el-form-item>

					<el-form-item :label="listLi.slaveDriverId.label" label-width="120px" prop="slaveDriverId">
						<el-select
							clearable 
							class="input-max"
							v-model="listLi.slaveDriverId.model"
							:placeholder="listLi.slaveDriverId.placeholder"
						>
							<el-option
								v-for="(v, i) in listLi.slaveDriverId.list"
								:key="i"
								:label="v.drvName"
								:value="v.id"
							></el-option>
						</el-select>
					</el-form-item>

					<el-form-item :label="listLi.vehColor.label" label-width="120px" prop="vehColor">
						<el-radio
							v-model="listLi.vehColor.model"
							v-for="(v, i) in listLi.vehColor.children"
							:key="i"
							:label="i"
						>
							{{ v }}
						</el-radio>
					</el-form-item>

					<el-form-item :label="listLi.loadFactor.label" label-width="120px" prop="loadFactor">
						<el-input
							v-model="listLi.loadFactor.model"
							auto-complete="off"
							:placeholder="listLi.loadFactor.placeholder"
						></el-input>
					</el-form-item>

					<el-form-item :label="listLi.transportationType.label" label-width="120px" prop="transportationType">
						<el-select
							class="input-max"
							v-model="listLi.transportationType.model"
							:placeholder="listLi.transportationType.placeholder"
							:disabled="listLi.transportationType.disabled"
						>
							<el-option
								v-for="(v, i) in listLi.transportationType.list"
								:key="i"
								:label="v.text"
								:value="v.id"
							></el-option>
						</el-select>
					</el-form-item>

					<el-form-item :label="listLi.vehicleType.label" label-width="120px" prop="vehicleType">
						<el-select
							class="input-max"
							v-model="listLi.vehicleType.model"
							:placeholder="listLi.vehicleType.placeholder"
							:disabled="listLi.vehicleType.disabled"
						>
							<el-option
								v-for="(v, i) in listLi.vehicleType.list"
								:key="i"
								:label="v.text"
								:value="v.id"
							></el-option>
						</el-select>
					</el-form-item>

					<el-form-item :label="listLi.vehicleNativePlace.label" label-width="120px" prop="vehicleNativePlace">
						<el-input
							v-model="listLi.vehicleNativePlace.model"
							auto-complete="off"
							:placeholder="listLi.vehicleNativePlace.placeholder"
							:disabled="listLi.vehicleNativePlace.disabled"
							:readonly="listLi.vehicleNativePlace.readonly"
							@click.native="handleInput('vehicleNativePlace')"
						></el-input>
					</el-form-item>

					<el-form-item :label="listLi.installationLocation.label" label-width="120px" prop="installationLocation">
						<el-input
							v-model="listLi.installationLocation.model"
							auto-complete="off"
							:placeholder="listLi.installationLocation.placeholder"
						></el-input>
					</el-form-item>
					
					<el-form-item :label="listLi.installationTime.label" label-width="120px" prop="installationTime">
						<el-date-picker
							value-format="yyyy-MM-dd"
							type="date"
							v-model="listLi.installationTime.model"
							:placeholder="listLi.installationTime.placeholder"
						/>
					</el-form-item>

					<el-form-item :label="listLi.stopTime.label" label-width="120px" prop="stopTime">
						<el-date-picker
							value-format="yyyy-MM-dd"
							type="date"
							v-model="listLi.stopTime.model"
							:placeholder="listLi.stopTime.placeholder"
						/>
					</el-form-item>

					<el-form-item :label="listLi.usingState.label" label-width="120px" prop="usingState">
						<el-select
							clearable 
							class="input-max"
							v-model="listLi.usingState.model"
							:placeholder="listLi.usingState.placeholder"
						>
							<el-option
								v-for="(v, i) in listLi.usingState.list"
								:key="i"
								:label="v.value"
								:value="v.label"
							/>
						</el-select>
					</el-form-item>

					<el-form-item :label="listLi.installationDescription.label" label-width="120px" prop="installationDescription">
						<el-input
							type="textarea"
							:autosize="{ minRows: 4, maxRows: 6 }"
							v-model="listLi.installationDescription.model"
							class="input-max"
						/>
					</el-form-item>
				</animation-box>
				<!-- 联系信息 -->
				<animation-box
					isAnimation
					:title="listTitle.contactInfo.title"
					:isSwitch.sync="listTitle.contactInfo.isSwitch"
				>
					<el-form-item :label="listLi.carCaptain.label" label-width="120px" prop="carCaptain">
						<el-input
							clearable
							v-model="listLi.carCaptain.model"
							auto-complete="off"
							:placeholder="listLi.carCaptain.placeholder"
						></el-input>
					</el-form-item>
					<el-form-item :label="listLi.carCaptainPhone.label" label-width="120px" prop="carCaptainPhone">
						<el-input
							clearable
							v-model="listLi.carCaptainPhone.model"
							auto-complete="off"
							:placeholder="listLi.carCaptainPhone.placeholder"
						></el-input>
					</el-form-item>

					<el-form-item :label="listLi.companyContactPerson.label" label-width="120px" prop="companyContactPerson">
						<el-input
							clearable
							v-model="listLi.companyContactPerson.model"
							auto-complete="off"
							:placeholder="listLi.companyContactPerson.placeholder"
						></el-input>
					</el-form-item>
					<el-form-item :label="listLi.companyContactPersonPhone.label" label-width="120px" prop="companyContactPersonPhone">
						<el-input
							clearable
							v-model="listLi.companyContactPersonPhone.model"
							auto-complete="off"
							:placeholder="listLi.companyContactPersonPhone.placeholder"
						></el-input>
					</el-form-item>

					<el-form-item :label="listLi.emergencyContactPerson.label" label-width="120px" prop="emergencyContactPerson">
						<el-input
							clearable
							v-model="listLi.emergencyContactPerson.model"
							auto-complete="off"
							:placeholder="listLi.emergencyContactPerson.placeholder"
						></el-input>
					</el-form-item>
					<el-form-item :label="listLi.emergencyContactPersonPhone.label" label-width="120px" prop="emergencyContactPersonPhone">
						<el-input
							clearable
							v-model="listLi.emergencyContactPersonPhone.model"
							auto-complete="off"
							:placeholder="listLi.emergencyContactPersonPhone.placeholder"
						></el-input>
					</el-form-item>

					<el-form-item :label="listLi.driverName.label" label-width="120px" prop="driverName">
						<el-input
							clearable
							v-model="listLi.driverName.model"
							auto-complete="off"
							:placeholder="listLi.driverName.placeholder"
						></el-input>
					</el-form-item>
					<el-form-item :label="listLi.driverPhone.label" label-width="120px" prop="driverPhone">
						<el-input
							clearable
							v-model="listLi.driverPhone.model"
							auto-complete="off"
							:placeholder="listLi.driverPhone.placeholder"
						></el-input>
					</el-form-item>
				</animation-box>
				<!-- 其他信息 -->
				<animation-box
					isAnimation
					:title="listTitle.otherInfo.title"
					:isSwitch.sync="listTitle.otherInfo.isSwitch"
				>
					<el-form-item :label="listLi.vehExpired.label" label-width="120px" prop="vehExpired">
						<el-date-picker
							:disabled="listLi.vehExpired.disabled"
							value-format="yyyy-MM-dd"
							type="date"
							v-model="listLi.vehExpired.model"
							:placeholder="listLi.vehExpired.placeholder"
						/>
					</el-form-item>

					<el-form-item :label="listLi.vehIsfees.label" label-width="120px" prop="vehIsfees">
						<el-radio
							v-model="listLi.vehIsfees.model"
							v-for="(v, i) in listLi.vehIsfees.children"
							:key="i"
							:label="i"
							:disabled="listLi.vehIsfees.disabled"
						>
							{{ v }}
						</el-radio>
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
				</animation-box>
				<!-- 保养信息 -->
				<animation-box
					isAnimation
					:title="listTitle.gpsMaintenanceDto.title"
					:isSwitch.sync="listTitle.gpsMaintenanceDto.isSwitch"
				>	
					<el-form-item :label="listLi.firstGuaranteeInterval.label" label-width="120px" prop="firstGuaranteeInterval">
						<el-input
							v-model.number="listLi.firstGuaranteeInterval.model"
							auto-complete="off"
							:placeholder="listLi.firstGuaranteeInterval.placeholder"
							clearable
						>
							<template slot="append">{{ listLi.firstGuaranteeInterval.append }}</template>
						</el-input>
					</el-form-item>

					<el-form-item :label="listLi.firstGuaranteeDate.label" label-width="120px" prop="firstGuaranteeDate">
						<el-date-picker
							value-format="yyyy-MM-dd"
							v-model="listLi.firstGuaranteeDate.model"
							type="date"
							:picker-options="pickerOptions"
							:placeholder="listLi.firstGuaranteeDate.placeholder"
							clearable
						/>
					</el-form-item>

					<el-form-item :label="listLi.firstGuaranteeMileage.label" label-width="120px" prop="firstGuaranteeMileage">
						<el-input
							v-model.number="listLi.firstGuaranteeMileage.model"
							auto-complete="off"
							:placeholder="listLi.firstGuaranteeMileage.placeholder"
							clearable
						>
							<template slot="append">{{ listLi.firstGuaranteeMileage.append }}</template>
						</el-input>
					</el-form-item>

					<el-form-item :label="listLi.maintenanceDate.label" label-width="120px" prop="maintenanceDate">
						<el-date-picker
							value-format="yyyy-MM-dd"
							v-model="listLi.maintenanceDate.model"
							type="date"
							:picker-options="pickerOptions"
							:placeholder="listLi.maintenanceDate.placeholder"
							clearable
						/>
					</el-form-item>

					<el-form-item :label="listLi.maintenanceMileage.label" label-width="120px" prop="maintenanceMileage">
						<el-input
							v-model.number="listLi.maintenanceMileage.model"
							auto-complete="off"
							:placeholder="listLi.maintenanceMileage.placeholder"
							clearable
						>
							<template slot="append">{{ listLi.maintenanceMileage.append }}</template>
						</el-input>
					</el-form-item>

					<el-form-item :label="listLi.maintenanceInterval.label" label-width="120px" prop="maintenanceInterval">
						<el-input
							v-model="listLi.maintenanceInterval.model"
							auto-complete="off"
							:placeholder="listLi.maintenanceInterval.placeholder"
							clearable
						>
							<template slot="append">{{ listLi.maintenanceInterval.append }}</template>
						</el-input>
					</el-form-item>


					<el-form-item :label="listLi.maintenanceTimes.label" label-width="120px" prop="maintenanceTimes">
						<el-input
							v-model.number="listLi.maintenanceTimes.model"
							auto-complete="off"
							:placeholder="listLi.maintenanceTimes.placeholder"
							clearable
						>
							<template slot="prepend">{{ listLi.maintenanceTimes.prepend }}</template>
							<template slot="append">{{ listLi.maintenanceTimes.append }}</template>
						</el-input>
					</el-form-item>

					<el-form-item :label="listLi.maintenanceContent.label" label-width="120px" prop="maintenanceContent">
						<el-input
							v-model="listLi.maintenanceContent.model"
							auto-complete="off"
							type="textarea"
							:autosize="{ minRows: 4, maxRows: 6 }"
							class="input-max"
						/>
					</el-form-item>

					<el-form-item :label="listLi.remark1.label" label-width="120px" prop="remark1">
						<el-input
							v-model="listLi.remark1.model"
							auto-complete="off"
							type="textarea"
							:autosize="{ minRows: 4, maxRows: 6 }"
							class="input-max"
						/>
					</el-form-item>
				</animation-box>
				<!-- 保险信息 -->
				<animation-box
					isAnimation
					:title="listTitle.gpsInsuranceDto.title"
					:isSwitch.sync="listTitle.gpsInsuranceDto.isSwitch"
				>
					<el-form-item :label="listLi.insuranceCompany.label" label-width="120px" prop="insuranceCompany">
						<el-input
							v-model="listLi.insuranceCompany.model"
							auto-complete="off"
							:placeholder="listLi.insuranceCompany.placeholder"
							clearable
						/>
					</el-form-item>

					<el-form-item :label="listLi.registrationDate.label" label-width="120px" prop="registrationDate">
						<el-date-picker
							value-format="yyyy-MM-dd"
							v-model="listLi.registrationDate.model"
							type="date"
							:picker-options="pickerOptions"
							:placeholder="listLi.registrationDate.placeholder"
							clearable
						/>
					</el-form-item>
					
					<el-form-item :label="listLi.insuranceType.label" label-width="120px" prop="insuranceType">
						<el-input
							v-model="listLi.insuranceType.model"
							auto-complete="off"
							:placeholder="listLi.insuranceType.placeholder"
							clearable
						/>
					</el-form-item>

					<el-form-item :label="listLi.reminderDate.label" label-width="120px" prop="reminderDate">
						<el-input
							:placeholder="listLi.reminderDate.placeholder"
							v-model.number="listLi.reminderDate.model"
							auto-complete="off"
							clearable
						>
							<template slot="prepend">{{ listLi.reminderDate.prepend }}</template>
	                		<template slot="append">{{ listLi.reminderDate.append }}</template>
						</el-input>
					</el-form-item>

					<el-form-item :label="listLi.renewalCompany.label" label-width="120px" prop="renewalCompany">
						<el-input
							v-model="listLi.renewalCompany.model"
							auto-complete="off"
							:placeholder="listLi.renewalCompany.placeholder"
							clearable
						/>
					</el-form-item>

					<el-form-item :label="listLi.renewalTimes.label" label-width="120px" prop="renewalTimes">
						<el-input
							:placeholder="listLi.renewalTimes.placeholder"
							v-model.number="listLi.renewalTimes.model"
							auto-complete="off"
							clearable
						>
							<template slot="prepend">{{ listLi.renewalTimes.prepend }}</template>
	                		<template slot="append">{{ listLi.renewalTimes.append }}</template>
						</el-input>
					</el-form-item>

					<el-form-item :label="listLi.renewalType.label" label-width="120px" prop="renewalType">
						<el-input
							v-model="listLi.renewalType.model"
							auto-complete="off"
							:placeholder="listLi.renewalType.placeholder"
							clearable
						/>
					</el-form-item>

					<el-form-item :label="listLi.totalSum.label" label-width="120px" prop="totalSum">
						<el-input
							:placeholder="listLi.totalSum.placeholder"
							v-model.number="listLi.totalSum.model"
							auto-complete="off"
							clearable
						>
	                		<template slot="append">{{ listLi.totalSum.append }}</template>
						</el-input>
					</el-form-item>

					<el-form-item :label="listLi.remark2.label" label-width="120px" prop="remark2">
						<el-input
							v-model="listLi.remark2.model"
							auto-complete="off"
							type="textarea"
							:autosize="{ minRows: 4, maxRows: 6 }"
							class="input-max"
						/>
					</el-form-item>
				</animation-box>

				<!-- 风控设置 -->
				<animation-box
					isAnimation
					:title="listTitle.gpsRiskManagementDto.title"
					:isSwitch.sync="listTitle.gpsRiskManagementDto.isSwitch"
				>
					<el-form-item :label="listLi.isOpen.label" label-width="120px" prop="isOpen">
						<el-radio
							v-model="listLi.isOpen.model"
							v-for="(v, i) in listLi.isOpen.children"
							:key="i"
							:label="i"
						>
							{{ v }}
						</el-radio>
					</el-form-item>

					<el-form-item :label="listLi.bindProvincialAlarm.label" label-width="120px" prop="bindProvincialAlarm">
						<el-select
							class="input-max"
							v-model="listLi.bindProvincialAlarm.model"
							:placeholder="listLi.bindProvincialAlarm.placeholder"
							:disabled="listLi.bindProvincialAlarm.disabled"
						>
							<el-option
								v-for="(item, index) in listLi.bindProvincialAlarm.list"
								:key="index"
								:label="item.name"
								:value="item.id"
							></el-option>
						</el-select>
					</el-form-item>
					<!-- 家庭地址 -->
					<div class="other-box floatLeft">
						<div class="label floatLeft">经常停留点设置：</div>
						<div class="border floatLeft">
							<el-form-item :label="listLi.homeAddress.label" label-width="120px" prop="homeAddress">
								<el-input
									v-model="listLi.homeAddress.model"
									auto-complete="off"
									:placeholder="listLi.homeAddress.placeholder"
									:readonly="listLi.homeAddress.readonly"
									@click.native="handleInput('homeAddress')"
								/>
							</el-form-item>

							<el-form-item :label="listLi.companyAddress.label" label-width="120px" prop="companyAddress">
								<el-input
									v-model="listLi.companyAddress.model"
									auto-complete="off"
									:placeholder="listLi.companyAddress.placeholder"
									:readonly="listLi.companyAddress.readonly"
									@click.native="handleInput('companyAddress')"
								/>
							</el-form-item>
						</div>
					</div>

					<el-form-item :label="listLi.remark3.label" label-width="120px" prop="remark3">
						<el-input
							v-model="listLi.remark3.model"
							auto-complete="off"
							type="textarea"
							:autosize="{ minRows: 4, maxRows: 6 }"
							class="input-max"
						/>
					</el-form-item>
					<div class="text-box">
						<div class="border">
							<div class="li" v-for="(v, i) of riskMsg" :key="i">
								<div class="label">{{ v.label }}</div>
								<div class="msg">{{ v.msg }}</div>
							</div>
						</div>
					</div>
				</animation-box>
			</el-form>
			<div class="channel-box" v-show="listTitle.channel.isShow">
				<animation-box
					isAnimation
					:title="listTitle.channel.title"
					:isSwitch.sync="listTitle.channel.isSwitch"
				>
					<div class="input-bar">
				        <span class="name">{{ listTitle.channel.label }}</span>
				        <el-select @change="changeChannel" class="input" v-model="listTitle.channel.model">
				          <el-option v-for="(item, index) of nums" :key="index" :label="index" :value="item - 1"></el-option>
				        </el-select>
			      	</div>
			      	<div class="datas">
			        	<div class="left">{{ listTitle.channel.name }}</div>
			        	<div class="right">
			         		<div v-for="(v, i) of channels" :key="i" class="li">
			            		<div class="num">{{ i + 1 }}</div>
			            		<div class="input-group">
					              	<div class="input-bar">
					                	<span>{{ v.name.label }}</span>
					                	<el-input :style="{ width: v.name.width }" v-model="v.name.model"/>
					              	</div>
			              			<div class="input-bar">
					                	<span>{{ v.type.label }}</span>
					                	<el-select :style="{width: v.type.width + ' !important'}" class="input" v-model="v.type.model">
					                  		<el-option v-for="(item,index) in v.type.list" :key="index" :label="item.label" :value="item.value"></el-option>
					                	</el-select>
					              	</div>
			            		</div>
			          		</div>
			        	</div>
			      	</div>
				</animation-box>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="close">{{ $t('button.cancel') }}</el-button>
				<el-button size="small" type="primary" @click="handleConfirm('ruleForm')">
					{{ $t('button.confirm')	}}
				</el-button>
			</div>
		</el-dialog>
		<!-- 地址弹窗 -->
		<my-address ref="address" @handleOk="handleOk" />
	</div>
</template>

<style scoped lang="scss">
.dialog {
	::v-deep .content {
		margin-left: -30px;
		.el-form-item {
			display: flex;
			justify-content: center;
			float: left;
			width: 340px;
			margin-left: 30px;
			.el-form-item__content {
				margin: 0 !important;
				padding: 0 10px 0 0;
				width: 220px;
				.el-input, .input-max {
					width: 220px;
				}
				.dtp-tree {
					position: absolute;
					top: 42px;
					left: -10px;
					z-index: 999999;
					background: #fff;
					width: 240px;
					height: 300px;
					box-shadow: 0 1px 5px #666;
				}
			}
		}
		.text-box {
			float: left;
			width: 100%;
			margin: 20px 0 0 15px;
			.border {
				overflow: hidden;
				width: 90%;
				margin: 0 auto;
				padding: 10px;
				.li {
					overflow: hidden;
					line-height: 24px;
					.label, .msg {
						color: red;
						float: left;
					}
					.label {
						width: 100px;
					}
					.msg {
						width: calc(100% - 120px);
					}
				}
			}
		}
		.other-box {
			overflow: hidden;
			width: 100%;
			margin: 0 0 22px 25px;
			.label {
				width: 120px;
				line-height: 146px;
			}
			.border {
				overflow: hidden;
				display: inline-block;
				box-sizing: border-box;
				padding: 20px 0 0;
				width: 78%;
				.el-form-item {
					float: none;
				}
			}
		}
	}
	.channel-box {
		::v-deep .content {
			margin: 0;
			.input-bar {
			  display: flex;
			  padding: 10px 15px 0;
				.name {
				  display: block;
				  padding: 0 10px 0 0;
				  line-height: 40px;
				}
				.input {
				  flex: 1;
				}
			}
			.datas {
			  	display: flex;
			  	padding: 10px 15px 0;
				.left {
					padding: 0 5px;
					background: #f1f1f1;
					display: flex;
					align-items: center;
				}
				.num {
				    text-align: center;
				    font-size: 14px;
				    background: #f1f1f1;
				}
				.right {
				    flex: 1;
				    overflow: hidden;
				    .li {
				    	float: left;
				    	width: 50%;
				    	padding: 0 5px 10px;
				    	box-sizing: border-box;
				    }
				}
				.input-group {
				    margin-left: -108px;
				    overflow: hidden;
				    padding: 5px 0;
				}
				.input-bar {
				    float: left;
				    margin-left: 108px;
				}
				.input-bar span {
				    display: block;
				    width: 50px;
				    line-height: 40px;
				    text-align: right;
				}
			}
		}
	}
}
</style>

<script>
	import { mapGetters } from 'vuex'
	import { getCopyObj, getFormatTime, getParse, getDecimalN, getTrim } from '@/utils/util'
	import { parentId, getPickerOptions2, devArr } from '@/utils/data'
	import { rule } from '@/utils'
	import { addDriver, upDriver } from '@/api/sysetsmM/car'
	import { transportType, vehicleType } from '@/utils/vehData'
	import address from '@/utils/address'
	import { isProvince } from '@/utils/validate'
	import { addVehicle, upVehicle } from '@/api/sysetsmM/car'

	import { Dialog, Form, FormItem, Input, Message, Select, Option, Radio, DatePicker, Button, InputNumber } from 'element-ui'
	import AnimationBox from './AnimationBox'
	import PopupTree from './PopupTree'
	import MyAddress from './address'

	export default {
		name: 'MyForm',
		components: {
			ElDialog: Dialog,
			ElForm: Form,
			ElFormItem: FormItem,
			ElInput: Input,
			ElSelect: Select,
			ElOption: Option,
			ElRadio: Radio,
			ElDatePicker: DatePicker,
			ElButton: Button,
			ElInputNumber: InputNumber,
			AnimationBox,
			PopupTree,
			MyAddress
		},
		data() {
			const listLi = getCopyObj(this.$t('carManage.listLi'))
			const listTitle = getCopyObj(this.$t('carManage.listTitle'))
			const riskMsg = getCopyObj(this.$t('carManage.riskMsg'))
			const province = []
			for (const [k, v] of Object.entries(address)) {
				if (isProvince(k)) {
					const data = {
						name: v,
						id: v
					}
					province.push(data)
				}
			}
			listLi.bindProvincialAlarm.list = province

			const msgRules = this.$t('carManage.rules')
		    const rules = {
				vehPlateNo: rule('isEmpty', msgRules.vehPlateNo),
				// vehTerminalNo: rule('isNumberLength11', msgRules.vehTerminalNo),
				deviceTypeId: rule('isEmpty', msgRules.deviceTypeId, false, 'change'),
				dptName: rule('isEmpty', msgRules.dptName),
				vehSimno: rule('isEmpty', msgRules.vehSimno),
				vehOilmark: rule('isOneDecimal', msgRules.vehOilmark, true),
				vehTon: rule('isOneDecimal', msgRules.vehTon, true),
				vehOverSpeed: rule('isNumber', msgRules.testNum, true),
				vehOilPercent: rule('isNumber', msgRules.testNum, true),
				vehOilsize: rule('isNumber', msgRules.testNum, true),
				vehDisPercent: rule('isNumber', msgRules.testNum, true)
			}
			const pickerOptions = getPickerOptions2(this.$t('otherText'))
			return {
				listLi,
				listTitle,
				rules,
				curNode: null,
				treeCurNode: {},
				isRoot: false,
				defaultProps: {
					children: 'child',
					label: 'dptName'
				},
				opendIdArr: [],
				popupTreeIsShow: false,
				oldVal: '',
				labels: ['dptName'],
				pickerOptions,
				channels: [],
				nums: 17,
				addressKey: '',
				riskMsg
			}
		},
		computed: {
			...mapGetters([
				'userInfo'
			])
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
		created() {
			const { userInfo, listLi } = this
			this.isRoot = parentId === userInfo.id
			listLi.vehExpired.disabled = !this.isRoot
			listLi.transportationType.list = transportType
			listLi.vehicleType.list = vehicleType
		},
		mounted() {
			eventBus.$on('handAddress', this.handAddress)
		},
		beforeDestroy() {
			eventBus.$off('handAddress', this.handAddress)
		},
		methods: {
			/**
			 * 设置设备类型
			 */
			setDevType(list) {
				const { listLi } = this
				listLi.deviceTypeId.list = list
			},
			/**
			 * 设置部门名称的tree数据
			 */
			setDptNameTree(tree) {
				const { listLi } = this
				listLi.dptName.tree = tree
				this.opendIdArr.push(tree[0].id)
			},
			/**
			 * 设置司机的数组
			 * @param {Array} list 数组
			 */
			setDriverList(list) {
				const { listLi } = this
				listLi.masterDriverId.list = list
				listLi.slaveDriverId.list = list
			},
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
				this.curNode = row
				this.treeCurNode = {}
				this.handleAdd()
				const { listLi, listTitle, userInfo, isRoot } = this
				const userId = userInfo.id
				const curId = row.creatorUserId
				for (const [k, v] of Object.entries(row)) {
					if (listLi.hasOwnProperty(k)) {
						listLi[k].model = v
						// 满足条件就禁用该项表单
						if (k !== 'vehExpired' && listLi[k].hasOwnProperty('disabled')) {
							listLi[k].disabled = userId !== curId && !isRoot
						}
					} else if (typeof v === 'object' && v) {
						for (const [key, elem] of Object.entries(v)) {
							if (listLi.hasOwnProperty(key)) {
								listLi[key].model = elem
								// 满足条件就禁用该项表单
								if (key !== 'vehExpired' && listLi[key].hasOwnProperty('disabled')) {
									listLi[key].disabled = userId !== curId && !isRoot
								}
							}
						}
					}
				}

				const { vehColor, vehIsfees, vehicleNativePlaceCode, deviceTypeName, gpsInsuranceDto, gpsMaintenanceDto, gpsRiskManagementDto } = row
				listLi.vehColor.model = +vehColor - 1
				listLi.vehIsfees.model = +vehIsfees
				listLi.vehicleNativePlace.id = vehicleNativePlaceCode
				listLi.remark1.model = gpsMaintenanceDto.remark
				listLi.remark2.model = gpsInsuranceDto.remark
				listLi.remark3.model = gpsRiskManagementDto.remark

				const isOpen = gpsRiskManagementDto.isOpen ? 1 : 0
			  	listLi.isOpen.model = isOpen
				const devName = deviceTypeName || ''
				const i = devArr.findIndex((e) => devName.indexOf(e) > -1)
				// 是否是视频通道，反之则不是
				if (i === -1) {
					listTitle.channel.isShow = false
				} else {
					listTitle.channel.isShow = true
					if (row.channels) {
						const channels = getParse(row.channels)
						this.setChannels(channels.Channels)
					}
				}
			},
			/**
		     * 设置通道参数
		     * @param {Array} arr 重新赋值数据
		     */
		    setChannels(arr) {
		    	const { listTitle } = this
		      	this.channels = []
		      	for (const v of arr.values()) {
			        const obj = this.getChannelInfo()
			        obj.name.model = v.ChannelName
			        obj.type.model = v.ChannelType
			        this.channels.push(obj)
			    }
		      	this.$set(listTitle.channel, 'isSwitch', false)
		      	this.$set(listTitle.channel, 'model', arr.length)
		    },
			/**
			 * 点击添加
			 */
			handleAdd() {
				const { listLi } = this
				const curDate = new Date()
				curDate.setFullYear(curDate.getFullYear() + 1)
				const date = getFormatTime('Y-M-D', curDate.getTime())
				listLi.vehExpired.model = date
			},
    		/**
		     * 点击确认
		     */
		    handleConfirm(ref) {
		    	const { listLi, treeCurNode, userInfo, $refs, curNode } = this
		    	const oForm = $refs[ref]
		    	oForm.validate(valid => {
					if (valid) {
				    	const obj = {}
						for (const [k, v] of Object.entries(listLi)) {
							if (!obj.hasOwnProperty(v.parentKey)) {
								obj[v.parentKey] = {}
							}
							obj[v.parentKey][k] = v.model
						}
						const channel = this.getChannelData()
						if (channel === false) return
						obj.gpsVehicleDto.channels = channel
					    if (curNode) {
				    		this.editRequest(obj)
				    	} else {
				    		this.addRquest(obj)
				    	}
					} else {
						return false
					}
				})
		    },
		    /**
		     * 修改的请求
		     */
		    async editRequest(obj) {
		    	const { userInfo, curNode, isRoot, treeCurNode, listLi } = this
				const userId = userInfo.id
				const curId = curNode.creatorUserId
				// 该条数据创建人或root调用全部修改接口，否则调用部分修改接口
				const isPower = userId === curId || isRoot
				for (const [k, v] of Object.entries(obj)) {
					if (v && typeof v === 'object') {
						v.creationTime = curNode.creationTime
						v.creatorUserId = curNode.creatorUserId
						v.vehTerminalNo = listLi.vehTerminalNo.model
						if (curNode.hasOwnProperty(k)) {
							v.vehId = curNode[k].vehId
							v.id = curNode[k].id
						} else {
							v.vehId = curNode.vehId
							v.id = curNode.id
						}
					}
				}
				
				const { gpsVehicleDto, gpsMaintenanceDto, gpsInsuranceDto, gpsRiskManagementDto } = obj
				// 保险模块的保险公司如果没有值，就不允许修改，直接使用接口返回的信息
				const gpsInsuranceObj = curNode.gpsInsuranceDto || {}
				const insuranceCompany = getTrim(gpsInsuranceDto.insuranceCompany)
				if (!insuranceCompany) {
					for (const k of Object.keys(gpsInsuranceDto)) {
						if (gpsInsuranceObj[k] === null || !gpsInsuranceObj.hasOwnProperty(k)) {
							gpsInsuranceDto[k] = ''
						} else {
							gpsInsuranceDto[k] = gpsInsuranceObj[k]
						}
					}
				}

				// 1已开启风控设置，0是未开启，未开启的时候用户输入的数据无效，使用接口返回的数据
				const gpsRiskObj = curNode.gpsRiskManagementDto || {}
				const isOpen = gpsRiskManagementDto.isOpen

				if (!isOpen) {
					for (const k of Object.keys(gpsRiskManagementDto)) {
						if (gpsRiskObj[k] === null || !gpsRiskObj.hasOwnProperty(k)) {
							gpsRiskManagementDto[k] = ''
						} else {
							gpsRiskManagementDto[k] = gpsRiskObj[k]
						}
					}
				} else {
					const homeAddress = gpsRiskManagementDto.homeAddress || {}
					const companyAddress = gpsRiskManagementDto.companyAddress || {}
					const	homeLat = homeAddress.lat
					const	homeLng = homeAddress.lng
					const	companyLat = companyAddress.lat
					const	companyLng = companyAddress.lng
		
					gpsRiskManagementDto.homeLat = homeLat ? getDecimalN(homeLat, 6) : gpsRiskObj.homeLat || ''
					gpsRiskManagementDto.homeLng = homeLng ? getDecimalN(homeLng, 6) : gpsRiskObj.homeLng || ''
					gpsRiskManagementDto.companyLat = companyLat ? getDecimalN(companyLat, 6) : gpsRiskObj.companyLat || ''
					gpsRiskManagementDto.companyLng = companyLng ? getDecimalN(companyLng, 6) : gpsRiskObj.companyLng || ''
				}
				
				gpsRiskManagementDto.isOpen = !!isOpen
				// 全部修改接口才需要判断里面的数据
	            if (isPower) {
					gpsVehicleDto.dptId = treeCurNode.id || curNode.dptId
					gpsVehicleDto.vehicleNativePlaceCode = listLi.vehicleNativePlace.id
					gpsVehicleDto.vehIsfees = !!gpsVehicleDto.vehIsfees
				} else {
					delete gpsVehicleDto.channels
				}
				gpsVehicleDto.vehColor = `${+gpsVehicleDto.vehColor + 1}`
				gpsVehicleDto.id = curNode.id

				gpsMaintenanceDto.remark = gpsMaintenanceDto.remark1
				gpsInsuranceDto.remark = gpsInsuranceDto.remark2
				gpsRiskManagementDto.remark = gpsRiskManagementDto.remark3
				delete gpsMaintenanceDto.remark1
				delete gpsInsuranceDto.remark2
				delete gpsRiskManagementDto.remark3

				// 如果没有id就删除id属性
				if (!gpsInsuranceDto.id) {
					delete gpsInsuranceDto.id
				}
				if (!gpsRiskManagementDto.id) {
					delete gpsRiskManagementDto.id
				}
				if (!gpsMaintenanceDto.id) {
					delete gpsMaintenanceDto.id
				}

				delete gpsVehicleDto['dptName']
				delete gpsVehicleDto['creationTime']

		    	try {
			    	const res = await upVehicle(obj, isPower)
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
		     * 添加的请求
		     */
		    async addRquest(obj) {
		    	const { listLi, treeCurNode, userInfo, curNode } = this
		    	obj.createGpsVehilceDto = obj.gpsVehicleDto
		    	delete obj.gpsVehicleDto
		    	const { createGpsVehilceDto, gpsMaintenanceDto, gpsInsuranceDto, gpsRiskManagementDto } = obj

				createGpsVehilceDto.vehIsfees = !!createGpsVehilceDto.vehIsfees
				createGpsVehilceDto.vehColor = `${createGpsVehilceDto.vehColor + 1}`
				createGpsVehilceDto.dptId = treeCurNode.id
				createGpsVehilceDto.loadFactor = createGpsVehilceDto.loadFactor || 1
				createGpsVehilceDto.creatorUserId = userInfo.id
				createGpsVehilceDto.vehicleNativePlaceCode = listLi.vehicleNativePlace.id || ''

				gpsMaintenanceDto.remark = gpsMaintenanceDto.remark1
				gpsInsuranceDto.remark = gpsInsuranceDto.remark2
				gpsRiskManagementDto.remark = gpsRiskManagementDto.remark3
				delete gpsMaintenanceDto.remark1
				delete gpsInsuranceDto.remark2
				delete gpsRiskManagementDto.remark3

				// 1已开启风控设置，0是未开启，开启的时候正常赋值，关闭的时候删除其它字段，只上传isOpen字段
				if (gpsRiskManagementDto.isOpen) {
					const homeLat = listLi.homeAddress.lat
					const homeLng = listLi.homeAddress.lng
					const companyLat = listLi.companyAddress.lat
					const companyLng = listLi.companyAddress.lng
					gpsRiskManagementDto.homeLat = homeLat ? getDecimalN(homeLat, 6) : ''
					gpsRiskManagementDto.homeLng = homeLng ? getDecimalN(homeLng, 6) : ''
					gpsRiskManagementDto.companyLat = companyLat ? getDecimalN(companyLat, 6) : ''
					gpsRiskManagementDto.companyLng = companyLng ? getDecimalN(companyLng, 6) : ''
				} else {
					for (const k of Object.keys(gpsRiskManagementDto)) {
						delete gpsRiskManagementDto[k]
					}
				}
				gpsRiskManagementDto.isOpen = !!gpsRiskManagementDto.isOpen
				// 保险公司字段为空的时候，保险模块其它字段全部为空
				const insuranceCompany = getTrim(gpsInsuranceDto.insuranceCompany)
				if (!insuranceCompany) {
					for (const k of Object.keys(gpsInsuranceDto)) {
						gpsInsuranceDto[k] = ''
					}
				}
		    	try {
			    	const res = await addVehicle(obj)
			    	Message({
			            type: 'success',
			            message: this.$t('success.add')
			        })
		    		this.close()
			        this.$emit('request')
			    } catch (err) {

			    }
		    },
		    /**
			 * 获取请求的通道参数，如果没有返回false
			 * @return {*} 如果不是视频设备就返回空字符串，如果是视频设备但是没有参数就返回false，有数据就返回data
			 */
			getChannelData() {
				// 是视频设备才传通道参数
				const { channels, listTitle: { channel } } = this
				if (!channel.isShow) return ''
				if (!channels.length) {
					Message.error(this.$t('error.channel'))
					return false
				}
				const arr = channels.reduce((initArr, v, i) => {
					initArr.push({
						ChannelName: v.name.model,
						ChannelId: i,
						ChannelType: v.type.model
					})
					return initArr
				}, [])
				const data = JSON.stringify({
					Count: channels.length,
					Channels: arr
				})
				return data
			},
			/**
			 * 获取渲染页面的通道信息
			 */
			getChannelInfo() {
				return getCopyObj(this.$t('carManage.channelData'))
			},
		    /**
		     * 设备类型选择
		     * @return {String} val 当前选中的值
		     */
		    changeSelect(val) {
		    	const { listTitle, listLi } = this
		    	const devList = listLi.deviceTypeId.list
		    	const cur = devList.find(e => e.id === val)
		    	if (cur) {
			    	const devName = cur.devtName
			    	const hasType = devArr.some(e => devName.indexOf(e) > -1)
			    	this.$set(listTitle.channel, 'isShow', hasType)
			    	this.isVideoDev = hasType
		    	} else {
			    	this.$set(listTitle.channel, 'isShow', false)
			    	this.isVideoDev = false
		    	}
		    },
		    /**
		     * 点击tree的输入框
		     */
		    handleClick() {
		    	const { popupTreeIsShow, listLi } = this
		    	// 禁用的时候不执行或者已经为true的时候不执行
		    	if (listLi.dptName.disabled || popupTreeIsShow) return
		    	this.popupTreeIsShow = true
		    },
		    /**
		     * 输入框值改变
		     */
		    changeInput(e) {
		    	const val = e.target.value
		    	// 通过优化输入来尽量减少调用过滤的方法
				if (this.oldVal === val) return
				this.oldVal = val
				const tid = setTimeout(() => {
					clearTimeout(tid)
					if (val === this.oldVal) {
						if (!val) {
							this.handleClear()
						} else if (val.length >= 2) {
							this.$refs.popupTree.filter(val)
						}
					}
				}, 400)
		    },
		    /**
		     * 点击清除树的输入框
		     */
		    handleClear() {
		    	const { listLi } = this
		    	const tree = listLi.dptName.tree
		    	listLi.dptName.id = ''
		    	const oldTree = getCopyObj(tree)
				listLi.dptName.tree = []
				this.$nextTick(() => {
					listLi.dptName.tree = oldTree
				})
		    },
		    /**
		     * 点击树节点
		     * @param {Object} data 点击的当前值
		     */
		    handleNode(data) {
		    	const { listLi } = this
		    	const { dptName, id } = data
		    	listLi.dptName.model = dptName
		    	listLi.dptName.id = id
		    	this.popupTreeIsShow = false
		    	this.treeCurNode = data
		    },
		    /**
		     * 通道参数改变
		     * @param val
		     */
		    changeChannel(val) {
		    	this.channels = []
		    	const data = this.getChannelInfo()
		    	let num = 0
		    	while(num < val) {
		    		num ++
		    		data.name.model = `ch${num}`
		    		this.channels.push(getCopyObj(data))
		    	}
		    },
		    /**
		     * 点击车籍地输入框
		     * @param {String} prop 点击的当前字段
		     */
		    handleInput(prop) {
		    	if (prop === 'vehicleNativePlace') {
			    	const { $refs } = this
			    	$refs.address.initData()
		    	} else if (prop === 'homeAddress' || prop === 'companyAddress') {
		    		eventBus.$emit('changeMapPop', 1)
		    	}
		    	this.addressKey = prop
		    },
		    /**
			 * 地图弹窗点击地址
			 * @param {Object} pt 经纬度
			 */
			handAddress (pt) {
				const { listLi, addressKey } = this
				const { lng, lat, address } = pt
				if (addressKey === 'companyAddress' || addressKey === 'homeAddress') {
					listLi[addressKey].model = address
					listLi[addressKey].lng = lng
					listLi[addressKey].lat = lat
				}
			},
			/**
			 * 选择地址确认
			 */
			handleOk(val) {
				const { listLi } = this
				listLi.vehicleNativePlace.model = val.text
				listLi.vehicleNativePlace.id = val.id
			}
		}
	}
</script>
