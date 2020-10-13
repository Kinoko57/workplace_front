<template>
  <div>
    <div class="welfare_bg">
      <div class="fifter">
        <my-tabs :page-name="page_name" :module-name="module_name" :add="btnPermission('quality_create')"
          :other="btnPermission('qualitylevel_browse')" :other-text="'质量件类型'" :active-name="searchInfo.mode"
          :tabs-list="typeList" @actionClick="goComplaintSet" @addAction="addComplaint" @handleClick="choseType"
          @searchShow="searchShowAction($event)" @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)" @filterQuery="filterQueryAction($event)" />
      </div>
      <div class="welfare_info">
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个记录</span>
          </div>
        </div>
        <el-table v-loading="loading" ref="table" :data="tableData" :max-height="tableHeight" border row-key="id"
          tooltip-effect="light" @sort-change="fifterTable">
          <el-table-column label="质量件类型" prop="processName">
            <template slot-scope="scope">
              <span>{{ scope.row.processName }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="complainNumber" label="质量件编号" min-width="100" show-overflow-tooltip /> -->
          <el-table-column prop="sourceName" label="质量件主题" min-width="150" show-overflow-tooltip />
          <el-table-column prop="organizeName" label="提交人部门" min-width="150" show-overflow-tooltip />
          <el-table-column prop="accountName" label="提交人（职位）" min-width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.accountName }}({{ scope.row.groupName }})</span>
            </template>
          </el-table-column>
          <el-table-column prop="auditDate" label="审批时间" min-width="140" />
          <el-table-column prop="status" label="审批状态" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==0">待审批</el-tag>
              <el-tag v-if="scope.row.status==1">审批中</el-tag>
              <el-tag v-if="scope.row.status==2" type="danger">驳回</el-tag>
              <el-tag v-if="scope.row.status==4" type="success">通过</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="dealDate" label="处理时间" min-width="140" />
          <el-table-column prop="dealstatus" label="处理状态" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.dealstatus==0" type="warning">未开始</el-tag>
              <el-tag v-if="scope.row.dealstatus==1">待处理</el-tag>
              <el-tag v-if="scope.row.dealstatus==2" type="success">已处理</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="200" align="center" fixed="right">
            <template slot-scope="scope">
              <!-- @click="showModel(scope.row,'view')" -->
              <el-button type="text" size="small" @click="viewDetail(scope.row)">查看</el-button>
              <el-button v-if="searchInfo.mode=='waitdeal'" :disabled="scope.row.lowerstatus!=1" type="text"
                size="small" @click="viewDetail(scope.row)">分配</el-button>
              <el-button v-if="searchInfo.mode=='waitdeal'" type="text" size="small" @click="viewDetail(scope.row)">处理
              </el-button>
              <el-button v-if="(searchInfo.mode=='finishdeal')" type="text" size="small" @click="viewDetail(scope.row)">
                回访</el-button>
              <el-button v-if="searchInfo.mode=='waitdeal'||searchInfo.mode=='finishdeal'" type="text" size="small"
                @click="changeStates(scope.row,'reject')">强制驳回</el-button>
              <el-button v-if="searchInfo.mode=='founding'&&btnPermission('quality_edit')"
                :disabled="scope.row.status!=0&&scope.row.status!=2" type="text" size="small"
                @click="editModel(scope.row)">编辑</el-button>
              <el-button v-if="searchInfo.mode=='wait'" type="text" size="small"
                @click="showModel(scope.row,'approval')">审批</el-button>
              <el-button v-if="searchInfo.mode=='founding'" :disabled="scope.row.status!=0&&scope.row.status!=2"
                type="text" size="small" @click="changeStates(scope.row, 'ban')">作废</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="info_page">
          <el-pagination :current-page="searchInfo.pageID" :page-sizes="[5, 10, 50, 100]"
            :page-size="searchInfo.recPerPage" :total="total" layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle"
      :width="modelWidth" :class="{'overflow_form':modelType=='detail'}" class="dialogModel" @close="resetModel">
      <div>
        <div v-show="depTree" class="model_layer" @click="depTree=false" />
        <el-scrollbar v-show="(modelType=='new'||modelType=='edit')&&modelShow" class="fixed_scroll over_scroll">
          <!-- 新建/编辑质量件 -->
          <el-form v-show="(modelType=='new'||modelType=='edit')&&modelShow" ref="complaintForm" :model="complaintForm"
            :rules="rules" class="modelForm" label-width="138px" label-position="right">
            <el-form-item label="投诉标题：" prop="title">
              <el-input v-model.trim="complaintForm.title" style="width:500px" placeholder="请输入质量件标题" />
            </el-form-item>
            <el-form-item label="质量件类型：" prop="leaveId">
              <el-select v-model="complaintForm.leaveId" :disabled="modelType=='edit'" style="width:500px"
                placeholder="请选择质量件类型">
                <el-option v-for="item in comTypeList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="质量件商品名称：" prop="goods_name">
              <el-input v-model.trim="complaintForm.goods_name" style="width:500px" placeholder="请输入质量件商品名称" />
            </el-form-item>
            <el-form-item label="质量件商品数量：">
              <el-input-number v-model="complaintForm.goods_num" :precision="0" :min="0" size="large" />
              <!-- <el-input
                v-model.trim="complaintForm.complainToUserBelongTeam"
                style="width:500px"
                placeholder="请输入质量件商品数量" /> -->
            </el-form-item>
            <el-form-item label="联系人：">
              <el-input v-model.trim="complaintForm.contact_man" style="width:500px" placeholder="请输入联系人姓名" />
            </el-form-item>
            <el-form-item label="联系人电话：" prop="contact_phone">
              <el-input v-model.trim="complaintForm.contact_phone" style="width:500px" placeholder="请输入联系人电话" />
            </el-form-item>
            <el-form-item label="联系人省市区：">
              <el-cascader ref="areasName" :options="areaList" v-model.trim="complaintForm.contact_area"
                style="width:500px" placeholder="请选择省市区" @change="getAreasValue" />
            </el-form-item>
            <el-form-item label="联系人详细地址：">
              <el-input :rows="4" v-model.trim="complaintForm.contact_address" type="textarea" style="width:500px"
                placeholder="请输入详细地址，最大长度为120个字" />
            </el-form-item>
            <el-form-item label="登记人：" prop="registrant">
              <el-input v-model.trim="complaintForm.registrant" style="width:500px" placeholder="请输入登记人" />
            </el-form-item>
            <el-form-item label="登记时间：">
              <el-date-picker v-model.trim="complaintForm.registrantDate" :default-time="false" type="datetime"
                placeholder="选择日期时间" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" style="width:500px" />
            </el-form-item>
            <el-form-item label="投诉人姓名：" prop="complainUserName">
              <el-input v-model.trim="complaintForm.complainUserName" style="width:500px" placeholder="请输入投诉人姓名" />
            </el-form-item>
            <el-form-item label="投诉人电话：" prop="complainUserPhone">
              <el-input v-model.trim="complaintForm.complainUserPhone" style="width:500px" placeholder="请输入投诉人电话" />
            </el-form-item>
            <el-form-item label="投诉人微信号：" prop="complainUserWx">
              <el-input v-model.trim="complaintForm.complainUserWx" style="width:500px" placeholder="请输入投诉人微信号" />
            </el-form-item>
            <el-form-item label="投诉人客服号：" prop="complainService">
              <el-input v-model.trim="complaintForm.complainService" style="width:500px" placeholder="请输入投诉人客服号" />
            </el-form-item>
            <el-form-item label="被投诉人姓名：" prop="complainToUserName">
              <el-input v-model.trim="complaintForm.complainToUserName" style="width:500px" placeholder="请输入被投诉人姓名" />
            </el-form-item>
            <el-form-item label="被投诉人电话：" prop="complainToUserPhone">
              <el-input v-model.trim="complaintForm.complainToUserPhone" style="width:500px" placeholder="请输入被投诉人电话" />
            </el-form-item>
            <el-form-item label="被投诉人微信号：" prop="complainToUserWx">
              <el-input v-model.trim="complaintForm.complainToUserWx" style="width:500px" placeholder="请输入被投诉人微信号" />
            </el-form-item>
            <el-form-item label="被投诉人客服号：" prop="complainToService">
              <el-input v-model.trim="complaintForm.complainToService" style="width:500px" placeholder="请输入被投诉人客服号" />
            </el-form-item>
            <el-form-item label="被投诉人所在团队：" prop="complainToUserBelongTeam">
              <el-input v-model="complaintForm.complainToUserBelongTeam" style="width:500px"
                placeholder="请输入被投诉人所在团队" />
            </el-form-item>
            <el-form-item label="投诉原因：" prop="complainReason">
              <el-input v-model.trim="complaintForm.complainReason" :rows="3" type="textarea" style="width:500px"
                placeholder="请输入投诉原因，最大长度为120个字" />
            </el-form-item>
            <el-form-item label="投诉内容：" prop="content">
              <el-input v-model.trim="complaintForm.content" :rows="3" type="textarea" style="width:500px"
                placeholder="请输入投诉内容，最大长度为120个字" />
            </el-form-item>
            <el-form-item label="附件：">
              <el-upload ref="upload" :on-preview="handlePreview" :on-exceed="handleExceed"
                :before-upload="beforeUpload" :on-remove="handleRemove" :on-success="handleSuccess" :name="'files'"
                :file-list="fileList" :action="uploadUrl" class="upload-demo" multiple>
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">请上传压缩包、word文档、excel文档、ppt演示文稿、pdf文档、图片文件</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-scrollbar>
        <el-scrollbar v-show="modelType=='view'||modelType=='approval'" class="fixed_scroll over_scroll">
          <!-- 查看、审批质量件 -->
          <div v-show="modelType=='view'||modelType=='approval'" class="view_welfare">
            <div class="approval_form" style="padding-top: 20px;">
              <!-- <h1>质量件审批</h1> -->
              <p class="form_title text_left">质量件审批</p>
              <table class="view_dialog" cellpadding="0" cellspacing="0">
                <tr class="view_line">
                  <td class="line_title border_left">质量件主题</td>
                  <td class="second_line">{{ viewForm.title }}</td>
                  <td class="line_title border_left">提交人</td>
                  <td class="second_line">{{ viewForm.accountName }}</td>
                </tr>
                <tr class="view_line">
                  <td class="line_title border_left">提交人部门</td>
                  <td class="second_line">{{ viewForm.organize_name }}</td>
                  <td class="line_title border_left">提交人岗位</td>
                  <td class="second_line">{{ viewForm.groupName }}</td>
                </tr>
                <tr class="view_line">
                  <td class="line_title border_left">登记人</td>
                  <td class="second_line">
                    <span
                      :class="{null_data_style:nullStyle(viewForm.registrant)}">{{ viewForm.registrant|textNull }}</span>
                  </td>
                  <td class="line_title border_left">登记日期</td>
                  <td class="second_line">
                    <span
                      v-if="viewForm.registrantDate!='0000-00-00 00:00:00'&&viewForm.registrantDate!=''">{{ viewForm.registrantDate }}</span>
                    <span v-else style="color:#999">暂无数据</span>
                  </td>
                </tr>
                <tr class="view_line">
                  <td class="line_title border_left">商品名称：</td>
                  <td class="second_line">
                    <span
                      :class="{null_data_style:nullStyle(viewForm.goods_name)}">{{ viewForm.goods_name|textNull }}</span>
                  </td>
                  <td class="line_title border_left">商品数量：</td>
                  <td class="second_line">
                    <span
                      :class="{null_data_style:nullStyle(viewForm.goods_num)}">{{ viewForm.goods_num|textNull }}</span>
                  </td>
                </tr>
                <tr class="view_line">
                  <td class="line_title border_left">联系人：</td>
                  <td class="second_line">
                    <span
                      :class="{null_data_style:nullStyle(viewForm.contact_man)}">{{ viewForm.contact_man|textNull }}</span>
                  </td>
                  <td class="line_title border_left">联系电话：</td>
                  <td class="second_line">
                    <span
                      :class="{null_data_style:nullStyle(viewForm.contact_phone)}">{{ viewForm.contact_phone|textNull }}</span>
                  </td>
                </tr>
                <tr class="view_line">
                  <td class="line_title border_left">联系地区：</td>
                  <td class="second_line">
                    <span
                      :class="{null_data_style:nullStyle(viewForm.areasName)}">{{ viewForm.areasName|textNull }}</span>
                  </td>
                  <td class="line_title border_left">联系地址：</td>
                  <td class="second_line">
                    <span
                      :class="{null_data_style:nullStyle(viewForm.contact_address)}">{{ viewForm.contact_address|textNull }}</span>
                  </td>
                </tr>
                <tr class="view_line">
                  <td class="line_title border_left">投诉人姓名</td>
                  <td class="second_line">
                    <span
                      :class="{null_data_style:nullStyle(viewForm.complainUserName)}">{{ viewForm.complainUserName|textNull }}</span>
                  </td>
                  <td class="line_title border_left">投诉人电话</td>
                  <td class="second_line">
                    <span
                      :class="{null_data_style:nullStyle(viewForm.complainUserPhone)}">{{ viewForm.complainUserPhone|textNull }}</span>
                  </td>
                </tr>
                <tr class="view_line">
                  <td class="line_title border_left">投诉人微信</td>
                  <td class="second_line">
                    <span
                      :class="{null_data_style:nullStyle(viewForm.complainUserWx)}">{{ viewForm.complainUserWx|textNull }}</span>
                  </td>
                  <td class="line_title border_left">投诉人客服号</td>
                  <td class="second_line">
                    <span
                      :class="{null_data_style:nullStyle(viewForm.complainService)}">{{ viewForm.complainService|textNull }}</span>
                  </td>
                </tr>
                <tr class="view_line">
                  <td class="line_title border_left">被投诉人姓名</td>
                  <td class="second_line">
                    <span
                      :class="{null_data_style:nullStyle(viewForm.complainToUserName)}">{{ viewForm.complainToUserName|textNull }}</span>
                  </td>
                  <td class="line_title border_left">被投诉人电话</td>
                  <td class="second_line">
                    <span
                      :class="{null_data_style:nullStyle(viewForm.complainToUserPhone)}">{{ viewForm.complainToUserPhone|textNull }}</span>
                  </td>
                </tr>
                <tr class="view_line">
                  <td class="line_title border_left">被投诉人微信</td>
                  <td class="second_line">
                    <span
                      :class="{null_data_style:nullStyle(viewForm.complainToUserWx)}">{{ viewForm.complainToUserWx|textNull }}</span>
                  </td>
                  <td class="line_title border_left">被投诉人客服号</td>
                  <td class="second_line">
                    <span
                      :class="{null_data_style:nullStyle(viewForm.complainToService)}">{{ viewForm.complainToService|textNull }}</span>
                  </td>
                </tr>
                <tr class="view_line">
                  <td class="line_title border_left">被投诉人团队</td>
                  <td class="second_line">
                    <span
                      :class="{null_data_style:nullStyle(viewForm.complainToUserBelongTeam)}">{{ viewForm.complainToUserBelongTeam|textNull }}</span>
                  </td>
                  <td class="line_title border_left">投诉原因</td>
                  <td class="second_line">
                    <span
                      :class="{null_data_style:nullStyle(viewForm.complainReason)}">{{ viewForm.complainReason|textNull }}</span>

                  </td>
                </tr>
                <tr rowspan="2" class="view_line">
                  <td class="line_title border_left">投诉内容</td>
                  <td colspan="3" class="second_line">
                    <span :class="{null_data_style:nullStyle(viewForm.content)}">{{ viewForm.content|textNull }}</span>
                  </td>
                </tr>
                <tr />
                <tr rowspan="2" class="view_line">
                  <td class="line_title border_left">附件</td>
                  <td colspan="3" class="second_line">
                    <div v-for="(item,index) in viewForm.file" :key="index">
                      <a v-show="viewForm.file!=''&&item.type!=undefined&&item.type=='file'"
                        :href="viewForm.url + item.url" download=""
                        style="display:block;font-size: 12px;max-width: 450px;width: auto;"
                        target="_blank">{{ item.name }}</a>
                      <span v-show="viewForm.file!=''&&item.type!=undefined&&item.type=='img'"
                        style="color: #409eff;text-decoration: underline;cursor: pointer;font-size: 12px;max-width: 450px;width: auto;"
                        title="点击查看大图" @click="showBigImg(item.num)">{{ item.name }}</span>
                    </div>
                  </td>
                </tr>
                <tr />
              </table>
              <div class="car_view">
                <approval-step :step-list="carStep" />
              </div>
              <div v-if="divType=='approval'" class="view_comments" style="align-items:flex-start;">
                <span><i class="red_star">*</i>审批意见：</span>
                <el-input v-model="content" :rows="4" type="textarea" placeholder="请填写审批意见" style="width:700px" />
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div v-if="divType=='approval'" slot="footer" class="view_btn dialog-footer">
        <el-button type="primary" @click="passModel(showId)">通过</el-button>
        <el-button type="danger" @click="rejectedModel(showId)">驳回</el-button>
      </div>
      <div v-if="divType=='view'" slot="footer" class="view_btn dialog-footer">
        <el-button type="primary" @click="resetModel">确定</el-button>
      </div>
      <div v-if="modelType=='new' || modelType=='edit'" slot="footer" class="dialog-footer">
        <el-button v-show="modelType=='new'" @click="resetForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">{{ sureBtn }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="imgShow" title="查看图片">
      <!--  viewForm.url-->
      <div class="show_img_bg" style="height:68vh">
        <!-- <span class="btn_left">
          <i class="el-icon-back"/>
        </span> -->
        <el-carousel :autoplay="false" :loop="false" :initial-index="showIndex" indicator-position="none"
          style="height:68vh">
          <el-carousel-item v-for="(item,index) in imgList" :key="index" style="height:68vh;text-align: center;">
            <!-- width="100%" -->
            <div style="margin-bottom: 10px;">第{{ index+1 }}张</div>
            <img :src="imgUrl + item.url" alt="" style="cursor: pointer;max-width: 100%;max-height:52vh"
              title="图片显示不完整？点击查看完整图片" @click="openUrl(imgUrl + item.url)">
          </el-carousel-item>
        </el-carousel>
        <!-- <span class="btn_right">
          <i class="el-icon-right"/>
        </span> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // import {
  //   // getComplaintInfo,
  //   banComplaint,
  //   saveComplaint,
  //   getComplaintDetail,
  //   allocationComplaint,
  //   rejectComplaint,
  //   updateComplaint,
  //   appointSelect,
  //   appointName
  // } from '@/api/office'
  import {
    getComplaintInfo,
    getComplaintType,
    viewComplaintInfoDetail,
    saveComplaintInfoDetail,
    updateComplaintInfoDetail,
    banComplaintInfo,
    rejectedComplaintInfo,
    rejectedAllComplaint,
    passComplaintInfo
    // saveComplaint,
    // getComplaintDetail,
    // allocationComplaint,
    // rejectComplaint,
    // updateComplaint,
    // appointSelect,
    // appointName
  } from '@/api/quality'
  import {
    getAreaList
  } from '@/api/public'
  import {
    // eslint-disable-next-line no-unused-vars
    btnPermission
  } from '@/permission.js' // 按钮权限和页面权限
  // import axios from 'axios'
  export default {
    name: 'QualityComplaintManage',
    data() {
      return {
        imgUrl: '',
        page_name: 'quaworkflow',
        module_name: 'oa',
        choseTotal: 0,
        submitting: false,
        typeList: [],
        imgList: [],
        uploadUrl: '',
        tableData: [],
        loading: true,
        showIndex: 0,
        modelWidth: '600px',
        modelType: '',
        divType: 'new',
        group_type: '',
        modelTitle: '',
        modelShow: false,
        sureBtn: '确 定',
        imgShow: false,
        complaintForm: {
          title: '',
          leaveId: '',
          content: '',
          file: '',
          goods_name: '',
          goods_num: '',
          contact_man: '',
          contact_phone: '',
          contact_area: '',
          contact_address: '',
          registrant: '',
          registrantDate: '',
          complainUserName: '',
          complainUserPhone: '',
          complainUserWx: '',
          complainService: '',
          complainToUserName: '',
          complainToUserWx: '',
          complainToUserPhone: '',
          complainToService: '',
          complainToUserBelongTeam: '',
          complainReason: ''
        },
        filesArr: [],
        comTypeList: [],
        showId: '',
        viewForm: {
          url: '',
          file: [{
            name: '',
            url: '',
            type: 'file'
          }]
        },
        carStep: [], // 步骤条
        activeStep: 0,
        appointForm: {
          salesId: ''
        },
        appointList: [],
        appointId: 0,
        historyList: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        },
        organize_id: '',
        depList: [],
        depTree: false,
        depText: '',
        depName: '',
        depId: '',
        fileList: [],
        files: [],
        content: '',
        opinion: '',
        resultType: 1,
        tableHeight: 250,
        rules: {
          title: [{
            required: true,
            message: '质量件标题不能为空',
            trigger: 'blur'
          }, {
            min: 2,
            max: 20,
            message: '标题长度在2-20位之间',
            trigger: 'blur'
          }],
          leaveId: [{
            required: true,
            message: '质量件类型不能为空',
            trigger: 'change'
          }],
          content: [{
            required: true,
            message: '投诉内容不能为空',
            trigger: 'change'
          }, {
            min: 1,
            max: 120,
            message: '投诉内容长度超出范围1-120位之间',
            trigger: 'blur'
          }],
          registrant: [{
            min: 2,
            max: 20,
            message: '长度在2-20位之间',
            trigger: 'blur'
          }],
          complainUserName: [{
            min: 2,
            max: 20,
            message: '长度在2-20位之间',
            trigger: 'blur'
          }],
          complainToUserName: [{
            min: 2,
            max: 20,
            message: '长度在2-20位之间',
            trigger: 'blur'
          }],
          complainUserPhone: [{
            pattern: /^(1[0-9]{10})$/,
            message: '电话格式错误',
            trigger: 'blur'
          }],
          complainToUserPhone: [{
            pattern: /^(1[0-9]{10})$/,
            message: '电话格式错误',
            trigger: 'blur'
          }],
          contact_phone: [{
            pattern: /^(1[0-9]{10})$/,
            message: '电话格式错误',
            trigger: 'blur'
          }],
          complainToUserBelongTeam: [{
            min: 2,
            max: 20,
            message: '长度在2-20位之间',
            trigger: 'blur'
          }],
          complainService: [{
            pattern: /^([-_a-zA-Z0-9]{2,8})$/,
            message: '客服号包含下划线，字母和数字,长度在2到8个字符',
            trigger: 'blur'
          }],
          complainToService: [{
            pattern: /^([-_a-zA-Z0-9]{2,8})$/,
            message: '客服号包含下划线，字母和数字,长度在2到8个字符',
            trigger: 'blur'
          }],
          complainReason: [{
            min: 1,
            max: 120,
            message: '投诉内容长度超出范围1-120位之间',
            trigger: 'blur'
          }]
        },
        appointRules: {
          salesId: [{
            required: true,
            message: '指派人不能为空',
            trigger: 'change'
          }]
        },
        areaList: [],
        searchInfo: {
          mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
          search: '', // 搜索关键字
          orderBy: '', // 排序字段
          pageID: 1, // 第几页
          recPerPage: 10, // 每页显示条数
          recTotal: 0 // 总条数
        },
        total: 0 // 总条数
      }
    },
    watch: {
      // depText(val) {
      //   if (this.modelShow) {
      //     this.$refs.deptree.filter(val)
      //   }
      // }
    },
    created() {
      this.tableHeight = document.body.offsetHeight - 330
      if (this.btnPermission('quality_all') == false) {
        this.typeList = [{
            label: '待我审核',
            name: 'wait'
          },
          {
            label: '我已审批',
            name: 'audited'
          },
          {
            label: '待处理',
            name: 'waitdeal'
          },
          {
            label: '已处理',
            name: 'finishdeal'
          },
          {
            label: '我发起的',
            name: 'founding'
          }
        ]
        this.searchInfo.mode = 'wait'
      } else {
        this.typeList = [{
            label: '全部质量件',
            name: 'all'
          },
          {
            label: '待我审核',
            name: 'wait'
          },
          {
            label: '我已审批',
            name: 'audited'
          },
          {
            label: '待处理',
            name: 'waitdeal'
          },
          {
            label: '已处理',
            name: 'finishdeal'
          },
          {
            label: '我发起的',
            name: 'founding'
          }
        ]
      }
    },
    mounted() {
      this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
      this.imgUrl = process.env.FILE_API
      // 获取列表
      if (this.$route.query.tab == 'waitdeal') {
        this.searchInfo.mode = 'waitdeal'
      }
      this.getList()
      this.getDefault()
    },
    methods: {
      handleSelectionChange(val) {
        console.log(val)
        this.choseTotal = val.length
        if (val.length > 0) {
          console.log('本页选择了')
        } else {
          console.log('取消选择')
        }
      },
      searchShowAction(value) {
        console.log('switch改变了')
        console.log(value)
        if (value) {
          this.$nextTick(res => {
            var elementHeight = parseInt(document.getElementsByClassName('search_style')[0].clientHeight)
            this.tableHeight = document.body.offsetHeight - 330 - elementHeight
            console.log(this.tableHeight)
          })
        } else {
          this.tableHeight = document.body.offsetHeight - 360
        }
      },
      fuzzyQueryAction(value) {
        // table表格重置高度
        this.tableHeight = document.body.offsetHeight - 360
        // 模糊查询搜索
        console.log(value)
        if (value) {
          this.tableData = []
          this.searchInfo.search = 'bySearch'
          this.total = 0
          this.searchInfo.pageID = 1
          this.loading = true
          this.getList()
        }
      },
      searchQueryAction(value) {
        // 高级搜索
        console.log(value)
        if (value) {
          this.tableData = []
          this.searchInfo.search = 'bySearch'
          this.total = 0
          this.searchInfo.pageID = 1
          this.loading = true
          this.getList()
        }
      },
      filterQueryAction(value) {
        // 筛选查询
        console.log(value)
        if (value) {
          this.tableData = []
          this.searchInfo.search = 'bySearch'
          this.total = 0
          this.searchInfo.pageID = 1
          this.loading = true
          this.getList()
        }
      },
      getList() {
        const that = this
        getComplaintInfo(this.searchInfo).then(res => {
          console.log(res, '1')
          that.loading = false
          if (res.code === 200) {
            that.tableData = res.data.quaworkflows
            // that.group_type = res.data.group_type
            that.total = res.data.pager.recTotal // 总条数
            // this.organize_id = res.user.organize_id
          }
        })
      },
      showBigImg(index) {
        this.imgList = []
        for (let i = 0; i < this.viewForm.file.length; i++) {
          if (this.viewForm.file[i].type == 'img') {
            this.imgList.push(this.viewForm.file[i])
          }
        }
        this.showIndex = index
        this.imgShow = true
      },
      openUrl(item) {
        window.open(item)
      },
      getDefault() {
        const that = this
        // 获取质量件类型
        getComplaintType().then(res => {
          console.log(res)
          if (res.code === 200 || res.code === '200') {
            var arr = []
            for (const item in res.data) {
              arr.push({
                value: item,
                label: res.data[item]
              })
            }
            that.comTypeList = arr
            console.log(that.comTypeList)
          }
        })
        // 获取省市区信息
        getAreaList().then(res => {
          console.log(res)
          that.areaList = res.data
        })
      },
      getAreasValue() {
        console.log(this.$refs['areasName'].getCheckedNodes()[0].pathLabels)
        const arr = this.$refs['areasName'].getCheckedNodes()[0].pathLabels
        this.complaintForm.areasName = arr.join(',')
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
        if (event.order === 'ascending') {
          this.searchInfo.orderBy = event.prop + '_asc'
        } else if (event.order === 'descending') {
          this.searchInfo.orderBy = event.prop + '_desc'
        } else {
          this.searchInfo.orderBy = ''
        }
        this.searchInfo.pageID = 1
        this.tableData = []
        this.getList()
      },
      addComplaint() {
        this.modelWidth = '600px'
        this.modelTitle = '创建质量件'
        this.modelType = 'new'
        this.modelShow = true
        this.sureBtn = '保 存'
        this.divType = 'new'
      },
      goComplaintSet() {
        this.$router.push({
          path: '/office/qualitySet'
        })
      },
      choseType(e) {
        console.log('执行了吗')
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
      changeStates(event, type) {
        const that = this
        if (type == 'ban') {
          const msg = '质量件一旦作废不可恢复，确定要“作废”吗？'
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            banComplaintInfo(event.id).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  type: 'success',
                  message: res.data.msg
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
          }).catch(() => {
            console.log('用户点击了取消')
          })
        } else {
          const msg = '该投诉一旦成功驳回，将恢复到投诉审批初始状态，确定要“强制驳回”吗？'
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            rejectedAllComplaint(event.id).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  type: 'success',
                  message: '驳回成功'
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
          }).catch(() => {
            console.log('用户点击了取消')
          })
        }

      },
      // 查看质量件详情（跳转新页面）
      viewDetail(data) {
        this.$router.push({
          path: '/office/qualityDetail?id=' + data.id + '&type=' + this.searchInfo.mode
        })
      },
      // 审批申请单
      showModel(data, type) {
        const that = this
        this.modelWidth = '700px'
        if (type === 'approval') {
          this.modelTitle = '审核'
          this.approvalTitle = data.name
          this.divType = 'approval'
          this.modelType = 'approval'
        } else {
          this.divType = 'view'
          this.modelTitle = '查看'
          this.approvalTitle = '质量件审批单'
          this.modelType = 'view'
        }
        that.showId = data.id
        viewComplaintInfoDetail(data.id).then(res => {
          if (res.code === 200) {
            that.viewForm = {}
            that.viewForm = res.data.apply
            that.carStep = res.data.nodes
            that.carStep.unshift({
              name: '提交质量件',
              auditStatus: '2',
              auditer: that.viewForm.accountName,
              auditDate: that.viewForm.createdDate,
              auditRemark: ''
            })
            if (that.viewForm.status == 4) {
              // 通过
              that.carStep.push({
                name: '质量件完成',
                auditStatus: '2',
                auditer: '',
                auditDate: '',
                auditRemark: '',
                isend: 1
              })
            } else {
              that.carStep.push({
                name: '质量件完成',
                auditStatus: '0',
                auditer: '',
                auditDate: '',
                auditRemark: '',
                isend: 0
              })
            }
            // for (let i = 0; i < that.carStep.length; i++) {
            //   if (that.carStep[i].auditStatus === '1') {
            //     that.activeStep = i
            //     break
            //   }
            // }
            if (that.viewForm.file !== undefined && that.viewForm.file !== '' && that.viewForm.file !== 'null' &&
              that.viewForm.file !== null) {
              that.viewForm.file = JSON.parse(that.viewForm.file)
              that.viewForm.url = process.env.FILE_API
            } else {
              that.viewForm.file = [{
                url: '',
                name: '',
                type: 'file'
              }]
              that.viewForm.url = ''
            }
            let k = 0
            if (that.viewForm.file.length > 0 && that.viewForm.file[0].name != '') {
              for (let i = 0; i < that.viewForm.file.length; i++) {
                if (that.viewForm.file[i].url.indexOf('.png') === -1 && that.viewForm.file[i].url.indexOf(
                    '.jpg') === -1 && that.viewForm.file[i].url.indexOf('.bmp') === -1) {
                  // 不是图片
                  that.viewForm.file[i].type = 'file'
                } else {
                  // 是图片
                  that.viewForm.file[i].type = 'img'
                  that.viewForm.file[i].num = k++
                }
              }
            }
            console.log(that.viewForm, 'asdlasjkd')
            this.modelShow = true
          } else {
            that.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
      },
      // 编辑质量件单
      editModel(data) {
        // const that = this
        this.modelTitle = '编辑'
        console.log(data)
        this.complaintForm = {
          id: data.sourceId,
          title: data.sourceName,
          leaveId: data.processId,
          content: data.content,
          goods_name: data.goods_name,
          goods_num: data.goods_num,
          contact_man: data.contact_man,
          contact_phone: data.contact_phone,
          contact_area: [data.provinceId, data.cityId, data.areaId],
          contact_address: data.contact_address,
          file: data.fileName,
          registrant: data.registrant,
          registrantDate: data.registrantDate != '0000-00-00 00:00:00' ? data.registrantDate : '',
          complainUserName: data.complainUserName,
          complainUserPhone: data.complainUserPhone,
          complainUserWx: data.complainUserWx,
          complainService: data.complainService,
          complainToUserName: data.complainToUserName,
          complainToUserWx: data.complainToUserWx,
          complainToUserPhone: data.complainToUserPhone,
          complainToService: data.complainToService,
          complainToUserBelongTeam: data.complainToUserBelongTeam,
          complainReason: data.complainReason
        }
        this.fileList = data.fileName !== '' ? JSON.parse(data.fileName) : []
        this.filesArr = data.fileName !== '' ? JSON.parse(data.fileName) : []
        this.modelType = 'edit'
        this.divType = 'edit'
        this.modelShow = true
        this.sureBtn = '保 存'
        console.log(this.complaintForm)
      },
      passModel(id) {
        const that = this
        if (this.content === '') {
          that.$message({
            type: 'warning',
            message: '审批意见不能为空'
          })
          return
        } else if (this.content.length > 200) {
          that.$message({
            type: 'warning',
            message: '审批意见长度最多200个字'
          })
          return
        } else {
          passComplaintInfo(id, {
            remark: this.content
          }).then(res => {
            if (res.code === 200 || res.code === '200') {
              console.log(res)
              that.$message({
                message: res.data.message,
                type: 'success'
              })
              that.resetModel()
              that.loading = true
              that.getList()
            } else {
              that.$message({
                message: res.data.msg.message,
                type: 'warning'
              })
            }
          })
        }
      },
      rejectedModel(id) {
        // const postData = {
        //   'id': id,
        //   'content': this.content
        // }
        const that = this
        const msg = '确定要驳回这个质量件？'
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.content === '') {
            that.$message({
              type: 'warning',
              message: '审批意见不能为空'
            })
            return
          } else if (this.content.length > 200) {
            that.$message({
              type: 'warning',
              message: '审批意见长度最多200个字'
            })
            return
          } else {
            rejectedComplaintInfo(id, {
              remark: this.content
            }).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  type: 'success',
                  message: res.data.message
                })
                that.modelShow = false
                that.loading = true
                that.getList()
              } else {
                that.$message({
                  type: 'warning',
                  message: res.data.msg
                })
              }
            })
          }
        }).catch(() => {
          console.log('用户点击了取消')
        })
      },
      handleSuccess(res, file, fileList) {
        if (res.code === 200 || res.code === '200') {
          this.filesArr = []
          for (let i = 0; i < fileList.length; i++) {
            if (fileList[i].response === undefined) {
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
        }
      },
      handleRemove(file, fileList) {
        this.filesArr = []
        if (fileList.length > 0) {
          for (let i = 0; i < fileList.length; i++) {
            if (fileList[i].response === undefined) {
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
          this.complaintForm.file = ''
        }
        console.log(fileList)
        console.log(this.filesArr)
      },
      saveModel() {
        // debugger
        const that = this
        this.$refs['complaintForm'].validate((valid) => {
          if (valid) {
            console.log(valid)
            this.submitting = true
            if (this.filesArr.length > 0) {
              this.complaintForm.file = JSON.stringify(this.filesArr)
            }
            if (this.modelType === 'new') {
              // 新增质量件
              saveComplaintInfoDetail(this.complaintForm).then(res => {
                that.submitting = false
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '质量件添加成功！',
                    type: 'success'
                  })
                  that.resetModel()
                  that.loading = true
                  that.getList()
                } else {
                  that.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                }
              })
            } else {
              // 更新质量件
              updateComplaintInfoDetail(this.complaintForm).then(res => {
                that.submitting = false
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '质量件更新成功！',
                    type: 'success'
                  })
                  that.resetModel()
                  that.loading = true
                  that.getList()
                } else {
                  that.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                }
              })
            }
          } else {
            console.log('error submit!!')
            // this.$message.warning('信息填写不完整或者信息填写有误！')
            this.$nextTick(() => {
              this.checkFormErr()
            })
            return false
          }
        })
      },
      resetModel() {
        console.log('重置表单')
        this.$refs['complaintForm'].resetFields()
        this.complaintForm = {
          title: '',
          leaveId: '',
          content: '',
          file: '',
          goods_name: '',
          goods_num: '',
          contact_man: '',
          contact_phone: '',
          contact_area: '',
          contact_address: '',
          registrant: '',
          registrantDate: '',
          complainUserName: '',
          complainUserPhone: '',
          complainUserWx: '',
          complainService: '',
          complainToUserName: '',
          complainToUserWx: '',
          complainToUserPhone: '',
          complainToService: '',
          complainToUserBelongTeam: '',
          complainReason: ''
        }
        this.appointForm = {
          salesId: ''
        }
        this.content = ''
        this.depId = ''
        this.depName = ''
        this.depText = ''
        this.modelShow = false
        this.fileList = []
        this.filesArr = []
        this.opinion = ''
        this.viewForm = {
          files: [{
            name: '',
            url: '',
            type: 'file'
          }]
        }
      },
      resetForm() {
        console.log('重置表单')
        this.$refs['complaintForm'].resetFields()
        this.complaintForm = {
          title: '',
          leaveId: '',
          content: '',
          file: '',
          goods_name: '',
          goods_num: '',
          contact_man: '',
          contact_phone: '',
          contact_area: '',
          contact_address: '',
          registrant: '',
          registrantDate: '',
          complainUserName: '',
          complainUserPhone: '',
          complainUserWx: '',
          complainService: '',
          complainToUserName: '',
          complainToUserWx: '',
          complainToUserPhone: '',
          complainToService: '',
          complainToUserBelongTeam: '',
          complainReason: ''
        }
        this.$refs['appointForm'].resetFields()
        this.appointForm = {
          salesId: ''
        }
        this.content = ''
        this.depId = ''
        this.depName = ''
        this.depText = ''
        this.fileList = []
        this.filesArr = []
        this.opinion = ''
        this.viewForm = {
          files: [{
            name: '',
            url: '',
            type: 'file'
          }]
        }
      },
      beforeUpload(file, fileList) {
        const isLt5M = file.size / 1024 / 1024 < 5
        if (file.name.indexOf('.png') === -1 && file.name.indexOf('.jpg') === -1 && file.name.indexOf('.bmp') === -1 &&
          file.name.indexOf('.doc') === -1 && file.name.indexOf('.docx') === -1 && file.name.indexOf('.ppt') === -1 &&
          file.name.indexOf('.pdf') === -1 && file.name.indexOf('.zip') === -1 && file.name.indexOf('.rar') === -1 &&
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
      // 过滤
      filterDepNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      // 显示部门列表
      showDepTree() {
        // const that = this
        this.depTree = true
      },
      // 隐藏部门列表
      hiddenDepTree() {
        this.depTree = false
      }
      // 选择部门
      // choseDep(val) {
      //   console.log(val)
      //   this.depId = val.id
      //   this.depName = val.name
      //   this.depText = ''
      //   this.depTree = false
      // }
    }
  }

