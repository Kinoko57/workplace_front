<template>
  <div class="new_bg">
    <!-- 新增/编辑采购单 procurementForm-->
    <!-- <div class="new_form" v-if="infoType==1">
      <group class="form_item">
        <span><i class="red_star">*</i>申请单名称</span>
        <x-input placeholder="请输入申请单名称" placeholder-align="left" v-model="procurementForm.title"></x-input>
      </group>
      <group class="form_item">
        <span><i class="red_star">*</i>申请单单号</span>
        <x-input placeholder="请输入申请单单号" placeholder-align="left" v-model="procurementForm.orderNo"></x-input>
      </group>
      <group class="form_item radio_form">
        <span><i class="red_star">*</i>供应商</span>
        <popup-radio :options="supplierList" v-model="procurementForm.supplierID" placeholder="请选择供应商"
          placeholder-align="left" @on-change="showValue"></popup-radio>
      </group>
      <group class="form_item">
        <span><i class="red_star">*</i>采购明细</span>
      </group>
      <group class="form_item list_item">
        <popup-radio :options="supplierList" v-model="procurementForm.supplierID" placeholder="产品名称" placeholder-align="left"
          @on-change="showValue" style="width:1.6rem"></popup-radio>
        <x-input placeholder-align="left" style="width:0.8rem" :show-clear="false" disabled></x-input>
        <i class="normal_span">X</i>
        <x-input placeholder-align="left" style="width:0.8rem" :show-clear="false" disabled></x-input>
        <x-input placeholder="数量" placeholder-align="left" style="width:0.8rem" type="number" :show-clear="false"></x-input>
        <i class='iconfont iconguanbi'></i>
      </group>
      <group class="list_item">
        <x-button @click="addApplyInfo" mini>继续添加</x-button>
      </group>
      <group class="form_item">
        <span>陪同人</span>
        <x-input placeholder="请输入陪同人" placeholder-align="left"></x-input>
      </group>
      <group class="form_item">
        <span><i class="red_star">*</i>开始时间</span>
        <datetime format="YYYY-MM-DD HH:mm" placeholder="请选择时间"></datetime>
      </group>
      <group class="form_item">
        <span><i class="red_star">*</i>结束时间</span>
        <datetime format="YYYY-MM-DD HH:mm" placeholder="请选择时间"></datetime>
      </group>
      <group class="form_item flex_start">
        <span><i class="red_star">*</i>拜访目的</span>
        <x-textarea :max="200" name="detail" placeholder="请填写审核意见" :show-counter="false"></x-textarea>
      </group>
      <group class="form_item">
        <x-button @click="saveForm">保存</x-button>
      </group>
    </div>-->
    <!-- 新增/编辑拜访单 visitForm -->
    <div class="new_form" v-if="infoType==2" ref="container1">
      <group class="form_item radio_form">
        <span>
          审批类型<i class="red_star">*</i>
        </span>
        <popup-radio :options="processList" v-model.trim="visitForm.processTypeId" :readonly="viewType!='add'"
          :class="viewType!='add'?'input_disabled':''" placeholder="请选择类型" placeholder-align="left" required
          ref="typeid" @on-change="keyDown('process')" @on-hide="isShowErrorInfo(2,'process')"></popup-radio>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo9}}</div> -->
      <group class="form_item">
        <span>
          拜访单名称<i class="red_star">*</i>
        </span>
        <x-input placeholder="请输入拜访单名称" placeholder-align="left" class="contrlSty" v-model.trim="visitForm.title"
          ref="title" @on-change="keyDown('title')" @on-blur="isShowErrorInfo(2,'title')"></x-input>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo1}}</div> -->
      <group class="form_item">
        <span>
          客户名称<i class="red_star">*</i>
        </span>
        <x-input placeholder="请输入客户名称" placeholder-align="left" v-model.trim="visitForm.customer" ref="customer"
          @on-change="keyDown('customer')" @on-blur="isShowErrorInfo(2,'customer')"></x-input>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo2}}</div> -->
      <group class="form_item">
        <span>
          联系人<i class="red_star">*</i>
        </span>
        <x-input placeholder="请输入联系人" placeholder-align="left" v-model.trim="visitForm.contact" ref="contact"
          @on-change="keyDown('contact')" @on-blur="isShowErrorInfo(2,'contact')"></x-input>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo3}}</div> -->
      <group class="form_item">
        <span>
          目的地<i class="red_star">*</i>
        </span>
        <x-input placeholder="请输入目的地" placeholder-align="left" v-model.trim="visitForm.destination" ref="destination"
          @on-change="keyDown('destination')" @on-blur="isShowErrorInfo(2,'destination')"></x-input>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo4}}</div> -->
      <group class="form_item">
        <!-- <cell title="陪同人" :value="visitForm.accompany" is-link @click.native="showPopup=true"></cell> -->
        <span>陪同人</span>
        <!-- <cell value="请选择陪同人" is-link @click.native="showPopup=true" class="text_left"></cell> -->
        <x-input placeholder="请选择陪同人" :disabled="true" placeholder-align="left" v-model="userStr"
          @click.native="showPopup=true" title class="overflow_line_one">
          <i class="iconfont iconyoujiantou" slot="right-full-height"></i>
        </x-input>
      </group>
      <!-- <div class="errorInfo">{{showErrorInfo5}}</div> -->
      <div v-transfer-dom class="popup_bg" ref="container4">
        <popup v-model="showPopup" class="checker-popup" @on-hide="userFifter = ''">
          <div>
            <!-- @on-blur="isShowErrorInfo(2)" -->
            <!-- <div class="towButton" @click="clearInfoPol"><div class="but-l">取消</div><div class="but-r" @click="yesInfo">确认</div></div> -->
            <popup-header left-text="取消" right-text="确认" @on-click-left="concel" @on-click-right="sureUser">
            </popup-header>
            <group class="search_input">
              <x-input placeholder="请搜索陪同人" placeholder-align="left" v-model="userFifter" @on-change="updateInput">
              </x-input>
            </group>
            <div class="check_list_bg">
              <!-- <checklist label-position="left" :options="radioList" v-model="accompanyList" @on-change="choseUser"></checklist> -->
              <my-check label-position="left" :options="radioList" v-model="accompanyList" @on-change="choseUser" ref="mycheck">
              </my-check>
            </div>
          </div>
        </popup>
      </div>
      <group class="form_item">
        <span>
          开始时间<i class="red_star">*</i>
        </span>
        <datetime format="YYYY-MM-DD HH:mm" placeholder="请选择时间" v-model="visitForm.startDate" clear-text="重置"
          @on-clear="clearInfo(2,'startDate')" ref="startDate" @on-change="keyDown('startDate')"
          @on-cancel="isShowErrorInfo(2,'startDate')" @on-confirm="isShowErrorInfo(2,'startDate')"></datetime>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo6}}</div> -->
      <group class="form_item">
        <span>
          结束时间<i class="red_star">*</i>
        </span>
        <datetime format="YYYY-MM-DD HH:mm" placeholder="请选择时间" v-model="visitForm.endDate" clear-text="重置"
          @on-clear="clearInfo(2,'endDate')" ref="endDate" @on-change="keyDown('endDate')"
          @on-cancel="isShowErrorInfo(2,'endDate')" @on-confirm="isShowErrorInfo(2,'endDate')"></datetime>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo7}}</div> -->
      <group class="form_item flex_start flex_line">
        <span>
          拜访目的<i class="red_star">*</i>
        </span>
        <x-textarea :max="200" :rows="5" name="remark" placeholder="请输入拜访目的" :show-counter="false"
          v-model.trim="visitForm.remark" required ref="remark" @on-change="keyDown('remark')"
          @on-blur="isShowErrorInfo(2,'remark')"></x-textarea>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo8}}</div> -->
      <group class="form_item form_btn">
        <x-button @click.native="saveForm" class="save_btn" :disabled="disabled2">保存</x-button>
      </group>
    </div>
    <!-- 新增/编辑用章申请单sealForm -->
    <!-- <div class="new_form" v-if="infoType==3">
      <group class="form_item">
        <span><i class="red_star">*</i>申请单名称</span>
        <x-input placeholder="请输入申请单名称" placeholder-align="left" v-model="sealForm.title" required ref="title"
          @on-change="keyDown('title')" :is-type="codeValue"></x-input>
      </group>
      <group class="form_item radio_form">
        <span><i class="red_star">*</i>主体</span>
        <popup-radio :options="radioList1" v-model="sealForm.subject" placeholder="请选择主体类型" placeholder-align="left"
          @on-change="showValue"></popup-radio>
      </group>
      <group class="form_item radio_form">
        <span><i class="red_star">*</i>用章类型</span>
        <popup-radio :options="radioList" v-model="sealForm.type" placeholder="请选择用章类型" placeholder-align="left"
          @on-change="showValue"></popup-radio>
      </group>
      <group class="form_item">
        <span><i class="red_star">*</i>用章时间</span>
        <datetime format="YYYY-MM-DD HH:mm" placeholder="请选择时间" v-model="sealForm.useDate" required ref="useDate"
          @on-change="keyDown('useDate')"></datetime>
      </group>
      <group class="form_item flex_start">
        <span><i class="red_star">*</i>申请原因</span>
        <x-textarea :max="200" name="detail" placeholder="请填写审核意见" :show-counter="false" v-model="sealForm.remark" required ref="remark"
          @on-change="keyDown('remark')"></x-textarea>
      </group>
      <group class="form_item">
        <x-button @click.native="saveForm" class="save_btn" :disabled="disabled">保存</x-button>
      </group>
    </div>-->
    <!-- 新建/编辑报销申请refundForm -->
    <!-- <div class="new_form" v-if="infoType==4">
      <group class="form_item">
        <span><i class="red_star">*</i>申请单名称</span>
        <x-input placeholder="请输入申请单名称" placeholder-align="left" v-model="refundForm.title"></x-input>
      </group>
      <group class="form_item">
        <span><i class="red_star">*</i>报销明细</span>
      </group>
      <group class="form_item list_item">
        <x-input placeholder="项目名称" placeholder-align="left" style="width:1.2rem" :show-clear="false"></x-input>
        <x-input placeholder="单价" placeholder-align="left" style="width:0.8rem" type="number" :show-clear="false"></x-input>
        <i class="normal_span">X</i>
        <x-input placeholder="数量" placeholder-align="left" style="width:0.8rem" type="number" :show-clear="false"></x-input>
        <i class="normal_span">=</i>
        <i class="normal_span">0</i>
        <i class='iconfont iconguanbi'></i>
      </group>
      <group class="list_item">
        <x-button @click="addApplyInfo" mini>继续添加</x-button>
      </group>
      <group class="form_item file_form">
        <span><i class="red_star">*</i>报销凭证</span>
        <cell title="点击上传" @click.native.stop="openFile">
          <i class="fa fa-file"></i>
          <input type="file" @change="fileChange()" style="display: none" ref="file" multiple="multiple">
        </cell>
      </group>
      <group class="form_item">
        <span><i class="red_star">*</i>总费用</span>
        <x-input placeholder="请输入总费用" placeholder-align="left" v-model="refundForm.amount"></x-input>
      </group>
      <group class="form_item">
        <span><i class="red_star">*</i>开户姓名</span>
        <x-input placeholder="请输入开户姓名" placeholder-align="left" v-model="refundForm.name"></x-input>
      </group>
      <group class="form_item">
        <span><i class="red_star">*</i>开户行</span>
        <x-input placeholder="请输入开户行" placeholder-align="left" v-model="refundForm.bank"></x-input>
      </group>
      <group class="form_item">
        <span>银行卡号</span>
        <x-input placeholder="请输入银行卡号" placeholder-align="left" v-model="refundForm.card"></x-input>
      </group>
      <group class="form_item flex_start">
        <span><i class="red_star">*</i>申请原因</span>
        <x-textarea :max="200" name="detail" placeholder="请输入申请原因" :show-counter="false" v-model="refundForm.remark"></x-textarea>
      </group>
      <group class="form_item">
        <x-button @click.native="saveForm" class="save_btn">保存</x-button>
      </group>
    </div>-->
    <!-- 新建/编辑加班申请 overtimeForm -->
    <div class="new_form" v-if="infoType==5" ref="container2">
      <!-- <group class="form_item">
        <span><i class="red_star">*</i>申请单名称</span>
        <x-input placeholder="请输入申请单名称" placeholder-align="left" v-model.trim="overtimeForm.title" ref="title"
          @on-change="keyDown('title')" @on-blur="isShowErrorInfo(5,'title')" ></x-input>
      </group>-->
      <!-- <div class="errorInfo">{{obj1.showErrorInfo1}}</div> -->
      <group class="form_item radio_form">
        <span>
          审批类型<i class="red_star">*</i>
        </span>
        <popup-radio :options="processList" v-model.trim="overtimeForm.processTypeId" :readonly="viewType!='add'"
          :class="viewType!='add'?'input_disabled':''" placeholder="请选择类型" placeholder-align="left" required
          ref="typeid" @on-change="keyDown('process')" @on-hide="isShowErrorInfo(5,'process')"></popup-radio>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo9}}</div> -->
      <group class="form_item radio_form">
        <span>
          类型<i class="red_star">*</i>
        </span>
        <popup-radio :options="radioList" v-model.trim="overtimeForm.type" placeholder="请选择类型" placeholder-align="left"
          required ref="type" @on-change="keyDown('type')" @on-hide="isShowErrorInfo(5,'type')"></popup-radio>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo2}}</div> -->
      <group class="form_item">
        <span>
          开始时间<i class="red_star">*</i>
        </span>
        <datetime format="YYYY-MM-DD HH:mm" placeholder="请选择时间" v-model="overtimeForm.startDate" clear-text="重置"
          @on-clear="overtimeForm.startDate=''" ref="startDate" @on-change="keyDown('startDate')" :min-hour="0"
          :max-hour="23" :minute-list="['00', '30']" @on-cancel="isShowErrorInfo(5,'startDate')"
          @on-confirm="isShowErrorInfo(5,'startDate')"></datetime>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo3}}</div> -->
      <group class="form_item">
        <span>
          结束时间<i class="red_star">*</i>
        </span>
        <datetime format="YYYY-MM-DD HH:mm" placeholder="请选择时间" v-model="overtimeForm.endDate" clear-text="重置"
          @on-clear="overtimeForm.endDate=''" ref="endDate" @on-change="keyDown('endDate')" :min-hour="0" :max-hour="23"
          :minute-list="['00', '30']" @on-cancel="isShowErrorInfo(5,'endDate')"
          @on-confirm="isShowErrorInfo(5,'endDate')"></datetime>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo4}}</div> -->
      <group class="form_item">
        <span>
          加班时长<i class="red_star">*</i>
        </span>
        <x-input placeholder="请输入时长" placeholder-align="left" v-model.trim="overtimeForm.hours" ref="hours"
          type="number" :min="1" @on-blur="isShowErrorInfo(5,'hours')"></x-input>
        <!-- <i class="normal_span">小时</i> -->
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo8}}</div> -->
      <group class="form_item flex_start flex_line ">
        <span class="form_line">
          事由<i class="red_star">*</i>
        </span>
        <x-textarea class="form_line" :max="200" :rows="5" name="detail" placeholder="请输入申请原因" :show-counter="false"
          v-model.trim="overtimeForm.remark" required ref="remark" @on-change="keyDown('remark')"
          @on-blur="isShowErrorInfo(5,'remark')"></x-textarea>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo6}}</div> -->
      <group class="form_item form_btn">
        <x-button @click.native="saveForm" class="save_btn" :disabled="disabled2">保存</x-button>
      </group>
    </div>
    <!-- 新建/编辑请假申请 leaveForm -->
    <div class="new_form" v-if="infoType==6" ref="container3">
      <!-- <group class="form_item">
        <span><i class="red_star">*</i>申请单名称</span>
        <x-input placeholder="请输入申请单名称" placeholder-align="left" v-model.trim="leaveForm.title" ref="title"
          @on-change="keyDown('title')" @on-blur="isShowErrorInfo(6,'title')"></x-input>
      </group>-->
      <!-- <div class="errorInfo">{{obj1.showErrorInfo1}}</div> -->
      <group class="form_item radio_form">
        <span>
          审批类型<i class="red_star">*</i>
        </span>
        <popup-radio :options="processList" :readonly="viewType!='add'" :class="viewType!='add'?'input_disabled':''"
          v-model.trim="leaveForm.processTypeId" placeholder="请选择类型" placeholder-align="left" required ref="typeid"
          @on-change="keyDown('process')" @on-hide="isShowErrorInfo(6,'process')"></popup-radio>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo1}}</div> -->
      <group class="form_item radio_form">
        <span>
          类型<i class="red_star">*</i>
        </span>
        <popup-radio class="scroll_leave_list" :options="radioList" v-model.trim="leaveForm.type" placeholder="请选择类型"
          placeholder-align="left" @on-change="showValue" @on-hide="isShowErrorInfo(6,'type')"></popup-radio>
      </group>
      <div v-if="leaveForm.type=='3'" class="errorInfo" style="color:#3e8afd">剩余{{ temporaryTime }}小时可调休</div>
      <!-- <div class="errorInfo" v-if="leaveForm.type!='3'">{{obj1.showErrorInfo2}}</div> -->
      <group class="form_item">
        <span>
          开始时间<i class="red_star">*</i>
        </span>
        <datetime format="YYYY-MM-DD HH:mm" placeholder="请选择时间" v-model="leaveForm.startDate" clear-text="重置"
          @on-clear="leaveForm.startDate=''" ref="startDate" @on-change="keyDownLeaveStart('startDate')"
          :min-hour="timeConfig.start" :max-hour="timeConfig.end" :minute-list="['00', '30']"
          @on-cancel="isShowErrorInfo(6,'startDate')" @on-confirm="isShowErrorInfo(6,'startDate')"></datetime>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo3}}</div> -->
      <group class="form_item">
        <span>
          结束时间<i class="red_star">*</i>
        </span>
        <datetime format="YYYY-MM-DD HH:mm" placeholder="请选择时间" v-model="leaveForm.endDate" clear-text="重置"
          @on-clear="leaveForm.endDate=''" ref="endDate" @on-change="keyDownLeave('endDate')"
          :min-hour="timeConfig.start" :max-hour="timeConfig.end" :minute-list="['00', '30']"
          @on-cancel="isShowErrorInfo(6,'endDate')" @on-confirm="isShowErrorInfo(6,'endDate')"></datetime>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo4}}</div> -->
      <group class="form_item">
        <span>
          请假时长<i class="red_star">*</i>
        </span>
        <!-- <x-input placeholder="时长" placeholder-align="left" v-model="leaveForm.hours" style="width:1rem" required ref="hours"
        @on-change="keyDown('hours')" type="number" :min="1" @on-hide="isShowErrorInfo(6,'hours')"></x-input>-->
        <x-input placeholder="请输入时长" placeholder-align="left" v-model.trim="leaveForm.hours" ref="hours"
          type="number" :min="1" @on-blur="isShowErrorInfo(6,'hours')"></x-input>
        <!-- <i class="normal_span">小时</i> -->
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo9}}</div> -->
      <group class="form_item">
        <span>
          紧急联系人<i class="red_star">*</i>
        </span>
        <x-input placeholder="请输入紧急联系人" placeholder-align="left" v-model.trim="leaveForm.contact" ref="contact"
          @on-change="keyDown('contact')" @on-blur="isShowErrorInfo(6,'contact')"></x-input>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo6}}</div> -->
      <group class="form_item">
        <span>
          联系电话<i class="red_star">*</i>
        </span>
        <x-input placeholder="请输入紧急联系电话" placeholder-align="left" v-model.trim="leaveForm.phone" ref="phone"
          name="phone" @on-change="keyDown('phone')" :min="1" type="number" @on-blur="isShowErrorInfo(6,'phone')">
        </x-input>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo7}}</div> -->
      <group class="form_item flex_start flex_line ">
        <span class=" flex_line ">
          事由<i class="red_star">*</i>
        </span>
        <x-textarea :max="200" :rows="5" name="detail" placeholder="请输入申请原因" :show-counter="false"
          v-model.trim="leaveForm.remark" required ref="remark" @on-change="keyDown('remark')"
          @on-blur="isShowErrorInfo(6,'remark')"></x-textarea>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo8}}</div> -->
      <group class="form_item form_btn">
        <x-button @click.native="saveForm" class="save_btn" :disabled="disabled2">保存</x-button>
      </group>
    </div>
    <!-- 新建/编辑销假申请 salesLeaveForm -->
    <div class="new_form" v-if="infoType==10" ref="container4">
      <!-- <group class="form_item">
        <span><i class="red_star">*</i>申请单名称</span>
        <x-input placeholder="请输入申请单名称" placeholder-align="left" v-model.trim="leaveForm.title" ref="title"
          @on-change="keyDown('title')" @on-blur="isShowErrorInfo(6,'title')"></x-input>
      </group>-->
      <!-- <div class="errorInfo">{{obj1.showErrorInfo1}}</div> -->
      <group class="form_item radio_form">
        <span>
          审批类型<i class="red_star">*</i>
        </span>
        <popup-radio :options="processList" :readonly="viewType!='add'||radioList.length==0"
          :class="viewType!='add'?'input_disabled':''" v-model.trim="salesLeaveForm.processTypeId" placeholder="请选择类型"
          placeholder-align="left" required ref="typeid" @on-change="keyDown('process')"
          @on-hide="isShowErrorInfo(10,'process')"></popup-radio>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo1}}</div> -->
      <group class="form_item radio_form">
        <span>
          请假单<i class="red_star">*</i>
        </span>
        <popup-radio style="width:100%;padding-left:0" :readonly="viewType!='add'||radioList.length==0" :class="viewType!='add'?'input_disabled':''"
          :options="radioList" v-model.trim="salesLeaveForm.leaveId" placeholder="请选择请假单" placeholder-align="left"
          @on-change="showValue" @on-hide="isShowErrorInfo(10,'leaveId')" class="small_size"></popup-radio>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo2}}</div> -->
      <group class="form_item">
        <span>
          开始时间<i class="red_star">*</i>
        </span>
        <datetime format="YYYY-MM-DD HH:mm" placeholder="请选择时间" v-model="salesLeaveForm.startDate" clear-text="重置"
          @on-clear="salesLeaveForm.startDate=''" ref="startDate" @on-change="keyDownSalesLeaveStart('startDate')"
          :readonly="salesLeaveForm.leaveId==''" :min-hour="0" :max-hour="23" :minute-list="['00', '30']"
          @on-cancel="isShowErrorInfo(10,'startDate')" @on-confirm="isShowErrorInfo(10,'startDate')"></datetime>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo3}}</div> -->
      <group class="form_item">
        <span>
          结束时间<i class="red_star">*</i>
        </span>
        <datetime format="YYYY-MM-DD HH:mm" placeholder="请选择时间" v-model="salesLeaveForm.endDate" clear-text="重置"
          @on-clear="salesLeaveForm.endDate=''" ref="endDate" @on-change="keyDownSalesLeave('endDate')"
          :readonly="salesLeaveForm.leaveId==''" :min-hour="0" :max-hour="23" :minute-list="['00', '30']"
          @on-cancel="isShowErrorInfo(10,'endDate')" @on-confirm="isShowErrorInfo(10,'endDate')"></datetime>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo4}}</div> -->
      <group class="form_item">
        <span>
          销假时长<i class="red_star">*</i>
        </span>
        <!-- <x-input placeholder="时长" placeholder-align="left" v-model="leaveForm.hours" style="width:1rem" required ref="hours"
        @on-change="keyDown('hours')" type="number" :min="1" @on-hide="isShowErrorInfo(6,'hours')"></x-input>-->
        <x-input placeholder="请输入时长" placeholder-align="left" v-model.trim="salesLeaveForm.hours" ref="hours" type="number" :disabled="salesLeaveForm.leaveId==''" :min="1"
          @on-blur="isShowErrorInfo(10,'hours')"></x-input>
        <!-- <i class="normal_span">小时</i> -->
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo9}}</div> -->
      <group class="form_item flex_start flex_line">
        <span>
          事由<i class="red_star">*</i>
        </span>
        <x-textarea :max="200" :rows="5" name="detail" placeholder="请输入申请原因" :show-counter="false"
          v-model.trim="salesLeaveForm.remark" required ref="remark" @on-change="keyDown('remark')"
          @on-blur="isShowErrorInfo(10,'remark')"></x-textarea>
      </group>
      <!-- <div class="errorInfo">{{obj1.showErrorInfo8}}</div> -->
      <group class="form_item form_btn">
        <x-button @click.native="saveForm" class="save_btn" :disabled="disabled2">保存</x-button>
      </group>
    </div>
    <!-- 新建/编辑用车申请 carForm -->
    <!-- <div class="new_form" v-if="infoType==7">
      <group class="form_item">
        <span><i class="red_star">*</i>申请单名称</span>
        <x-input placeholder="请输入申请单名称" placeholder-align="left" v-model="carForm.title" required ref="title"
          @on-change="keyDown('title')" :is-type="codeValue"></x-input>
      </group>
      <group class="form_item radio_form">
        <span><i class="red_star">*</i>类型</span>
        <popup-radio :options="radioList" v-model="carForm.type" placeholder="请选择类型" placeholder-align="left"
          @on-change="showValue" required ref="type"></popup-radio>
      </group>
      <group class="form_item">
        <span><i class="red_star">*</i>用车时间</span>
        <datetime format="YYYY-MM-DD HH:mm" placeholder="请选择用车时间" v-model="carForm.useDate" required ref="useDate"
          @on-change="keyDown('useDate')"></datetime>
      </group>
      <group class="form_item radio_list">
        <span><i class="red_star">*</i>是否用车</span>
        <checker v-model="carForm.isDriver" default-item-class="demo5-item" selected-item-class="demo5-item-selected" required ref="isDriver"
          @on-change="keyDown('isDriver')">
          <checker-item value="1">是</checker-item>
          <checker-item value="2">否</checker-item>
        </checker>
      </group>
      <group class="form_item item_number">
        <span><i class="red_star">*</i>用车人数</span>
        <x-number align="left" required ref="busNum"
          @on-change="keyDown('isDriver')" v-model="carForm.busNum" :min="1"></x-number>
      </group>
      <group class="form_item flex_start">
        <span><i class="red_star">*</i>申请原因</span>
        <x-textarea :max="200" name="detail" placeholder="请输入申请原因" :show-counter="false" v-model="carForm.remark" required ref="remark"
          @on-change="keyDown('remark')"></x-textarea>
      </group>
      <group class="form_item">
        <x-button @click.native="saveForm" class="save_btn" :disabled="disabled">保存</x-button>
      </group>
    </div>-->
    <!-- 新建/编辑物品领用申请 receiveForm -->
    <!-- <div class="new_form" v-if="infoType==8">
      <group class="form_item">
        <span><i class="red_star">*</i>申请单名称</span>
        <x-input placeholder="请输入申请单名称" placeholder-align="left" v-model="receiveForm.title" required ref="title"
          @on-change="keyDown('title')" :is-type="codeValue"></x-input>
      </group>
      <group class="form_item radio_form">
        <span><i class="red_star">*</i>领用类型</span>
        <popup-radio :options="radioList" v-model="receiveForm.type" placeholder="请选择类型" placeholder-align="left"
          @on-change="showValue" required ref="type" ></popup-radio>
      </group>
      <group class="form_item">
        <span><i class="red_star">*</i>领用时间</span>
        <datetime format="YYYY-MM-DD HH:mm" placeholder="请选择领用时间" v-model="receiveForm.receiveDate" required ref="receiveDate"
          @on-change="keyDown('receiveDate')"></datetime>
      </group>
      <group class="form_item flex_start">
        <span><i class="red_star">*</i>申请原因</span>
        <x-textarea :max="200" name="detail" placeholder="请输入申请原因" :show-counter="false" v-model="receiveForm.remark" required ref="remark"
          @on-change="keyDown('remark')"></x-textarea>
      </group>
      <group class="form_item">
        <x-button @click.native="saveForm" class="save_btn" :disabled="disabled">保存</x-button>
      </group>
    </div>-->
    <!-- 新建/编辑采购申请申请procurementapplyForm -->
    <!-- <div class="new_form" v-if="infoType==9">
      <group class="form_item">
        <span><i class="red_star">*</i>申请单名称</span>
        <x-input placeholder="请输入申请单名称" placeholder-align="left" v-model="procurementapplyForm.title"></x-input>
      </group>
      <group class="form_item">
        <span><i class="red_star">*</i>采购明细</span>
      </group>
      <group class="form_item list_item">
        <x-input placeholder="请输入产品名称" placeholder-align="left" style="width:2rem" :show-clear="false"></x-input>
        <x-input placeholder="请输入备注内容" placeholder-align="left" style="width:2.2rem" type="number" :show-clear="false"></x-input>
        <i class='iconfont iconguanbi'></i>
      </group>
      <group class="list_item">
        <x-button @click="addApplyInfo" mini>继续添加</x-button>
      </group>
      <group class="form_item flex_start">
        <span><i class="red_star">*</i>原因说明</span>
        <x-textarea :max="200" name="detail" placeholder="请输入申请原因" :show-counter="false" v-model="procurementapplyForm.remark"></x-textarea>
      </group>
      <group class="form_item">
        <x-button @click.native="saveForm" class="save_btn" :disabled="disabled">保存</x-button>
      </group>
    </div>-->
  </div>
