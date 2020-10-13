<template>
  <div>
    <div class="search_bg">
      <div class="search_btn">
        <div>
          <el-button v-show="add" type="primary" icon="el-icon-plus" @click="addAction">{{ addText }}</el-button>
          <el-button v-show="fifter" :disabled="!delayFifter" type="primary" icon="el-icon-search" @click="showFifter">高级搜索</el-button>
          <el-button v-show="other" type="primary" @click="actionClick">{{ otherText }}</el-button>
          <el-button v-show="returnShow" plain @click="returnAction">返回</el-button>
        </div>
        <div>
          <el-button v-show="importShow" type="text" icon="el-icon-download" @click="showDialog">导入</el-button>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <el-button v-show="exportShow" type="text" icon="el-icon-upload2">导出<i class="el-icon-arrow-down el-icon--right" /></el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span @click="exportAction('all')">导出全部记录</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click="exportAction('thisPage')">导出本页记录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div v-show="innerShow" :class="allShow?'fifter_list fifter_short_list':'fifter_list'">
        <div class="fifter_select">
          <div class="first_inline">
            <span class="first_span short_width">第一组</span>
            <el-select v-model="fifterKey.field1" placeholder="请选择" class="short_width" @change="change01">
              <el-option v-for="item in optionsList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="fifterKey.operator1" placeholder="请选择" class="short_width short_width2">
              <el-option v-for="item in fifterList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-input v-show="type1=='input'" v-model="fifterKey.value1" class="short_width short_width3" />
            <el-date-picker
              v-show="type1=='date'"
              v-model="fifterKey.value1"
              default-time="['00:00:00']"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="short_width short_width3" />
            <el-select v-show="type1=='select'" v-model="fifterKey.value1" placeholder="请选择" class="short_width short_width3">
              <el-option v-for="(item, index) in typeList1" :key="index" :label="item" :value="index" />
            </el-select>
          </div>
          <div v-if="allShow" class="first_inline">
            <el-select v-model="fifterKey.andOr2" placeholder="请选择" class="short_width">
              <el-option v-for="item in inclueList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="fifterKey.field2" placeholder="请选择" class="short_width" @change="change02">
              <el-option v-for="item in optionsList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="fifterKey.operator2" placeholder="请选择" class="short_width short_width2">
              <el-option v-for="item in fifterList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-input v-show="type2=='input'" v-model="fifterKey.value2" class="short_width short_width3" />
            <el-date-picker
              v-show="type2=='date'"
              v-model="fifterKey.value2"
              default-time="['00:00:00']"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="short_width short_width3" />
            <el-select v-show="type2=='select'" v-model="fifterKey.value2" placeholder="请选择" class="short_width short_width3">
              <el-option v-for="(item, index) in typeList2" :key="index" :label="item" :value="index" />
            </el-select>
          </div>
          <div v-if="allShow" class="first_inline">
            <el-select v-model="fifterKey.andOr3" placeholder="请选择" class="short_width">
              <el-option v-for="item in inclueList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="fifterKey.field3" placeholder="请选择" class="short_width" @change="change03">
              <el-option v-for="item in optionsList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="fifterKey.operator3" placeholder="请选择" class="short_width short_width2">
              <el-option v-for="item in fifterList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-input v-show="type3=='input'" v-model="fifterKey.value3" class="short_width short_width3" />
            <el-date-picker
              v-show="type3=='date'"
              v-model="fifterKey.value3"
              default-time="['00:00:00']"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="short_width short_width3" />
            <el-select v-show="type3=='select'" v-model="fifterKey.value3" placeholder="请选择" class="short_width short_width3">
              <el-option v-for="(item, index) in typeList3" :key="index" :label="item" :value="index" />
            </el-select>
          </div>
        </div>
        <div class="fifter_join">
          <el-select v-model="fifterKey.groupAndOr" placeholder="请选择" class="short_width">
            <el-option v-for="item in inclueList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="fifter_select">
          <div class="first_inline">
            <span class="first_span short_width">第二组</span>
            <!-- <el-select v-model="fifterKey.andOr4" placeholder="请选择" class="short_width">
              <el-option v-for="item in inclueList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <el-select v-model="fifterKey.field4" placeholder="请选择" class="short_width" @change="change04">
              <el-option v-for="item in optionsList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="fifterKey.operator4" placeholder="请选择" class="short_width short_width2">
              <el-option v-for="item in fifterList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-input v-show="type4=='input'" v-model="fifterKey.value4" class="short_width short_width3" />
            <el-date-picker
              v-show="type4=='date'"
              v-model="fifterKey.value4"
              default-time="['00:00:00']"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="short_width short_width3" />
            <el-select v-show="type4=='select'" v-model="fifterKey.value4" placeholder="请选择" class="short_width short_width3">
              <el-option v-for="(item, index) in typeList4" :key="index" :label="item" :value="index" />
            </el-select>
          </div>
          <div v-if="allShow" class="first_inline">
            <el-select v-model="fifterKey.andOr5" placeholder="请选择" class="short_width">
              <el-option v-for="item in inclueList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="fifterKey.field5" placeholder="请选择" class="short_width" @change="change05">
              <el-option v-for="item in optionsList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="fifterKey.operator5" placeholder="请选择" class="short_width short_width2">
              <el-option v-for="item in fifterList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-input v-show="type5=='input'" v-model="fifterKey.value5" class="short_width short_width3" />
            <el-date-picker
              v-show="type5=='date'"
              v-model="fifterKey.value5"
              default-time="['00:00:00']"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="short_width short_width3" />
            <el-select v-show="type5=='select'" v-model="fifterKey.value5" placeholder="请选择" class="short_width short_width3">
              <el-option v-for="(item, index) in typeList5" :key="index" :label="item" :value="index" />
            </el-select>
          </div>
          <div v-if="allShow" class="first_inline">
            <el-select v-model="fifterKey.andOr6" placeholder="请选择" class="short_width">
              <el-option v-for="item in inclueList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="fifterKey.field6" placeholder="请选择" class="short_width" @change="change06">
              <el-option v-for="item in optionsList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="fifterKey.operator6" placeholder="请选择" class="short_width short_width2">
              <el-option v-for="item in fifterList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-input v-show="type6=='input'" v-model="fifterKey.value6" class="short_width short_width3" />
            <el-date-picker
              v-show="type6=='date'"
              v-model="fifterKey.value6"
              default-time="['00:00:00']"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="short_width short_width3" />
            <el-select v-show="type6=='select'" v-model="fifterKey.value6" placeholder="请选择" class="short_width short_width3">
              <el-option v-for="(item, index) in typeList6" :key="index" :label="item" :value="index" />
            </el-select>
          </div>
        </div>
        <div class="fifter_btn">
          <el-button type="primary" round @click="search">搜索</el-button>
          <el-button round @click="reset">重置</el-button>
        </div>
        <div class="fifter_more">
          <i :class="!allShow?'el-icon-caret-bottom':'el-icon-caret-top'" @click="showMore" />
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="showModel" :close-on-click-modal="false" :modal-append-to-body="false" title="导入" width="560px" class="dialogModel">
      <!-- v-show="modelType='file'" -->
      <div class="download">
        <div class="inline">
          <span class="tips">第一步，下载导入模板文件</span>
          <el-tag>
            <a :href="downloadUrl">下载模板</a>
          </el-tag>
        </div>
        <div class="inline">
          <span class="tips">第二步，上传文件</span>
          <el-upload
            ref="upload"
            :on-preview="handlePreview"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :limit="1"
            :auto-upload="false"
            :file-list="fileList"
            :http-request="uploadFile"
            action=""
            class="upload-demo"
            multiple>
            <!-- <el-button size="small" type="primary">点击上传</el-button> -->
            <el-tag>点击上传文件</el-tag>
            <span class="small">请上传excel表格文件，且不超过5MB</span>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb（文件格式必须是.xls或者.xlsx的扩展名）</div> -->
          </el-upload>
          <!-- <el-tag @click="uploadAction">点击上传文件</el-tag>
          <span class="small">文件格式必须是.xls或者.xlsx的扩展名</span> -->
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showModel = false">取 消</el-button>
        <el-button type="primary" @click="importAction">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getFifter,
  searchFifter,
  fifterExport
} from '@/api/public'
import { getCookie } from '@/utils/auth'
import axios from 'axios'
export default {
  name: 'SearchFifter',
  props: {
    add: {
      type: Boolean,
      default: false
    },
    addText: {
      type: String,
      default: '创建'
    },
    fifter: {
      type: Boolean,
      default: false
    },
    delayFifter: {
      type: Boolean,
      default: true
    },
    fifterShow: {
      type: Boolean,
      default: false
    },
    other: {
      type: Boolean,
      default: false
    },
    otherText: {
      type: String,
      default: '创建'
    },
    importShow: {
      type: Boolean,
      default: false
    },
    exportShow: {
      type: Boolean,
      default: false
    },
    returnShow: {
      type: Boolean,
      default: false
    },
    uploadUrl: {
      type: String,
      default: ''
    },
    exportType: {
      type: String,
      default: ''
    },
    exportName: {
      type: String,
      default: ''
    },
    downloadUrl: {
      type: String,
      default: ''
    },
    moduleName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      allShow: false,
      showModel: false,
      innerShow: false,
      fifterKey: {
        module: '',
        field1: '',
        field2: '',
        field3: '',
        field4: '',
        field5: '',
        field6: '',
        operator1: 'include',
        operator2: 'include',
        operator3: 'include',
        operator4: 'include',
        operator5: 'include',
        operator6: 'include',
        andOr1: 'and',
        andOr2: 'and',
        andOr3: 'and',
        andOr4: 'and',
        andOr5: 'and',
        andOr6: 'and',
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        value5: '',
        value6: '',
        groupAndOr: 'and' // 组的连接条件
      },
      type1: 'input',
      type2: 'input',
      type3: 'input',
      type4: 'input',
      type5: 'input',
      type6: 'input',
      typeList1: '',
      typeList2: '',
      typeList3: '',
      typeList4: '',
      typeList5: '',
      typeList6: '',
      optionsList: [], // 下拉选择项
      fifterList: [ // 条件列表
        {
          value: '=',
          label: '='
        },
        {
          value: '!=',
          label: '!='
        },
        {
          value: '>=',
          label: '>='
        },
        {
          value: '<=',
          label: '<='
        },
        {
          value: 'include',
          label: '包含'
        }
        // ,
        //         {
        //           value: 'Not_included',
        //           label: '不包含'
        //         }
      ],
      inclueList: [{
        value: 'or',
        label: '或者'
      },
      {
        value: 'and',
        label: '并且'
      }
      ],
      input: '',
      fileList: [],
      fifterType: {}
    }
  },
  computed: {
    // eslint-disable-next-line vue/no-dupe-keys
    myHeaders() {
      const str = 'crm_account=' + getCookie('crm_account') + ';crm_token=' + getCookie('crm_token') + ';'
      return {
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryijpyfmB8m5uYr8Xq',
        'Authorization': str
      }
    }
  },
  mounted() {
    // this.uploadUrl = process.env.BASE_API + 'api/verbal/import_data'
  },
  methods: {
    getList() {
      const that = this
      console.log(this.moduleName)
      getFifter(this.moduleName).then(res => {
        that.optionsList = []
        if (res.code === 200) {
          const obj1 = res.data.fields
          for (const i in obj1) {
            that.optionsList.push({
              label: obj1[i],
              value: i
            })
          }
          that.fifterType = res.data.params
          that.fifterKey.field1 = that.optionsList[0].value
          that.fifterKey.field4 = that.optionsList[1].value
          const obj2 = res.data.params
          for (const i in obj2) {
            if (i === that.fifterKey.field1) {
              that.fifterKey.operator1 = obj2[i]['operator']
              that.type1 = obj2[i]['control']
              that.typeList1 = obj2[i]['values']
              if (obj2[i]['class'] !== undefined && obj2[i]['class'] === 'date') {
                this.type1 = 'date'
              }
            }
            if (i === that.fifterKey.field4) {
              that.fifterKey.operator4 = obj2[i]['operator']
              that.type4 = obj2[i]['control']
              that.typeList4 = obj2[i]['values']
              if (obj2[i]['class'] !== undefined && obj2[i]['class'] === 'date') {
                this.type4 = 'date'
              }
            }
          }
          that.fifterKey.module = res.data.module
        }
      })
    },
    showFifter() {
      this.innerShow = !this.innerShow
      if (this.innerShow) {
        this.getList()
      }
    },
    tabFifter() {
      this.fifterKey = {
        module: this.fifterKey.module,
        field1: '',
        field2: '',
        field3: '',
        field4: '',
        field5: '',
        field6: '',
        operator1: 'include',
        operator2: 'include',
        operator3: 'include',
        operator4: 'include',
        operator5: 'include',
        operator6: 'include',
        andOr1: 'and',
        andOr2: 'and',
        andOr3: 'and',
        andOr4: 'and',
        andOr5: 'and',
        andOr6: 'and',
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        value5: '',
        value6: '',
        groupAndOr: 'and'
      }
      this.type1 = 'input'
      this.type2 = 'input'
      this.type3 = 'input'
      this.type4 = 'input'
      this.type5 = 'input'
      this.type6 = 'input'
      this.typeList1 = ''
      this.typeList2 = ''
      this.typeList3 = ''
      this.typeList4 = ''
      this.typeList5 = ''
      this.typeList6 = ''
      this.getList()
    },
    showMore() {
      this.allShow = !this.allShow
    },
    addAction() {
      this.$emit('addAction')
    },
    actionClick() {
      this.$emit('actionClick')
    },
    returnAction() {
      this.$emit('returnAction')
    },
    showDialog() {
      this.fileList = []
      this.showModel = true
    },
    search() {
      console.log(this.fifterKey)
      searchFifter(this.fifterKey).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$emit('search', true)
        }
      })
    },
    reset() {
      console.log('重置')
      this.fifterKey = {
        module: this.fifterKey.module,
        field1: '',
        field2: '',
        field3: '',
        field4: '',
        field5: '',
        field6: '',
        operator1: 'include',
        operator2: 'include',
        operator3: 'include',
        operator4: 'include',
        operator5: 'include',
        operator6: 'include',
        andOr1: 'and',
        andOr2: 'and',
        andOr3: 'and',
        andOr4: 'and',
        andOr5: 'and',
        andOr6: 'and',
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        value5: '',
        value6: '',
        groupAndOr: 'and'
      }
      this.type1 = 'input'
      this.type2 = 'input'
      this.type3 = 'input'
      this.type4 = 'input'
      this.type5 = 'input'
      this.type6 = 'input'
      this.typeList1 = ''
      this.typeList2 = ''
      this.typeList3 = ''
      this.typeList4 = ''
      this.typeList5 = ''
      this.typeList6 = ''
      this.$emit('search', false)
    },
    importAction() {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message.warning('请上传文件！')
        return
      }
      this.$refs.upload.submit()
      // 导入
      this.$emit('importAction')
    },
    exportAction(data) {
      const info = {
        mode: data
      }
      const url = this.exportType
      fifterExport(url, info).then(res => {
        console.log(url)
        let filename = ''
        if (data === 'all') {
          filename = this.exportName + '全部' + new Date().getTime()
        } else {
          filename = this.exportName + '当前页' + new Date().getTime()
        }
        var csvContent = 'data:text/csv;charset=utf-8,\ufeff'
        csvContent += res.data
        var encodedUri = encodeURI(csvContent)
        var link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', filename + '.csv')
        document.body.appendChild(link)
        link.click()
      })
    },
    // downloadAction() {
    //   // 下载模板
    //   this.$emit('downloadAction')
    // },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    beforeUpload(file) {
      console.log(file)
      console.log(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5
      if (file.name.indexOf('.xls') === -1 && file.name.indexOf('.xlsx') === -1 && file.name.indexOf('.csv') === -1) {
        // this.$message.warning('文件格式必须是.xls或者.xlsx的扩展名')
        this.$message.warning('文件格式不正确！')
        return false
      }
      if (!isLt5M) {
        this.$message.warning('文件大小不能超过5M！')
        return false
      }
      // if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.type !==
      //     'application/vnd.ms-excel') {
      //   this.$message.warning('文件格式必须是.xls或者.xlsx的扩展名')
      //   return false
      // }
    },
    uploadFile(item) {
      const fileObj = item.file
      // FormData 对象
      const formdata = new FormData()
      // 文件对象
      formdata.append('file', fileObj)
      let baseURL = ''
      if (process.env.NODE_ENV === 'development') {
        baseURL = '/index.php'
      } else {
        baseURL = ''
      }
      const url = baseURL + this.uploadUrl
      const str = 'crm_account=' + getCookie('crm_account') + ';crm_token=' + getCookie('crm_token') + ';'
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Token': str
        }
      }
      console.log(config)
      console.log(this.uploadUrl)
      axios.post(url, formdata, config).then(res => {
        const file = res.data
        if (file.code === 200 || file.code === '200') {
        // const total = file.data.importResult.errorCount + file.data.importResult.successCount
        // const msg = '共上传' + total + '条，成功' + file.data.importResult.successCount + '条，失败' + file.data.importResult.errorCount + '条'
          if (file.data.importResult.errorCount === 0) {
            this.$message({
              message: '导入成功',
              type: 'success'
            })
          } else {
            const msg = '失败' + file.data.importResult.errorCount + '条'
            this.$message({
              message: msg
            })
          }
          this.$emit('importAction', true)
          this.showModel = false
        } else {
          this.$message({
            message: file.msg,
            type: 'warning'
          })
        }
      })
      // EnterAPI.iExcel(form).then(response => {
      //   console.log('MediaAPI.upload')
      //   console.log(response)
      //   this.$message.info('文件：' + fileObj.name + '上传成功')
      // })
    },
    // handleSuccess(file, fileList) {
    //   console.log(file, fileList)
    //   if (file.code === 200 || file.code === '200') {
    //     // const total = file.data.importResult.errorCount + file.data.importResult.successCount
    //     // const msg = '共上传' + total + '条，成功' + file.data.importResult.successCount + '条，失败' + file.data.importResult.errorCount + '条'
    //     if (file.data.importResult.errorCount === 0) {
    //       this.$message({
    //         message: '导入成功',
    //         type: 'success'
    //       })
    //     } else {
    //       const msg = '失败' + file.data.importResult.errorCount + '条'
    //       this.$message({
    //         message: msg
    //       })
    //     }
    //     this.$emit('importAction', true)
    //     this.showModel = false
    //   } else {
    //     this.$message({
    //       message: file.msg,
    //       type: 'warning'
    //     })
    //   }
    // },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    },
    change01(event) {
      console.log(event)
      const obj = this.fifterType
      for (var i in obj) {
        if (i === event) {
          console.log(obj[i])
          console.log(i)
          this.fifterKey.operator1 = obj[i]['operator']
          this.type1 = obj[i]['control']
          this.typeList1 = obj[i]['values']
          if (obj[i]['class'] !== undefined && obj[i]['class'] === 'date') {
            this.type1 = 'date'
          }
        }
      }
      this.fifterKey.value1 = ''
      console.log(this.operator1)
      console.log(this.type1)
      console.log(this.typeList1)
      this.$forceUpdate()
    },
    change02(event) {
      console.log(event)
      const obj = this.fifterType
      for (var i in obj) {
        if (i === event) {
          this.fifterKey.operator2 = obj[i]['operator']
          this.type2 = obj[i]['control']
          this.typeList2 = obj[i]['values']
          if (obj[i]['class'] !== undefined && obj[i]['class'] === 'date') {
            this.type2 = 'date'
          }
        }
      }
      this.fifterKey.value2 = ''
    },
    change03(event) {
      const obj = this.fifterType
      for (var i in obj) {
        if (i === event) {
          this.fifterKey.operator3 = obj[i]['operator']
          this.type3 = obj[i]['control']
          this.typeList3 = obj[i]['values']
          if (obj[i]['class'] !== undefined && obj[i]['class'] === 'date') {
            this.type3 = 'date'
          }
        }
      }
      this.fifterKey.value3 = ''
    },
    change04(event) {
      const obj = this.fifterType
      for (var i in obj) {
        if (i === event) {
          this.fifterKey.operator4 = obj[i]['operator']
          this.type4 = obj[i]['control']
          this.typeList4 = obj[i]['values']
          if (obj[i]['class'] !== undefined && obj[i]['class'] === 'date') {
            this.type4 = 'date'
          }
        }
      }
      this.fifterKey.value4 = ''
    },
    change05(event) {
      const obj = this.fifterType
      for (var i in obj) {
        if (i === event) {
          this.fifterKey.operator5 = obj[i]['operator']
          this.type5 = obj[i]['control']
          this.typeList5 = obj[i]['values']
          if (obj[i]['class'] !== undefined && obj[i]['class'] === 'date') {
            this.type5 = 'date'
          }
        }
      }
      this.fifterKey.value5 = ''
    },
    change06(event) {
      const obj = this.fifterType
      for (var i in obj) {
        if (i === event) {
          this.fifterKey.operator6 = obj[i]['operator']
          this.type6 = obj[i]['control']
          this.typeList6 = obj[i]['values']
          if (obj[i]['class'] !== undefined && obj[i]['class'] === 'date') {
            this.type6 = 'date'
          }
        }
      }
      this.fifterKey.value6 = ''
    }
    // warning_close() {
    //   this.$emit('warning_close')
    // },
    // btnClick() {
    //   this.$emit('btnClick')
    // }
  }
}

