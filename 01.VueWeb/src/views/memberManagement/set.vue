<template>
  <div>
    <div class="set_bg">
      <my-alert title="当权限修改后，重新登录才会生效" />
      <div class="set_title">
        <span>{{ roleName }}权限</span>
        <div class="set_btn">
          <el-button :loading="submitting" type="primary" @click="saveSet" >保 存</el-button>
          <el-button plain @click="back">返 回</el-button>
        </div>
      </div>
      <div class="set_scroll">
        <div class="set_list">
          <div v-for="(item_first,index_first) in setList" :key="index_first" class="set_module">
            <div v-if="item_first.name!=null" class="module_first">
              <el-checkbox
                :indeterminate="checkfirst[index_first].uncertain"
                v-model="checkfirst[index_first].selectAll"
                @change="choseFirst(checkfirst[index_first].selectAll,index_first,item_first.data)">
                {{ item_first.name }}</el-checkbox>
            </div>
            <div class="module_first_data">
              <div
                v-for="(item_second,index_second) in item_first.data"
                v-show="item_first.name!=null"
                :key="index_second"
                class="module_second">
                <el-checkbox
                  v-if="item_second.name!=null"
                  :indeterminate="checkAll.data.action[index_second].uncertain"
                  v-model="checkAll.data.action[index_second].selectAll"
                  class="module_second_name"
                  @change="choseSecond(checkAll.data.action[index_second].selectAll,index_second,item_second.data,checkAll.data.action[index_second])">
                  {{ item_second.name }}</el-checkbox>
                <el-checkbox-group
                  v-model="checkList.data.action[index_second]"
                  class="module_second_data"
                  @change="choseThird(index_second,item_second.data,checkList.data.action[index_second])">
                  <el-checkbox
                    v-for="(item_third,index_third) in item_second.data"
                    :key="index_third"
                    :label="index_third"
                    class="module_third">{{ item_third }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {
  getRoleSet
} from '@/api/system'
  // import {
  //   getCookie
  // } from '@/utils/auth'
import axios from 'axios'
import Qs from 'qs'
export default {
  name: 'Set',
  data() {
    return {
      roleId: '',
      roleName: '',
      submitting: false,
      roleInfo: {},
      setList: [],
      showCheckList: [],
      check_first: false,
      check_second: false,
      checkAll: {
        data: {
          action: {}
        }
      },
      saveList: {},
      checkfirst: {},
      checkList: {
        data: {
          action: {}
        }
      },
      checkedCities: ['上海', '北京'],
      firstAll: true,
      secondAll: true
    }
  },
  created() {

  },
  mounted() {
    this.roleId = this.$route.query.id
    this.roleName = this.$route.query.name
    // 获取权限列表
    this.getList()
  },
  methods: {
    getList() {
      const that = this
      getRoleSet(this.roleId).then(res => {
        if (res.code === 200) {
          that.setList = res.data.roleSource
          that.showCheckList = res.data.getGroupPrivs
          // 整理全选框的格式
          that.parseCheckAll(that.setList)
          if (that.showCheckList.length !== 0) {
            // 格式化选中的多选框
            that.getPermissionArray(that.showCheckList)
          }
        }
      })
    },
    // 整理全选框的格式
    parseCheckAll(target = {}) {
      // 如果没有被选中的，则整理待选中列表
      for (const first in target) {
        if (target.hasOwnProperty(first)) {
          const arr = []
          for (const second in target[first].data) {
            if (target[first].data.hasOwnProperty(second)) {
              arr.push(second)
            }
            this.$set(this.checkList.data.action, second, [])
          }
        }
      }
      // 整理全选框列表
      for (const first in target) {
        if (target.hasOwnProperty(first)) {
          for (const second in target[first].data) {
            if (target[first].data.hasOwnProperty(second)) {
              let len = 0
              if (target[first].data[second].data !== undefined) {
                len = Object.keys(target[first].data[second].data).length
              }
              this.$set(this.checkAll.data.action, second, {
                selectAll: false,
                uncertain: false,
                length: len
              })
            }
          }
        }
        this.$set(this.checkfirst, first, {
          selectAll: false,
          uncertain: false
        })
      }
    },
    // 格式化选中的多选框
    getPermissionArray(target = {}) {
      for (const first in target) {
        if (target.hasOwnProperty(first)) {
          const arr = []
          for (const second in target[first]) {
            arr.push(target[first][second])
          }
          this.$set(this.checkList.data.action, first, arr)
        }
      }
      // 判断是否选中二级全选按钮
      this.changeSecondStatus()
    },
    changeFirstStatus() {
      const target = this.checkAll.data.action
      const list = this.setList
      for (const first in list) {
        if (list.hasOwnProperty(first)) {
          let i = 0
          let flag = false
          for (const second in list[first].data) {
            if (target[second].selectAll === true) {
              i++
            }
            if (target[second].uncertain === true) {
              i++
              flag = true
            }
          }
          if (i === Object.keys(list[first].data).length) {
            this.$set(this.checkfirst, first, {
              selectAll: true,
              uncertain: false
            })
            if (flag) {
              this.$set(this.checkfirst, first, {
                selectAll: false,
                uncertain: true
              })
            }
          } else {
            if (i > 0) {
              this.$set(this.checkfirst, first, {
                selectAll: false,
                uncertain: true
              })
            }
          }
        }
      }
    },
    changeSecondStatus() {
      const target = this.checkAll.data.action
      const item = this.checkList.data.action
      for (const first in target) {
        if (target[first].length === Object.keys(item[first]).length) {
          this.$set(this.checkAll.data.action, first, {
            selectAll: true,
            uncertain: false,
            length: target[first].length
          })
        } else {
          if (Object.keys(item[first]).length > 0) {
            this.$set(this.checkAll.data.action, first, {
              selectAll: false,
              uncertain: true,
              length: target[first].length
            })
          }
        }
      }
      this.changeFirstStatus()
    },
    choseFirst(val, key, list) {
      if (val) {
        // 全选
        for (const first in list) {
          const arr = []
          for (const second in list[first].data) {
            arr.push(second)
          }
          this.$set(this.checkAll.data.action, first, {
            selectAll: true,
            uncertain: false
          })
          this.$set(this.checkList.data.action, first, arr)
        }
      } else {
        for (const first in list) {
          this.$set(this.checkAll.data.action, first, {
            selectAll: false,
            uncertain: false
          })
          this.$set(this.checkList.data.action, first, [])
        }
      }
      this.changeFirstStatus()
    },
    choseSecond(val, key, data, list) {
      if (val) {
        const arr = []
        for (const key in data) {
          arr.push(key)
        }
        // 全选
        this.$set(this.checkAll.data.action, key, {
          selectAll: true,
          uncertain: false
        })
        this.$set(this.checkList.data.action, key, arr)
      } else {
        // 全不选
        this.$set(this.checkAll.data.action, key, {
          selectAll: false,
          uncertain: false
        })
        this.$set(this.checkList.data.action, key, [])
      }
      this.changeFirstStatus()
    },
    choseThird(type, list, value) {
      if (Object.keys(list).length === value.length) {
        // 全选了
        console.log('全选')
        this.$set(this.checkAll.data.action, type, {
          selectAll: true,
          uncertain: false
        })
      } else {
        this.$set(this.checkAll.data.action, type, {
          selectAll: false,
          uncertain: true
        })
      }
      this.changeFirstStatus()
    },
    back() {
      this.$router.go(-1)
    },
    saveSet() {
      const that = this
      this.submitting = true
      let baseURL = ''
      if (process.env.NODE_ENV === 'development') {
        baseURL = '/index.php'
      } else {
        baseURL = ''
      }
      const submitUrl = baseURL + '/sys/group-managePriv-' + this.roleId + '.json'
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      const data = Qs.stringify({
        actions: this.checkList.data.action
      })
      axios.post(submitUrl, data, config)
        .then(response => {
          if (response.data.code === 200 || response.data.code === '200') {
            // 提交成功将要执行的代码
            that.submitting = false
            that.$message({
              message: '权限保存成功！',
              type: 'success'
            })
            that.back()
          } else {
            that.$message({
              message: response.data.msg,
              type: 'warning'
            })
            that.submitting = false
          }
        })
    }
  }
}

</script>
<style lang="less" scoped>
  .set_bg {
    background: #f2f2f2;
    position: relative;
    width: 100%;
    // height: 100vh;
    top: 0;
    z-index: 99;
    overflow: hidden;
    padding-top: 10px;

    .set_title {
      // width: 100%;
      height: 50px;
      line-height: 50px;
      padding: 0 10px;
      background: #fff;
      // position: fixed;
      z-index: 100;
      border-bottom: 1px solid #f2f2f2;
      margin-left: 10px;

      span {
        font-family: '微软雅黑 Bold', '微软雅黑';
        font-weight: 700;
        font-style: normal;
        font-size: 14px;
        color: #333333;
        float: left;
      }

      .set_btn {
        float: right;
      }
    }

    .set_scroll {
      height: calc(100vh - 204px);
      overflow-y: scroll;
      overflow-x: hidden;
      margin-top: 10px;
      .set_list {
        padding-bottom: 20px;

        .set_module {
          margin: 10px;
          margin-top: 0;
          background: #fff;
          display: flex;
          align-items: center;
          width: 100%;

          .module_first {
            width: 10%;
            text-align: center;
            min-width: 160px;
          }

          .module_first_data {
            border-left: 1.6px solid #f2f2f2;
            width: 90%;

            .module_second {
              display: flex;
              align-items: center;
              min-height: 40px;
              border-bottom: 1.6px solid #f2f2f2;

              .module_second_name {
                min-width: 160px;
                padding-left: 20px;
              }

              .module_second_data {
                padding-left: 20px;
                border-left: 1.6px solid #f2f2f2;

                .module_third {
                  min-width: 60px;
                  margin-left: 0;
                  margin-right: 30px;
                  min-height: 40px;
                  display: inline-flex;
                  align-items: center;
                }
              }
            }

            .module_second:last-child {
              border-bottom: none;
            }

          }
        }
      }
    }
  }
  /deep/::-webkit-scrollbar-track {
    background: #f3f3f3;
  }

</style>