</script>
<style lang="less" scoped>
  .welfare_bg {
    position: absolute;
    width: 100%;
    top: 0;
    // .search_btn {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    // }

    .welfare_info {
      background: #fff;
      padding: 20px 10px;

      .tabs_table {
        .over_line_one {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap
        }

        .over_line_two {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }

    .welfare_page {
      text-align: center;
      padding: 10px 0;
    }
  }

  .dialogModel {
    .short_scroll {
      height: 480px;
    }

    .model_layer {
      width: 100%;
      height: calc(100% - 60px);
      background: transparent;
      position: absolute;
      left: 0;
      top: 60px;
      z-index: 100;
    }

    .modelForm {
      margin: 0 10px;

      .upload-demo {
        width: 500px;
      }

      .checkDep {
        position: relative;

        .red_star {
          position: absolute;
          left: -90px;
          font-size: 13px;
          font-family: 'Arial Normal', 'Arial';
          color: #f56c6c;
        }
      }

    }

    .view_welfare {
      .form_title {
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
        font-weight: 700;
        font-size: 14px;
        color: #666;
        margin: 0;
      }

      // 弹框里的查看
      .view_dialog {
        margin: 0 auto;
        border: 1px solid #e4e4e4;
        border-bottom: none;
        max-width: 760px;
        border-left: none;

        .view_line {

          td {
            font-family: '微软雅黑 Regular', '微软雅黑';
            font-weight: 400;
            font-size: 14px;
            color: #999999;
            width: 350px;
            border-bottom: 1px solid #e4e4e4;
            min-height: 40px;
            align-items: center;
            padding: 16px 0;
            min-width: 100px;
          }

          .line_title {
            font-weight: 400;
            color: #666666;
            width: 130px;
            text-align: right;
            background: #f9fafc;
            border-right: 1px solid #e4e4e4;
            text-align: center;
            font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
            font-weight: 700;
            font-size: 12px;
            color: #333333;
            text-align: center;
            vertical-align: middle;
          }

          .border_left {
            border-left: 1px solid #e0e0e0;
          }

          .second_line {
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            padding-left: 10px;
            line-height: 1.2;

            a {
              width: 200px;
              display: block;
              font-size: 12px;
              color: #409eff;
              text-decoration: underline;
            }
          }
        }

        .view_btn {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: 30px;
        }

        .car_info {
          border: 1px solid #e0e0e0;
          margin-top: 20px;
          padding: 14px 10px;

          .info_block {
            margin-bottom: 20px;

            p {
              font-size: 12px;
              color: #666666;
              margin: 0;
              padding-left: 135px;
              margin-top: 10px;
            }

            .blue {
              color: #3366FF;
              font-size: 14px;
              padding-left: 0;
              margin-top: 0;
            }
          }
        }

        .car_form {
          margin-top: 20px;

          .form_inline {
            display: flex;
            align-items: center;
            margin-bottom: 10px;

            .title {
              font-size: 14px;
              color: #333;
              margin-right: 6px;
            }

            .mg {
              margin-left: 6px;
            }

            .fifter_down {
              position: relative;

              .chose_dep {
                background: transparent;
                border-color: #c0c4cc;
                border-radius: 4px;
                border: 1px solid #dcdfe6;
                height: 36px;
                line-height: 36px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 10px;

                .text_placeholder {
                  color: #c0c4cc;
                }
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
          }
        }
      }

      .view_comments {
        display: flex;
        align-items: center;
        margin: 10px 0;
        padding: 0 40px;

        span {
          width: 100px;
        }
      }

      .car_view {
        padding: 0 40px;
      }
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

  .show_img_bg {
    position: relative;

    .btn_left {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 10%;
      height: 50px;
      width: 20px;
      display: block;
      background: rgba(0, 0, 0, .5);
      color: #fff;
    }

    .btn_right {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 10%;
      height: 50px;
      width: 20px;
      display: block;
      background: rgba(0, 0, 0, .5);
      color: #fff;
    }
  }

</style>
