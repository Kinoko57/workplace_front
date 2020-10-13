<template>
  <div>
    <div class="editprofile_bg">
      <my-alert v-if="showAlert" title="提示：修改账户信息之后请重新登录"/>
      <div>
        <el-form v-loading="loading" ref="form" :model="form" :rules="rules" label-width="120px" label-position="right" size="medium" class="editprofile_info">
          <el-form-item label="账号： " prop="account">
            <el-input v-model.trim="form.account" disabled placeholder="请输入账号" class="editprofile_name" style="width:35%"/>
          </el-form-item>
          <el-form-item label="真实姓名: " prop="realname">
            <el-input v-model="form.realname" placeholder="请输入用户名" class="editprofile_name" style="width:35%"/>
          </el-form-item>
          <el-form-item label="性别： " prop="gender">
            <!-- <el-radio v-model="form.gender" label="0">保密</el-radio> -->
            <el-radio v-model="form.gender" label="1">男</el-radio>
            <el-radio v-model="form.gender" label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="生日： " prop="birthday">
            <el-date-picker v-model="form.birthday" clearable type="date" placeholder="选择生日日期" style="width:35%;" value-format="yyyy-MM-dd"/>
          </el-form-item>
          <el-form-item label="邮箱： " prop="email">
            <el-input v-model.trim="form.email" placeholder="请输入邮箱" style="width:35%;"/>
          </el-form-item>
          <el-form-item label="手机： " prop="mobile">
            <el-input v-model.trim="form.mobile" disabled placeholder="请输入手机号" style="width:35%;"/>
          </el-form-item>
          <el-form-item align="right" style="width:40%;">
            <el-button @click="clearprofile">重 置</el-button>
            <el-button type="primary" @click="saveprofile">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { userInfo } from '@/api/usercontent'
// 修改资料问题未解决
import { editPerson } from '@/api/system'
import { removeCookie, removeToken } from '@/utils/auth'
export default {
  name: 'Editprofile',
  data() {
    return {
      loading: true,
      form: {
        account: '',
        realname: '',
        gender: '',
        birthday: '',
        email: '',
        mobile: ''
      },
      rules: {
        realname: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { min: 2, max: 12, message: '输入不正确', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: '选择生日日期', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/, message: '格式规则为xxxxx@xx.xx', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '共11为，首位1,第二位为3，4，5，7，8，剩余位数为0-9', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getuserinfo()
  },
  methods: {
    saveprofile() {
      const that = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const info = {
            account: this.form.account,
            realname: this.form.realname,
            gender: this.form.gender,
            birthday: this.form.birthday,
            email: this.form.email,
            mobile: this.form.mobile
          }
          editPerson(info).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: '资料修改成功！'
              })
              // that.getuserinfo()
              // this.$refs['form'].clearValidate()
              setTimeout(function() {
                // that.$store.dispatch('FedLogOut').then(() => {
                //   location.reload() // In order to re-instantiate the vue-router object to avoid bugs
                // })
                removeCookie('crm_token')
                removeCookie('crm_account')
                window.localStorage.removeItem('changePwd')
                window.localStorage.removeItem('roleList')
                window.localStorage.removeItem('username')
                removeToken()
                location.reload()
              }, 1000)
            } else {
              that.$message({
                type: 'warning',
                message: res.data.msg
              })
            }
          })
        } else {
          return false
        }
      })
    },
    clearprofile() {
      this.$refs['form'].clearValidate()
      this.form = {
        account: this.form.account,
        realname: '',
        gender: '',
        birthday: '',
        email: '',
        mobile: this.form.mobile
      }
    },
    getuserinfo() {
      const that = this
      userInfo(this.form).then(res => {
        this.loading = false
        if (res.code === 200) {
          console.log(res)
          that.form = res.data.user
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
 .editprofile_bg{
    background: #fff;
   .editprofile_info{
     padding:40PX 10px 20px;
     }
 }
</style>