</template>

<script>
  import {
    getWorkflowGet,
    getWorkEditInfo,
    calcTime,
    isWorkDay,
    getWorkTypeById,
    saveApprovalType // 获取审批列表
  } from "@/api/public";
  import {
    XTextarea,
    XButton,
    PopupRadio,
    XNumber,
    Checker,
    CheckerItem,
    Popup,
    // Checklist,
    TransferDom,
    Loading,
    PopupHeader,
    Group,
    XSwitch,
    Radio
  } from "vux";
  import Uploader from "vux-uploader";
  import {
    debug
  } from "util";
  import {
    setTimeout
  } from "timers";
  export default {
    name: "New",
    directives: {
      TransferDom
    },
    components: {
      XTextarea,
      XButton,
      PopupRadio,
      Uploader,
      XNumber,
      Checker,
      CheckerItem,
      Popup,
      // Checklist,
      Loading,
      PopupHeader,
      Popup,
      Group,
      XSwitch,
      Radio
    },
    data() {
      return {
        showPopup: false,
        count: 0,
        disabled2: false,
        obj1: {
          showErrorInfo1: "",
          showErrorInfo2: "",
          showErrorInfo3: "",
          showErrorInfo4: "",
          showErrorInfo6: "",
          showErrorInfo7: "",
          showErrorInfo8: "",
          showErrorInfo9: ""
        },
        showErrorInfo5: "",
        demo4: "",
        infoId: "",
        viewType: "add",
        disabled: true,
        params: {},
        uploadUrl: "",
        fileList: [],
        modelTitle: "",
        infoType: "",
        requestUrl: "",
        supplierList: [], // 供应商列表
        procurementList1: [], // 采购单明细列表
        radioList: [], // 用车类型,用章类型
        processList: [], // 审批类型
        salesLeaveList: [],
        accompanyList: [], // 列表展示勾选的陪同人
        accompanyShowList: [], // 实际列表勾选的陪同人
        overTime: 100,
        overtimeForm: {
          processTypeId: '',
          type: "1",
          startDate: "",
          endDate: "",
          hours: "",
          remark: ""
        },
        leaveForm: {
          processTypeId: '',
          type: "1",
          startDate: "",
          endDate: "",
          hours: "",
          contact: "",
          phone: "",
          remark: ""
        },
        salesLeaveForm: {
          processTypeId: '',
          type: "",
          leaveId: "",
          startDate: "",
          endDate: "",
          hours: "",
          remark: ""
        },
        min_leave: '',
        max_leave: '',
        max_leave_hours: '',
        sales_leave_type: '',
        visitForm: {
          processTypeId: '',
          title: "",
          customer: "",
          contact: "",
          destination: "",
          accompany: "",
          startDate: "",
          endDate: "",
          remark: ""
        },
        time_seting: {},
        timeConfig: {
          start: 8,
          step: "00:30",
          end: 18
        },
        codeValue: function (value) {
          return {
            valid: value.length >= 2 && value.length <= 15,
            msg: "标题长度在2-15位之间!"
          };
        },
        codePhone: function (value) {
          return {
            valid: value.length >= 2 && value.length <= 15,
            msg: "标题长度在2-15位之间!"
          };
        },
        carForm: {
          // 用车数据
          processTypeId: '',
          title: "",
          type: "",
          useDate: "",
          isDriver: "",
          busNum: 0,
          remark: ""
        },
        sealForm: {
          // 用章数据
          processTypeId: '',
          title: "",
          type: "",
          useDate: "",
          remark: ""
        },
        refundList: [], // 报销添加的明细
        refundForm: {
          // 报销数据
          processTypeId: '',
          title: "",
          items: [],
          files: "",
          amount: 0,
          name: "",
          bank: "",
          card: "",
          remark: ""
        },
        procurementForm: {
          processTypeId: '',
          title: "",
          items: [{
              proName: "",
              proPrice: "",
              proNum: "",
              proAmount: 0.0
            },
            {
              proName: "",
              proPrice: "",
              proNum: "",
              proAmount: 0.0
            }
          ],
          total: 0,
          pname: "",
          pbank: "",
          bankcode: "",
          remark: ""
        },
        procurementList: [], // 采购申请单的明细
        procurementapplyForm: {
          processTypeId: '',
          name: "",
          items: "",
          remark: ""
        },
        applyForm: {
          // 报销数据
          processTypeId: '',
          name: "",
          info: [{
              proName: "",
              proPrice: "",
              proNum: "",
              proAmount: 0.0
            },
            {
              proName: "",
              proPrice: "",
              proNum: "",
              proAmount: 0.0
            }
          ],
          total: 0,
          pname: "",
          pbank: "",
          bankcode: "",
          remark: ""
        },
        temporaryTime: 0, // 调休时间
        receiveForm: {},
        radioList1: [],
        userList: [],
        userStr: "",
        userFifter: "" // 陪同人过滤
      };
    },
    created() {},
    watch: {
      userFifter(val, oldval) {
        // var list = [];
        for (var i = 0; i < this.userList.length; i++) {
          this.userList[i].hidden = true;
          var item = this.userList[i];
          if (item.value.indexOf(val) != -1) {
            item.hidden = false;
            // list.push(item);
          }
        }
        this.radioList = [...this.userList];
        console.log(this.radioList);
        // console.log(list);
        this.$forceUpdate();
      },
      accompanyList(val, oldval) {
        console.log(val);
        this.accompanyShowList = val;
        console.log(oldval);
      }
    },
    mounted() {
      // 页面第一个渲染的函数
      this.infoId = this.$route.query.infoId;
      this.viewType = this.$route.query.show;
      this.infoType = this.$route.query.type;
      this.getDefault()
      if (this.viewType === "add") {
        this.getTypeList();
      } else {
        this.getDetail();
      }
    },
    methods: {
      getDefault() {
        let that = this
        getWorkTypeById(this.infoType).then(res => {
          if (res.code == 200) {
            let arr = [];
            for (let i in res.data.data) {
              arr.push({
                value: res.data.data[i].name,
                key: res.data.data[i].id
              });
            }
            that.processList = arr
          }
        })
      },
      // backScoll(){
      //   console.log(this.$refs.container.offsetHeight, 'fffdd')
      //   console.log(document.documentElement.clientHeight, 'fffbbb')
      //   if(this.$refs.container.offsetHeight <= document.documentElement.clientHeight) {
      //       window.scrollTo(0, 0)
      //   }
      // },
      isShowErrorInfo(infoType, data) {
        console.log(infoType, data);
        const that = this;
        if (parseInt(infoType) === 2) {
          if (
            this.$refs.container1.offsetHeight <=
            document.documentElement.clientHeight
          ) {
            window.scrollTo(0, 0);
          }
          if (data === "title") {
            console.log(that.visitForm.title.length);
            if (
              that.visitForm.title.length < 2 ||
              that.visitForm.title.length > 15
            ) {
              console.log(that.visitForm.title);
              that.obj1.showErrorInfo1 = "请输入标题，长度在2-15位之间!";
              return;
            } else {
              that.obj1.showErrorInfo1 = "";
            }
          } else if (data === "customer") {
            if (that.visitForm.customer === "") {
              that.obj1.showErrorInfo2 = "请输入客户名称!";
              return;
            } else {
              that.obj1.showErrorInfo2 = "";
            }
          } else if (data === "contact") {
            if (that.visitForm.contact === "") {
              that.obj1.showErrorInfo3 = "请输入联系人!";
              return;
            } else {
              that.obj1.showErrorInfo3 = "";
            }
          } else if (data === "destination") {
            if (that.visitForm.destination === "") {
              that.obj1.showErrorInfo4 = "请输入目的地!";
              return;
            } else {
              that.obj1.showErrorInfo4 = "";
            }
          } else if (data === "startDate") {
            console.log("###");
            const nowTime = new Date().getTime();
            const pickTime = new Date(
              that.visitForm.startDate.replace(/\-/g, "/")
            ).getTime();
            console.log(nowTime, pickTime, "gfdgfdgfgfd");
            if (pickTime < nowTime) {
              that.$vux.toast.show({
                text: "开始时间不能小于当前时间",
                type: "text",
                time: 1000
              });
              that.visitForm.startDate = "";
            }
            if (that.visitForm.startDate === "") {
              that.obj1.showErrorInfo6 = "请选择开始时间!";
              return;
            } else {
              that.obj1.showErrorInfo6 = "";
            }
          } else if (data === "endDate") {
            const nowTime = new Date().getTime();
            const pickTime = new Date(
              that.visitForm.endDate.replace(/\-/g, "/")
            ).getTime();
            console.log(nowTime, pickTime, "gfdgfdgfgfd");
            if (pickTime < nowTime) {
              that.$vux.toast.show({
                text: "结束时间不能小于当前时间",
                type: "text",
                time: 1000
              });
              that.visitForm.endDate = "";
            }
            console.log("###");
            if (that.visitForm.endDate === "") {
              that.obj1.showErrorInfo7 = "请输入结束时间!";
              return;
            } else {
              const startTime = new Date(
                this.visitForm.startDate.replace(/\-/g, "/")
              );
              const endTime = new Date(
                this.visitForm.endDate.replace(/\-/g, "/")
              );
              if (startTime - endTime >= 0) {
                that.obj1.showErrorInfo7 = "结束时间不能小于或等于开始时间";
                return;
              } else {
                that.obj1.showErrorInfo7 = "";
              }
            }
          } else if (data === "remark") {
            if (that.visitForm.remark === "") {
              this.obj1.showErrorInfo8 = "请输入拜访目的!";
              return;
            } else {
              this.obj1.showErrorInfo8 = "";
            }
          } else if (data === "process") {
            // console.log(Number(that.overtimeForm.hours), 'ffff')
            if (that.visitForm.processTypeId === "") {
              that.obj1.showErrorInfo9 = "请选择审批类型!";
              return;
            } else {
              that.obj1.showErrorInfo9 = "";
            }
          }
        }
        if (parseInt(infoType) === 5) {
          if (
            this.$refs.container2.offsetHeight <=
            document.documentElement.clientHeight
          ) {
            window.scrollTo(0, 0);
          }
          console.log(data)
          if (data === "type") {
            if (that.overtimeForm.type === "") {
              that.obj1.showErrorInfo2 = "请选择类型!";
              return;
            } else {
              that.obj1.showErrorInfo2 = "";
            }
          } else if (data === "process") {
            // console.log(Number(that.overtimeForm.hours), 'ffff')
            if (that.overtimeForm.processTypeId === "") {
              that.obj1.showErrorInfo9 = "请选择审批类型!";
              return;
            } else {
              that.obj1.showErrorInfo9 = "";
            }
          } else if (data === "hours") {
            // console.log(Number(that.overtimeForm.hours), 'ffff')
            if (that.overtimeForm.hours === "") {
              that.obj1.showErrorInfo8 = "请输入加班时长!";
              return;
            } else {
              if (Number(that.overtimeForm.hours) <= 0) {
                that.obj1.showErrorInfo8 = "加班时长不能小于或等于0!";
                return;
              } else {
                that.obj1.showErrorInfo8 = "";
              }
            }
          } else if (data === "startDate") {
            console.log("###");
            if (that.overtimeForm.startDate === "") {
              that.obj1.showErrorInfo3 = "请选择开始时间!";
              return;
            } else {
              that.obj1.showErrorInfo3 = "";
            }
          } else if (data === "endDate") {
            console.log("###");
            if (that.overtimeForm.endDate === "") {
              that.obj1.showErrorInfo4 = "请选择结束时间!";
            } else {
              const startTime = new Date(
                this.overtimeForm.startDate.replace(/\-/g, "/")
              );
              const endTime = new Date(
                this.overtimeForm.endDate.replace(/\-/g, "/")
              );
              if (startTime - endTime >= 0) {
                that.obj1.showErrorInfo4 = "结束时间不能小于或等于开始时间";
                return;
              } else {
                that.obj1.showErrorInfo4 = "";
              }
            }
          } else if (data === "remark") {
            if (that.overtimeForm.remark === "") {
              this.obj1.showErrorInfo6 = "请输入申请原因!";
              return;
            } else {
              this.obj1.showErrorInfo6 = "";
            }
          }
        }
        if (parseInt(infoType) === 6) {
          if (
            this.$refs.container3.offsetHeight <=
            document.documentElement.clientHeight
          ) {
            window.scrollTo(0, 0);
          }
          if (data === "type") {
            if (that.leaveForm.type === "") {
              that.obj1.showErrorInfo2 = "请选择类型!";
              return;
            } else {
              that.obj1.showErrorInfo2 = "";
            }
          } else if (data === "process") {
            // console.log(Number(that.overtimeForm.hours), 'ffff')
            if (that.leaveForm.processTypeId === "") {
              that.obj1.showErrorInfo1 = "请选择审批类型!";
              return;
            } else {
              that.obj1.showErrorInfo1 = "";
            }
          } else if (data === "startDate") {
            console.log("###");
            if (that.leaveForm.startDate === "") {
              that.obj1.showErrorInfo3 = "请选择开始时间!";
              return;
            } else {
              that.obj1.showErrorInfo3 = "";
            }
          } else if (data === "endDate") {
            console.log("###");
            if (that.leaveForm.endDate === "") {
              that.obj1.showErrorInfo4 = "请选择结束时间!";
              return;
            } else {
              const startTime = new Date(
                this.leaveForm.startDate.replace(/\-/g, "/")
              );
              const endTime = new Date(
                this.leaveForm.endDate.replace(/\-/g, "/")
              );
              if (startTime - endTime >= 0) {
                that.obj1.showErrorInfo4 = "结束时间不能小于或等于开始时间";
                return;
              } else {
                that.obj1.showErrorInfo4 = "";
              }
            }
          } else if (data === "hours") {
            if (that.leaveForm.hours === "") {
              that.obj1.showErrorInfo9 = "请输入请假时长!";
              return;
            } else {
              if (Number(that.leaveForm.hours) <= 0) {
                that.obj1.showErrorInfo9 = "请假时长不能小于或等于0!";
                return;
              } else {
                that.obj1.showErrorInfo9 = "";
              }
            }
          } else if (data === "contact") {
            if (that.leaveForm.contact === "") {
              that.obj1.showErrorInfo6 = "请输入紧急联系人!";
              return;
            } else {
              that.obj1.showErrorInfo6 = "";
            }
          } else if (data === "phone") {
            if (that.leaveForm.phone === "") {
              that.obj1.showErrorInfo7 = "请输入紧急联系电话!";
              return;
            } else {
              var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
              if (!myreg.test(that.leaveForm.phone)) {
                that.obj1.showErrorInfo7 = "联系电话格式不正确!";
                return;
              } else {
                that.obj1.showErrorInfo7 = "";
              }
            }
          } else if (data === "remark") {
            if (that.leaveForm.remark === "") {
              that.obj1.showErrorInfo8 = "请输入申请原因!";
              return;
            } else {
              that.obj1.showErrorInfo8 = "";
            }
          }
        }
        if (parseInt(infoType) === 10) {
          if (
            this.$refs.container4.offsetHeight <=
            document.documentElement.clientHeight
          ) {
            window.scrollTo(0, 0);
          }
          if (data === "leavelId") {
            if (that.salesLeaveForm.type === "") {
              that.obj1.showErrorInfo2 = "请选择请假单!";
              return;
            } else {
              that.obj1.showErrorInfo2 = "";
            }
          } else if (data === "process") {
            // console.log(Number(that.overtimeForm.hours), 'ffff')
            if (that.salesLeaveForm.processTypeId === "") {
              that.obj1.showErrorInfo1 = "请选择审批类型!";
              return;
            } else {
              that.obj1.showErrorInfo1 = "";
            }
          } else if (data === "startDate") {
            console.log("###");
            if (that.salesLeaveForm.startDate === "") {
              that.obj1.showErrorInfo3 = "请选择开始时间!";
              return;
            } else {
              that.obj1.showErrorInfo3 = "";
            }
            if (new Date(that.salesLeaveForm.startDate) < new Date(that.min_leave)) {
              that.obj1.showErrorInfo3 = "销假开始时间不能小于请假开始时间!";
              return;
            } else if (new Date(that.salesLeaveForm.startDate) > new Date(that.max_leave)) {
              that.obj1.showErrorInfo3 = "销假开始时间不能大于请假结束时间!";
              return;
            }
          } else if (data === "endDate") {
            console.log("###");
            if (that.salesLeaveForm.endDate === "") {
              that.obj1.showErrorInfo4 = "请选择结束时间!";
              return;
            } else {
              const startTime = new Date(
                this.salesLeaveForm.startDate.replace(/\-/g, "/")
              );
              const endTime = new Date(
                this.salesLeaveForm.endDate.replace(/\-/g, "/")
              );
              if (startTime - endTime >= 0) {
                that.obj1.showErrorInfo4 = "结束时间不能小于或等于开始时间";
                return;
              } else {
                that.obj1.showErrorInfo4 = "";
              }
            }
            if (new Date(that.salesLeaveForm.endDate) < new Date(that.min_leave)) {
              that.obj1.showErrorInfo3 = "销假结束时间不能小于请假开始时间!";
              return;
            } else if (new Date(that.salesLeaveForm.endDate) > new Date(that.max_leave)) {
              that.obj1.showErrorInfo3 = "销假结束时间不能大于请假结束时间!";
              return;
            }
          } else if (data === "hours") {
            if (that.salesLeaveForm.hours === "") {
              that.obj1.showErrorInfo9 = "请输入销假时长!";
              return;
            } else {
              if (Number(that.salesLeaveForm.hours) <= 0) {
                that.obj1.showErrorInfo9 = "销假时长不能小于或等于0!";
                return;
              } else {
                that.obj1.showErrorInfo9 = "";
              }
            }
            if (parseFloat(that.salesLeaveForm.hours) > parseFloat(that.max_leave_hours)) {
              that.obj1.showErrorInfo9 = "销假时长不能大于请假时长!";
              return;
            }
          } else if (data === "remark") {
            if (that.salesLeaveForm.remark === "") {
              that.obj1.showErrorInfo8 = "请输入申请原因!";
              return;
            } else {
              that.obj1.showErrorInfo8 = "";
            }
          }
        }
      },
      clearInfo(num, type) {
        if (num === 2) {
          if (type === "startDate") {
            this.visitForm.startDate = "";
            this.obj1.showErrorInfo6 = "";
          }
          if (type === "endDate") {
            this.visitForm.endDate = "";
            this.obj1.showErrorInfo7 = "";
          }
        }
        if (num === 5) {
          if (type === "startDate") {
            this.overtimeForm.startDate = "";
            this.obj1.showErrorInfo3 = "";
          }
          if (type === "endDate") {
            this.overtimeForm.endDate = "";
            this.obj1.showErrorInfo4 = "";
          }
        }
        if (num === 6) {
          if (type === "startDate") {
            this.leaveForm.startDate = "";
            this.obj1.showErrorInfo3 = "";
          }
          if (type === "endDate") {
            this.leaveForm.endDate = "";
            this.obj1.showErrorInfo4 = "";
          }
        }
      },
      onItemClick(value, disabled) {
        if (!this.disabled) {
          this.showPopup = false;
        }
      },
      choseUser(val, label) {
        this.userStr = "";
        this.userStr = label.join(",");
        this.visitForm.accompany = "";
        this.visitForm.accompany = val.join(",");
      },
      updateInput(){
        this.$refs.mycheck.currentOptions = this.radioList
        this.$forceUpdate();
      },
      sureUser() {
        this.userFifter = "";
        let arr = [];
        for (let i = 0; i < this.accompanyShowList.length; i++) {
          for (let j = 0; j < this.userList.length; j++) {
            if (this.accompanyShowList[i] == this.userList[j].key) {
              arr.push(this.userList[j].value);
            }
          }
        }
        this.userStr = "";
        this.userStr = arr.join(",");
        this.visitForm.accompany = "";
        this.visitForm.accompany = this.accompanyShowList.join(",");
        console.log(this.userStr);
        this.showPopup = false;
        this.accompanyList = this.accompanyShowList;
        this.radioList = this.userList;
      },
      concel() {
        this.showPopup = false;
        this.userFifter = "";
      },
      keyDownLeave(type) {
        const that = this;
        if (this.leaveForm.endDate !== " ") {
          console.log("计算结束时间");
          isWorkDay({
            date: this.leaveForm.endDate
          }).then(res => {
            if (res.code === 200) {
              if (res.data.data === "isnotworksday") {
                that.$vux.toast.show({
                  text: res.data.msg,
                  type: "text",
                  time: 1000
                });
                this.leaveForm.endDate = "";
              } else {
                if (
                  this.leaveForm.endDate !== "" &&
                  this.leaveForm.startDate !== ""
                ) {
                  const startTime = new Date(this.leaveForm.startDate);
                  const endTime = new Date(this.leaveForm.endDate);
                  this.leaveTime = Math.floor(
                    (endTime - startTime) / 3600 / 1000
                  );
                  if (startTime >= endTime) {
                    that.obj1.showErrorInfo4 = "结束时间不能大于或等于开始时间!";
                    this.leaveForm.endDate = "";
                    this.leaveForm.hours = "";
                  } else {
                    calcTime("/oa/leave-working", {
                      start: this.leaveForm.startDate,
                      end: this.leaveForm.endDate
                    }).then(res => {
                      console.log(res);
                      if (res.code === 200) {
                        that.leaveForm.hours = res.data.hours;
                      }
                    });
                  }
                } else {
                  this.leaveTime = 100;
                }
              }
            }
          });
        }
      },
      keyDownSalesLeave(type) {
        const that = this;
        if (this.salesLeaveForm.endDate !== " ") {
          console.log("计算结束时间");
          isWorkDay({
            date: this.salesLeaveForm.endDate
          }).then(res => {
            if (res.code === 200) {
              if (res.data.data === "isnotworksday") {
                that.$vux.toast.show({
                  text: res.data.msg,
                  type: "text",
                  time: 1000
                });
                this.salesLeaveForm.endDate = "";
              } else {
                if (
                  this.salesLeaveForm.endDate !== "" &&
                  this.salesLeaveForm.startDate !== ""
                ) {
                  const startTime = new Date(this.salesLeaveForm.startDate);
                  const endTime = new Date(this.salesLeaveForm.endDate);
                  this.leaveTime = Math.floor(
                    (endTime - startTime) / 3600 / 1000
                  );
                  if (startTime >= endTime) {
                    that.obj1.showErrorInfo4 = "结束时间不能大于或等于开始时间!";
                    this.salesLeaveForm.endDate = "";
                    this.salesLeaveForm.hours = "";
                  } else {
                    calcTime("/oa/leave-working", {
                      start: this.salesLeaveForm.startDate,
                      end: this.salesLeaveForm.endDate
                    }).then(res => {
                      console.log(res);
                      if (res.code === 200) {
                        that.salesLeaveForm.hours = res.data.hours;
                      }
                    });
                  }
                } else {
                  this.leaveTime = 100;
                }
              }
            }
          });
        }
      },
      keyDownLeaveStart(type) {
        const that = this;
        if (this.leaveForm.startDate !== " ") {
          console.log("计算开始时间");
          isWorkDay({
            date: this.leaveForm.startDate
          }).then(res => {
            console.log(res);
            if (res.code === 200) {
              if (res.data.data === "isnotworksday") {
                that.$vux.toast.show({
                  text: res.data.msg,
                  type: "text",
                  time: 1000
                });
                this.leaveForm.startDate = "";
              } else {
                if (
                  this.leaveForm.startDate !== "" &&
                  this.leaveForm.endDate !== ""
                ) {
                  const startTime = new Date(this.leaveForm.startDate);
                  const endTime = new Date(this.leaveForm.endDate);
                  this.leaveTime = Math.floor(
                    (endTime - startTime) / 3600 / 1000
                  );
                  if (startTime >= endTime) {
                    that.obj1.showErrorInfo4 = "结束时间不能大于或等于开始时间!";
                    this.leaveForm.endDate = "";
                    this.leaveForm.hours = "";
                  } else {
                    calcTime("/oa/leave-working", {
                      start: this.leaveForm.startDate,
                      end: this.leaveForm.endDate
                    }).then(res => {
                      console.log(res);
                      if (res.code === 200) {
                        that.leaveForm.hours = res.data.hours;
                      }
                    });
                  }
                } else {
                  this.leaveTime = 100;
                }
              }
            }
          });
        }
      },
      keyDownSalesLeaveStart(type) {
        const that = this;
        if (this.salesLeaveForm.startDate !== " ") {
          console.log("计算开始时间");
          isWorkDay({
            date: this.salesLeaveForm.startDate
          }).then(res => {
            console.log(res);
            if (res.code === 200) {
              if (res.data.data === "isnotworksday") {
                that.$vux.toast.show({
                  text: res.data.msg,
                  type: "text",
                  time: 1000
                });
                this.salesLeaveForm.startDate = "";
              } else {
                if (
                  this.salesLeaveForm.startDate !== "" &&
                  this.salesLeaveForm.endDate !== ""
                ) {
                  const startTime = new Date(this.salesLeaveForm.startDate);
                  const endTime = new Date(this.salesLeaveForm.endDate);
                  this.leaveTime = Math.floor(
                    (endTime - startTime) / 3600 / 1000
                  );
                  if (startTime >= endTime) {
                    that.obj1.showErrorInfo4 = "结束时间不能大于或等于开始时间!";
                    this.salesLeaveForm.endDate = "";
                    this.salesLeaveForm.hours = "";
                  } else {
                    calcTime("/oa/leave-working", {
                      start: this.salesLeaveForm.startDate,
                      end: this.salesLeaveForm.endDate
                    }).then(res => {
                      console.log(res);
                      if (res.code === 200) {
                        that.salesLeaveForm.hours = res.data.hours;
                      }
                    });
                  }
                } else {
                  this.leaveTime = 100;
                }
              }
            }
          });
        }
      },
      keyDown(type) {
        const that = this;
        let flag = true;
        let code = {};
        if (parseInt(this.infoType) === 2) {
          code = this.visitForm;
        } else if (parseInt(this.infoType) === 5) {
          if (type === "type") {
            this.overtimeForm.startDate = "";
            this.overtimeForm.endDate = "";
            this.overtimeForm.hours = "";
          }
          code = this.overtimeForm;
          if (type === "startDate" || type === "endDate") {
            if (
              this.overtimeForm.startDate !== "" &&
              this.overtimeForm.endDate !== ""
            ) {
              const startTime = new Date(this.overtimeForm.startDate);
              const endTime = new Date(this.overtimeForm.endDate);
              if (startTime >= endTime) {
                that.obj1.showErrorInfo4 = "结束时间不能大于或等于开始时间";
                that.overtimeForm.endDate = "";
                this.overtimeForm.hours = "";
              } else {
                calcTime("/oa/overtime-working-" + that.overtimeForm.type, {
                  start: that.overtimeForm.startDate,
                  end: that.overtimeForm.endDate
                }).then(res => {
                  console.log(res);
                  if (res.code === 200) {
                    that.overtimeForm.hours = res.data.hours;
                    if (!res.data.hours) {
                      that.$vux.toast.show({
                        text: res.data,
                        type: "text",
                        time: 1000
                      });
                      that.overtimeForm.startDate = "";
                      that.overtimeForm.endDate = "";
                      that.overtimeForm.hours = "";
                    }
                  }
                });
              }
            } else {
              this.overTime = 100;
            }
          }
        } else if (parseInt(this.infoType) === 8) {
          code = this.receiveForm;
        } else if (parseInt(this.infoType) === 7) {
          code = this.carForm;
        } else if (parseInt(this.infoType) === 3) {
          code = this.sealForm;
        }
        for (let i in code) {
          if (code[i] === "") {
            this.disabled = true;
            flag = false;
            break;
          }
        }
        if (flag) {
          this.disabled = false;
        }
        if (parseInt(this.infoType) === 6) {
          if (this.$refs.phone.valid == false) {
            this.disabled = true;
          }
        }
      },
      showValue(value) {
        console.log(value, "fff");
        if (this.infoType === '10') {
          console.log(this.salesLeaveForm.leaveId)
          for (let i = 0; i < this.salesLeaveList.length; i++) {
            if (this.salesLeaveForm.leaveId === this.salesLeaveList[i].value) {
              this.min_leave = this.salesLeaveList[i].startDate
              this.max_leave = this.salesLeaveList[i].endDate
              this.max_leave_hours = this.salesLeaveList[i].hours
              this.sales_leave_type = this.salesLeaveList[i].type
            }
          }

        }
      },
      getTypeList() {
        switch (parseInt(this.infoType)) {
          case 1:
            this.modelTitle = "创建采购";
            this.requestUrl = "/oa/procurement-create";
            break;
          case 2:
            this.modelTitle = "创建拜访";
            this.requestUrl = "/oa/visit-create";
            break;
          case 3:
            this.modelTitle = "新增用章申请";
            this.requestUrl = "/oa/seal-create";
            break;
          case 4:
            this.modelTitle = "创建报销";
            this.requestUrl = "oa/refund-create";
            break;
          case 5:
            this.modelTitle = "创建加班申请";
            this.requestUrl = "/oa/overtime-create";
            break;
          case 6:
            this.modelTitle = "创建请假";
            this.requestUrl = "/oa/leave-create";
            break;
          case 7:
            this.modelTitle = "新增用车申请";
            this.requestUrl = "/oa/car-create";
            break;
          case 8:
            this.modelTitle = "创建物品领用";
            this.requestUrl = "/oa/receive-create";
            break;
          case 9:
            this.modelTitle = "创建采购申请单";
            this.requestUrl = "/oa/procurementapply-create";
            break;
          case 10:
            this.modelTitle = "创建销假申请单";
            this.requestUrl = "/oa/outleave-create";
            break;
        }
        const that = this;
        getWorkflowGet(this.requestUrl).then(res => {
          if (res.code === 200) {
            let arr = [];
            for (let i in res.data.typeList) {
              arr.push({
                value: res.data.typeList[i],
                key: i
              });
            }
            that.radioList = arr;
            if (parseInt(this.infoType) === 3) {
              let arr1 = [];
              for (let i in res.data.subjectList) {
                arr1.push({
                  value: res.data.subjectList[i],
                  key: i
                });
              }
              that.radioList1 = arr1;
            } else if (parseInt(this.infoType) === 2) {
              let arr = [];
              for (let i = 0; i < res.data.escorts.length; i++) {
                arr.push({
                  key: res.data.escorts[i].id + "",
                  value: res.data.escorts[i].name + "-" + res.data.escorts[i].deptName,
                  hidden: false
                });
              }
              that.radioList = arr;
              that.userList = that.radioList;
              console.log(this.radioList);
              that.accompanyList = [];
            } else if (parseInt(this.infoType) === 6) {
              that.time_seting = res.data.sign;
              that.timeConfig = {
                start: parseInt(res.data.sign.sign_in),
                step: "00:30",
                end: parseInt(res.data.sign.sign_out)
              };
              that.temporaryTime = res.data.sign.lastime; // 调休时长
            } else if (parseInt(this.infoType) === 10) {
              // that.time_seting = res.data.sign
              // that.radioList = res.data.typeList
              that.salesLeaveList = res.data.typeList;
              var arr = [];
              console.log(res.data.typeList);
              for (let i in res.data.typeList) {
                arr.push({
                  value: res.data.typeList[i].label,
                  key: res.data.typeList[i].value
                });
              }
              console.log(arr);
              that.radioList = arr;
              console.log(that.radioList);
              if (that.radioList.length == 0) {
                console.log(111)
                that.obj1.showErrorInfo2 = "没有可销假的请假单!";
              }
              // that.timeConfig = {
              //   start: parseInt(res.data.sign.sign_in),
              //   step: '00:30',
              //   end: parseInt(res.data.sign.sign_out)
              // }
              // that.temporaryTime = res.data.sign.lastime // 调休时长
            }
            console.log(that.radioList1);
          }
        });
      },
      getDetail() {
        const that = this;
        switch (parseInt(this.infoType)) {
          case 2:
            this.requestUrl = "/oa/visit-edit-" + this.infoId;
            break;
          case 5:
            this.requestUrl = "/oa/overtime-edit-" + this.infoId;
            break;
          case 6:
            this.requestUrl = "/oa/leave-edit-" + this.infoId;
            break;
          case 10:
            this.requestUrl = "/oa/outleave-edit-" + this.infoId;
            break;
        }
        getWorkEditInfo(this.requestUrl).then(res => {
          if (res.code === 200) {
            console.log(that.infoType);
            switch (parseInt(that.infoType)) {
              case 2:
                // that.modelTitle = "编辑拜访";
                let arr2 = [];
                for (let i = 0; i < res.data.escorts.length; i++) {
                  arr2.push({
                    key: res.data.escorts[i].id + "",
                    value: res.data.escorts[i].name +
                      "-" +
                      res.data.escorts[i].deptName
                  });
                }
                that.radioList = arr2;
                that.userList = that.radioList;
                that.visitForm = res.data.visit;
                that.accompanyList = [];
                if (that.visitForm.accompany !== "") {
                  that.accompanyList = that.visitForm.accompany.split(",");
                }
                console.log(that.accompanyList)
                break;
              case 5:
                // that.modelTitle = "编辑加班申请";
                let arr = [];
                for (let i in res.data.typeList) {
                  arr.push({
                    value: res.data.typeList[i],
                    key: i
                  });
                }
                that.radioList = arr;
                that.overtimeForm = res.data.overtime;
                break;
              case 6:
                // that.modelTitle = "编辑假条";
                let arr1 = [];
                for (let i in res.data.typeList) {
                  arr1.push({
                    value: res.data.typeList[i],
                    key: i
                  });
                }
                that.radioList = arr1;
                that.temporaryTime = res.data.sign.lastime; // 调休时长
                that.leaveForm = res.data.leave;
                break;
              case 10:
                // that.modelTitle = "编辑假条";
                that.salesLeaveList = res.data.typeList;
                var arr = [];
                console.log(res.data.typeList);
                for (let i in res.data.typeList) {
                  arr.push({
                    value: res.data.typeList[i].label,
                    key: res.data.typeList[i].value
                  });
                }
                console.log(arr);
                that.radioList = arr;
                that.salesLeaveForm = res.data.leave;
                console.log(that.radioList);
                if (that.radioList.length == 0) {
                  console.log(111)
                  that.obj1.showErrorInfo2 = "没有可销假的请假单!";
                }
                break;
            }
            that.modelShow = true;
          } else {
            that.$vux.toast.show({
              text: res.msg,
              type: "text",
              time: 1000
            });
          }
        });
      },
      saveForm() {
        if (parseInt(this.infoType) === 2) {
          const that = this;
          if (that.visitForm.processTypeId === "") {
            that.obj1.showErrorInfo9 = "请选择审批类型!";
            that.$vux.toast.show({
              text: '请选择审批类型!',
              type: 'text',
              time: 1000
            });
            return;
          }
          if (
            that.visitForm.title.length < 2 ||
            that.visitForm.title.length >= 15
          ) {
            that.$vux.toast.show({
              text: '请输入标题，长度在2-15位之间!',
              type: 'text',
              time: 1000
            });
            this.obj1.showErrorInfo1 = "请输入标题，长度在2-15位之间!";
            return;
          }
          if (that.visitForm.customer === "") {
            that.$vux.toast.show({
              text: '请输入客户名称!',
              type: 'text',
              time: 1000
            });
            this.obj1.showErrorInfo2 = "请输入客户名称!";
            return;
          }
          if (that.visitForm.contact === "") {
            that.$vux.toast.show({
              text: '请输入联系人!',
              type: 'text',
              time: 1000
            });
            this.obj1.showErrorInfo3 = "请输入联系人!";
            return;
          }
          if (that.visitForm.destination === "") {
            that.$vux.toast.show({
              text: '请输入目的地!',
              type: 'text',
              time: 1000
            });
            this.obj1.showErrorInfo4 = "请输入目的地!";
            return;
          }
          if (that.visitForm.startDate === "") {
            that.$vux.toast.show({
              text: '请选择开始时间!',
              type: 'text',
              time: 1000
            });
            this.obj1.showErrorInfo6 = "请选择开始时间!";
            return;
          }
          if (that.visitForm.endDate === "") {
            that.$vux.toast.show({
              text: '请选择结束时间!',
              type: 'text',
              time: 1000
            });
            this.obj1.showErrorInfo7 = "请选择结束时间!";
            return;
          } else {
            const startTime = new Date(this.visitForm.startDate);
            const endTime = new Date(this.visitForm.endDate);
            if (startTime - endTime >= 0) {
              that.$vux.toast.show({
                text: '结束时间不能大于或等于开始时间!',
                type: 'text',
                time: 1000
              });
              that.obj1.showErrorInfo7 = "结束时间不能大于或等于开始时间";
              return;
            } else {
              that.obj1.showErrorInfo7 = "";
            }
          }
          if (that.visitForm.remark === "") {
            this.obj1.showErrorInfo8 = "请输入拜访目的!";
            that.$vux.toast.show({
              text: '请输入拜访目的!',
              type: 'text',
              time: 1000
            });
            return;
          }
        }
        if (parseInt(this.infoType) === 5) {
          const that = this;
          if (that.overtimeForm.processTypeId === "") {
            that.obj1.showErrorInfo9 = "请选择审批类型!";
            that.$vux.toast.show({
              text: '请选择审批类型!',
              type: 'text',
              time: 1000
            });
            return;
          }
          if (that.overtimeForm.type === "") {
            this.obj1.showErrorInfo2 = "请选择类型!";
            that.$vux.toast.show({
              text: '请选择类型!',
              type: 'text',
              time: 1000
            });
            return;
          }
          if (that.overtimeForm.startDate === "") {
            this.obj1.showErrorInfo3 = "请选择开始时间!";
            that.$vux.toast.show({
              text: '请选择开始时间!',
              type: 'text',
              time: 1000
            });
            return;
          }
          if (that.overtimeForm.endDate === "") {
            this.obj1.showErrorInfo4 = "请选择结束时间!";
            that.$vux.toast.show({
              text: '请选择结束时间!',
              type: 'text',
              time: 1000
            });
            return;
          } else {
            const startTime = new Date(this.overtimeForm.startDate);
            const endTime = new Date(this.overtimeForm.endDate);
            if (startTime - endTime >= 0) {
              that.obj1.showErrorInfo4 = "结束时间不能大于或等于开始时间";
              that.$vux.toast.show({
                text: '结束时间不能大于或等于开始时间!',
                type: 'text',
                time: 1000
              });
              return;
            } else {
              that.obj1.showErrorInfo4 = "";
            }
          }
          if (that.overtimeForm.hours === "") {
            this.obj1.showErrorInfo8 = "请选择加班时长!";
            that.$vux.toast.show({
              text: '请选择加班时长!',
              type: 'text',
              time: 1000
            });
            return;
          } else {
            if (Number(that.overtimeForm.hours) <= 0) {
              that.obj1.showErrorInfo8 = "加班时长不能小于或等于0!";
              that.$vux.toast.show({
                text: '加班时长不能小于或等于0!',
                type: 'text',
                time: 1000
              });
              return;
            } else {
              that.obj1.showErrorInfo8 = "";
            }
            let overhour_str =
              parseFloat(that.overtimeForm.hours).toFixed(1) + "";
            if (
              overhour_str[overhour_str.length - 1] !== "0" &&
              overhour_str[overhour_str.length - 1] !== "5"
            ) {
              this.obj1.showErrorInfo8 = "加班时长只能是.5或整数";
              that.$vux.toast.show({
                text: '加班时长只能是.5或整数!',
                type: 'text',
                time: 1000
              });
              return;
            }
            if (this.overtimeForm.hours > 10) {
              this.obj1.showErrorInfo8 = "加班时长最多10小时";
              that.$vux.toast.show({
                text: '加班时长最多10小时!',
                type: 'text',
                time: 1000
              });
              return;
            }
          }
          if (that.overtimeForm.remark === "") {
            this.obj1.showErrorInfo6 = "请输入申请原因!";
            that.$vux.toast.show({
              text: '请输入申请原因!',
              type: 'text',
              time: 1000
            });
            return;
          }
        }
        if (parseInt(this.infoType) === 6) {
          const that = this;
          if (that.leaveForm.processTypeId === "") {
            that.obj1.showErrorInfo1 = "请选择审批类型!";
            that.$vux.toast.show({
              text: '请选择审批类型!',
              type: 'text',
              time: 1000
            });
            return;
          }
          if (that.leaveForm.type === "") {
            this.obj1.showErrorInfo2 = "请输入类型!";
            that.$vux.toast.show({
              text: '请输入类型!',
              type: 'text',
              time: 1000
            });
            return;
          }
          if (that.leaveForm.startDate === "") {
            this.obj1.showErrorInfo3 = "请选择开始时间!";
            that.$vux.toast.show({
              text: '请选择开始时间!',
              type: 'text',
              time: 1000
            });
            return;
          }
          if (that.leaveForm.endDate === "") {
            this.obj1.showErrorInfo4 = "请选择结束时间!";
            that.$vux.toast.show({
              text: '请选择结束时间!',
              type: 'text',
              time: 1000
            });
            return;
          } else {
            const startTime = new Date(this.leaveForm.startDate);
            const endTime = new Date(this.leaveForm.endDate);
            if (startTime - endTime >= 0) {
              that.obj1.showErrorInfo4 = "结束时间不能大于或等于开始时间!";
              that.$vux.toast.show({
                text: '结束时间不能大于或等于开始时间!',
                type: 'text',
                time: 1000
              });
              return;
            } else {
              that.obj1.showErrorInfo4 = "";
            }
          }
          if (that.leaveForm.hours === "") {
            this.obj1.showErrorInfo9 = "请输入请假时长!";
            that.$vux.toast.show({
              text: '请输入请假时长!',
              type: 'text',
              time: 1000
            });
            return;
          } else {
            if (Number(that.leaveForm.hours) <= 0) {
              that.obj1.showErrorInfo9 = "请假时长不能小于或等于0!";
              that.$vux.toast.show({
                text: '请假时长不能小于或等于0!',
                type: 'text',
                time: 1000
              });
              return;
            } else {
              that.obj1.showErrorInfo9 = "";
            }
            let hour_str = parseFloat(that.leaveForm.hours).toFixed(1) + "";
            if (
              hour_str[hour_str.length - 1] !== "0" &&
              hour_str[hour_str.length - 1] !== "5"
            ) {
              this.obj1.showErrorInfo9 = "请假时长只能是.5或整数";
              that.$vux.toast.show({
                text: '请假时长只能是.5或整数!',
                type: 'text',
                time: 1000
              });
              return;
            }
          }
          if (this.leaveForm.type === "3" || this.leaveForm.type === 3) {
            let flag = false;
            let hours = parseFloat(this.leaveForm.hours);
            let max = parseFloat(this.temporaryTime);
            if (hours > max) {
              this.obj1.showErrorInfo9 = "请假时长不能大于可调休时长";
              that.$vux.toast.show({
                text: '请假时长不能大于可调休时长!',
                type: 'text',
                time: 1000
              });
              this.leaveForm.endDate = "";
              this.leaveForm.hours = 0;
              flag = true;
              return;
            }
            if (flag) {
              return;
            }
          }
          if (that.leaveForm.contact === "") {
            this.obj1.showErrorInfo6 = "请选择紧急联系人!";
            that.$vux.toast.show({
              text: '请选择紧急联系人!',
              type: 'text',
              time: 1000
            });
            return;
          }
          if (that.leaveForm.phone === "") {
            this.obj1.showErrorInfo7 = "请输入紧急联系电话!";
            that.$vux.toast.show({
              text: '请输入紧急联系电话!',
              type: 'text',
              time: 1000
            });
            return;
          } else {
            var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
            if (!myreg.test(that.leaveForm.phone)) {
              that.obj1.showErrorInfo7 = "联系电话格式不正确!";
              that.$vux.toast.show({
                text: '联系电话格式不正确!',
                type: 'text',
                time: 1000
              });
              return;
            } else {
              that.obj1.showErrorInfo7 = "";
            }
          }
          if (that.leaveForm.remark === "") {
            this.obj1.showErrorInfo8 = "请输入申请原因!";
            that.$vux.toast.show({
              text: '请输入申请原因!',
              type: 'text',
              time: 1000
            });
            return;
          }
        }
        if (parseInt(this.infoType) === 10) {
          const that = this;
          if (that.radioList.length > 0) {
            if (that.salesLeaveForm.processTypeId === "") {
              that.obj1.showErrorInfo1 = "请选择审批类型!";
              that.$vux.toast.show({
                text: '请选择审批类型!',
                type: 'text',
                time: 1000
              });
              return;
            }
            if (that.salesLeaveForm.leaveId === "") {
              this.obj1.showErrorInfo2 = "请选择请假单";
              that.$vux.toast.show({
                text: '请选择请假单!',
                type: 'text',
                time: 1000
              });
              return;
            }
            if (that.salesLeaveForm.startDate === "") {
              this.obj1.showErrorInfo3 = "请选择开始时间!";
              that.$vux.toast.show({
                text: '请选择开始时间!',
                type: 'text',
                time: 1000
              });
              return;
            }
            if (that.salesLeaveForm.endDate === "") {
              this.obj1.showErrorInfo4 = "请选择结束时间!";
              that.$vux.toast.show({
                text: '请选择结束时间!',
                type: 'text',
                time: 1000
              });
              return;
            } else {
              const startTime = new Date(this.salesLeaveForm.startDate);
              const endTime = new Date(this.salesLeaveForm.endDate);
              if (startTime - endTime >= 0) {
                that.obj1.showErrorInfo4 = "结束时间不能大于或等于开始时间!";
                that.$vux.toast.show({
                  text: '结束时间不能大于或等于开始时间!',
                  type: 'text',
                  time: 1000
                });
                return;
              } else {
                that.obj1.showErrorInfo4 = "";
              }
            }
            if (that.salesLeaveForm.hours === "") {
              this.obj1.showErrorInfo9 = "请输入销假时长!";
              that.$vux.toast.show({
                text: '请输入销假时长!',
                type: 'text',
                time: 1000
              });
              return;
            } else {
              if (Number(that.salesLeaveForm.hours) <= 0) {
                that.obj1.showErrorInfo9 = "销假时长不能小于或等于0!";
                that.$vux.toast.show({
                  text: '销假时长不能小于或等于0!',
                  type: 'text',
                  time: 1000
                });
                return;
              } else {
                that.obj1.showErrorInfo9 = "";
              }
              let hour_str = parseFloat(that.salesLeaveForm.hours).toFixed(1) + "";
              if (
                hour_str[hour_str.length - 1] !== "0" &&
                hour_str[hour_str.length - 1] !== "5"
              ) {
                this.obj1.showErrorInfo9 = "销假时长只能是.5或整数";
                that.$vux.toast.show({
                  text: '销假时长只能是.5或整数!',
                  type: 'text',
                  time: 1000
                });
                return;
              }
              console.log(parseFloat(this.salesLeaveForm.hours))
              console.log(parseFloat(this.max_leave_hours))
              if (parseFloat(this.salesLeaveForm.hours) > parseFloat(this.max_leave_hours)) {
                this.obj1.showErrorInfo9 = "销假时长不能大于请假时长";
                that.$vux.toast.show({
                  text: '销假时长不能大于请假时长!',
                  type: 'text',
                  time: 1000
                });
                return;
              }
            }
            that.salesLeaveForm.type = that.sales_leave_type
            if (that.salesLeaveForm.remark === "") {
              this.obj1.showErrorInfo8 = "请输入申请原因!";
              that.$vux.toast.show({
                text: '请输入申请原因!',
                type: 'text',
                time: 1000
              });
              return;
            }
          } else {
            return
          }
        }
        const that = this;
        let info = {};
        let title = "";
        if (this.viewType === "add") {
          switch (parseInt(this.infoType)) {
            case 1:
              info = this.procurementForm;
              title = "采购添加成功！";
              break;
            case 2: {
              info = this.visitForm;
              title = "拜访添加成功！";
              break;
            }
            case 3:
              info = this.sealForm;
              title = "用章申请添加成功！";
              break;
            case 4: {
              info = this.refundForm;
              title = "报销申请添加成功！";
              break;
            }
            case 5:
              info = this.overtimeForm;
              title = "加班申请添加成功！";
              break;
            case 6:
              info = this.leaveForm;
              title = "请假添加成功！";
              break;
            case 7:
              info = this.carForm;
              title = "用车申请添加成功！";
              break;
            case 8:
              info = this.receiveForm;
              title = "物品领用添加成功！";
              break;
            case 9: {
              info = this.procurementapplyForm;
              title = "采购申请单添加成功！";
              break;
            }
            case 10:
              info = this.salesLeaveForm;
              title = "销假添加成功！";
              break;
          }
        } else {
          switch (parseInt(this.infoType)) {
            case 1:
              info = this.procurementForm;
              title = "采购更新成功！";
              break;
            case 2: {
              info = this.visitForm;
              title = "拜访更新成功！";
              break;
            }
            case 3:
              info = this.sealForm;
              title = "用章申请更新成功！";
              break;
            case 4: {
              info = this.refundForm;
              title = "报销申请添更新成功！";
              break;
            }
            case 5:
              info = this.overtimeForm;
              title = "加班申请更新成功！";
              break;
            case 6:
              info = this.leaveForm;
              title = "请假更新成功！";
              break;
            case 7:
              info = this.carForm;
              title = "用车申请更新成功！";
              break;
            case 8:
              info = this.receiveForm;
              title = "物品领用更新成功！";
              break;
            case 9: {
              info = this.procurementapplyForm;
              title = "采购申请单更新成功！";
              break;
            }
            case 10:
              info = this.salesLeaveForm;
              title = "销假更新成功！";
              break;
          }
        }
        this.disabled2 = true;
        this.$vux.loading.show({
          text: "提交中"
        });
        // setTimeout(() => {
        // this.$vux.loading.hide()
        // }, 1000)
        saveApprovalType(info, this.requestUrl).then(res => {
          console.log(res, "gfffffffffffffffffff");
          if (res.code === 200 || res.code === "200") {
            that.$vux.loading.hide();
            that.$vux.toast.show({
              text: title,
              type: "success",
              time: 1000
            });
            setTimeout(() => {
              that.$router.go(-1);
              that.disabled2 = false;
            }, 1000);
          } else {
            that.$vux.loading.hide();
            that.$vux.toast.show({
              text: res.msg,
              type: "text",
              time: 1000
            });
            that.disabled2 = false;
          }
        });
      },
      removeApplyInfo() {},
      addApplyInfo() {},
      // 上传文件
      openFile() {
        this.$refs.file.click();
      },
      fileChange() {}
    }
  };

