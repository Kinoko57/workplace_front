<template>
  <div class="overflow_scroll">
    <div class="tabs_fifter">
      <el-tabs :value="activeName" class="tabs_line_table" @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in tabsList" :key="index" :label="item.label" :name="item.name"/>
      </el-tabs>
      <div class="el_tabs_fifter">
        <div v-if="allowFifter" class="fifter_btn">
          <span>高级搜索</span>
          <el-switch v-model="fifterShow" class="fifter_switch" @change="searchShow(fifterShow)"/>
        </div>
        <el-input v-if="allowFifter" v-model="fuzzySearch.value" :placeholder="fuzzySearch.placeholder" size="small" class="fifter_search">
          <el-button slot="append" type="text" icon="el-icon-search" @click="fuzzyQuery(fuzzySearch.value)"/>
        </el-input>
        <el-button v-if="add" size="mini" type="primary" icon="el-icon-plus" @click="addAction()">{{ addText }}</el-button>
        <el-button v-if="supplement" size="mini" type="primary" icon="el-icon-plus" @click="supplementAction()">{{ suppText }}</el-button>
        <el-button v-if="other" size="mini" type="primary" @click="actionClick">{{ otherText }}</el-button>
        <el-button v-if="returnShow" size="mini" plain icon="el-icon-arrow-left" @click="returnAction">返回</el-button>
      </div>
    </div>
    <!-- 高级搜索 -->
    <div v-if="fifterShow" :style="{minWidth:minWidth+'px'}" class="search_style clearfix">
      <div v-for="(search,index) in searchList" v-if="search.show" :key="index" class="search_fifter">
        <div class="div_block">
          <span v-if="search.show" class="search_title">{{ search.name }}：</span>
          <el-input v-if="search.type=='input'&&search.show" v-model="search.value" :placeholder="search.placeholder" style="width:200px" size="small" />
          <el-select v-if="search.type=='select'&&search.show" v-model="search.value" :placeholder="search.placeholder" filterable size="small" style="width:200px">
            <el-option v-for="(item,index) in search.list" :key="index" :label="item" :value="index" />
          </el-select>
          <el-date-picker
            v-if="search.type=='date'&&search.show"
            v-model="search.value"
            :placeholder="search.placeholder"
            size="small"
            style="width:200px"
            default-time="['00:00:00']"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss" />
            <!-- <el-cascader
          v-if="search.type=='selectlevel'&&search.show"
          :placeholder="search.placeholder"
          v-model="search.value"
          :options="optionsList"
          size="mini"
          style="width:200px"
        /> -->
        </div>
      </div>
      <div class="search_btn">
        <div class="btn_block">
          <el-button type="primary" plain size="mini" @click="reset">重置</el-button>
          <el-button type="primary" size="mini" @click="searchQuery">确定</el-button>
        </div>
      </div>
    </div>
    <!-- 筛选搜索 -->
    <div v-if="showFifter&&allowFifter&&fifterOpen" ref="fifter_style" class="fifter_style clearfix">
      <span>筛选：</span>
      <div v-for="(fifter,index) in fifterList" :key="index" class="fifter_select" >
        <el-select v-model="fifter.value" :placeholder="fifter.placeholder" filterable size="small" style="width:160px" @change="filterQuery">
          <el-option v-for="(item,index) in fifter.list" :key="index" :label="item" :value="index" />
        </el-select>
      </div>
      <div v-if="btnFifter" class="reset_btn">
        <el-button size="mini" @click="restForm">清空</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getFifter,
  searchFifter,
  fifterExport
} from '@/api/public'
export default {
  name: 'MyTabs',
  props: {
    suppText: {
      type: String,
      default: '补录'
    },
    tabsList: {
      type: Array,
      default: () => []
    },
    addText: {
      type: String,
      default: '新建'
    },
    add: {
      type: Boolean,
      default: false
    },
    other: {
      type: Boolean,
      default: false
    },
    fifterOpen: {
      type: Boolean,
      default: true
    },
    otherText: {
      type: String,
      default: '创建'
    },
    supplement: {
      type: Boolean,
      default: false
    },
    returnShow: {
      type: Boolean,
      default: false
    },
    allowFifter: {
      type: Boolean,
      default: true
    },
    activeName: {
      type: String,
      default: ''
    },
    pageName: {
      type: String,
      default: ''
    },
    moduleName: {
      type: String,
      default: ''
    },
    moduleType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fifterShow: false,
      btnFifter: false,
      fifterValue: '',
      tabWidth: 0,
      searchwidth: 0,
      minWidth: 800,
      fifterKey: {
        module: '',
        page: '',
        count: 0 // 组的连接条件
      },
      showFifter: false,
      optionsList: [],
      att_status: '',
      fuzzySearch: {}, // 模糊搜索
      searchList: [], // 搜索字段
      fifterList: [] // 筛选字段
    }
  },
  mounted() {
    if (this.allowFifter) {
      this.getList()
    }
    console.log(this.activeName)
    console.log(this.fifterValue)
  },
  methods: {
    getList() {
      const that = this
      let moduleName = this.moduleName
      if (this.moduleType != '') {
        moduleName = this.moduleName + '-' + this.moduleType
      }
      that.searchList = []
      that.fifterList = []
      that.fuzzySearch = {}
      getFifter(this.pageName, moduleName).then(res => {
        console.log(res)
        if (res.code == 200) {
          console.log(res.data.fields)
          const list = res.data.fields
          const fifter = res.data.chooseFields
          const search_value = res.data.params
          for (const i in list) {
            for (const j in search_value) {
              if (i == j) {
                that.searchList.push({ name: list[i], key: i, type: search_value[j].class != undefined && search_value[j].class == 'date' ? search_value[j].class : search_value[j].control, value: search_value[j].class != undefined && search_value[j].class == 'date' ? '' : '', list: search_value[j].control != 'input' ? search_value[j].values : [], placeholder: search_value[j].control == 'input' ? '请输入' + list[i] : '请选择' + list[i], show: true })
              }
            }
          }
          for (const i in fifter) {
            for (const j in search_value) {
              if (i == j) {
                if (search_value[j].control == 'select') {
                  that.fifterList.push({ name: list[i], key: i, placeholder: '请选择' + list[i], value: '', list: search_value[j].values })
                }
              }
            }
          }
          for (let i = 0; i < that.fifterList.length; i++) {
            for (let j = 0; j < that.searchList.length; j++) {
              if (that.fifterList[i].name == that.searchList[j].name) {
                that.searchList[j].show = false
              }
            }
          }
          for (const i in res.data.likeFields) {
            that.fuzzySearch = {
              name: res.data.likeFields[i],
              key: i,
              value: '',
              placeholder: '请输入' + res.data.likeFields[i]
            }
          }
          that.showFifter = true
          console.log(that.searchList)
          console.log(that.fifterList)
          console.log(that.fuzzySearch)
          console.log(document.getElementsByClassName('tabs_line_table'))
          console.log(document.getElementsByClassName('el_tabs_fifter'))
          that.tabWidth = document.getElementsByClassName('tabs_line_table')[0].offsetWidth
          that.searchwidth = document.getElementsByClassName('el_tabs_fifter')[0].offsetWidth
          that.minWidth = that.tabWidth + that.searchwidth
        }
      })
    },
    searchShow(value) {
      this.$emit('searchShow', value)
    },
    actionClick() {
      this.$emit('actionClick')
    },
    handleClick(tab, event) {
      if (this.pageName == 'workflow' && this.moduleName == 'oa' && tab.name != 'new' && (this.searchList.length == 0 || (window.localStorage.getItem('mode') != undefined && window.localStorage.getItem('mode') != ''))) {
        console.log('工作流重新获取搜索结果')
        this.getList()
      }
      if (this.pageName == 'workflow' && this.moduleName == 'oa' && tab.name == 'new') {
        this.fifterShow = false
      }
      console.log('原始输入')
      console.log(this.pageName)
      console.log(this.moduleName)
      console.log(tab.name)
      console.log(tab.name)
      if ((this.pageName == 'attendance' && this.moduleName == 'oa')) {
        console.log(this.activeName)
        this.att_status = tab.name
        this.fifterShow = false
        console.log('考勤重新获取搜索结果')
        if (this.att_status == 'all') {
          this.pageName = 'attendance'
          this.moduleName = 'oa'
        } else if (this.att_status == 'overtime') {
          this.pageName = 'overtime'
          this.moduleName = 'oa'
        }
        console.log('更改后')
        console.log(this.pageName)
        console.log(this.moduleName)
        this.resetFiFter()
        setTimeout(() => {
          this.getList()
        }, 50)
      }
      if (this.moduleName == 'ols') {
        console.log('群员管理重新获取搜索结果')
        if (tab.name == 'all') {
          this.pageName = 'cradlegrouplist'
        } else {
          this.pageName = 'cradlegroupmember'
        }
        console.log('更改后的数据')
        console.log(this.pageName)
        console.log(this.moduleName)
        this.getList()
      }
      if (this.moduleName == 'olsdm') {
        console.log('群员管理重新获取搜索结果')
        if (tab.name == 'all') {
          this.pageName = 'cradlegroupdmlist'
        } else {
          this.pageName = 'cradlegroupdmmember'
        }
        console.log('更改后的数据')
        console.log(this.pageName)
        console.log(this.moduleName)
        this.getList()
      }
      setTimeout(() => {
        this.$emit('handleClick', tab.name)
      }, 100)
    },
    addAction() {
      this.$emit('addAction')
    },
    supplementAction() {
      this.$emit('supplementAction')
    },
    returnAction() {
      this.$emit('returnAction')
    },
    fuzzyQuery(value) {
      // 模糊查询
      console.log('模糊查询')
      // 重置高级搜索和筛选，并且隐藏高级搜索
      for (let i = 0; i < this.searchList.length; i++) {
        if (this.searchList[i].type == 'date') {
          this.searchList[i].value = 0
        } else {
          this.searchList[i].value = ''
        }
      }
      this.fifterShow = false
      for (let i = 0; i < this.fifterList.length; i++) {
        this.fifterList[i].value = ''
      }
      // // 重置搜索关键字
      // this.fifterKey = {}
      // // 获取模糊查询的值
      // this.fifterKey.module = this.pageName
      // this.fifterKey.app = this.moduleName
      // 重置搜索关键字
      this.fifterKey = {}
      if ((this.pageName == 'attendance' && this.moduleName == 'oa')) {
        console.log(this.att_status)
        console.log('考勤重新获取搜索结果')
        if (this.att_status == 'all') {
          this.fifterKey.module = 'attendance'
          this.fifterKey.app = 'oa'
        } else if (this.att_status == 'overtime') {
          this.fifterKey.module = 'overtime'
          this.fifterKey.app = 'oa'
        }
        console.log('更改后')
        console.log(this.fifterKey)
      } else {
      // 获取高级搜索的值
        this.fifterKey.module = this.pageName
        this.fifterKey.app = this.moduleName
      }
      this.fifterKey.field1 = this.fuzzySearch.key
      this.fifterKey.value1 = this.fuzzySearch.value
      this.fifterKey.count = 1
      // 传递搜索关键字
      this.search(this.fifterKey, 'fuzzyQuery')
    },
    searchQuery() {
      // 高级搜索查询
      console.log('高级搜索查询')
      // 重置模糊查询和筛选
      console.log(this.searchList)
      console.log(this.fifterList)
      console.log(this.fuzzySearch)
      this.fuzzySearch.value = ''
      for (let i = 0; i < this.fifterList.length; i++) {
        this.fifterList[i].value = ''
      }
      let k = 1
      // 重置搜索关键字
      this.fifterKey = {}
      if ((this.pageName == 'attendance' && this.moduleName == 'oa')) {
        console.log(this.att_status)
        console.log('考勤重新获取搜索结果')
        if (this.att_status == 'all') {
          this.fifterKey.module = 'attendance'
          this.fifterKey.app = 'oa'
        } else if (this.att_status == 'overtime') {
          this.fifterKey.module = 'overtime'
          this.fifterKey.app = 'oa'
        }
        console.log('更改后')
        console.log(this.fifterKey)
      } else {
      // 获取高级搜索的值
        this.fifterKey.module = this.pageName
        this.fifterKey.app = this.moduleName
      }

      const list = []
      for (let i = 0; i < this.searchList.length; i++) {
        if (this.searchList[i].value != '' && this.searchList[i].value != 0 && this.searchList[i].value != null) {
          list.push({ key: 'field' + k, name: 'value' + k, label: this.searchList[i].key, value: this.searchList[i].value == null ? '' : this.searchList[i].value })
          ++k
        }
      }
      console.log(list)
      for (let i = 0; i < list.length; i++) {
        this.fifterKey[list[i].key] = list[i].label
        this.fifterKey[list[i].name] = list[i].value
      }
      this.fifterKey.count = list.length
      console.log(this.fifterKey)
      // 传递搜索关键字
      this.search(this.fifterKey, 'searchQuery')
    },
    reset() {
      // 重置高级搜索关键字
      this.fifterKey = {}
      // 重置高级搜索
      for (let i = 0; i < this.searchList.length; i++) {
        if (this.searchList[i].type == 'date') {
          this.searchList[i].value = ''
        } else {
          this.searchList[i].value = ''
        }
      }
    },
    filterQuery() {
      // 筛选查询
      console.log('筛选查询')
      // 重置搜索关键字
      this.fifterKey = {}
      // 获取筛选查询的值
      let k = 1
      if ((this.pageName == 'attendance' && this.moduleName == 'oa')) {
        console.log(this.att_status)
        console.log('考勤重新获取搜索结果')
        if (this.att_status == 'all') {
          this.fifterKey.module = 'attendance'
          this.fifterKey.app = 'oa'
        } else if (this.att_status == 'overtime') {
          this.fifterKey.module = 'overtime'
          this.fifterKey.app = 'oa'
        }
        console.log('更改后')
        console.log(this.fifterKey)
      } else {
      // 获取高级搜索的值
        this.fifterKey.module = this.pageName
        this.fifterKey.app = this.moduleName
      }
      this.btnFifter = true
      const list = []
      console.log(this.fifterList)
      for (let i = 0; i < this.fifterList.length; i++) {
        if (this.fifterList[i].value != '' && this.fifterList[i].value != 0) {
          list.push({ key: 'field' + k, name: 'value' + k, label: this.fifterList[i].key, value: this.fifterList[i].value })
          ++k
        }
      }
      for (let i = 0; i < this.searchList.length; i++) {
        if (this.searchList[i].value != '' && this.searchList[i].value != 0 && this.searchList[i].value != null) {
          list.push({ key: 'field' + k, name: 'value' + k, label: this.searchList[i].key, value: this.searchList[i].value == null ? '' : this.searchList[i].value })
          ++k
        }
      }
      if (this.fuzzySearch.value != '') {
        list.push({ key: 'field' + k, name: 'value' + k, label: this.fuzzySearch.key, value: this.fuzzySearch.value })
        ++k
      }
      console.log(list)
      for (let i = 0; i < list.length; i++) {
        this.fifterKey[list[i].key] = list[i].label
        this.fifterKey[list[i].name] = list[i].value
      }
      this.fifterKey.count = list.length
      console.log(this.fifterKey)
      // 传递搜索关键字
      this.search(this.fifterKey, 'filterQuery')
    },
    restForm() {
      // 重置筛选
      // 重置搜索关键字
      this.fifterKey = {}
      // 重置筛选
      for (let i = 0; i < this.fifterList.length; i++) {
        this.fifterList[i].value = ''
      }
      let k = 1
      // 获取高级搜索的值
      // this.fifterKey.module = this.pageName
      // this.fifterKey.app = this.moduleName
      if ((this.pageName == 'attendance' && this.moduleName == 'oa')) {
        console.log(this.att_status)
        console.log('考勤重新获取搜索结果')
        if (this.att_status == 'all') {
          this.fifterKey.module = 'attendance'
          this.fifterKey.app = 'oa'
        } else if (this.att_status == 'overtime') {
          this.fifterKey.module = 'overtime'
          this.fifterKey.app = 'oa'
        }
        console.log('更改后')
        console.log(this.fifterKey)
      } else {
      // 获取高级搜索的值
        this.fifterKey.module = this.pageName
        this.fifterKey.app = this.moduleName
      }
      const list = []
      for (let i = 0; i < this.searchList.length; i++) {
        if (this.searchList[i].value != '' && this.searchList[i].value != 0) {
          list.push({ key: 'field' + k, name: 'value' + k, label: this.searchList[i].key, value: this.searchList[i].value })
          ++k
        }
      }
      console.log(list)
      for (let i = 0; i < list.length; i++) {
        this.fifterKey[list[i].key] = list[i].label
        this.fifterKey[list[i].name] = list[i].value
      }
      this.fifterKey.count = list.length
      if (this.fuzzySearch.value != '') {
        this.fifterKey['field' + k] = this.fuzzySearch.key
        this.fifterKey['value' + k] = this.fuzzySearch.value
        this.fifterKey.count++
      }
      this.btnFifter = false
      console.log(this.fifterKey)
      this.search(this.fifterKey, 'filterQuery')
    },
    search(fifterKey, actionName) {
      console.log(fifterKey)
      console.log(actionName)
      searchFifter(fifterKey).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$emit(actionName, true)
        }
      })
    },
    resetFiFter() {
      // 重置高级搜索关键字加搜索加筛选
      this.fifterKey = {}
      // 重置高级搜索
      for (let i = 0; i < this.searchList.length; i++) {
        if (this.searchList[i].type == 'date') {
          this.searchList[i].value = ''
        } else {
          this.searchList[i].value = ''
        }
      }
      // 重置筛选
      for (let i = 0; i < this.fifterList.length; i++) {
        this.fifterList[i].value = ''
      }
      let k = 1
      if ((this.pageName == 'attendance' && this.moduleName == 'oa')) {
        console.log(this.att_status)
        console.log('考勤重新获取搜索结果')
        if (this.att_status == 'all') {
          this.fifterKey.module = 'attendance'
          this.fifterKey.app = 'oa'
        } else if (this.att_status == 'overtime') {
          this.fifterKey.module = 'overtime'
          this.fifterKey.app = 'oa'
        }
        console.log('更改后')
        console.log(this.fifterKey)
      } else {
      // 获取高级搜索的值
        this.fifterKey.module = this.pageName
        this.fifterKey.app = this.moduleName
      }
      const list = []
      for (let i = 0; i < this.searchList.length; i++) {
        if (this.searchList[i].value != '' && this.searchList[i].value != 0) {
          list.push({ key: 'field' + k, name: 'value' + k, label: this.searchList[i].key, value: this.searchList[i].value })
          ++k
        }
      }
      console.log(list)
      for (let i = 0; i < list.length; i++) {
        this.fifterKey[list[i].key] = list[i].label
        this.fifterKey[list[i].name] = list[i].value
      }
      this.fifterKey.count = list.length
      if (this.fuzzySearch.value != '') {
        this.fifterKey['field' + k] = this.fuzzySearch.key
        this.fifterKey['value' + k] = this.fuzzySearch.value
        this.fifterKey.count++
      }
      this.btnFifter = false
      console.log(this.fifterKey)
      searchFifter(this.fifterKey).then(res => {
        console.log(res)
        if (res.code === 200) {
        }
      })
    }
  }
}

</script>
<style lang="less" scoped>
.overflow_scroll{
    overflow-x: scroll;
    overflow-y: hidden;
}
</style>

