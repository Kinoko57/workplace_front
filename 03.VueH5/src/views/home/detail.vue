<template>
  <div class="detail_bg" ref="container5">
    <div class="detail_head">
      <div class="detail_block">
        <p class="head_title">
          <span v-if="infoType==5">加班类别</span>
          <span v-if="infoType==6">请假类别</span>
          <span v-if="infoType==2">目的地</span>
          <span v-if="infoType==10">审批类型</span>
          <span v-if="infoType==7">用车类别</span>
          <span v-if="infoType==3">用章类型</span>
          <span v-if="infoType==8">领用类型</span>
          <span v-if="infoType==4">总费用</span>
          <span v-if="infoType==11">总费用</span>
          <span v-if="infoType==1">申请人</span>
          <span v-if="infoType==9">申请人</span>
        </p>
        <p>
          <span v-if="infoType==5" class="over_text">{{approvalInfo.type}}</span>
          <span v-if="infoType==6" class="over_text">{{approvalInfo.type}}</span>
          <span v-if="infoType==2" class="over_text">{{approvalInfo.destination}}</span>
          <span v-if="infoType==10" class="over_text">{{approvalInfo.processTypeName}}</span>
          <span v-if="infoType==7" class="over_text">{{approvalInfo.type}}</span>
          <span v-if="infoType==3" class="over_text">{{approvalInfo.subject}}</span>
          <span v-if="infoType==8" class="over_text">{{approvalInfo.type}}</span>
          <span v-if="infoType==4" class="over_text">{{approvalInfo.amount}}</span>
          <span v-if="infoType==11" class="over_text">{{approvalInfo.amount}}</span>
          <span v-if="infoType==1" class="over_text">{{approvalInfo.accountName}}</span>
          <span v-if="infoType==9" class="over_text">{{approvalInfo.accountName}}</span>
        </p>
      </div>
      <div class="detail_block">
        <p class="head_title">审批状态</p>
        <p>
          <span v-if="approvalInfo.status==4">审批完成</span>
          <span v-if="approvalInfo.status==2">审批驳回</span>
          <span v-if="approvalInfo.status!=2&&approvalInfo.status!=4">审批中</span>
        </p>
      </div>
      <div class="detail_block">
        <p class="head_title">
          <span v-if="infoType==5">加班时长</span>
          <span v-if="infoType==6">请假时长</span>
          <span v-if="infoType==2">联系人</span>
          <span v-if="infoType==10">销假时长</span>
          <span v-if="infoType==7">需要司机</span>
          <span v-if="infoType==3">用章用途</span>
          <span v-if="infoType==8">审批类型</span>
          <span v-if="infoType==4">报销人</span>
          <span v-if="infoType==11">申请人</span>
          <span v-if="infoType==1">折后金额</span>
        </p>
        <p>
          <span v-if="infoType==5" class="over_text">{{approvalInfo.hours}}</span>
          <span v-if="infoType==6" class="over_text">{{approvalInfo.hours}}</span>
          <span v-if="infoType==2" class="over_text">{{approvalInfo.contact}}</span>
          <span v-if="infoType==10" class="over_text">{{approvalInfo.hours}}</span>
          <span v-if="infoType==7" class="over_text">{{approvalInfo.isDriver==1?'是':'否'}}</span>
          <span v-if="infoType==3" class="over_text">{{approvalInfo.type}}</span>
          <span v-if="infoType==8" class="over_text">{{approvalInfo.processTypeName}}</span>
          <span v-if="infoType==4" class="over_text">{{approvalInfo.accountName}}</span>
          <span v-if="infoType==11" class="over_text">{{approvalInfo.accountName}}</span>
          <span v-if="infoType==1" class="over_text">{{approvalInfo.amount}}</span>
        </p>
      </div>
    </div>
    <div class="detail_step_view">
      <div class="step_view">
        <p class="step_img">
          <img src="@/assets/index/open.png" alt="" srcset="">
        </p>
        <p>发起审批</p>
        <i class="line short_line line_right line_active"></i>
      </div>
      <div class="step_view">
        <p class="step_img">
          <img src="@/assets/index/wait.png" alt="" srcset="" v-if="approvalInfo.status==0&&modeType!='audited'">
          <img src="@/assets/index/open.png" alt="" srcset=""
            v-if="((modeType =='audited'||approvalInfo.status==1)&&approvalInfo.status!=2)||approvalInfo.status==4">
          <img v-if="approvalInfo.status==2" src="@/assets/index/reject.png" alt="" srcset="">
        </p>
        <p v-if="approvalInfo.status!=2">审批中</p>
        <p v-if="approvalInfo.status==2">审批驳回</p>
        <!-- 我已审批或者审批中 -->
        <i class="line"
          :class="{'line_active':((modeType =='audited'||approvalInfo.status==1)&&approvalInfo.status!=2)||approvalInfo.status==4}"></i>
      </div>
      <div class="step_view">
        <p class="step_img">
          <img v-if="approvalInfo.status!=4" src="@/assets/index/wait.png" alt="" srcset="">
          <img v-if="approvalInfo.status==4" src="@/assets/index/open.png" alt="" srcset="">
        </p>
        <p>审批完成</p>
        <i class="line short_line line_left" :class="{'line_active':approvalInfo.status==4}"></i>
      </div>
    </div>
    <!-- <p class="detail_title">
      <span>{{ approvalInfo.code }}</span>
      <span>{{ approvalInfo.createdDate }}</span>
    </p> -->
    <!-- 采购付款审批单 -->
    <div v-if="infoType==1">
      <div class="show_detail">
        <p class="div_title">
          <span>基本信息</span>
          <span class="info_code">{{ approvalInfo.code }}</span>
        </p>
        <ul class="detail_info">
          <li>
            <div>
              <span class="title">申请单名称</span>
              <span v-if="approvalInfo.title.length<30">{{approvalInfo.title}}</span>
            </div>
            <div v-if="approvalInfo.title.length>=30">{{approvalInfo.title}}</div>
          </li>
          <li>
            <div>
              <span class="title">采购付款单号</span>
              <span v-if="approvalInfo.title.length<30">{{approvalInfo.orderNo}}</span>
            </div>
            <div v-if="approvalInfo.orderNo.length>=30">{{approvalInfo.orderNo}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请日期</span>
              <span v-if="approvalInfo.createdDate.length<30">{{approvalInfo.createdDate}}</span>
            </div>
            <div v-if="approvalInfo.createdDate.length>=30">{{approvalInfo.createdDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人</span>
              <span v-if="approvalInfo.accountName.length<30">{{approvalInfo.accountName}}</span>
            </div>
            <div v-if="approvalInfo.accountName.length>=30">{{approvalInfo.accountName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人部门</span>
              <span v-if="approvalInfo.organizeName.length<30">{{approvalInfo.organizeName}}</span>
            </div>
            <div v-if="approvalInfo.organizeName.length>=30">{{approvalInfo.organizeName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人岗位</span>
              <span v-if="approvalInfo.groupName.length<30">{{approvalInfo.groupName}}</span>
            </div>
            <div v-if="approvalInfo.groupName.length>=30">{{approvalInfo.groupName}}</div>
          </li>
          <li>
            <div>
              <span class="title">折后金额</span>
              <span v-if="approvalInfo.amount.length<30">{{approvalInfo.amount}}</span>
            </div>
            <div v-if="approvalInfo.amount.length>=30">{{approvalInfo.amount}}</div>
          </li>
          <li>
            <div>
              <span class="title">采购供应商</span>
              <span v-if="approvalInfo.supplierName.length<30">{{approvalInfo.supplierName}}</span>
            </div>
            <div v-if="approvalInfo.supplierName.length>=30">{{approvalInfo.supplierName}}</div>
          </li>
          <li>
            <div>
              <span class="title">采购付款明细</span>
            </div>
            <div class="file_list div_block">
              <p v-for="(info,index) in approvalInfo.sign" :key="index">
                <span>{{index+1}}、{{info.proName}}（{{info.proUnit}}）{{ info.proPrice }}X{{ info.proNum }}={{ info.proTotal }}</span>
              </p>
            </div>
          </li>
          <li>
            <div>
              <span class="title">合同凭证</span>
            </div>
            <div class="link_text div_block" v-if="approvalInfo.files.length>0">
              <span v-if="item.name!=''" v-for="(item,index) in approvalInfo.files" :key="index"
                style='display:block;margin: 5px 0;word-break: break-all;' @click="isShowFile(item)">{{ item.name }}</span>
            </div>
            <div class="div_block" v-if="approvalInfo.files.length==0">
              <span>暂无附件</span>
            </div>
          </li>
          <li>
            <div>
              <span class="title">原因说明</span>
              <span v-if="approvalInfo.remark.length<30">{{approvalInfo.remark}}</span>
            </div>
            <div v-if="approvalInfo.remark.length>=30">{{approvalInfo.remark}}</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 拜访审批单 -->
    <div v-if="infoType==2">
      <div class="show_detail">
        <p class="div_title">
          <span>基本信息</span>
          <span class="info_code">{{ approvalInfo.code }}</span>
        </p>
        <ul class="detail_info">
          <li>
            <div>
              <span class="title">申请单名称</span>
              <span v-if="approvalInfo.title.length<30">{{approvalInfo.title}}</span>
            </div>
            <div v-if="approvalInfo.title.length>=30">{{approvalInfo.title}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请日期</span>
              <span v-if="approvalInfo.createdDate.length<30">{{approvalInfo.createdDate}}</span>
            </div>
            <div v-if="approvalInfo.createdDate.length>=30">{{approvalInfo.createdDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人</span>
              <span v-if="approvalInfo.accountName.length<30">{{approvalInfo.accountName}}</span>
            </div>
            <div v-if="approvalInfo.accountName.length>=30">{{approvalInfo.accountName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人部门</span>
              <span v-if="approvalInfo.organizeName.length<30">{{approvalInfo.organizeName}}</span>
            </div>
            <div v-if="approvalInfo.organizeName.length>=30">{{approvalInfo.organizeName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人岗位</span>
              <span v-if="approvalInfo.groupName.length<30">{{approvalInfo.groupName}}</span>
            </div>
            <div v-if="approvalInfo.groupName.length>=30">{{approvalInfo.groupName}}</div>
          </li>
          <li>
            <div>
              <span class="title">客户名称</span>
              <span v-if="approvalInfo.customer.length<30">{{approvalInfo.customer}}</span>
            </div>
            <div v-if="approvalInfo.customer.length>=30">{{approvalInfo.customer}}</div>
          </li>
          <li>
            <div>
              <span class="title">联系人</span>
              <span v-if="approvalInfo.contact.length<30">{{approvalInfo.contact}}</span>
            </div>
            <div v-if="approvalInfo.contact.length>=30">{{approvalInfo.contact}}</div>
          </li>
          <li>
            <div>
              <span class="title">目的地</span>
              <span v-if="approvalInfo.destination.length<30">{{approvalInfo.destination}}</span>
            </div>
            <div v-if="approvalInfo.destination.length>=30">{{approvalInfo.destination}}</div>
          </li>
          <li>
            <div>
              <span class="title">陪同人</span>
              <span v-if="approvalInfo.accompany.length<30">{{approvalInfo.accompany}}</span>
            </div>
            <div v-if="approvalInfo.accompany.length>=30">{{approvalInfo.accompany}}</div>
          </li>
          <li>
            <div>
              <span class="title">开始时间</span>
              <span v-if="approvalInfo.startDate.length<30">{{approvalInfo.startDate}}</span>
            </div>
            <div v-if="approvalInfo.startDate.length>=30">{{approvalInfo.startDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">结束时间</span>
              <span v-if="approvalInfo.endDate.length<30">{{approvalInfo.endDate}}</span>
            </div>
            <div v-if="approvalInfo.endDate.length>=30">{{approvalInfo.endDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">拜访目的</span>
              <span v-if="approvalInfo.remark.length<30">{{approvalInfo.remark}}</span>
            </div>
            <div v-if="approvalInfo.remark.length>=30">{{approvalInfo.remark}}</div>
          </li>
          <li>
            <div>
              <span class="title">签到情况</span>
            </div>
            <div class="file_list div_block">
              <p v-for="(info,index) in approvalInfo.sign" :key="index" v-show="approvalInfo.sign.length>0"
                style="display: block;">
                <span>{{index+1}}、{{info.accountName}}于{{ info.signInDate }}在{{ info.signInAddress }}签到</span>
                <span v-if="info.signOutDate!=''">，于{{ info.signOutAddress }}在{{ info.signOutDate }}签退</span>
              </p>
              <p v-show="approvalInfo.sign.length==0">暂无签到</p>
            </div>
          </li>
        </ul>
      </div>
      <!-- <x-table full-bordered style="background-color:#fff;" class="table_info">
        <tbody>
          <tr>
            <td class="title">申请单名称</td>
            <td>{{approvalInfo.title}}</td>
            <td class="title">申请人</td>
            <td>{{ approvalInfo.accountName }}</td>
          </tr>
          <tr>
            <td class="title">申请人部门</td>
            <td>{{ approvalInfo.organizeName }}</td>
            <td class="title">申请人岗位</td>
            <td>{{ approvalInfo.groupName }}</td>
          </tr>
          <tr>
            <td class="title">客户名称</td>
            <td>{{ approvalInfo.customer }}</td>
            <td class="title">联系人</td>
            <td>{{ approvalInfo.contact }}</td>
          </tr>
          <tr>
            <td class="title">目的地</td>
            <td>{{ approvalInfo.destination }}</td>
            <td class="title">陪同人</td>
            <td>{{ approvalInfo.accompany }}</td>
          </tr>
          <tr>
            <td class="title">开始时间</td>
            <td>{{ approvalInfo.startDate }}</td>
            <td class="title">结束时间</td>
            <td>{{approvalInfo.endDate}}</td>
          </tr>
          <tr>
            <td class="title" rowspan="2">拜访目的</td>
            <td colspan="3" rowspan="2">{{ approvalInfo.remark }}</td>
          </tr>
        </tbody>
      </x-table> -->
      <!-- <p class="detail_title">
        <span>签到情况</span>
      </p>
      <x-table full-bordered style="background-color:#fff;" class="table_info">
        <thead>
          <tr>
            <th>人员</th>
            <th>签到地点</th>
            <th>签到时间</th>
            <th>签退地点</th>
            <th>签退时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(info,index) in approvalInfo.sign" :key="index">
            <td>{{ info.accountName }}</td>
            <td>{{ info.signInAddress }}</td>
            <td>{{ info.signInDate }}</td>
            <td>{{ info.signOutAddress }}</td>
            <td>{{ info.signOutDate }}</td>
          </tr>
        </tbody>
      </x-table> -->
    </div>
    <!-- 用章审批单 -->
    <div v-if="infoType==3">
      <div class="show_detail">
        <p class="div_title">
          <span>基本信息</span>
          <span class="info_code">{{ approvalInfo.code }}</span>
        </p>
        <ul class="detail_info">
          <li>
            <div>
              <span class="title">申请单名称</span>
              <span v-if="approvalInfo.title.length<30">{{approvalInfo.title}}</span>
            </div>
            <div v-if="approvalInfo.title.length>=30">{{approvalInfo.title}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请日期</span>
              <span v-if="approvalInfo.createdDate.length<30">{{approvalInfo.createdDate}}</span>
            </div>
            <div v-if="approvalInfo.createdDate.length>=30">{{approvalInfo.createdDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人</span>
              <span v-if="approvalInfo.accountName.length<30">{{approvalInfo.accountName}}</span>
            </div>
            <div v-if="approvalInfo.accountName.length>=30">{{approvalInfo.accountName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人部门</span>
              <span v-if="approvalInfo.organizeName.length<30">{{approvalInfo.organizeName}}</span>
            </div>
            <div v-if="approvalInfo.organizeName.length>=30">{{approvalInfo.organizeName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人岗位</span>
              <span v-if="approvalInfo.groupName.length<30">{{approvalInfo.groupName}}</span>
            </div>
            <div v-if="approvalInfo.groupName.length>=30">{{approvalInfo.groupName}}</div>
          </li>
          <li>
            <div>
              <span class="title">审批类型</span>
              <span v-if="approvalInfo.processTypeName.length<30">{{approvalInfo.processTypeName}}</span>
            </div>
            <div v-if="approvalInfo.processTypeName.length>=30">{{approvalInfo.processTypeName}}</div>
          </li>
          <li>
            <div>
              <span class="title">用章类型</span>
              <span v-if="approvalInfo.subject.length<30">{{approvalInfo.subject}}</span>
            </div>
            <div v-if="approvalInfo.subject.length>=30">{{approvalInfo.subject}}</div>
          </li>
          <li>
            <div>
              <span class="title">用章用途</span>
              <span v-if="approvalInfo.type.length<30">{{approvalInfo.type}}</span>
            </div>
            <div v-if="approvalInfo.type.length>=30">{{approvalInfo.type}}</div>
          </li>
          <li>
            <div>
              <span class="title">用章时间</span>
              <span v-if="approvalInfo.useDate.length<30">{{approvalInfo.useDate}}</span>
            </div>
            <div v-if="approvalInfo.useDate.length>=30">{{approvalInfo.useDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请原因</span>
              <span v-if="approvalInfo.remark.length<30">{{approvalInfo.remark}}</span>
            </div>
            <div v-if="approvalInfo.remark.length>=30">{{approvalInfo.remark}}</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 报销审批单 -->
    <div v-if="infoType==4">
      <div class="show_detail">
        <p class="div_title">
          <span>基本信息</span>
          <span class="info_code">{{ approvalInfo.code }}</span>
        </p>
        <ul class="detail_info">
          <li>
            <div>
              <span class="title">申请单名称</span>
              <span v-if="approvalInfo.title.length<30">{{approvalInfo.title}}</span>
            </div>
            <div v-if="approvalInfo.title.length>=30">{{approvalInfo.title}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请日期</span>
              <span v-if="approvalInfo.createdDate.length<30">{{approvalInfo.createdDate}}</span>
            </div>
            <div v-if="approvalInfo.createdDate.length>=30">{{approvalInfo.createdDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人</span>
              <span v-if="approvalInfo.accountName.length<30">{{approvalInfo.accountName}}</span>
            </div>
            <div v-if="approvalInfo.accountName.length>=30">{{approvalInfo.accountName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人部门</span>
              <span v-if="approvalInfo.organizeName.length<30">{{approvalInfo.organizeName}}</span>
            </div>
            <div v-if="approvalInfo.organizeName.length>=30">{{approvalInfo.organizeName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人岗位</span>
              <span v-if="approvalInfo.groupName.length<30">{{approvalInfo.groupName}}</span>
            </div>
            <div v-if="approvalInfo.groupName.length>=30">{{approvalInfo.groupName}}</div>
          </li>
          <li>
            <div>
              <span class="title">报销金额</span>
              <span v-if="approvalInfo.amount.length<30">{{approvalInfo.amount}}</span>
            </div>
            <div v-if="approvalInfo.amount.length>=30">{{approvalInfo.amount}}</div>
          </li>
          <li>
            <div>
              <span class="title">开户姓名</span>
              <span v-if="approvalInfo.name.length<30">{{approvalInfo.name}}</span>
            </div>
            <div v-if="approvalInfo.name.length>=30">{{approvalInfo.name}}</div>
          </li>
          <li>
            <div>
              <span class="title">开户行</span>
              <span v-if="approvalInfo.bank.length<30">{{approvalInfo.bank}}</span>
            </div>
            <div v-if="approvalInfo.bank.length>=30">{{approvalInfo.bank}}</div>
          </li>
          <li>
            <div>
              <span class="title">银行卡号</span>
              <span v-if="approvalInfo.card.length<30">{{approvalInfo.card}}</span>
            </div>
            <div v-if="approvalInfo.card.length>=30">{{approvalInfo.card}}</div>
          </li>
          <li>
            <div>
              <span class="title">报销明细</span>
            </div>
            <div class="file_list div_block">
              <div v-for="(info,index) in approvalInfo.sign" :key="index" class="div_block bottom_none">
                <p>
                  <span class="refund_text">{{index+1}}、{{info.proName}}
                    <br>{{ info.proPrice }}元X{{ info.proNum }}={{ info.proTotal }}</span>
                  <span class="flies" @click="viewFiles(index)"
                    v-if="fileOpen!=index">查看附件({{info.refundFilesArr.length}})</span>
                  <span class="flies" @click="viewFiles(-1)" v-if="fileOpen==index">收起附件</span>
                </p>
                <div class="files_list div_block bottom_none link_text" v-if="fileOpen==index">
                  <span v-if="item.name!=''" v-for="(item,index) in info.refundFilesArr" :key="index"
                    style="display:block;margin: 5px 0;word-break: break-all;" @click="isShowFile(item)">{{ item.name }}</span>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div>
              <span class="title">申请原因</span>
              <span v-if="approvalInfo.remark.length<30">{{approvalInfo.remark}}</span>
            </div>
            <div v-if="approvalInfo.remark.length>=30">{{approvalInfo.remark}}</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 加班审批单 -->
    <div v-if="infoType==5">
      <div class="show_detail">
        <p class="div_title">
          <span>基本信息</span>
          <span class="info_code">{{ approvalInfo.code }}</span>
        </p>
        <ul class="detail_info">
          <li>
            <div>
              <span class="title">申请单名称</span>
              <span v-if="approvalInfo.title.length<30">{{approvalInfo.title}}</span>
            </div>
            <div v-if="approvalInfo.title.length>=30">{{approvalInfo.title}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请日期</span>
              <span v-if="approvalInfo.createdDate.length<30">{{approvalInfo.createdDate}}</span>
            </div>
            <div v-if="approvalInfo.createdDate.length>=30">{{approvalInfo.createdDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人</span>
              <span v-if="approvalInfo.accountName.length<30">{{approvalInfo.accountName}}</span>
            </div>
            <div v-if="approvalInfo.accountName.length>=30">{{approvalInfo.accountName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人部门</span>
              <span v-if="approvalInfo.organizeName.length<30">{{approvalInfo.organizeName}}</span>
            </div>
            <div v-if="approvalInfo.organizeName.length>=30">{{approvalInfo.organizeName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人岗位</span>
              <span v-if="approvalInfo.groupName.length<30">{{approvalInfo.groupName}}</span>
            </div>
            <div v-if="approvalInfo.groupName.length>=30">{{approvalInfo.groupName}}</div>
          </li>
          <li>
            <div>
              <span class="title">审批类型</span>
              <span v-if="approvalInfo.processTypeName.length<30">{{approvalInfo.processTypeName}}</span>
            </div>
            <div v-if="approvalInfo.processTypeName.length>=30">{{approvalInfo.processTypeName}}</div>
          </li>
          <li>
            <div>
              <span class="title">加班类型</span>
              <span v-if="approvalInfo.type.length<30">{{approvalInfo.type}}</span>
            </div>
            <div v-if="approvalInfo.type.length>=30">{{approvalInfo.type}}</div>
          </li>
          <li>
            <div>
              <span class="title">开始时间</span>
              <span v-if="approvalInfo.startDate.length<30">{{approvalInfo.startDate}}</span>
            </div>
            <div v-if="approvalInfo.startDate.length>=30">{{approvalInfo.startDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">结束时间</span>
              <span v-if="approvalInfo.endDate.length<30">{{approvalInfo.endDate}}</span>
            </div>
            <div v-if="approvalInfo.endDate.length>=30">{{approvalInfo.endDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">加班时长</span>
              <span v-if="approvalInfo.hours.length<30">{{approvalInfo.hours}}</span>
            </div>
            <div v-if="approvalInfo.hours.length>=30">{{approvalInfo.hours}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请原因</span>
              <span v-if="approvalInfo.remark.length<30">{{approvalInfo.remark}}</span>
            </div>
            <div v-if="approvalInfo.remark.length>=30">{{approvalInfo.remark}}</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 请假审批单 -->
    <div v-if="infoType==6">
      <div class="show_detail">
        <p class="div_title">
          <span>基本信息</span>
          <span class="info_code">{{ approvalInfo.code }}</span>
        </p>
        <ul class="detail_info">
          <li>
            <div>
              <span class="title">申请单名称</span>
              <span v-if="approvalInfo.title.length<30">{{approvalInfo.title}}</span>
            </div>
            <div v-if="approvalInfo.title.length>=30">{{approvalInfo.title}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请日期</span>
              <span v-if="approvalInfo.createdDate.length<30">{{approvalInfo.createdDate}}</span>
            </div>
            <div v-if="approvalInfo.createdDate.length>=30">{{approvalInfo.createdDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人</span>
              <span v-if="approvalInfo.accountName.length<30">{{approvalInfo.accountName}}</span>
            </div>
            <div v-if="approvalInfo.accountName.length>=30">{{approvalInfo.accountName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人部门</span>
              <span v-if="approvalInfo.organizeName.length<30">{{approvalInfo.organizeName}}</span>
            </div>
            <div v-if="approvalInfo.organizeName.length>=30">{{approvalInfo.organizeName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人岗位</span>
              <span v-if="approvalInfo.groupName.length<30">{{approvalInfo.groupName}}</span>
            </div>
            <div v-if="approvalInfo.groupName.length>=30">{{approvalInfo.groupName}}</div>
          </li>
          <li>
            <div>
              <span class="title">审批类型</span>
              <span v-if="approvalInfo.processTypeName.length<30">{{approvalInfo.processTypeName}}</span>
            </div>
            <div v-if="approvalInfo.processTypeName.length>=30">{{approvalInfo.processTypeName}}</div>
          </li>
          <li>
            <div>
              <span class="title">请假类型</span>
              <span v-if="approvalInfo.type.length<30">{{approvalInfo.type}}</span>
            </div>
            <div v-if="approvalInfo.type.length>=30">{{approvalInfo.type}}</div>
          </li>
          <li>
            <div>
              <span class="title">开始时间</span>
              <span v-if="approvalInfo.startDate.length<30">{{approvalInfo.startDate}}</span>
            </div>
            <div v-if="approvalInfo.startDate.length>=30">{{approvalInfo.startDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">结束时间</span>
              <span v-if="approvalInfo.endDate.length<30">{{approvalInfo.endDate}}</span>
            </div>
            <div v-if="approvalInfo.endDate.length>=30">{{approvalInfo.endDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">请假时长</span>
              <span v-if="approvalInfo.hours.length<30">{{approvalInfo.hours}}</span>
            </div>
            <div v-if="approvalInfo.hours.length>=30">{{approvalInfo.hours}}</div>
          </li>
          <li>
            <div>
              <span class="title">联系电话</span>
              <span v-if="approvalInfo.phone.length<30">{{approvalInfo.phone}}</span>
            </div>
            <div v-if="approvalInfo.phone.length>=30">{{approvalInfo.phone}}</div>
          </li>
          <li>
            <div>
              <span class="title">紧急联系人</span>
              <span v-if="approvalInfo.contact.length<30">{{approvalInfo.contact}}</span>
            </div>
            <div v-if="approvalInfo.contact.length>=30">{{approvalInfo.contact}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请原因</span>
              <span v-if="approvalInfo.remark.length<30">{{approvalInfo.remark}}</span>
            </div>
            <div v-if="approvalInfo.remark.length>=30">{{approvalInfo.remark}}</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 用车审批单 -->
    <div v-if="infoType==7">
      <div class="show_detail">
        <p class="div_title">
          <span>基本信息</span>
          <span class="info_code">{{ approvalInfo.code }}</span>
        </p>
        <ul class="detail_info">
          <li>
            <div>
              <span class="title">申请单名称</span>
              <span v-if="approvalInfo.title.length<30">{{approvalInfo.title}}</span>
            </div>
            <div v-if="approvalInfo.title.length>=30">{{approvalInfo.title}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请日期</span>
              <span v-if="approvalInfo.createdDate.length<30">{{approvalInfo.createdDate}}</span>
            </div>
            <div v-if="approvalInfo.createdDate.length>=30">{{approvalInfo.createdDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人</span>
              <span v-if="approvalInfo.accountName.length<30">{{approvalInfo.accountName}}</span>
            </div>
            <div v-if="approvalInfo.accountName.length>=30">{{approvalInfo.accountName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人部门</span>
              <span v-if="approvalInfo.organizeName.length<30">{{approvalInfo.organizeName}}</span>
            </div>
            <div v-if="approvalInfo.organizeName.length>=30">{{approvalInfo.organizeName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人岗位</span>
              <span v-if="approvalInfo.groupName.length<30">{{approvalInfo.groupName}}</span>
            </div>
            <div v-if="approvalInfo.groupName.length>=30">{{approvalInfo.groupName}}</div>
          </li>
          <li>
            <div>
              <span class="title">审批类型</span>
              <span v-if="approvalInfo.processTypeName.length<30">{{approvalInfo.processTypeName}}</span>
            </div>
            <div v-if="approvalInfo.processTypeName.length>=30">{{approvalInfo.processTypeName}}</div>
          </li>
          <li>
            <div>
              <span class="title">用车类型</span>
              <span v-if="approvalInfo.type.length<30">{{approvalInfo.type}}</span>
            </div>
            <div v-if="approvalInfo.type.length>=30">{{approvalInfo.type}}</div>
          </li>
          <li>
            <div>
              <span class="title">用车时间</span>
              <span v-if="approvalInfo.useDate.length<30">{{approvalInfo.useDate}}</span>
            </div>
            <div v-if="approvalInfo.useDate.length>=30">{{approvalInfo.useDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">是否需要司机</span>
              <span>{{approvalInfo.isDriver==1?'是':'否'}}</span>
            </div>
          </li>
          <li>
            <div>
              <span class="title">乘车人数</span>
              <span v-if="approvalInfo.busNum.length<30">{{approvalInfo.busNum}}</span>
            </div>
            <div v-if="approvalInfo.busNum.length>=30">{{approvalInfo.busNum}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请原因</span>
              <span v-if="approvalInfo.remark.length<30">{{approvalInfo.remark}}</span>
            </div>
            <div v-if="approvalInfo.remark.length>=30">{{approvalInfo.remark}}</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 物品领用审批单 -->
    <div v-if="infoType==8">
      <div class="show_detail">
        <p class="div_title">
          <span>基本信息</span>
          <span class="info_code">{{ approvalInfo.code }}</span>
        </p>
        <ul class="detail_info">
          <li>
            <div>
              <span class="title">申请单名称</span>
              <span v-if="approvalInfo.title.length<30">{{approvalInfo.title}}</span>
            </div>
            <div v-if="approvalInfo.title.length>=30">{{approvalInfo.title}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请日期</span>
              <span v-if="approvalInfo.createdDate.length<30">{{approvalInfo.createdDate}}</span>
            </div>
            <div v-if="approvalInfo.createdDate.length>=30">{{approvalInfo.createdDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人</span>
              <span v-if="approvalInfo.accountName.length<30">{{approvalInfo.accountName}}</span>
            </div>
            <div v-if="approvalInfo.accountName.length>=30">{{approvalInfo.accountName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人部门</span>
              <span v-if="approvalInfo.organizeName.length<30">{{approvalInfo.organizeName}}</span>
            </div>
            <div v-if="approvalInfo.organizeName.length>=30">{{approvalInfo.organizeName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人岗位</span>
              <span v-if="approvalInfo.groupName.length<30">{{approvalInfo.groupName}}</span>
            </div>
            <div v-if="approvalInfo.groupName.length>=30">{{approvalInfo.groupName}}</div>
          </li>
          <li>
            <div>
              <span class="title">审批类型</span>
              <span v-if="approvalInfo.processTypeName.length<30">{{approvalInfo.processTypeName}}</span>
            </div>
            <div v-if="approvalInfo.processTypeName.length>=30">{{approvalInfo.processTypeName}}</div>
          </li>
          <li>
            <div>
              <span class="title">领用类型</span>
              <span v-if="approvalInfo.type.length<30">{{approvalInfo.type}}</span>
            </div>
            <div v-if="approvalInfo.type.length>=30">{{approvalInfo.type}}</div>
          </li>
          <li>
            <div>
              <span class="title">领用时间</span>
              <span v-if="approvalInfo.receiveDate.length<30">{{approvalInfo.receiveDate}}</span>
            </div>
            <div v-if="approvalInfo.receiveDate.length>=30">{{approvalInfo.receiveDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请原因</span>
              <span v-if="approvalInfo.remark.length<30">{{approvalInfo.remark}}</span>
            </div>
            <div v-if="approvalInfo.remark.length>=30">{{approvalInfo.remark}}</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 采购申请审批单 -->
    <div v-if="infoType==9">
      <div class="show_detail">
        <p class="div_title">
          <span>基本信息</span>
          <span class="info_code">{{ approvalInfo.code }}</span>
        </p>
        <ul class="detail_info">
          <li>
            <div>
              <span class="title">申请单名称</span>
              <span v-if="approvalInfo.title.length<30">{{approvalInfo.title}}</span>
            </div>
            <div v-if="approvalInfo.title.length>=30">{{approvalInfo.title}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请日期</span>
              <span v-if="approvalInfo.createdDate.length<30">{{approvalInfo.createdDate}}</span>
            </div>
            <div v-if="approvalInfo.createdDate.length>=30">{{approvalInfo.createdDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人</span>
              <span v-if="approvalInfo.accountName.length<30">{{approvalInfo.accountName}}</span>
            </div>
            <div v-if="approvalInfo.accountName.length>=30">{{approvalInfo.accountName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人部门</span>
              <span v-if="approvalInfo.organizeName.length<30">{{approvalInfo.organizeName}}</span>
            </div>
            <div v-if="approvalInfo.organizeName.length>=30">{{approvalInfo.organizeName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人岗位</span>
              <span v-if="approvalInfo.groupName.length<30">{{approvalInfo.groupName}}</span>
            </div>
            <div v-if="approvalInfo.groupName.length>=30">{{approvalInfo.groupName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请明细</span>
            </div>
            <div class="file_list div_block">
              <div v-for="(info,index) in approvalInfo.sign" :key="index" class="div_block bottom_none"
                style="padding:0">
                <p>
                  <span>{{index+1}}、产品名称：{{info.proName}}</span>
                </p>
                <p>备注：{{ info.proRemark }}</p>
              </div>
            </div>
          </li>
          <li>
            <div>
              <span class="title">原因说明</span>
              <span v-if="approvalInfo.remark.length<30">{{approvalInfo.remark}}</span>
            </div>
            <div v-if="approvalInfo.remark.length>=30">{{approvalInfo.remark}}</div>
          </li>
        </ul>
      </div>
      <!-- <x-table full-bordered style="background-color:#fff;" class="table_info">
        <tbody>
          <tr>
            <td class="title">申请单名称</td>
            <td>{{approvalInfo.title}}</td>
            <td class="title">申请人</td>
            <td>{{ approvalInfo.accountName }}</td>
          </tr>
          <tr>
            <td class="title">申请人部门</td>
            <td>{{ approvalInfo.organizeName }}</td>
            <td class="title">申请人岗位</td>
            <td>{{ approvalInfo.groupName }}</td>
          </tr>
          <tr>
            <td class="title">申请原因</td>
            <td colspan="3">{{ approvalInfo.remark }}</td>
          </tr>
        </tbody>
      </x-table>
      <p class="detail_title">
        <span>申请明细</span>
      </p>
      <x-table full-bordered style="background-color:#fff;" class="table_info">
        <thead>
          <tr>
            <th>物品名称</th>
            <th>要求</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(info,index) in approvalInfo.sign" :key="index">
            <td>{{ info.proName }}</td>
            <td>{{ info.proRemark }}</td>
          </tr>
        </tbody>
      </x-table> -->
    </div>
    <!-- 销假审批单 -->
    <div v-if="infoType==10">
      <div class="show_detail">
        <p class="div_title">
          <span>基本信息</span>
          <span class="info_code">{{ approvalInfo.code }}</span>
        </p>
        <ul class="detail_info">
          <li>
            <div>
              <span class="title">申请单名称</span>
              <span v-if="approvalInfo.title.length<30">{{approvalInfo.title}}</span>
            </div>
            <div v-if="approvalInfo.title.length>=30">{{approvalInfo.title}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请日期</span>
              <span v-if="approvalInfo.createdDate.length<30">{{approvalInfo.createdDate}}</span>
            </div>
            <div v-if="approvalInfo.createdDate.length>=30">{{approvalInfo.createdDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人</span>
              <span v-if="approvalInfo.accountName.length<30">{{approvalInfo.accountName}}</span>
            </div>
            <div v-if="approvalInfo.accountName.length>=30">{{approvalInfo.accountName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人部门</span>
              <span v-if="approvalInfo.organizeName.length<30">{{approvalInfo.organizeName}}</span>
            </div>
            <div v-if="approvalInfo.organizeName.length>=30">{{approvalInfo.organizeName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人岗位</span>
              <span v-if="approvalInfo.groupName.length<30">{{approvalInfo.groupName}}</span>
            </div>
            <div v-if="approvalInfo.groupName.length>=30">{{approvalInfo.groupName}}</div>
          </li>
          <li>
            <div>
              <span class="title">审批类型</span>
              <span v-if="approvalInfo.processTypeName.length<30">{{approvalInfo.processTypeName}}</span>
            </div>
            <div v-if="approvalInfo.processTypeName.length>=30">{{approvalInfo.processTypeName}}</div>
          </li>
          <li>
            <div>
              <span class="title">假单类型</span>
              <span v-if="approvalInfo.QJtype.length<30">{{approvalInfo.QJtype}}</span>
            </div>
            <div v-if="approvalInfo.QJtype.length>=30">{{approvalInfo.QJtype}}</div>
          </li>
          <li>
            <div>
              <span class="title">假单开始时间</span>
              <span v-if="approvalInfo.QJstartDate.length<30">{{approvalInfo.QJstartDate}}</span>
            </div>
            <div v-if="approvalInfo.QJstartDate.length>=30">{{approvalInfo.QJstartDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">假单结束时间</span>
              <span v-if="approvalInfo.QJendDate.length<30">{{approvalInfo.QJendDate}}</span>
            </div>
            <div v-if="approvalInfo.QJendDate.length>=30">{{approvalInfo.QJendDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">假单时长</span>
              <span v-if="approvalInfo.QJhouers.length<30">{{approvalInfo.QJhouers}}</span>
            </div>
            <div v-if="approvalInfo.QJhouers.length>=30">{{approvalInfo.QJhouers}}</div>
          </li>
          <li>
            <div>
              <span class="title">开始时间</span>
              <span v-if="approvalInfo.startDate.length<30">{{approvalInfo.startDate}}</span>
            </div>
            <div v-if="approvalInfo.startDate.length>=30">{{approvalInfo.startDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">结束时间</span>
              <span v-if="approvalInfo.endDate.length<30">{{approvalInfo.endDate}}</span>
            </div>
            <div v-if="approvalInfo.endDate.length>=30">{{approvalInfo.endDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">销假时长</span>
              <span v-if="approvalInfo.hours.length<30">{{approvalInfo.hours}}</span>
            </div>
            <div v-if="approvalInfo.hours.length>=30">{{approvalInfo.hours}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请原因</span>
              <span v-if="approvalInfo.remark.length<30">{{approvalInfo.remark}}</span>
            </div>
            <div v-if="approvalInfo.remark.length>=30">{{approvalInfo.remark}}</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 费用申请审批单 -->
    <div v-if="infoType==11">
      <div class="show_detail">
        <p class="div_title">
          <span>基本信息</span>
          <span class="info_code">{{ approvalInfo.code }}</span>
        </p>
        <ul class="detail_info">
          <li>
            <div>
              <span class="title">申请单名称</span>
              <span v-if="approvalInfo.title.length<30">{{approvalInfo.title}}</span>
            </div>
            <div v-if="approvalInfo.title.length>=30">{{approvalInfo.title}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请日期</span>
              <span v-if="approvalInfo.createdDate.length<30">{{approvalInfo.createdDate}}</span>
            </div>
            <div v-if="approvalInfo.createdDate.length>=30">{{approvalInfo.createdDate}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人</span>
              <span v-if="approvalInfo.accountName.length<30">{{approvalInfo.accountName}}</span>
            </div>
            <div v-if="approvalInfo.accountName.length>=30">{{approvalInfo.accountName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人部门</span>
              <span v-if="approvalInfo.organizeName.length<30">{{approvalInfo.organizeName}}</span>
            </div>
            <div v-if="approvalInfo.organizeName.length>=30">{{approvalInfo.organizeName}}</div>
          </li>
          <li>
            <div>
              <span class="title">申请人岗位</span>
              <span v-if="approvalInfo.groupName.length<30">{{approvalInfo.groupName}}</span>
            </div>
            <div v-if="approvalInfo.groupName.length>=30">{{approvalInfo.groupName}}</div>
          </li>
          <li>
            <div>
              <span class="title">费用申请金额</span>
              <span v-if="approvalInfo.amount.length<30">{{approvalInfo.amount}}</span>
            </div>
            <div v-if="approvalInfo.amount.length>=30">{{approvalInfo.amount}}</div>
          </li>
          <li>
            <div>
              <span class="title">开户姓名</span>
              <span v-if="approvalInfo.name.length<30">{{approvalInfo.name}}</span>
            </div>
            <div v-if="approvalInfo.name.length>=30">{{approvalInfo.name}}</div>
          </li>
          <li>
            <div>
              <span class="title">开户行</span>
              <span v-if="approvalInfo.bank.length<30">{{approvalInfo.bank}}</span>
            </div>
            <div v-if="approvalInfo.bank.length>=30">{{approvalInfo.bank}}</div>
          </li>
          <li>
            <div>
              <span class="title">银行卡号</span>
              <span v-if="approvalInfo.card.length<30">{{approvalInfo.card}}</span>
            </div>
            <div v-if="approvalInfo.card.length>=30">{{approvalInfo.card}}</div>
          </li>
          <li>
            <div>
              <span class="title">费用申请明细</span>
            </div>
            <div class="file_list div_block">
              <div v-for="(info,index) in approvalInfo.sign" :key="index" class="div_block bottom_none">
                <p>
                  <span class="refund_text">{{index+1}}、{{info.proName}}
                    <br>{{ info.proPrice }}元X{{ info.proNum }}={{ info.proTotal }}</span>
                  <span class="flies" @click="viewFiles(index)"
                    v-if="fileOpen!=index">查看附件({{info.costFilesArr.length}})</span>
                  <span class="flies" @click="viewFiles(-1)" v-if="fileOpen==index">收起附件</span>
                </p>
                <div class="files_list div_block bottom_none link_text" v-if="fileOpen==index">
                  <span v-if="item.name!=''" v-for="(item,index) in info.costFilesArr" :key="index"
                    style="display:block;margin: 5px 0;word-break: break-all;" @click="isShowFile(item)">{{ item.name }}</span>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div>
              <span class="title">申请原因</span>
              <span v-if="approvalInfo.remark.length<30">{{approvalInfo.remark}}</span>
            </div>
            <div v-if="approvalInfo.remark.length>=30">{{approvalInfo.remark}}</div>
          </li>
        </ul>
      </div>
    </div>
    <p class="detail_title">
      <span>审核情况</span>
    </p>
    <div v-if="showStep!= 0">
      <!-- <scroller lock-x height="6.9rem" @on-scroll="onScroll" ref="stepSrcoll" scrollbar-y v-if="showStep>3">
        <div class="detail_steps" id="scroll">
          <my-step v-for="(item,index) in carStep" :key="index" :data="item" :index="index+1"></my-step>
        </div>
      </scroller> -->
      <div class="detail_steps">
        <my-step v-for="(item,index) in carStep" :key="index" :data="item" :index="index+1"></my-step>
      </div>
    </div>
    <div v-if="showStep == 0" class="tipStyle">暂未审核</div>
    <p class="detail_title" v-if="viewType=='approval'">
      <span>审核意见</span>
    </p>
    <div class="detail_comm_text" v-if="viewType=='approval'">
      <group>
        <x-textarea :max="200" name="detail" placeholder="请填写审核意见" :show-counter="false" :rows="5" v-model="remark"
          @on-blur="backScroll"></x-textarea>
      </group>
    </div>
    <div class="detail_comm" v-if="viewType=='approval'">
      <div class="conform_btn" @click="passModel(infoType)">
        <p class="btn_img">
          <img src="@/assets/index/pass.png" alt="" srcset="">
        </p>
        <p class="pass">审批通过</p>
      </div>
      <div class="conform_btn" @click="rejectedModel(infoType)">
        <p class="btn_img">
          <img src="@/assets/index/rejected.png" alt="" srcset="">
        </p>
        <p class="rejected">审批驳回</p>
      </div>
    </div>
    <div class="detail_comm"
      v-if="viewType=='view'&&(approvalInfo.status==0||approvalInfo.status==2)&&(infoType==5||infoType==6||infoType==10) && modeType !=='audited'">
      <div class="edit_btn">
        <div class="conform_btn" @click="editView(approvalInfo.id)">
          <p class="btn_img">
            <img src="@/assets/index/edit.png" alt="" srcset="">
          </p>
          <p class="edit">编辑</p>
        </div>
        <!-- <x-button @click.native="editView(approvalInfo.id)">编辑</x-button> -->
      </div>
    </div>
    <div class="detail_comm"
      v-if="viewType=='view'&&(approvalInfo.status==0||approvalInfo.status==2) && infoType==2 && approvalInfo.signUpStatus != '1'&& modeType !=='audited'">
      <div class="edit_btn">
        <div class="conform_btn" @click="editView(approvalInfo.id)">
          <p class="btn_img">
            <img src="@/assets/index/edit.png" alt="" srcset="">
          </p>
          <p class="edit">编辑</p>
        </div>
        <!-- <x-button @click.native="editView(approvalInfo.id)">编辑</x-button> -->
      </div>
    </div>
    <div class="detail_comm" style="width: 100%;"
      v-if="viewType=='view'&& infoType==2 && approvalInfo.signUpStatus == '1' &&(approvalInfo.status==0||approvalInfo.status==2) && approvalInfo.status!=4 && modeType !=='audited'">
      <div class="edit_btn_inline" style="width: 30%;">
        <div class="conform_btn" @click="editView(approvalInfo.id)">
          <p class="btn_img">
            <img src="@/assets/index/edit.png" alt="" srcset="">
          </p>
          <p class="edit">编辑</p>
        </div>
        <!-- <x-button @click.native="editView(approvalInfo.id)">编辑</x-button> -->
        <!-- OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77 -->
        <a :href="linkUrl" class="conform_btn">
          <!-- <x-button>签到</x-button> -->
          <p class="btn_img">
            <img src="@/assets/index/sign.png" alt="" srcset="">
          </p>
          <p class="edit" style="color:#36cbcb">签到</p>
        </a>
        <!-- <x-button @click.native="sign(approvalInfo.id)">签到</x-button> -->
      </div>
    </div>
    <div class="detail_comm" style="width: 100%;"
      v-if="viewType=='view'&& infoType==2 && approvalInfo.signUpStatus == '1' &&(approvalInfo.status==4)&& modeType !=='audited'">
      <div class="edit_btn_inline" style="width: 100%;">
        <a :href="linkUrl" class="conform_btn btn-center">
          <p class="btn_img">
            <img src="@/assets/index/sign.png" alt="" srcset="">
          </p>
          <p class="edit" style="color:#36cbcb">签到</p>
        </a>
      </div>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showHideOnBlur" class="dialog-demo" hide-on-blur>
        <div class="img-box" style="text-align:center">
          <span v-if="file_type=='img'">
            <img :src="fileUrl+showFile.url" style="max-width:100%;vertical-align: middle;" v-if="showFile.url!=''">
          </span>
          <span v-if="file_type!='img'" class="tipInfo">压缩包暂不支持预览和下载</span>
        </div>
        <div style="height: 1rem; display: flex; align-items: center; justify-content: center;" v-if="file_type!='img'">
          <!-- <span class="vux-close"></span> -->
          <icon type="clear" style="font-size:26px" @click.native="closeDialog"></icon>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import {
    getApprovalDetail,
    saveApprovalType // 获取审批列表
  } from "@/api/public";
  import {
    Flow,
    FlowState,
    FlowLine,
    XTextarea,
    XButton,
    XDialog,
    Icon,
    TransferDomDirective as TransferDom
  } from "vux";
  import {
    setTimeout
  } from 'timers';

  export default {
    name: "Detail",
    components: {
      Flow,
      FlowState,
      FlowLine,
      XTextarea,
      XButton,
      XDialog,
      Icon
    },
    directives: {
      TransferDom
    },
    data() {
      return {
        linkUrl: '',
        fileUrl: '',
        remark: '',
        viewType: 'view',
        infoType: "",
        infoId: "",
        fileOpen: '-1',
        approvalInfo: {
          files: [{
            name: '',
            url: ''
          }]
        },
        carStep: [],
        scrollTop: '',
        showStep: 0,
        isShowSign: 0,
        file_type: "img",
        showFile: {},
        is_img: false,
        showHideOnBlur: false,
        showiframe: false,
        isPageHide: false,
        modeType: '',
        processId: '',
      };
    },
    created() {
      this.showiframe = false
    },
    mounted() {
      if (window.localStorage.getItem('maploading') != undefined && window.localStorage.getItem('maploading') == 1) {
        window.localStorage.setItem('maploading', 0)
        window.location.reload()
      } else {
        this.newPage()
        this.fileUrl = process.env.FILE_API
        // 页面第一个渲染的函数
        console.log(this.fileUrl, 'gfdgfdhgdhfjhgj')
        this.viewType = this.$route.query.show
        this.infoId = this.$route.query.id; // 列表的id
        this.modeType = this.$route.query.mode;
        this.infoType = this.$route.query.type; //审批单类型
        this.processId = this.$route.query.processId;
        let path = ''
        let baseURL = ''
        if (process.env.NODE_ENV === 'development') {
          baseURL = '/index.php'
        } else {
          baseURL = ''
        }
        let str = location.href
        let lastIndex = str.indexOf('#/main')
        //  + '#/main/map'
        path = str.substring(0, lastIndex) + '?id=' + this.infoId
        // path = encodeURIComponent(path)
        console.log(path)
        console.log(location.href)
        // this.linkUrl = 'http://apis.map.qq.com/tools/locpicker?search=0&type=0&backurl=http://3gimg.qq.com/lightmap/components/locationPicker2/back.html&mapdraggable=0&radius=1500&total=20&key=34IBZ-ZTRRG-WI4Q2-IYFXG-MBRUO-FEBVC&referer=myapp'
        this.linkUrl = 'http://apis.map.qq.com/tools/locpicker?search=0&type=0&backurl=' + path +
          '&mapdraggable=0&radius=1500&total=20&key=34IBZ-ZTRRG-WI4Q2-IYFXG-MBRUO-FEBVC&referer=myapp'
        console.log(this.linkUrl)
        this.getDetail();
      }
    },
    methods: {
      // 方法
      getDetail() {
        const that = this;
        getApprovalDetail(this.infoId, this.processId).then(res => {
          if (res.code === 200) {
            console.log("获取新数据")
            that.approvalInfo = res.data.apply;
            console.log(that.approvalInfo, 'fffffffffffffffffffffffffff')
            that.carStep = res.data.nodes;
            for (let i = 0; i < that.carStep.length; i++) {
              if (parseInt(that.carStep[i].auditStatus) !== 0 && parseInt(that.carStep[i].auditStatus) !== 1) {
                that.showStep++
              }
            }
            if(this.infoType=='11'){

            }else{
            if (that.approvalInfo.files !== undefined && that.approvalInfo.files !== '') {
              that.approvalInfo.files = JSON.parse(that.approvalInfo.files);
            } else {
              that.approvalInfo.files = [{
                name: '',
                url: ''
              }]
            }
            }
            if (that.showStep > 2) {
              that.$nextTick(() => {
                that.$refs.stepSrcoll.reset({
                  top: 140
                })
              })
            }
            that.$forceUpdate()
          } else {

          }
        });
      },
      onpageshow(e) {
        console.log(e, 'ffffffd')
        // if(e.persisted) {
        //     window.location.reload() 
        // }
      },
      backScroll() {
        // if (this.$refs.container5.offsetHeight <= document.documentElement.clientHeight) {
        //   window.scrollTo(0, 0)
        // }
        window.scrollTo(0, 0)
        // $('html,body').animate({scrollTop:0}, 1000);
      },
      editView(id) {
        this.$router.push({
          path: "/main/new?show=edit&type=" + this.infoType + '&infoId=' + id
        });
      },
      sign(id) {
        this.$router.push({
          path: "/map?show=sign&type=" + this.infoType + '&infoId=' + id
        });
      },
      onScroll(pos) {
        this.scrollTop = pos.top
      },
      passModel(type) {
        const that = this;
        if(this.remark==''){
            that.$vux.toast.show({
              text: '请填写审批通过意见',
              type: "warn",
              time: 1000
            })
        }else{
        saveApprovalType({
            remark: this.remark
          },
          "/oa/workflow-pass-" + this.infoId
        ).then(res => {
          if (res.code === 200 || res.code === "200") {
            that.$vux.toast.show({
              text: res.data.message,
              type: "success",
              time: 1000
            })
            setTimeout(() => {
              that.$router.go(-1)
            }, 1000)
          } else {
            that.$vux.toast.show({
              text: res.data.msg.message,
              type: "warn",
              time: 1000
            })
          }
        });
        }

      },
      rejectedModel(type) {
        const that = this;
        if(this.remark==''){
            that.$vux.toast.show({
              text: '请填写审批通过意见',
              type: "warn",
              time: 1000
            })
        }else{
        saveApprovalType({
            remark: this.remark
          },
          "/oa/workflow-rejected-" + this.infoId
        ).then(res => {
          if (res.code === 200 || res.code === "200") {
            that.$vux.toast.show({
              text: res.data.message,
              type: "success",
              time: 1000
            })
            setTimeout(() => {
              that.$router.go(-1)
            }, 1000)
          } else {
            that.$vux.toast.show({
              text: res.data.msg.message,
              type: "warn",
              time: 1000
            })
          }
        });
        }

      },
      closeDialog() {
        console.log("关闭弹框")
        this.showHideOnBlur = false
      },
      viewFiles(index) {
        this.fileOpen = index
      },
      isShowFile(e) {
        console.log(e, 'fdsfdsf')
        this.showFile = e
        if (e.name.indexOf('.png') !== -1 || e.name.indexOf('.jpg') !== -1 || e.name.indexOf('.jpeg') !== -1 || e.name
          .indexOf('.bmp') !== -1) {
          this.file_type = 'img'
          this.showHideOnBlur = true
        } else if (e.name.indexOf('.pdf') !== -1) {
          //预览pdf
          let url = './static/pdfjs/web/viewer.html?file=' + this.fileUrl + e.url
          // let url = './static/pdfjs/web/viewer.html?file=http://tyun.71360.com/download/%E7%99%BE%E5%BA%A6%E5%95%86%E6%A1%A5%E6%8E%A5%E5%85%A5%E8%AF%B4%E6%98%8E.pdf'
          console.log(url)
          window.open(url);
        } else if (e.name.indexOf('.zip') !== -1 || e.name.indexOf('.rar') !== -1) {
          this.file_type = 'other'
          this.showHideOnBlur = true
        } else {
          var newdownloadUrl = this.fileUrl + e.url
          window.open(newdownloadUrl);
        }
      },
      newPage() {
        window.onpageshow = function (e) {
          console.log(e, 'vvv')
          if (e.persisted) {
            window.location.reload()
          }
        }
      }
    }
  };

</script>
<style lang="less" scoped>
  .detail_bg {
    background: #f9f9f9;
    // padding: 0.3rem 0;
    // padding-bottom: 0;
    margin-bottom: 2.5rem;

    .detail_head {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      padding: 0.2rem 0.1rem;
      border-bottom: 0.02rem solid #f2f2f2;
      margin-bottom: 0.2rem;

      .detail_block {
        width: 33.3%;

        p {
          font-size: 0.24rem;
          color: #666666;
          text-align: center;
          padding-top: 0.1rem;

          .over_text {
            white-space: nowrap;
            /*超出的空白区域不换行*/
            overflow: hidden;
            /*超出隐藏*/
            text-overflow: ellipsis;
            /*文本超出显示省略号*/
            width: 2rem;
            display: block;
            margin: 0 auto;
          }
        }

        .head_title {
          color: #CCCCCC;
          padding-top: 0;
        }
      }
    }

    .detail_step_view {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      padding: 0.2rem 0.1rem;
      border-top: 0.02rem solid #f2f2f2;
      border-bottom: 0.02rem solid #f2f2f2;

      // margin-bottom: 0.2rem;
      .step_view {
        width: 33.3%;
        position: relative;
        height: 1rem;

        p {
          font-size: 0.24rem;
          color: #666666;
          text-align: center;
          padding-top: 0.66rem;
          z-index: 10;
        }

        .step_img {
          z-index: 10;
          width: 0.6rem;
          height: 0.6rem;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          background: #fff;
          border-radius: 50%;
          padding-top: 0;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .line {
          width: 100%;
          height: 0.05rem;
          background: #e0e0e0;
          display: block;
          position: absolute;
          top: 30%;
          transform: translateY(-50%);
          z-index: 9;
        }

        .short_line {
          width: 50%;
        }

        .line_left {
          left: 0;
        }

        .line_right {
          right: 0;
        }

        .line_active {
          background: #409eff;
        }
      }
    }

    .detail_title {
      font-weight: 700;
      color: #333333;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.1rem 0.3rem;
      // border-bottom: 0.02rem solid #f2f2f2;
      font-size: 0.26rem;
      font-family: 'Arial Normal', 'Arial';
      padding-top: 0.2rem;
    }

    .show_detail {
      font-size: 0.26rem;
      color: #666666;
      font-family: 'Arial Normal', 'Arial';

      .div_title {
        font-weight: 700;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.2rem 0.3rem;
        border-bottom: 0.02rem solid #f2f2f2;

        .info_code {
          color: #666666;
          font-weight: normal;
        }
      }

      .detail_info {
        li {
          div {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 0.02rem solid #f2f2f2;
            background: #fff;
            padding: 0.21rem 0.3rem;
            line-height: 1.5;

            .title {
              color: #333333;
            }

          }

          .div_block {
            display: block;
          }

          .bottom_none {
            border-bottom: none;
            padding: 0.14rem 0;
          }

          .link_text {
            color: #409eff;
            text-decoration: underline;
          }

          // .files_list{
          //   border-bottom: 0.02rem solid #f2f2f2;
          // }
          // .files_list:last-child{
          //   border-bottom: none;
          // }
          .file_list {
            display: block;

            p {
              display: flex;
              align-items: center;
              justify-content: space-between;
              line-height: 2;

              .refund_text {
                word-break: break-all;
                width: 74%;
              }

              .flies {
                color: #409eff;
                min-width: 20%;
              }
            }

          }
        }
      }
    }

    .table_info {
      .title {
        font-size: 0.2rem;
        color: #333333;
        min-width: 1.2rem;
        padding: 0 0.1rem;
      }

      .link_text {
        color: #409eff;
        text-decoration: underline;
      }

      th {
        color: #888888;
        font-size: 0.18rem;
        min-width: 1.2rem;
      }

      td {
        color: #888888;
        font-size: 0.18rem;
        padding: 0.2rem 0.1rem;
        line-height: 1.2;
        white-space: normal;
        word-break: break-all;
      }
    }

    .detail_steps {
      padding: 0.2rem;
      // height: 2.2rem;
      // overflow: scroll;
      // overflow-x: hidden;
    }

    .detail_comm_text {
      & /deep/.weui-cells {
        margin-top: 0;
      }

      & /deep/.weui-textarea {
        font-size: 0.24rem;
      }
    }

    .detail_comm {
      // padding: 0 0.2rem;
      position: fixed;
      bottom: 1.05rem;
      width: 100%;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 1.2rem;
      border-top: 0.02rem solid rgba(228, 228, 228, 1);

      .conform_btn {
        width: 26%;
        text-align: center;

        p {
          font-size: 0.26rem;
        }

        .edit {
          color: #409eff;
        }

        .pass {
          color: #00CC99;
        }

        .rejected {
          color: #FF3B31;
        }

        .btn_img {
          width: 0.52rem;
          height: 0.52rem;
          background: #fff;
          border-radius: 50%;
          padding-top: 0;
          margin: 0 auto;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .edit_btn {
        text-align: center;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .weui-btn_default {
          color: #fff;
          background-color: #409eff;
          border-color: #409eff;
          font-size: 0.26rem;
          width: 60%;
          // margin-top: 0.4rem;
        }

        .conform_btn {
          p {
            font-size: 0.26rem;
          }

          .edit {
            color: #409eff;
          }

          .pass {
            color: #00CC99;
          }

          .rejected {
            color: #FF3B31;
          }

          .btn_img {
            width: 0.52rem;
            height: 0.52rem;
            background: #fff;
            border-radius: 50%;
            padding-top: 0;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }

      .btn-center {
        margin-left: auto;
        margin-right: auto;
      }

      .edit_btn_inline {
        display: flex;
        justify-content: space-between;

        .weui-btn_default {
          color: #fff;
          background-color: #409eff;
          border-color: #409eff;
          font-size: 0.26rem;
          width: 42%;
          margin: 0;
          margin-top: 0.4rem;
        }

        a {
          width: 42%;

          .weui-btn_default {
            width: 100%;
          }
        }
      }
    }

    .tipStyle {
      font-size: 0.26rem;
      text-align: center;
      // border: 1px solid #e0e0e0;
      background: #fff;
      height: 1.5rem;
      line-height: 1.5rem;
      margin: 0.1rem 0.3rem;
    }
  }

</style>