</script>
<style lang="less" scoped>
  .new_bg {
    // margin-top: 0.5rem;
    margin-bottom: 2rem;

    & /deep/.weui-textarea {
      line-height: 0.5rem;
    }

    .new_form {
      background: #fff;

      .form_item {
        padding: 0.16rem 0.3rem;
        border-bottom: 0.02rem solid #f2f2f2;

        .form_line {
          display: block;
          width: 100%;
        }

        .overflow_line_one {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        & /deep/ .weui-cell_access .weui-cell__ft:after {
          content: "";
          // margin-right: 0.15rem !important;
          // right: 7px;
        }

        .text_left {
          & /deep/.weui-cell__ft {
            width: 100%;
            color: #757575;
          }
        }

        & /deep/.weui-cells {
          display: flex;
          align-items: center;
          background: transparent;
          margin-top: 0;
          justify-content: space-between;

          span {
            // color: #333333;
            color: #666666;
            font-size: 0.26rem;
            width: 22%;
            text-align: left;
            padding-left: 0.1rem;


            .red_star {
              font-family: 'Arial Normal', 'Arial';
              color: #ff0000;
              font-weight: 400;
              font-style: normal;
              font-size: 0.28rem;
              padding-left: 0.02rem;
            }
          }

          .normal_span {
            font-size: 0.24rem;
            font-style: normal;
            padding-left: 0.1rem;
          }

          .iconfont {
            font-size: 0.44rem;
            // padding-left: 0.4rem;
            color: #c8c8cd;
            font-weight: 700;
            text-align: right;
          }

          .vux-cell-placeholder {
            // color: #757575;
            color: #cccccc;
          }

          .weui-cell {
            margin-left: 0.1rem;
            width: 70%;
            background: #fff;
            border-radius: 0.1rem;
            // padding: 0.16rem;
            font-size: 0.28rem;
            padding: 0;
            padding-left: 0.2rem;
            // padding-right: 0.2rem;
            line-height: 0.67rem;

            .weui-cell__bd {
              height: 100%;

              .weui-input {
                width: 100%;
                height: 100%;
                height: 0.68rem;
                display: inline-block;
                text-align: right;
              }
            }

            .weui-cell__ft {
              // text-align: left;
              text-align: right;

              .vux-x-input-right-full {
                height: auto;
                line-height: 1;
              }

              .weui-icon-warn {
                font-size: 0.28rem;
                margin-top: 10px;
              }

              .vux-input-icon.weui-icon-warn:before {
                font-size: 0.28rem;
              }

              .vux-input-icon.weui-icon-success:before {
                font-size: 0.28rem;
              }
            }
          }
        }

        & /deep/.small_size {
          span {
            color: #333333;
            font-size: 0.23rem;
            width: 24%;
            text-align: left;

            .red_star {
              font-family: 'Arial Normal', 'Arial';
              color: #ff0000;
              font-weight: 400;
              font-style: normal;
              font-size: 0.28rem;
            }
          }
        }

        & /deep/.weui-cells:before {
          border-top: none;
        }

        & /deep/.weui-cells:after {
          border-bottom: none;
        }

        & /deep/.weui-cell:before {
          border-top: none;
        }

        .save_btn {
          border-radius: 0.5rem;
        }

        .weui-btn_default {
          color: #fff;
          background-color: #409eff;
          border-color: #409eff;
          width: 45%;
          font-size: 0.3rem;
        }

        .weui-btn_disabled {
          color: rgba(0, 0, 0, 0.3);
          background-color: rgba(0, 0, 0, 0.2);
          border-color: rgba(0, 0, 0, 0.2);
        }
      }

      .form_btn {
        padding-top: 0.5rem;
        background: #f9f9f9;

        .weui-btn_default {
          width: 60%;
        }
      }

      .form_item:last-child {
        border-bottom: none;
      }

      .list_item {
        padding-left: 0.5rem;
        display: flex;
        align-items: center;

        .weui-btn_default {
          color: #fff;
          background-color: #409eff;
          border-color: #409eff;
          font-size: 0.26rem;
        }
      }

      .file_form {
        & /deep/.weui-cells {
          background: transparent;

          .weui-cell {
            background: transparent;
          }
        }
      }

      .radio_form {
        & /deep/.weui-cell {
          .weui-cell__ft {
            width: 100%;
          }
        }
      }

      .radio_list {
        .vux-checker-box {
          padding-left: 0.1rem;
        }

        .demo5-item {
          width: 0.7rem;
          text-align: center;
          border-radius: 3px;
          border: 1px solid #ccc;
          background-color: #fff;
          margin-right: 0.04rem;
          font-size: 0.26rem;
        }

        .demo5-item-selected {
          border-color: #67c23a;
        }
      }

      .item_number {
        & /deep/.weui-cells {
          background: transparent;

          .weui-cell {
            padding: 0;
            background: transparent;

            .weui-cell__ft {
              div {
                .vux-number-selector {
                  svg {
                    fill: #757575;
                  }
                }

                input {
                  font-size: 0.3rem;
                }
              }
            }
          }
        }
      }

      .flex_start {
        padding-top: 0.26rem;
        & /deep/.weui-cells {
          align-items: flex-start;
        }
      }

      .flex_line {
        & /deep/.weui-cells {
          display: block;

          .weui-cell {
            width: 100%;
            margin-right: 0;
            padding-left: 0;
          }
        }
      }
    }

    .errorInfo {
      font-size: 0.24rem;
      width: 100%;
      height: 0.5rem;
      padding: 0;
      // margin: 0.2rem 0;
      color: red;
      margin-left: 1.8rem;
    }

    & /deep/.weui-toast {
      width: 4rem !important;
      height: 4rem !important;
      background-color: rgba(0, 0, 0, 0.5) !important;
    }

  }

</style>
