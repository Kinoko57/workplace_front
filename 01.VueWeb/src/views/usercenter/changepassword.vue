<template>
  <div class="changepass_bg">
    <my-alert v-if="showAlert" title="提示：当账号第一次登录后必须要先修改初始密码，否则将无法进行其他操作"/>
    <el-form ref="ruleForm2" :model="ruleForm2" :rules="rules2" status-icon label-width="100px" class="demo-ruleForm">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="ruleForm2.oldPassword" type="password" autocomplete="off" style="width:35%" placeholder="请输入旧密码"/>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="ruleForm2.password" type="password" autocomplete="off" style="width:35%" placeholder="请输入新密码"/>
      </el-form-item>
      <el-form-item label="确认密码" prop="password1">
        <el-input v-model="ruleForm2.password1" type="password" autocomplete="off" style="width:35%" placeholder="请再次输入新密码"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('ruleForm2')">重 置</el-button>
        <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { changepass } from '@/api/usercontent'
import {
  mapGetters
} from 'vuex'
import { removeCookie, removeToken } from '@/utils/auth'
export default {
  name: 'Changepassword',
  data() {
    var validatepassword = (rule, value, callback) => {
      const rex1 = /^[\da-zA-Z]{6,18}$/.test(value)
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm2.password !== '') {
          if (rex1) {
            this.$refs.ruleForm2.validateField('password1')
          } else {
            callback(new Error('请输入6-18位的数字或字符'))
          }
        }
        callback()
      }
    }
    var validatepassword1 = (rule, value, callback) => {
      const rex = /^[\da-zA-Z]{6,18}$/.test(value)
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm2.password) {
        callback(new Error('两次输入密码不一致!'))
      } else if (!rex) {
        callback(new Error('请输入6-18位的数字或字符'))
      } else {
        callback()
      }
    }
    return {
      showAlert: true,
      ruleForm2: {
        oldPassword: '',
        password: '',
        password1: ''
      },
      rules2: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { pattern: /^[\da-zA-Z]{6,18}$/, message: '可以为数字、字符,6-18位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatepassword, trigger: 'blur' }
        ],
        password1: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: validatepassword1, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'unReads', 'device'])
  },
  mounted() {
    this.showAlert = window.localStorage.getItem('changePwd') === '1'
  },
  methods: {
    submitForm(formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          changepass(this.ruleForm2).then(res => {
            console.log(res)
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: '修改成功~'
              })
              // window.localStorage.setItem('changePwd', '0')
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.changepass_bg{
    background: #fff;
    padding: 20px 10px;
}
</style>

