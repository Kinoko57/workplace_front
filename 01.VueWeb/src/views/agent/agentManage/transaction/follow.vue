<template>
  <div>
    <div class="find_wraper">
      <div class="find_top">
        <div class="find_top_t">
          <el-button size="mini" pain icon="el-icon-arrow-left" @click="returnPage">返回</el-button>
        </div>
        <div class="find_top_tit">
          <img src="@/assets/common/com_userName.png" alt="" srcset="">
          <span>{{ agentInfo.business_name }}</span>
        </div>
        <div class="find_top_content">
          <span class="find_top_content_span">经销商归属：<span class="style_color">{{ salesInfo.realname!=''&&salesInfo.realname!=undefined?salesInfo.realname:'暂无归属人' }}</span>
          </span>
          <span v-if="agentInfo.Invitation_code!=''" class="find_top_content_span">邀请码：<span class="style_color">{{ agentInfo.Invitation_code }}</span>
          </span>
          <span v-if="agentInfo.nextDate!=''" class="find_top_content_span">下次跟进：<span
            class="style_color"
            style="color:#409EFF"><i
              class="el-icon-date"
              style="margin:0 4px;" />{{ agentInfo.nextDate }}</span></span>
        </div>
        <div v-if="choseType!='blacklist'&&(choseType=='all'&&btnType=='follow')" class="find_top_btn">
          <el-button
            v-if="btnPermission('agent_edit')"
            plain
            size="mini"
            icon="el-icon-edit-outline"
            @click="changeInfo('proxy')">修改信息</el-button>
          <el-button
            v-if="btnPermission('agent_agentassign')"
            plain
            size="mini"
            icon="el-icon-edit-outline"
            @click="changeInfo('follow')">写新跟进</el-button>
          <el-button
            v-if="btnPermission('agent_agentassign')"
            plain
            size="mini"
            icon="el-icon-edit-outline"
            @click="changeInfo('add')">添加联系人</el-button>
          <!-- <el-button plain size="mini" icon="el-icon-edit-outline" @click="changeInfo('remove')">删除经销商</el-button> -->
          <el-button
            v-if="btnPermission('agent_addblacklist')"
            plain
            size="mini"
            icon="el-icon-edit-outline"
            @click="changeInfo('blacklist')">加入黑名单</el-button>
          <el-button
            v-if="btnPermission('agent_bindwx')"
            plain
            size="mini"
            icon="el-icon-edit-outline"
            @click="changeInfo('webcat')">管理微信号</el-button>
          <el-button
            v-if="btnPermission('agent_grantwelfare')"
            plain
            size="mini"
            icon="el-icon-edit-outline"
            @click="changeInfo('welfare')">添加福利</el-button>
        </div>
      </div>
      <div class="find_center">
        <div class="find_center_click">
          <div class="find_center_chose">
            <el-tabs v-model="searchInfo.mode" @tab-click="handleClick">
              <el-tab-pane v-for="(item,index) in typeList" :key="index" :label="item.label" :name="item.name" />
            </el-tabs>
          </div>
          <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='agent'" class="find_center_tit">
            <div class="chose_style_tit">经销商人信息</div>
            <table class="view_dialog view_dialog_self" cellpadding="0" cellspacing="0">
              <tr class="view_line">
                <td class="line_title">姓名：</td>
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(agentInfo.name)}">{{ agentInfo.name|textNull }}</span>
                </td>
                <td class="line_title">性别：</td>
                <td class="second_line">
                  <span v-if="agentInfo.sex!=''&&agentInfo.sex!=null&&agentInfo.sex!=undefined">{{ agentInfo.sex==1?'男':(agentInfo.sex== 2?'女':'' ) }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title">手机 ：</td>
                <td class="second_line">
                  <span v-if="agentInfo.phone!=''">{{ agentInfo.phone }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">微信 ：</td>
                <td class="second_line">
                  <span v-if="agentInfo.wechat!=''">{{ agentInfo.wechat }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title">经销商等级：</td>
                <td class="second_line">{{ agentInfo.levleName }}</td>
                <td class="line_title">经销商来源：</td>
                <td class="second_line">
                  <span v-if="agentInfo.source!=''">{{ agentInfo.source }}</span>
                  <span
                    v-else
                    style="color:#999">暂无数据</span></td>
              </tr>
              <tr class="view_line">
                <td class="line_title">所属销售：</td>
                <td class="second_line">
                  <span v-if="salesInfo.realname!=''&&salesInfo.realname!=undefined">{{ salesInfo.realname }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title"> 客服号：</td>
                <td class="second_line">
                  <span v-if="agentInfo.serviceId!=''">{{ agentInfo.serviceId }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title">邮箱：</td>
                <td class="second_line">
                  <span v-if="agentInfo.email!=''">{{ agentInfo.email }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">生日：</td>
                <td class="second_line"><span
                  v-if="agentInfo.birthday!=''&&agentInfo.birthday!=null"
                >{{ agentInfo.birthday }}</span>
                  <span
                    v-else
                    style="color:#999">暂无数据</span>
                </td>
                <td class="line_title">部门职务：</td>
                <td class="second_line"><span v-if="agentInfo.job!=''">{{ agentInfo.job }}</span>
                  <span
                    v-else
                    style="color:#999">暂无数据</span>
                </td>
                <td class="line_title">qq：</td>
                <td class="second_line"><span v-if="agentInfo.qq!=''">{{ agentInfo.qq }}</span>
                  <span
                    v-else
                    style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">微信小号：</td>
                <td class="second_line" style="padding-right: 6px">
                  <span v-if="agentInfo.smallWx!=undefined&&agentInfo.smallWx.length>0">
                    <span v-for="(item,index) of agentInfo.smallWx" :key="index">{{ item.label }},</span>
                  </span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title"> 微信连锁号：</td>
                <td class="second_line" style="padding-right: 6px">
                  <span v-if="agentInfo.linkWx!=undefined&&agentInfo.linkWx.length>0">
                    <span v-for="(item,index) of agentInfo.linkWx" :key="index">{{ item.label }}, </span>
                  </span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title">福利信息：</td>
                <td class="second_line"><span v-if="agentInfo.welfareCount>0">{{ agentInfo.welfareCount }}</span>
                  <span
                    v-else
                    style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">授权号：</td>
                <td class="second_line">{{ agentInfo.auth_code }}</td>
                <td class="line_title">地址：</td>
                <td class="second_line" colspan="3"><span
                  v-if="agentInfo.areasName!=''||agentInfo.address!=''">{{ agentInfo.areasName }}{{ agentInfo.address }}</span>
                  <span
                    v-else
                    style="color:#999">暂无数据</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div
        :class="searchInfo.mode=='followUp'||searchInfo.mode=='contacts'||searchInfo.mode=='belonger'||searchInfo.mode=='operation'||searchInfo.mode=='customer'||searchInfo.mode=='study'?'find_bottom_color':''"
        class="find_bottom">
        <div
          v-if="searchInfo.mode=='overview'||searchInfo.mode=='followUp'||searchInfo.mode=='contacts'"
          :class="searchInfo.mode=='followUp'||searchInfo.mode=='contacts'?'find_bottom_left_color':''"
          class="find_bottom_left">
          <div
            v-if="searchInfo.mode=='overview'||searchInfo.mode=='followUp'"
            class="find_wraper_bottom find_bottom_left_t">
            <div class="chose_style_tit">跟进记录</div>
            <div v-if="followInfo.length>0" :class="searchInfo.mode=='followUp'?'tit_width_long':''" class="tit_width follow_wraper block">
              <el-timeline>
                <el-timeline-item v-for="(item,index) of followInfo" :key="index" placement="top" type="primary">
                  <el-card>
                    <div class="follow_name">
                      <div><img src="@/assets/common/follow_user.png" alt="" srcset=""><span>{{ item.userName }}</span></div>
                      <el-button v-if="item.isEdit==1" size="mini" @click="editFollow(item)">编辑</el-button>
                    </div>
                    <div class="follow_top">
                      <span class="follow_right">跟进时间：{{ item.thisDate }}</span>
                      <span class="follow_right">跟进方式：{{ item.followType==0?'到访':'电话' }}</span>
                      <span>下次跟进：{{ item.nextDate }}</span>
                    </div>
                    <p class="follow_content">{{ item.content }}</p>
                    <div class="follow_bto">
                      <div class="follow_file">附件：<a
                        v-if="item.file[0].name!=''"
                        :title="item.name"
                        :href="fileUrl+item.file[0].url"
                        download=""
                        target="_blank"
                        class="file_up">{{ item.file[0].name }}</a><a v-else>暂无附件</a></div>
                        <!-- <div class="follow_timer"><img src="@/assets/common/folow_timer.png" alt="" srcset=""><span>{{ item.thisDate }}</span></div> -->
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
            <p v-else class="style_null">暂无跟进记录~</p>
          </div>
          <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='contacts'" class="find_bottom_left_t">
            <div class="chose_style_tit">联系人信息</div>
            <div style="margin:20px 30px" class="tit_width">
              <el-table :data="tableData" tooltip-effect="light" border>
                <el-table-column prop="name" align="center" label="姓名" show-overflow-tooltip min-width="100" />
                <el-table-column prop="sex" align="center" label="性别" show-overflow-tooltip min-width="100">
                  <template slot-scope="scope">
                    <span v-if="scope.row.sex==1">男</span>
                    <span v-else>女</span>
                  </template>
                </el-table-column>
                <el-table-column prop="phone" align="center" label="手机号" show-overflow-tooltip min-width="100" />
                <el-table-column prop="wechat" align="center" label="微信号" min-width="100" />
                <el-table-column prop="qq" align="center" label="qq" min-width="100" />
                <el-table-column prop="job" align="center" label="部门职务" show-overflow-tooltip min-width="100" />
                <el-table-column prop="birthday" align="center" label="生日" show-overflow-tooltip min-width="100" />
                <el-table-column
                  v-if="btnPermission('agent_agentassign')"
                  label="操作"
                  width="120"
                  align="center"
                  fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="viewEdit(scope.row,'editContacts')">修改</el-button>
                    <el-button type="text" size="small" @click="viewEdit(scope.row,'remover')">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div
          v-if="searchInfo.mode=='overview'||searchInfo.mode=='belonger'||searchInfo.mode=='operation'||searchInfo.mode=='customer'||searchInfo.mode=='study'"
          :class="searchInfo.mode=='belonger'||searchInfo.mode=='operation'||searchInfo.mode=='customer'||searchInfo.mode=='study'?'find_bottom_right_color':''"
          class="find_bottom_right">
          <div
            v-if="searchInfo.mode=='overview'||searchInfo.mode=='belonger'"
            class="find_wraper_bottom find_bottom_right_t">
            <div class="chose_style_tit">归属人信息</div>
            <table class="view_dialog view_dialog_followUp tit_width" cellpadding="0" cellspacing="0">
              <tr class="view_line">
                <td class="line_title">姓名：</td>
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(salesInfo.realname)}">{{ salesInfo.realname|textNull }}</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">性别：</td>
                <td class="second_line">
                  <!-- {{ salesInfo.gender==1?'男':(salesInfo.gender==2?'女':'') }} -->
                  <span v-if="salesInfo.gender!=''&&salesInfo.gender!=null&&salesInfo.gender!=undefined">{{ salesInfo.gender==1?'男':(salesInfo.gender== 2?'女':'' ) }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">手机：</td>
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(salesInfo.mobile)}">{{ salesInfo.mobile|textNull }}</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">部门：</td>
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(salesInfo.name)}">{{ salesInfo.name|textNull }}</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">上个归属人：</td>
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(salesInfo.secUser)}">{{ salesInfo.secUser|textNull }}</span>
                </td>
              </tr>
            </table>
            <table class="view_dialog view_dialog_followUp tit_width" cellpadding="0" cellspacing="0">
              <tr class="view_line">
                <td class="line_title">创建人：</td>
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(agentInfo.createdBy)}">{{ agentInfo.createdBy|textNull }}</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">创建时间：</td>
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(agentInfo.createdDate)}">{{ agentInfo.createdDate|textNull }}</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">最近更新人：</td>
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(agentInfo.editedBy)}">{{ agentInfo.editedBy|textNull }}</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">更新时间：</td>
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(agentInfo.editedDate)}">{{ agentInfo.editedDate|textNull }}</span>
                </td>
              </tr>
            </table>
            <!-- <div class="tit_width">
              <table
                class="view_dialog view_dialog_follow"
                border="0"
                cellpadding="0"
                cellspacing="0"
                style="margin-top:0">
                <tr class="view_line">
                  <td class="line_title">创建人：</td>
                  <td class="second_line">{{ agentInfo.createdBy }}</td>
                </tr>
                <tr class="view_line">
                  <td class="line_title">创建时间：</td>
                  <td class="second_line">{{ agentInfo.createdDate }}</td>
                </tr>
                <tr class="view_line">
                  <td class="line_title">最近更新人：</td>
                  <td class="second_line">{{ agentInfo.editedBy }}</td>
                </tr>
                <tr class="view_line">
                  <td class="line_title">更新时间：</td>
                  <td class="second_line">{{ agentInfo.editedDate }}</td>
                </tr>
              </table>
            </div> -->
          </div>
          <div
            v-if="searchInfo.mode=='overview'||searchInfo.mode=='customer'"
            class="find_wraper_bottom find_bottom_right_t">
            <div class="chose_style_tit">客服信息</div>
            <table
              v-if="serviceInfo!=''&&serviceInfo!=undefined"
              class="view_dialog tit_width view_dialog_followUp"
              cellpadding="0"
              cellspacing="0">
              <tr class="view_line">
                <td class="line_title">微信号：</td>
                <td class="second_line">{{ serviceInfo.wechat }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title">手机号：</td>
                <td class="second_line">{{ serviceInfo.phone }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title">客服号：</td>
                <td class="second_line">{{ serviceInfo.code }}</td>
              </tr>
            </table>
            <p v-else class="style_null">暂无客服信息~</p>
          </div>
          <div
            v-if="searchInfo.mode=='overview'||searchInfo.mode=='operation'"
            class="find_wraper_bottom find_bottom_right_t">
            <div class="chose_style_tit">操作记录</div>
            <ul v-if="operateInfo.length>0" :class="searchInfo.mode=='operation'?'tit_width_long':''" class="tit_width">
              <li v-for="(item,index) of operateInfo" :key="index">
                <div class="operate"><span /></div>
                <div class="operate_con">
                  <span class="span_time">{{ item.date }}</span>
                  <span class="span_cont">
                    <span v-if="item.action=='assign'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 跟进</span>。</span>
                    <span v-if="item.action=='addcontact'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 添加了联系人</span> <span
                      class="font_bold">{{ item.comment.name }}</span>。</span>
                    <span v-if="item.action=='editcontact'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 编辑了联系人</span> <span
                      class="font_bold">{{ item.comment.name }}</span>。</span>
                    <span v-if="item.action=='delcontact'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 删除了联系人</span> <span
                      class="font_bold">{{ item.comment.name }}</span>。</span>
                    <span v-if="item.action=='create'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 创建。</span></span>
                    <span v-if="item.action=='receive'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 领取。</span></span>
                    <span v-if="item.action=='cancellation'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 移除。</span></span>
                    <span v-if="item.action=='cradlegroupmembercreate'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 加入摇篮群。</span></span>
                    <span v-if="item.action=='cradlegroupmemberdelete'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 移除摇篮群。</span></span>
                    <span v-if="item.action=='cradlegroupdmmembercreate'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 加入摇篮群。</span></span>
                    <span v-if="item.action=='cradlegroupdmmemberdelete'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 移除摇篮群。</span></span>
                    <span v-if="item.action=='import'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 导入。</span></span>
                    <span v-if="item.action=='update'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 将 </span><span
                        class="font_bold">{{ item.field }}</span><span> 修改为 </span><span
                      class="font_bold">{{ item.new }}</span>。</span>
                    <span v-if="item.action=='editbusiness'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span> <span>{{ item.extra }}</span></span>
                    <span v-if="item.action=='memberassign'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 添加了培训回访 </span><span>，内容为 </span><span
                      class="font_bold">{{ item.comment.content }}</span>。</span>
                    <span v-if="item.action=='appoint'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 指派给 </span><span
                        class="font_bold">{{ item.extra }}</span><span v-if="item.comment!=undefined"> {{ item.comment.salesName }}
                    </span>，<span v-if="item.comment!=undefined">{{ item.comment.remarks }}</span>。</span>
                    <span v-if="item.action=='transformation'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 转化。</span></span>
                    <span v-if="item.action=='study'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span>邀约参加培训 </span><span
                        v-if="item.comment.lessionname!=undefined"
                        class="font_bold">《{{ item.comment.lessionname }}》。</span></span>
                    <span v-if="item.action=='mobilesignup'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span>参加学习 课程</span><span
                        v-if="item.comment.lessionname!=undefined"
                        class="font_bold">《{{ item.comment.lessionname }}》,手机签到</span></span>
                    <span v-if="item.action=='pcsignup'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span>参加学习 课程</span><span
                        v-if="item.comment.lessionname!=undefined"
                        class="font_bold">《{{ item.comment.lessionname }}》,电脑签到</span></span>
                    <span v-if="item.action=='agentingore'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 忽略 {{ item.extra }}</span>。</span>
                    <span v-if="item.action=='addicon'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> {{ item.extra }}</span><span class="font_bold">
                      {{ item.comment.iconName }} </span>。</span>
                    <span v-if="item.action=='grantwelfare'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> {{ item.extra }}</span><span class="font_bold">
                      {{ item.comment.welfareId }} </span>。</span>
                    <span v-if="item.action=='addblacklist'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 加入黑名单。</span></span>
                    <span v-if="item.action=='removeblacklist'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 移出黑名单。</span></span>
                    <span v-if="item.action=='bindwx'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> {{ item.extra }}</span><span class="font_bold">
                      {{ item.comment.wechat }} </span>。</span>
                    <span v-if="item.action=='editadress'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> {{ item.extra }}</span><span class="font_bold">
                        {{ item.comment.areasName }} </span><span class="font_bold"> {{ item.comment.address }}
                    </span>。</span>
                    <span v-if="item.action=='lose'"><span>由</span> <span class="font_bold">{{ item.actor }}
                    </span><span>{{ item.extra }} </span><span
                      class="font_bold">,备注：{{ item.comment.content }}</span></span>
                    <span v-if="item.action=='resale'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 二次销售</span><span
                        v-if="item.comment!=undefined"
                        class="font_bold">,备注：{{ item.comment.remarks }}</span>。</span>
                    <span v-if="item.action=='deletewxcode'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 删除了</span><span>{{ item.extra }}</span><span
                      class="font_bold"> {{ item.comment.info }} </span>。</span>
                    <span v-if="item.action=='payment'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> {{ item.extra }}</span>。</span>
                  </span>
                </div>
              </li>
            </ul>
            <p v-else class="style_null">暂无操作记录~</p>
          </div>
          <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='study'" class="find_bottom_right_t">
            <div class="chose_style_tit">学习记录</div>
            <ul v-if="studyInfo.length>0" :class="searchInfo.mode=='study'?'tit_width_long':''" class="tit_width">
              <li v-for="(item,index) of studyInfo" :key="index">
                <div class="operate"><span /></div>
                <div class="operate_con">
                  <span class="span_time">{{ item.date }}</span>
                  <span class="span_cont">
                    <span v-if="item.action=='assign'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 跟进</span>。</span>
                    <span v-if="item.action=='create'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 创建。</span></span>
                    <span v-if="item.action=='receive'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 领取。</span></span>
                    <span v-if="item.action=='cancellation'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 移除。</span></span>
                    <span v-if="item.action=='cradlegroupmembercreate'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span> <span> {{ item.context }}。</span></span>
                    <span v-if="item.action=='cradlegroupmemberdelete'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span> <span> 移除摇篮群。</span></span>
                    <span v-if="item.action=='cradlegroupdmmembercreate'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span> <span> {{ item.context }}。</span></span>
                    <span v-if="item.action=='cradlegroupdmmemberdelete'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span> <span> 移除摇篮群。</span></span>
                    <span v-if="item.action=='import'"><span>由</span> <span class="font_bold">{{ item.actor }}</span>
                    <span> 导入。</span></span>
                    <span v-if="item.action=='update'"><span>由</span> <span class="font_bold">{{ item.actor }}</span>
                      <span> 将 </span><span class="font_bold">{{ item.field }}</span><span> 修改为 </span><span
                      class="font_bold">{{ item.new }}</span>。</span>
                    <span v-if="item.action=='memberassign'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 添加了培训回访 </span><span>，内容为 </span><span
                      class="font_bold">{{ item.comment.content }}</span>。</span>
                    <span v-if="item.action=='appoint'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 指派给 </span><span
                      class="font_bold">{{ item.extra }}</span><span v-if="item.comment!=undefined"> {{ item.comment.salesName }} </span>。</span>
                    <span v-if="item.action=='transformation'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 转化。</span></span>
                    <span v-if="item.action=='study'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span>邀约参加培训 </span><span
                        class="font_bold">《{{ item.comment.lessionname }}》。</span></span>
                    <span v-if="item.action=='mobilesignup'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span>参加学习 课程</span><span
                        class="font_bold">《{{ item.comment.lessionname }}》,手机签到</span></span>
                    <span v-if="item.action=='pcsignup'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span>参加学习 课程</span><span
                        class="font_bold">《{{ item.comment.lessionname }}》,电脑签到</span></span>
                    <span v-if="item.action=='agentingore'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span><span> 忽略 {{ item.extra }}</span>。</span></span>
                    <span v-if="item.action=='addicon'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> {{ item.extra }}</span><span class="font_bold">
                      {{ item.comment.iconName }} </span>。</span>
                    <span v-if="item.action=='grantwelfare'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> {{ item.extra }}</span><span class="font_bold">
                      {{ item.comment.welfareId }} </span>。</span>
                    <span v-if="item.action=='addblacklist'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 加入黑名单。</span></span>
                    <span v-if="item.action=='removeblacklist'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 移出黑名单。</span></span>
                    <span v-if="item.action=='bindwx'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> {{ item.extra }}</span><span class="font_bold">
                      {{ item.comment.wechat }} </span>。</span>
                    <span v-if="item.action=='editadress'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> {{ item.extra }}</span><span class="font_bold">
                        {{ item.comment.areasName }} </span><span class="font_bold"> {{ item.comment.address }}
                    </span>。</span>
                    <span v-if="item.action=='lose'"><span>由</span> <span class="font_bold">{{ item.actor }}
                    </span><span>{{ item.extra }} </span><span
                      class="font_bold">,备注：{{ item.comment.content }}</span></span>
                    <span v-if="item.action=='resale'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 二次销售</span><span
                        v-if="item.comment!=undefined"
                        class="font_bold">,备注：{{ item.comment.remarks }}</span>。</span>
                    <span v-if="item.action=='deletewxcode'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 删除了</span><span>{{ item.extra }}</span><span
                      class="font_bold"> {{ item.comment.info }} </span>。</span>
                  </span>
                </div>
              </li>
            </ul>
            <p v-else class="style_null">暂无学习记录~</p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="modelShow"
      :title="modelTitle"
      class="dialogModel"
      @close="resetModel">
      <!-- 修改经销商 -->
      <el-scrollbar v-if="modelType=='proxy'&& modelShow" class="fixed_scroll over_scroll">
        <el-form
          ref="proxyInfoForm"
          :model="proxyInfoForm"
          :rules="proxyInfoRules"
          class="modelForm"
          label-position="right"
          label-width="100px">
          <!-- <el-form-item label="关联商机：" prop="businessId">
            <el-select v-model="proxyInfoForm.businessId" filterable placeholder="请选择关联商机" style="width:500px" clearable @change="choseBussiness">
              <el-option v-for="(item,index) in bussinessShowList" :label="item.label" :value="item.value" :key="index" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="经销商名称：" prop="business_name">
            <el-input
              v-model.trim="proxyInfoForm.business_name"
              :disabled="proxyInfoForm.businessId!=''"
              autocomplete="off"
              style="width:500px"
              placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="邀请码：" prop="Invitation_code">
            <el-input v-model.trim="proxyInfoForm.Invitation_code" autocomplete="off" style="width:500px" placeholder="请输入邀请码"/>
          </el-form-item>
          <el-form-item label="姓名：" prop="name">
            <el-input v-model.trim="proxyInfoForm.name" autocomplete="off" style="width:500px" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-radio-group v-model.trim="proxyInfoForm.sex" placeholder="请选择性别">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model.trim="proxyInfoForm.phone" autocomplete="off" style="width:500px" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="微信号：" prop="wechat">
            <el-input v-model.trim="proxyInfoForm.wechat" autocomplete="off" style="width:500px" placeholder="请输入微信号" />
          </el-form-item>
          <el-form-item label="部门职务：" prop="job">
            <el-input v-model.trim="proxyInfoForm.job" autocomplete="off" style="width:500px" placeholder="请输入部门职务" />
          </el-form-item>
          <el-form-item label="生日：" prop="birthday">
            <el-date-picker
              v-model="proxyInfoForm.birthday"
              style="width:500px"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间" />
          </el-form-item>
          <el-form-item label="来源：">
            <el-input v-model.trim="proxyInfoForm.source" autocomplete="off" style="width:500px" placeholder="请输入来源" />
          </el-form-item>
          <el-form-item label="QQ号：" prop="qq">
            <el-input v-model.trim="proxyInfoForm.qq" autocomplete="off" style="width:500px" placeholder="请输入QQ号" />
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model.trim="proxyInfoForm.email" autocomplete="off" style="width:500px" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="授权号：" prop="contractCode">
            <el-select
              v-model="proxyInfoForm.contractCode"
              filterable
              clearable
              placeholder="请输入授权号"
              style="width:500px"
              @change="choseCourse">
              <el-option v-for="item in contractList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="经销商等级：" prop="levleId">
            <el-select v-model="proxyInfoForm.levleId" filterable disabled placeholder="请选择经销商等级" style="width:500px">
              <el-option v-for="(item,index) in agentLevelList" :label="item.label" :value="item.value" :key="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="省市区：" prop="areas">
            <el-cascader
              ref="areaName"
              :options="areaList"
              v-model="proxyInfoForm.areas"
              style="width:500px"
              placeholder="请选择省市区"
              @change="getAreasValue" />
          </el-form-item>
          <el-form-item label="详细地址：" prop="address">
            <el-input
              :rows="4"
              v-model.trim="proxyInfoForm.address"
              type="textarea"
              style="width:500px"
              placeholder="请输入详细地址，最大长度为120个字" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <!-- 添加福利 -->
      <el-scrollbar v-if="modelType=='welfare'&& modelShow" class="fixed_scroll">
        <!-- 添加福利 -->
        <el-form
          ref="welfareForm"
          :model="welfareForm"
          :rules="welfareRules"
          class="modelForm"
          label-width="90px"
          label-position="right">
          <el-form-item label="福利：" prop="welfareId">
            <el-select v-model="welfareForm.welfareId" placeholder="请选择福利" filterable style="width:500px">
              <el-option v-for="(item,index) in welfareList" :label="item.label" :value="item.value" :key="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="数量：" prop="number">
            <template>
              <el-input-number
                v-model.trim="welfareForm.number"
                :min="1"
                :max="500"
                size="large"
                controls-position="right"
                style="width:500px"
                placeholder="请输入数量" />
            </template>
          </el-form-item>
          <el-form-item label="备注：" prop="remarks">
            <el-input
              :rows="6"
              v-model.trim="welfareForm.remarks"
              type="textarea"
              style="width:500px"
              placeholder="请输入备注,最大长度为120个字" />
          </el-form-item>
          <el-form-item label="联系人：" prop="shipName">
            <el-input v-model.trim="welfareForm.shipName" autocomplete="off" style="width:500px" placeholder="请输入联系人" />
          </el-form-item>
          <el-form-item label="联系电话：" prop="mobile">
            <el-input v-model.trim="welfareForm.mobile" autocomplete="off" style="width:500px" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="省市区：" prop="shipAreas">
            <el-cascader
              ref="shipArea"
              :options="areaList"
              v-model="welfareForm.shipAreas"
              style="width:500px"
              placeholder="请选择省市区"
              @change="getAreaValues('address')" />
          </el-form-item>
          <el-form-item label="详细地址：" prop="shipAddr">
            <el-input
              :rows="4"
              v-model.trim="welfareForm.shipAddr"
              type="textarea"
              style="width:500px"
              placeholder="请输入详细地址,最大长度为120个字" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <!-- 添加联系人 -->
      <el-scrollbar v-if="(modelType=='add'||modelType=='editContacts')&&modelShow" class="fixed_scroll over_scroll">
        <el-form
          ref="addAssignForm"
          :model="addAssignForm"
          :rules="addAssignRules"
          class="modelForm"
          label-width="100px"
          label-position="right">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model.trim="addAssignForm.name" autocomplete="off" style="width:500px" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-radio-group v-model="addAssignForm.sex" placeholder="请选择性别">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="部门职务：" prop="job">
            <el-input v-model.trim="addAssignForm.job" autocomplete="off" style="width:500px" placeholder="请输入部门职务" />
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model.trim="addAssignForm.phone" autocomplete="off" style="width:500px" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="微信号：" prop="wechat">
            <el-input v-model.trim="addAssignForm.wechat" autocomplete="off" style="width:500px" placeholder="请输入微信号" />
          </el-form-item>
          <el-form-item label="QQ号：" prop="qq">
            <el-input v-model.trim="addAssignForm.qq" autocomplete="off" style="width:500px" placeholder="请输入QQ号" />
          </el-form-item>
          <el-form-item label="生日：" prop="birthday">
            <el-date-picker
              v-model="addAssignForm.birthday"
              style="width:500px"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <!-- 跟进 -->
      <el-scrollbar v-if="modelType=='follow'&&modelShow" class="fixed_scroll over_scroll">
        <el-form
          ref="followAssignForm"
          :model="followAssignForm"
          class="modelForm"
          label-width="120px"
          label-position="right">
          <el-form-item label="跟进方式：" class="red_star_wraper">
            <i class="red_star">*</i>
            <el-select v-model="followAssignForm.followType" placeholder="请选择" style="width:250px">
              <el-option
                v-for="item in followType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                style="width:250px" />
            </el-select>
            <el-date-picker
              v-model="followAssignForm.thisDate"
              type="datetime"
              style="width:250px"
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="dateChangelast" />
          </el-form-item>
          <el-form-item label="跟进内容：" class="red_star_wraper">
            <i class="red_star">*</i>
            <el-input
              v-model.trim="followAssignForm.content"
              :rows="4"
              maxlength="500"
              type="textarea"
              autocomplete="off"
              style="width:500px"
              placeholder="请输入内容,最大长度为500" />
          </el-form-item>
          <el-form-item label="下次跟进时间：" class="red_star_wraper">
            <i class="red_star" style="position: absolute;left: -120px;">*</i>
            <el-date-picker
              v-model="followAssignForm.nextDate"
              type="datetime"
              style="width:500px"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择下次跟进时间"
              @change="dateChange" />
          </el-form-item>
          <el-form-item label="附件：" prop="file" class="red_star_wraper">
            <i class="red_star" style="position: absolute;left: -63px;">*</i>
            <el-upload
              ref="upload"
              :on-preview="handlePreview"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :on-change="uploadChange"
              :limit="1"
              :name="'files'"
              :action="uploadUrl"
              :file-list="fileList"
              style="width:500px"
              class="upload-demo"
              multiple>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传只能上传jpg/png格式文件，文件大小不超过5M</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <!-- 管理微信小号 -->
      <el-scrollbar v-if="modelType=='webcat'&&modelShow" class="fixed_scroll">
        <el-form ref="wechatForm" :model="wechatForm" class="modelForm" label-width="140px" label-position="right">
          <el-form-item label="添加微信小号：" prop="wechat" class="red_star_webcat">
            <i class="red_star">*</i>
            <el-input v-model.trim="wechatForm.wechat" placeholder="请输入微信小号" style="width:360px" />
            <el-button type="primary" class="webcat" @click="addWechat('wechat')">添加</el-button>
          </el-form-item>
          <el-form-item label="添加微信连锁号：" prop="wechatLink" class="red_star_webcat">
            <i class="red_star">*</i>
            <el-input v-model.trim="wechatForm.wechatLink" placeholder="请输入微连锁号" style="width:360px" />
            <el-button type="primary" class="webcat" @click="addWechat('wechatLink')">添加</el-button>
          </el-form-item>
          <el-form-item label="已添加微信小号：">
            <el-tag
              v-for="item in wechatList"
              :key="item.value"
              :disable-transitions="false"
              closable
              style="margin-right:10px;"
              @close="removeWechat(item.value,'small',item.label)">
              {{ item.label }}
            </el-tag>
          </el-form-item>
          <el-form-item label="已添加微信连锁号：">
            <el-tag
              v-for="item in wechatLinkList"
              :key="item.value"
              :disable-transitions="false"
              closable
              style="margin-right:10px;"
              @close="removeWechat(item.value,'link',item.label)">
              {{ item.label }}
            </el-tag>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div v-if="modelType!='chain'&&modelType!='wechat'" slot="footer" class="dialog-footer">
        <el-button v-show="modelType!='addr'&&modelType!='webcat'" @click="restForm">重 置</el-button>
        <el-button v-show="modelType!='webcat'" :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  saveFollowAgent,
  deleteOneById,
  getContractList,
  AddblackList,
  getBussinessList,
  searchContract,
  getwelfarelist,
  followEdit
} from '@/api/agent'
import {
  getAgentviewBytype,
  addfollow,
  addConcatsInfo,
  AddWxchat,
  getWxchatList,
  addTransformationLabel,
  deletelWxCode,
  editAdress,
  grantwelfare,
  welfTips,
  removerContact,
  changeaddConcat
} from '@/api/agent'
import {
  getAreaList
} from '@/api/public'
export default {
  name: 'FollowUp',
  data() {
    const checkNum = (rule, value, callback) => {
      if (!value) {
        return new Error('福利不能为空')
      } else {
        if (value < 0) {
          callback(new Error('输入的福利数量不能为负数'))
        } else {
          callback()
        }
      }
    }
    return {
      btnType: 'follow',
      filesArr: [],
      proxyId: '',
      proxyInfo: {},
      assignList: [],
      fileUrl: '',
      studyInfo: [],
      agentInfo: {},
      salesInfo: {},
      serviceInfo: {},
      fileList: [],
      uploadUrl: '',
      searchInfo: {
        mode: 'overview', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      followType: [{
        value: '0',
        label: '到访'
      }, {
        value: '1',
        label: '电话'
      }],
      choseType: '',
      modelType: '',
      modelTitle: '',
      modelShow: false,
      bussinessShowList: [],
      wechatList: [],
      wechatLinkList: [],
      typeList: [{
        label: '概览信息',
        name: 'overview'
      },
      {
        label: '经销商信息',
        name: 'agent'
      },
      {
        label: '归属人信息',
        name: 'belonger'
      },
      {
        label: '客服信息',
        name: 'customer'
      },
      {
        label: '联系人信息',
        name: 'contacts'
      },
      {
        label: '跟进记录',
        name: 'followUp'
      },
      {
        label: '操作记录',
        name: 'operation'
      },
      {
        label: '学习记录',
        name: 'study'
      }
      ],
      operateInfo: [],
      followInfo: [],
      tableData: [],
      wechatForm: {
        wechat: '',
        type: '',
        wechatLink: '',
        typeLink: ''
      },
      welfareForm: {
        welfareId: '',
        number: '1',
        remarks: '',
        mobile: '',
        shipAddr: '',
        shipArea: '',
        shipName: ''
      },
      welfareRules: {
        welfareId: [{
          required: true,
          message: '福利不能为空',
          trigger: 'change'
        }],
        number: [{
          required: true,
          message: '数量不能为空',
          trigger: 'change'
        }, {
          validator: checkNum,
          trigger: 'blur'
        }],
        remarks: [{
          required: true,
          message: '备注不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 120,
          message: '备注长度超出范围1-120位之间',
          trigger: 'blur'
        }],
        shipName: [{
          required: false,
          message: '联系人不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 20,
          message: '联系人长度在2-20位之间',
          trigger: 'blur'
        }],
        mobile: [{
          required: false,
          message: '联系电话不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[1][0-9]{10}$/,
          message: '联系电话格式错误',
          trigger: 'blur'
        }
        ],
        shipAreas: [{
          required: false,
          message: '省市区不能为空',
          trigger: 'change'
        }],
        shipAddr: [{
          required: false,
          message: '地址不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 120,
          message: '地址长度超出范围1-120位之间',
          trigger: 'blur'
        }]
      },
      proxyInfoForm: {
        name: '',
        sex: '1',
        Invitation_code: '',
        phone: '',
        wechat: '',
        source: '',
        qq: '',
        email: '',
        levleId: '',
        contractCode: '',
        address: '',
        areas: []
      },
      proxyInfoRules: {
        name: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 20,
          message: '姓名在2-20位之间',
          trigger: 'blur'
        }],
        Invitation_code: [{
          required: false,
          message: '邀请码不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 50,
          message: '邀请码长度为2-50',
          trigger: 'blur'
        }],
        sex: [{
          required: true,
          message: '性别不能为空',
          trigger: 'change'
        }],
        phone: [{
          required: false,
          message: '手机号不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[1][0-9]{10}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }
        ],
        wechat: [{
          required: false,
          message: '微信号不能为空',
          trigger: 'blur'
        }
        // {
        //   pattern: /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/,
        //   message: '微信号以字母开头，包含6-20个字母、数字、下划线和减号',
        //   trigger: 'blur'
        // }
        ],
        job: [{
          required: true,
          message: '部门职务不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 20,
          message: '部门职务的长度为2-20',
          trigger: 'blur'
        }],
        qq: [{
          pattern: /^[1-9][0-9]{4,10}$/,
          message: 'QQ号格式错误',
          trigger: 'blur'
        }],
        email: [{
          pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
          message: '邮箱格式错误',
          trigger: 'blur'
        }],
        levleId: [{
          required: true,
          message: '经销商等级不能为空',
          trigger: 'change'
        }],
        contractCode: [{
          required: true,
          message: '授权号不能为空',
          trigger: 'change'
        }, {
          pattern: /^[a-zA-Z0-9_]+$/,
          message: '授权号格式错误，只能由字符，数字，下划线组成',
          trigger: 'blur'
        }],
        areas: [{
          required: true,
          message: '省市区不能为空',
          trigger: 'change'
        }],
        address: [{
          required: true,
          message: '地址不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 120,
          message: '地址长度超出范围1-120位之间',
          trigger: 'blur'
        }],
        birthday: [{
          required: false,
          message: '请选择生日',
          trigger: 'change'
        }]
      },
      followAssignForm: {
        content: '',
        thisDate: '',
        followType: '',
        file: [{
          name: '',
          url: ''
        }],
        nextDate: ''
      },
      addAssignForm: {
        name: '',
        sex: '1',
        job: '',
        phone: '',
        wechat: '',
        qq: '',
        birthday: ''
      },
      addAssignRules: {
        name: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 20,
          message: '姓名的长度为2-20',
          trigger: 'blur'
        }],
        sex: [{
          required: true,
          message: '性别不能为空',
          trigger: 'change'
        }],
        phone: [{
          required: false,
          message: '手机号不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[1][0-9]{10}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }
        ],
        wechat: [{
          required: false,
          message: '微信号不能为空',
          trigger: 'blur'
        }
        // {
        //   pattern: /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/,
        //   message: '微信号以字母开头，包含6-20个字母、数字、下划线和减号',
        //   trigger: 'blur'
        // }
        ],
        job: [{
          required: true,
          message: '部门职务不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 20,
          message: '部门职务的长度为2-20',
          trigger: 'blur'
        }],
        qq: [{
          pattern: /^[1-9][0-9]{4,10}$/,
          message: 'QQ号格式错误',
          trigger: 'blur'
        }],
        birthday: [{
          required: false,
          message: '生日不可以为空',
          trigger: 'change'
        }]
      },
      contractList: [],
      areaList: [],
      follow_type: 'add',
      follor_id: '',
      agentLevelList: [],
      submitting: false,
      isdisable: false,
      isdisable2: false,
      isdisable3: false
    }
  },
  mounted() {
    this.fileUrl = process.env.FILE_API
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    this.proxyId = this.$route.query.id
    this.choseType = this.$route.query.choseType
    this.btnType = this.$route.query.type
    console.log(this.$route.query)
    // 获取列表
    this.getListInfo()
    this.getOtherList()
  },
  methods: {
    editFollow(item) {
      console.log(item)
      this.followAssignForm = {
        content: item.content,
        thisDate: item.thisDate,
        followType: item.followType,
        file: item.file,
        nextDate: item.nextDate
      }
      this.follor_id = item.id
      this.fileList = item.file
      this.filesArr = item.file
      this.modelType = 'follow'
      this.follow_type = 'edit'
      this.modelShow = true
      this.modelTitle = '编辑跟进'
    },
    getAreasValue() {
      console.log(this.$refs['areaName'].getCheckedNodes()[0].pathLabels, 'askdhaslfjsdf')
      const arr = this.$refs['areaName'].getCheckedNodes()[0].pathLabels
      this.proxyInfoForm.areasName = arr.join('/')
    },
    getAreaValues() {
      const arr = this.$refs['shipArea'].getCheckedNodes()[0].pathLabels
      this.welfareForm.shipArea = arr.join(',')
    },
    dateChangelast(date) {
      if (date) {
        const nowTime = new Date()
        const lastTime = new Date(date)
        console.log(nowTime, lastTime)
        if (lastTime > nowTime) {
          this.$message({
            message: '跟进时间必须小于当前时间',
            type: 'warning'
          })
          this.followAssignForm.thisDate = ''
        }
      }
    },
    dateChange(date) {
      if (date) {
        const nowTime = new Date()
        const pickTime = new Date(date)
        console.log(nowTime, pickTime)
        if (pickTime < nowTime) {
          this.$message({
            message: '下次跟进时间必须大于当前时间',
            type: 'warning'
          })
          this.followAssignForm.nextDate = ''
        }
      }
    },
    getListInfo() {
      const that = this
      getAgentviewBytype(this.proxyId, this.choseType).then(res => {
        that.loading = false
        if (res.code === 200 || res.code === '200') {
          that.tableData = res.data.agentcontact
          that.agentInfo = res.data.agentinfo
          that.salesInfo = res.data.agentinfo.sales
          console.log(res.data.assign.length)
          if (res.data.assign.length > 0) {
            for (var i = 0; i < res.data.assign.length; i++) {
              if (res.data.assign[i].file != '' && res.data.assign[i].file != '[]') {
                res.data.assign[i].file = JSON.parse(res.data.assign[i].file)
              } else {
                res.data.assign[i].file = [{
                  name: '',
                  url: ''
                }]
              }
            }
          }
          that.followInfo = res.data.assign
          that.studyInfo = res.data.study != null ? res.data.study : []
          that.operateInfo = res.data.history != null ? res.data.history : []
          that.serviceInfo = res.data.agentinfo.service
        }
      })
    },
    addWechat(type) {
      const that = this
      if (type === 'wechat') {
        this.wechatForm.type = 1
        // 添加微信小号
        //  else if (!/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/.test(that.wechatForm.wechat)) {
        //   this.$message.warning('微信小号以字母开头，包含6-20个字母、数字、下划线和减号！')
        // }
        if (that.wechatForm.wechat == '') {
          this.$message.warning('请输入微信小号！')
        } else {
          this.$refs['wechatForm'].validate((valid) => {
            if (valid) {
              const obj = {
                wechat: that.wechatForm.wechat,
                type: that.wechatForm.type
              }
              console.log(this.wechatForm)
              AddWxchat(this.proxyId, obj).then(res => {
                console.log(res)
                this.wechatForm.type = 1
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '添加微信小号成功！',
                    type: 'success'
                  })
                  getWxchatList('small', this.proxyId).then(res => {
                    that.wechatList = res.data
                    console.log(that.wechatList)
                  })
                  that.$refs['wechatForm'].resetFields()
                  this.getListInfo()
                } else {
                  that.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                }
              })
            } else {
              console.log('error submit!!')
              // this.$message.warning('信息填写不完整或者信息填写有误！')
              this.$nextTick(() => {
                this.checkFormErr()
              })
              return false
            }
          })
        }
      } else {
        this.wechatForm.typeLink = 2
        if (that.wechatForm.wechatLink == '') {
          this.$message.warning('请输入微信连锁号！')
        } else {
          this.$refs['wechatForm'].validate((valid) => {
            if (valid) {
              console.log(valid)
              const obj = {
                wechat: that.wechatForm.wechatLink,
                type: that.wechatForm.typeLink
              }
              AddWxchat(this.proxyId, obj).then(res => {
                if (res.code === 200 || res.code === '200') {
                  this.$message({
                    message: '添加微连锁号成功',
                    type: 'success'
                  })
                  getWxchatList('link', this.proxyId).then(res => {
                    that.wechatLinkList = res.data
                  })
                  that.$refs['wechatForm'].resetFields()
                  this.getListInfo()
                } else {
                  that.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                }
              })
            } else {
              console.log('error submit!!')
              // this.$message.warning('信息填写不完整或者信息填写有误！')
              this.$nextTick(() => {
                this.checkFormErr()
              })
              return false
            }
          })
        }
      }
    },
    removeWechat(value, name, info) {
      const that = this
      console.log(value)
      console.log(name)
      console.log(info)
      if (name === 'small') {
        this.$confirm('你确定要删除微信小号吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          modal: false,
          // :modal-append-to-body:false
          type: 'warning'
        }).then(() => {
          console.log('确定')
          const infoData = {
            info: info,
            id: this.proxyId
          }
          deletelWxCode(value, name, infoData).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                message: '操作成功',
                type: 'success'
              })
              getWxchatList(name, this.proxyId).then(res => {
                that.wechatList = res.data
                console.log(that.wechatList)
              })
              this.getListInfo()
            } else {
              that.$message({
                message: '操作失败',
                type: 'warning'
              })
            }
          })
        }).catch(() => {
          console.log('取消')
        })
      } else {
        this.$confirm('你确定要删除微连锁号吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const infoData = {
            info: info,
            id: this.proxyId
          }
          console.log('确定')
          deletelWxCode(value, name, infoData).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                message: '操作成功',
                type: 'success'
              })
              getWxchatList(name, this.proxyId).then(res => {
                that.wechatLinkList = res.data
                console.log(that.wechatList)
              })
              this.getListInfo()
            } else {
              that.$message({
                message: '操作失败',
                type: 'warning'
              })
            }
          })
        }).catch(() => {
          console.log('取消')
        })
      }
    },
    uploadChange(file, filelist) {
      console.log(filelist, 'ddd')
      if (filelist.length && filelist.length >= 1) {
        this.$refs.followAssignForm.validateField('classFile')
      }
    },
    choseCourse(e) {
      console.log(e, 'hdzg')
      for (let i = 0; i < this.contractList.length; i++) {
        if (e == this.contractList[i].label) {
          this.proxyInfoForm.auth_code = this.contractList[i].value
        }
      }
      searchContract(e).then(res => {
        console.log(res, 'fdsafsag')
        this.proxyInfoForm.levleId = res.data.level
        console.log(this.proxyInfoForm, res.data.level)
      })
    },
    getOtherList() {
      const that = this
      // 获取省市区信息
      getAreaList().then(res => {
        console.log(res)
        that.areaList = res.data
      })
      // 获取福利列表
      getwelfarelist().then(res => {
        console.log(res)
        if (res.code === 200) {
          that.welfareList = res.data
        }
      })
      // // 获取全部商机列表
      // getBussinessList().then(res => {
      //   if (res.code === 200) {
      //     that.bussinessList = res.data
      //     that.bussinessShowList = res.data
      //     for (var i = 0; i < that.bussinessShowList.length; i++) {
      //       that.bussinessShowList[i].s
      //     }
      //   }
      // })
      // 授权号下拉框的列表
      getContractList().then(res => {
        console.log(res, 'fdsaf')
        if (res.code === 200) {
          const obj = {
            value: that.agentInfo.contractCode,
            label: that.agentInfo.contractName
          }
          res.data.unshift(obj)
          this.contractList = res.data
          console.log(this.contractList)
        }
      })
      // 获取经销商等级
      addTransformationLabel().then(res => {
        if (res.code === 200) {
          that.agentLevelList = res.data
        }
      })
    },
    resetModel() {
      if (this.modelType === 'proxy') {
        // 保存商机
        this.proxyInfoForm = {
          name: '',
          sex: '1',
          phone: '',
          wechat: '',
          source: '',
          qq: '',
          email: '',
          levleId: '',
          contractCode: '',
          address: '',
          areas: []
        }
      } else if (this.modelType === 'follow') {
        // 新跟进
        this.followAssignForm = {
          content: '',
          thisDate: '',
          followType: '',
          file: [{
            name: '',
            url: ''
          }],
          nextDate: ''
        }
      } else if (this.modelType === 'add') {
        // 联系人
        this.addAssignForm = {
          name: '',
          sex: '1',
          job: '',
          phone: '',
          wechat: '',
          qq: '',
          birthday: ''
        }
      } else if (this.modelType === 'webcat') {
        this.wechatForm = {
          wechat: '',
          type: '',
          wechatLink: '',
          typeLink: ''
        }
      } else {
        this.welfareForm = {
          welfareId: '',
          number: '1',
          remarks: '',
          mobile: '',
          shipAddr: '',
          shipArea: '',
          shipName: ''
        }
      }
      this.modelShow = false
      this.submitting = false
    },
    restForm() {
      if (this.modelType === 'proxy') {
        // 保存商机
        this.proxyInfoForm = {
          name: '',
          sex: '1',
          phone: '',
          wechat: '',
          source: '',
          qq: '',
          email: '',
          levleId: '',
          contractCode: '',
          address: '',
          areas: []
        }
        this.$nextTick(() => {
          this.$refs.proxyInfoForm.clearValidate()
        })
      } else if (this.modelType === 'follow') {
        // 新跟进
        this.followAssignForm = {
          content: '',
          thisDate: '',
          followType: '',
          file: [{
            name: '',
            url: ''
          }],
          nextDate: ''
        }
      } else if (this.modelType === 'add') {
        // 联系人
        this.addAssignForm = {
          name: '',
          sex: '1',
          job: '',
          phone: '',
          wechat: '',
          qq: '',
          birthday: ''
        }
      } else if (this.modelType === 'webcat') {
        this.wechatForm = {
          wechat: '',
          type: '',
          wechatLink: '',
          typeLink: ''
        }
      } else {
        this.welfareForm = {
          welfareId: '',
          number: '1',
          remarks: '',
          mobile: '',
          shipAddr: '',
          shipArea: '',
          shipName: ''
        }
      }
    },
    viewEdit(data, type) {
      const that = this
      if (type == 'editContacts') {
        this.addAssignForm = {
          id: data.id,
          name: data.name,
          sex: data.sex,
          job: data.job,
          phone: data.phone,
          wechat: data.wechat,
          qq: data.qq,
          birthday: data.birthday
        }
        this.modelShow = true
        this.modelType = 'editContacts'
      } else {
        this.$confirm('确定要删除该联系人吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removerContact(data.id, this.proxyId).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                message: '删除成功',
                type: 'success'
              })
              that.getListInfo()
            } else {
              that.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
        }).catch(() => {
          console.log('取消')
        })
      }
    },
    saveModel() {
      const that = this
      if (this.modelType === 'proxy') {
        // 保存商机
        this.$refs['proxyInfoForm'].validate((valid) => {
          if (valid) {
            that.submitting = true
            var obj = {
              id: that.proxyId,
              name: this.proxyInfoForm.name,
              sex: this.proxyInfoForm.sex,
              phone: this.proxyInfoForm.phone,
              Invitation_code: this.proxyInfoForm.Invitation_code,
              wechat: this.proxyInfoForm.wechat,
              source: this.proxyInfoForm.source,
              qq: this.proxyInfoForm.qq,
              email: this.proxyInfoForm.email,
              levleId: this.proxyInfoForm.levleId,
              contractCode: this.proxyInfoForm.contractCode,
              address: this.proxyInfoForm.address,
              areas: this.proxyInfoForm.areas,
              job: this.proxyInfoForm.job,
              birthday: this.proxyInfoForm.birthday
            }
            console.log(this.proxyInfoForm)
            saveFollowAgent(obj).then(res => {
              console.log(res)
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                })
                that.resetModel()
                that.getListInfo()
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          } else {
            console.log('error submit!!')
            // this.$message.warning('信息填写不完整或者信息填写有误！')
            this.$nextTick(() => {
              this.checkFormErr()
            })
            return false
          }
        })
      } else if (this.modelType === 'follow') {
        // 新跟进
        if (this.followAssignForm.followType === '') {
          this.$message.warning('请选择跟进方式！')
        } else if (this.followAssignForm.thisDate === '') {
          this.$message.warning('请选择跟进日期！')
        } else if (this.followAssignForm.content === '') {
          this.$message.warning('跟进内容不可以为空！')
        } else if (this.followAssignForm.nextDate === '') {
          this.$message.warning('请选择下次跟进日期！')
        } else if (this.filesArr.length <= 0) {
          this.$message.warning('请上传附件！')
        } else {
          this.$refs['followAssignForm'].validate((valid) => {
            if (valid) {
              that.submitting = true
              this.followAssignForm.file = JSON.stringify(that.filesArr)
              if (that.follow_type == 'add') {
                addfollow(that.proxyId, 'agent', this.followAssignForm).then(res => {
                  console.log(res)
                  that.submitting = false
                  if (res.code === 200 || res.code === '200') {
                    this.$message({
                      message: '保存成功！',
                      type: 'success'
                    })
                    that.filesArr = []
                    that.fileList = []
                    that.resetModel()
                    that.getListInfo()
                  } else {
                    that.$message({
                      message: res.data.msg,
                      type: 'warning'
                    })
                  }
                })
              } else {
                followEdit(that.follor_id, this.followAssignForm).then(res => {
                  console.log(res)
                  that.submitting = false
                  if (res.code === 200 || res.code === '200') {
                    this.$message({
                      message: '保存成功！',
                      type: 'success'
                    })
                    that.filesArr = []
                    that.fileList = []
                    that.resetModel()
                    that.getListInfo()
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
        }
      } else if (this.modelType === 'add' || this.modelType === 'editContacts') {
        // 联系人
        this.$refs['addAssignForm'].validate((valid) => {
          if (valid) {
            if (this.addAssignForm.phone == '' && this.addAssignForm.wechat == '') {
              that.$message({
                message: '手机号和微信号必须填一个',
                type: 'warning'
              })
            } else {
              if (this.modelType === 'add') {
                var obj = {
                  ...that.addAssignForm
                }
                that.submitting = true
                addConcatsInfo(that.proxyId, obj).then(res => {
                  console.log(res)
                  that.submitting = false
                  if (res.code === 200 || res.code === '200') {
                    this.$message({
                      message: '添加成功！',
                      type: 'success'
                    })
                    that.resetModel()
                    that.getListInfo()
                  } else {
                    that.$message({
                      message: res.data.msg,
                      type: 'warning'
                    })
                  }
                })
              } else {
                that.submitting = true
                var concatId = that.addAssignForm.id
                var obj = {
                  name: that.addAssignForm.name,
                  sex: that.addAssignForm.sex,
                  job: that.addAssignForm.job,
                  phone: that.addAssignForm.phone,
                  wechat: that.addAssignForm.wechat,
                  qq: that.addAssignForm.qq,
                  birthday: that.addAssignForm.birthday
                }
                changeaddConcat(concatId, this.proxyId, obj).then(res => {
                  console.log(res)
                  that.submitting = false
                  if (res.code === 200 || res.code === '200') {
                    this.$message({
                      message: '修改成功！',
                      type: 'success'
                    })
                    that.resetModel()
                    that.getListInfo()
                  } else {
                    that.$message({
                      message: res.data.msg,
                      type: 'warning'
                    })
                  }
                })
              }
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
      } else if (this.modelType === 'webcat') {
        console.log(that.addrForm)
        // 修改地址
        const obj = {
          id: that.proxyId,
          areas: [that.addrForm.areas[0], that.addrForm.areas[1], that.addrForm.areas[2]],
          address: that.addrForm.address
        }
        this.$refs['addrForm'].validate((valid) => {
          if (valid) {
            that.submitting = true
            editAdress(obj).then(res => {
              console.log(res)
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                this.$message({
                  message: '地址修改成功！',
                  type: 'success'
                })
                that.resetModel()
                that.getListInfo()
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          } else {
            console.log('error submit!!')
            // this.$message.warning('信息填写不完整或者信息填写有误！')
            this.$nextTick(() => {
              this.checkFormErr()
            })
            return false
          }
        })
      } else {
        // 添加福利
        this.$refs['welfareForm'].validate((valid) => {
          if (valid) {
            that.submitting = true
            welfTips(this.welfareForm.welfareId, this.proxyId).then(res => {
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                if (res.data.number != '') {
                  const msg = '该福利已经发放' + res.data.number + '件，最后一次发放时间是' + res.data.createdDate + '，是否要继续发放'
                  this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    const info = {
                      mobile: that.welfareForm.mobile,
                      number: that.welfareForm.number,
                      remarks: that.welfareForm.remarks,
                      shipAddr: that.welfareForm.shipAddr,
                      shipArea: that.welfareForm.shipArea,
                      shipName: that.welfareForm.shipName,
                      welfareId: that.welfareForm.welfareId
                    }
                    grantwelfare(that.proxyId, info).then(res => {
                      console.log(res)
                      that.submitting = false
                      if (res.code === 200 || res.code === '200') {
                        that.$message({
                          message: '添加福利成功！',
                          type: 'success'
                        })
                        that.$refs['welfareForm'].resetFields()
                        that.welfareForm = {
                          welfareId: '',
                          number: '1',
                          remarks: ''
                        }
                        that.modelShow = false
                        that.getListInfo()
                      } else {
                        that.$message({
                          message: res.data.msg,
                          type: 'warning'
                        })
                        that.welfareForm = {
                          welfareId: '',
                          number: '1',
                          remarks: ''
                        }
                        that.modelShow = false
                      }
                    })
                  }).catch(() => {
                    that.submitting = false
                    console.log('取消成功')
                  })
                } else {
                  const info = {
                    mobile: that.welfareForm.mobile,
                    number: that.welfareForm.number,
                    remarks: that.welfareForm.remarks,
                    shipAddr: that.welfareForm.shipAddr,
                    shipArea: that.welfareForm.shipArea,
                    shipName: that.welfareForm.shipName,
                    welfareId: that.welfareForm.welfareId
                  }
                  grantwelfare(that.proxyId, info).then(res => {
                    console.log(res)
                    that.submitting = false
                    if (res.code === 200 || res.code === '200') {
                      that.$message({
                        message: '添加福利成功！',
                        type: 'success'
                      })
                      that.$refs['welfareForm'].resetFields()
                      that.welfareForm = {
                        welfareId: '',
                        number: '1',
                        remarks: ''
                      }
                      that.modelShow = false
                      that.getListInfo()
                    } else {
                      that.$message({
                        message: res.data.msg,
                        type: 'warning'
                      })
                      that.welfareForm = {
                        welfareId: '',
                        number: '1',
                        remarks: ''
                      }
                      that.modelShow = false
                    }
                  })
                }
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          } else {
            console.log('error submit!!')
            // this.$message.warning('信息填写不完整或者信息填写有误！')
            this.$nextTick(() => {
              this.checkFormErr()
            })
            return false
          }
        })
      }
    },
    handleClick(tab, event) {
      console.log(event, tab)
      this.searchInfo.mode = tab.name
    },
    changeInfo(type) {
      var that = this
      if (type == 'proxy') {
        this.proxyInfoForm = {
          name: that.agentInfo.name,
          Invitation_code: that.agentInfo.Invitation_code,
          sex: that.agentInfo.sex,
          phone: that.agentInfo.phone,
          wechat: that.agentInfo.wechat,
          source: that.agentInfo.source,
          qq: that.agentInfo.qq,
          email: that.agentInfo.email,
          levleId: that.agentInfo.levleId,
          contractCode: that.agentInfo.contractCode,
          address: that.agentInfo.address,
          birthday: that.agentInfo.birthday != '0000-00-00' ? that.agentInfo.birthday : '',
          job: that.agentInfo.job,
          business_name: that.agentInfo.business_name,
          areas: (that.agentInfo.provinceId == 0 || that.agentInfo.cityId == 0 || that.agentInfo.areaId == 0) ? [] : [that.agentInfo.provinceId, that.agentInfo.cityId, that.agentInfo.areaId]
        }
        this.modelType = type
        this.modelShow = true
        this.modelTitle = '修改信息'
      } else if (type == 'follow') {
        this.modelType = type
        this.follow_type = 'add'
        this.modelShow = true
        this.modelTitle = '写新跟进'
      } else if (type == 'add') {
        this.modelType = type
        this.modelShow = true
        this.modelTitle = '添加联系人'
      } else if (type == 'remove') {
        this.$confirm('经销商一旦作废不可恢复，确定要“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteOneById(this.proxyId).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                message: '操作成功',
                type: 'success'
              })
              that.$router.back(-1)
            } else {
              that.$message({
                message: '操作失败',
                type: 'warning'
              })
            }
          })
        }).catch(() => {
          console.log('取消')
        })
      } else if (type == 'blacklist') {
        this.$confirm('确定将经销商“加入黑名单”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          AddblackList(this.proxyId).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                message: '操作成功',
                type: 'success'
              })
              that.$router.back(-1)
            } else {
              that.$message({
                message: '操作失败',
                type: 'warning'
              })
            }
          })
        }).catch(() => {
          console.log('取消')
        })
      } else if (type == 'webcat') {
        this.modelType = type
        this.modelShow = true
        this.modelTitle = '管理微信号'
        getWxchatList('small', this.proxyId).then(res => {
          that.wechatList = res.data
          console.log(that.wechatList)
        })
        getWxchatList('link', this.proxyId).then(res => {
          that.wechatLinkList = res.data
        })
      } else {
        this.modelType = type
        this.modelShow = true
        this.modelTitle = '添加福利'
      }
    },
    beforeUpload(file, fileList) {
      const isLt5M = file.size / 1024 / 1024 < 5
      // if (!isLt5M) {
      //   this.$message.warning('文件大小不能超过5M！')
      //   return false
      // }
      if (file.name.indexOf('.png') === -1 && file.name.indexOf('.jpg') === -1 && file.name.indexOf('.jpeg') === -1) {
        // this.$message.warning('文件格式必须是.png或.jpg或.jpeg或.bmp的后缀名！')
        this.$message.warning('文件格式不正确！')
        return false
      }
    },
    handlePreview(file) {
      console.log(file)
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
      console.log(fileList)
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
        this.followAssignForm.file = ''
      }
      console.log(this.filesArr)
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    },
    returnPage() {
      this.$router.back(-1)
    }
  }

}

