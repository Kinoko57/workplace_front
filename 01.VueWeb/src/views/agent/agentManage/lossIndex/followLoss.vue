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
          <span class="find_top_content_span">经销商归属：<span
            class="style_color">{{ salesInfo.realname!=''&&salesInfo.realname!=undefined?salesInfo.realname:'暂无归属人' }}</span></span>
          <span v-if="agentInfo.nextDate!=''" class="find_top_content_span">下次跟进：<span
            class="style_color"
            style="color:#409EFF"><i
              class="el-icon-date"
              style="margin:0 4px;" />{{ agentInfo.nextDate }}</span></span>
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
            <div class="chose_style_tit">经销商信息</div>
            <table class="view_dialog view_dialog_self" cellpadding="0" cellspacing="0">
              <tr class="view_line">
                <td class="line_title">姓名：</td>
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(agentInfo.name)}">{{ agentInfo.name|textNull }}</span>
                </td>
                <td class="line_title">性别：</td>
                <td class="second_line">{{ agentInfo.sex==1?'男':(agentInfo.sex== 2?'女':'' ) }}</td>
                <td class="line_title">手机 ：</td>
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(agentInfo.phone)}">{{ agentInfo.phone|textNull }}</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">微信 ：</td>
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(agentInfo.wechat)}">{{ agentInfo.wechat|textNull }}</span>
                </td>
                <td class="line_title">经销商等级：</td>
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(agentInfo.levleName)}">{{ agentInfo.levleName|textNull }}</span>
                </td>
                <td class="line_title">经销商来源：</td>
                <td class="second_line">
                  <span v-if="agentInfo.source!=''">{{ agentInfo.source }}</span><span
                    v-else
                    style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">所属销售：</td>
                <td class="second_line">
                  <span
                    v-if="salesInfo.realname!=''&&salesInfo.realname!=undefined">{{ salesInfo.realname }}</span><span
                      v-else
                      style="color:#999">暂无数据</span>
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
                <td class="second_line">
                  <span v-if="agentInfo.birthday!=''&&agentInfo.birthday!=null">{{ agentInfo.birthday }}</span><span
                    v-else
                    style="color:#999">暂无数据</span></td>
                <td class="line_title">部门职务：</td>
                <td class="second_line">
                  <span v-if="agentInfo.job!=''">{{ agentInfo.job }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title">qq：</td>
                <td class="second_line">
                  <span v-if="agentInfo.qq!=''">{{ agentInfo.qq }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">微信小号：</td>
                <td class="second_line" style="padding-right: 6px">
                  <span v-if="agentInfo.smallWx!=undefined&&agentInfo.smallWx.length>0" >
                    <span v-for="(item,index) of agentInfo.smallWx" :key="index">{{ item.label }},</span>
                  </span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title"> 微信连锁号：</td>
                <td class="second_line" style="padding-right: 6px">
                  <span v-if="agentInfo.linkWx!=undefined&&agentInfo.linkWx.length>0" >
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
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(agentInfo.auth_code)}">{{ agentInfo.auth_code|textNull }}</span>

                </td>
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
            <div v-if="followInfo.length>0" :class="searchInfo.mode=='followUp'?'tit_width_long':''" class="follow_wraper block tit_width">
              <el-timeline>
                <el-timeline-item v-for="(item,index) of followInfo" :key="index" placement="top" type="primary">
                  <el-card>
                    <div class="follow_name"><img
                      src="@/assets/common/follow_user.png"
                      alt=""
                      srcset=""><span>{{ item.userName }}</span></div>
                    <div class="follow_top">
                      <span class="follow_right">跟进时间：{{ item.thisDate }}</span>
                      <span class="follow_right">跟进方式：{{ item.followType==0?'到访':'电话' }}</span>
                      <span>下次跟进：{{ item.nextDate }}</span>
                    </div>
                    <p class="follow_content">{{ item.content }}</p>
                    <div class="follow_bto">
                      <div class="follow_file">附件：<a
                        v-if="item.file.length>0&&item.file[0].name!=''"
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
                <!-- <el-table-column label="操作" width="120" align="center" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="viewEdit(scope.row,'edit')">修改</el-button>
                    <el-button type="text" size="small" @click="viewEdit(scope.row,'remover')">删除</el-button>
                  </template>
                </el-table-column> -->
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
                <td class="second_line">{{ salesInfo.gender==1?'男':(salesInfo.gender==2?'女':'') }}</td>
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
            <div>
              <table
                class="view_dialog view_dialog_follow tit_width"
                border="0"
                cellpadding="0"
                cellspacing="0"
                style="margin-top:0">
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
            </div>
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
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(serviceInfo.wechat)}">{{ serviceInfo.wechat|textNull }}</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">手机号：</td>
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(serviceInfo.phone)}">{{ serviceInfo.phone|textNull }}</span>
                </td>

              </tr>
              <tr class="view_line">
                <td class="line_title">客服号：</td>
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(serviceInfo.code)}">{{ serviceInfo.code|textNull }}</span>

                </td>
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
                        class="font_bold">{{ item.extra }}</span><span> {{ item.comment.salesName }}
                    </span>，<span>{{ item.comment.remarks }}</span>。</span>
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
                      class="font_bold">{{ item.actor }}</span><span> 忽略。</span></span>
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
                      class="font_bold">{{ item.actor }}</span><span> {{ item.context }}。</span></span>
                    <span v-if="item.action=='cradlegroupmemberdelete'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 移除摇篮群。</span></span>
                    <span v-if="item.action=='cradlegroupdmmembercreate'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> {{ item.context }}。</span></span>
                    <span v-if="item.action=='cradlegroupdmmemberdelete'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 移除摇篮群。</span></span>
                    <span v-if="item.action=='import'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 导入。</span></span>
                    <span v-if="item.action=='update'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 将 </span><span
                        class="font_bold">{{ item.field }}</span><span> 修改为 </span><span
                      class="font_bold">{{ item.new }}</span>。</span>
                    <span v-if="item.action=='memberassign'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 添加了培训回访 </span><span>，内容为 </span><span
                      class="font_bold">{{ item.comment.content }}</span>。</span>
                    <span v-if="item.action=='appoint'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 指派给 </span><span
                      class="font_bold">{{ item.extra }}</span><span> {{ item.comment.salesName }} </span>。</span>
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
                      class="font_bold">{{ item.actor }}</span><span> 忽略。</span></span>
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
                    <span v-if="item.action=='lose'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 关闭。</span></span>
                    <span v-if="item.action=='resale'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 二次销售</span>span
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
  </div>
