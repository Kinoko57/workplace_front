<template>
  <div />
</template>
<script>
  import {
    setCookie,
    getCookie
  } from '@/utils/auth.js' // getToken from cookie
  import {
    loginInfo,
  } from "@/api/public"
  export default {
    name: 'Login',
    data() {
      return {
        code: ''
      }
    },
    mounted() {
      console.log(location.href)
      let str = location.href
      let startIndex = str.indexOf('code=')
      let lastIndex = str.indexOf('&')
      console.log(str.substring(startIndex + 5, lastIndex))
      this.code = str.substring(startIndex + 5, lastIndex)
      this.getLogin()
    },
    methods: {
      getLogin() {
        const that = this
        loginInfo(this.code).then(res => {
          console.log(res)
          if (res.code === 200 || res.code === '200') {
            //缓存cookie
            setCookie('crm_token', res.data.user.token)
            setCookie('crm_account', res.data.user.account)
            setCookie('crm_from', 'mobile')
            console.log(getCookie('crm_token'))
            console.log(getCookie('crm_account'))
            console.log(getCookie('crm_from'))
            let path = ''
            let str = location.href
            console.log(str)
            let lastIndex = str.indexOf('?code=')
            path = str.substring(0, lastIndex) + '#/main/index'
            console.log(path)
            // location.href(path)
            var a = document.createElement('a');
            a.setAttribute('href', path);
            // a.setAttribute('target', '_blank');
            a.setAttribute('id', 'startTelMedicine');
            // 防止反复添加
            if (document.getElementById('startTelMedicine')) {
              document.body.removeChild(document.getElementById('startTelMedicine'));
            }
            document.body.appendChild(a);
            a.click();
            // window.open(path)
            // that.$router.push({
            //   path: '/main/index'
            // })
          } else if(res.code === 0 || res.code === '0'){
            // router.push({
            //   path:'/error?msg=' + res.msg
            // })
            let path = ''
            let str = location.href
            console.log(str)
            let lastIndex = str.indexOf('?code=')
            path = str.substring(0, lastIndex) + '#/error?msg=' + res.msg
            console.log(path)
            // location.href(path)
            var a = document.createElement('a');
            a.setAttribute('href', path);
            // a.setAttribute('target', '_blank');
            a.setAttribute('id', 'startTelMedicine');
            // 防止反复添加
            if (document.getElementById('startTelMedicine')) {
              document.body.removeChild(document.getElementById('startTelMedicine'));
            }
            document.body.appendChild(a);
            a.click();
          }
        })
      }
    }
  }

</script>
<style lang="less" scoped>

</style>
