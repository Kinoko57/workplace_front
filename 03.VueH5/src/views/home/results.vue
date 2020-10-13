<template>
    <div class="results_bg">
        <group class="view_line">
          <span class="line_title">员工：</span>
          <span class="small_font">{{ listNum.accountName }}</span>
        </group>
        <group class="view_line">
          <span class="line_title">所属部门：</span>
          <span class="small_font">{{ listNum.organizeName }}</span>
        </group>
        <group class="view_line">
          <span class="line_title">时间：</span>
          <span class="small_font">{{ listNum.startDate }}</span>
        </group>
        <group class="view_line">
          <span class="line_title">内容：</span>
          <span class="small_font">{{ listNum.content }}</span>
        </group>
        <!-- <div class="view_line" style="margin-top:10px;">
          <span class="line_title">审阅结果：</span>
          <el-radio-group v-model="approveForm.result">
            <el-radio :label="1">好</el-radio>
            <el-radio :label="2">一般</el-radio>
            <el-radio :label="3">差</el-radio>
          </el-radio-group>
        </div> -->
        <!-- <div class="view_line" style="margin-top:10px;">
          <span class="line_title">批注：</span>
          <el-input v-model="approveForm.postil" :rows="2" type="textarea" style="width:300px" placeholder="请输入批注内容" />
        </div> -->
    </div>
</template>

<script>
  import {
    getDailyInfo
  } from "@/api/public"
  export default {
    name: "List",
    data() {
      return {
        listId:0,
        listNum: {},
        searchInfo: {
          mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
          search: '', // 搜索关键字
          orderBy: '', // 排序字段
          pageID: 1, // 第几页
          recPerPage: 10, // 每页显示条数
          recTotal: 0 // 总条数
        }
      };
    },
    created() {},
    mounted() {
      this.listId = this.$route.query.id;
      // 页面第一个渲染的函数
      this.getList();

    },
    methods: {
      getList() {
        //   console.log(this.listId, 'fsdfdsfd')
        const that = this
        getDailyInfo(this.searchInfo).then(res => {
          if (res.code === 200) {
            that.tableData = res.data.dailys
            that.listNum = that.tableData.find(item => item.id === that.listId)
            console.log(that.listNum, 'dfsfds')
          }
        })
      }
    }
  }
</script>
<style>
    .results_bg{
        padding: 0 0.3rem;
    margin-top: 0.5rem;
    }
</style>



