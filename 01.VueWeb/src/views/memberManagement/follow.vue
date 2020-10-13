/* eslint-disable vue/no-dupe-keys */
<template>
  <div>
    <div class="find_wraper">
      <div class="find_top">
        <div class="find_top_t" ><el-button size="mini" pain icon="el-icon-arrow-left" @click="returnPage">返回</el-button></div>
        <div class="find_top_tit">
          <img src="@/assets/common/com_userName.png" alt="" srcset="">
          <span>{{ memberInfo.realname }}</span>
        </div>
        <div class="find_top_content">
          <span class="find_top_content_span">部门：<span class="style_color">{{ organize_bu }}</span></span>
          <span class="find_top_content_span">职位：<span class="style_color">{{ organize_group }}</span></span>
          <span class="find_top_content_span">入职时间：<span class="style_color">{{ memberInfo.join }}</span></span>
        </div>
        <div v-if="btnPermission('user_resetpassword')" class="find_top_btn">
          <el-button :disabled="memberInfo.employee_status==4" :type="memberInfo.employee_status==4?'info':''" plain size="mini" icon="el-icon-edit-outline" @click="changeInfo('member')">员工信息</el-button>
          <el-button :disabled="memberInfo.employee_status==4" :type="memberInfo.employee_status==4?'info':''" plain size="mini" icon="el-icon-edit-outline" @click="changeInfo('agreement')">合同信息</el-button>
          <el-button :disabled="memberInfo.employee_status==4" :type="memberInfo.employee_status==4?'info':''" plain size="mini" icon="el-icon-edit-outline" @click="changeInfo('bank')">银行卡信息</el-button>
        </div>
      </div>
      <div class="find_center">
        <div class="find_center_click">
          <div class="find_center_chose">
            <el-tabs v-model="searchInfo.mode" @tab-click="handleClick">
              <el-tab-pane v-for="(item,index) in typeList" :key="index" :label="item.label" :name="item.name"/>
            </el-tabs>
          </div>
          <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='member'" class="find_center_tit">
            <div class="chose_style_tit">员工信息</div>
            <table class="view_dialog view_dialog_self" cellpadding="0" cellspacing="0">
              <tr class="view_line">
                <td class="line_title">姓名：</td>
                <td :class="{null_data_style:nullStyle(memberInfo.realname)}" class="second_line">{{ memberInfo.realname|textNull }}</td>
                <td class="line_title">性别：</td>
                <td class="second_line">{{ memberInfo.gender=='1'?'男':( memberInfo.gender=='2'?'女':'') }}</td>
                <td class="line_title">部门：</td>
                <td :class="{null_data_style:nullStyle(organize_bu)}" class="second_line">{{ organize_bu|textNull }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title">职位：</td>
                <td :class="{null_data_style:nullStyle(organize_group)}" class="second_line">{{ organize_group|textNull }}</td>
                <td class="line_title">工号：</td>
                <td :class="{null_data_style:nullStyle(memberInfo.id)}" class="second_line">{{ memberInfo.id|textNull }}</td>
                <td class="line_title">手机号：</td>
                <td :class="{null_data_style:nullStyle(memberInfo.mobile)}" class="second_line">{{ memberInfo.mobile|textNull }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title">出生日期：</td>
                <td :class="{null_data_style:nullStyle(memberInfo.birthday)}" class="second_line">{{ memberInfo.birthday|textNull }}</td>
                <td class="line_title">类型：</td>
                <td class="second_line">{{ memberInfo.employee_type=='0'?'全职':'兼职' }}</td>
                <td class="line_title">入职时间：</td>
                <td :class="{null_data_style:nullStyle(memberInfo.join)}" class="second_line">{{ memberInfo.join|textNull }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title">邮箱地址：</td>
                <td :class="{null_data_style:nullStyle(memberInfo.email)}" class="second_line">{{ memberInfo.email|textNull }}</td>
                <td class="line_title">直属上级：</td>
                <td :class="{null_data_style:nullStyle(memberInfo.superiorName)}" class="second_line">{{ memberInfo.superiorName|textNull }}</td>
                <td class="line_title">员工状态：</td>
                <td v-if="memberInfo.employee_status==1" class="second_line">正式</td>
                <td v-if="memberInfo.employee_status==2" class="second_line">试用</td>
                <td v-if="memberInfo.employee_status==4" class="second_line">离职</td>
                <td v-if="memberInfo.employee_status==3" class="second_line">兼职</td>
              </tr>
              <tr class="view_line">
                <td class="line_title">账号：</td>
                <td :class="{null_data_style:nullStyle(memberInfo.account)}" class="second_line">{{ memberInfo.account|textNull }}</td>
                <td class="line_title">工作电话：</td>
                <td v-if="agrementInfo.phone!=undefined&&agrementInfo.phone!=''" class="second_line">{{ agrementInfo.phone }}</td>
                <td v-if="agrementInfo.phone==undefined||agrementInfo.phone==''" style="color:#999" class="second_line">
                  暂无数据
                </td>
                <td class="line_title">工作邮箱：</td>
                <td v-if="agrementInfo.email!=undefined&&agrementInfo.email!=''" class="second_line">{{ agrementInfo.email }}</td>
                <td v-if="agrementInfo.email==undefined||agrementInfo.email==''" style="color:#999" class="second_line">
                  暂无数据
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div :class="searchInfo.mode=='agreement'||searchInfo.mode=='bank'?'find_bottom_color':''" class="find_bottom">
        <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='agreement'" :class="searchInfo.mode=='agreement'?'find_bottom_left_color':''" class="find_bottom_left">
          <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='agreement'" class="find_bottom_left_t" >
            <div class="chose_style_tit">合同信息</div>
            <table v-if="agrementInfo.part_start_time!=null&&agrementInfo.part_start_time!=''&&agrementInfo.part_start_time!='0000-00-00'" class="tit_width view_dialog view_dialog_followUp" cellpadding="0" cellspacing="0">
              <tr class="view_line">
                <td class="line_title">合同起始日：</td>
                <td :class="{null_data_style:nullStyle(agrementInfo.part_start_time)}" class="second_line">{{ agrementInfo.part_start_time |textNull }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title">合同终止日：</td>
                <td :class="{null_data_style:nullStyle(agrementInfo.part_end_time)}" class="second_line">{{ agrementInfo.part_end_time|textNull }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title">工作邮箱：</td>
                <td v-if="agrementInfo.email!=undefined&&agrementInfo.email!=''" class="second_line">{{ agrementInfo.email }}</td>
                <td v-if="agrementInfo.email==undefined||agrementInfo.email==''" style="color:#999" class="second_line">
                  暂无数据
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">工作电话：</td>
                <td v-if="agrementInfo.phone!=undefined&&agrementInfo.phone!=''" class="second_line">{{ agrementInfo.phone }}</td>
                <td v-if="agrementInfo.phone==undefined||agrementInfo.phone==''" style="color:#999" class="second_line">
                  暂无数据
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">合同附件：</td>
                <td class="second_line">
                  <div v-if="agrementInfo.file!=''&&agrementInfo.file[0].name!=''">
                    <div v-for="(item,index) in agrementInfo.file" :key="index">
                      <span
                        v-show="agrementInfo.file.length>0"
                        style="color: #409eff;text-decoration: underline;cursor: pointer;font-size: 12px;max-width: 450px;width: auto;"
                        title="点击查看大图"
                        @click="showBigImg(index)">{{ item.name }}</span>
                    </div>
                  </div>
                  <div v-else style="color:#999">
                    暂无数据
                  </div>
                </td>
              </tr>
              <!-- <tr class="view_line">
                <td class="line_title">试用期：</td>
                <td class="second_line">{{ agrementInfo.trial_time }}个月</td>
              </tr>
              <tr class="view_line">
                <td class="line_title">试用期到期日：</td>
                <td class="second_line">{{ agrementInfo.trial_end_time }}</td>
              </tr> -->
            </table>
            <p v-else class="style_null">暂无合同信息哦~</p>
          </div>
        </div>
        <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='bank'" :class="searchInfo.mode=='bank'?'find_bottom_right_color':''" class="find_bottom_right">
          <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='bank'" class="find_bottom_right_t">
            <div class="chose_style_tit">银行卡信息</div>
            <table v-if="bankInfo.bank_realname!=null&&bankInfo.bank_realname!=''" class="view_dialog view_dialog_followUp tit_width" cellpadding="0" cellspacing="0">
              <tr class="view_line">
                <td class="line_title">姓名：</td>
                <td class="second_line">{{ bankInfo.bank_realname }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title">开户行：</td>
                <td class="second_line">{{ bankInfo.bank_name }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title">开户账号：</td>
                <td class="second_line">{{ bankInfo.bank_account }}</td>
              </tr>
            </table>
            <p v-else class="style_null">暂无银行卡信息哦~</p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" width="600px" class="dialogModel" @close="resetModel">
      <!-- 员工信息 -->
      <el-scrollbar v-if="modelType=='member'&&modelShow" class="fixed_scroll over_scroll">
        <el-form
          ref="personForm"
          :model="personForm"
          :rules="personFormRules"
          class="modelForm center"
          label-width="100px"
          label-position="right">
          <el-form-item label="姓名：" prop="realname">
            <el-input v-model.trim="personForm.realname" style="width:500px" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="性别：" prop="gender">
            <el-radio-group v-model="personForm.gender" style="width:500px" placeholder="请选择性别">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生日：" prop="birthday">
            <el-date-picker
              v-model="personForm.birthday"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width:500px" />
          </el-form-item>
          <el-form-item label="手机号：" prop="mobile">
            <el-input v-model.trim="personForm.mobile" style="width:500px" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model.trim="personForm.email" style="width:500px" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="员工类型：" prop="employee_type">
            <el-select v-model="personForm.employee_type" placeholder="请选择" style="width:500px">
              <el-option
                v-for="item in workType"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门：" class="checkDep">
            <i class="red_star">*</i>
            <!-- <el-cascader
              ref="orgLabel"
              :options="orgList"
              v-model="personForm.organize_id"
              :props="defaultNode"
              :show-all-levels="false"
              :change-on-select="true"
              style="width:500px"
              placeholder="请选择所属部门"
              filterable
              @change="choseOrg(personForm.organize_id)" /> -->
            <el-select v-model="personForm.organize_id" filterable placeholder="请选择所属部门" style="width:500px" @change="choseOrg(personForm.organize_id)">
              <el-option
                v-for="(select,index) in orgList"
                :label="select.name"
                :value="select.id"
                :key="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属角色：" class="checkDep">
            <i class="red_star">*</i>
            <el-select v-model="personForm.group_id" placeholder="请选择角色" style="width:500px" @change="choseRole()">
              <el-option
                v-for="(select,index) in roleDepList"
                :label="select.name"
                :value="select.id"
                :key="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="直属上级：" class="checkDep">
            <i class="red_star">*</i>
            <template>
              <el-select v-model="personForm.superior_id" :disabled="personForm.group_id==1" filterable placeholder="请选择" style="width:500px">
                <el-option
                  v-for="item in higherList"
                  :key="item.id"
                  :label="item.realname"
                  :value="item.id"
                  width="400px"/>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="账号：" prop="account">
            <el-input
              v-model.trim="personForm.account"
              :disabled="modelType=='edit'"
              style="width:500px"
              placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="入职时间：" prop="join">
            <el-date-picker
              v-model="personForm.join"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width:500px" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <!-- 合同信息 -->
      <el-scrollbar v-if="modelType=='agreement'&&modelShow" class="fixed_scroll over_scroll">
        <el-form
          ref="agrementForm"
          :model="agrementForm"
          :rules="agrementFormRules"
          class="modelForm center"
          label-width="140px"
          label-position="right">
          <el-form-item label="合同起始日：" prop="part_start_time">
            <el-date-picker
              v-model="agrementForm.part_start_time"
              type="date"
              placeholder="请选择合同开始时间"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              style="width:500px"
              @change="choseEndTime"/>
          </el-form-item>
          <el-form-item label="合同截止日：" prop="part_end_time">
            <el-date-picker
              v-model="agrementForm.part_end_time"
              type="date"
              placeholder="请选择合同截止时间"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              style="width:500px"
              @change="choseEndTime"/>
          </el-form-item>
          <el-form-item label="工作邮箱：" prop="email">
            <el-input v-model.trim="agrementForm.email" style="width:500px" placeholder="请输入工作邮箱" />
          </el-form-item>
          <el-form-item label="工作电话：" prop="phone">
            <el-input v-model.trim="agrementForm.phone" style="width:500px" placeholder="请输入工作电话" />
          </el-form-item>
          <el-form-item label="合同附件：">
            <el-upload
              ref="upload"
              :on-preview="handlePreview"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :name="'files'"
              :file-list="fileList"
              :action="uploadUrl"
              class="upload-demo"
              style="width: 500px;"
              multiple>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传图片，文件大小不超过5M</div>
            </el-upload>
          </el-form-item>
          <!-- <el-form-item label="试用期（月）：" prop="trial_time">
            <el-input
              v-model.trim="agrementForm.trial_time"
              style="width:500px"
              placeholder="请输入试用期时间"
              @blur="changeEndTime"/>
          </el-form-item>
          <el-form-item label="试用期到期日：" prop="trial_end_time">
            <el-date-picker
              v-model="agrementForm.trial_end_time"
              type="date"
              disabled
              placeholder="请选择试用期到期日"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              style="width:500px"/>
          </el-form-item> -->
        </el-form>
      </el-scrollbar>
      <!-- 银行卡信息 -->
      <el-scrollbar v-if="modelType=='bank'&&modelShow" class="fixed_scroll">
        <el-form
          ref="bankForm"
          :model="bankForm"
          :rules="bankFormRules"
          class="modelForm center"
          label-width="100px"
          label-position="right">
          <el-form-item label="姓名：" prop="bank_realname">
            <el-input v-model.trim="bankForm.bank_realname" style="width:500px" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="开户行：" prop="bank_name">
            <el-input v-model.trim="bankForm.bank_name" style="width:500px" placeholder="请输入开户行" />
          </el-form-item>
          <el-form-item label="开户账号：" prop="bank_account">
            <el-input
              v-model.trim="bankForm.bank_account"
              style="width:500px"
              placeholder="请输入开户账号" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="imgShow" title="查看图片">
      <!--  viewForm.url-->
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
            <div style="margin: 10px; 0">第{{ index+1 }}张 <a :href="imgUrl + item.url" download><el-button plain icon="el-icon-download" size="mini" style="margin-left: 10px;">图片下载</el-button></a> </div>
            <img
              :src="imgUrl + item.url"
              alt=""
              style="cursor: pointer;max-width: 100%;max-height:48vh"
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
// , getOrgList
import {
  getExecutiveOrg
} from '@/api/public'
import {
  editPerson, getRoleShowList, getDepChoseList, changeRole, changeHigher, saveAgrement, saveBank, folowInfo
} from '@/api/system'
import {
  getRoleList
} from '@/api/common'
export default {
  name: 'FollowMember',
  data() {
    return {
      orgList: [{
        id: '',
        name: ''
      }], // 组织架构列表
      defaultNode: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      modelShow: false,
      imgShow: false,
      showIndex: 0,
      modelTitle: '',
      imgList: [],
      organize_group: '',
      organize_bu: '',
      memberInfo: {},
      agrementInfo: {},
      bankInfo: {},
      workType: [
        {
          value: '0',
          label: '全职'
        }, {
          value: '1',
          label: '兼职'
        }
      ],
      depId: 0,
      filesArr: [],
      proxyId: '',
      fileUrl: '',
      name_edit: false,
      static_name: '',
      sex_edit: false,
      static_sex: '',
      phone_edit: false,
      static_phone: '',
      wechat_edit: false,
      static_wechat: '',
      showFiles: [],
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
      bankForm: {
        bank_realname: '',
        bank_name: '',
        bank_account: ''
      },
      bankFormRules: {
        bank_realname: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 20,
          message: '员工名称长度在2-20位',
          trigger: 'blur'
        }],
        bank_name: [
          {
            required: true,
            message: '开户行不能为空',
            trigger: 'blur'
          }, {
            min: 4,
            max: 30,
            message: '开户行名称长度在4-30位',
            trigger: 'blur'
          }
        ],
        bank_account: [{
          required: true,
          message: '开户账号不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[\d]{16,19}$/,
          message: '开户账号输入错误',
          trigger: 'blur'
        }]
      },
      agrementForm: {
        part_start_time: '',
        part_end_time: '',
        email: '',
        phone: '',
        trial_time: '',
        trial_end_time: '',
        file: ''
      },
      agrementFormRules: {
        part_start_time: [{
          required: true,
          message: '请选择合同开始时间',
          trigger: 'change'
        }],
        part_end_time: [{
          required: true,
          message: '请选择合同截止时间',
          trigger: 'change'
        }],
        phone: [
          {
            pattern: /^[1][0-9]{10}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }
        ],
        email: [
          {
            pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
            message: '邮箱格式错误',
            trigger: 'blur'
          }, {
            min: 4,
            max: 32,
            message: '邮箱长度在4-32位',
            trigger: 'blur'
          }
        ]
        // trial_time: [
        //   {
        //     required: true,
        //     message: '请输入试用期时间',
        //     trigger: 'blur'
        //   },
        //   {
        //     pattern: /^[0-9]+$/,
        //     message: '试用期时间只能输入数字',
        //     trigger: 'blur'
        //   }
        // ],
        // trial_end_time: [{
        //   required: true,
        //   message: '请选择试用期到期日',
        //   trigger: 'change'
        // }
        // ]
      },
      personForm: {
        account: '',
        employee_type: '',
        password: '',
        password1: '',
        organize_id: '', // 部门id
        group_id: '', // 角色id
        realname: '',
        gender: '1', // 性别 0保密 1：男 2：女
        mobile: '',
        birthday: '',
        email: '',
        superior_id: '',
        join: ''
      },
      personFormRules: {
        dimission: [{
          required: true,
          message: '离职时间不能为空',
          trigger: 'change'
        }],
        realname: [{
          required: true,
          message: '员工姓名不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 20,
          message: '员工名称长度在2-20位',
          trigger: 'blur'
        }],
        employee_type: [{
          required: true,
          message: '员工类型不能为空',
          trigger: 'change'
        }],
        birthday: [{
          required: true,
          message: '生日不能为空',
          trigger: 'change'
        }],
        join: [{
          required: true,
          message: '入职时间不能为空',
          trigger: 'change'
        }],
        gender: [{
          required: true,
          message: '性别不能为空',
          trigger: 'change'
        }],
        account: [{
          required: true,
          message: '账号不能为空',
          trigger: 'blur'
        }, {
          min: 4,
          max: 30,
          message: '账号长度在4-30位',
          trigger: 'blur'
        }],
        mobile: [{
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
        email: [{
          required: true,
          message: '邮箱不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
          message: '邮箱格式错误',
          trigger: 'blur'
        }, {
          min: 4,
          max: 32,
          message: '邮箱长度在4-32位',
          trigger: 'blur'
        }
        ],
        organize_id: [{
          required: true,
          message: '请选择部门',
          trigger: 'change'
        }],
        superior_id: [{
          required: true,
          message: '请选择直属上级',
          trigger: 'change'
        }],
        group_id: [{
          required: true,
          message: '请选择角色',
          trigger: 'change'
        }]
      },
      typeList: [
        { label: '概览信息', name: 'overview' },
        { label: '员工信息', name: 'member' },
        { label: '合同信息', name: 'agreement' },
        { label: '银行卡信息', name: 'bank' }
      ],
      num: 1,
      submitting: false,
      modelType: '',
      depName: '',
      higherList: [],
      roleId: 0,
      roleList: [],
      roleDepList: [],
      depList: [],
      imgUrl: ''

    }
  },
  mounted() {
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    this.imgUrl = process.env.FILE_API
    this.proxyId = this.$route.params.id
    // 获取列表
    this.getList()
    this.getDefault()
  },
  methods: {
    choseOrg(value) {
      // const id = this.personForm.organize_id[this.personForm.organize_id.length - 1]
      const id = this.personForm.organize_id
      this.roleDepList = []
      this.personForm.group_id = ''
      this.personForm.superior_id = ''
      for (var i = 0; i < this.roleList.length; i++) {
        if (id == this.roleList[i].organize_id) {
          this.roleDepList = this.roleList[i].data
        }
      }
      this.$forceUpdate()
    },
    choseRole() {
      console.log(this.personForm.group_id, '11111111')
      var name = ''
      if (this.modelType === 'edit') {
        name = this.personForm.account
      }
      if (this.personForm.group_id === '1' || this.personForm.group_id === 1) {
        this.higherList = [{ id: '1', realname: '无上级' }]
        this.personForm.superior_id = '1'
      } else {
        changeHigher(this.personForm.group_id, name).then(res => {
          if (res.code === 200 || res.code === '200') {
            if (res.data.length > 0) {
              this.higherList = JSON.parse(JSON.stringify(res.data))
              this.personForm.superior_id = ''
            } else {
              this.personForm.superior_id = ''
              this.higherList = []
              this.higherName = ''
            }
          }
        })
      }
    },
    showBigImg(index) {
      this.imgList = []
      for (let i = 0; i < this.agrementInfo.file.length; i++) {
        this.imgList.push(this.agrementInfo.file[i])
      }
      console.log(this.imgList)
      this.showIndex = index
      this.imgShow = true
    },
    openUrl(item) {
      window.open(item)
    },
    downloadCode() {
      for (let i = 0; i < this.imgList.length; i++) {
        if (this.showIndex == i) {
          var link = document.createElement('a')
          link.setAttribute('href', this.imgUrl + this.imgList[i].url)
          link.setAttribute('download', this.imgList[i].name)
          document.body.appendChild(link)
          link.click()
        }
      }
    },
    changeEndTime() {
      if (this.agrementForm.part_start_time != '' && this.agrementForm.trial_time != '') {
        var t_year = ''
        var d = new Date(this.agrementForm.part_start_time)
        var t_moth = parseInt(d.getMonth()) + 1 + parseInt(this.agrementForm.trial_time)
        if (t_moth > 12) {
          t_year = d.getFullYear() + 1
          t_moth = parseInt(t_moth) - 12
        } else {
          t_year = d.getFullYear()
        }
        this.agrementForm.trial_end_time = t_year + '-' + (t_moth < 10 ? ('0' + t_moth) : t_moth) + '-' + (d.getDate() < 10 ? ('0' + d.getDate()) : d.getDate())
      }
    },
    choseEndTime() {
      if (this.agrementForm.part_start_time != '' && this.agrementForm.part_end_time != '' && this.agrementForm.part_end_time <= this.agrementForm.part_start_time) {
        this.agrementForm.part_end_time = ''
        this.$message.warning('合同截止日应大于合同起始日！')
      }
    },
    getList() {
      const that = this
      const obj = {
        userId: this.proxyId,
        organzie_id: this.organzie_id,
        account: this.account
      }
      folowInfo(obj).then(res => {
        that.loading = false
        if (res.code === 200 || res.code === '200') {
          this.memberInfo = res.data.userInfo
          if (res.data.partList.file != '' && res.data.partList.file != null && res.data.partList.file != 'null' && res.data.partList.file != 'undefined') {
            console.log(res.data.partList.file)
            res.data.partList.file = JSON.parse(res.data.partList.file)
            // console.log(JSON.parse(res.data.partList.file))
            this.fileList = res.data.partList.file
            this.filesArr = res.data.partList.file
          } else {
            res.data.partList.file = [{
              url: '',
              name: ''
            }]
            this.fileList = []
          }
          this.agrementInfo = res.data.partList
          this.bankInfo = res.data.bankList
          this.organize_group = res.data.group
          this.organize_bu = res.data.organize
        }
      })
    },
    getDefault() {
      const that = this
      getExecutiveOrg().then(res => {
        if (res.code === 200 || res.code === '200') {
          const arr = res.data
          // that.formatDep(arr)
          that.orgList = arr
          console.log(that.orgList, '部门')
        }
      })
      // 获取角色列表
      getRoleList().then(res => {
        if (res.code === 200 || res.code === '200') {
          that.roleList = res.data
        }
      })
    },
    beforeUpload(file, fileList) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (file.name.indexOf('.png') === -1 && file.name.indexOf('.jpg') === -1 && file.name.indexOf('.bmp') === -1) {
        this.$message.warning('文件格式不正确！')
        return false
      }
      if (!isLt5M) {
        this.$message.warning('上传文件大小不能超过 5MB!')
        return false
      }
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
        this.agrementForm.file = ''
      }
      console.log(fileList)
      console.log(this.filesArr)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    },
    formatDep(data) {
      data.forEach(e => {
        if (e.child && e.child.length > 0) {
          e.children = e.child
        }
        if (e.child.length > 0 && this.num < 4) {
          this.num++
          this.formatDep(e.child)
        } else {
          this.num = 1
        }
      })
    },
    // 过滤
    filterDepNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    filterRoleNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    filterHigherNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    changeInfo(type) {
      const that = this
      if (type == 'member') {
        this.personForm = {
          account: this.memberInfo.account,
          employee_type: this.memberInfo.employee_type,
          organize_id: this.memberInfo.organize_id, // 部门id
          // organize_id: this.memberInfo.organize_ids.split(',').slice(1), // 部门id
          group_id: this.organize_group, // 角色id
          realname: this.memberInfo.realname,
          gender: this.memberInfo.gender, // 性别 0保密 1：男 2：女
          mobile: this.memberInfo.mobile,
          birthday: this.memberInfo.birthday,
          email: this.memberInfo.email,
          superior_id: this.memberInfo.superior_id,
          join: this.memberInfo.join
        }
        for (var i = 0; i < this.roleList.length; i++) {
          if (this.memberInfo.organize_id == this.roleList[i].organize_id) {
            this.roleDepList = this.roleList[i].data
          }
        }
        // // 根据部门id获取角色列表
        // changeRole(this.memberInfo.organize_id).then(res => {
        //   if (res.code === 200 || res.code === '200') {
        //     if (res.data.groups.length > 0) {
        //       this.roleDepList = res.data.
        //     } else {
        //     // this.personForm.group_id = 0
        //       this.personForm.group_id = ''
        //       this.roleDepList = []
        //       this.roleName = ''
        //     }
        //   }
        // })
        if (this.memberInfo.group_id !== '1' && this.memberInfo.group_id !== 1) {
        // 根据角色id获取直属上级列表
          changeHigher(this.memberInfo.group_id, this.memberInfo.account).then(res => {
            if (res.code === 200 || res.code === '200') {
              if (res.data.length > 0) {
                this.higherList = JSON.parse(JSON.stringify(res.data))
              } else {
                this.personForm.superior_id = ''
                this.higherList = []
              }
            }
          })
        } else {
          console.log(11111)
          // this.personForm.superior_id = '1'
          this.higherList = [{ id: '1', realname: '无上级' }]
        }
        this.modelType = type
        this.modelShow = true
        this.modelTitle = '编辑员工信息'
      } else if (type == 'agreement') {
        this.modelType = type
        this.modelShow = true
        this.modelTitle = '编辑合同信息'
        if (this.agrementInfo.part_start_time != null && this.agrementInfo.part_start_time != undefined && this.agrementInfo.part_start_time != '0000-00-00') {
          this.agrementForm = {
            part_start_time: this.agrementInfo.part_start_time,
            part_end_time: this.agrementInfo.part_end_time,
            email: this.agrementInfo.email,
            phone: this.agrementInfo.phone,
            trial_time: this.agrementInfo.trial_time,
            trial_end_time: this.agrementInfo.trial_end_time
          }
        }
      } else if (type == 'bank') {
        this.modelType = type
        this.modelShow = true
        this.modelTitle = '编辑银行卡信息'
        if (this.bankInfo.bank_realname != null && this.bankInfo.bank_realname != undefined) {
          this.bankForm = {
            bank_realname: this.bankInfo.bank_realname,
            bank_name: this.bankInfo.bank_name,
            bank_account: this.bankInfo.bank_account
          }
        }
      }
    },
    resetModel() {
      if (this.modelType == 'member') {
        this.personForm = {
          account: '',
          employee_type: '',
          password: '',
          password1: '',
          organize_id: '', // 部门id
          group_id: '', // 角色id
          realname: '',
          gender: '1', // 性别 0保密 1：男 2：女
          mobile: '',
          birthday: '',
          email: '',
          superior_id: '',
          join: ''
        }
      } else if (this.modelType == 'agreement') {
        this.agrementForm = {
          part_start_time: '',
          part_end_time: '',
          work_email: '',
          work_phone: '',
          trial_time: '',
          trial_end_time: '',
          file: ''
        }
      } else {
        this.bankForm = {
          bank_realname: '',
          bank_name: '',
          bank_account: ''
        }
      }
      this.modelShow = false
      this.submitting = false
    },
    restForm() {
      if (this.modelType == 'member') {
        this.personForm = {
          account: '',
          employee_type: '',
          password: '',
          password1: '',
          organize_id: '', // 部门id
          group_id: '', // 角色id
          realname: '',
          gender: '1', // 性别 0保密 1：男 2：女
          mobile: '',
          birthday: '',
          email: '',
          superior_id: '',
          join: ''
        }
      } else if (this.modelType == 'agreement') {
        this.agrementForm = {
          part_start_time: '',
          part_end_time: '',
          work_email: '',
          work_phone: '',
          trial_time: '',
          trial_end_time: '',
          file: ''
        }
      } else {
        this.bankForm = {
          bank_realname: '',
          bank_name: '',
          bank_account: ''
        }
      }
    },
    saveModel() {
      const that = this
      if (this.modelType == 'member') {
        if (this.personForm.organize_id === '') {
          this.$message.warning('部门不能为空！')
        } else if (this.personForm.group_id === '') {
          this.$message.warning('角色不能为空，请重新选择部门！')
        } else if (this.personForm.superior_id === '') {
          // this.$message.warning('信息填写不完整或者信息填写有误！')
          this.$nextTick(() => {
            this.checkFormErr()
          })
        } else {
          this.$refs['personForm'].validate((valid) => {
            if (valid) {
              that.submitting = true
              // 编辑员工
              const info = {
                account: this.personForm.account,
                // organize_id: this.personForm.organize_id[this.personForm.organize_id.length - 1], // 部门id
                organize_id: this.personForm.organize_id, // 部门id
                group_id: this.personForm.group_id, // 角色id
                realname: this.personForm.realname,
                gender: this.personForm.gender, // 性别 0保密 1：男 2：女
                mobile: this.personForm.mobile,
                birthday: this.personForm.birthday,
                email: this.personForm.email,
                superior_id: this.personForm.superior_id,
                join: this.personForm.join
              }
              console.log(info)
              editPerson(info).then(res => {
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    type: 'success',
                    message: '员工信息保存成功！'
                  })
                  that.submitting = false
                  that.modelShow = false
                  that.resetModel()
                  that.getList()
                } else {
                  that.$message({
                    type: 'warning',
                    message: res.data.msg
                  })
                  that.submitting = false
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
      } else if (this.modelType == 'agreement') {
        this.$refs['agrementForm'].validate((valid) => {
          if (valid) {
            that.submitting = true
            if (this.filesArr.length > 0) {
              this.agrementForm.file = JSON.stringify(this.filesArr)
            }
            console.log(this.agrementForm, 'hetongxinxi')
            // 合同信息
            const info = {
              part_start_time: parseInt(new Date(this.agrementForm.part_start_time).getTime() / 1000),
              part_end_time: parseInt(new Date(this.agrementForm.part_end_time).getTime() / 1000),
              work_email: this.agrementForm.email == '' ? '' : this.agrementForm.email,
              work_phone: this.agrementForm.phone == '' ? '' : this.agrementForm.phone,
              trial_time: this.agrementForm.trial_time,
              trial_end_time: '',
              file: this.agrementForm.file == undefined ? '' : this.agrementForm.file
            }
            saveAgrement(this.proxyId, info).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  type: 'success',
                  message: '合同信息保存成功！'
                })
                that.submitting = false
                that.modelShow = false
                that.resetModel()
                that.getList()
              } else {
                that.$message({
                  type: 'warning',
                  message: res.data.msg
                })
                that.submitting = false
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
        this.$refs['bankForm'].validate((valid) => {
          if (valid) {
            that.submitting = true
            // 编辑员工
            const info = {
              bank_realname: this.bankForm.bank_realname,
              bank_name: this.bankForm.bank_name,
              bank_account: this.bankForm.bank_account
            }
            console.log(info)
            saveBank(this.proxyId, info).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  type: 'success',
                  message: '银行卡信息保存成功！'
                })
                that.submitting = false
                that.modelShow = false
                that.resetModel()
                that.getList()
              } else {
                that.$message({
                  type: 'warning',
                  message: res.data.msg
                })
                that.submitting = false
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
    returnPage() {
      this.$router.back(-1)
    }
  }

}

</script>
<style lang="less" scoped>
.style_null{
  width: 100%;
  text-align: center;
  color: #666;
  padding-top: 20px;
  font-size: 12px;
}
.find_wraper .find_bottom {
  /deep/ .el-table--border{
    border-right: none;
    border-bottom: none;
    padding: 0;
    // margin: 20px;
    width: 100%;
  }
}
.find_wraper_bottom{
  margin-bottom: 10px;
}
.find_wraper{
  position: absolute;
  width: 100%;
  top: 0;
  height:calc(100vh - 100px);
  overflow-y: scroll;
  overflow-x: hidden;
  .find_top{
    padding:10px 20px 30px 40px;
    background-color: rgba(255, 255, 255, 1);
    color: #333;
    background: #fff;
    border:1px solid rgba(233, 233, 233, 1);
    .find_top_t{
      width: 100%;
      text-align: right;
      font-size: 14px;
      button{
        cursor: pointer;
      }
    }
    .find_top_tit{
      height: 30px;
      font-size: 18px;
      font-weight: 600;
      position: relative;
      img{
        width: 26px;
        height: 20px;
        vertical-align: middle;
      }
      .user_status{

      }
    }
    .find_top_content{
      color: #999999;
      font-size: 12px;
      height: 40px;
      line-height: 40px;
      margin-bottom: 10px;
      .find_top_content_span{
        margin-right: 20px;
        margin-left: 10px;
        .style_color{
          color: #333;
        }
      }
    }
  }
  .find_center{
    margin-top: 10px;
    /deep/ .el-tabs__header{
      margin: 0
    }
    .find_center_click{
      width: 100%;
      margin-bottom: 10px;
      .find_center_chose{
        background: #fff;
        padding: 0 20px;
      }
      .find_center_tit{
        padding-bottom: 10px;
        background: #fff;
        margin-top: 5px;
      }
      .view_dialog_self{
        background: #fff;
        border: 1px solid #e4e4e4;
        border-left: 0;
        margin:20px 90px 20px 30px;
        border-bottom: none;
        max-width: none;
        .view_line{
           .line_title{
             border-left: 1px solid #e4e4e4;
             color: #666;
            font-weight: normal;
           }
        }
      }
    }
  }
  .find_bottom{
    width: 100%;
    display: flex;
    // margin-bottom: 100px;
    justify-content: space-between;
    .find_bottom_left{
      width: 50%;
      padding-bottom: 20px;
      background: #fff;
      .find_bottom_left_t{
         padding-bottom: 30px;
         .follow_wraper{
           padding-top: 20px;
           /deep/ .el-card.is-always-shadow{
             box-shadow:none
           }
          .el-timeline{
              margin-right: 30px;
              margin-left: -10px;
          }
          /deep/ .el-card__body{
            // width: 520px;
            background-color: rgba(247, 251, 254, 1);
            border-color: rgba(215, 232, 244, 1);
          }
           .follow_name{
              color: #333;
              font-size: 13px;
              img{
                vertical-align: middle;
                width: 16px;
                height: 18px;
                margin-right: 10px;
              }
              :nth-child(3){
                color: #666;
              }
           }
           .follow_content{
             color: #999;
             text-indent: 2rem;
            overflow:hidden;/*超出隐藏*/
            text-overflow:ellipsis;/*文本溢出时显示省略标记*/
            display:-webkit-box;/*设置弹性盒模型*/
            -webkit-line-clamp:3;/*文本占的行数,如果要设置2行加...则设置为2*/
            -webkit-box-orient:vertical;/*子代元素垂直显示*/
           }
         }
      }
    }
    .find_bottom_right{
      width: 49%;
       padding-bottom: 20px;
      background: #fff;
      .find_bottom_right_t{
        padding-bottom: 30px;
      }
      ul{
       padding:0;margin:0;list-style-type:none;
          padding: 20px 20px 20px 30px;
        li{
          padding:0;margin:0;list-style-type:none;
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          div.operate{
            margin-right: 10px;
            span{
              display:block;
              width:10px;
              height: 10px;
              border-radius: 50%;
              background: rgb(0,153,204);
            }
          }
          .operate_con{
            font-size: 12px;
            span:nth-child(1){
              display: block;
              color: 999;
              margin-bottom: 4px;
            }
            span:nth-child(2){
              display: block;
              color: #666;
            }
          }
        }
      }
    }
    .view_dialog_followUp{
      // max-width: 320px;
      margin: 20px 30px 0 30px;
       .view_line{
           .line_title{
             color: #666;
            font-weight: normal;
           }
        }
    }
     .view_dialog_self{
       margin-left: 30px;
     }
     .view_dialog_follow{
        border:0;
        margin: 20px 30px 0 30px;
        .view_line{
          td{
             border: 0;
          }
           .line_title{
            background: none;
            border: 0;
            color: #666;
            font-weight: normal;
           }
        }
      }
  }
  // tab修改背景切换样式
.find_bottom_color{
  background: #fff;
}
.find_bottom_color .find_bottom_right_color{
    width: 100%;
    .tit_width{
      width: 39%
    }
  }
  .find_bottom_color .find_bottom_left_color{
    width: 100%;
    .tit_width{
      width: 60%
    }
  }
  .chose_style_tit{
    padding-left: 20px;
    background-color: rgba(249, 250, 252, 1);
    height: 40px;
    line-height: 40px;
    font-weight: 700;
    color: #333;
    font-size: 13px;
    }

}
 .center {
      margin: 0 70px;
}
  .modelForm {
    margin: 0 10px;
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
/deep/::-webkit-scrollbar-track {
  background: #f3f3f3;
  // background: #fff;
}
</style>
