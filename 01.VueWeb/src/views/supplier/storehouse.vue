<template>
  <div>
    <div class="store_bg">
      <div class="fifter">
        <!-- <search-fifter
          :add="btnPermission('supplier_create')"
          :add-text="'创建供应商'"
          :fifter="true"
          :delay-fifter="loading==false"
          :upload-url="uploadUrl"
          :export-type="moduleType"
          :export-name="'供应商列表'"
          @search="fifterSearch"
          @addAction="addStore"
        /> -->
        <my-tabs
          :active-name="'all'"
          :add="btnPermission('supplier_create')"
          :page-name="page_name"
          :module-name="module_name"
          :tabs-list="tabsList"
          @addAction="addStore"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)" />
      </div>
      <div class="store_info">
        <!-- <el-tabs type="card" class="tabs_table" >
          <el-tab-pane label="全部供应商" > -->
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}条内容，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('supplier_banneds')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
          </div>
        </div>
        <el-table v-loading="loading" ref="multipleTable" :data="tableData" :max-height="tableHeight" border row-key="id" style="width: 100%" tooltip-effect="light" @selection-change="handleSelectionChange" @sort-change="fifterTable">
          <!-- <el-table-column type="selection" width="50" /> -->
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column prop="title" label="供应商名称" show-overflow-tooltip >
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="供应商说明" show-overflow-tooltip prop="remark"/>
          <el-table-column prop="createdDate" label="创建时间" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==1" type="success">启用</el-tag>
              <el-tag v-if="scope.row.status==2" type="danger">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="tableData.length>0" label="操作" width="200" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('supplier_edit')" type="text" size="small" @click="editStore(scope.row)">编辑</el-button>
              <el-button v-if="btnPermission('supplier_banned')&&scope.row.status==1" type="text" size="small" @click="banSupplier(scope.row)">停用</el-button>
              <el-button v-if="btnPermission('supplier_banned')&&scope.row.status==2" type="text" size="small" @click="banSupplier(scope.row)">启用</el-button>
              <el-button v-if="btnPermission('supplier_cancellation')" type="text" size="small" @click="changeStates(scope.row,'99')">作废</el-button>
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
      <!-- 新建供应商 -->
      <el-scrollbar class="fixed_scroll over_scroll">
        <el-form
          ref="storeForm"
          :model="storeForm"
          :rules="rules"
          :label-position="labelPosition"
          class="modelForm center"
          label-width="120px">
          <el-form-item label="供应商名称：" prop="title">
            <el-input v-model.trim="storeForm.title" autocomplete="off" style="width:500px" placeholder="请输入供应商名称"/>
          </el-form-item>
          <el-form-item label="联系人：" prop="contact">
            <el-input v-model.trim="storeForm.contact" autocomplete="off" style="width:500px" placeholder="请输入联系人"/>
          </el-form-item>
          <el-form-item label="联系电话：" prop="phone">
            <el-input v-model.trim="storeForm.phone" autocomplete="off" style="width:500px" placeholder="请输入联系电话"/>
          </el-form-item>
          <el-form-item label="联系邮箱：" prop="email">
            <el-input v-model.trim="storeForm.email" autocomplete="off" style="width:500px" placeholder="请输入联系邮箱"/>
          </el-form-item>
          <el-form-item label="供应商地址：" prop="address">
            <el-input v-model.trim="storeForm.address" autocomplete="off" style="width:500px" placeholder="请输入供应商地址"/>
          </el-form-item>
          <el-form-item label="供应说明：" prop="remark">
            <el-input :rows="4" v-model.trim="storeForm.remark" type="textarea" style="width:500px" placeholder="请输入供应说明,最大长度为120个字" />
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
  getSupplier, addSupplier, updateSupplier, changeSupplier, cancellationSupplier, commodityBatchCancel
} from '@/api/supplier'
export default {
  name: 'StoreHouseManage',
  data() {
    return {
      page_name: 'supplier',
      module_name: 'supplier',
      tabsList: [{
        label: '全部供应商',
        name: 'all'
      }],
      choseTotal: 0,
      uploadUrl: '',
      moduleType: '',
      loading: false,
      labelPosition: 'right',
      tableData: [],
      searchInfo: {
        mode: 'all', // 类型
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      total: 0, // 总条数
      storeForm: {
        title: '',
        contact: '',
        phone: '',
        email: '',
        address: '',
        remark: ''
      },
      tableHeight: 250,
      rules: {
        title: [{
          required: true,
          message: '供应商名称不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '名称长度超出范围1-120位之间', trigger: 'blur' }],
        address: [{
          required: true,
          message: '供应商地址不能为空',
          trigger: 'blur'
        }, { min: 1, max: 200, message: '供应商地址长度超出范围1-200位之间', trigger: 'blur' }],
        phone: [{
          required: true,
          message: '联系电话不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/,
          message: '联系电话格式错误',
          trigger: 'blur'
        }],
        contact: [{
          required: true,
          message: '联系人不能为空',
          trigger: 'blur'
        }, { min: 1, max: 20, message: '联系人长度超出范围1-20位之间', trigger: 'blur' }],
        email: [{
          required: true,
          message: '联系邮箱不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
          message: '联系邮箱格式错误',
          trigger: 'blur'
        }],
        remark: [{
          required: true,
          message: '供应说明不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '备注长度超出范围1-120位之间', trigger: 'blur' }]
      },
      modelShow: false,
      modelTitle: '',
      selectArr: [],
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
      console.log('askldjslkdf')
      if (that.selectArr.length > 0) {
        const obj = {
          ids: this.selectArr.join(',')
        }
        that.$confirm('供应商一旦作废，不可以恢复,确定要批量“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          commodityBatchCancel(obj).then(res => {
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
    resetsubmit() {
      this.$refs['storeForm'].resetFields()
      this.storeForm = {
      }
      // this.fileList = []
      this.submitting = false
    },
    getList() {
      const that = this
      getSupplier(that.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          console.log(res)
          that.tableData = res.data.suppliers
          that.total = res.data.pager.recTotal// 总条数
        }
      })
    },
    addStore() {
      this.modelType = 'new'
      this.modelShow = true
      this.modelTitle = '新增供应商'
    },
    importStore(event) {
      if (event) {
        this.getList()
      }
    },
    editStore(event) {
      this.modelType = 'edit'
      const data = { ...event }
      this.storeForm = {
        id: data.id,
        title: data.title,
        contact: data.contact,
        phone: data.phone,
        email: data.email,
        address: data.address,
        remark: data.remark
      }
      this.modelShow = true
      this.modelTitle = '编辑供应商'
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
    banSupplier(event) {
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
        changeSupplier(event.id).then(res => {
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
      const msg = '供应商一旦作废，不可以恢复,确定要作废此供应商吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancellationSupplier(event.id).then(res => {
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
    saveModel() {
      const that = this
      // 保存供应商
      this.$refs['storeForm'].validate((valid) => {
        if (valid) {
          console.log(this.storeForm)
          console.log(that.storeForm.id)
          if (that.modelType === 'new') {
            // 新增
            addSupplier(that.storeForm).then(res => {
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '供应商添加成功！',
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
            updateSupplier(that.storeForm).then(res => {
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '供应商更新成功！',
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
      this.$refs['storeForm'].resetFields()
      this.storeForm = {}
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
  .store_bg {
    position: absolute;
    width: 100%;
    top: 0;
    // background: #fff;
    // padding: 10px;
    .store_info{
      background: #fff;
      padding: 20px 10px;
      .text_color{
        color: #409EFF;
      }
    }
    .store_page {
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
