<template>
  <div class="person_bg">
    <group>
      <div class="person_head">
      <div class="person_head_left">
        <img src="@/assets/index/user.png"/>
      </div>
      <div class="person_head_right">
        <p class="font_bold">{{personList.realname}}</p>
        <p>{{personList.organize}}{{personList.group}}</p>
      </div>
    </div>
      <cell title="用户名" :value="personList.account"></cell>
      <cell title="真实姓名" is-link :value="personList.realname" @click.native="showConfirm('realname',personList.realname)"></cell>
      <cell title="性别" class="group_birtahday">
        <popup-radio :options="radioList" v-model="sex" placeholder="请选择性别" placeholder-align="left"
          @on-change="onGender"></popup-radio>
      </cell>
      <cell title="生日" class="group_birtahday">
        <datetime format="YYYY-MM-DD" placeholder="请选择时间" v-model="personList.birthday" @on-confirm="saveBirth" :min-year=1900 :max-year="maxYear"></datetime>
      </cell>
      <cell title="部门" :value="personList.organize"></cell>
      <cell title="角色" :value="personList.group"></cell>
      <cell title="邮箱" is-link :value="personList.email" @click.native="showConfirm('email',personList.email)"></cell>
      <cell title="手机号码" :value="personList.mobile"></cell>
    </group>
    <div v-transfer-dom>
      <confirm v-model="show5" show-input ref="confirm5" :title="title" @on-confirm="saveConfirm"
        @on-show="onShow5(confirmKey)">
      </confirm>
    </div>
  </div>
</template>
<script>
  import {
    getUserInfo,
    doUpdateUserInfo
  } from "@/api/public"
  import {
    Confirm,
    PopupRadio,
    TransferDomDirective as TransferDom
  } from 'vux'
  export default {
    name: 'Person',
    components: {
      Confirm,
      PopupRadio
    },
    directives: {
      TransferDom
    },
    data() {
      return {
        maxYear:new Date().getFullYear(),
        personList: {},
        title: '',
        show5: false,
        confirmType: '',
        confirmKey: '',
        sex: '',
        radioList: [{
          value: '男',
          key: 1
        }, {
          value: '女',
          key: 2
        }]
      }
    },
    mounted() {
      this.getInfo()
    },
    methods: {
      getInfo() {
        const that = this
        getUserInfo().then(res => {
          if (res.code === 200 || res.code === "200") {
            that.personList = res.data.user
            that.personList.gender = parseInt(res.data.user.gender)
            that.sex = parseInt(that.personList.gender)
          } else {
            that.$vux.toast.show({
              text: res.data.msg,
              type: "warn",
              time: 1000
            })
          }
        });
      },
      showConfirm(type, e) {
        this.confirmKey = e
        this.confirmType = type
        if (type == 'realname') {
          this.show5 = true
          this.title = '修改真实姓名'
        } else if (type == 'email') {
          this.show5 = true
          this.title = '修改邮箱'
        }
      },
      onShow5(value) {
        this.$refs.confirm5.setInputValue(value)
      },
      saveConfirm(value) {
        let users = {};
        users.account = this.personList.account
        if (this.confirmType == 'realname') {
          users.realname = value;
        } else if (this.confirmType == 'email') {
          users.email = value;
        }
        doUpdateUserInfo(users).then(res => {
          if (res.code === 200 || res.code === "200") {
            if (this.confirmType == 'realname') {
              this.personList.realname = value;
            } else if (this.confirmType == 'email') {
              this.personList.email = value;
            }
            this.$vux.toast.text('修改成功')
          } else {
            that.$vux.toast.show({
              text: res.data.msg,
              type: "warn",
              time: 1000
            })
          }
        });
      },
      onGender(e) {
        let that = this
        if (this.sex !== this.personList.gender) {
          let info = {
            account: this.personList.account,
            gender: this.sex
          }
          doUpdateUserInfo(info).then(res => {
            if (res.code === 200 || res.code === "200") {
              that.$vux.toast.text('修改成功')
              that.personList.gender = that.sex
            } else {
              that.$vux.toast.show({
                text: res.data.msg,
                type: "warn",
                time: 1000
              })
            }
          });
        }

      },
      saveBirth(value){
        console.log(value)
        let that = this
         let info = {
            account: this.personList.account,
            birthday: value
          }
          doUpdateUserInfo(info).then(res => {
            if (res.code === 200 || res.code === "200") {
              that.$vux.toast.text('修改成功')
            } else {
              that.$vux.toast.show({
                text: res.data.msg,
                type: "warn",
                time: 1000
              })
            }
          });
      }
    }
  }

</script>
<style lang="less" scoped>
  .person_bg {
    /deep/.weui-cells{
      margin-top: 0;
    }
    /deep/.weui-cells:after{
      border-bottom: 1px solid #f2f2f2;
    }
    /deep/.weui-cell{
      padding: 0.21rem 0.2rem;
    }
    /deep/.weui-cell:before{
      left: 0;
      border-top: 1px solid #f2f2f2;
    }

    .person_head{
      background: rgba(51, 153, 255, 1);
      height: 0.7rem;
      display: flex;
      align-items: center;
      padding: 0.3rem 0.2rem;
      .person_head_left{
        width: 0.54rem;
        height: 0.54rem;
        margin-right: 0.1rem;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .person_head_right{
        p{
          margin: 0;
          padding: 0;
          font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
          color: #FFFFFF;
          font-size: 0.24rem;
        }
        .font_bold{
          font-weight: 700;
          font-size: 0.28rem;
        }
      }
    }
    .weui-cell {
      font-size: 0.28rem;
    }

    .group_birtahday {
      & /deep/.weui-cell__ft {
        .weui-cell {
          padding: 0
        }
      }
    }
  }

</style>
