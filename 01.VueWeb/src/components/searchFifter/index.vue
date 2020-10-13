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
          <el-button v-show="importShow" size="mini" plain @click="showDialog">导入</el-button>
          <el-dropdown v-if="exportAll" trigger="click">
            <span class="el-dropdown-link">
              <el-button v-show="exportShow" size="mini" plain>导出<i class="el-icon-arrow-down el-icon--right" /></el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="exportAction('all')">导出全部记录</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="exportAction('thisPage')">导出本页记录</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button v-if="!exportAll&&exportShow" size="mini" plain @click="exportAction('statistic')">导出</el-button>
        </div>
        <div v-if="helpedit||edit">
          <el-button v-show="helpedit" size="mini" type="primary" icon="el-icon-edit-outline" plain @click="helpAction">{{ editText }}</el-button>
          <el-button v-show="edit" size="mini" type="primary" icon="el-icon-edit-outline" plain @click="editAction">{{ eidtText }}</el-button>
        </div>
      </div>
      <div v-show="fifterShow" :class="allShow?'fifter_list fifter_short_list':'fifter_list'">
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
            <el-cascader
              v-show="type1=='selectlevel'"
              v-model="valueArr1"
              :options="typeOptions1"
              class="short_width short_width3"
              @change="choseSelect1"
            />
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
            <el-cascader
              v-show="type2=='selectlevel'"
              v-model="valueArr2"
              :options="typeOptions2"
              class="short_width short_width3"
              @change="choseSelect2"
            />
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
            <el-cascader
              v-show="type3=='selectlevel'"
              v-model="valueArr3"
              :options="typeOptions3"
              class="short_width short_width3"
              @change="choseSelect3"
            />
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
            <el-cascader
              v-show="type4=='selectlevel'"
              v-model="valueArr4"
              :options="typeOptions4"
              class="short_width short_width3"
              @change="choseSelect4"
            />
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
            <el-cascader
              v-show="type5=='selectlevel'"
              v-model="valueArr5"
              :options="typeOptions5"
              class="short_width short_width3"
              @change="choseSelect5"
            />
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
            <el-cascader
              v-show="type6=='selectlevel'"
              v-model="valueArr6"
              :options="typeOptions6"
              class="short_width short_width3"
              @change="choseSelect6"
            />
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
    <el-dialog :visible.sync="showModel" :close-on-click-modal="false" :show-close="submitting==false" :modal-append-to-body="false" title="导入" width="560px" class="dialogModel middle_dialog" @close="resetModel">
      <!-- v-show="modelType='file'" -->
      <div class="download">
        <div class="inline">
          <div class="inline_left">
            <img src="@/assets/down.png" alt="" srcset="">
            <!-- <i class="iconfont "></i> -->
          </div>
          <div class="inline_right">
            <div class="inline_tit">第一步、填写导入数据信息</div>
            <span class="tips">请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除</span>
            <el-tag>
              <a :href="downloadUrl" target="_blank">下载模板</a>
            </el-tag>
          </div>
        </div>
        <div class="inline">
          <div class="inline_left">
            <img v-if="!showUp" src="@/assets/up.png" alt="" srcset="">
            <img v-else src="@/assets/up1.png" alt="" srcset="">
            <!-- <i class="iconfont "></i> -->
          </div>
          <div class="inline_right">
            <div class="inline_tit">第二步、上传填好的信息表</div>
            <span class="tips">文件后缀名必须为xls 或xlsx 或 csv （即Excel格式），文件大小不得大于5M</span>
            <el-upload
              ref="upload"
              :on-preview="handlePreview"
              :on-exceed="handleExceed"
              :on-change="changeFile"
              :before-upload="beforeUpload"
              :before-remove="beforeRemove"
              :limit="1"
              :auto-upload="false"
              :file-list="fileList"
              :http-request="uploadFile"
              action=""
              class="upload-demo">
              <!-- <el-button size="small" type="primary">点击上传</el-button> -->
              <el-tag>点击上传文件</el-tag>
              <!-- <span class="small">请上传excel表格文件，且不超过5MB</span> -->
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb（文件格式必须是.xls或者.xlsx的扩展名）</div> -->
            </el-upload>
          </div>

          <!-- <el-tag @click="uploadAction">点击上传文件</el-tag>
          <span class="small">文件格式必须是.xls或者.xlsx的扩展名</span> -->
        </div>
        <div v-if="show_progress" class="load_prograss">
          <el-progress :percentage="progress_num" :stroke-width="20"/>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="submitting==true" @click="resetModel">取 消</el-button>
        <el-button :loading="submitting" type="primary" @click="importAction" >确 定</el-button>
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
    edit: {
      type: Boolean,
      default: false
    },
    eidtText: {
      type: String,
      default: '事务对接表'
    },
    helpedit: {
      type: Boolean,
      default: false
    },
    editText: {
      type: String,
      default: '帮助文档'
    },
    fifter: {
      type: Boolean,
      default: false
    },
    delayFifter: {
      type: Boolean,
      default: true
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
    exportAll: {
      type: Boolean,
      default: true
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
      showUp: false,
      fifterShow: false,
      showModel: false,
      submitting: false,
      show_progress: false,
      progress_num: 0,
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
      valueArr1: [],
      valueArr2: [],
      valueArr3: [],
      valueArr4: [],
      valueArr5: [],
      valueArr6: [],
      typeOptions1: [],
      typeOptions2: [],
      typeOptions3: [],
      typeOptions4: [],
      typeOptions5: [],
      typeOptions6: [],
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
      this.fifterShow = !this.fifterShow
      if (this.fifterShow) {
        this.getList()
      }
    },
    showMore() {
      this.allShow = !this.allShow
    },
    addAction() {
      this.$emit('addAction')
    },
    editAction() {
      this.$emit('editAction')
    },
    helpAction() {
      this.$emit('helpAction')
    },
    actionClick() {
      this.$emit('actionClick')
    },
    returnAction() {
      this.$emit('returnAction')
    },
    resetModel() {
      this.showUp = false
      this.showModel = false
      this.fileList = []
    },
    showDialog() {
      this.show_progress = false
      this.progress_num = 0
      if (this.$route.path === '/online/memberlist') {
        // this.$message.warning('只能导入经销商，不能导入公司员工！')
        this.$confirm('只能导入经销商，不能导入公司员工！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.showModel = true
          this.fileList = []
        }).catch(() => {
          console.log('用户点击了取消')
        })
      } else {
        this.showModel = true
        this.fileList = []
      }
      console.log(this.$route.path)
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
      this.valueArr1 = []
      this.valueArr2 = []
      this.valueArr3 = []
      this.valueArr4 = []
      this.valueArr5 = []
      this.valueArr6 = []
      this.typeOptions1 = []
      this.typeOptions2 = []
      this.typeOptions3 = []
      this.typeOptions4 = []
      this.typeOptions5 = []
      this.typeOptions6 = []
      this.$emit('search', false)
    },
    importAction() {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message.warning('请上传文件！')
        return
      }
      console.log(this.$refs.upload)
      this.$refs.upload.submit()
      // this.fileList = []
      // 导入
      this.$emit('importAction')
    },
    changeFile() {
      this.showUp = true
    },
    beforeRemove() {
      this.showUp = false
    },
    exportAction(data) {
      if (data == 'statistic') {
        // 导出
        this.$emit('exportAction')
      } else {
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
      }
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
      const that = this
      const fileObj = item.file
      this.submitting = true
      this.show_progress = false
      // FormData 对象
      const formdata = new FormData()
      // 文件对象
      formdata.append('file', fileObj)
      if (that.uploadUrl.indexOf('agent/agent-importAgent') != -1) {
        that.show_progress = true
      }
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
      const time = setInterval(() => {
        if (that.progress_num <= 70) {
          that.progress_num = that.progress_num + 2
        } else if (that.progress_num <= 95) {
          that.progress_num = that.progress_num + 1
        } else {
          console.log('进度条不增加，等接口返回')
        }
      }, 500)
      axios.post(url, formdata, config).then(res => {
        console.log(res.data)
        const file = res.data
        that.showUp = false
        if (file.code === 200 || file.code === '200') {
          that.submitting = false
          that.progress_num = 100
          clearInterval(time)
          const total = file.data.importResult.errorCount + file.data.importResult.successCount
          const msg = '共上传' + total + '条，成功' + file.data.importResult.successCount + '条，失败' + file.data.importResult.errorCount + '条'
          if (file.data.importResult.errorCount === 0) {
            that.$message({
              message: '导入成功',
              type: 'success'
            })
          } else {
            that.submitting = false
            that.progress_num = 0
            that.show_progress = false
            clearInterval(time)
            const msg = '失败' + file.data.importResult.errorCount + '条'
            that.$message({
              message: msg
            })
          }
          that.$emit('importAction', true)
          that.showModel = false
        } else {
          that.submitting = false
          that.progress_num = 0
          that.show_progress = false
          clearInterval(time)
          that.$message({
            message: file.msg,
            type: 'warning'
          })
        }
      }).catch(req => {
        console.log(req)
        that.submitting = false
        that.progress_num = 100
        that.show_progress = false
        clearInterval(time)
      })
      const timeout = setTimeout(() => {
        that.submitting = false
        that.progress_num = 100
        that.show_progress = false
        clearTimeout(timeout)
      }, 5 * 60000)
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
          if (obj[i]['class'] !== undefined && obj[i]['class'] === 'date') {
            this.type1 = 'date'
          }
          if (this.type1 === 'selectlevel') {
            this.typeOptions1 = []
            const objList = obj[i]['values']
            const arr = []
            for (var j in objList) {
              arr.push(objList[j])
            }
            this.typeOptions1 = arr
          } else {
            this.typeList1 = obj[i]['values']
          }
        }
      }
      this.fifterKey.value1 = ''
      console.log(this.operator1)
      console.log(this.type1)
      console.log(this.typeList1)
      this.$forceUpdate()
    },
    choseSelect1(e) {
      this.fifterKey.value1 = ''
      this.fifterKey.value1 = this.valueArr1.join(',')
    },
    change02(event) {
      console.log(event)
      const obj = this.fifterType
      for (var i in obj) {
        console.log(obj[i])
        console.log(i)
        if (i === event) {
          this.fifterKey.operator2 = obj[i]['operator']
          this.type2 = obj[i]['control']
          if (obj[i]['class'] !== undefined && obj[i]['class'] === 'date') {
            this.type2 = 'date'
          }
          if (this.type2 === 'selectlevel') {
            this.typeOptions2 = []
            const objList = obj[i]['values']
            const arr = []
            for (var j in objList) {
              arr.push(objList[j])
            }
            this.typeOptions2 = arr
            console.log(this.valueArr2)
            console.log(this.typeOptions2)
          } else {
            this.typeList2 = obj[i]['values']
          }
        }
      }
      this.fifterKey.value2 = ''
    },
    choseSelect2(e) {
      this.fifterKey.value2 = ''
      this.fifterKey.value2 = this.valueArr2.join(',')
    },
    change03(event) {
      const obj = this.fifterType
      for (var i in obj) {
        if (i === event) {
          this.fifterKey.operator3 = obj[i]['operator']
          this.type3 = obj[i]['control']
          if (obj[i]['class'] !== undefined && obj[i]['class'] === 'date') {
            this.type3 = 'date'
          }
          if (this.type3 === 'selectlevel') {
            this.typeOptions3 = []
            const objList = obj[i]['values']
            const arr = []
            for (var j in objList) {
              arr.push(objList[j])
            }
            this.typeOptions3 = arr
          } else {
            this.typeList3 = obj[i]['values']
          }
        }
      }
      this.fifterKey.value3 = ''
    },
    choseSelect3(e) {
      this.fifterKey.value3 = ''
      this.fifterKey.value3 = this.valueArr3.join(',')
    },
    change04(event) {
      const obj = this.fifterType
      for (var i in obj) {
        if (i === event) {
          this.fifterKey.operator4 = obj[i]['operator']
          this.type4 = obj[i]['control']
          if (obj[i]['class'] !== undefined && obj[i]['class'] === 'date') {
            this.type4 = 'date'
          }
          if (this.type4 === 'selectlevel') {
            this.typeOptions4 = []
            const objList = obj[i]['values']
            const arr = []
            for (var j in objList) {
              arr.push(objList[j])
            }
            this.typeOptions4 = arr
          } else {
            this.typeList4 = obj[i]['values']
          }
        }
      }
      this.fifterKey.value4 = ''
    },
    choseSelect4(e) {
      this.fifterKey.value4 = ''
      this.fifterKey.value4 = this.valueArr4.join(',')
    },
    change05(event) {
      const obj = this.fifterType
      for (var i in obj) {
        if (i === event) {
          this.fifterKey.operator5 = obj[i]['operator']
          this.type5 = obj[i]['control']
          if (obj[i]['class'] !== undefined && obj[i]['class'] === 'date') {
            this.type5 = 'date'
          }
          if (this.type5 === 'selectlevel') {
            this.typeOptions5 = []
            const objList = obj[i]['values']
            const arr = []
            for (var j in objList) {
              arr.push(objList[j])
            }
            this.typeOptions5 = arr
          } else {
            this.typeList5 = obj[i]['values']
          }
        }
      }
      this.fifterKey.value5 = ''
    },
    choseSelect5(e) {
      this.fifterKey.value5 = ''
      this.fifterKey.value5 = this.valueArr5.join(',')
    },
    change06(event) {
      const obj = this.fifterType
      for (var i in obj) {
        if (i === event) {
          this.fifterKey.operator6 = obj[i]['operator']
          this.type6 = obj[i]['control']
          if (obj[i]['class'] !== undefined && obj[i]['class'] === 'date') {
            this.type6 = 'date'
          }
          if (this.type6 === 'selectlevel') {
            this.typeOptions6 = []
            const objList = obj[i]['values']
            const arr = []
            for (var j in objList) {
              arr.push(objList[j])
            }
            this.typeOptions6 = arr
          } else {
            this.typeList6 = obj[i]['values']
          }
        }
      }
      this.fifterKey.value6 = ''
    },
    choseSelect6(e) {
      this.fifterKey.value6 = ''
      this.fifterKey.value6 = this.valueArr6.join(',')
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
    // margin: 10px 0;

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
      margin-top: 40px;
      position: relative;
      .inline {
        margin: 0 30px;
        margin-bottom: 20px;
        display: flex;
        height: 120px;
        border: 1px solid rgba(233, 233, 233, 1);
        .inline_left{
         background:  rgba(245, 245, 245, 1);
         display: flex;
         width: 100px;
         border-right: 1px solid rgba(233, 233, 233, 1);
         height: 100%;
         align-items: center;
         justify-content: center;
         img{
           width: 43px;
           display: inline-block;
           height: 30px;
         }
        }
        .inline_right{
         height: 100%;
         padding-left: 20px;
         padding-top: 18px;
         .upload-demo{
           display: flex;
           /deep/ .el-upload{
             margin-right: 20px;

           }
           /deep/ .el-upload-list__item{
             max-width: 430px;
             overflow: hidden;
             white-space: nowrap;
             text-overflow: ellipsis
           }
         }
        }
        /deep/ .el-tag {
          font-size: 14px;
          margin-top: 10px;
          // margin-right: 15px;
        }
        .inline_tit{
            font-weight: 700;
            font-size: 14px;
            color: #666666;
          }
        .tips {
          display: block;
          padding-top: 10px;
          font-size: 12px;
          font-weight: 410;
          color: #999999;
        }

        .small {
          font-size: 12px;
          color: rgb(153, 153, 153);
          margin-right: 0px;
        }
      }
      .load_prograss{
        width: 760px;
        height: 516px;
        position: absolute;
        top: -90px;
        background: rgba(0, 0, 0, 0.2);
        z-index: 10000;
        .el-progress{
          position: absolute;
          top: 50%;
          transform: translate(-50%,-50%);
          width: 90%;
          left: 50%;
        }
      }

    }

  }
</style>
