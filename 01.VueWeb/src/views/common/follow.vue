<template>
  <div>
    <div class="find_wraper">
      <div class="find_top">
        <div class="find_top_t">
          <el-button size="mini" pain icon="el-icon-arrow-left" @click="returnPage">返回</el-button>
        </div>
        <div class="find_top_tit">
          <img src="@/assets/common/com_userName.png" alt="" srcset="">
          <span>{{ detailInfo.title }}</span>
        </div>
        <div class="find_top_content">
          <span class="find_top_content_span">投诉编号：<span
            class="style_color">{{ detailInfo.complainNumber }}</span></span>
          <span class="find_top_content_span">投诉类型：<span
            class="style_color">{{ detailInfo.processName }}</span></span>
          <span class="find_top_content_span">投诉日期：<span
            class="style_color">{{ detailInfo.createdDate }}</span></span>
        </div>
        <div class="find_top_content">
          <span class="find_top_content_span">审批状态：
            <el-tag v-if="detailInfo.status==0" size="small">待审批</el-tag>
            <el-tag v-if="detailInfo.status==1" size="small">审批中</el-tag>
            <el-tag v-if="detailInfo.status==2" type="danger" size="small">驳回</el-tag>
            <el-tag v-if="detailInfo.status==4" type="success" size="small">通过</el-tag>
            <!-- <span class="style_color">{{ detailInfo.status }}</span> -->
          </span>
          <span v-if="detailInfo.status==4" class="find_top_content_span">处理状态：
            <el-tag v-if="detailInfo.dealstatus!=2" size="small">待处理</el-tag>
            <el-tag v-if="detailInfo.dealstatus==2" type="success" size="small">已处理</el-tag>
            <!-- <span class="style_color">{{ detailInfo.status }}</span> -->
          </span>
        </div>
        <div v-if="viewType=='waitdeal'||viewType=='finishdeal'" class="find_top_btn">
          <el-button
            v-if="detailInfo.dealstatus==2"
            plain
            size="mini"
            icon="el-icon-edit-outline"
            @click="changeInfo('follow')">添加回访</el-button>
          <el-button
            :disabled="detailInfo.dealstatus==2||detailInfo.lowerstatus!=1"
            plain
            size="mini"
            icon="el-icon-edit-outline"
            @click="changeInfo('allocation')">投诉分配</el-button>
          <el-button
            :disabled="detailInfo.dealstatus==2"
            plain
            size="mini"
            icon="el-icon-edit-outline"
            @click="changeInfo('handling')">投诉处理</el-button>
          <el-button
            v-if="detailInfo.status==4"
            plain
            size="mini"
            icon="el-icon-edit-outline"
            @click="changeStates()">强制驳回</el-button>
        </div>
      </div>
      <div class="find_center">
        <div class="find_center_click">
          <div class="find_center_tit">
            <div class="chose_style_tit">投诉人信息</div>
            <div class="overflow_scroll_div">
              <table class="view_dialog view_dialog_self" cellpadding="0" cellspacing="0">
                <tr class="view_line">
                  <td class="line_title">投诉主题：</td>
                  <td :class="{null_data_style:nullStyle(detailInfo.title)}" class="second_line">{{ detailInfo.title|textNull }}</td>
                  <td class="line_title">投诉类型：</td>
                  <td :class="{null_data_style:nullStyle(detailInfo.processName)}" class="second_line">{{ detailInfo.processName|textNull }}</td>
                  <td class="line_title">登记人：</td>
                  <td :class="{null_data_style:nullStyle(detailInfo.registrant)}" class="second_line">{{ detailInfo.registrant |textNull }}</td>
                </tr>
                <tr class="view_line">
                  <td class="line_title">提交人：</td>
                  <td :class="{null_data_style:nullStyle(detailInfo.accountName)}" class="second_line">{{ detailInfo.accountName|textNull }}</td>
                  <td class="line_title">提交人部门：</td>
                  <td :class="{null_data_style:nullStyle(detailInfo.organize_name)}" class="second_line">{{ detailInfo.organize_name|textNull }}</td>
                  <td class="line_title">提交人岗位：</td>
                  <td :class="{null_data_style:nullStyle(detailInfo.groupName)}" class="second_line">{{ detailInfo.groupName|textNull }}</td>
                </tr>
                <tr class="view_line">
                  <td class="line_title">登记日期：</td>
                  <td class="second_line">
                    <span v-if="detailInfo.registrantDate!='0000-00-00 00:00:00'">
                      {{ detailInfo.registrantDate |textNull }}
                    </span>
                    <span v-else style="color:#999">暂无数据</span>
                  </td>
                  <td class="line_title">投诉人姓名：</td>
                  <td :class="{null_data_style:nullStyle(detailInfo.complainUserName)}" class="second_line">{{ detailInfo.complainUserName|textNull }}</td>
                  <td class="line_title">投诉人电话：</td>
                  <td :class="{null_data_style:nullStyle(detailInfo.complainUserPhone)}" class="second_line">{{ detailInfo.complainUserPhone |textNull }}</td>
                </tr>
                <tr class="view_line">
                  <td class="line_title">投诉人微信：</td>
                  <td :class="{null_data_style:nullStyle(detailInfo.complainUserWx)}" class="second_line">{{ detailInfo.complainUserWx |textNull }}</td>
                  <td class="line_title">投诉人客服号：</td>
                  <td :class="{null_data_style:nullStyle(detailInfo.complainService)}" class="second_line">{{ detailInfo.complainService|textNull }}</td>
                  <td class="line_title"/>
                  <td class="second_line"/>
                </tr>
                <tr class="view_line">
                  <td class="line_title">投诉原因：</td>
                  <td :class="{null_data_style:nullStyle(detailInfo.complainReason)}" class="second_line" colspan="5">{{ detailInfo.complainReason|textNull }}</td>
                </tr>
                <tr class="view_line">
                  <td class="line_title">投诉内容：</td>
                  <td :class="{null_data_style:nullStyle(detailInfo.content)}" class="second_line" colspan="5">{{ detailInfo.content |textNull }}</td>
                </tr>
                <tr class="view_line">
                  <td class="line_title">附件：</td>
                  <td colspan="5" class="second_line">
                    <div v-for="(item,index) in detailInfo.file" v-if="detailInfo.file!=''&&detailInfo.file[0].name!=''" :key="index">
                      <a
                        v-show="detailInfo.file!=''&&item.type!=undefined&&item.type=='file'"
                        :href="detailInfo.url + item.url"
                        download=""
                        style="display:block;font-size: 12px;max-width: 450px;width: auto;"
                        target="_blank">{{ item.name }}</a>
                      <span
                        v-show="detailInfo.file!=''&&item.type!=undefined&&item.type=='img'"
                        style="color: #409eff;text-decoration: underline;cursor: pointer;font-size: 12px;max-width: 450px;width: auto;"
                        title="点击查看大图"
                        @click="showBigImg(item.num)">{{ item.name }}</span>
                    </div>
                    <div v-else style="color:#999">暂无数据</div>
                  </td>
                </tr>
              </table>
            </div>

          </div>
          <div class="find_center_tit">
            <div class="chose_style_tit">被投诉人信息</div>
            <div class="overflow_scroll_div">
              <table class="view_dialog view_dialog_self" cellpadding="0" cellspacing="0">
                <tr class="view_line">
                  <td class="line_title">被投诉人姓名：</td>
                  <td :class="{null_data_style:nullStyle(detailInfo.complainToUserName)}" class="second_line">{{ detailInfo.complainToUserName|textNull }}</td>
                  <td class="line_title">被投诉人电话：</td>
                  <td :class="{null_data_style:nullStyle(detailInfo.complainToUserPhone)}" class="second_line">{{ detailInfo.complainToUserPhone |textNull }}</td>
                  <td class="line_title">被投诉人微信：</td>
                  <td :class="{null_data_style:nullStyle(detailInfo.complainToUserWx)}" class="second_line">{{ detailInfo.complainToUserWx|textNull }}</td>
                </tr>
                <tr class="view_line">
                  <td class="line_title">被投诉人客服号：</td>
                  <td :class="{null_data_style:nullStyle(detailInfo.complainToService)}" class="second_line">{{ detailInfo.complainToService|textNull }}</td>
                  <td class="line_title">被投诉人团队：</td>
                  <td :class="{null_data_style:nullStyle(detailInfo.complainToUserBelongTeam)}" class="second_line">{{ detailInfo.complainToUserBelongTeam|textNull }}</td>
                  <td class="line_title"/>
                  <td class="second_line"/>
                </tr>
              </table>
            </div>
          </div>
          <div class="find_center_tit find_follow" style="padding-bottom: 10px;">
            <div class="chose_style_tit">投诉回访</div>
            <div v-if="followInfo.length>0" class="follow_wraper block tit_width">
              <el-timeline>
                <el-timeline-item v-for="(item,index) of followInfo" :key="index" placement="top" type="primary">
                  <el-card>
                    <div class="follow_name">
                      <div><img src="@/assets/common/follow_user.png" alt="" srcset=""><span>{{ item.accountName }}</span></div>
                      <el-button size="mini" @click="editFollow(item)">编辑</el-button>
                    </div>
                    <div class="follow_top">
                      <span class="follow_right">回访时间：{{ item.thisDate }}</span>
                      <span class="follow_right">回访方式：{{ item.followType==0?'到访':'电话' }}</span>
                      <span>下次回访：{{ item.nextDate }}</span>
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
            <p v-else class="style_null">暂无回访记录~</p>
          </div>
          <div class="find_center_tit">
            <div class="chose_style_tit">投诉进程</div>
            <div v-if="carStep.length>0" class="car_view" style="padding: 0 20px;">
              <approval-step :step-list="carStep"/>
            </div>
          </div>
          <div class="find_center_tit" style="padding-bottom: 10px;">
            <div class="chose_style_tit">操作记录</div>
            <ul v-if="historyInfo.length>0" class="tit_width history_list">
              <li v-for="(item,index) of historyInfo" :key="index">
                <div class="operate"><span /></div>
                <div class="operate_con">
                  <span class="span_time">{{ item.date }}</span>
                  <span class="span_cont">
                    <span v-if="item.action=='create'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 创建</span>。</span>

                    <span v-if="item.action=='audit'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 审核</span>
                      <span v-if="item.comment=='pass'" class="font_bold">通过</span>
                      <span v-if="item.comment=='rejected'" class="font_bold">驳回</span>
                      <span v-if="item.extra==''">。</span>
                      <span v-if="item.extra!=''">，备注：</span><span
                        v-if="item.extra!=''"
                        class="font_bold">{{ item.extra }}。</span>
                    </span>
                    <span v-if="item.action=='update'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 编辑</span>。</span>

                    <span v-if="item.action=='callbackadd'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 回访</span>。</span>
                    <span v-if="item.action=='payment'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> {{ item.extra }}</span>。</span>
                    <span v-if="item.action=='allocation'">
                      <span>由</span>
                      <span class="font_bold">{{ item.actor }}</span><span> 分配给</span>
                      <span class="font_bold">{{ item.allot }},</span>
                      <span class="font_bold">分配意见：</span>
                      <span>{{ item.comment.auditRemark }}</span>。
                    </span>

                    <span v-if="item.action=='dispose'"><span>由</span> <span
                      class="font_bold">{{ item.actor }}</span><span> 处理,</span>
                      <span class="font_bold">处理意见：</span>
                      <span>{{ item.comment.auditRemark }}</span>
                      <span>附件：</span>
                      <span>
                        <a
                          v-for="(item,index) of item.comment.file"
                          v-show="item.name!=''"
                          :key="index"
                          :title="item.name"
                          :href="fileUrl+item.url"
                          download=""
                          target="_blank"
                          class="font_file">{{ item.name }}</a>
                        。
                      </span>
                    </span>
                </span></div>
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
      <el-scrollbar v-if="(modelType=='handling'||modelType=='allocation')&&modelShow" class="fixed_scroll over_scroll">
        <!-- 查看、审批投诉 -->
        <div class="view_welfare">
          <div class="approval_form" style="padding-top:20px">
            <!-- <p class="form_title text_left">投诉审批</p> -->
            <table class="view_dialog" cellpadding="0" cellspacing="0">
              <tr class="view_line">
                <td class="line_title border_left">投诉主题</td>
                <td :class="{null_data_style:nullStyle(detailInfo.title)}" class="second_line">{{ detailInfo.title |textNull }}</td>
                <td class="line_title border_left">提交人</td>
                <td :class="{null_data_style:nullStyle(detailInfo.accountName)}" class="second_line">{{ detailInfo.accountName |textNull }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title border_left">提交人部门</td>
                <td :class="{null_data_style:nullStyle(detailInfo.organize_name)}" class="second_line">{{ detailInfo.organize_name|textNull }}</td>
                <td class="line_title border_left">提交人岗位</td>
                <td :class="{null_data_style:nullStyle(detailInfo.groupName)}" class="second_line">{{ detailInfo.groupName |textNull }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title border_left">登记人</td>
                <td :class="{null_data_style:nullStyle(detailInfo.registrant)}" class="second_line">{{ detailInfo.registrant |textNull }}</td>
                <td class="line_title border_left">登记日期</td>
                <td class="second_line" >
                  <span v-if="detailInfo.registrantDate!='0000-00-00 00:00:00'">
                    {{ detailInfo.registrantDate |textNull }}
                  </span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title border_left">投诉人姓名</td>
                <td :class="{null_data_style:nullStyle(detailInfo.complainUserName)}" class="second_line">{{ detailInfo.complainUserName |textNull }}</td>
                <td class="line_title border_left">投诉人电话</td>
                <td :class="{null_data_style:nullStyle(detailInfo.complainUserPhone)}" class="second_line">{{ detailInfo.complainUserPhone |textNull }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title border_left">投诉人微信</td>
                <td :class="{null_data_style:nullStyle(detailInfo.complainUserWx)}" class="second_line">{{ detailInfo.complainUserWx |textNull }}</td>
                <td class="line_title border_left">投诉人客服号</td>
                <td :class="{null_data_style:nullStyle(detailInfo.complainService)}" class="second_line">{{ detailInfo.complainService |textNull }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title border_left">被投诉人姓名</td>
                <td :class="{null_data_style:nullStyle(detailInfo.complainToUserName)}" class="second_line">{{ detailInfo.complainToUserName |textNull }}</td>
                <td class="line_title border_left">被投诉人电话</td>
                <td :class="{null_data_style:nullStyle(detailInfo.complainToUserPhone)}" class="second_line">{{ detailInfo.complainToUserPhone|textNull }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title border_left">被投诉人微信</td>
                <td :class="{null_data_style:nullStyle(detailInfo.complainToUserWx)}" class="second_line">{{ detailInfo.complainToUserWx|textNull }}</td>
                <td class="line_title border_left">被投诉人客服号</td>
                <td :class="{null_data_style:nullStyle(detailInfo.complainToService)}" class="second_line">{{ detailInfo.complainToService |textNull }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title border_left">被投诉人团队</td>
                <td :class="{null_data_style:nullStyle(detailInfo.complainToUserBelongTeam)}" class="second_line">{{ detailInfo.complainToUserBelongTeam|textNull }}</td>
                <td class="line_title border_left">投诉原因</td>
                <td :class="{null_data_style:nullStyle(detailInfo.complainReason)}" class="second_line">{{ detailInfo.complainReason |textNull }}</td>
              </tr>
              <tr rowspan="2" class="view_line">
                <td class="line_title border_left">投诉内容</td>
                <td :class="{null_data_style:nullStyle(detailInfo.content)}" colspan="3" class="second_line">{{ detailInfo.content |textNull }}</td>
              </tr>
              <tr />
              <tr rowspan="2" class="view_line">
                <td class="line_title border_left">附件</td>
                <td colspan="3" class="second_line">
                  <div v-for="(item,index) in detailInfo.file" v-if="detailInfo.file!=''&&detailInfo.file[0].name!=''" :key="index" >
                    <a
                      v-show="detailInfo.file!=''&&item.type!=undefined&&item.type=='file'"
                      :href="detailInfo.url + item.url"
                      download=""
                      style="display:block;font-size: 12px;max-width: 450px;width: auto;"
                      target="_blank">{{ item.name }}</a>
                    <span
                      v-show="detailInfo.file!=''&&item.type!=undefined&&item.type=='img'"
                      style="color: #409eff;text-decoration: underline;cursor: pointer;font-size: 12px;max-width: 450px;width: auto;"
                      title="点击查看大图"
                      @click="showBigImg(item.num)">{{ item.name }}</span>
                  </div>
                  <div v-else style="color:#999">暂无数据</div>
                </td>
              </tr>
              <tr />
            </table>
            <div class="car_view">
              <approval-step :step-list="carStep"/>
            </div>
            <div v-if="modelType=='allocation'" class="view_comments" style="align-items:center;">
              <span><i class="red_star">*</i> 分配下级：</span>
              <el-select v-model="doUser" placeholder="请选择下级" style="width:250px">
                <el-option
                  v-for="item in userInfo"
                  :key="item.account"
                  :label="item.realname"
                  :value="item.account"
                  style="width:250px" />
              </el-select>
            </div>
            <div v-if="modelType=='allocation'" class="view_comments">
              <span><i class="red_star">*</i> 分配意见：</span>
              <el-input :rows="4" v-model="handlingInfo" type="textarea" style="width:700px" placeholder="请填写分配意见" />
            </div>
            <div v-if="modelType=='handling'" class="view_comments">
              <span><i class="red_star">*</i> 处理意见：</span>
              <el-input :rows="4" v-model="handlingInfo" type="textarea" style="width:700px" placeholder="请填写处理意见" />
            </div>
            <div v-if="modelType=='handling'" class="view_comments" style="align-items:center;">
              <span><i class="red_star">*</i> 附件：</span>
              <el-upload
                ref="upload"
                :on-preview="handlePreview"
                :on-exceed="handleExceed"
                :before-upload="beforeFileUpload"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :name="'files'"
                :file-list="fileList"
                :action="uploadUrl"
                class="upload-demo"
                multiple>
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">请上传压缩包、word文档、excel文档、ppt演示文稿、pdf文档、图片文件</div>
              </el-upload>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <!-- 跟进 -->
      <el-scrollbar v-if="modelType=='follow'&&modelShow" class="fixed_scroll over_scroll">
        <el-form
          ref="followComplaintForm"
          :model="followComplaintForm"
          class="modelForm"
          label-width="120px"
          label-position="right">
          <el-form-item label="回访方式：" class="red_star_wraper">
            <i class="red_star">*</i>
            <el-select v-model="followComplaintForm.followType" placeholder="请选择" style="width:250px">
              <el-option
                v-for="item in followType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                style="width:250px" />
            </el-select>
            <el-date-picker
              v-model="followComplaintForm.thisDate"
              type="datetime"
              style="width:250px"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              @change="dateChangelast" />
          </el-form-item>
          <el-form-item label="回访内容：" class="red_star_wraper">
            <i class="red_star">*</i>
            <el-input
              v-model.trim="followComplaintForm.content"
              :rows="4"
              maxlength="500"
              type="textarea"
              autocomplete="off"
              style="width:500px"
              placeholder="请输入内容,最大长度为500" />
          </el-form-item>
          <el-form-item label="下次回访时间：" class="red_star_wraper">
            <i class="red_star" style="position: absolute;left: -120px;">*</i>
            <el-date-picker
              v-model="followComplaintForm.nextDate"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:500px"
              placeholder="请选择回访时间"
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
      <div slot="footer" class="dialog-footer">
        <el-button v-if="modelType=='follow'" @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="imgShow" title="查看图片">
      <!--  detailInfo.url-->
      <div class="show_img_bg" style="height:68vh">
        <!-- <span class="btn_left">
          <i class="el-icon-back"/>
        </span> -->
        <el-carousel
          :autoplay="false"
          :loop="false"
          :initial-index="showIndex"
          indicator-position="none"
          style="height:68vh">
          <el-carousel-item v-for="(item,index) in imgList" :key="index" style="height:68vh;text-align: center;">
            <!-- width="100%" -->
            <div style="margin-bottom: 10px;">第{{ index+1 }}张</div>
            <img
              :src="imgUrl + item.url"
              alt=""
              style="cursor: pointer;max-width: 100%;max-height:52vh"
              title="图片显示不完整？点击查看完整图片"
              @click="openUrl(imgUrl + item.url)">
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
import {
  viewComplaintPageDetail, // 查看投诉详情
  handlingComplaint, // 投诉处理
  getDoComplaintUser, // 获取下级用户
  allocationComplaint, // 投诉分配
  rejectedAllComplaint,// 强制驳回
  saveComplaintFollow // 添加回访
} from '@/api/common'
import {
  followEdit
} from '@/api/agent'
export default {
  name: 'ComplaintDetailManage',
  data() {
    return {
      type: 'view',
      viewType: '',
      showIndex: 0,
      imgShow: false,
      imgUrl: '',
      imgList: [],
      modelType: '',
      modelTitle: '',
      modelShow: false,
      tableData: [],
      detailInfo: {},
      salesInfo: {},
      followInfo: [],
      contractList: [],
      agentLevelList: [],
      carStep: [],
      historyInfo: [],
      userInfo: [],
      doUser: '',
      followType: [{
        value: '0',
        label: '到访'
      }, {
        value: '1',
        label: '电话'
      }],
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
      followComplaintForm: {
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
      searchInfo: {
        mode: 'overview', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      filesArr: [],
      detailId: '',
      follor_id: '',
      follow_type: 'add',
      fileUrl: '',
      proxyInfo: {},
      assignList: [],
      fileList: [],
      handlingInfo: '', // 备注
      showFiles: [],
      uploadUrl: '',
      submitting: false,
      areaList: []
    }
  },
  mounted() {
    this.fileUrl = process.env.FILE_API
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    this.imgUrl = process.env.FILE_API
    this.detailId = this.$route.query.id
    this.viewType = this.$route.query.type
    // 获取投诉详情
    this.getDetail()
  },
  methods: {
    editFollow(item) {
      console.log(item)
      this.followComplaintForm = {
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
    getDetail() {
      const that = this
      viewComplaintPageDetail(this.detailId).then(res => {
        if (res.code === 200) {
          console.log(res)
          // 投诉详情
          that.detailInfo = {}
          that.detailInfo = res.data.apply
          if (res.data.complain.length > 0) {
            for (var i = 0; i < res.data.complain.length; i++) {
              res.data.complain[i].file = JSON.parse(res.data.complain[i].file)
            }
          }
          // 回访记录
          for (let i = 0; i < res.data.historyinfo.length; i++) {
            if (res.data.historyinfo[i].action == 'dispose') {
              res.data.historyinfo[i].comment.file = JSON.parse(res.data.historyinfo[i].comment.file)
            }
          }
          that.followInfo = res.data.complain
          that.historyInfo = res.data.historyinfo
          // 审批流节点
          that.carStep = res.data.nodes
          that.carStep.unshift({ name: '提交投诉', auditStatus: '2', auditer: that.detailInfo.accountName, auditDate: that.detailInfo.createdDate, auditRemark: '' })
          if (that.detailInfo.status == 4) {
            // 通过
            that.carStep.push({ name: '投诉完成', auditStatus: '2', auditer: '', auditDate: '', auditRemark: '', isend: 1 })
          } else {
            that.carStep.push({ name: '投诉完成', auditStatus: '0', auditer: '', auditDate: '', auditRemark: '', isend: 0 })
          }
          if (that.detailInfo.file !== undefined && that.detailInfo.file !== '' && that.detailInfo.file !== 'null' &&
              that.detailInfo.file !== null) {
            that.detailInfo.file = JSON.parse(that.detailInfo.file)
            that.detailInfo.url = process.env.FILE_API
          } else {
            that.detailInfo.file = [{
              url: '',
              name: '',
              type: 'file'
            }]
            that.detailInfo.url = ''
          }
          // 投诉详情的图片
          let k = 0
          if (that.detailInfo.file.length > 0 && that.detailInfo.file[0].name != '') {
            for (let i = 0; i < that.detailInfo.file.length; i++) {
              if (that.detailInfo.file[i].url.indexOf('.png') === -1 && that.detailInfo.file[i].url.indexOf(
                '.jpg') === -1 && that.detailInfo.file[i].url.indexOf('.bmp') === -1) {
                // 不是图片
                that.detailInfo.file[i].type = 'file'
              } else {
                // 是图片
                that.detailInfo.file[i].type = 'img'
                that.detailInfo.file[i].num = k++
              }
            }
          }
          console.log(that.detailInfo, 'asdlasjkd')
          console.log(that.followInfo, 'asdlasjkd')
        } else {
          that.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    openUrl(item) {
      window.open(item)
    },
    showBigImg(index) {
      this.imgList = []
      for (let i = 0; i < this.detailInfo.file.length; i++) {
        if (this.detailInfo.file[i].type == 'img') {
          this.imgList.push(this.detailInfo.file[i])
        }
      }
      this.showIndex = index
      this.imgShow = true
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
          this.followComplaintForm.thisDate = ''
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
          this.followComplaintForm.nextDate = ''
        }
      }
    },
    uploadChange(file, filelist) {
      console.log(filelist, 'ddd')
      if (filelist.length && filelist.length >= 1) {
        this.$refs.followComplaintForm.validateField('classFile')
      }
    },
    resetModel() {
      if (this.modelType == 'follow') {
        this.followComplaintForm = {
          content: '',
          thisDate: '',
          followType: '',
          file: [{
            name: '',
            url: ''
          }],
          nextDate: ''
        }
      } else if (this.modelType == 'handling') {
        // 处理
        this.handlingInfo = ''
        this.filelist = []
        this.filesArr = []
      } else {
        // 分配
        this.handlingInfo = ''
        this.doUser = ''
        this.userInfo = []
      }
      this.modelShow = false
    },
    saveModel() {
      const that = this
      if (this.modelType === 'follow') {
        // 新跟进
        if (that.filesArr.length > 0) {
          this.followComplaintForm.file = this.filesArr
        }
        if (this.followComplaintForm.followType === '') {
          this.$message.warning('请选择跟进方式！')
        } else if (this.followComplaintForm.thisDate === '') {
          this.$message.warning('请选择跟进日期！')
        } else if (this.followComplaintForm.content === '') {
          this.$message.warning('跟进内容不可以为空！')
        } else if (this.followComplaintForm.nextDate === '') {
          this.$message.warning('请选择下次跟进日期！')
        } else if (this.filesArr.length <= 0) {
          this.$message.warning('请上传附件！')
        } else {
          this.$refs['followComplaintForm'].validate((valid) => {
            if (valid) {
              that.submitting = true

              that.followComplaintForm.file = JSON.stringify(that.filesArr)
              console.log(that.detailId)
              console.log(that.followComplaintForm)
              if (that.follow_type == 'add') {
                saveComplaintFollow(that.detailInfo.id, that.followComplaintForm).then(res => {
                  that.submitting = false
                  if (res.code === 200 || res.code === '200') {
                    that.$message({
                      message: '保存成功！',
                      type: 'success'
                    })
                    that.filesArr = []
                    that.fileList = []
                    that.resetModel()
                    that.getDetail()
                  } else {
                    that.$message({
                      message: res.data.msg,
                      type: 'warning'
                    })
                  }
                })
              } else {
                followEdit(that.follor_id, that.followComplaintForm).then(res => {
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
                    that.getDetail()
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
      } else if (this.modelType === 'handling') {
        // handlingComplaint
        const info = {
          remark: '',
          file: ''
        }
        info.remark = this.handlingInfo
        if (that.filesArr.length > 0) {
          info.file = JSON.stringify(this.filesArr)
        }
        if (this.handlingInfo === '') {
          this.$message.warning('请填写处理意见！')
        } else if (this.filesArr.length <= 0) {
          this.$message.warning('请上传附件！')
        } else {
          console.log(this.handlingInfo)
          console.log(info)
          handlingComplaint(this.detailInfo.id, info).then(res => {
            that.submitting = false
            if (res.code == 200) {
              that.$message({
                message: '处理成功！',
                type: 'success'
              })
              that.filesArr = []
              that.fileList = []
              that.resetModel()
              that.getDetail()
            } else {
              that.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
        }
      } else {
        // 分配
        const info = {
          remark: '',
          account: ''
        }
        info.remark = this.handlingInfo
        info.account = this.doUser
        console.log(info)
        if (this.doUser == '') {
          this.$message.warning('请选择分配下级！')
        } else if (this.handlingInfo == '') {
          this.$message.warning('请填写分配意见！')
        } else {
          console.log(this.handlingInfo)
          allocationComplaint(this.detailInfo.id, info).then(res => {
            that.submitting = false
            if (res.code == 200) {
              that.$message({
                message: '分配成功！',
                type: 'success'
              })
              that.resetModel()
              that.getDetail()
            } else {
              that.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
        }
        console.log(that.doUser)
        console.log(that.handlingInfo)
      }
    },
    restForm() {
      if (this.modelType == 'follow') {
        this.followComplaintForm = {
          content: '',
          thisDate: '',
          followType: '',
          file: [{
            name: '',
            url: ''
          }],
          nextDate: ''
        }
      } else if (this.modelType == 'handling') {
        // 处理
        this.handlingInfo = ''
        this.filelist = []
        this.filesArr = []
      } else {
        // 分配
        this.handlingInfo = ''
        this.doUser = ''
        this.userInfo = []
      }
    },
    changeStates(event, type) {
        const that = this
        const msg = '该投诉一旦成功驳回，将恢复到投诉审批初始状态，确定要“强制驳回”吗？'
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            rejectedAllComplaint(that.detailId).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  type: 'success',
                  message: '驳回成功'
                })
                that.returnPage()
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
      },
    changeInfo(type) {
      this.modelType = type
      if (type === 'follow') {
        this.modelTitle = '写新回访'
        this.modelShow = true
        this.follow_type = 'add'
      } else if (type === 'handling') {
        this.modelTitle = '投诉处理'
        this.modelShow = true
      } else {
        this.modelTitle = '投诉分配'
        // 获取下级
        const that = this
        getDoComplaintUser().then(res => {
          console.log(res)
          if (res.code == 200) {
            that.userInfo = res.data.data
            that.modelShow = true
          }
        })
      }
    },
    handleClick(tab, event) {
      console.log(event, tab)
      this.searchInfo.mode = tab.name
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
    beforeFileUpload(file, fileList) {
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
        this.followComplaintForm.file = ''
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
        // justify-content: space-between;

        .find_top_content_span {
          margin-right: 40px;

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
          // padding-bottom: 20px;
          background: #fff;
          margin-top: 5px;
          .history_list {
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
              padding-right: 16px;

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

        .overflow_scroll_div{
          padding: 20px;
          overflow-x: scroll;
        }

        .view_dialog_self {
          background: #fff;
          border: 1px solid #e4e4e4;
          border-left: 0;
          // margin: 20px 90px 20px 30px;
          margin: 0;
          border-bottom: none;
          // max-width: none;

          .view_line {
            .line_title {
              color: #666;
              font-weight: normal;
              border-left: 1px solid #e4e4e4;
              min-width: 120px;
              text-align: center;
              padding-left: 0;
            }
          }
        }
        .find_follow{
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
    }

    .find_bottom_color .find_bottom_left_color {
      width: 100%;

      .tit_width {
        width: 60%
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
      .upload-demo{
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
          align-items: flex-start;
          margin: 10px 0;
          padding: 0 40px;
          span {
            width: 100px;
          }
        }
      .car_view{
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
    .font_file{
      color: rgb(64, 158, 255);
      text-decoration: underline;
      word-break: break-all;
      margin-right: 6px;
    }
</style>
