<template>
  <div>
    <div class="work_bg">
      <div class="fifter">
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :allow-fifter="false"
          :active-name="searchInfo.mode"
          :tabs-list="tabsList"
          :return-show="true"
          @returnAction="returnBack"/>
      </div>
      <div class="work_info">
        <el-table v-loading="loading" :data="tableData" :max-height="tableHeight" border style="width: 100%">
          <el-table-column prop="id" label="序号" />
          <el-table-column prop="name" label="流程" />
          <!-- <el-table-column prop="editedDate" label="更新时间" sortable width="140"/> -->
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('processtype_browse')" type="text" size="small" @click="goSetType(scope.row)">配置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getWorkInfo
} from '@/api/office'
export default {
  name: 'TypeListManage',
  data() {
    return {
      page_name: 'process',
      module_name: 'sys',
      shows: false,
      tableData: [],
      loading: false,
      modelTitle: '新增审批类型',
      modelShow: false,
      sureBtn: '确 定',
      typeForm: {},
      tabsList: [
        { label: '配置工作流', name: 'all' }
      ],
      searchInfo: {
        mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      num: 1,
      total: 0 // 总条数
    }
  },
  mounted() {
    // 获取列表
    this.getList()
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  methods: {
    getList() {
      const that = this
      getWorkInfo().then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.process
        }
      })
    },
    returnBack() {
      this.$router.go(-1)
    },
    goSetType(event) {
      this.$router.push({
        path: '/office/workSet?id=' + event.id + '&name=' + event.name
      })
    }
  }
}

</script>
<style lang="less" scoped>
  .work_bg {
    background: #fff;
    padding: 10px;
    position: absolute;
    width: 100%;
    top: 0;
    // .search_btn {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    // }

    .work_info {
      margin: 20px 10px;

      .tabs_table {
        .over_line_one {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap
        }

        .over_line_two {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }

    .work_page {
      text-align: center;
      padding: 10px 0;
    }
  }

  .dialogModel {

    .model_layer {
      width: 100%;
      height:800px;
      // height: calc(100% - 60px);
      background: transparent;
      position: absolute;
      left: 0;
      top: 60px;
      z-index: 100;
      }
    .modelForm {
      margin: 0 10px;

      .node_list {
        display: flex;
        align-items: center;
        margin-left: 100px;

        .node_left {
          width: 85%;

          .node_left_top {
            display: inline-flex;
            margin-bottom: 0;

            .view_right {
              margin-right: 10px;
            }
          }
        }

        .node_right {
          i {
            font-size: 28px;
          }
        }
      }

      .fifter_down {
        position: relative;

        .chose_dep {
          background: transparent;
          border-color: #c0c4cc;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          height: 36px;
          line-height: 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          .overflow_text{
            overflow: hidden;
            display: inline-block;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .text_placeholder{
            color: #c0c4cc;
          }
          .tag_list {
          position: absolute;
          top: 0;
          left: 5px;
          width: 310px;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          height: 36px;
          line-height: 36px;

          span {
            margin-right: 5px;
          }
        }
        }

        .scroll_tree {
          .fifter_input {
            width: 400px;
            padding-top: 5px;
            padding-left: 5px;
            padding-bottom: 5px;
          }
        }
      }

      .center {
        margin: 0 70px;
      }

    }
  }

</style>