</template>
<script>
import {
  getAgentviewBytype
} from '@/api/agent'
export default {
  name: 'LossFollow',
  data() {
    return {
      filesArr: [],
      proxyId: '',
      proxyInfo: {},
      assignList: [],
      fileUrl: '',
      studyInfo: [],
      agentInfo: {},
      salesInfo: {},
      operateInfo: [],
      serviceInfo: {},
      fileList: [],
      searchInfo: {
        mode: 'overview', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
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
      followInfo: [],
      tableData: [],
      choseType: '',
      submitting: false
    }
  },
  mounted() {
    this.fileUrl = process.env.FILE_API
    this.proxyId = this.$route.query.id
    this.choseType = this.$route.query.choseType
    // 获取列表
    this.getListInfo()
  },
  methods: {
    handleClick(tab, event) {
      console.log(event, tab)
      this.searchInfo.mode = tab.name
    },
    getListInfo() {
      const that = this
      getAgentviewBytype(this.proxyId, this.choseType).then(res => {
        that.loading = false
        if (res.code === 200 || res.code === '200') {
          that.tableData = res.data.agentcontact
          that.agentInfo = res.data.agentinfo
          that.salesInfo = res.data.agentinfo.sales
          if (res.data.assign.length > 0) {
            for (var i = 0; i < res.data.assign.length; i++) {
              if (res.data.assign[i].file != '') {
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
          console.log(that.followInfo)
          that.studyInfo = res.data.study != null ? res.data.study : []
          that.operateInfo = res.data.history != null ? res.data.history : []
          that.serviceInfo = res.data.agentinfo.service
        }
      })
    },
    returnPage() {
      this.$router.back(-1)
    }
  }

}

</script>
<style lang="less" scoped>
  .webcat {
    margin-top: 5px;
  }

  .style_null {
    width: 100%;
    text-align: center;
    color: #666;
    padding-top: 20px;
    font-size: 12px;
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
      padding: 10px 20px 10px 40px;
      background-color: rgba(255, 255, 255, 1);
      color: #333;
      background: #fff;
      border: 1px solid rgba(233, 233, 233, 1);

      .find_top_t {
        width: 100%;
        text-align: right;
        font-size: 14px;

        button {
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
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;

        .find_top_content_span {
          margin-right: 20px;

          .style_color {
            color: #333;
          }
        }
      }

      .find_top_btn {}
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

              //  display: flex;
              //  align-items: center;
              //  justify-content:space-between;
              .follow_file {
                font-size: 12px;
                padding-left: 26px;
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
              // min-width:300px;
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
        width: 100%
      }
    }

    .find_bottom_color .find_bottom_left_color {
      width: 100%;

      .tit_width {
        width: 60%
      }
      .tit_width_long{
        width: 100%
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
