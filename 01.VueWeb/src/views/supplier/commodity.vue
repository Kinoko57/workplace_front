<template>
  <div>
    <div class="goods_bg">
      <div class="fifter">
        <!-- <search-fifter
          :add="btnPermission('suppliergoods_create')"
          :add-text="'创建商品'"
          :fifter="true"
          :delay-fifter="loading==false"
          :upload-url="uploadUrl"
          :export-type="moduleType"
          :export-name="'供应商商品列表'"
          @search="fifterSearch"
          @addAction="addGoods"
        /> -->
        <my-tabs
          :active-name="'all'"
          :add="btnPermission('suppliergoods_create')"
          :page-name="page_name"
          :module-name="module_name"
          :tabs-list="tabsList"
          @addAction="addGoods"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)" />
      </div>
      <div class="goods_info">
        <!-- <el-tabs type="card" class="tabs_table" >
          <el-tab-pane label="全部商品" > -->
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}条内容，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('suppliergoods_cancellations')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
          </div>
        </div>
        <el-table v-loading="loading" ref="multipleTable" :data="tableData" :max-height="tableHeight" border row-key="id" tooltip-effect="light" style="width: 100%" @selection-change="handleSelectionChange" @sort-change="fifterTable">
          <!-- <el-table-column type="selection" width="50" /> -->
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column label="商品名称" show-overflow-tooltip prop="title"/>
          <el-table-column label="所属供应商" show-overflow-tooltip prop="supplierName"/>
          <el-table-column label="采购单位" show-overflow-tooltip prop="unit"/>
          <el-table-column label="采购单价" show-overflow-tooltip sortable="custom" prop="price">
            <template slot-scope="scope">
              <span>￥{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createdDate" show-overflow-tooltip label="创建时间" sortable="custom" />
          <el-table-column prop="status" label="状态" >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==1" type="success">启用</el-tag>
              <el-tag v-if="scope.row.status==2" type="danger">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="tableData.length>0" label="操作" width="200" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('suppliergoods_edit')" type="text" size="small" @click="editGoods(scope.row)">编辑</el-button>
              <el-button v-if="btnPermission('suppliergoods_banned')&&scope.row.status==1" type="text" size="small" @click="banSupplierGoods(scope.row)">停用</el-button>
              <el-button v-if="btnPermission('suppliergoods_banned')&&scope.row.status==2" type="text" size="small" @click="banSupplierGoods(scope.row)">启用</el-button>
              <el-button v-if="btnPermission('suppliergoods_cancellation')" type="text" size="small" @click="changeStates(scope.row,'99')">作废</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="info_page">
          <el-pagination
            :current-page="searchInfo.pageID"
            :page-sizes="[5, 10, 50, 100]"
            :page-size="searchInfo.recPerPage"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
        <!-- </el-tab-pane>
        </el-tabs> -->
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" width="600px" class="dialogModel" @close="resetModel">
      <!-- 新建供应商品 -->
      <el-scrollbar class="fixed_scroll over_scroll">
        <el-form
          ref="goodsForm"
          :model="goodsForm"
          :rules="rules"
          class="modelForm center"
          label-width="110px"
          label-position="right">
          <el-form-item label="商品名称：" prop="title">
            <el-input v-model.trim="goodsForm.title" autocomplete="off" style="width:500px" placeholder="请输入商品名称" />
          </el-form-item>
          <el-form-item label="供应商：" prop="supplierId">
            <el-select v-model.trim="goodsForm.supplierId" filterable placeholder="请选择供应商" style="width:500px">
              <el-option v-for="item in optionsList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="采购单位：" prop="unit">
            <el-input v-model.trim="goodsForm.unit" autocomplete="off" style="width:500px" placeholder="请输入采购单位" />
          </el-form-item>
          <el-form-item label="联供应单价：" prop="price">
            <template >
              <el-input v-model.trim="goodsForm.price" autocomplete="off" style="width:500px" min="0" placeholder="请输入联供应单价" type="number" @blur="iptNum">
                <i slot="suffix" class="el-input__icon" style="font-style:normal">￥</i>
              </el-input>
            </template>
          </el-form-item>
          <el-form-item label="规格描述：" prop="remark">
            <el-input :rows="4" v-model.trim="goodsForm.remark" type="textarea" style="width:500px" placeholder="请输入规格描述,最大长度为120个字" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveModel">保 存</el-button>
        <el-button v-if="modelType=='new'" @click="resetsubmit">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSupplierGoods, addSupplierGoods, updateSupplierGoods, changeSupplierGoods, cancellationSupplierGoods, getAddSupplierGoods, getUpdateSupplierGoods, storehouseBatchCancel
} from '@/api/supplier'
export default {
  name: 'CommodityManage',
  data() {
    const checkNum = (rule, value, callback) => {
      // console.log(value)
      if (!value) {
        return new Error('请输入合同金额')
      } else {
        if (value < 0) {
          callback(new Error('输入的联供应单价不能为负数'))
        } else {
          callback()
        }
      }
    }
    return {
      page_name: 'suppliergoods',
      module_name: 'supplier',
      tabsList: [{
        label: '全部商品',
        name: 'all'
      }],
      choseTotal: 0,
      uploadUrl: '',
      moduleType: '',
      loading: false,
      tableData: [],
      optionsList: [],
      searchInfo: {
        mode: 'all', // 类型
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      total: 0, // 总条数
      goodsForm: {
        title: '',
        supplierId: '',
        unit: '',
        price: '',
        remark: ''
      },
      selectArr: [],
      tableHeight: 250,
      rules: {
        title: [{
          required: true,
          message: '商品名称不能为空',
          trigger: 'blur'
        }],
        supplierId: [{
          required: true,
          message: '请选择供应商',
          trigger: 'change'
        }],
        unit: [{
          required: true,
          message: '采购单位不能为空',
          trigger: 'blur'
        }],
        price: [{
          required: true,
          message: '联供应单价不能为空',
          trigger: 'blur'
        }, { validator: checkNum, trigger: 'blur' }],
        remark: [{
          required: true,
          message: '规格描述不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '规格描述长度超出范围1-120位之间', trigger: 'blur' }]
      },
      modelShow: false,
      modelTitle: '',
      modelType: 'new'
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
        that.$confirm('商品一旦作废，不可以恢复,确定要批量“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          storehouseBatchCancel(obj).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: '操作成功'
              })
              that.getList()
              that.selectArr = []
              that.$refs.multipleTable.clearSelection()
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
        this.tableHeight = document.body.offsetHeight - 330
      }
    },
    fuzzyQueryAction(value) {
      // table表格重置高度
      this.tableHeight = document.body.offsetHeight - 330
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
    iptNum(e) {
      // const a = parseFloat(e.target.value).toFixed(2)
      if (parseInt(e.target.value) < 0) {
        this.goodsForm.price = e.target.value
      } else {
        this.goodsForm.price = parseFloat(e.target.value).toFixed(2)
      }
    },
    resetsubmit() {
      this.$refs['goodsForm'].resetFields()
      this.goodsForm = {
      }
      // this.fileList = []
      this.submitting = false
    },
    getList() {
      const that = this
      getSupplierGoods(that.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          console.log(res)
          that.tableData = res.data.suppliergoods
          that.total = res.data.pager.recTotal// 总条数
        }
      })
    },
    fifterTable(event) {
      console.log(event.order)
      if (event.order === 'ascending') {
        this.searchInfo.orderBy = event.prop + '_asc'
      } else if (event.order === 'descending') {
        this.searchInfo.orderBy = event.prop + '_desc'
      } else {
        this.searchInfo.orderBy = ''
      }
      this.loading = true
      this.searchInfo.pageID = 1
      this.tableData = []
      this.getList()
    },
    addGoods() {
      const that = this
      this.modelType = 'new'
      this.modelShow = true
      this.modelTitle = '新增供应商品'
      getAddSupplierGoods().then(res => {
        console.log(res)
        if (res.code === 200 || res.code === '200') {
          this.optionsList = res.data.supplier
        } else {
          that.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    importGoods(event) {
      if (event) {
        this.getList()
      }
    },
    editGoods(event) {
      const that = this
      this.modelType = 'edit'
      const data = { ...event }
      this.goodsForm = {
        id: data.id,
        title: data.title,
        supplierId: data.supplierId,
        unit: data.unit,
        price: data.price,
        remark: data.remark
      }
      this.modelShow = true
      this.modelTitle = '编辑供应商品'
      getUpdateSupplierGoods(this.goodsForm.id).then(res => {
        console.log(res)
        if (res.code === 200 || res.code === '200') {
          this.optionsList = res.data.supplier
        } else {
          that.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    banSupplierGoods(event) {
      const that = this
      let msg = ''
      if (event.status == 1) {
        msg = '是否停用当前供应商？'
      } else {
        msg = '是否启用当前供应商？'
      }
      that.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeSupplierGoods(event.id).then(res => {
          console.log(res)
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.data.msg
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
    changeStates(event) {
      const that = this
      const msg = '确定作废此供应商商品吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancellationSupplierGoods(event.id).then(res => {
          console.log(res)
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.data.msg
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
    saveModel() {
      const that = this
      // 保存供应商品
      this.$refs['goodsForm'].validate((valid) => {
        if (valid) {
          console.log(this.goodsForm)
          console.log(that.goodsForm.id)
          if (that.modelType === 'new') {
            // 新增
            addSupplierGoods(that.goodsForm).then(res => {
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '供应商商品添加成功！',
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
            updateSupplierGoods(that.goodsForm).then(res => {
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '供应商品更新成功！',
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
      this.$refs['goodsForm'].resetFields()
      this.goodsForm = {}
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
  .goods_bg {
    // background: #fff;
    position: absolute;
    width: 100%;
    top: 0;
    // padding: 10px;
    .goods_info{
      background: #fff;
      padding: 20px 10px;
      .text_color{
        color: #409EFF;
      }
    }
    .goods_page {
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
    }
    .center{
      margin:0 70px;
    }
  }

</style>