</script>
<style lang="less" scoped>
  .search_bg {
    margin: 10px 0;

    .search_btn {
      display: flex;
      align-items: center;
      justify-content: space-between;

      button {
        margin-left: 0;
        margin-right: 10px;
      }
    }

    .fifter_list {
      background: #fafcff;
      // margin: 10px 40px;
      // padding: 0 10px;
      display: flex;
      height: 60px;
      overflow: hidden;
      justify-content: center;

      .fifter_select {
        min-width: 344px;
        padding: 10px 0;

        .first_inline {
          padding-top: 10px;

          .first_span {
            display: inline-block;
            text-align: right;
            padding-right: 10px;
          }

          .short_width {
            width: 24%;
            color: #333;
            font-size: 14px;
            font-family: 'Arial Normal', 'Arial';
          }

          .short_width2 {
            width: 18%;
          }

          .short_width3 {
            width: 30%;
          }
        }

      }

      .fifter_join {
        // width: 8%;
        margin: 10px;
        // margin-left: 0px;
        padding: 10px 0;
        min-width: 80px;
      }

      .fifter_btn {
        margin: 10px;
        display: inline-flex;
        padding-top: 10px;
        align-items: center;
      }

      .fifter_more {
        margin: 10px;
        padding: 18px 0;
      }
    }

    .fifter_short_list {
      align-items: center;
      height: auto;
      .fifter_join{
        margin-top: 20px;
      }
      .fifter_more{
        margin-top: 20px;
      }
    }

  }

  .dialogModel {
    .download {
      margin: 0 10px;

      .inline {
        margin: 10px 0;
        display: flex;

        // .el-tag {
        //   margin: 0 15px;
        // }
        span {
          font-size: 14px;
          margin-top: 6px;
          margin-right: 15px;
        }

        .tips {
          padding-top: 6px;
        }

        .small {
          font-size: 12px;
          color: rgb(153, 153, 153);
          margin-right: 0px;
        }
      }

    }

  }

</style>