</script>
<style lang="less" scoped>
  .style_null {
    width: 100%;
    text-align: center;
    color: #666;
    padding-top: 20px;
    font-size: 12px;
  }

  .modelForm {
    margin: 0 10px;

    .red_star_wraper {
      position: relative;

      .red_star {
        position: absolute;
        left: -90px;
        font-size: 13px;
        font-family: 'Arial Normal', 'Arial';
        color: #f56c6c;
      }
    }

    .red_star_webcat {
      position: relative;

      .red_star {
        position: absolute;
        left: -135px;
        top: 3px;
        font-size: 13px;
        font-family: 'Arial Normal', 'Arial';
        color: #f56c6c;
      }
    }
  }

  .find_wraper .find_bottom {
    /deep/ .el-table--border {
      border-right: none;
      border-bottom: none;
      padding: 0;
      // margin: 20px;
      width: 100%;
    }
  }

  .find_wraper_bottom {
    margin-bottom: 10px;
  }

  .find_wraper {
    position: absolute;
    width: 100%;
    top: 0;
    height: calc(100vh - 90px);
    overflow-y: scroll;
    overflow-x: hidden;

    .find_top {
      padding: 10px 20px 30px 40px;
      background-color: rgba(255, 255, 255, 1);
      color: #333;
      background: #fff;
      border: 1px solid rgba(233, 233, 233, 1);

      .find_top_t {
        width: 100%;
        text-align: right;
        font-size: 14px;

        span {
          cursor: pointer;
        }
      }

      .find_top_tit {
        height: 30px;
        // line-height: 40px;
        font-size: 18px;
        font-weight: 600;

        img {
          width: 26px;
          height: 20px;
          vertical-align: middle;
        }
      }

      .find_top_content {
        color: #999999;
        font-size: 12px;
        height: 40px;
        line-height: 40px;
        // margin-bottom: 10px;
        display: flex;
        justify-content: space-between;

        .find_top_content_span {
          margin-right: 20px;

          .style_color {
            color: #333;
          }
        }
      }

      .find_top_btn {
        margin-top: 10px;
        /deep/ .el-button{
          margin-bottom: 5px;
        }
      }
    }

    .find_center {
      margin-top: 10px;

      /deep/ .el-tabs__header {
        margin: 0
      }

      .find_center_click {
        width: 100%;
        margin-bottom: 10px;

        .find_center_chose {
          background: #fff;
          padding: 0 20px;
        }

        .find_center_tit {
          padding-bottom: 20px;
          background: #fff;
          margin-top: 5px;
        }

        .view_dialog_self {
          background: #fff;
          border: 1px solid #e4e4e4;
          border-left: 0;
          margin: 20px 90px 20px 30px;
          border-bottom: none;
          max-width: none;

          .view_line {
            .line_title {
              border-left: 1px solid #e4e4e4;
              color: #666;
              font-weight: normal;
            }
          }
        }
      }
    }

    .find_bottom {
      width: 100%;
      display: flex;
      // margin-bottom: 100px;
      justify-content: space-between;

      .find_bottom_left {
        width: 60%;

        .find_bottom_left_t {
          background: #fff;
          padding-bottom: 30px;

          .follow_wraper {
            padding-top: 20px;

            /deep/ .el-card.is-always-shadow {
              box-shadow: none
            }

            .el-timeline {
              margin-right: 30px;
              margin-left: -10px;
            }

            /deep/ .el-card__body {
              // width: 520px;
              background-color: rgba(247, 251, 254, 1);
              border-color: rgba(215, 232, 244, 1);
            }

            .follow_name {
              color: #333;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 13px;

              img {
                vertical-align: middle;
                width: 16px;
                height: 18px;
                margin-right: 10px;
              }

              :nth-child(3) {
                color: #666;
              }
            }

            .follow_top {
              padding-left: 26px;
              margin-top: 15px;
              color: #999;
              font-size: 12px;

              .follow_right {
                padding-right: 8px;
              }
            }

            .follow_content {
              color: #333;
              padding-left: 26px;
              overflow: hidden;
              /*超出隐藏*/
              text-overflow: ellipsis;
              /*文本溢出时显示省略标记*/
              display: -webkit-box;
              /*设置弹性盒模型*/
              -webkit-line-clamp: 3;
              /*文本占的行数,如果要设置2行加...则设置为2*/
              -webkit-box-orient: vertical;
              /*子代元素垂直显示*/
            }

            .follow_bto {
              .follow_file {
                padding-left: 26px;
                font-size: 12px;
                color: #333;

                .file_up {
                  word-break: break-all;
                }

                a {
                  color: rgb(60, 142, 233);
                }
              }

              .follow_timer {
                font-size: 12px;
                color: #999;

                img {
                  vertical-align: middle;
                  width: 12px;
                  height: 13px;
                  margin-right: 10px;
                }
              }
            }
          }
        }
      }

      // .find_bottom_left_color{
      //   width: 100%;
      //    .follow_wraper{
      //      width: 60%
      //    }
      // }
      .find_bottom_right {
        width: 39%;

        .find_bottom_right_t {
          background: #fff;
          padding-bottom: 30px;
        }

        ul {
          padding: 0;
          margin: 0;
          list-style-type: none;
          padding: 20px 20px 20px 30px;

          li {
            padding: 0;
            margin: 0;
            list-style-type: none;
            display: flex;
            align-items: center;
            margin-bottom: 20px;

            div.operate {
              margin-right: 10px;

              span {
                display: block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: rgb(0, 153, 204);
              }
            }

            .operate_con {
              font-size: 12px;
              width: 98%;

              span.span_time {
                display: block;
                color: #999;
                margin-bottom: 4px;
              }

              span.span_cont {
                display: block;
                color: #666;
                width: 100%;
                // overflow: hidden;
                // display: -webkit-box;//将元素设为盒子伸缩模型显示
                // -webkit-box-orient: vertical;//伸缩方向设为垂直方向
                // -webkit-line-clamp: 3;//超出3行隐藏，并显示省略号
              }
            }
          }
        }
      }

      .view_dialog_followUp {
        // max-width: 320px;
        margin: 20px 30px 0 30px;

        .view_line {
          .line_title {
            color: #666;
            font-weight: normal;
          }
        }
      }

      .view_dialog_self {
        margin-left: 30px;
      }

      .view_dialog_follow {
        border: 0;
        margin: 20px 30px 0 30px;

        .view_line {
          td {
            border: 0;
          }

          .line_title {
            background: none;
            border: 0;
            color: #666;
            font-weight: normal;
          }
        }
      }
    }

    // tab修改背景切换样式
    .find_bottom_color {
      background: #fff;
    }

    .find_bottom_color .find_bottom_right_color {
      width: 100%;

      .tit_width {
        width: 39%
      }
      .tit_width_long{
        width: 100%;
      }
    }

    .find_bottom_color .find_bottom_left_color {
      width: 100%;

      .tit_width {
        width: 60%
      }
      .tit_width_long{
        width: 100%;
      }
    }

    .chose_style_tit {
      padding-left: 20px;
      background-color: rgba(249, 250, 252, 1);
      height: 40px;
      line-height: 40px;
      font-weight: 700;
      color: #333;
      font-size: 13px;
    }

  }

  /deep/::-webkit-scrollbar-track {
    background: #f3f3f3;
    // background: #fff;
  }

</style>
