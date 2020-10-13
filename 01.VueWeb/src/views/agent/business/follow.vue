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
          <span class="find_top_content_span">商机归属：<span
            class="style_color">{{ salesInfo.realname!=''&&salesInfo.realname!=undefined?salesInfo.realname:'暂无归属人' }}</span></span>
          <span v-if="agentInfo.nextDate!=0" class="find_top_content_span">下次跟进：<span
            class="style_color"
            style="color:#409EFF"><i
              class="el-icon-date"
              style="margin:0 4px;" />{{ agentInfo.nextDate }}</span></span>
        </div>
        <div v-if="choseType=='assign'||choseType=='createbyme'" class="find_top_btn">
          <el-button plain size="mini" icon="el-icon-edit-outline" @click="changeInfo('edit')">修改信息</el-button>
          <el-button
            v-if="choseType!='createbyme'"
            plain
            size="mini"
            icon="el-icon-edit-outline"
            @click="changeInfo('follow')">写新跟进</el-button>
          <el-button
            v-if="choseType!='createbyme'"
            plain
            size="mini"
            icon="el-icon-edit-outline"
            @click="changeInfo('add')">添加联系人</el-button>
          <el-button
            v-if="choseType!='createbyme'"
            plain
            size="mini"
            icon="el-icon-edit-outline"
            @click="changeInfo('address')">修改地址</el-button>
          <el-button
            v-if="choseType!='createbyme'"
            plain
            size="mini"
            icon="el-icon-edit-outline"
            @click="changeInfo('agent')">转为经销商</el-button>
        </div>
      </div>
      <div class="find_center">
        <div class="find_center_click">
          <div class="find_center_chose">
            <el-tabs v-model="searchInfo.mode" @tab-click="handleClick">
              <el-tab-pane v-for="(item,index) in typeList" :key="index" :label="item.label" :name="item.name" />
            </el-tabs>
          </div>
          <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='bussiness'" class="find_center_tit">
            <div class="chose_style_tit">商机信息</div>
            <table class="view_dialog view_dialog_self" cellpadding="0" cellspacing="0">
              <tr class="view_line">
                <td class="line_title">姓名：</td>
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(agentInfo.name)}">{{ agentInfo.name|textNull }}</span>
                  <!-- <span v-if="agentInfo.name!=''&&agentInfo.name!=null">{{ agentInfo.name }}</span>
                  <span v-else style="color:#999">暂无数据</span> -->
                </td>
                <td class="line_title">性别：</td>
                <td class="second_line">
                  <!-- <span :class="{null_data_style:nullStyle(agentInfo.sex)}">{{ (agentInfo.sex|textNull) }}</span> -->
                  <!-- <span :class="{null_data_style:nullStyle(agentInfo.sex)}">{{ (agentInfo.sex|textNull)==1?'男':(agentInfo.sex|textNull)== 2?'女':'' }}</span> -->
                  <span v-if="agentInfo.sex!=''&&agentInfo.sex!=null&&agentInfo.sex!=undefined">{{ agentInfo.sex==1?'男':(agentInfo.sex== 2?'女':'' ) }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title">手机 ：</td>
                <td class="second_line">
                  <span v-if="agentInfo.phone!=''&&agentInfo.phone!=null&&agentInfo.phone!=undefined">{{ agentInfo.phone }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">微信 ：</td>
                <td class="second_line">
                  <span :class="{null_data_style:nullStyle(agentInfo.wechat)}">{{ agentInfo.wechat|textNull }}</span>
                  <!-- <span v-if="agentInfo.wechat!=''&&agentInfo.wechat!=null">{{ agentInfo.wechat }}</span>
                  <span v-else style="color:#999">暂无数据</span> -->
                </td>
                <td class="line_title">部门职务：</td>
                <td class="second_line">
                  <span v-if="agentInfo.job!=''&&agentInfo.job!=null&&agentInfo.job!=undefined">{{ agentInfo.job }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title">商机来源：</td>
                <td class="second_line">
                  <span v-if="agentInfo.source!=''&&agentInfo.source!=null&&agentInfo.source!=undefined">{{ agentInfo.source }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">QQ号 ：</td>
                <td class="second_line">
                  <span v-if="agentInfo.qq!=''&&agentInfo.qq!=null&&agentInfo.qq!=undefined">{{ agentInfo.qq }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title"> 邮箱：</td>
                <td class="second_line">
                  <span v-if="agentInfo.email!=''&&agentInfo.email!=null&&agentInfo.email!=undefined">{{ agentInfo.qq }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title">生日：</td>
                <td class="second_line">
                  <span v-if="agentInfo.birthday!=''&&agentInfo.birthday!=null&&agentInfo.birthday!=undefined">{{ agentInfo.birthday }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">地址：</td>
                <td class="second_line" colspan="5">
                  <span v-if="agentInfo.areasName!=''||agentInfo.address!=''&&agentInfo.address!=undefined">{{ agentInfo.areasName }}{{ agentInfo.address }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div
        :class="searchInfo.mode=='followUp'||searchInfo.mode=='contacts'||searchInfo.mode=='belonger'||searchInfo.mode=='operation'?'find_bottom_color':''"
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
                <el-table-column label="操作" width="120" align="center" fixed="right">
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
          v-if="searchInfo.mode=='overview'||searchInfo.mode=='belonger'||searchInfo.mode=='operation'"
          :class="searchInfo.mode=='belonger'||searchInfo.mode=='operation'?'find_bottom_right_color':''"
          class="find_bottom_right">
          <div
            v-if="searchInfo.mode=='overview'||searchInfo.mode=='belonger'"
            class="find_wraper_bottom find_bottom_right_t">
            <div class="chose_style_tit">归属人信息</div>
            <table class="view_dialog view_dialog_followUp tit_width" cellpadding="0" cellspacing="0">
              <tr class="view_line">
                <td class="line_title">姓名：</td>
                <td class="second_line">
                  <span v-if="salesInfo.realname!=''&&salesInfo.realname!=null&&salesInfo.realname!=undefined">{{ salesInfo.realname }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">性别：</td>
                <td class="second_line">
                  <span v-if="salesInfo.gender!=''&&salesInfo.gender!=null&&salesInfo.gender!=undefined">{{ salesInfo.gender==1?'男':(salesInfo.gender== 2?'女':'' ) }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">手机：</td>
                <td class="second_line">
                  <span v-if="salesInfo.mobile!=''&&salesInfo.mobile!=null&&salesInfo.mobile!=undefined">{{ salesInfo.mobile }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">部门：</td>
                <td class="second_line">
                  <span v-if="salesInfo.name!=''&&salesInfo.name!=null&&salesInfo.name!=undefined">{{ salesInfo.name }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">上个归属人：</td>
                <td class="second_line">
                  <span v-if="salesInfo.secUser!=''&&salesInfo.secUser!=null&&salesInfo.name!=secUser">{{ salesInfo.secUser }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
            </table>
            <table class="view_dialog view_dialog_followUp tit_width" cellpadding="0" cellspacing="0">
              <tr class="view_line">
                <td class="line_title">创建人：</td>
                <td class="second_line">
                  <span v-if="agentInfo.createdBy!=''&&agentInfo.createdBy!=null&&agentInfo.createdBy!=undefined">{{ agentInfo.createdBy }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">创建时间：</td>
                <td class="second_line">
                  <span v-if="agentInfo.createdDate!=''&&agentInfo.createdDate!=null&&agentInfo.createdDate!=undefined">{{ agentInfo.createdBy }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">最近更新人：</td>
                <td class="second_line">{{ agentInfo.editedBy }}
                  <span v-if="agentInfo.editedBy!=''&&agentInfo.editedBy!=null&&agentInfo.editedBy!=undefined">{{ agentInfo.editedBy }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">更新时间：</td>
                <td class="second_line">
                  <span v-if="agentInfo.editedDate!=''&&agentInfo.editedDate!=null&&agentInfo.editedDate!=undefined">{{ agentInfo.editedDate }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
            </table>
            <!-- <div>
              <table
                class="view_dialog view_dialog_follow tit_width"
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
          <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='operation'" class="find_bottom_right_t">
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
                    <span v-if="item.action=='editbusiness'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span> <span>{{ item.extra }}</span></span>
                    <span v-if="item.action=='import'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 导入。</span></span>
                    <span v-if="item.action=='update'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 将 </span><span
                        class="font_bold">{{ item.field }}</span><span> 修改为 </span><span
                          class="font_bold">{{ item.new }}</span></span>
                    <span v-if="item.action=='appoint'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 指派给 </span><span
                        class="font_bold">{{ item.extra }}</span><span> {{ item.comment.salesName }}
                    </span>，备注：<span>{{ item.comment.remarks }}</span>。</span>
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
                      class="font_bold">{{ item.actor }}</span><span> 忽略 {{ item.extra }}</span>。</span>
                    <span v-if="item.action=='addicon'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> {{ item.extra }}</span><span class="font_bold">
                      {{ item.comment.iconName }} </span>。</span>
                    <span v-if="item.action=='grantwelfare'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> {{ item.extra }}</span><span class="font_bold">
                      {{ item.comment.remarks }} </span>。</span>
                    <span v-if="item.action=='addblacklist'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 加入黑名单。</span></span>
                    <span v-if="item.action=='removeblacklist'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 移出黑名单。</span></span>
                    <span v-if="item.action=='bindwx'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> {{ item.extra }}</span><span class="font_bold">
                      {{ item.comment.wechat }} </span>。</span>
                    <span v-if="item.action=='editadress'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> {{ item.extra }}</span><span class="font_bold">
                      {{ item.comment.address }} </span>。</span>
                    <span v-if="item.action=='lose'"><span>由</span> <span class="font_bold">{{ item.actor }}
                    </span><span>{{ item.extra }} </span><span
                      class="font_bold">,备注：{{ item.comment.content }}</span></span>
                    <span v-if="item.action=='resale'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 二次销售</span><span
                      class="font_bold">,备注：{{ item.comment.remarks }}</span>。</span>
                    <span v-if="item.action=='receive'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 领取。</span></span>
                    <span v-if="item.action=='mobilesignup'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 参加学习 课程</span><span
                        class="font_bold">《{{ item.comment.lessionname }}》。手机签到</span></span>
                    <span v-if="item.action=='update'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 将 </span><span
                        class="font_bold">{{ item.field }}</span><span> 修改为 </span><span
                      class="font_bold">{{ item.new }}</span>。</span>
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
        </div>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="modelShow"
      :title="modelTitle"
      width="600px"
      class="dialogModel"
      @close="resetModel">
      <el-scrollbar v-if="modelType=='edit'&&modelShow" class="fixed_scroll over_scroll">
        <!-- 修改信息 -->
        <el-form
          ref="businessForm"
          :model="businessForm"
          :rules="businessRules"
          class="modelForm"
          label-width="100px"
          label-position="right">
          <el-form-item label="商机名称：" prop="business_name">
            <el-input
              v-model.trim="businessForm.business_name"
              autocomplete="off"
              style="width:500px"
              placeholder="请输入商机名称" />
          </el-form-item>
          <el-form-item label="姓名：" prop="name">
            <el-input v-model.trim="businessForm.name" autocomplete="off" style="width:500px" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-radio-group v-model="businessForm.sex" placeholder="请选择性别">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model.trim="businessForm.phone" autocomplete="off" style="width:500px" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="微信号：" prop="wechat">
            <el-input v-model.trim="businessForm.wechat" autocomplete="off" style="width:500px" placeholder="请输入微信号" />
          </el-form-item>
          <el-form-item label="部门职务：" prop="job">
            <el-input v-model.trim="businessForm.job" autocomplete="off" style="width:500px" placeholder="请输入部门职务" />
          </el-form-item>
          <el-form-item label="省市区：">
            <el-cascader
              ref="areasNames"
              :options="areaList"
              v-model="businessForm.areas"
              style="width:500px"
              placeholder="请选择省市区"
              @change="getAreasValue" />
          </el-form-item>
          <el-form-item label="详细地址：">
            <el-input
              :rows="4"
              v-model.trim="businessForm.address"
              maxlength="120"
              type="textarea"
              style="width:500px"
              placeholder="请输入详细地址，最大长度为120个字" />
          </el-form-item>
          <el-form-item label="来源：">
            <el-input v-model.trim="businessForm.source" autocomplete="off" style="width:500px" placeholder="请输入来源" />
          </el-form-item>
          <el-form-item label="QQ号：" prop="qq">
            <el-input v-model.trim="businessForm.qq" autocomplete="off" style="width:500px" placeholder="请输入QQ号" />
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model.trim="businessForm.email" autocomplete="off" style="width:500px" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="生日：" prop="birthday">
            <el-date-picker
              v-model="businessForm.birthday"
              style="width:500px"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间" />
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
            <el-input
              v-model.trim="addAssignForm.job"
              autocomplete="off"
              style="width:500px"
              placeholder="请输入联系人的部门职务" />
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
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
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
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:500px"
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
      <!-- 转为经销商 -->
      <el-scrollbar v-if="modelType=='agent'&&modelShow" class="fixed_scroll over_scroll">
        <el-form
          ref="agentAssignForm"
          :model="agentAssignForm"
          :rules="agentAssignRules"
          class="modelForm"
          label-width="120px"
          label-position="right">
          <table
            class="view_dialog view_dialog_change"
            cellpadding="0"
            cellspacing="0"
            style="margin:0 auto 30px;width:700px;margin-left:0">
            <tr class="view_line">
              <td class="line_title">姓名：</td>
              <td class="second_line">{{ agentInfo.name }}</td>
              <td class="line_title">性别：</td>
              <td class="second_line">{{ agentInfo.sex==1?"男":(agentInfo.sex==2?"女":'') }}</td>
            </tr>
            <tr class="view_line">
              <td class="line_title">微信：</td>
              <td class="second_line">{{ agentInfo.wechat }}</td>
              <td class="line_title">部门职务：</td>
              <td class="second_line"><span v-if="agentInfo.job!=''">{{ agentInfo.job }}</span>
                <span
                  v-else
                  style="color:#999">暂无数据</span>
              </td>
            </tr>
            <tr class="view_line">
              <td class="line_title">QQ号：</td>
              <td class="second_line"><span v-if="agentInfo.qq!=''">{{ agentInfo.qq }}</span>
                <span
                  v-else
                  style="color:#999">暂无数据</span>
              </td>
              <td class="line_title">邮箱：</td>
              <td class="second_line"><span v-if="agentInfo.email!=''">{{ agentInfo.email }}</span>
                <span
                  v-else
                  style="color:#999">暂无数据</span>
              </td>
            </tr>
            <tr class="view_line">
              <td class="line_title">手机：</td>
              <td class="second_line">
                <span v-if="agentInfo.phone!=''">{{ agentInfo.phone }}</span>
                <span v-else style="color:#999">暂无数据</span>
              </td>
              <td class="line_title">商机来源：</td>
              <td class="second_line"><span v-if="agentInfo.source!=''">{{ agentInfo.source }}</span>
                <span
                  v-else
                  style="color:#999">暂无数据</span>
              </td>
            </tr>
            <tr class="view_line">
              <td class="line_title">生日：</td>
              <td class="second_line">
                <span v-if="agentInfo.birthday!=''&&agentInfo.birthday!=null">{{ agentInfo.birthday }}</span>
                <span v-else style="color:#999">暂无数据</span>
              </td>
              <td class="line_title">地址：</td>
              <td class="second_line"><span
                v-if="agentInfo.areasName!=''||agentInfo.address!=''">{{ agentInfo.areasName }}{{ agentInfo.address }}</span>
                <span
                  v-else
                  style="color:#999">暂无数据</span>
              </td>
            </tr>
          </table>
          <el-form-item v-if="agentInfo.qq==''" label="QQ号：" prop="qq">
            <el-input v-model.trim="agentAssignForm.qq" autocomplete="off" style="width:500px" placeholder="请输入QQ号" />
          </el-form-item>
          <el-form-item v-if="agentInfo.email==''" label="邮箱：" prop="email">
            <el-input v-model.trim="agentAssignForm.email" autocomplete="off" style="width:500px" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item v-if="agentInfo.source==''" label="来源：">
            <el-input
              v-model.trim="agentAssignForm.source"
              autocomplete="off"
              style="width:500px"
              placeholder="请输入来源" />
          </el-form-item>
          <el-form-item label="授权号：" prop="contractCode">
            <el-select
              v-model="agentAssignForm.contractCode"
              clearable
              filterable
              placeholder="请输入授权号"
              style="width:500px"
              @change="choseCourse">
              <el-option v-for="item in contractList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="经销商等级：" prop="levleId">
            <el-select v-model="agentAssignForm.levleId" filterable disabled placeholder="请选择经销商等级" style="width:500px">
              <el-option v-for="(item,index) in agentLevelList" :label="item.label" :value="item.value" :key="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="省市区：" prop="areas">
            <el-cascader
              ref="areasNameAgent"
              :options="areaList"
              v-model="agentAssignForm.areas"
              style="width:500px"
              placeholder="请选择省市区"
              @change="getAreasValueAgent('agent')" />
          </el-form-item>
          <el-form-item label="详细地址：" prop="address">
            <el-input
              v-model.trim="agentAssignForm.address"
              :rows="2"
              type="textarea"
              autocomplete="off"
              style="width:500px"
              placeholder="请输入详细地址" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <!-- 添加地址 -->
      <el-scrollbar v-if="modelType=='address'&&modelShow" class="fixed_scroll">
        <!-- 修改地址 -->
        <el-form
          ref="addrForm"
          :model="addrForm"
          :rules="addrRules"
          class="modelForm"
          label-width="100px"
          label-position="left">
          <el-form-item label="省市区：" prop="areas">
            <el-cascader
              ref="areaName"
              :options="areaList"
              v-model="addrForm.areas"
              style="width:500px"
              placeholder="请选择省市区"
              @change="getAreasValueAgent('address')" />
          </el-form-item>
          <el-form-item label="详细地址：" prop="address">
            <el-input
              :rows="4"
              v-model.trim="addrForm.address"
              type="textarea"
              maxlength="120"
              style="width:500px"
              placeholder="请输入详细地址,最大长度为120个字" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  followBusiness,
  agentFollowInfo,
  editAgent,
  editAdress,
  addConcatsInfo,
  saveFollow,
  followEdit,
  saveTransformation,
  getContractList,
  searchContract,
  addTransformationLabel,
  removerContact,
  changeaddConcat
} from '@/api/agent'
import {
  getAreaList
} from '@/api/public'
export default {
  name: 'FollowUp',
  data() {
    return {
      type: 'view',
      modelType: '',
      modelTitle: '',
      choseType: '',
      modelShow: false,
      tableData: [],
      agentInfo: {},
      salesInfo: {},
      followInfo: [],
      operateInfo: [],
      contractList: [],
      agentLevelList: [],
      followType: [{
        value: '0',
        label: '到访'
      }, {
        value: '1',
        label: '电话'
      }],
      typeList: [{
        label: '概览信息',
        name: 'overview'
      },
      {
        label: '商机信息',
        name: 'bussiness'
      },
      {
        label: '归属人信息',
        name: 'belonger'
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
      }
      ],
      agentAssignForm: {
        contractCode: '',
        areas: [],
        address: '',
        levleId: '',
        source: '',
        qq: '',
        email: ''
      },
      agentAssignRules: {
        contractCode: [{
          required: true,
          message: '授权号不能为空',
          trigger: 'change'
        }, {
          pattern: /^[a-zA-Z0-9_]+$/,
          message: '授权号格式错误，只能由字符，数字，下划线组成',
          trigger: 'blur'
        }],
        levleId: [{
          required: true,
          message: '经销商等级不能为空',
          trigger: 'change'
        }],
        areas: [{
          required: true,
          message: '请选择省市区',
          trigger: 'change'
        }],
        address: [{
          required: true,
          message: '请输入详细地址',
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
        }]
      },
      addrForm: {
        areas: [],
        address: ''
      },
      addrRules: {
        areas: [{
          required: true,
          message: '请选择省市区',
          trigger: 'change'
        }],
        address: [{
          required: true,
          message: '请输入详细地址',
          trigger: 'blur'
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
          required: true,
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
          required: true,
          message: '微信号不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/,
          message: '微信号以字母开头，包含6-20个字母、数字、下划线和减号',
          trigger: 'blur'
        }
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
      businessForm: {
        business_name: '',
        name: '',
        sex: '1',
        phone: '',
        wechat: '',
        job: '',
        source: '',
        qq: '',
        email: '',
        areas: [],
        birthday: ''
      },
      businessRules: {
        business_name: [{
          required: true,
          message: '商机名称不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 20,
          message: '商机名称的长度为2-20',
          trigger: 'blur'
        }],
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
        email: [{
          pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
          message: '邮箱格式错误',
          trigger: 'blur'
        }],
        birthday: [{
          required: false,
          message: '请选择生日',
          trigger: 'change'
        }]
      },
      searchInfo: {
        mode: 'overview', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      filesArr: [],
      proxyId: '',
      fileUrl: '',
      proxyInfo: {},
      assignList: [],
      fileList: [],
      showFiles: [],
      follow_type: 'add',
      follor_id: '',
      uploadUrl: '',
      submitting: false,
      areaList: []
    }
  },
  mounted() {
    this.fileUrl = process.env.FILE_API
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    this.proxyId = this.$route.query.id
    this.type = this.$route.query.type
    this.choseType = this.$route.query.choseType
    // 获取列表
    this.getOtherList()
    this.getListInfo()
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
    choseCourse(e) {
      for (let i = 0; i < this.contractList.length; i++) {
        if (e == this.contractList[i].label) {
          this.proxyInfoForm.auth_code = this.contractList[i].value
        }
      }
      console.log(e, 'hdzg')
      searchContract(e).then(res => {
        console.log(res, 'fdsafsag')
        this.agentAssignForm.levleId = res.data.level
      })
    },
    getListInfo() {
      const that = this
      var info = {
        id: this.proxyId,
        type: this.choseType
      }
      agentFollowInfo(info).then(res => {
        that.loading = false
        if (res.code === 200 || res.code === '200') {
          that.tableData = res.data.agentcontact
          that.agentInfo = res.data.agentinfo
          that.salesInfo = res.data.agentinfo.sales
          if (res.data.assign.length > 0) {
            for (var i = 0; i < res.data.assign.length; i++) {
              res.data.assign[i].file = JSON.parse(res.data.assign[i].file)
            }
          }
          that.followInfo = res.data.assign
          that.operateInfo = res.data.history != null ? res.data.history : []
        }
      })
    },
    uploadChange(file, filelist) {
      console.log(filelist, 'ddd')
      if (filelist.length && filelist.length >= 1) {
        this.$refs.followAssignForm.validateField('classFile')
      }
    },
    getAreasValue() {
      console.log(this.$refs['areasNames'].getCheckedNodes()[0].pathLabels, 'askdhaslfjsdf')
      const arr = this.$refs['areasNames'].getCheckedNodes()[0].pathLabels
      this.businessForm.areasName = arr.join('/')
    },
    getAreasValueAgent(type) {
      if (type === 'address') {
        console.log(this.$refs['areaName'].getCheckedNodes()[0].pathLabels)
        const arr = this.$refs['areaName'].getCheckedNodes()[0].pathLabels
        this.addrForm.areasName = arr.join(',')
      } else {
        console.log(this.$refs['areasNameAgent'].getCheckedNodes()[0].pathLabels)
        const arr = this.$refs['areasNameAgent'].getCheckedNodes()[0].pathLabels
        this.agentAssignForm.areasNameAgent = arr.join(',')
      }
    },
    getOtherList() {
      const that = this
      // 获取省市区信息
      getAreaList().then(res => {
        console.log(res)
        that.areaList = res.data
      })
      // 授权号下拉框的列表
      getContractList().then(res => {
        if (res.code === 200) {
          this.contractList = res.data
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
      if (this.modelType == 'edit') {
        this.businessForm = {
          business_name: '',
          name: '',
          sex: '1',
          phone: '',
          wechat: '',
          job: '',
          source: '',
          qq: '',
          email: '',
          birthday: '',
          areas: []
        }
      } else if (this.modelType == 'follow') {
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
      } else if (this.modelType == 'add' || this.modelType == 'editContacts') {
        this.addAssignForm = {
          name: '',
          sex: '1',
          job: '',
          phone: '',
          wechat: '',
          qq: '',
          birthday: ''
        }
      } else if (this.modelType == 'address') {
        this.addrForm = {
          areas: [],
          address: ''
        }
      } else {
        this.agentAssignForm = {
          contractCode: '',
          areas: [],
          address: '',
          levleId: '',
          source: '',
          qq: '',
          email: ''
        }
      }
      this.modelShow = false
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
      if (this.modelType === 'edit') {
        // 保存商机
        this.$refs['businessForm'].validate((valid) => {
          if (valid) {
            if (this.businessForm.phone == '' && this.businessForm.wechat == '') {
              that.$message({
                message: '手机号和微信号必须填一个',
                type: 'warning'
              })
            } else {
              that.submitting = true
              const obj = {
                id: that.proxyId,
                business_name: that.businessForm.business_name,
                name: that.businessForm.name,
                sex: that.businessForm.sex,
                phone: that.businessForm.phone,
                wechat: that.businessForm.wechat,
                job: that.businessForm.job,
                source: that.businessForm.source,
                qq: that.businessForm.qq,
                email: that.businessForm.email,
                areas: that.businessForm.areas,
                birthday: that.businessForm.birthday,
                address: that.businessForm.address
              }
              editAgent(obj).then(res => {
                console.log(res)
                that.submitting = false
                if (res.code === 200 || res.code === '200') {
                  this.$message({
                    message: '商机修改成功！',
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
        if (that.filesArr.length > 0) {
          this.followAssignForm.file = this.filesArr
        }
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
                saveFollow(that.proxyId, this.followAssignForm).then(res => {
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
            if (this.modelType === 'add') {
              var obj = {
                ...that.addAssignForm
              }
              that.submitting = true
              addConcatsInfo(that.proxyId, obj).then(res => {
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
        })
      } else if (this.modelType === 'address') {
        console.log(that.addrForm)
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
        var obj = {
          levleId: that.agentAssignForm.levleId,
          contractCode: that.agentAssignForm.contractCode,
          address: that.agentAssignForm.address,
          areas: that.agentAssignForm.areas,
          // remarks: '',
          qq: that.agentAssignForm.qq != '' ? that.agentAssignForm.qq : that.agentInfo.qq,
          source: that.agentAssignForm.source != '' ? that.agentAssignForm.source : that.agentInfo.source,
          email: that.agentAssignForm.email != '' ? that.agentAssignForm.email : that.agentInfo.email
        }
        this.$refs['agentAssignForm'].validate((valid) => {
          if (valid) {
            that.submitting = true
            saveTransformation(this.proxyId, obj).then(res => {
              console.log(res)
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                this.$message({
                  message: '转化成功！',
                  type: 'success'
                })
                // that.$refs['conversionForm'].resetFields()
                that.resetModel()
                that.$router.back(-1)
                // that.modelShow = false
                // that.getList()
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
    restForm() {
      if (this.modelType == 'edit') {
        this.businessForm = {
          business_name: '',
          name: '',
          sex: '1',
          phone: '',
          wechat: '',
          job: '',
          source: '',
          qq: '',
          email: '',
          birthday: '',
          areas: []
        }
      } else if (this.modelType == 'follow') {
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
      } else if (this.modelType == 'add' || this.modelType == 'editContacts') {
        this.addAssignForm = {
          name: '',
          sex: '1',
          job: '',
          phone: '',
          wechat: '',
          qq: '',
          birthday: ''
        }
      } else if (this.modelType == 'address') {
        this.addrForm = {
          areas: [],
          address: ''
        }
      } else {
        this.agentAssignForm = {
          contractCode: '',
          areas: [],
          address: '',
          levleId: '',
          source: '',
          qq: '',
          email: ''
        }
        this.$nextTick(() => {
          this.$refs.agentAssignForm.clearValidate()
        })
      }
    },
    changeInfo(type) {
      if (type === 'edit') {
        this.modelType = type
        this.modelShow = true
        this.modelTitle = '修改信息'
        this.businessForm = {
          id: this.proxyId,
          business_name: this.agentInfo.business_name,
          name: this.agentInfo.name,
          sex: this.agentInfo.sex,
          phone: this.agentInfo.phone,
          wechat: this.agentInfo.wechat,
          job: this.agentInfo.job,
          source: this.agentInfo.source,
          qq: this.agentInfo.qq,
          email: this.agentInfo.email,
          birthday: this.agentInfo.birthday !== '0000-00-00' ? this.agentInfo.birthday : '',
          areas: [this.agentInfo.provinceId, this.agentInfo.cityId, this.agentInfo.areaId],
          address: this.agentInfo.address
        }
      } else if (type === 'follow') {
        this.modelType = type
        this.follow_type = 'add'
        this.modelShow = true
        this.modelTitle = '写新跟进'
      } else if (type === 'add') {
        this.modelType = type
        this.modelShow = true
        this.modelTitle = '添加联系人'
      } else if (type === 'address') {
        this.modelType = type
        this.modelShow = true
        this.modelTitle = '编辑地址'
        this.addrForm = {
          areas: [this.agentInfo.provinceId, this.agentInfo.cityId, this.agentInfo.areaId],
          address: this.agentInfo.address != '' ? this.agentInfo.address : ''
        }
      } else {
        this.modelType = type
        this.modelShow = true
        this.agentAssignForm = {
          contractCode: '',
          areas: [this.agentInfo.provinceId, this.agentInfo.cityId, this.agentInfo.areaId],
          address: this.agentInfo.address != '' ? this.agentInfo.address : '',
          levleId: '',
          source: '',
          qq: '',
          email: ''
        }
        this.modelTitle = '转为经销商'
      }
    },
    handleClick(tab, event) {
      console.log(event, tab)
      this.searchInfo.mode = tab.name
    },
    getList() {
      const that = this
      followBusiness(this.proxyId).then(res => {
        if (res.code === 200 || res.code === '200') {
          that.proxyInfo = res.data.agentinfo
          that.assignList = res.data.historyinfo

          for (var i = 0; i < that.assignList.length; i++) {
            that.showFiles[i] = [{
              name: '',
              url: ''
            }]
            if (that.assignList[i].action === 'assign') {
              if (that.assignList[i].comment.file !== null && that.assignList[i].comment.file !== 'null' && that
                .assignList[i].comment.file !== '' && that.assignList[i].comment.file !== '[object Object]') {
                console.log(typeof that.assignList[i].comment.file)
                that.assignList[i].comment.file = JSON.parse(that.assignList[i].comment.file)
                that.showFiles[i] = that.assignList[i].comment.file
              } else {
                that.assignList[i].file = [{
                  name: '',
                  url: ''
                }]
              }
            }
            that.$forceUpdate()
          }
          console.log('showFiles', that.showFiles)
          console.log('assignList', that.assignList)

          // if (that.assignList.file !== '' && that.assignList.file !== '[]' && that.assignList.file !== '[object Object]') {
          //   that.assignList.files = JSON.parse(that.agreementInfo.file)
          // }
        }
      })
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
              color: #666;
              font-weight: normal;
              border-left: 1px solid #e4e4e4;
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
              width: 98%;

              span.span_time {
                display: block;
                color: #999;
                margin-bottom: 4px;
              }

              span.span_cont {
                display: block;
                color: #666;
                //  width: 300px;
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

  .view_dialog_change {
    border-left: 0;

    .view_line {
      .line_title {
        border-left: 1px solid #e4e4e4;
      }
    }

  }

  /deep/::-webkit-scrollbar-track {
    background: #f3f3f3;
    // background: #fff;
  }

</style>
