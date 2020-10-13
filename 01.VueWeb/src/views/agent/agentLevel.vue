<template>
  <div>
    <div class="level_bg">
      <div class="fifter">
        <my-tabs
          :active-name="'all'"
          :add="btnPermission('agentlevel_create')"
          :page-name="page_name"
          :module-name="module_name"
          :tabs-list="tabsList"
          :fifter-open="false"
          @addAction="addLevel"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)" />
          <!-- <search-fifter :add="btnPermission('agentlevel_create')" :module-name="'agentlevel'" :add-text="'创建等级'" @search="fifterSearch" @addAction="addLevel"/> -->
      </div>
      <div class="level_info">
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个等级，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('agentlevel_batchbanned')" plain size="mini" @click="batchstop('banned')">批量作废</el-button>
          </div>
        </div>
        <el-table v-loading="loading" ref="multipleTable" :data="tableData" :max-height="tableHeight" border row-key="id" tooltip-effect="light" style="width: 100%" @sort-change="fifterTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column label="类型" min-width="120">
            <template slot-scope="scope">
              <span v-show="scope.row.type==1" class="text_color">经销商</span>
              <span v-show="scope.row.type==2" class="text_color">店主</span>
            </template>
          </el-table-column>
          <el-table-column label="等级名称" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="discount" label="折扣" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.discount }}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="goodsPrice" label="首次货款" min-width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>￥{{ scope.row.goodsPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="startNum" label="最小采购" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>￥{{ scope.row.startNum }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="editedDate" label="更新时间" min-width="160" show-overflow-tooltip/>
          <el-table-column label="操作" width="200" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('agentlevel_edit')" type="text" size="small" @click="editLevel(scope.row)">编辑</el-button>
              <!-- <el-button v-show="btnPermission('agentlevel_banned')&&scope.row.status==2" type="text" size="small" @click="changeStates(scope.row,'1')">启用</el-button> -->
              <!-- <el-button v-show="btnPermission('agentlevel_banned')&&scope.row.status==1" type="text" size="small" @click="changeStates(scope.row,'2')">停用</el-button> -->
              <el-button v-if="btnPermission('agentlevel_banned')" type="text" size="small" @click="changeStates(scope.row,'99')">作废</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" class="dialogModel" @close="resetModel">
      <el-scrollbar class="fixed_scroll over_scroll">
        <!-- 新建等级 -->
        <el-form
          v-if="modelShow"
          ref="levelForm"
          :model="levelForm"
          :rules="rules"
          class="modelForm center"
          label-width="100px"
          label-position="right">
          <el-form-item label="等级名称：" prop="name">
            <el-input v-model.trim="levelForm.name" autocomplete="off" style="width:500px" placeholder="请输入等级名称"/>
          </el-form-item>
          <el-form-item label="类型：" prop="type">
            <el-radio-group v-model="levelForm.type" style="width:500px" placeholder="请选择类型">
              <el-radio label="1">经销商</el-radio>
              <el-radio label="2">店主</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="等级排序：" prop="sort">
            <el-select v-model="levelForm.sort" placeholder="请选择等级排序" style="width:500px">
              <el-option label="1" value="1"/>
              <el-option label="2" value="2"/>
              <el-option label="3" value="3"/>
              <el-option label="4" value="4"/>
              <el-option label="5" value="5"/>
              <el-option label="6" value="6"/>
              <el-option label="7" value="7"/>
              <el-option label="8" value="8"/>
              <el-option label="9" value="9"/>
              <el-option label="10" value="10"/>
              <el-option label="11" value="11"/>
              <el-option label="12" value="12"/>
              <el-option label="13" value="13"/>
              <el-option label="14" value="14"/>
              <el-option label="15" value="15"/>
              <el-option label="16" value="16"/>
              <el-option label="17" value="17"/>
              <el-option label="18" value="18"/>
              <el-option label="19" value="19"/>
              <el-option label="20" value="20"/>
            </el-select>
            <div class="input_tips">按照数字升序排列，比如顶级经销商设置为1，不能重复</div>
          </el-form-item>
          <el-form-item label="折扣：" prop="discount" style="number_height">
            <!-- <el-input v-model="levelForm.discount" autocomplete="off" style="width:500px" placeholder="请输入折扣数" type="number" min="0" max="100"/>% -->
            <el-input-number v-model="levelForm.discount" :max="100" size="large" style="width:500px"/>
            <div class="input_tips">折扣数为百分比%，且必须为小于100的正整数</div>
          </el-form-item>
          <el-form-item label="首次货款：" prop="goodsPrice">
            <template >
              <el-input v-model="levelForm.goodsPrice" style="width:500px" maxlength="10" autocomplete="off" min="0" placeholder="请输入首次货款数" type="number" @blur="iptNum">
              <i slot="suffix" class="el-input__icon" style="font-style:normal">￥</i></el-input>
            </template>
          </el-form-item>
          <el-form-item label="最小采购：" prop="startNum">
            <el-input v-model="levelForm.startNum" style="width:500px" maxlength="10" autocomplete="off" placeholder="请输入最小起订数量" type="number" @blur="iptNum2">
            <i slot="suffix" class="el-input__icon" style="font-style:normal">￥</i></el-input>
            <div class="input_tips">成为该级别经销商后，每次采购不能低于设置金额</div>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="modelTitle!='编辑经销商等级'" @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAgentLevel, addAgentLevel, updateAgentLevel, changeLevel, agentLevelbatchCancel
} from '@/api/agent'
export default {
  name: 'AgentLevel',
  data() {
    return {
      page_name: 'agentlevel',
      module_name: 'agent',
      tabsList: [{
        label: '全部等级',
        name: 'all'
      }],

      loading: false,
      tableData: [],
      searchInfo: {
        mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      total: 0, // 总条数
      levelForm: {
        name: '',
        type: '',
        sort: '',
        discount: '1',
        goodsPrice: '',
        startNum: '',
        content: ''
      },
      tableHeight: 250,
      rules: {
        name: [{
          required: true,
          message: '等级名称不能为空',
          trigger: 'blur'
        }],
        type: [{
          required: true,
          message: '类型不能为空',
          trigger: 'change'
        }],
        sort: [{
          required: true,
          message: '等级排序不能为空',
          trigger: 'change'
        }],
        discount: [{
          required: true,
          message: '折扣不能为空',
          trigger: 'blur'
        }, { pattern: /^([1-9]\d?|100)$/,
          message: '折扣数不合法，只能输入大于0小于等于100的整数',
          trigger: 'blur'
        }],
        goodsPrice: [{
          required: true,
          message: '首次货款不能为空',
          trigger: 'blur'
        },
        { pattern: /^(?=\d+.?\d+$)[\d.]{0,13}$/,
          message: '首次货款数不合法，最多只能输入13位数字的金额',
          trigger: 'blur'
        }
        // { validator: checkNum, trigger: 'blur' }
        ],
        startNum: [{
          required: true,
          message: '最小采购数不能为空',
          trigger: 'blur'
        }, { pattern: /^(?=\d+.?\d+$)[\d.]{0,14}$/,
          message: '最小采购数不合法，最多只能输入14位数字的金额',
          trigger: 'blur'
        }]
      },
      choseTotal: 0,
      selectArr: [],
      modelShow: false,
      modelTitle: '',
      submitting: false
    }
  },
  mounted() {
    this.getList()
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  methods: {
    batchstop() {
      const that = this
      if (that.selectArr.length > 0) {
        const obj = {
          ids: this.selectArr.join(',')
        }
        this.$confirm('经销商等级一旦作废，不可以恢复哦,确定要批量“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          agentLevelbatchCancel(obj).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: '操作成功'
              })
              that.$refs.multipleTable.clearSelection()
              that.getList()
            } else {
              that.$message({
                type: 'warning',
                message: res.data.message
              })
              console.log('没有成功')
            }
          })
        }).catch(() => {
          console.log('用户点击了取消')
        })
      }
    },
    restForm() {
      this.$refs['levelForm'].resetFields()
      this.levelForm = {
        name: '',
        type: '',
        sort: '',
        discount: '1',
        goodsPrice: '',
        startNum: '',
        content: ''
      }
    },
    handleSelectionChange(val) {
      console.log(val)
      this.choseTotal = val.length
      if (val.length > 0) {
        const arr = []
        for (let i = 0; i < val.length; i++) {
          arr.push(val[i].id)
        }
        this.selectArr = arr
        console.log('本页选择了')
      } else {
        this.selectArr = []
        console.log('取消选择')
      }
    },
    searchShowAction(value) {
      console.log('switch改变了')
      console.log(value)
      if (value) {
        this.$nextTick(res => {
          var elementHeight = parseInt(document.getElementsByClassName('search_style')[0].clientHeight)
          this.tableHeight = document.body.offsetHeight - 330 - elementHeight
          console.log(this.tableHeight)
        })
      } else {
        this.tableHeight = document.body.offsetHeight - 360
      }
    },
    fuzzyQueryAction(value) {
      // table表格重置高度
      this.tableHeight = document.body.offsetHeight - 360
      // 模糊查询搜索
      console.log(value)
      if (value) {
        this.tableData = []
        this.searchInfo.search = 'bySearch'
        this.total = 0
        this.searchInfo.pageID = 1
        this.loading = true
        this.getList()
      }
    },
    searchQueryAction(value) {
      // 高级搜索
      console.log(value)
      if (value) {
        this.tableData = []
        this.searchInfo.search = 'bySearch'
        this.total = 0
        this.searchInfo.pageID = 1
        this.loading = true
        this.getList()
      }
    },
    filterQueryAction(value) {
      // 筛选查询
      console.log(value)
      if (value) {
        this.tableData = []
        this.searchInfo.search = 'bySearch'
        this.total = 0
        this.searchInfo.pageID = 1
        this.loading = true
        this.getList()
      }
    },
    getList() {
      const that = this
      getAgentLevel(that.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.agentlevel
          // that.searchInfo.recPerPage = res.data.pager.recPerPage // 每页几条
          // that.searchInfo.pageID = res.data.pager.pageID // 第几页
          that.total = res.data.pager.recTotal// 总条数
        }
      })
    },
    iptNum(e) {
      console.log(e)
      // const a = parseFloat(e.target.value).toFixed(2)
      if (parseInt(e.target.value) < 0) {
        this.levelForm.goodsPrice = e.target.value
      } else if (e.target.value === '') {
        this.levelForm.goodsPrice = ''
      } else {
        this.levelForm.goodsPrice = parseFloat(e.target.value).toFixed(2)
      }
    },
    iptNum2(e) {
      console.log(e)
      // const a = parseFloat(e.target.value).toFixed(2)
      if (parseInt(e.target.value) < 0) {
        this.levelForm.startNum = e.target.value
      } else if (e.target.value === '') {
        this.levelForm.startNum = ''
      } else {
        this.levelForm.startNum = parseFloat(e.target.value).toFixed(2)
      }
    },
    addLevel() {
      this.modelShow = true
      this.modelTitle = '新增经销商等级'
    },
    editLevel(event) {
      this.levelForm = { ...event }
      this.modelShow = true
      this.modelTitle = '编辑经销商等级'
    },
    fifterSearch(event) {
      if (event) {
        this.searchInfo.search = 'bySearch'
        this.tableData = []
        this.loading = true
        this.searchInfo.pageID = 1
        this.getList()
      } else {
        this.searchInfo.search = ''
        // this.getList()
      }
    },
    fifterTable(event) {
      console.log(event.prop)
      console.log(event.order)
      if (event.order === 'ascending') {
        this.searchInfo.orderBy = event.prop + '_asc'
      } else if (event.order === 'descending') {
        this.searchInfo.orderBy = event.prop + '_desc'
      } else {
        this.searchInfo.orderBy = ''
      }
      this.searchInfo.pageID = 1
      this.tableData = []
      this.loading = true
      this.getList()
    },
    changeStates(event, states) {
      const that = this
      let msg = ''
      if (states === '1') {
        msg = '确定启用此经销商等级吗？'
      } else if (states === '2') {
        msg = '确定停用此经销商等级吗？'
      } else {
        msg = '确定作废此经销商等级吗？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeLevel(event.id, states).then(res => {
          console.log(res)
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.msg
            })
            this.modelShow = false
            that.getList()
          } else {
            that.$message({
              type: 'warning',
              message: res.data.msg
            })
          }
        })
      }).catch(() => {
        console.log('用户点击了取消')
      })
    },
    saveModel() {
      const that = this
      // 保存经销商等级
      this.$refs['levelForm'].validate((valid) => {
        if (valid) {
          console.log(this.levelForm, 'fdsafsdf')
          console.log(that.levelForm.id)
          that.submitting = true
          if (that.levelForm.id === undefined) {
            // 新增
            addAgentLevel(that.levelForm).then(res => {
              console.log(res)
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '经销商等级添加成功！',
                  type: 'success'
                })
                that.resetModel()
                that.getList()
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          } else {
            // 更新
            updateAgentLevel(that.levelForm).then(res => {
              console.log(res)
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '经销商等级更新成功！',
                  type: 'success'
                })
                that.resetModel()
                that.getList()
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
    },
    resetModel() {
      console.log('重置表单')
      this.$refs['levelForm'].resetFields()
      this.levelForm = {
        name: '',
        type: '',
        sort: '',
        discount: '1',
        goodsPrice: '',
        startNum: '',
        content: ''
      }
      this.modelShow = false
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.searchInfo.pageID = 1
      this.searchInfo.recPerPage = val
      this.tableData = []
      this.loading = true
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.searchInfo.pageID = val
      this.loading = true
      this.getList()
    }
  }
}

</script>
<style lang="less" scoped>
  .level_bg {
    position: absolute;
    width: 100%;
    top: 0;
    .level_info{
      background: #fff;
      padding: 20px 10px;
      .text_color{
        // color: #409EFF;
      }
    }
    .level_page {
      text-align: center;
      padding: 10px 0;
    }
  }
    .dialogModel {
    .modelForm {
      margin: 0 10px;
      .input_tips{
        font-size: 12px;
        color: #AEAEAE;
        font-family: '微软雅黑 Regular', '微软雅黑';
      }
      .number_height{
        /deep/.el-input-number__increase{
          line-height: 38px;
        }
      }
    }
    .center{
      margin:0 70px;
    }
  }

</style>
