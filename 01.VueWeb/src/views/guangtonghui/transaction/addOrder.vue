<template>
  <div>
    <div class="order_bg">
      <div class="order_detail">
        <div class="title">
          <svg-icon icon-class="menu" />
          <span>订单</span>
        </div>
        <el-form ref="orderForm" :model="orderForm" :rules="rules" label-width="100px" class="order_form">
          <el-form-item label="客户：" >
            <el-input v-model="orderForm.name" style="width:400px"/>
          </el-form-item>
          <el-form-item label="产品：">
            <div v-for="(item,index) in orderForm.proinfo" :key="index" class="order_proList">
              <el-select v-model="item.proName" placeholder="请选择产品名称" style="width:400px" class="view_right">
                <el-option label="区域一" value="shanghai"/>
                <el-option label="区域二" value="beijing"/>
              </el-select>
              <el-input v-model="item.proPrice" style="width:100px" placeholder="单价" class="view_right"/>
              <span class="view_right">X</span>
              <el-input v-model="item.proNum" style="width:100px" placeholder="数量" class="view_right"/>
              <span class="view_right">=</span>
              <el-input v-model="item.proAmount" style="width:100px" placeholder="金额" class="view_right"/>
              <i class="el-icon-circle-plus red"/>
              <i class="el-icon-circle-close"/>
            </div>
          </el-form-item>
          <el-form-item label="交付日期：">
            <el-time-picker v-model="orderForm.date" type="fixed-time" placeholder="选择日期" style="width:400px"/>
          </el-form-item>
          <el-form-item label="合计金额：">
            <el-input v-model="orderForm.amount" style="width:400px"/>
          </el-form-item>
          <el-form-item label="是否含税：" >
            <el-select v-model="orderForm.region" placeholder="请选择活动区域" style="width:400px">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-form-item>
          <el-form-item label="结算方式：">
            <el-select v-model="orderForm.region" placeholder="请选择活动区域" style="width:400px">
              <el-option label="区域一" value="shanghai"/>
              <el-option label="区域二" value="beijing"/>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" >
            <el-input v-model="orderForm.desc" type="textarea" style="width:400px" />
          </el-form-item>
        </el-form>
        <div class="sure_btn order_info">
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="$router.go(-1)">返回</el-button>
        </div>
      </div>
      <div class="order_history">
        <div class="title">
          <svg-icon icon-class="timing" />
          <span>历史记录</span>
        </div>
        <div class="history_info">
          <ol>
            <li>2018-04-12 12:34:56 ，由<span>部长</span>创建。</li>
            <li>2018-04-12 12:34:56 ，由<span>组长</span>指派给<span>张晓建</span>。</li>
            <li>2018-04-12 12:34:56 ，由<span>张晓健</span>跟进了<span>跟进内容</span>。</li>
            <li>2018-04-12 12:36:50 ，由<span>张晓健</span>将“<span>地址</span>”修改成“<span>虹口区水电路682号</span>”</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AddOrder',
  data() {
    return {
      textarea: '',
      orderForm: {
        name: '',
        proinfo: [
          { proName: '', proPrice: '', proNum: '', proAmount: '' },
          { proName: '', proPrice: '', proNum: '', proAmount: '' }
        ],
        date: '',
        amount: '',
        region: '',
        desc: ''
      },
      rules: {},
      fileList: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }]
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    onSubmit() {

    }
  }

}

</script>
<style lang="less" scoped>
  .order_bg {
    background: #fff;
    padding: 10px 0;
    position: relative;
    width: 100%;
    // height: 100vh;
    top: 0;
    z-index: 99;
    overflow: hidden;

    .title {
      height: 50px;
      line-height: 50px;
      padding: 0 10px;
      border-bottom: 1px solid #f2f2f2;

      .svg-icon {
        color: #333333;
        font-size: 18px;
      }

      span {
        font-family: '微软雅黑 Bold', '微软雅黑';
        font-weight: 700;
        font-size: 14px;
        color: #333333;
      }

      .name {
        font-family: '微软雅黑 Regular', '微软雅黑';
        font-weight: 400;
        font-size: 12px;
        color: #5E5E5E;
      }
    }

    .order_detail {
      float: left;
      width: 70%;
      border-top: 1px solid #f2f2f2;
      border-right: 1px solid #f2f2f2;

      .info_title {
        font-family: '黑体 Regular', '黑体';
        font-weight: 400;
        font-style: normal;
        color: #515151;
        padding: 10px;
        padding-bottom: 0;
        font-size: 14px;

        span {
          font-family: '微软雅黑 Regular', '微软雅黑';
          color: #666666;
        }
      }

      .order_form {
        margin: 10px 0;
        margin-left: 10px;
        margin-right: 18px;
        padding: 0 10px;
        padding-bottom: 10px;
        // border: 1px solid #d7d7d7;
        // border-radius: 5px;
        .order_proList{
          padding: 10px 0;
          display: flex;
          align-items: center;
          .view_right{
            margin-right: 5px;
          }
          i{
            color: #999;
            font-size: 26px;
            margin: 0 5px;
          }
          .red{
            color: #ff2f2f;
          }
        }
        // ul {
        //   list-style: none;
        //   overflow: hidden;
        //   padding-left: 0;
        //   margin: 0;

        //   li {
        //     float: left;
        //     width: 30%;
        //     padding-top: 10px;

        //     span {
        //       font-family: '微软雅黑 Regular', '微软雅黑';
        //       font-weight: 400;
        //       font-style: normal;
        //       color: #A1A1A1;
        //       font-size: 14px;
        //     }
        //   }

        //   .width_line {
        //     width: 100%;
        //   }
        // }
      }

      .order_info {
        margin: 10px 0;
        margin-left: 10px;
        margin-right: 18px;
        text-align: right;
      }

      .sure_btn {
        padding-top: 10px;
      }

    }

    .order_history {
      float: right;
      width: 30%;
      border-top: 1px solid #f2f2f2;
      border-left: 1px solid #f2f2f2;

      .history_info {
        li {
          font-family: '微软雅黑 Regular', '微软雅黑';
          color: #333333;
          font-size: 12px;
          font-weight: 400;
          margin: 10px 0;
          span {
            font-weight: bold;
          }
        }
      }
    }
  }

</style>
