<template>
  <div>
    <div class="approval_page_bg">
      <div class="fifter">
        <my-tabs
          :allow-fifter="false"
          :return-show="true"
          :active-name="'all'"
          :tabs-list="tabsList"
          :other="divType=='approval'"
          :other-text="'审核'"
          @actionClick="showApproval"
          @returnAction="returnPage"/>
      </div>
      <div v-loading="showloading" class="approval_body">
        <div v-if="divType=='new'||divType=='edit'">
          <!-- 新建/编辑加班申请 -->
          <my-form
            v-if="modelType==5"
            ref="overtimeForm"
            :model="overtimeForm"
            :rules="overtimeRules"
            class="approval_form_info">
            <p class="form_title">加班申请</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ accountInfo.name }}</td>
                <td class="table_title">申请日期</td>
                <td v-if="divType=='new'" class="table_form_block table_form_block_padding">{{ new Date()|parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
                <td v-if="divType=='edit'" class="table_form_block table_form_block_padding">{{ overtimeForm.createdDate }}</td>
                <td class="table_title">审批类型</td>
                <td class="table_form_block">
                  <my-form-item prop="processTypeId">
                    <el-select
                      v-model="overtimeForm.processTypeId"
                      :disabled="divType=='edit'"
                      placeholder="请选择审批类型"
                      size="mini"
                      filterable>
                      <el-option v-for="item in processtypeList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">申请类别</td>
                <td class="table_form_block table_form_block_padding" colspan="5">
                  <my-form-item prop="type">
                    <el-radio-group v-model="overtimeForm.type">
                      <el-radio
                        v-for="(item,index) in radioList"
                        v-if="item!=''"
                        :key="index"
                        :label="index"
                        @change="editType">{{ item }}</el-radio>
                    </el-radio-group>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">开始时间</td>
                <td class="table_form_block table_form_block_padding">
                  <my-form-item prop="startDate">
                    <div class="time_block">
                      <p>
                        <i class="el-icon-date" />
                      </p>
                      <el-date-picker
                        v-model="overday_start"
                        :clearable="false"
                        class="fixed_date"
                        type="date"
                        size="mini"
                        placeholder="开始日期"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        style="width:100px"
                        @change="checkValue" />
                      <el-time-select
                        v-if="overday_start!=''"
                        v-model="overtime_start"
                        :picker-options="{
                          start: '00:00',
                          step: '00:30',
                          end: '23:30'
                        }"
                        :clearable="false"
                        class="fixed_time"
                        size="mini"
                        style="width:100px"
                        @change="checkValue" />
                    </div>
                  </my-form-item>
                </td>
                <td class="table_title">结束时间</td>
                <td class="table_form_block table_form_block_padding">
                  <my-form-item prop="endDate">
                    <div class="time_block">
                      <p>
                        <i class="el-icon-date" />
                      </p>
                      <el-date-picker
                        v-model="overday_end"
                        :clearable="false"
                        class="fixed_date"
                        type="date"
                        size="mini"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        placeholder="结束日期"
                        style="width:100px"
                        @change="checkValue" />
                      <el-time-select
                        v-if="overday_end!=''"
                        v-model="overtime_end"
                        :picker-options="{
                          start: '00:00',
                          step: '00:30',
                          end: '23:30'
                        }"
                        :clearable="false"
                        size="mini"
                        class="fixed_time"
                        style="width:100px"
                        @change="checkValue" />
                    </div>
                  </my-form-item>
                </td>
                <td class="table_title">加班时长</td>
                <td class="table_form_block">
                  <my-form-item prop="hours">
                    <!-- <el-input v-model.trim="overtimeForm.hours" :min="0"/> -->
                    <el-input-number
                      v-model.trim="overtimeForm.hours"
                      :min="0"
                      :precision="1"
                      :step="0.5"
                      controls-position="right" />
                      <!-- <span style="margin-left:10px">小时</span> -->
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">事由</td>
                <td class="table_form_block" colspan="5">
                  <my-form-item prop="remark">
                    <el-input
                      v-model.trim="overtimeForm.remark"
                      :rows="3"
                      size="mini"
                      type="textarea"
                      placeholder="请输入加班申请的事由,最大长度为120个字" />
                  </my-form-item>
                </td>
              </tr>
            </table>
            <my-form-item class="form_btn">
              <el-button v-if="divType!='edit'" @click="resetForm">重 置</el-button>
              <el-button :loading="submitting" type="primary" @click="sureSave('overtimeForm')">保存</el-button>
            </my-form-item>
          </my-form>
          <!-- 新建/编辑请假申请 -->
          <my-form
            v-if="modelType==6"
            ref="leaveForm"
            :model="leaveForm"
            :rules="leaveRules"
            class="approval_form_info">
            <p class="form_title">请假申请</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ accountInfo.name }}</td>
                <td class="table_title">申请日期</td>
                <td v-if="divType=='new'" class="table_form_block table_form_block_padding">{{ new Date()|parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
                <td v-if="divType=='edit'" class="table_form_block table_form_block_padding">{{ leaveForm.createdDate }}</td>
                <td class="table_title">审批类型</td>
                <td class="table_form_block">
                  <my-form-item prop="processTypeId">
                    <el-select
                      v-model="leaveForm.processTypeId"
                      :disabled="divType=='edit'"
                      placeholder="请选择审批类型"
                      size="mini"
                      filterable>
                      <el-option v-for="item in processtypeList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">申请类别</td>
                <td class="table_form_block table_form_block_padding" colspan="5">
                  <my-form-item prop="type">
                    <el-radio-group v-model="leaveForm.type">
                      <el-radio v-for="(item,index) in radioList" v-if="item!=''" :key="index" :label="index">{{ item }}
                      </el-radio>
                    </el-radio-group>
                    <div
                      v-if="leaveForm.type==3"
                      style="font-size: 12px; color: #ff0000;">
                      <span>剩余{{ temporaryTime }}小时可调休</span>
                    </div>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">开始时间</td>
                <td class="table_form_block table_form_block_padding">
                  <my-form-item prop="startDate">
                    <div class="time_block">
                      <p>
                        <i class="el-icon-date" />
                      </p>
                      <el-date-picker
                        v-model="leaveday_start"
                        :clearable="false"
                        type="date"
                        class="fixed_date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        placeholder="开始日期"
                        style="width:100px"
                        size="mini"
                        @change="checkLeaveValueStart" />
                      <el-time-select
                        v-if="leaveday_start!=''"
                        v-model="leavetime_start"
                        :picker-options="timeConfig"
                        :clearable="false"
                        size="mini"
                        class="fixed_time"
                        style="width:100px"
                        @change="checkLeaveValueStart" />
                    </div>
                  </my-form-item>
                </td>
                <td class="table_title">结束时间</td>
                <td class="table_form_block table_form_block_padding">
                  <my-form-item prop="endDate">
                    <div class="time_block">
                      <p>
                        <i class="el-icon-date" />
                      </p>
                      <el-date-picker
                        v-model="leaveday_end"
                        :clearable="false"
                        class="fixed_date"
                        type="date"
                        size="mini"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        placeholder="结束日期"
                        style="width:100px"
                        @change="checkLeaveValue" />
                      <el-time-select
                        v-if="leaveday_end!=''"
                        v-model="leavetime_end"
                        :picker-options="{
                          start: '00:00',
                          step: '00:30',
                          end: '23:30'
                        }"
                        :clearable="false"
                        size="mini"
                        class="fixed_time"
                        style="width:100px"
                        @change="checkLeaveValue" />
                    </div>
                  </my-form-item>
                </td>
                <td class="table_title">请假时长</td>
                <td class="table_form_block">
                  <my-form-item prop="hours">
                    <el-input-number
                      v-model.trim="leaveForm.hours"
                      :min="0"
                      :precision="1"
                      :step="0.5"
                      controls-position="right" />
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">事由</td>
                <td class="table_form_block" colspan="5">
                  <my-form-item prop="remark">
                    <el-input
                      v-model.trim="leaveForm.remark"
                      :rows="3"
                      size="mini"
                      type="textarea"
                      placeholder="请输入请假申请的事由,最大长度为120个字" />
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">紧急联系人</td>
                <td class="table_form_block" colspan="2">
                  <my-form-item prop="contact">
                    <el-input v-model.trim="leaveForm.contact" size="mini" placeholder="请输入紧急联系人" />
                  </my-form-item>
                </td>
                <td class="table_title">联系电话</td>
                <td class="table_form_block" colspan="2">
                  <my-form-item prop="phone">
                    <el-input v-model.trim="leaveForm.phone" size="mini" placeholder="请输入紧急联系电话" />
                  </my-form-item>
                </td>
              </tr>
            </table>
            <my-form-item class="form_btn">
              <el-button v-if="divType!='edit'" @click="resetForm">重 置</el-button>
              <el-button :loading="submitting" type="primary" @click="sureSave('leaveForm')">保存</el-button>
            </my-form-item>
          </my-form>
          <!-- 新建/编辑销假申请 -->
          <my-form
            v-if="modelType==10"
            ref="salesLeaveForm"
            :model="salesLeaveForm"
            :rules="salesLeaveRules"
            class="approval_form_info">
            <p class="form_title">销假申请</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ accountInfo.name }}</td>
                <td class="table_title">申请日期</td>
                <td v-if="divType=='new'" class="table_form_block table_form_block_padding">{{ new Date()|parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
                <td v-if="divType=='edit'" class="table_form_block table_form_block_padding">{{ salesLeaveForm.createdDate }}</td>
                <td class="table_title">审批类型</td>
                <td class="table_form_block">
                  <my-form-item prop="processTypeId">
                    <el-select
                      v-model="salesLeaveForm.processTypeId"
                      :disabled="divType=='edit'"
                      placeholder="请选择审批类型"
                      size="mini"
                      filterable>
                      <el-option v-for="item in processtypeList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">请假单</td>
                <td class="table_form_block table_form_block_padding" colspan="5">
                  <my-form-item prop="leaveId">
                    <el-select
                      v-model="salesLeaveForm.leaveId"
                      :disabled="divType=='edit'"
                      placeholder="请选择请假单"
                      size="mini"
                      filterable
                      @change="choseLeaveType">
                      <el-option v-for="item in radioList" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">开始时间</td>
                <td class="table_form_block table_form_block_padding">
                  <my-form-item prop="startDate">
                    <div class="time_block">
                      <p>
                        <i class="el-icon-date" />
                      </p>
                      <el-date-picker
                        v-model="leaveday_start"
                        :disabled="salesLeaveForm.leaveId==''"
                        :clearable="false"
                        class="fixed_date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        size="mini"
                        placeholder="开始日期"
                        style="width:100px"
                        @change="checkSalesLeaveStart" />
                      <el-time-select
                        v-if="leaveday_start!=''"
                        v-model="leavetime_start"
                        :disabled="salesLeaveForm.leaveId==''"
                        :picker-options="timeConfig"
                        :clearable="false"
                        size="mini"
                        class="fixed_time"
                        style="width:100px"
                        @change="checkSalesLeaveStart" />
                    </div>
                  </my-form-item>
                </td>
                <td class="table_title">结束时间</td>
                <td class="table_form_block table_form_block_padding">
                  <my-form-item prop="endDate">
                    <div class="time_block">
                      <p>
                        <i class="el-icon-date" />
                      </p>
                      <el-date-picker
                        :disabled="salesLeaveForm.leaveId==''"
                        v-model="leaveday_end"
                        :clearable="false"
                        class="fixed_date"
                        type="date"
                        size="mini"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        placeholder="结束日期"
                        style="width:100px"
                        @change="checkSalesLeaveValue" />
                      <el-time-select
                        v-if="leaveday_end!=''"
                        v-model="leavetime_end"
                        :disabled="salesLeaveForm.leaveId==''"
                        :picker-options="{
                          start: '00:00',
                          step: '00:30',
                          end: '23:30'
                        }"
                        :clearable="false"
                        size="mini"
                        class="fixed_time"
                        style="width:100px"
                        @change="checkSalesLeaveValue" />
                    </div>
                  </my-form-item>
                </td>
                <td class="table_title">销假时长</td>
                <td class="table_form_block">
                  <my-form-item prop="hours">
                    <el-input-number
                      v-model.trim="salesLeaveForm.hours"
                      :disabled="salesLeaveForm.leaveId==''"
                      :min="0"
                      :precision="1"
                      :step="0.5"
                      controls-position="right" />
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">事由</td>
                <td class="table_form_block" colspan="5">
                  <my-form-item prop="remark">
                    <el-input
                      v-model.trim="salesLeaveForm.remark"
                      :rows="3"
                      size="mini"
                      type="textarea"
                      placeholder="请输入销假事由,最大长度为120个字" />
                  </my-form-item>
                </td>
              </tr>
            </table>
            <my-form-item class="form_btn">
              <el-button v-if="divType!='edit'" @click="resetForm">重 置</el-button>
              <el-button :loading="submitting" type="primary" @click="sureSave('salesLeaveForm')">保存</el-button>
            </my-form-item>
          </my-form>
          <!-- 新建/编辑拜访单申请 -->
          <my-form
            v-if="modelType==2"
            ref="visitForm"
            :model="visitForm"
            :rules="visitRules"
            class="approval_form_info">
            <p class="form_title">拜访申请</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ accountInfo.name }}</td>
                <td class="table_title">申请日期</td>
                <td v-if="divType=='new'" class="table_form_block table_form_block_padding">{{ new Date()|parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
                <td v-if="divType=='edit'" class="table_form_block table_form_block_padding">{{ visitForm.createdDate }}</td>
                <td class="table_title">审批类型</td>
                <td class="table_form_block">
                  <my-form-item prop="processTypeId">
                    <el-select
                      v-model="visitForm.processTypeId"
                      :disabled="divType=='edit'"
                      placeholder="请选择审批类型"
                      size="mini"
                      filterable>
                      <el-option v-for="item in processtypeList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">申请单名称</td>
                <td class="table_form_block" colspan="5">
                  <my-form-item prop="title">
                    <el-input v-model.trim="visitForm.title" size="mini" placeholder="请输入申请单名称" />
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">客户名称</td>
                <td class="table_form_block">
                  <my-form-item prop="customer">
                    <el-input v-model.trim="visitForm.customer" size="mini" placeholder="请输入客户名称" />
                  </my-form-item>
                </td>
                <td class="table_title">联系人</td>
                <td class="table_form_block">
                  <my-form-item prop="contact">
                    <el-input v-model.trim="visitForm.contact" size="mini" placeholder="请输入联系人" />
                  </my-form-item>
                </td>
                <td class="table_title">目的地</td>
                <td class="table_form_block">
                  <my-form-item prop="destination">
                    <el-input v-model.trim="visitForm.destination" size="mini" placeholder="请输入目的地" />
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">陪同人</td>
                <td class="table_form_block">
                  <my-form-item prop="accompanyList">
                    <el-select
                      v-model="accompanyList"
                      multiple
                      placeholder="请选择陪同人"
                      style="width:230px"
                      size="mini"
                      filterable
                      collapse-tags>
                      <el-option v-for="item in radioList" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </my-form-item>
                </td>
                <td class="table_title">开始时间</td>
                <td class="table_form_block table_form_block_padding">
                  <my-form-item prop="startDate">
                    <div class="time_block">
                      <p>
                        <i class="el-icon-date" />
                      </p>
                      <el-date-picker
                        v-model="visitForm.startDate"
                        :default-time="false"
                        class="fixed_date"
                        type="datetime"
                        size="mini"
                        placeholder="选择日期时间"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        style="width:140px"
                        @change="dateChange('end',visitForm.endDate)" />
                    </div>
                  </my-form-item>
                </td>
                <td class="table_title">结束时间</td>
                <td class="table_form_block table_form_block_padding">
                  <my-form-item prop="endDate">
                    <div class="time_block">
                      <p>
                        <i class="el-icon-date" />
                      </p>
                      <el-date-picker
                        v-model="visitForm.endDate"
                        type="datetime"
                        class="fixed_date"
                        placeholder="选择日期时间"
                        size="mini"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        style="width:140px"
                        @change="dateChange('end',visitForm.endDate)" />
                    </div>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">拜访目的</td>
                <td class="table_form_block" colspan="5">
                  <my-form-item prop="remark">
                    <el-input
                      v-model.trim="visitForm.remark"
                      :rows="3"
                      size="mini"
                      type="textarea"
                      placeholder="请输入拜访目的，最大长度为120个字,最大长度为120个字" />
                  </my-form-item>
                </td>
              </tr>
            </table>
            <my-form-item class="form_btn">
              <el-button v-if="divType!='edit'" @click="resetForm">重 置</el-button>
              <el-button :loading="submitting" type="primary" @click="sureSave('visitForm')">保存</el-button>
            </my-form-item>
          </my-form>
          <!-- 新建/编辑用车申请 -->
          <my-form
            v-if="modelType==7"
            ref="carForm"
            :model="carForm"
            :rules="carRules"
            class="approval_form_info">
            <p class="form_title">用车申请</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ accountInfo.name }}</td>
                <td class="table_title">申请日期</td>
                <td v-if="divType=='new'" class="table_form_block table_form_block_padding">{{ new Date()|parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
                <td v-if="divType=='edit'" class="table_form_block table_form_block_padding">{{ carForm.createdDate }}</td>
                <td class="table_title">审批类型</td>
                <td class="table_form_block">
                  <my-form-item prop="processTypeId">
                    <el-select
                      v-model="carForm.processTypeId"
                      :disabled="divType=='edit'"
                      placeholder="请选择审批类型"
                      size="mini"
                      filterable>
                      <el-option v-for="item in processtypeList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">申请单名称</td>
                <td class="table_form_block">
                  <my-form-item prop="title">
                    <el-input v-model.trim="carForm.title" size="mini" placeholder="请输入申请单名称" />
                  </my-form-item>
                </td>
                <td class="table_title">申请类别</td>
                <td class="table_form_block table_form_block_padding" colspan="3">
                  <my-form-item prop="type">
                    <el-radio-group v-model="carForm.type">
                      <el-radio
                        v-for="(item,index) in radioList"
                        v-if="item!=''"
                        :key="index"
                        :label="index"
                        @change="editType">{{ item }}</el-radio>
                    </el-radio-group>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">用车时间</td>
                <td class="table_form_block table_form_block_padding">
                  <my-form-item prop="startDate">
                    <div class="time_block">
                      <p>
                        <i class="el-icon-date" />
                      </p>
                      <el-date-picker
                        v-model="carForm.useDate"
                        :clearable="false"
                        class="fixed_date"
                        type="datetime"
                        size="mini"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm"
                        format="yyyy-MM-dd HH:mm"
                        style="width:100px"/>
                    </div>
                  </my-form-item>
                </td>
                <td class="table_title">需要司机</td>
                <td class="table_form_block table_form_block_padding">
                  <my-form-item prop="isDriver">
                    <el-radio-group v-model="carForm.isDriver">
                      <el-radio label="1">是</el-radio>
                      <el-radio label="2">否</el-radio>
                    </el-radio-group>
                  </my-form-item>
                </td>
                <td class="table_title">乘车人数</td>
                <td class="table_form_block">
                  <my-form-item prop="busNum">
                    <el-input-number
                      v-model.trim="carForm.busNum"
                      :min="1"
                      :precision="0"
                      controls-position="right"
                      label="输入乘车人数"
                      @change="changeNum" />
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">事由</td>
                <td class="table_form_block" colspan="5">
                  <my-form-item prop="remark">
                    <el-input
                      v-model.trim="carForm.remark"
                      :rows="3"
                      size="mini"
                      type="textarea"
                      placeholder="请输入申请原因,最大长度为120个字" />
                  </my-form-item>
                </td>
              </tr>
            </table>
            <my-form-item class="form_btn">
              <el-button v-if="divType!='edit'" @click="resetForm">重 置</el-button>
              <el-button :loading="submitting" type="primary" @click="sureSave('carForm')">保存</el-button>
            </my-form-item>
          </my-form>
          <!-- 新建/编辑用章申请 -->
          <my-form
            v-if="modelType==3"
            ref="sealForm"
            :model="sealForm"
            :rules="sealRules"
            class="approval_form_info">
            <p class="form_title">用章申请</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ accountInfo.name }}</td>
                <td class="table_title">申请日期</td>
                <td v-if="divType=='new'" class="table_form_block table_form_block_padding">{{ new Date()|parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
                <td v-if="divType=='edit'" class="table_form_block table_form_block_padding">{{ sealForm.createdDate }}</td>
                <td class="table_title">审批类型</td>
                <td class="table_form_block">
                  <my-form-item prop="processTypeId">
                    <el-select
                      v-model="sealForm.processTypeId"
                      :disabled="divType=='edit'"
                      placeholder="请选择审批类型"
                      size="mini"
                      filterable>
                      <el-option v-for="item in processtypeList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">申请单名称</td>
                <td class="table_form_block">
                  <my-form-item prop="title">
                    <el-input v-model.trim="sealForm.title" size="mini" placeholder="请输入申请单名称" />
                  </my-form-item>
                </td>
                <td class="table_title">用章类型</td>
                <td class="table_form_block table_form_block_padding" colspan="3">
                  <my-form-item prop="subject">
                    <el-radio-group v-model="sealForm.subject">
                      <el-radio
                        v-for="(item,index) in radioList1"
                        v-if="item!=''"
                        :key="index"
                        :label="index"
                        @change="editType">{{ item }}</el-radio>
                    </el-radio-group>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">用章时间</td>
                <td class="table_form_block table_form_block_padding">
                  <my-form-item prop="useDate">
                    <div class="time_block">
                      <p>
                        <i class="el-icon-date" />
                      </p>
                      <el-date-picker
                        v-model="sealForm.useDate"
                        :clearable="false"
                        type="datetime"
                        class="fixed_date"
                        size="mini"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm"
                        format="yyyy-MM-dd HH:mm"
                        style="width:120px" />
                    </div>
                  </my-form-item>
                </td>
                <td class="table_title">用章用途</td>
                <td class="table_form_block table_form_block_padding" colspan="3">
                  <my-form-item prop="type">
                    <el-radio-group v-model="sealForm.type">
                      <el-radio v-for="(item,index) in radioList" v-if="item!=''" :key="index" :label="index">{{ item }}
                      </el-radio>
                    </el-radio-group>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">事由</td>
                <td class="table_form_block" colspan="5">
                  <my-form-item prop="remark">
                    <el-input
                      v-model.trim="sealForm.remark"
                      :rows="3"
                      size="mini"
                      type="textarea"
                      placeholder="请输入申请原因,最大长度为120个字" />
                  </my-form-item>
                </td>
              </tr>
            </table>
            <my-form-item class="form_btn">
              <el-button v-if="divType!='edit'" @click="resetForm">重 置</el-button>
              <el-button :loading="submitting" type="primary" @click="sureSave('sealForm')">保存</el-button>
            </my-form-item>
          </my-form>
          <!-- 新建/编辑物品领用申请 -->
          <my-form
            v-if="modelType==8"
            ref="receiveForm"
            :model="receiveForm"
            :rules="receiveRules"
            class="approval_form_info">
            <p class="form_title">物品领用申请</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ accountInfo.name }}</td>
                <td class="table_title">申请日期</td>
                <td v-if="divType=='new'" class="table_form_block table_form_block_padding">{{ new Date()|parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
                <td v-if="divType=='edit'" class="table_form_block table_form_block_padding">{{ receiveForm.createdDate }}</td>
                <td class="table_title">审批类型</td>
                <td class="table_form_block">
                  <my-form-item prop="processTypeId">
                    <el-select
                      v-model="receiveForm.processTypeId"
                      :disabled="divType=='edit'"
                      placeholder="请选择审批类型"
                      size="mini"
                      filterable>
                      <el-option v-for="item in processtypeList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">领用时间</td>
                <td class="table_form_block table_form_block_padding" colspan="2">
                  <my-form-item prop="receiveDate">
                    <div class="time_block">
                      <p>
                        <i class="el-icon-date" />
                      </p>
                      <el-date-picker
                        v-model="receiveForm.receiveDate"
                        :clearable="false"
                        type="datetime"
                        class="fixed_date"
                        size="mini"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm"
                        format="yyyy-MM-dd HH:mm"
                        style="width:120px" />
                    </div>
                  </my-form-item>
                </td>
                <td class="table_title">物品名称</td>
                <td class="table_form_block table_form_block_padding" colspan="2">
                  <my-form-item prop="title">
                    <el-input v-model.trim="receiveForm.title" size="mini" placeholder="请输入物品名称" />
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">领用类型</td>
                <td class="table_form_block table_form_block_padding" colspan="5">
                  <my-form-item prop="type">
                    <el-radio-group v-model="receiveForm.type">
                      <el-radio v-for="(item,index) in radioList" v-if="item!=''" :key="index" :label="index">{{ item }}
                      </el-radio>
                    </el-radio-group>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">申请原因</td>
                <td class="table_form_block" colspan="5">
                  <my-form-item prop="remark">
                    <el-input
                      v-model.trim="receiveForm.remark"
                      :rows="3"
                      size="mini"
                      type="textarea"
                      placeholder="请输入申请原因,最大长度为120个字" />
                  </my-form-item>
                </td>
              </tr>
            </table>
            <my-form-item class="form_btn">
              <el-button v-if="divType!='edit'" @click="resetForm">重 置</el-button>
              <el-button :loading="submitting" type="primary" @click="sureSave('receiveForm')">保存</el-button>
            </my-form-item>
          </my-form>
          <!-- 新建/编辑报销申请 -->
          <my-form
            v-if="modelType==4"
            ref="refundForm"
            :model="refundForm"
            :rules="refundRules"
            class="approval_form_info">
            <p class="form_title text_left">报销申请</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ accountInfo.name }}</td>
                <td class="table_title">申请日期</td>
                <td v-if="divType=='new'" class="table_form_block table_form_block_padding">{{ new Date()|parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
                <td v-if="divType=='edit'" class="table_form_block table_form_block_padding">{{ refundForm.createdDate }}</td>
                <td class="table_title">审批类型</td>
                <td class="table_form_block">
                  <my-form-item prop="processTypeId">
                    <el-select
                      v-model="refundForm.processTypeId"
                      :disabled="divType=='edit'"
                      placeholder="请选择审批类型"
                      size="mini"
                      filterable>
                      <el-option v-for="item in processtypeList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">报销单名称</td>
                <td class="table_form_block table_form_block_padding" colspan="5">
                  <my-form-item prop="title">
                    <el-input v-model.trim="refundForm.title" size="mini" placeholder="请输入报销单名称" />
                  </my-form-item>
                </td>
              </tr>
            </table>
            <p class="form_title text_left">
              <span>报销明细及金额</span>
              <span>
                <el-button plain icon="el-icon-edit-outline" size="mini" @click="addApplyInfo(modelType)">添加行</el-button>
                <el-button :disabled="refundList.length<=1" plain icon="el-icon-edit-outline" size="mini" @click="removeApplyInfo(modelType,0)">删除行</el-button>
              </span>
            </p>
            <el-table
              :data="refundList"
              class="refund_table"
              border>
              <el-table-column
                type="index"
                width="50"
                align="center"/>
              <el-table-column
                label="项目名称"
                align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.proName"
                    type="text"
                    size="mini"
                    placeholder="项目名称"/>
                </template>
              </el-table-column>
              <el-table-column
                label="单价（元）"
                align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model.trim="scope.row.proPrice"
                    type="number"
                    size="mini"
                    placeholder="单价"
                    @blur="calcAmout" />
                </template>
              </el-table-column>
              <el-table-column
                label="数量"
                align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model.trim="scope.row.proNum"
                    style="width:100px"
                    placeholder="数量"
                    type="number"
                    class="view_right"
                    @blur="calcAmout" />
                </template>
              </el-table-column>
              <el-table-column
                label="备注"
                align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.remark"
                    type="text"
                    size="mini"
                    placeholder="备注"/>
                </template>
              </el-table-column>
              <el-table-column
                label="上传凭证"
                align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" plain @click="showRefundDialog(scope.row.refundFilesArr, scope.$index)">管理附件({{ scope.row.refundFilesArr.length }})</el-button>
                </template>
              </el-table-column>
            </el-table>
            <p class="form_title text_left">
              <span>收款账户信息</span>
            </p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">开户姓名</td>
                <td class="table_form_block table_form_block_padding" colspan="2">
                  <my-form-item prop="name">
                    <el-input v-model.trim="refundForm.name" size="mini" placeholder="请输入开户姓名"/>
                  </my-form-item>
                </td>
                <td class="table_title">开户行</td>
                <td class="table_form_block table_form_block_padding" colspan="2">
                  <my-form-item prop="bank">
                    <el-input v-model.trim="refundForm.bank" size="mini" placeholder="请输入开户行" />
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">银行账号</td>
                <td class="table_form_block table_form_block_padding" colspan="2">
                  <my-form-item prop="card">
                    <el-input v-model.trim="refundForm.card" size="mini" placeholder="请输入银行账号"/>
                  </my-form-item>
                </td>
                <td class="table_title">报销总额</td>
                <td class="table_form_block" colspan="3">
                  <my-form-item prop="amount">
                    <el-input v-model.trim="refundForm.amount" :disabled="true" size="mini" placeholder="请输入报销总额"/>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">申请原因</td>
                <td class="table_form_block table_form_block_padding" colspan="5">
                  <my-form-item prop="remark">
                    <el-input
                      v-model.trim="refundForm.remark"
                      :rows="3"
                      size="mini"
                      type="textarea"
                      placeholder="请输入申请原因，最大长度为120个字" />
                  </my-form-item>
                </td>
              </tr>
            </table>
            <my-form-item class="form_btn">
              <el-button v-if="divType!='edit'" @click="resetForm">重 置</el-button>
              <el-button :loading="submitting" type="primary" @click="sureSave('refundForm')">保存</el-button>
            </my-form-item>
          </my-form>
          <!-- 新建/编辑费用申请 -->
          <my-form
            v-if="modelType==11"
            ref="costForm"
            :model="costForm"
            :rules="costRules"
            class="approval_form_info">
            <p class="form_title text_left">费用申请</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ accountInfo.name }}</td>
                <td class="table_title">申请日期</td>
                <td v-if="divType=='new'" class="table_form_block table_form_block_padding">{{ new Date()|parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
                <td v-if="divType=='edit'" class="table_form_block table_form_block_padding">{{ costForm.createdDate }}</td>
                <td class="table_title">审批类型</td>
                <td class="table_form_block">
                  <my-form-item prop="processTypeId">
                    <el-select
                      v-model="costForm.processTypeId"
                      :disabled="divType=='edit'"
                      placeholder="请选择审批类型"
                      size="mini"
                      filterable>
                      <el-option v-for="item in processtypeList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">费用申请名称</td>
                <td class="table_form_block table_form_block_padding" colspan="5">
                  <my-form-item prop="title">
                    <el-input v-model.trim="costForm.title" size="mini" placeholder="请输入费用申请单名称" />
                  </my-form-item>
                </td>
              </tr>
            </table>
            <p class="form_title text_left">
              <span>费用申请明细及金额</span>
              <span>
                <el-button plain icon="el-icon-edit-outline" size="mini" @click="addApplyInfo(modelType)">添加行</el-button>
                <el-button :disabled="costList.length<=1" plain icon="el-icon-edit-outline" size="mini" @click="removeApplyInfo(modelType,0)">删除行</el-button>
              </span>
            </p>
            <el-table
              :data="costList"
              class="refund_table"
              border>
              <el-table-column
                type="index"
                width="50"
                align="center"/>
              <el-table-column
                label="项目名称"
                align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.proName"
                    type="text"
                    size="mini"
                    placeholder="项目名称"/>
                </template>
              </el-table-column>
              <el-table-column
                label="单价（元）"
                align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model.trim="scope.row.proPrice"
                    type="number"
                    size="mini"
                    placeholder="单价"
                    @blur="calcCostAmout" />
                </template>
              </el-table-column>
              <el-table-column
                label="数量"
                align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model.trim="scope.row.proNum"
                    style="width:100px"
                    placeholder="数量"
                    type="number"
                    class="view_right"
                    @blur="calcCostAmout" />
                </template>
              </el-table-column>
              <el-table-column
                label="备注"
                align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.remark"
                    type="text"
                    size="mini"
                    placeholder="备注"/>
                </template>
              </el-table-column>
              <el-table-column
                label="上传凭证"
                align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" plain @click="showCostDialog(scope.row.costFilesArr, scope.$index)">管理附件({{ scope.row.costFilesArr.length }})</el-button>
                </template>
              </el-table-column>
            </el-table>
            <p class="form_title text_left">
              <span>收款账户信息</span>
            </p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">开户姓名</td>
                <td class="table_form_block table_form_block_padding" colspan="2">
                  <my-form-item prop="name">
                    <el-input v-model.trim="costForm.name" size="mini" placeholder="请输入开户姓名"/>
                  </my-form-item>
                </td>
                <td class="table_title">开户行</td>
                <td class="table_form_block table_form_block_padding" colspan="2">
                  <my-form-item prop="bank">
                    <el-input v-model.trim="costForm.bank" size="mini" placeholder="请输入开户行" />
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">银行账号</td>
                <td class="table_form_block table_form_block_padding" colspan="2">
                  <my-form-item prop="card">
                    <el-input v-model.trim="costForm.card" size="mini" placeholder="请输入银行账号"/>
                  </my-form-item>
                </td>
                <td class="table_title">费用申请总额</td>
                <td class="table_form_block" colspan="3">
                  <my-form-item prop="amount">
                    <el-input v-model.trim="costForm.amount" :disabled="true" size="mini" placeholder="请输入费用申请总额"/>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">申请原因</td>
                <td class="table_form_block table_form_block_padding" colspan="5">
                  <my-form-item prop="remark">
                    <el-input
                      v-model.trim="costForm.remark"
                      :rows="3"
                      size="mini"
                      type="textarea"
                      placeholder="请输入申请原因，最大长度为120个字" />
                  </my-form-item>
                </td>
              </tr>
            </table>
            <my-form-item class="form_btn">
              <el-button v-if="divType!='edit'" @click="resetForm">重 置</el-button>
              <el-button :loading="submitting" type="primary" @click="sureSave('costForm')">保存</el-button>
            </my-form-item>
          </my-form>
          <!-- 新建/编辑采购付款 -->
          <my-form
            v-if="modelType==1"
            ref="procurementForm"
            :model="procurementForm"
            :rules="procurementRules"
            class="approval_form_info">
            <p class="form_title text_left">创建采购付款</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ accountInfo.name }}</td>
                <td class="table_title">申请日期</td>
                <td v-if="divType=='new'" class="table_form_block table_form_block_padding">{{ new Date()|parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
                <td v-if="divType=='edit'" class="table_form_block table_form_block_padding">{{ procurementForm.createdDate }}</td>
                <td class="table_title">审批类型</td>
                <td class="table_form_block">
                  <my-form-item prop="processTypeId">
                    <el-select
                      v-model="procurementForm.processTypeId"
                      :disabled="divType=='edit'"
                      placeholder="请选择审批类型"
                      size="mini"
                      filterable>
                      <el-option v-for="item in processtypeList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">采购付款名称</td>
                <td class="table_form_block table_form_block_padding">
                  <my-form-item prop="title">
                    <el-input v-model.trim="procurementForm.title" size="mini" placeholder="请输入采购付款名称" />
                  </my-form-item>
                </td>
                <td class="table_title">采购付款单号</td>
                <td class="table_form_block table_form_block_padding">
                  <my-form-item prop="orderNo">
                    <el-input v-model.trim="procurementForm.orderNo" size="mini" placeholder="请输入采购付款单号" />
                  </my-form-item>
                </td>
                <td class="table_title">供应商</td>
                <td class="table_form_block">
                  <my-form-item prop="supplierID" >
                    <el-select
                      v-model.trim="procurementForm.supplierID"
                      placeholder="请选择供应商"
                      size="mini"
                      @change="choseSup">
                      <el-option v-for="item in supplierList" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </my-form-item>
                </td>
              </tr>
            </table>
            <p class="form_title text_left">
              <span>采购付款明细</span>
              <span>
                <el-button :disabled="procurementForm.other==1" plain icon="el-icon-edit-outline" size="mini" @click="addApplyInfo(modelType)">添加行</el-button>
                <el-button :disabled="procurementList1.length<=1||procurementForm.other==1" plain icon="el-icon-edit-outline" size="mini" @click="removeApplyInfo(modelType,0)">删除行</el-button>
              </span>
            </p>
            <el-table
              :data="procurementList1"
              class="refund_table"
              border>
              <el-table-column
                type="index"
                width="50"
                align="center"/>
              <el-table-column
                label="产品名称"
                align="center">
                <template slot-scope="scope">
                  <el-select
                    v-model.trim="scope.row.proName"
                    placeholder="产品名称"
                    style="width:100px"
                    class="view_right"
                    @change="chosePro(scope.$index)">
                    <el-option v-for="block in proList" :key="block.id" :label="block.title" :value="block.id" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="单位"
                align="center">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.proUnit" size="mini" disabled />
                </template>
              </el-table-column>
              <el-table-column
                label="单价（元）"
                align="center">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.proPrice" size="mini" type="number" disabled />
                </template>
              </el-table-column>
              <el-table-column
                label="数量"
                align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model.trim="scope.row.proNum"
                    type="number"
                    size="mini"
                    @blur="addPrice" />
                </template>
              </el-table-column>
            </el-table>
            <p class="form_title text_left">
              <span>采购付款信息</span>
            </p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">折后金额</td>
                <td class="table_form_block table_form_block_padding" colspan="3">
                  <my-form-item prop="amount">
                    <el-input v-model.trim="procurementForm.amount" size="mini" type="number" @blur="iptNum" />
                  </my-form-item>
                </td>
                <td class="table_title">合同凭证</td>
                <td class="table_form_block table_form_block_padding_long" colspan="3">
                  <my-form-item prop="bank">
                    <el-button size="mini" type="primary" plain @click="showRefundDialog(procurementFormFilesArr, 'procurementForm')">管理附件({{ procurementFormFilesArr.length }})</el-button>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">采购原因</td>
                <td class="table_form_block table_form_block_padding" colspan="5">
                  <my-form-item prop="remark">
                    <el-input
                      v-model.trim="procurementForm.remark"
                      :rows="3"
                      size="mini"
                      type="textarea"
                      placeholder="其他采购请填写采购说明，采购物品具体的地址等，最大长度为120个字" />
                  </my-form-item>
                </td>
              </tr>
            </table>
            <my-form-item class="form_btn">
              <el-button v-if="divType!='edit'" @click="resetForm">重 置</el-button>
              <el-button :loading="submitting" type="primary" @click="sureSave('procurementForm')">保存</el-button>
            </my-form-item>
          </my-form>
          <!-- 新建/编辑采购申请单 -->
          <my-form
            v-if="modelType==9"
            ref="procurementapplyForm"
            :model="procurementapplyForm"
            :rules="procurementapplyRules"
            class="approval_form_info">
            <p class="form_title text_left">采购申请单</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ accountInfo.name }}</td>
                <td class="table_title">申请日期</td>
                <td v-if="divType=='new'" class="table_form_block table_form_block_padding">{{ new Date()|parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
                <td v-if="divType=='edit'" class="table_form_block table_form_block_padding">{{ procurementapplyForm.createdDate }}</td>
                <td class="table_title">审批类型</td>
                <td class="table_form_block">
                  <my-form-item prop="processTypeId">
                    <el-select
                      v-model="procurementapplyForm.processTypeId"
                      :disabled="divType=='edit'"
                      placeholder="请选择审批类型"
                      size="mini"
                      filterable>
                      <el-option v-for="item in processtypeList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">申请单名称</td>
                <td class="table_form_block" colspan="5">
                  <my-form-item prop="title">
                    <el-input v-model.trim="procurementapplyForm.title" size="mini" placeholder="请输入采购付款名称" />
                  </my-form-item>
                </td>
              </tr>
              <tr>
                <td class="table_title">申请原因</td>
                <td class="table_form_block table_form_block_padding" colspan="5">
                  <my-form-item prop="remark">
                    <el-input
                      v-model.trim="procurementapplyForm.remark"
                      :rows="3"
                      size="mini"
                      type="textarea"
                      placeholder="请输入申请原因，最大长度为120个字" />
                  </my-form-item>
                </td>
              </tr>
            </table>
            <p class="form_title text_left">
              <span>采购明细</span>
              <span>
                <el-button :disabled="procurementForm.other==1" plain icon="el-icon-edit-outline" size="mini" @click="addApplyInfo(modelType)">添加行</el-button>
                <el-button :disabled="procurementList.length<=1||procurementForm.other==1" plain icon="el-icon-edit-outline" size="mini" @click="removeApplyInfo(modelType,0)">删除行</el-button>
              </span>
            </p>
            <el-table
              :data="procurementList"
              class="refund_table"
              border>
              <el-table-column
                type="index"
                width="50"
                align="center"/>
              <el-table-column
                label="产品名称"
                align="center">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.proName" size="mini" placeholder="请输入产品名称" />
                </template>
              </el-table-column>
              <el-table-column
                label="备注"
                align="center">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.proRemark" size="mini" placeholder="请输入备注内容" />
                </template>
              </el-table-column>
            </el-table>
            <my-form-item class="form_btn">
              <el-button v-if="divType!='edit'" @click="resetForm">重 置</el-button>
              <el-button :loading="submitting" type="primary" @click="sureSave('procurementapplyForm')">保存</el-button>
            </my-form-item>
          </my-form>
        </div>
        <div v-if="divType=='approval'|| divType=='view'">
          <!-- 采购付款单 -->
          <div v-if="modelType==1" class="approval_form_view">
            <p class="form_title text_left">{{ approvalTitle }}</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请单号</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.code }}</td>
                <td class="table_title">申请日期</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.createdDate }}</td>
                <td class="table_title">申请单名称</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.title }}</td>
              </tr>
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.accountName }}</td>
                <td class="table_title">申请人部门</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.organizeName }}</td>
                <td class="table_title">申请人岗位</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.groupName }}</td>
              </tr>
              <tr>
                <td class="table_title">采购付款号</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.orderNo }}</td>
                <td class="table_title">采购供应商</td>
                <td v-if="approvalInfo.other==0" class="table_form_block table_form_block_padding">{{ approvalInfo.supplierName }}</td>
                <td v-if="approvalInfo.other==1" class="table_form_block table_form_block_padding">其他采购方式</td>
                <td class="table_title">折后金额</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.amount }}</td>
              </tr>
              <tr>
                <td class="table_title">申请原因</td>
                <td class="table_form_block" colspan="5">{{ approvalInfo.remark }}</td>
              </tr>
              <tr>
                <td class="table_title">合同凭证</td>
                <td class="table_form_block table_form_block_padding_long" colspan="5">
                  <a v-for="(item,index) in approvalInfo.files" v-show="approvalInfo.files!=''" :href="approvalInfo.url + item.url" :key="index" target="_blank" download="" style="display:block" class="file_a">{{ index+1 }}、{{ item.name }}</a>
                </td>
              </tr>
            </table>
            <p class="form_title text_left">采购付款明细</p>
            <el-table
              :data="approvalInfo.sign"
              class="refund_table"
              border>
              <el-table-column
                type="index"
                width="50"
                align="center"/>
              <el-table-column
                label="商品名称"
                prop="proName"
                align="center"/>
              <el-table-column
                label="单位"
                prop="proUnit"
                align="center"/>
              <el-table-column
                label="单价"
                prop="proPrice"
                align="center"/>
              <el-table-column
                label="数量"
                prop="proNum"
                align="center"/>
            </el-table>
            <div class="car_view">
              <approval-step :step-list="carStep"/>
            </div>
          </div>
          <!-- 拜访审批单 -->
          <div v-if="modelType==2" class="approval_form_view">
            <p class="form_title text_left">{{ approvalTitle }}</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请单号</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.code }}</td>
                <td class="table_title">申请日期</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.createdDate }}</td>
                <td class="table_title">申请单名称</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.title }}</td>
              </tr>
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.accountName }}</td>
                <td class="table_title">申请人部门</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.organizeName }}</td>
                <td class="table_title">申请人岗位</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.groupName }}</td>
              </tr>
              <tr>
                <td class="table_title">客户名称</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.customer }}</td>
                <td class="table_title">联系人</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.contact }}</td>
                <td class="table_title">目的地</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.destination }}</td>
              </tr>
              <tr>
                <td class="table_title">陪同人</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.accompany }}</td>
                <td class="table_title">开始时间</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.startDate }}</td>
                <td class="table_title">结束时间</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.endDate }}</td>
              </tr>
              <tr>
                <td class="table_title">拜访目的</td>
                <td class="table_form_block table_form_block_padding" colspan="5">{{ approvalInfo.remark }}</td>
              </tr>
            </table>
            <p class="form_title text_left">签到情况</p>
            <el-table
              :data="approvalInfo.sign"
              class="refund_table"
              border>
              <el-table-column
                type="index"
                width="50"
                align="center"/>
              <el-table-column
                label="人员"
                prop="accountName"
                align="center"/>
              <el-table-column
                label="签到地点"
                prop="signInAddress"
                align="center"/>
              <el-table-column
                label="签到时间"
                prop="signInDate"
                align="center"/>
              <el-table-column
                label="签退地点"
                prop="signOutAddress"
                align="center"/>
              <el-table-column
                label="签退时间"
                prop="signOutDate"
                align="center"/>
            </el-table>
            <div class="car_view">
              <approval-step :step-list="carStep"/>
            </div>
          </div>
          <!-- 用章审批单 -->
          <div v-if="modelType==3" class="approval_form_view">
            <p class="form_title text_left">{{ approvalTitle }}</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请单号</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.code }}</td>
                <td class="table_title">申请日期</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.createdDate }}</td>
                <td class="table_title">申请单名称</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.title }}</td>
              </tr>
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.accountName }}</td>
                <td class="table_title">申请人部门</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.organizeName }}</td>
                <td class="table_title">申请人岗位</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.groupName }}</td>
              </tr>
              <tr>
                <td class="table_title">用章类型</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.subject }}</td>
                <td class="table_title">用章用途</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.type }}</td>
                <td class="table_title">用章时间</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.useDate }}</td>
              </tr>
              <tr>
                <td class="table_title">申请原因</td>
                <td class="table_form_block" colspan="5">{{ approvalInfo.remark }}</td>
              </tr>
            </table>
            <div class="car_view">
              <approval-step :step-list="carStep"/>
            </div>
          </div>
          <!-- 报销审批单 -->
          <div v-if="modelType==4" class="approval_form_view">
            <p class="form_title text_left">{{ approvalTitle }}</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请单号</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.code }}</td>
                <td class="table_title">申请日期</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.createdDate }}</td>
                <td class="table_title">申请单名称</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.title }}</td>
              </tr>
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.accountName }}</td>
                <td class="table_title">申请人部门</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.organizeName }}</td>
                <td class="table_title">申请人岗位</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.groupName }}</td>
              </tr>
            </table>
            <p class="form_title text_left">
              <span>收款账户信息</span>
            </p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">开户姓名</td>
                <td class="table_form_block table_form_block_padding" colspan="2">{{ approvalInfo.name }}</td>
                <td class="table_title">开户行</td>
                <td class="table_form_block table_form_block_padding" colspan="2">{{ approvalInfo.bank }}</td>

              </tr>
              <tr>
                <td class="table_title">银行账号</td>
                <td class="table_form_block table_form_block_padding" colspan="2">{{ approvalInfo.card }}</td>
                <td class="table_title">报销总额</td>
                <td class="table_form_block" colspan="2">{{ approvalInfo.amount }}</td>
              </tr>
              <tr>
                <td class="table_title">申请原因</td>
                <td class="table_form_block" colspan="5">{{ approvalInfo.remark }}</td>
              </tr>
            </table>
            <p class="form_title text_left">报销明细及金额</p>
            <el-table
              :data="approvalInfo.sign"
              class="refund_table"
              border>
              <el-table-column
                type="index"
                width="50"
                align="center"/>
              <el-table-column
                label="项目名称"
                prop="proName"
                align="center"/>
              <el-table-column
                label="单价（元）"
                prop="proPrice"
                align="center"/>
              <el-table-column
                label="数量"
                prop="proNum"
                align="center"/>
              <el-table-column
                label="备注"
                prop="remark"
                align="center"/>
              <el-table-column
                label="上传凭证"
                align="center"
                class="fileStyle">
                <template slot-scope="scope">
                  <a
                    v-for="(item,index) in scope.row.refundFilesArr"
                    v-show="scope.row.refundFilesArr!=''"
                    :href="approvalInfo.url + item.url"
                    :key="index"
                    target="_blank"
                    class="file_a"
                    download=""
                    style="display:block">{{ index+1 }}、{{ item.name }}</a>
                </template>
              </el-table-column>
            </el-table>
            <div class="car_view">
              <approval-step :step-list="carStep"/>
            </div>
          </div>
          <!-- 费用申请 -->
          <div v-if="modelType==11" class="approval_form_view">
            <p class="form_title text_left">{{ approvalTitle }}</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请单号</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.code }}</td>
                <td class="table_title">申请日期</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.createdDate }}</td>
                <td class="table_title">申请单名称</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.title }}</td>
              </tr>
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.accountName }}</td>
                <td class="table_title">申请人部门</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.organizeName }}</td>
                <td class="table_title">申请人岗位</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.groupName }}</td>
              </tr>
            </table>
            <p class="form_title text_left">
              <span>收款账户信息</span>
            </p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">开户姓名</td>
                <td class="table_form_block table_form_block_padding" colspan="2">{{ approvalInfo.name }}</td>
                <td class="table_title">开户行</td>
                <td class="table_form_block table_form_block_padding" colspan="2">{{ approvalInfo.bank }}</td>

              </tr>
              <tr>
                <td class="table_title">银行账号</td>
                <td class="table_form_block table_form_block_padding" colspan="2">{{ approvalInfo.card }}</td>
                <td class="table_title">费用申请总额</td>
                <td class="table_form_block" colspan="2">{{ approvalInfo.amount }}</td>
              </tr>
              <tr>
                <td class="table_title">申请原因</td>
                <td class="table_form_block" colspan="5">{{ approvalInfo.remark }}</td>
              </tr>
            </table>
            <p class="form_title text_left">费用申请明细及金额</p>
            <el-table
              :data="approvalInfo.sign"
              class="refund_table"
              border>
              <el-table-column
                type="index"
                width="50"
                align="center"/>
              <el-table-column
                label="项目名称"
                prop="proName"
                align="center"/>
              <el-table-column
                label="单价（元）"
                prop="proPrice"
                align="center"/>
              <el-table-column
                label="数量"
                prop="proNum"
                align="center"/>
              <el-table-column
                label="备注"
                prop="remark"
                align="center"/>
              <el-table-column
                label="上传凭证"
                align="center"
                class="fileStyle">
                <template slot-scope="scope">
                  <a
                    v-for="(item,index) in scope.row.costFilesArr"
                    v-show="scope.row.costFilesArr!=''"
                    :href="approvalInfo.url + item.url"
                    :key="index"
                    target="_blank"
                    class="file_a"
                    download=""
                    style="display:block">{{ index+1 }}、{{ item.name }}</a>
                </template>
              </el-table-column>
            </el-table>
            <div class="car_view">
              <approval-step :step-list="carStep"/>
            </div>
          </div>
          <!-- 加班审批单 -->
          <div v-if="modelType==5" class="approval_form_view">
            <p class="form_title text_left">{{ approvalTitle }}</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请单号</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.code }}</td>
                <td class="table_title">申请日期</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.createdDate }}</td>
                <td class="table_title">申请单名称</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.title }}</td>
              </tr>
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.accountName }}</td>
                <td class="table_title">申请人部门</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.organizeName }}</td>
                <td class="table_title">申请人岗位</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.groupName }}</td>
              </tr>
              <tr>
                <td class="table_title">加班类型</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.type }}</td>
                <td class="table_title">开始时间</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.startDate }}</td>
                <td class="table_title">结束时间</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.endDate }}</td>
              </tr>
              <tr>
                <td class="table_title">加班时长</td>
                <td class="table_form_block table_form_block_padding" colspan="5">{{ approvalInfo.hours }}小时</td>
              </tr>
              <tr>
                <td class="table_title">申请原因</td>
                <td class="table_form_block table_form_block_padding" colspan="5">{{ approvalInfo.remark }}</td>
              </tr>
            </table>
            <div class="car_view">
              <approval-step :step-list="carStep"/>
            </div>
          </div>
          <!-- 请假审批单 -->
          <div v-if="modelType==6" class="approval_form_view">
            <p class="form_title text_left">{{ approvalTitle }}</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请单号</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.code }}</td>
                <td class="table_title">申请日期</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.createdDate }}</td>
                <td class="table_title">申请单名称</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.title }}</td>
              </tr>
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.accountName }}</td>
                <td class="table_title">申请人部门</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.organizeName }}</td>
                <td class="table_title">申请人岗位</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.groupName }}</td>
              </tr>
              <tr>
                <td class="table_title">请假类型</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.type }}</td>
                <td class="table_title">开始时间</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.startDate }}</td>
                <td class="table_title">结束时间</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.endDate }}</td>
              </tr>
              <tr>
                <td class="table_title">联系电话</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.phone }}</td>
                <td class="table_title">紧急联系人</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.contact }}</td>
                <td class="table_title">请假时长</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.hours }}小时</td>
              </tr>
              <tr>
                <td class="table_title">申请原因</td>
                <td class="table_form_block table_form_block_padding" colspan="5">{{ approvalInfo.remark }}</td>
              </tr>
            </table>
            <div class="car_view">
              <approval-step :step-list="carStep"/>
            </div>
          </div>
          <!-- 销假审批单 -->
          <div v-if="modelType==10" class="approval_form_view">
            <p class="form_title text_left">{{ approvalTitle }}</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请单号</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.code }}</td>
                <td class="table_title">申请日期</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.createdDate }}</td>
                <td class="table_title">申请单名称</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.title }}</td>
              </tr>
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.accountName }}</td>
                <td class="table_title">申请人部门</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.organizeName }}</td>
                <td class="table_title">申请人岗位</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.groupName }}</td>
              </tr>
              <tr>
                <td class="table_title">假单类型</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.QJtype }}</td>
                <td class="table_title">假单开始时间</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.QJstartDate }}</td>
                <td class="table_title">假单结束时间</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.QJendDate }}</td>
              </tr>
              <tr>
                <td class="table_title">开始时间</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.startDate }}</td>
                <td class="table_title">结束时间</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.endDate }}</td>
                <td class="table_title">销假时长</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.hours }}小时</td>
              </tr>
              <tr>
                <td class="table_title">申请原因</td>
                <td class="table_form_block table_form_block_padding" colspan="5">{{ approvalInfo.remark }}</td>
              </tr>
            </table>
            <div class="car_view">
              <approval-step :step-list="carStep"/>
            </div>
          </div>
          <!-- 用车审批单 -->
          <div v-if="modelType==7" class="approval_form_view">
            <p class="form_title text_left">{{ approvalTitle }}</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请单号</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.code }}</td>
                <td class="table_title">申请日期</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.createdDate }}</td>
                <td class="table_title">申请单名称</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.title }}</td>
              </tr>
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.accountName }}</td>
                <td class="table_title">申请人部门</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.organizeName }}</td>
                <td class="table_title">申请人岗位</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.groupName }}</td>
              </tr>
              <tr>
                <td class="table_title">用车类型</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.type }}</td>
                <td class="table_title">是否需要司机</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.isDriver==1?'是':'否' }}</td>
                <td class="table_title">用车时间</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.useDate }}</td>
              </tr>
              <tr>
                <td class="table_title">乘车人数</td>
                <td class="table_form_block table_form_block_padding" colspan="5">{{ approvalInfo.busNum }}</td>
              </tr>
              <tr>
                <td class="table_title">申请原因</td>
                <td class="table_form_block" colspan="5">{{ approvalInfo.remark }}</td>
              </tr>
            </table>
            <div class="car_view">
              <approval-step :step-list="carStep"/>
            </div>
          </div>
          <!-- 物品领用审批单 -->
          <div v-if="modelType==8" class="approval_form_view">
            <p class="form_title text_left">{{ approvalTitle }}</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请单号</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.code }}</td>
                <td class="table_title">申请日期</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.createdDate }}</td>
                <td class="table_title">申请单名称</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.title }}</td>
              </tr>
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.accountName }}</td>
                <td class="table_title">申请人部门</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.organizeName }}</td>
                <td class="table_title">申请人岗位</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.groupName }}</td>
              </tr>
              <tr>
                <td class="table_title">领用类型</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.type }}</td>
                <td class="table_title">领用时间</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.receiveDate }}</td>
                <td class="table_title"/>
                <td class="table_form_block table_form_block_padding"/>
              </tr>
              <tr>
                <td class="table_title">申请原因</td>
                <td class="table_form_block" colspan="5">{{ approvalInfo.remark }}</td>
              </tr>
            </table>
            <div class="car_view">
              <approval-step :step-list="carStep"/>
            </div>
          </div>
          <!-- 采购申请审批单 -->
          <div v-if="modelType==9" class="approval_form_view">
            <p class="form_title text_left">{{ approvalTitle }}</p>
            <table class="approval_table" cellpadding="0" cellspacing="0">
              <tr>
                <td class="table_title">申请单号</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.code }}</td>
                <td class="table_title">申请日期</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.createdDate }}</td>
                <td class="table_title">申请单名称</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.title }}</td>
              </tr>
              <tr>
                <td class="table_title">申请人</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.accountName }}</td>
                <td class="table_title">申请人部门</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.organizeName }}</td>
                <td class="table_title">申请人岗位</td>
                <td class="table_form_block table_form_block_padding">{{ approvalInfo.groupName }}</td>
              </tr>
              <tr>
                <td class="table_title">申请原因</td>
                <td class="table_form_block" colspan="5">{{ approvalInfo.remark }}</td>
              </tr>
            </table>
            <p class="form_title text_left">采购明细</p>
            <el-table
              :data="approvalInfo.sign"
              class="refund_table"
              border>
              <el-table-column
                type="index"
                width="50"
                align="center"/>
              <el-table-column
                label="产品名称"
                prop="proName"
                align="center"/>
              <el-table-column
                label="备注"
                prop="proRemark"
                align="center"/>
            </el-table>
            <div class="car_view">
              <approval-step :step-list="carStep"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 报销、费用申请文件上传 -->
    <el-dialog
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="refund_dialog"
      class="small_dialog"
      title="管理附件">
      <div class="file_style" style="padding:20px 30px;overflow-y:scroll;height:360px;">
        <el-upload
          v-if="refund_dialog"
          ref="upload"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :name="'files'"
          :action="uploadUrl"
          :file-list="fileList"
          class="upload-demo"
          multiple>
          <el-button size="small" type="primary">上 传</el-button>
          <div slot="tip" class="el-upload__tip">请上传压缩包、word文档、excel文档、ppt演示文稿、pdf文档、图片文件</div>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refund_dialog = false">取 消</el-button>
        <el-button type="primary" @click="sureRefundFile">确定</el-button>
      </div>
    </el-dialog>
    <!-- 审核弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="approval_dialog"
      class="dialogModel"
      title="审核">
      <el-scrollbar class="fixed_scroll">
        <div style="padding:20px 30px;">
          <el-alert
            :closable="false"
            title="是否同意此审批单？"
            type="warning"
            show-icon
            style="margin-bottom:10px;"/>
          <span>留言备注：</span>
          <el-input
            :rows="5"
            v-model.trim="opinion"
            size="mini"
            type="textarea"
            placeholder="请填写留言备注,最大长度为200个字"
            style="padding-top:10px;"/>
        </div>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="passModel(modelType)">通过</el-button>
        <el-button type="danger" @click="rejectedModel(modelType)">驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSystemUserList, // 获取审批人列表
  getApprovalList, // 获取审批列表
  // getCartype, // 用车
  // getChaptertype, // 用章
  getApprovalInfo,
  getApprovalDetail, // 获取申请单详情
  // getLeavetype, //请假
  // getOvertimetype, //加班
  getWorkTypeById, // 获取审批分类列表
  getWorkflowGet, // 审批通用方法
  getWorkEditInfo, // 编辑方法
  banApproval, // 作废
  getProBySup, // 根据供应商id获取产品
  saveApprovalType, // 保存各种新增申请单
  calcTime, // 计算请假加班时长
  isWorkDay // 判断当前选中日期是否是工作日
} from '@/api/office'
import {
  // eslint-disable-next-line no-unused-vars
  btnPermission
} from '@/permission.js' // 按钮权限和页面权限
import avatar from '@/assets/avatar.png' // 用章
export default {
  name: 'ApprovalPageManage',
  data() {
    const checkNum = (rule, value, callback) => {
      // console.log(value)
      if (!value) {
        return callback(new Error('折扣金额不能为空'))
      } else {
        if (value < 0) {
          callback(new Error('填写的折后金额不能为负数'))
        } else {
          callback()
        }
      }
    }
    const checkSup = (rule, value, callback) => {
      if (!value && (this.procurementForm.other == '0' || this.procurementForm.other == 0)) {
        console.log(111)
        callback(new Error('供应商不能为空'))
        // return new Error('请选择供应商')
      } else {
        callback()
      }
    }
    return {
      showloading: true,
      tabsList: [{ label: '', name: 'all' }],
      page_name: 'workflow',
      module_name: 'oa',
      choseTotal: 0,
      headImg: avatar,
      input: '',
      opinion: '',
      uploadUrl: '',
      uploadFile: '',
      filesArr: [],
      refundFilesArr: [],
      inputName: '不选则通知整个集团',
      tableData: [],
      loading: false,
      divType: 'new',
      requestUrl: '',
      modelType: 5,
      modelTitle: '',
      modelShow: true,
      dialogWidth: '600px',
      newList: [],
      typeList: [],
      showId: 0,
      approvalTitle: '',
      approvalForm: {
        title: '',
        content: '',
        file: '',
        organizeId: '0'
      },
      supplierList: [],
      viewForm: {},
      fileList: [],
      files: [],
      radioList: [], // 用车类型,用章用途
      overtimeForm: {
        processTypeId: '',
        title: '',
        type: '1',
        startDate: '',
        endDate: '',
        hours: '',
        remark: ''
      },
      overday_start: '',
      overtime_start: '',
      overday_end: '',
      overtime_end: '',
      leaveday_start: '',
      leavetime_start: '',
      leaveday_end: '',
      leavetime_end: '',
      time_seting: {},
      timeConfig: {
        start: '08:30',
        step: '00:30',
        end: '18:30'
      },
      overTime: 100,
      leaveForm: {
        processTypeId: '',
        title: '',
        type: '',
        startDate: '',
        endDate: '',
        hours: '',
        contact: '',
        phone: '',
        remark: ''
      },
      leaveTime: 100,
      temporaryTime: 0, // 调休时间
      userList: [],
      accompanyList: [],
      salesLeaveForm: {
        processTypeId: '',
        type: '',
        leaveId: '',
        startDate: '',
        endDate: '',
        hours: '',
        remark: ''
      },
      accountInfo: {},
      min_leave: '',
      max_leave: '',
      max_leave_hours: '',
      sales_leave_type: '',
      salesLeaveRules: {
        processTypeId: [{
          required: true,
          message: '请选择销假单类型',
          trigger: 'change'
        }],
        leaveId: [{
          required: true,
          message: '请假单不能为空',
          trigger: 'change'
        }],
        startDate: [{
          required: true,
          message: '开始时间不能为空',
          trigger: 'change'
        }],
        endDate: [{
          required: true,
          message: '结束时间不能为空',
          trigger: 'change'
        }],
        hours: [{
          required: true,
          message: '销假时长不能为空',
          trigger: 'blur'
        }],
        remark: [{
          required: true,
          message: '销假事由不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 120,
          message: '销假事由长度超出范围1-120位之间',
          trigger: 'blur'
        }]
      },
      visitForm: {
        processTypeId: '',
        title: '',
        customer: '',
        contact: '',
        destination: '',
        accompany: '',
        startDate: '',
        endDate: '',
        remark: ''
      },
      dateTimeOptions: {
        selectableRange: []
      },
      // pickerOptions: {
      //   disabledDate(time) {
      //     console.log(time.getTime())
      //     return time.getTime() < Date.now()
      //   }
      // },
      carForm: {
        processTypeId: '',
        // 用车数据
        title: '',
        type: '',
        useDate: '',
        isDriver: '',
        busNum: '',
        remark: ''
      },
      sealForm: {
        processTypeId: '',
        // 用章数据
        title: '',
        type: '',
        useDate: '',
        remark: ''
      },
      refundList: [
        { proName: '', proPrice: 0.00, proNum: 1, remark: '', file: '', refundFilesArr: [] }
      ], // 报销添加的明细
      refundForm: {
        processTypeId: '',
        // 报销数据
        title: '',
        items: [],
        files: '',
        amount: 0.00,
        name: '',
        bank: '',
        card: '',
        remark: ''
      },
      costList: [
        { proName: '', proPrice: 0.00, proNum: 1, remark: '', file: '', costFilesArr: [] }
      ], // 费用申请添加的明细
      costForm: {
        processTypeId: '',
        // 费用申请数据
        title: '',
        items: [],
        files: '',
        amount: 0.00,
        name: '',
        bank: '',
        card: '',
        remark: ''
      },
      // 采购付款的明细
      procurementList1: [],
      proList: [],
      procurementForm: {
        processTypeId: '',
        title: '',
        orderNo: '',
        supplierID: '',
        other: 0,
        items: '',
        amount: 0.00,
        files: '',
        remark: ''
      },
      procurementFormFilesArr: [], // 采购付款附件列表
      procurementList: [], // 采购申请单的明细
      procurementapplyForm: {
        title: '',
        items: '',
        remark: ''
      },
      tableHeight: 250,
      applyForm: {
        // 报销数据
        name: '',
        info: [{
          proName: '',
          proPrice: '',
          proNum: '',
          proAmount: 0.0
        },
        {
          proName: '',
          proPrice: '',
          proNum: '',
          proAmount: 0.0
        }
        ],
        total: 0,
        pname: '',
        pbank: '',
        bankcode: '',
        remark: ''
      },
      receiveForm: {
        processTypeId: '',
        title: '',
        type: '',
        receiveDate: '',
        remark: ''
      },
      radioList1: [], // 用章类型类型
      approvalInfo: {
        files: [{
          name: '',
          url: ''
        }]
      }, // 申请单
      carStep: [], // 步骤条
      activeStep: 0,
      overtimeRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '申请单名称不能为空',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 20,
          message: '申请单名称长度在 6 到 20 个字符',
          trigger: 'blur'
        }
        ],
        type: [{
          required: true,
          message: '请假类型不能为空',
          trigger: 'change'
        }],
        startDate: [{
          required: true,
          message: '开始时间不能为空',
          trigger: 'change'
        }],
        endDate: [{
          required: true,
          message: '结束时间不能为空',
          trigger: 'change'
        }],
        hours: [{
          required: true,
          message: '加班时长不能为空',
          trigger: 'change'
        }],
        remark: [{
          required: true,
          message: '加班事由不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 120,
          message: '加班事由长度超出范围1-120位之间',
          trigger: 'blur'
        }]
      },
      leaveRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '申请单名称不能为空',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 20,
          message: '申请单名称长度在 6 到 20 个字符',
          trigger: 'blur'
        }
        ],
        type: [{
          required: true,
          message: '请假类型不能为空',
          trigger: 'change'
        }],
        startDate: [{
          required: true,
          message: '开始时间不能为空',
          trigger: 'change'
        }],
        endDate: [{
          required: true,
          message: '结束时间不能为空',
          trigger: 'change'
        }],
        hours: [{
          required: true,
          message: '请假时长不能为空',
          trigger: 'blur'
        }],
        contact: [{
          required: true,
          message: '紧急联系人不能为空',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          message: '紧急联系电话不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[1][0-9]{10}$/,
          message: '紧急联系电话格式错误',
          trigger: 'blur'
        }
        ],
        remark: [{
          required: true,
          message: '请假事由不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 120,
          message: '请假事由长度超出范围1-120位之间',
          trigger: 'blur'
        }]
      },
      visitRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '申请单名称不能为空',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 20,
          message: '申请单名称长度在 2 到 15 个字符',
          trigger: 'blur'
        }
        ],
        customer: [{
          required: true,
          message: '客户名称不能为空',
          trigger: 'blur'
        }],
        contact: [{
          required: true,
          message: '联系人不能为空',
          trigger: 'blur'
        }],
        destination: [{
          required: true,
          message: '目的地不能为空',
          trigger: 'blur'
        }],
        startDate: [{
          required: true,
          message: '开始时间不能为空',
          trigger: 'change'
        }],
        endDate: [{
          required: true,
          message: '结束时间不能为空',
          trigger: 'change'
        }],
        accompany: [{
          required: true,
          message: '陪同人不能为空',
          trigger: 'blur'
        }],
        remark: [{
          required: true,
          message: '拜访目的不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 120,
          message: '拜访目的长度超出范围1-120位之间',
          trigger: 'blur'
        }]
      },
      carRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '申请单名称不能为空',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 20,
          message: '申请单名称长度在 6 到 20 个字符',
          trigger: 'blur'
        }
        ],
        type: [{
          required: true,
          message: '用车类型不能为空',
          trigger: 'change'
        }],
        useDate: [{
          required: true,
          message: '用车时间不能为空',
          trigger: 'change'
        }],
        isDriver: [{
          required: true,
          message: '是否需要司机不能为空',
          trigger: 'change'
        }],
        busNum: [{
          required: true,
          message: '乘车人数不能为空',
          trigger: 'blur'
        }],
        remark: [{
          required: true,
          message: '申请原因不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 120,
          message: '申请原因长度超出范围1-120位之间',
          trigger: 'blur'
        }]
      },
      sealRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '申请单名称不能为空',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 20,
          message: '申请单名称长度在 6 到 20 个字符',
          trigger: 'blur'
        }
        ],
        subject: [{
          required: true,
          message: '用章类型不能为空',
          trigger: 'change'
        }],
        type: [{
          required: true,
          message: '用章用途不能为空',
          trigger: 'change'
        }],
        useDate: [{
          required: true,
          message: '用章时间不能为空',
          trigger: 'change'
        }],
        remark: [{
          required: true,
          message: '申请原因不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 120,
          message: '申请原因长度超出范围1-120位之间',
          trigger: 'blur'
        }]
      },
      refundRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '报销单名称不能为空',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 20,
          message: '报销名称长度在 6 到 20 个字符',
          trigger: 'blur'
        }
        ],
        amount: [{
          required: true,
          message: '总费用不能为空',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '开户姓名不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 6,
          message: '开户姓名长度2-6位',
          trigger: 'blur'
        }],
        bank: [{
          required: true,
          message: '开户行不能为空',
          trigger: 'blur'
        }],
        card: [{
          required: true,
          message: '银行卡号不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^([1-9]{1})(\d{15,18})$/,
          message: '银行卡号格式错误，长度在16-19位之间',
          trigger: 'blur'
        }
        ],
        remark: [{
          required: true,
          message: '申请原因说明不能为空',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 120,
          message: '申请原因说明长度超出范围1-120位之间',
          trigger: 'blur'
        }
        ],
        files: [{
          required: true,
          message: '报销凭证不能为空不能为空',
          trigger: 'change'
        }],
        items: [{
          required: true,
          message: '报销明细不能为空',
          trigger: 'change'
        }]
      },
      costRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '费用申请单名称不能为空',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 20,
          message: '费用申请名称长度在 6 到 20 个字符',
          trigger: 'blur'
        }
        ],
        amount: [{
          required: true,
          message: '总费用不能为空',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '开户姓名不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 6,
          message: '开户姓名长度2-6位',
          trigger: 'blur'
        }],
        bank: [{
          required: true,
          message: '开户行不能为空',
          trigger: 'blur'
        }],
        card: [{
          required: true,
          message: '银行卡号不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^([1-9]{1})(\d{15,18})$/,
          message: '银行卡号格式错误，长度在16-19位之间',
          trigger: 'blur'
        }
        ],
        remark: [{
          required: true,
          message: '申请原因说明不能为空',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 120,
          message: '申请原因说明长度超出范围1-120位之间',
          trigger: 'blur'
        }
        ],
        files: [{
          required: true,
          message: '费用申请凭证不能为空不能为空',
          trigger: 'change'
        }],
        items: [{
          required: true,
          message: '费用申请明细不能为空',
          trigger: 'change'
        }]
      },
      procurementRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '采购付款名称不能为空',
          trigger: 'blur'
        }],
        items: [{
          required: true,
          message: '采购明细不能为空',
          trigger: 'change'
        }],
        remark: [{
          required: true,
          message: '原因说明不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 120,
          message: '原因说明长度超出范围1-120位之间',
          trigger: 'blur'
        }],
        orderNo: [{
          required: true,
          message: '采购付款单号不能为空',
          trigger: 'blur'
        }],
        supplierID: [{
          validator: checkSup,
          trigger: 'change'
        }],
        amount: [{
          required: true,
          message: '折后金额不能为空',
          trigger: 'blur'
        }, {
          validator: checkNum,
          trigger: 'blur'
        }],
        files: [{
          required: true,
          message: '合同凭证不能为空',
          trigger: 'change'
        }]
      },
      procurementapplyRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '采购申请名称不能为空',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 20,
          message: '采购申请名称长度在 6 到 15 个字符',
          trigger: 'blur'
        }
        ],
        items: [{
          required: true,
          message: '采购申请明细不能为空',
          trigger: 'change'
        }],
        remark: [{
          required: true,
          message: '原因说明不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 120,
          message: '原因说明长度超出范围1-120位之间',
          trigger: 'blur'
        }]
      },
      receiveRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '物品领用名称不能为空',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 20,
          message: '物品领用名称长度在 2 到 15 个字符',
          trigger: 'blur'
        }
        ],
        type: [{
          required: true,
          message: '领用类型不能为空',
          trigger: 'change'
        }],
        receiveDate: [{
          required: true,
          message: '领用时间不能为空',
          trigger: 'change'
        }],
        remark: [{
          required: true,
          message: '原因说明不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '原因说明长度超出范围1-120位之间', trigger: 'blur' }]
      },
      processtypeList: [],
      searchInfo: {
        mode: 'new', // 类型
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      refund_dialog: false,
      approval_dialog: false,
      file_index: 0,
      submitting: false,
      total: 0, // 总条数
      mode: 'new'
    }
  },
  created() {
    this.accountInfo.name = JSON.parse(window.localStorage.getItem('userinfo')).realname
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  mounted() {
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    console.log(this.$route)
    console.log(this.$route.query)
    this.mode = this.$route.query.mode
    // 获取审批流对应的下拉
    this.divType = this.$route.query.type
    if (this.$route.query.type == 'new' || this.$route.query.type == 'edit') {
      this.modelType = parseInt(this.$route.query.approvalType)
      if (this.$route.query.type == 'new') {
        // 新增
        const url = this.$route.query.url
        this.addApproval(this.modelType, url)
        this.$nextTick(() => {
          this.closeModel()
        })
      } else {
        // 编辑
        this.editModel(this.modelType, this.$route.query.id)
        this.$nextTick(() => {
          this.closeModel()
        })
      }
    } else {
      console.log(this.$route.id, this.$route.processTypeId)
      this.modelType = parseInt(this.$route.processId)
      this.showModel(this.$route.query.id, this.$route.query.processId, this.$route.query.processTypeId, this.$route.query.type)
    }
    let action_title = ''

    if (this.divType == 'new') {
      action_title = '创建'
      this.showloading = false
    } else if (this.divType == 'edit') {
      action_title = '编辑'
    } else if (this.divType == 'view') {
      action_title = '查看'
    } else {
      action_title = '审批'
    }
    let title = ''
    switch (parseInt(this.modelType)) {
      case 1:
        title = '采购付款'
        break
      case 2: {
        title = '拜访申请'
        break
      }
      case 3:
        title = '用章申请'
        break
      case 4:
        title = '报销申请'
        break
      case 5:
        title = '加班申请'
        break
      case 6:
        title = '请假申请'
        break
      case 7:
        title = '用车申请'
        break
      case 8:
        title = '物品领用申请'
        break
      case 9:
        title = '采购申请单'
        break
      case 10:
        title = '销假申请单'
        break
      case 11:
        title = '费用申请单'
        break
    }
    this.tabsList[0].label = action_title + title

    // this.getList()
  },
  methods: {
    returnPage() {
      console.log(this.mode)
      window.localStorage.setItem('mode', this.mode)
      this.$router.back(-1)
    },
    showApproval() {
      // 展示审核弹框
      this.approval_dialog = true
    },
    iptNum(e) {
      // const a = parseFloat(e.target.value).toFixed(2)
      if (parseInt(e.target.value) < 0) {
        this.procurementForm.amount = e.target.value
      } else {
        this.procurementForm.amount = parseFloat(e.target.value).toFixed(2)
      }
    },
    getList() {
      const that = this
      console.log(this.searchInfo.mode)
      if (this.searchInfo.mode == 'new') {
        getApprovalList().then(res => {
          console.log(res)
          if (res.code == 200) {
            that.newList = res.data.approval
          }
        })
      } else {
        getApprovalInfo(this.searchInfo).then(res => {
          that.loading = false
          if (res.code == 200) {
            that.tableData = res.data.workflows
            that.total = res.data.pager.recTotal // 总条数
          }
        })
      }

      // getDepList().then(res => {
      //   if (res.code == 200 || res.code == '200') {
      //     this.depList = JSON.parse(JSON.stringify(res.data.organize))
      //   }
      // })
    },
    editType(e) {
      console.log(e, 'f')
      const id = this.overtimeForm.processTypeId
      if (this.overtimeForm.type !== '') {
        this.$refs['overtimeForm'].resetFields()
        this.overday_start = ''
        this.overtime_start = ''
        this.overday_end = ''
        this.overtime_end = ''
        this.overtimeForm.startDate = ''
        this.overtimeForm.endDate = ''
        this.overtimeForm.hours = ''
        this.overtimeForm.remark = ''
        this.overtimeForm.type = e
        this.overtimeForm.processTypeId = id
      }
    },
    choseType(e) {
      this.searchInfo.mode = e
      this.searchInfo.pageID = 1
      this.searchInfo.orderBy = ''
      if ((this.$refs.table) !== undefined) {
        this.resetTable()
      }
      this.tableData = []
      this.loading = true
      this.getList()
    },
    resetTable() {
      for (let i = 0; i < (this.$refs.table).length; i++) {
        (this.$refs.table)[i].clearSort()
      }
    },
    goWorkSet() {
      // this.$router.push({
      //   path: '/office/workSet'
      // })
      this.$router.push({
        path: '/office/typeList'
      })
    },
    fifterSearch(event) {
      if (event) {
        this.searchInfo.search = 'bySearch'
        this.tableData = []
        this.loading = true
        this.searchInfo.pageID = 1
        this.getList()
      } else {
        this.searchInfo.search = ''
        // this.getList()
      }
    },
    fifterTable(event) {
      console.log(event.prop)
      console.log(event.order)
      this.loading = true
      if (event.order == 'ascending') {
        this.searchInfo.orderBy = event.prop + '_asc'
      } else if (event.order == 'descending') {
        this.searchInfo.orderBy = event.prop + '_desc'
      } else {
        this.searchInfo.orderBy = ''
      }
      this.searchInfo.pageID = 1
      this.tableData = []
      this.getList()
    },
    // 新增申请单
    addApproval(type, url) {
      const that = this
      this.divType = 'new'
      this.requestUrl = url
      // 根据审批类型获取审批流分类列表
      getWorkTypeById(type).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.processtypeList = res.data.data
        }
      })
      getWorkflowGet(url).then(res => {
        if (res.code == 200) {
          console.log(res, '154654')
          switch (parseInt(type)) {
            case 1:
              this.dialogWidth = '700px'
              this.modelTitle = '创建采购'
              this.proList = []
              this.procurementList1 = []
              this.supplierList = res.data.supplier
              this.supplierList.push({ label: '其他方式采购', value: '-1' })
              console.log(this.procurementForm.other)
              break
            case 2: {
              this.modelTitle = '创建拜访'
              const arr = []
              for (let i = 0; i < res.data.escorts.length; i++) {
                arr.push({
                  value: res.data.escorts[i].id,
                  label: res.data.escorts[i].name + '-' + res.data.escorts[i].deptName
                })
              }
              that.radioList = arr
              break
            }
            case 3:
              this.modelTitle = '新增用章申请'
              that.radioList = res.data.typeList
              that.radioList1 = res.data.subjectList
              break
            case 4:
              this.dialogWidth = '700px'
              this.modelTitle = '创建报销'
              this.refundList = [
                { proName: '', proPrice: 0.00, proNum: 1, remark: '', file: '', refundFilesArr: [] }
              ]
              break
            case 5:
              this.modelTitle = '创建加班申请'
              that.radioList = res.data.typeList
              that.time_seting = res.data.sign
              that.timeConfig = {
                start: res.data.sign.sign_in,
                step: '00:30',
                end: res.data.sign.sign_out
              }
              break
            case 6:
              this.modelTitle = '创建请假'
              that.radioList = res.data.typeList
              that.time_seting = res.data.sign
              that.timeConfig = {
                start: res.data.sign.sign_in,
                step: '00:30',
                end: res.data.sign.sign_out
              }
              that.temporaryTime = res.data.sign.lastime // 调休时长
              break
            case 7:
              this.modelTitle = '新增用车申请'
              that.radioList = res.data.typeList
              break
            case 8:
              this.modelTitle = '创建物品领用'
              that.radioList = res.data.typeList
              break
            case 9:
              this.dialogWidth = '700px'
              this.procurementList = []
              this.modelTitle = '创建采购申请单'
              break
            case 10:
              this.dialogWidth = '700px'
              this.modelTitle = '创建销假申请单'
              that.radioList = res.data.typeList
              break
          }
          // that.modelType = type
        } else {
          that.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    changeNum(e) {
      console.log(e)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.searchInfo.pageID = 1
      this.searchInfo.recPerPage = val
      this.tableData = []
      this.loading = true
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.searchInfo.pageID = val
      this.loading = true
      this.getList()
    },
    changeStates(event) {
      const that = this
      const msg = '申请单一旦作废不可恢复，确定要“作废”吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          banApproval(event.id).then(res => {
            if (res.code == 200 || res.code == '200') {
              that.$message({
                type: 'success',
                message: res.data.message
              })
              this.modelShow = false
              that.getList()
            } else {
              that.$message({
                type: 'warning',
                message: res.data.message
              })
            }
          })
        })
        .catch(() => {
          console.log('用户点击了取消')
        })
    },
    // 查看审批申请单
    showModel(id, processId, processTypeId, type) {
      const that = this
      this.divType = type
      // this.dialogWidth = '800px'
      if (type == 'approval') {
        this.modelTitle = '审核'
        switch (parseInt(processId)) {
          case 1:
            this.approvalTitle = '采购审批单'
            break
          case 2:
            this.approvalTitle = '拜访审批单'
            break
          case 3:
            this.approvalTitle = '用章审批单'
            break
          case 4:
            this.approvalTitle = '报销审批单'
            break
          case 5:
            this.approvalTitle = '加班审批单'
            break
          case 6:
            this.approvalTitle = '请假审批单'
            break
          case 7:
            // 用车审核
            this.approvalTitle = '用车审批单'
            break
          case 8:
            this.approvalTitle = '物品领用审批单'
            break
          case 9:
            this.approvalTitle = '采购申请审批单'
            break
          case 10:
            this.approvalTitle = '销假申请审批单'
            break
          case 11:
            this.approvalTitle = '费用申请审批单'
            break
        }
      } else {
        this.modelTitle = '查看'
        switch (parseInt(processId)) {
          case 1:
            this.approvalTitle = '采购审批单'
            break
          case 2:
            this.approvalTitle = '拜访审批单'
            break
          case 3:
            this.approvalTitle = '用章审批单'
            break
          case 4:
            this.approvalTitle = '报销审批单'
            break
          case 5:
            this.approvalTitle = '加班审批单'
            break
          case 6:
            this.approvalTitle = '假条审批单'
            break
          case 7:
            // 用车审核
            this.approvalTitle = '用车审批单'
            break
          case 8:
            this.approvalTitle = '物品领用审批单'
            break
          case 9:
            this.approvalTitle = '采购申请审批单'
            break
          case 10:
            this.approvalTitle = '销假申请审批单'
            break
          case 11:
            this.approvalTitle = '费用申请审批单'
            break
        }
      }
      that.showId = id
      getApprovalDetail(id, processTypeId).then(res => {
        that.showloading = false
        if (res.code == 200) {
          that.approvalInfo = {}
          that.approvalInfo = res.data.apply
          that.carStep = res.data.nodes
          that.carStep.unshift({ name: '提交审批', auditStatus: '2', auditer: that.approvalInfo.accountName, auditDate: that.approvalInfo.createdDate, auditRemark: '' })
          that.activeStep = true
          if (that.approvalInfo.status == 4) {
            // 通过
            that.carStep.push({ name: '审批完成', auditStatus: '2', auditer: '', auditDate: '', auditRemark: '', isend: 1 })
          } else {
            that.carStep.push({ name: '审批完成', auditStatus: '0', auditer: '', auditDate: '', auditRemark: '', isend: 0 })
          }
          if (that.approvalInfo.files !== undefined && that.approvalInfo.files !== '' && that.approvalInfo
            .files !== 'null' && that.approvalInfo.files !== null) {
            that.approvalInfo.files = JSON.parse(that.approvalInfo.files)
            that.approvalInfo.url = process.env.FILE_API
          } else {
            that.approvalInfo.files = [{
              url: '',
              name: ''
            }]
            that.approvalInfo.url = ''
          }
          console.log(that.approvalInfo)
          this.modelShow = true
        } else {
          that.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
      this.modelType = processId
    },
    // 编辑申请单
    editModel(processId, sourceId) {
      const that = this
      this.divType = 'edit'
      getWorkTypeById(processId).then(req => {
        if (req.code == 200) {
          this.processtypeList = req.data.data
        }
      })
      let editUrl = ''
      switch (parseInt(processId)) {
        case 1:
          editUrl = '/oa/procurement-edit-' + sourceId
          break
        case 2:
          editUrl = '/oa/visit-edit-' + sourceId
          break
        case 3:
          editUrl = '/oa/seal-edit-' + sourceId
          break
        case 4:
          editUrl = '/oa/refund-edit-' + sourceId
          break
        case 5:
          editUrl = '/oa/overtime-edit-' + sourceId
          break
        case 6:
          editUrl = '/oa/leave-edit-' + sourceId
          break
        case 7:
          editUrl = '/oa/car-edit-' + sourceId
          break
        case 8:
          editUrl = '/oa/receive-edit-' + sourceId
          break
        case 9:
          editUrl = '/oa/procurementapply-edit-' + sourceId
          break
        case 10:
          editUrl = '/oa/outleave-edit-' + sourceId
          break
        case 11:
          editUrl = '/oa/costapply-edit-' + sourceId
          break
      }
      this.requestUrl = editUrl
      getWorkEditInfo(editUrl).then(res => {
        that.showloading = false
        if (res.code == 200) {
          // 根据审批类型获取审批流分类列表
          switch (parseInt(processId)) {
            case 1:
              that.dialogWidth = '700px'
              that.modelTitle = '编辑采购'
              // that.$refs["procurementForm"].resetFields();
              that.procurementForm = res.data.procurement
              console.log(that.procurementForm.items)
              if (that.procurementForm.items !== '') {
                that.procurementList1 = JSON.parse(
                  that.procurementForm.items
                )
              }
              that.supplierList = res.data.supplier
              that.supplierList.push({ label: '其他方式采购', value: '-1' })
              if (that.procurementForm.files == '') {
                that.procurementFormFilesArr = []
              } else {
                that.procurementFormFilesArr = JSON.parse(that.procurementForm.files)
              }
              break
            case 2: {
              that.modelTitle = '编辑拜访'
              // that.$refs["visitForm"].resetFields();
              const arr = []
              for (let i = 0; i < res.data.escorts.length; i++) {
                arr.push({
                  value: res.data.escorts[i].id,
                  label: res.data.escorts[i].name + '-' + res.data.escorts[i].deptName
                })
              }
              that.radioList = arr
              that.accompanyList = []
              that.visitForm = res.data.visit
              if (that.visitForm.accompany !== '') {
                that.accompanyList = that.visitForm.accompany.split(',')
              }
              break
            }
            case 3:
              that.modelTitle = '编辑用章申请'
              // that.$refs["sealForm"].resetFields();
              that.radioList = res.data.typeList
              that.radioList1 = res.data.subjectList
              that.sealForm = res.data.seal
              break
            case 4:
              that.dialogWidth = '700px'
              that.modelTitle = '编辑报销'
              // that.$refs["refundForm"].clearValidate()
              // that.$refs["refundForm"].resetFields();
              that.refundForm = res.data.refund
              that.refundList = JSON.parse(that.refundForm.items)
              break
            case 11:
              that.dialogWidth = '700px'
              that.modelTitle = '编辑费用申请'
              // that.$refs["refundForm"].clearValidate()
              // that.$refs["refundForm"].resetFields();
              that.costForm = res.data.costapply
              that.costList = JSON.parse(that.costForm.items)
              break
            case 5:
              that.modelTitle = '编辑加班申请'
              // that.$refs["overtimeForm"].clearValidate();
              // that.$refs["overtimeForm"].resetFields();
              that.radioList = res.data.typeList
              that.overtimeForm = res.data.overtime
              var over_start = res.data.overtime.startDate.split(' ')
              that.overday_start = over_start[0]
              that.overtime_start = over_start[1]
              var over_end = res.data.overtime.endDate.split(' ')
              that.overday_end = over_end[0]
              that.overtime_end = over_end[1]
              break
            case 6:
              that.modelTitle = '编辑假条'
              // that.$refs["leaveForm"].clearValidate();
              // that.$refs["leaveForm"].resetFields();
              that.radioList = res.data.typeList
              that.leaveForm = res.data.leave
              that.temporaryTime = res.data.sign.lastime
              var leave_start = res.data.leave.startDate.split(' ')
              that.leaveday_start = leave_start[0]
              that.leavetime_start = leave_start[1]
              var leave_end = res.data.leave.endDate.split(' ')
              that.leaveday_end = leave_end[0]
              that.leavetime_end = leave_end[1]
              break
            case 7:
              that.modelTitle = '编辑用车申请'
              // that.$refs["carForm"].clearValidate();
              // that.$refs["carForm"].resetFields();
              that.radioList = res.data.typeList
              that.carForm = res.data.car
              break
            case 8:
              that.modelTitle = '编辑物品领用'
              // that.$refs["receiveForm"].resetFields();
              that.radioList = res.data.typeList
              that.receiveForm = res.data.receive
              break
            case 9:
              that.dialogWidth = '700px'
              that.modelTitle = '编辑采购申请单'
              // that.$refs["procurementapplyForm"].clearValidate();
              // that.$refs["procurementapplyForm"].resetFields();
              that.procurementapplyForm = res.data.procurementapply
              // that.$nextTick(() => {
              //   that.$refs['procurementapplyForm'].clearValidate()
              // })
              that.procurementList = JSON.parse(that.procurementapplyForm.items)
              // if (that.procurementapplyForm.files == '') {
              //   that.fileList = []
              // } else {
              //   that.fileList = JSON.parse(that.procurementapplyForm.files)
              // }
              break
            case 10:
              that.modelTitle = '编辑销假'
              // that.$refs["leaveForm"].clearValidate();
              // that.$refs["leaveForm"].resetFields();
              that.radioList = res.data.typeList
              that.salesLeaveForm = res.data.leave
              for (let i = 0; i < that.radioList.length; i++) {
                if (that.salesLeaveForm.leaveId == that.radioList[i].value) {
                  that.min_leave = that.radioList[i].startDate
                  that.max_leave = that.radioList[i].endDate
                  that.max_leave_hours = that.radioList[i].hours
                  that.sales_leave_type = that.radioList[i].type
                }
              }
              var sales_leave_start = res.data.leave.startDate.split(' ')
              that.leaveday_start = sales_leave_start[0]
              that.leavetime_start = sales_leave_start[1]
              var sales_leave_end = res.data.leave.endDate.split(' ')
              that.leaveday_end = sales_leave_end[0]
              that.leavetime_end = sales_leave_end[1]
              break
          }
          if (parseInt(processId) == 1) {
            getProBySup(res.data.procurement.supplierID).then(req => {
              if (req.code == 200) {
                console.log(req.data)
                that.proList = req.data
                that.modelShow = true
              }
            })
          } else {
            that.modelShow = true
          }
        } else {
          that.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    calcAmout() {
      this.refundForm.amount = 0.00
      const info = this.refundList
      for (let i = 0; i < info.length; i++) {
        info[i].proPrice = parseFloat(info[i].proPrice).toFixed(2)
        this.refundForm.amount += info[i].proPrice * info[i].proNum
      }
      this.refundList = info
      this.refundForm.amount = parseFloat(this.refundForm.amount).toFixed(2)
    },
    calcCostAmout() {
      this.costForm.amount = 0.00
      const info = this.costList
      for (let i = 0; i < info.length; i++) {
        info[i].proPrice = parseFloat(info[i].proPrice).toFixed(2)
        this.costForm.amount += info[i].proPrice * info[i].proNum
      }
      this.costList = info
      this.costForm.amount = parseFloat(this.costForm.amount).toFixed(2)
    },
    choseSup() {
      const that = this
      if (this.procurementForm.supplierID == -1) {
        this.procurementForm.other = 1
        this.procurementList1 = []
      } else {
        this.procurementForm.other = 0
        this.procurementList1 = []
        getProBySup(this.procurementForm.supplierID).then(res => {
          if (res.code == 200) {
            that.proList = res.data
            that.procurementList1 = []
          }
        })
      }
    },
    choseOther() {
      console.log(this.procurementForm)
      this.procurementForm.supplierID = ''
      this.procurementList1 = []
    },
    chosePro(index) {
      console.log(this.procurementList1)
      for (let i = 0; i < this.proList.length; i++) {
        if (this.procurementList1[index].proName == this.proList[i].id) {
          this.procurementList1[index].proPrice = parseFloat(this.proList[i].price).toFixed(2)
          this.procurementList1[index].proUnit = this.proList[i].unit
        }
      }
      console.log(this.procurementList1)
      console.log(this.proList)
      this.$forceUpdate()
    },
    addPrice() {
      console.log(this.procurementList1)
      let sum = 0.0
      for (let i = 0; i < this.procurementList1.length; i++) {
        this.procurementList1[i].proNum = parseInt(this.procurementList1[i].proNum)
        sum += parseFloat(this.procurementList1[i].proPrice).toFixed(2) * parseInt(this.procurementList1[i].proNum)
      }
      this.procurementForm.amount = parseFloat(sum).toFixed(2)
      this.$forceUpdate()
    },
    addApplyInfo(type) {
      if (parseInt(type) == 4) {
        if (this.refundList.length == 0) {
          this.refundList.push(
            { proName: '', proPrice: 0.00, proNum: 1, remark: '', file: '', refundFilesArr: [] }
          )
        } else {
          let flag = true
          const info = this.refundList
          for (let i = 0; i < info.length; i++) {
            for (const item in info[i]) {
              if (info[i]['refundFilesArr'].length > 0) {
                info[i]['file'] = JSON.stringify(info[i]['refundFilesArr'])
              }
              if (info[i][item] == '') {
                switch (item) {
                  case 'file':this.$message.warning('上传凭证不能为空'); break
                  case 'proName':this.$message.warning('项目名称不能为空'); break
                  case 'proPrice':this.$message.warning('报销单价不能为空'); break
                  case 'proNum':this.$message.warning('报销数量不能为空'); break
                  case 'remark':this.$message.warning('报销备注不能为空'); break
                }
                flag = false
                break
              } else {
                if (item == 'proPrice' && info[i]['proPrice'].length > 10) {
                  this.$message.warning('项目名称长度不能大于10')
                  flag = false
                  break
                }
              }
            }
          }
          if (flag) {
            this.refundList.push({ proName: '', proPrice: 0.00, proNum: 1, remark: '', file: '', refundFilesArr: [] })
          }
        }
      } else if (parseInt(type) == 9) {
        if (this.procurementList.length == 0) {
          this.procurementList.push({
            proName: '',
            proRemark: ''
          })
        } else {
          let flag = true
          const info = this.procurementList
          for (let i = 0; i < info.length; i++) {
            for (const item in info[i]) {
              if (info[i][item] == '') {
                switch (item) {
                  case 'proName':this.$message.warning('产品名称不能为空'); break
                  case 'proRemark':this.$message.warning('采购备注不能为空'); break
                }
                flag = false
                break
              }
            }
          }
          if (flag) {
            this.procurementList.push({
              proName: '',
              proRemark: ''
            })
          }
        }
      } else if (parseInt(type) == 11) {
        if (this.costList.length == 0) {
          this.costList.push(
            { proName: '', proPrice: 0.00, proNum: 1, remark: '', file: '', refundFilesArr: [] }
          )
        } else {
          let flag = true
          const info = this.costList
          for (let i = 0; i < info.length; i++) {
            for (const item in info[i]) {
              if (info[i]['costFilesArr'].length > 0) {
                info[i]['file'] = JSON.stringify(info[i]['costFilesArr'])
              }
              if (info[i][item] == '') {
                switch (item) {
                  case 'file':this.$message.warning('上传凭证不能为空'); break
                  case 'proName':this.$message.warning('项目名称不能为空'); break
                  case 'proPrice':this.$message.warning('费用申请单价不能为空'); break
                  case 'proNum':this.$message.warning('费用申请数量不能为空'); break
                  case 'remark':this.$message.warning('费用申请备注不能为空'); break
                }
                flag = false
                break
              } else {
                if (item == 'proPrice' && info[i]['proPrice'].length > 10) {
                  this.$message.warning('项目名称长度不能大于10')
                  flag = false
                  break
                }
              }
            }
          }
          if (flag) {
            this.costList.push({ proName: '', proPrice: 0.00, proNum: 1, remark: '', file: '', costFilesArr: [] })
          }
        }
      } else {
        if (this.procurementForm.supplierID == undefined || this.procurementForm.supplierID == '') {
          this.$message.warning('请先选择供应商')
        } else {
          if (this.procurementList1.length == 0) {
            this.procurementList1.push({
              proName: '',
              proPrice: 0.00,
              proNum: 0,
              proUnit: ''
            })
          } else {
            let flag = true
            const info = this.procurementList1
            for (let i = 0; i < info.length; i++) {
              for (const item in info[i]) {
                if (info[i][item] == '') {
                  switch (item) {
                    case 'proName':this.$message.warning('产品名称不能为空'); break
                    case 'proPrice':this.$message.warning('单价不能为空'); break
                    case 'proNum':this.$message.warning('数量不能为空'); break
                    case 'proUnit':this.$message.warning('单位不能为空'); break
                  }
                  this.$message.warning('采购明细不能为空')
                  flag = false
                  break
                }
              }
            }
            if (flag) {
              this.procurementList1.push({
                proName: '',
                proPrice: 0.00,
                proNum: 0,
                proUnit: ''
              })
            }
          }
        }
      }
      this.$forceUpdate()
    },
    removeApplyInfo(type, item) {
      let index = 0
      if (parseInt(type) == 4) {
        console.log('报销删除最后一行')
        console.log(this.refundList)
        // 报销删除最后一行
        this.refundList.splice(this.refundList.length - 1, 1)
      } else if (parseInt(type) == 9) {
        console.log('采购申请单删除最后一行')
        console.log(this.procurementList)
        this.procurementList.splice(this.procurementList.length - 1, 1)
      } else if (parseInt(type) == 11) {
        console.log('费用申请单删除最后一行')
        console.log(this.costList)
        this.costList.splice(this.costList.length - 1, 1)
      } else {
        console.log('采购付款删除最后一行')
        this.procurementList1.splice(this.procurementList1.length - 1, 1)
        index = this.procurementList1.indexOf(item)
        this.addPrice()
      }
    },
    passModel(type) {
      const that = this
      console.log(this.opinion)
      if (this.opinion.length > 200) {
        that.$message({
          message: '留言备注长度不得大于200字~',
          type: 'warning'
        })
      } else {
        const that = this
        const msg = '确定通过申请吗？'
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          saveApprovalType({
            remark: this.opinion
          },
          '/oa/workflow-pass-' + this.showId
          ).then(res => {
            if (res.code == 200 || res.code == '200') {
              console.log(res)
              that.$message({
                message: res.data.message,
                type: 'success'
              })
              console.log(that.mode)
              window.localStorage.setItem('mode', that.mode)
              that.$router.back(-1)
              that.loading = true
            } else {
              that.$message({
                message: res.data.msg.message,
                type: 'warning'
              })
            }
          })
        }).catch(() => {
          console.log('用户点击了取消')
        })
      }
    },
    rejectedModel(type) {
      const that = this
      if (this.opinion.length > 200) {
        that.$message({
          message: '留言备注长度不得大于200字~',
          type: 'warning'
        })
      } else {
        const that = this
        const msg = '确定驳回申请吗？'
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          saveApprovalType({
            remark: this.opinion
          },
          '/oa/workflow-rejected-' + this.showId
          ).then(res => {
            if (res.code == 200 || res.code == '200') {
              console.log(res)
              that.$message({
                message: res.data.message,
                type: 'success'
              })
              console.log(that.mode)
              window.localStorage.setItem('mode', that.mode)
              that.$router.back(-1)
              that.resetModel()
              that.loading = true
            } else {
              that.$message({
                message: res.data.msg.message,
                type: 'warning'
              })
            }
          })
        }).catch(() => {
          console.log('用户点击了取消')
        })
      }
    },
    showCostDialog(list, index) {
      // 费用申请
      this.filesArr = []
      this.fileList = []
      this.fileList = list
      this.refund_dialog = true
      this.file_index = index
    },
    showRefundDialog(list, index) {
      if (index == 'procurementForm') {
        // 采购付款
        this.filesArr = []
        this.fileList = []
        this.fileList = list
        this.refund_dialog = true
        this.file_index = index
      } else {
        // 报销
        this.filesArr = []
        this.fileList = []
        this.fileList = list
        this.refund_dialog = true
        this.file_index = index
      }
    },
    sureRefundFile() {
      console.log(this.filesArr)
      if (this.file_index == 'procurementForm') {
        this.refund_dialog = false
        this.procurementFormFilesArr = this.filesArr
      } else {
        console.log(this.filesArr)
        if (parseInt(this.modelType) == 4) {
          this.refund_dialog = false
          this.refundList[this.file_index].refundFilesArr = this.filesArr
        } else {
          this.refund_dialog = false
          this.costList[this.file_index].costFilesArr = this.filesArr
        }
      }
    },
    beforeUpload(file, fileList) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (file.name.indexOf('.png') === -1 && file.name.indexOf('.jpg') === -1 && file.name.indexOf('.bmp') === -1 && file.name.indexOf('.doc') === -1 && file.name.indexOf('.docx') === -1 && file.name.indexOf('.ppt') === -1 && file.name.indexOf('.pdf') === -1 && file.name.indexOf('.zip') === -1 && file.name.indexOf('.rar') === -1 &&
          file.name.indexOf('.xls') === -1 && file.name.indexOf('.xlsx') === -1 && file.name.indexOf('.csv') === -1) {
        this.$message.warning('文件格式不正确！')
        return false
      }
      // if (!isLt5M) {
      //   this.$message.warning('上传文件大小不能超过 5MB!')
      //   return false
      // }
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    },
    handleSuccess(res, file, fileList) {
      this.uploadFile = ''
      // let list = {}
      console.log(res)
      console.log(fileList)
      this.filesArr = []
      if (res.code == 200 || res.code == '200') {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].response == undefined) {
            this.filesArr.push({
              name: fileList[i].name,
              url: fileList[i].url
            })
          } else {
            this.filesArr.push({
              name: fileList[i].name,
              url: fileList[i].response.data.data[0].pathname
            })
          }
        }

        // list = [{
        //   name: file.name,
        //   url: res.data.data[0].pathname
        // }]
        // this.uploadFile = JSON.stringify(list)
        // if (parseInt(this.modelType) == 4) {
        //   this.refundForm.files = this.uploadFile
        // }
        // if (parseInt(this.modelType) == 1) {
        //   this.procurementForm.files = this.uploadFile
        // }
      }
      console.log(this.filesArr)
    },
    handleRemove(file, fileList) {
      console.log(file)
      console.log(fileList)
      this.filesArr = []
      if (fileList.length > 0) {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].response == undefined) {
            this.filesArr.push({
              name: fileList[i].name,
              url: fileList[i].url
            })
          } else {
            this.filesArr.push({
              name: fileList[i].name,
              url: fileList[i].response.data.data[0].pathname
            })
          }
        }
      } else {
        if (parseInt(this.modelType) == 4) {
          this.refundForm.files = ''
        }
        if (parseInt(this.modelType) == 1) {
          this.procurementForm.files = ''
        }
      }
    },
    checkTimeValue() {
      const that = this
      if (parseInt(this.modelType) == 5) {
        // 加班
        if (this.overtimeForm.startDate !== '' && this.overtimeForm.endDate !== '') {
          const startTime = new Date(this.overtimeForm.startDate)
          const endTime = new Date(this.overtimeForm.endDate)
          this.overTime = (endTime - startTime) / 3600 / 1000
          if (startTime >= endTime) {
            this.$message({
              message: '结束时间不能小于开始时间',
              type: 'warning'
            })
            this.overtimeForm.endDate = ''
          } else {
            console.log(this.overtimeForm.type, 'd')
            calcTime('/oa/overtime-working-' + this.overtimeForm.type, {
              start: this.overtimeForm.startDate,
              end: this.overtimeForm.endDate
            }).then(res => {
              console.log(res)
              if (res.code == 200) {
                that.overtimeForm.hours = res.data.hours
                console.log(res.data.hours, 'ff')
                console.log(that.overtimeForm.hours, 'df')
                console.log(res.data.hours, 'fff')
                if (!res.data.hours) {
                  that.$message({
                    message: res.data,
                    type: 'warning'
                  })
                  that.overday_end = ''
                  that.overtime_end = ''
                  that.overtime_start = ''
                  that.overday_start = ''
                  that.overtimeForm.hours = 0
                }
              }
            })
          }
        } else {
          this.overTime = 100
        }
      }
    },
    checkValue() {
      const that = this
      if (parseInt(this.modelType) == 5) {
        // 加班
        if (this.overday_start !== '' && this.overtime_start == '') {
          this.overtime_start = '09:00'
        }
        if (this.overday_end !== '' && this.overtime_end == '') {
          this.overtime_end = '23:00'
        }
        this.overtimeForm.startDate = this.overday_start + ' ' + this.overtime_start
        this.overtimeForm.endDate = this.overday_end + ' ' + this.overtime_end
        if (this.overday_start !== '' && this.overtime_start !== '' && this.overday_end !== '' && this
          .overtime_end !== '') {
          const startTime = new Date(this.overtimeForm.startDate)
          const endTime = new Date(this.overtimeForm.endDate)
          this.overTime = (endTime - startTime) / 3600 / 1000
          if (startTime >= endTime) {
            this.$message({
              message: '结束时间不能小于开始时间',
              type: 'warning'
            })
            this.overtimeForm.endDate = ''
            this.overday_end = ''
            this.overtime_end = ''
          } else {
            console.log(this.overtimeForm.type, 'd')
            calcTime('/oa/overtime-working-' + this.overtimeForm.type, {
              start: this.overtimeForm.startDate,
              end: this.overtimeForm.endDate
            }).then(res => {
              console.log(res)
              if (res.code == 200) {
                that.overtimeForm.hours = res.data.hours
                console.log(res.data.hours, 'ff')
                console.log(that.overtimeForm.hours, 'df')
                console.log(res.data.hours, 'fff')
                if (!res.data.hours) {
                  that.$message({
                    message: res.data,
                    type: 'warning'
                  })
                  that.overday_end = ''
                  that.overtime_end = ''
                  that.overtime_start = ''
                  that.overday_start = ''
                  that.overtimeForm.hours = 0
                }
              }
            })
          }
        } else {
          this.overTime = 100
        }
      }
    },
    choseLeaveType() {
      console.log(this.salesLeaveForm.leaveId)
      for (let i = 0; i < this.radioList.length; i++) {
        if (this.salesLeaveForm.leaveId == this.radioList[i].value) {
          this.min_leave = this.radioList[i].startDate
          this.max_leave = this.radioList[i].endDate
          this.max_leave_hours = this.radioList[i].hours
          this.sales_leave_type = this.radioList[i].type
        }
      }
      console.log(this.min_leave)
      console.log(this.max_leave)
      console.log(this.max_leave_hours)
    },
    checkSalesLeaveStart() {
      const that = this
      if (parseInt(this.modelType) == 10) {
        // 销假
        if (this.leaveday_start !== '' && this.leavetime_start == '') {
          const timeArr = this.min_leave.split(' ')
          this.leavetime_start = timeArr[1]
        }
        if (this.leaveday_end !== '' && this.leavetime_end == '') {
          const time1Arr = this.max_leave.split(' ')
          this.leavetime_end = time1Arr[1]
        }
        console.log(this.leaveday_start)
        console.log(this.leaveday_end)
        this.salesLeaveForm.startDate = this.leaveday_start + ' ' + this.leavetime_start
        this.salesLeaveForm.endDate = this.leaveday_end + ' ' + this.leavetime_end
        if (this.salesLeaveForm.startDate !== ' ') {
          const startTime = new Date(this.salesLeaveForm.startDate)
          var minTime = new Date(this.min_leave)
          var maxTime = new Date(this.max_leave)
          if (startTime < minTime) {
            this.$message({
              message: '销假开始时间不能小于请假开始时间',
              type: 'warning'
            })
            this.leaveday_start = ''
            this.leavetime_start = ''
            this.salesLeaveForm.startDate = ''
          } else if (startTime > maxTime) {
            this.$message({
              message: '销假开始时间不能大于请假结束时间',
              type: 'warning'
            })
            this.leaveday_start = ''
            this.leavetime_start = ''
            this.salesLeaveForm.startDate = ''
          } else {
            console.log('计算开始时间')
            isWorkDay({
              date: this.salesLeaveForm.startDate
            }).then(res => {
              console.log(res)
              if (res.code == 200) {
                if (res.data.data == 'isnotworksday') {
                  this.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                  this.leaveday_start = ''
                  this.leavetime_start = ''
                  this.salesLeaveForm.startDate = ''
                } else {
                  if (this.leaveday_start !== '' && this.leavetime_start !== '' && this.leaveday_end !== '' &&
                      this.leavetime_end !== '') {
                    const startTime = new Date(this.salesLeaveForm.startDate)
                    const endTime = new Date(this.salesLeaveForm.endDate)
                    this.leaveTime = (endTime - startTime) / 3600 / 1000
                    if (startTime > endTime) {
                      this.$message({
                        message: '结束时间不能小于开始时间',
                        type: 'warning'
                      })
                      this.salesLeaveForm.endDate = ''
                      this.salesLeaveForm.hours = 0
                    } else {
                      calcTime('/oa/leave-working', {
                        start: this.salesLeaveForm.startDate,
                        end: this.salesLeaveForm.endDate
                      }).then(res => {
                        console.log(res)
                        if (res.code == 200) {
                          that.salesLeaveForm.hours = res.data.hours
                          console.log(that.salesLeaveForm.hours, 'f')
                          console.log(res.data.hours, 'fd')
                        }
                      })
                    }
                  } else {
                    // this.leaveForm.hours = 0
                    this.leaveTime = 100
                  }
                }
              }
            })
          }
        }
      }
    },
    checkSalesLeaveValue() {
      const that = this
      if (parseInt(this.modelType) == 10) {
        // 销假
        if (this.leaveday_start !== '' && this.leavetime_start == '') {
          const timeArr = this.min_leave.split(' ')
          this.leavetime_start = timeArr[1]
        }
        if (this.leaveday_end !== '' && this.leavetime_end == '') {
          const time1Arr = this.max_leave.split(' ')
          this.leavetime_end = time1Arr[1]
        }
        this.salesLeaveForm.startDate = this.leaveday_start + ' ' + this.leavetime_start
        this.salesLeaveForm.endDate = this.leaveday_end + ' ' + this.leavetime_end
        console.log(this.salesLeaveForm.startDate)
        console.log(this.salesLeaveForm.endDate)
        if (this.salesLeaveForm.endDate !== ' ') {
          const endTime = new Date(this.salesLeaveForm.endDate)
          var minTime = new Date(this.min_leave)
          var maxTime = new Date(this.max_leave)
          if (endTime < minTime) {
            this.$message({
              message: '销假开始时间不能小于请假开始时间',
              type: 'warning'
            })
            this.leaveday_end = ''
            this.leavetime_end = ''
            this.salesLeaveForm.endDate = ''
          } else if (endTime > maxTime) {
            this.$message({
              message: '销假开始时间不能大于请假结束时间',
              type: 'warning'
            })
            this.leaveday_end = ''
            this.leavetime_end = ''
            this.salesLeaveForm.endDate = ''
          } else {
            console.log('计算结束时间')
            isWorkDay({
              date: this.salesLeaveForm.endDate
            }).then(res => {
              if (res.code == 200) {
                if (res.data.data == 'isnotworksday') {
                  this.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                  this.leaveday_end = ''
                  this.leavetime_end = ''
                  this.salesLeaveForm.endDate = ''
                } else {
                  if (this.leaveday_start !== '' && this.leavetime_start !== '' && this.leaveday_end !== '' &&
                      this.leavetime_end !== '') {
                    const startTime = new Date(this.salesLeaveForm.startDate)
                    const endTime = new Date(this.salesLeaveForm.endDate)
                    // this.leaveForm.hours = Math.floor((endTime - startTime) / 3600 / 1000)
                    // this.leaveForm.hours = ((endTime - startTime) / 3600 / 1000).toFixed(2)
                    // this.leaveTime = Math.floor((endTime - startTime) / 3600 / 1000)
                    this.leaveTime = (endTime - startTime) / 3600 / 1000
                    // this.leaveTime = parseFloat(((endTime - startTime) / 3600 / 1000).toFixed(2))
                    if (startTime > endTime) {
                      this.$message({
                        message: '结束时间不能小于开始时间',
                        type: 'warning'
                      })
                      this.salesLeaveForm.endDate = ''
                      this.leaveday_end = ''
                      this.leavetime_end = ''
                      this.salesLeaveForm.hours = 0
                    } else {
                      calcTime('/oa/leave-working', {
                        start: this.salesLeaveForm.startDate,
                        end: this.salesLeaveForm.endDate
                      }).then(res => {
                        console.log(res)
                        if (res.code == 200) {
                          that.salesLeaveForm.hours = res.data.hours
                        }
                      })
                    }
                  } else {
                    // this.leaveForm.hours = 0
                    this.leaveTime = 100
                  }
                }
              }
            })
          }
        }
      }
    },
    checkLeaveValueStart() {
      const that = this
      if (parseInt(this.modelType) == 6) {
        // 请假
        if (this.leaveday_start !== '' && this.leavetime_start == '') {
          this.leavetime_start = this.time_seting.sign_in
        }
        if (this.leaveday_end !== '' && this.leavetime_end == '') {
          this.leavetime_end = this.time_seting.sign_out
        }
        this.leaveForm.startDate = this.leaveday_start + ' ' + this.leavetime_start
        this.leaveForm.endDate = this.leaveday_end + ' ' + this.leavetime_end
        console.log(this.leaveForm.startDate)
        console.log(this.leaveForm.endDate)
        if (this.leaveForm.startDate !== ' ') {
          console.log('计算开始时间')
          isWorkDay({
            date: this.leaveForm.startDate
          }).then(res => {
            console.log(res)
            if (res.code == 200) {
              if (res.data.data == 'isnotworksday') {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
                this.leaveday_start = ''
                this.leavetime_start = ''
                this.leaveForm.startDate = ''
              } else {
                if (this.leaveday_start !== '' && this.leavetime_start !== '' && this.leaveday_end !== '' && this
                  .leavetime_end !== '') {
                  const startTime = new Date(this.leaveForm.startDate)
                  const endTime = new Date(this.leaveForm.endDate)
                  // this.leaveForm.hours = Math.floor((endTime - startTime) / 3600 / 1000)
                  // this.leaveForm.hours = ((endTime - startTime) / 3600 / 1000).toFixed(2)
                  // this.leaveTime = Math.floor((endTime - startTime) / 3600 / 1000)
                  this.leaveTime = (endTime - startTime) / 3600 / 1000
                  // this.leaveTime = parseFloat(((endTime - startTime) / 3600 / 1000).toFixed(2))
                  if (startTime >= endTime) {
                    this.$message({
                      message: '结束时间不能小于开始时间',
                      type: 'warning'
                    })
                    this.leaveForm.endDate = ''
                    this.leaveday_end = ''
                    this.leavetime_end = ''
                    this.leaveForm.hours = 0
                  } else {
                    calcTime('/oa/leave-working', {
                      start: this.leaveForm.startDate,
                      end: this.leaveForm.endDate
                    }).then(res => {
                      console.log(res)
                      if (res.code == 200) {
                        that.leaveForm.hours = res.data.hours
                        console.log(that.leaveForm.hours, 'f')
                        console.log(res.data.hours, 'fd')
                      }
                    })
                  }
                } else {
                  // this.leaveForm.hours = 0
                  this.leaveTime = 100
                }
              }
            }
          })
        }
      }
    },
    checkLeaveValue() {
      const that = this
      if (parseInt(this.modelType) == 6) {
        // 请假
        if (this.leaveday_start !== '' && this.leavetime_start == '') {
          this.leavetime_start = this.time_seting.sign_in
        }
        if (this.leaveday_end !== '' && this.leavetime_end == '') {
          this.leavetime_end = this.time_seting.sign_out
        }
        this.leaveForm.startDate = this.leaveday_start + ' ' + this.leavetime_start
        this.leaveForm.endDate = this.leaveday_end + ' ' + this.leavetime_end
        console.log(this.leaveForm.startDate)
        console.log(this.leaveForm.endDate)
        if (this.leaveForm.endDate !== ' ') {
          console.log('计算结束时间')
          isWorkDay({
            date: this.leaveForm.endDate
          }).then(res => {
            if (res.code == 200) {
              if (res.data.data == 'isnotworksday') {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
                this.leaveday_end = ''
                this.leavetime_end = ''
                this.leaveForm.endDate = ''
              } else {
                if (this.leaveday_start !== '' && this.leavetime_start !== '' && this.leaveday_end !== '' && this
                  .leavetime_end !== '') {
                  const startTime = new Date(this.leaveForm.startDate)
                  const endTime = new Date(this.leaveForm.endDate)
                  // this.leaveForm.hours = Math.floor((endTime - startTime) / 3600 / 1000)
                  // this.leaveForm.hours = ((endTime - startTime) / 3600 / 1000).toFixed(2)
                  // this.leaveTime = Math.floor((endTime - startTime) / 3600 / 1000)
                  this.leaveTime = (endTime - startTime) / 3600 / 1000
                  // this.leaveTime = parseFloat(((endTime - startTime) / 3600 / 1000).toFixed(2))
                  if (startTime >= endTime) {
                    this.$message({
                      message: '结束时间不能小于开始时间',
                      type: 'warning'
                    })
                    this.leaveForm.endDate = ''
                    this.leaveForm.hours = 0
                  } else {
                    calcTime('/oa/leave-working', {
                      start: this.leaveForm.startDate,
                      end: this.leaveForm.endDate
                    }).then(res => {
                      console.log(res)
                      if (res.code == 200) {
                        that.leaveForm.hours = res.data.hours
                      }
                    })
                  }
                } else {
                  // this.leaveForm.hours = 0
                  this.leaveTime = 100
                }
              }
            }
          })
        }
      }
    },
    dateChange(type, date) {
      if (date) {
        const nowTime = new Date().getTime()
        const pickTime = new Date(date).getTime()
        if (pickTime < nowTime) {
          console.log(111)
          if (type == 'start') {
            this.$message({
              message: '开始时间不能小于当前时间',
              type: 'warning'
            })
            this.visitForm.startDate = ''
          } else {
            this.$message({
              message: '结束时间不能小于当前时间',
              type: 'warning'
            })
            this.visitForm.endDate = ''
          }
        }
        if (this.visitForm.startDate !== '' && this.visitForm.endDate !== '') {
          const startTime = new Date(this.visitForm.startDate)
          const endTime = new Date(this.visitForm.endDate)
          if (startTime >= endTime) {
            this.$message({
              message: '结束时间不能小于开始时间',
              type: 'warning'
            })
            this.visitForm.endDate = ''
          }
        }
      }
    },
    sureSave(form) {
      const that = this
      // 判断报销明细
      let flag = true
      if (parseInt(this.modelType) == 4) {
        if (this.refundList.length > 0) {
          const block = this.refundList
          for (let i = 0; i < block.length; i++) {
            for (const item in block[i]) {
              if (block[i]['refundFilesArr'].length > 0 && block[i]['file'] == '') {
                block[i]['file'] = JSON.stringify(block[i]['refundFilesArr'])
              }
              if (block[i][item] == '') {
                switch (item) {
                  case 'file':this.$message.warning('上传凭证不能为空'); break
                  case 'proName':this.$message.warning('项目名称不能为空'); break
                  case 'proPrice':this.$message.warning('报销单价不能为空'); break
                  case 'proNum':this.$message.warning('报销数量不能为空'); break
                  case 'remark':this.$message.warning('报销备注不能为空'); break
                }
                flag = false
                break
              }
            }
          }
          if (flag) {
            this.refundForm.items = JSON.stringify(this.refundList)
          }
        } else if (this.refundList.length <= 0) {
          this.$message.warning('请新增报销明细！')
          flag = false
        }
      }
      if (parseInt(this.modelType) == 11) {
        if (this.costList.length > 0) {
          const block = this.costList
          for (let i = 0; i < block.length; i++) {
            for (const item in block[i]) {
              if (block[i]['costFilesArr'].length > 0 && block[i]['file'] == '') {
                block[i]['file'] = JSON.stringify(block[i]['costFilesArr'])
              }
              if (block[i][item] == '') {
                switch (item) {
                  case 'file':this.$message.warning('上传凭证不能为空'); break
                  case 'proName':this.$message.warning('项目名称不能为空'); break
                  case 'proPrice':this.$message.warning('费用申请单价不能为空'); break
                  case 'proNum':this.$message.warning('费用申请数量不能为空'); break
                  case 'remark':this.$message.warning('费用申请备注不能为空'); break
                }
                flag = false
                break
              }
            }
          }
          if (flag) {
            this.costForm.items = JSON.stringify(this.costList)
          }
        } else if (this.costList.length <= 0) {
          this.$message.warning('请新增报销明细！')
          flag = false
        }
      }
      if (parseInt(this.modelType) == 9) {
        // 判断采购申请明细
        if (this.procurementList.length > 0) {
          const block = this.procurementList
          for (let i = 0; i < block.length; i++) {
            for (const item in block[i]) {
              if (block[i][item] == '') {
                switch (item) {
                  case 'proName':this.$message.warning('产品名称不能为空'); break
                  case 'proRemark':this.$message.warning('采购备注不能为空'); break
                }
                flag = false
                break
              }
            }
          }
          if (flag) {
            this.procurementapplyForm.items = JSON.stringify(
              this.procurementList
            )
          }
        } else if (this.procurementList.length <= 0) {
          this.$message.warning('请新增采购申请明细！')
          flag = false
        }
      }
      if (parseInt(this.modelType) == 1) {
        if (this.procurementForm.other == '0' || this.procurementForm.other == 0) {
          // 判断采购付款明细
          if (this.procurementList1.length > 0) {
            const block = this.procurementList1
            for (let i = 0; i < block.length; i++) {
              for (const item in block[i]) {
                if (block[i][item] == '') {
                  switch (item) {
                    case 'proName':this.$message.warning('产品名称不能为空'); break
                    case 'proPrice':this.$message.warning('单价不能为空'); break
                    case 'proNum':this.$message.warning('数量不能为空'); break
                    case 'proUnit':this.$message.warning('单位不能为空'); break
                  }
                  flag = false
                  break
                }
              }
            }
            if (flag) {
              this.procurementForm.items = JSON.stringify(
                this.procurementList1
              )
            }
          } else if (this.procurementList1.length <= 0) {
            this.$message.warning('请新增采购付款明细！')
            flag = false
          }
        } else {
          this.procurementForm.items = ''
        }
      }
      if (parseInt(this.modelType) == 5) {
        var overhour_str = parseFloat(this.overtimeForm.hours).toFixed(1) + ''
        if (overhour_str[overhour_str.length - 1] !== '0' && overhour_str[overhour_str.length - 1] !== '5') {
          this.$message({
            message: '加班时长只能是.5或整数',
            type: 'warning'
          })
          flag = false
        }
        if (this.overtimeForm.hours > 10) {
          this.$message({
            message: '加班时长最多10小时',
            type: 'warning'
          })
          flag = false
        }
      }
      if (parseInt(this.modelType) == 6) {
        if (this.leaveForm.type == '3' || this.leaveForm.type == 3) {
          if (this.leaveForm.hours > this.temporaryTime) {
            this.$message({
              message: '请假时长不能大于可调休时长',
              type: 'warning'
            })
            this.leaveday_end = ''
            this.leavetime_end = ''
            this.leaveForm.endDate = ''
            this.leaveForm.hours = 0
          }
        }
        var hour_str = parseFloat(this.leaveForm.hours).toFixed(1) + ''
        console.log(hour_str)
        console.log(hour_str[hour_str.length - 1])
        if (hour_str[hour_str.length - 1] !== '0' && hour_str[hour_str.length - 1] !== '5') {
          this.$message({
            message: '请假时长只能是.5或整数',
            type: 'warning'
          })
          flag = false
        }
      }
      if (parseInt(this.modelType) == 10) {
        var sales_hour_str = parseFloat(this.salesLeaveForm.hours).toFixed(1) + ''
        console.log(sales_hour_str[sales_hour_str.length - 1])
        if (sales_hour_str[sales_hour_str.length - 1] !== '0' && sales_hour_str[sales_hour_str.length - 1] !== '5') {
          this.$message({
            message: '销假时长只能是.5或整数',
            type: 'warning'
          })
          flag = false
        }
        console.log(parseFloat(this.salesLeaveForm.hours))
        console.log(parseFloat(this.max_leave_hours))
        console.log(parseFloat(this.salesLeaveForm.hours) > parseFloat(this.max_leave_hours))
        if (parseFloat(this.salesLeaveForm.hours) > parseFloat(this.max_leave_hours)) {
          this.$message({
            message: '销假时长不能大于请假时长',
            type: 'warning'
          })
          flag = false
        }
        this.salesLeaveForm.type = this.sales_leave_type
      }
      this.$refs[form].validate(valid => {
        console.log(valid)
        if (valid) {
          let info = {}
          let title = ''
          switch (parseInt(this.modelType)) {
            case 1:
              info = this.procurementForm
              this.uploadFile = JSON.stringify(this.filesArr)
              info.files = this.uploadFile
              title = '采购添加成功！'
              console.log(info)
              break
            case 2:
              this.visitForm.accompany = this.accompanyList.join(',')
              info = this.visitForm
              title = '拜访添加成功！'
              break
            case 3:
              info = this.sealForm
              title = '用章申请添加成功！'
              break
            case 4: {
              info = this.refundForm
              this.uploadFile = JSON.stringify(this.filesArr)
              info.files = this.uploadFile
              title = '报销申请添加成功！'
              console.log(info)
              break
            }
            case 5:
              info = this.overtimeForm
              title = '加班申请添加成功！'
              break
            case 6:
              info = this.leaveForm
              title = '请假添加成功！'
              break
            case 7:
              info = this.carForm
              title = '用车申请添加成功！'
              break
            case 8:
              info = this.receiveForm
              title = '物品领用添加成功！'
              break
            case 9: {
              info = this.procurementapplyForm
              title = '采购申请单添加成功！'
              break
            }
            case 10:
              info = this.salesLeaveForm
              title = '销假添加成功！'
              break
            case 11: {
              info = this.costForm
              this.uploadFile = JSON.stringify(this.filesArr)
              info.files = this.uploadFile
              title = '费用申请添加成功！'
              console.log(info)
              break
            }
          }
          if (this.divType == 'edit') {
            title = '更新成功！'
            if (parseInt(this.modelType) == 10) {
              info = {
                leaveId: this.salesLeaveForm.leaveId,
                startDate: this.salesLeaveForm.startDate,
                endDate: this.salesLeaveForm.endDate,
                hours: this.salesLeaveForm.hours,
                remark: this.salesLeaveForm.remark
              }
            }
          }
          console.log(info)
          if (flag) {
            this.submitting = true
            console.log(info)
            console.log(this.requestUrl)
            saveApprovalType(info, this.requestUrl).then(res => {
              if (res.code == 200 || res.code == '200') {
                that.$message({
                  message: title,
                  type: 'success'
                })
                console.log(that.mode)
                window.localStorage.setItem('mode', that.mode)
                that.$router.back(-1)
                that.resetModel()
                that.loading = true
              } else {
                that.submitting = false
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          }
        } else {
          console.log('error submit!!')
          //   // this.$message.warning('信息填写不完整或者信息填写有误！')
          // this.$nextTick(() => {
          //   this.checkFormErr()
          // })
          return false
        }
      })
    },
    resetModel() {
      if (this.divType == 'new' || this.divType == 'edit') {
        console.log('重置表单')
        switch (parseInt(this.modelType)) {
          case 1:
            // title = '采购添加成功！'
            this.$refs['procurementForm'].resetFields()
            this.procurementForm = {
              processTypeId: '',
              title: '',
              orderNo: '',
              supplierID: '',
              other: 0,
              items: '',
              amount: 0,
              files: '',
              remark: ''
            }
            break
          case 2:
            // title = '拜访添加成功！'
            this.$refs['visitForm'].resetFields()
            this.visitForm = {
              processTypeId: '',
              title: '',
              customer: '',
              contact: '',
              destination: '',
              accompany: '',
              startDate: '',
              endDate: '',
              remark: ''
            }
            this.accompanyList = []
            break
          case 3:
            // 用章
            this.$refs['sealForm'].resetFields()
            this.sealForm = {
              processTypeId: '',
              title: '',
              type: '',
              useDate: '',
              remark: ''
            }
            break
          case 4:
            // title = '报销申请添加成功！'
            this.$refs['refundForm'].resetFields()
            this.refundForm = {
              processTypeId: '',
              title: '',
              items: '',
              file: '',
              amount: 0,
              name: '',
              bank: '',
              card: '',
              remark: ''
            }
            this.refundList = [
              { proName: '', proPrice: 0.00, proNum: 1, remark: '', file: '', refundFilesArr: [] }
            ]
            break
          case 5:
            // title = '加班申请添加成功！'
            this.$refs['overtimeForm'].resetFields()
            this.overtimeForm = {
              processTypeId: '',
              title: '',
              type: '1',
              startDate: '',
              endDate: '',
              hours: '',
              remark: ''
            }
            this.overday_start = ''
            this.overtime_start = ''
            this.overday_end = ''
            this.overtime_end = ''
            break
          case 6:
            // title = '请假条添加成功！'
            this.$refs['leaveForm'].resetFields()
            this.leaveForm = {
              processTypeId: '',
              title: '',
              type: '',
              startDate: '',
              endDate: '',
              hours: '',
              contact: '',
              phone: '',
              remark: ''
            }
            this.leaveday_start = ''
            this.leavetime_start = ''
            this.leaveday_end = ''
            this.leavetime_end = ''
            break
          case 7:
            // 用车
            this.$refs['carForm'].resetFields()
            this.carForm = {
              processTypeId: '',
              title: '',
              type: '',
              useDate: '',
              isDriver: '',
              busNum: '',
              remark: ''
            }
            break
          case 8:
            // title = '物品领用添加成功！'
            this.$refs['receiveForm'].resetFields()
            this.receiveForm = {
              processTypeId: '',
              title: '',
              type: '',
              receiveDate: '',
              remark: ''
            }
            break
          case 9:
            // title = '采购申请申请单添加成功！'
            this.$refs['procurementapplyForm'].resetFields()
            this.procurementapplyForm = {
              processTypeId: '',
              title: '',
              items: '',
              remark: ''
            }
            this.procurementList = []
            break
          case 10:
            this.$refs['salesLeaveForm'].resetFields()
            this.salesLeaveForm = {
              processTypeId: '',
              leaveId: '',
              startDate: '',
              endDate: '',
              hours: '',
              remark: ''
            }
            this.leaveday_start = ''
            this.leavetime_start = ''
            this.leaveday_end = ''
            this.leavetime_end = ''
            break
          case 11:
            // title = '费用申请添加成功！'
            this.$refs['costForm'].resetFields()
            this.costForm = {
              processTypeId: '',
              title: '',
              items: '',
              file: '',
              amount: 0,
              name: '',
              bank: '',
              card: '',
              remark: ''
            }
            this.costList = [
              { proName: '', proPrice: 0.00, proNum: 1, remark: '', file: '', costFilesArr: [] }
            ]
            break
        }
      } else {
        this.getList()
      }
      this.filesArr = []
      this.submitting = false
      this.fileList = []
      this.opinion = ''
      this.modelShow = false
    },
    resetForm() {
      if (this.divType == 'new' || this.divType == 'edit') {
        console.log('重置表单')
        switch (parseInt(this.modelType)) {
          case 1:
            // title = '采购添加成功！'
            this.$refs['procurementForm'].resetFields()
            this.procurementForm = {
              processTypeId: '',
              title: '',
              orderNo: '',
              supplierID: '',
              other: 0.00,
              items: '',
              amount: 0.00,
              files: '',
              remark: ''
            }
            this.procurementList1 = []
            break
          case 2:
            // title = '拜访添加成功！'
            this.$refs['visitForm'].resetFields()
            this.visitForm = {
              processTypeId: '',
              title: '',
              customer: '',
              contact: '',
              destination: '',
              accompany: '',
              startDate: '',
              endDate: '',
              remark: ''
            }
            this.accompanyList = []
            break
          case 3:
            // 用章
            this.$refs['sealForm'].resetFields()
            this.sealForm = {
              processTypeId: '',
              title: '',
              type: '',
              useDate: '',
              remark: ''
            }
            break
          case 4:
            // title = '报销申请添加成功！'
            this.$refs['refundForm'].resetFields()
            this.refundForm = {
              processTypeId: '',
              title: '',
              items: '',
              file: '',
              amount: 0,
              name: '',
              bank: '',
              card: '',
              remark: ''
            }
            this.refundList = [
              { proName: '', proPrice: 0.00, proNum: 1, remark: '', file: '', refundFilesArr: [] }
            ]
            break
          case 5:
            // title = '加班申请添加成功！'
            this.$refs['overtimeForm'].resetFields()
            this.overtimeForm = {
              processTypeId: '',
              title: '',
              type: '1',
              startDate: '',
              endDate: '',
              hours: '',
              remark: ''
            }
            this.overday_start = ''
            this.overtime_start = ''
            this.overday_end = ''
            this.overtime_end = ''
            break
          case 6:
            // title = '请假条添加成功！'
            this.$refs['leaveForm'].resetFields()
            this.leaveForm = {
              processTypeId: '',
              title: '',
              type: '',
              startDate: '',
              endDate: '',
              hours: '',
              contact: '',
              phone: '',
              remark: ''
            }
            this.leaveday_start = ''
            this.leavetime_start = ''
            this.leaveday_end = ''
            this.leavetime_end = ''
            break
          case 7:
            // 用车
            this.$refs['carForm'].resetFields()
            this.carForm = {
              processTypeId: '',
              title: '',
              type: '',
              useDate: '',
              isDriver: '',
              busNum: '',
              remark: ''
            }
            break
          case 8:
            // title = '物品领用添加成功！'
            this.$refs['receiveForm'].resetFields()
            this.receiveForm = {
              processTypeId: '',
              title: '',
              type: '',
              receiveDate: '',
              remark: ''
            }
            break
          case 9:
            // title = '采购申请申请单添加成功！'
            this.$refs['procurementapplyForm'].resetFields()
            this.procurementapplyForm = {
              processTypeId: '',
              title: '',
              items: '',
              remark: ''
            }
            this.procurementList = []
            break
          case 10:
            this.$refs['salesLeaveForm'].resetFields()
            this.salesLeaveForm = {
              processTypeId: '',
              leaveId: '',
              startDate: '',
              endDate: '',
              hours: '',
              remark: ''
            }
            this.leaveday_start = ''
            this.leavetime_start = ''
            this.leaveday_end = ''
            this.leavetime_end = ''
            break
        }
      } else {
        this.getList()
      }
      this.filesArr = []
      this.submitting = false
      this.opinion = ''
      this.fileList = []
      // this.modelShow = false
    },
    closeModel() {
      if (this.divType == 'new' || this.divType == 'edit') {
        console.log('重置表单')
        switch (parseInt(this.modelType)) {
          case 1:
            // title = '采购添加成功！'
            this.$refs['procurementForm'].resetFields()
            this.procurementForm = {
              processTypeId: '',
              title: '',
              items: [{
                proName: '',
                proPrice: '',
                proNum: '',
                proAmount: 0.0
              },
              {
                proName: '',
                proPrice: '',
                proNum: '',
                proAmount: 0.0
              }
              ],
              orderNo: '',
              supplierID: '',
              other: 0,
              amount: 0,
              files: '',
              remark: ''
            }
            break
          case 2:
            // title = '拜访添加成功！'
            this.$refs['visitForm'].resetFields()
            this.visitForm = {
              processTypeId: '',
              title: '',
              customer: '',
              contact: '',
              destination: '',
              accompany: '',
              startDate: '',
              endDate: '',
              remark: ''
            }
            this.accompanyList = []
            break
          case 3:
            // 用章
            this.$refs['sealForm'].resetFields()
            this.sealForm = {
              processTypeId: '',
              title: '',
              subject: '',
              type: '',
              useDate: '',
              remark: ''
            }
            break
          case 4:
            // title = '报销申请添加成功！'
            this.$refs['refundForm'].resetFields()
            this.refundForm = {
              processTypeId: '',
              title: '',
              items: '',
              files: '',
              amount: 0,
              name: '',
              bank: '',
              card: '',
              remark: ''
            }
            this.refundList = [
              { proName: '', proPrice: 0.00, proNum: 1, remark: '', file: '', refundFilesArr: [] }
            ]
            break
          case 5:
            // title = '加班申请添加成功！'
            this.$refs['overtimeForm'].resetFields()
            this.overtimeForm = {
              processTypeId: '',
              title: '',
              type: '1',
              startDate: '',
              endDate: '',
              hours: '',
              remark: ''
            }
            this.overday_start = ''
            this.overtime_start = ''
            this.overday_end = ''
            this.overtime_end = ''
            break
          case 6:
            // title = '请假条添加成功！'
            this.$refs['leaveForm'].resetFields()
            this.leaveForm = {
              processTypeId: '',
              title: '',
              type: '',
              startDate: '',
              endDate: '',
              hours: '',
              contact: '',
              phone: '',
              remark: ''
            }
            this.leaveday_start = ''
            this.leavetime_start = ''
            this.leaveday_end = ''
            this.leavetime_end = ''
            break
          case 7:
            // 用车
            this.$refs['carForm'].resetFields()
            this.carForm = {
              processTypeId: '',
              title: '',
              type: '',
              useDate: '',
              isDriver: '',
              busNum: '',
              remark: ''
            }
            break
          case 8:
            // title = '物品领用添加成功！'
            this.$refs['receiveForm'].resetFields()
            this.receiveForm = {
              processTypeId: '',
              title: '',
              type: '',
              receiveDate: '',
              remark: ''
            }
            break
          case 9:
            // title = '采购申请申请单添加成功！'
            this.$refs['procurementapplyForm'].resetFields()
            this.procurementapplyForm = {
              processTypeId: '',
              title: '',
              items: '',
              remark: ''
            }
            this.procurementList = []
            break
          case 10:
            this.$refs['salesLeaveForm'].resetFields()
            this.salesLeaveForm = {
              processTypeId: '',
              leaveId: '',
              startDate: '',
              endDate: '',
              hours: '',
              remark: ''
            }
            this.leaveday_start = ''
            this.leavetime_start = ''
            this.leaveday_end = ''
            this.leavetime_end = ''
            break
        }
      }
      this.filesArr = []
    }
  }
}

</script>
<style lang="less" scoped>
  .approval_page_bg {
    background: #fff;
    height: calc(100vh - 84px);

    .approval_body {
      padding: 20px 16px;
      height: calc(100vh - 132px);
      overflow-y: scroll
    }
  }

  .dialogModel {
    .short_scroll {
      height: 480px;
    }

    .small_scroll {
      height: 360px;
    }

    .new_form {
      height: 600px;
      overflow: scroll;
      overflow-x: hidden;
    }

    .view_info {
      height: 650px;
      overflow: scroll;
      overflow-x: hidden;
      padding: 10px 15px;
      position: relative;

      .status_icon {
        position: absolute;
        font-size: 120px;
        right: 100px;
        top: 90px;
      }

      .view_user {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e0e0e0;
        // margin: -30px 0;
        padding: 20px 10px;

        .view_user_img {
          width: 100px;
          height: 100px;
          margin: 0 10px;

          img {
            border-radius: 50%;
            width: 100%;
            height: 100%;
          }
        }

        .view_user_info {
          margin-left: 20px;

          h2 {
            font-size: 20px;
            color: #434343;
          }

          p {
            font-size: 14px;
          }

          .blue {
            color: rgba(51, 153, 255, 0.6);
          }

          .green {
            color: rgba(0, 153, 51, 0.6);
          }

          .red {
            color: rgba(255, 51, 102, 0.6);
          }
        }
      }

      .view_detail {
        margin: 20px 0;
        padding-bottom: 20px;
        border-bottom: 1px solid #e0e0e0;

        ul {
          list-style: none;
          padding: 0;
          padding-left: 20px;
          margin: 0;
          margin-top: 10px;

          li {
            padding: 5px 0;
            display: flex;

            .left_title {
              width: 100px;
            }
          }
        }
      }

      .view_steps {
        padding: 0 20px;

        .view_steps_block {
          border-left: 1px solid #e0e0e0;
          position: relative;
          min-height: 70px;

          .radio_status {
            width: 20px;
            height: 20px;
            background: #e4e4e4;
            border-radius: 50%;
            position: absolute;
            top: 0;
            left: 0;
            transform: translateX(-50%);
          }

          .green {
            background: #33cc66;
          }

          p {
            overflow: hidden;
            margin: 0;
            padding-bottom: 10px;

            .blue {
              color: #3399ff;
            }

            .red {
              color: rgba(255, 51, 102, 0.6);
            }

            span {
              font-size: 12px;
              color: #333333;
            }

            span:first-child {
              padding-left: 30px;
              padding-right: 10px;
            }

            span:last-child {
              float: right;
            }

            .view_remark {
              color: #868686;
              font-size: 14px;
              float: left;
              display: block;
            }
          }
        }

        .view_steps_block:last-child {
          border-left: none;
        }
      }
    }

    .modelForm {
      margin: 0 10px;

      .checkDep {
        position: relative;

        .red_star {
          position: absolute;
          left: -76px;
          font-size: 13px;
          font-family: "Arial Normal", "Arial";
          color: #f56c6c;
        }
      }

      .radio_list {
        .el-radio+.el-radio {
          margin-left: 0;
        }

        .el-radio {
          margin-right: 30px;
          width: 60px;
        }
      }

      .fifter_down {
        position: relative;

        .chose_dep {
          background: transparent;
          // border-color: #c0c4cc;
          // border-radius: 4px;
          // border: 1px solid #dcdfe6;
          // height: 36px;
          // line-height: 36px;
          // display: flex;
          // align-items: center;
          // justify-content: space-between;
          // padding: 0 10px;
        }

        .tag_list {
          position: absolute;
          top: 0;
          left: 5px;
          width: 310px;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          height: 36px;
          line-height: 36px;

          span {
            margin-right: 5px;
          }
        }
      }

      .scroll_tree {
        .fifter_input {
          width: 400px;
          padding-top: 5px;
          padding-left: 5px;
          padding-bottom: 5px;
        }
      }

      .order_proList {
        padding: 10px 0;
        display: flex;
        align-items: center;

        .view_right {
          margin-right: 5px;
        }

        i {
          color: #999;
          font-size: 26px;
          margin: 0 5px;
        }

        .red {
          color: #ff2f2f;
        }

        .upload-demo {
          display: flex;
          align-items: center;
        }

        .el-upload-list__item:first-child {
          margin-top: 0 !important;
        }
      }
    }

    .view_approval {
      .view_line {
        overflow: hidden;
        padding: 10px 0;

        span {
          font-family: "微软雅黑 Regular", "微软雅黑";
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          float: left;
          width: 460px;
        }

        .line_title {
          font-weight: 400;
          color: #666666;
          width: 80px;
        }

        .first_line {
          font-weight: 700;
          font-size: 16px;
          color: #999999;
        }

        .second_line {
          color: #000000;
        }

        .small_font {
          font-size: 12px;
        }
      }
    }

    .approval_form {
      margin: 0 15px;

      h1 {
        text-align: center;
        margin: 0;
        margin-bottom: 20px;
      }

      .car_view {
        .view_tips {
          display: flex;
          justify-content: space-between;

          span {
            font-family: "微软雅黑 Bold", "微软雅黑";
            font-size: 14px;
            font-weight: 700;
          }
        }

        .view_table {
          border-collapse: collapse;
          margin: 0 auto;
          width: 100%;

          td {
            border: 1px solid #333333;
            padding: 10px 5px;
            text-align: center;

            a {
              color: #409eff;
              text-decoration: underline;
            }
          }

          .td_title {
            color: #333333;
            font-size: 13px;
            font-weight: 700;
            width: 200px;
            text-align: center;
          }

        }

        .view_step {
          margin: 10px 0;
        }

        .view_comments {
          display: flex;
          align-items: center;
          margin: 10px 0;

          span {
            width: 100px;
          }
        }

        .view_btn {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: 30px;
        }
      }
    }

    .form_btn {
      text-align: right;
      padding-top: 20px;
    }

    .center {
      margin: 0 70px;
    }

    .conversionHistory {
      .his_list {
        list-style: none;
      }
    }
  }

</style>
