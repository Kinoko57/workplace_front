<template>
  <div>
    <div class="department_bg">
      <my-tabs
        :active-name="'all'"
        :allow-fifter="false"
        :tabs-list="typeList"
      />
      <!-- <div class="fifter">
        <search-fifter :add="btnPermission('organize_save')" :add-text="'创建部门'" @addAction="addTopDep" />
      </div> -->
      <div class="dep_info">
        <div v-if="depList.lenght>0" class="dep_info_xian"/>
        <div class="dep_title">
          <span>组织架构</span>
          <span class="solt">操作</span>
        </div>
        <el-tree
          :data="depList"
          :props="defaultProps"
          :expand-on-click-node="false"
          :allow-drag="allowDrag"
          :indent="14"
          class="dep_tree tree_height"
          node-key="id"
          draggable
          default-expand-all
          highlight-current
          @node-drop="handleDrop">
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span class="dep_font dep_name">
              <span
                v-if="data.type==1"
                style="font-size:12px !important;background-color: #fff;border:1px solid #b3d8ff;color: #409eff;padding: 0px 4px;border-radius: 4px;">执行</span>{{ node.label }}</span>
            <!-- :style="{paddingLeft:data.level*30+'px'}" -->
            <span class="dep_btn">
              <el-button v-if="btnPermission('organize_save')" type="text" size="mini" @click="() => edit(data)">
                编辑
              </el-button>
              <el-button v-if="btnPermission('organize_save')" type="text" size="mini" @click="() => append(data)">
                添加下级
              </el-button>
              <el-button
                v-if="btnPermission('organize_delete')&&data.level !==1 "
                type="text"
                size="mini"
                @click="() => remove(node, data)">
                作废
              </el-button>
            </span>
          </span>
        </el-tree>
        <!-- </el-tab-pane>
        </el-tabs> -->
      </div>
      <el-dialog
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :visible.sync="modelShow"
        :title="modelTitle"
        width="600px"
        class="dialogModel"
        @close="resetModel1">
        <div v-show="fifterTree" class="model_layer" @click="hiddenTree" />
        <el-scrollbar class="fixed_scroll">
          <!-- 新建/编辑部门 -->
          <el-form
            v-if="modelShow"
            ref="depForm"
            :model="depForm"
            :rules="rules"
            class="modelForm"
            label-width="140px"
            label-position="right">
            <el-form-item label="名称：" prop="name">
              <el-input v-model.trim="depForm.name" autocomplete="off" style="width:500px" placeholder="请输入部门名称" />
            </el-form-item>
            <el-form-item label="是否为执行部门：" prop="type">
              <el-switch
                v-model="depForm.type"
                active-text="是"
                inactive-text="否"
                active-value="1"
                inactive-value="0"/>
            </el-form-item>
            <!-- <el-form-item v-show="modelType=='new'" label="上级部门：">
              <div class="fifter_tree">
                <div class="fifter_down">
                  <div class="chose_dep" @click="showTree(fifterId)">
                    <span v-if="filterName==''" class="text_placeholder">请选择上级部门</span>
                    <span>{{ filterName }}</span>
                    <div>
                      <i
                        v-show="!fifterTree"
                        slot="suffix"
                        class="el-input__icon el-icon-arrow-down"
                        @click="showTree(fifterId)" />
                      <i v-show="fifterTree" slot="suffix" class="el-input__icon el-icon-arrow-up" @click="hiddenTree" />
                    </div>
                  </div>
                </div>
                <transition name="slide-fade">
                  <div v-show="fifterTree" class="scroll_tree">
                    <el-input
                      v-model="filterText"
                      placeholder="模糊查询角色"
                      class="fifter_input"
                      style="width:360px"
                      @focus="showTree(fifterId)" />
                    <div class="fifter_up dep_tree dep_tree_fifter">
                      <el-tree
                        ref="deptree"
                        :data="depShowList"
                        :props="showProps"
                        :filter-node-method="filterNode"
                        :expand-on-click-node="false"
                        :highlight-current="true"
                        node-key="id"
                        default-expand-all
                        class="filter-tree"
                        @node-expand="showTree(fifterId)"
                        @node-collapse="showTree(fifterId)"
                        @node-click="choseDep" />
                    </div>
                  </div>
                </transition>
              </div>
            </el-form-item> -->
            <el-form-item label="简介：">
              <el-input :rows="4" v-model.trim="depForm.desc" type="textarea" style="width:500px" placeholder="请输入简介,最大长度为120个字" maxlength="120" />
            </el-form-item>
          </el-form>
        </el-scrollbar>
        <div slot="footer" class="dialog-footer">
          <el-button v-if="modelType=='new'" @click="resetModel">重 置</el-button>
          <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getDepList,
  addDep,
  updateDep,
  delDep,
  changeDep
} from '@/api/system'
  // const id = 1000
export default {
  name: 'DepartmentManage',
  data() {
    return {
      typeList: [
        { label: '全部部门', name: 'all' }
      ],
      tableHeight: 250,
      tableData: [],
      modelShowss: false,
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      showProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      depList: [],
      depShowList: [],
      modelShow: false,
      modelTitle: '',
      modelType: '',
      fifterTree: false,
      filterText: '',
      filterName: '',
      fifterId: 0,
      depForm: {
        id: '',
        type: 0,
        name: '',
        parentid: '',
        desc: ''
      },
      depsForm: {
        id: '',
        name: '',
        parentid: '',
        desc: ''
      },
      rules: {
        name: [{
          required: true,
          message: '部门名称不能为空',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 20,
          message: '部门名称长度在2-20位',
          trigger: 'blur'
        }
        ],
        type: [{
          required: true,
          message: '请选择是否为执行部门',
          trigger: 'change'
        }]
      },
      idList: [],
      num: 0,
      levelnum: 0,
      submitting: false
    }
  },
  watch: {
    filterText(val) {
      if (this.modelShow) {
        this.$refs.deptree.filter(val)
      }
    }
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  mounted() {
    // 页面第一个渲染的函数
    this.getList()
  },
  methods: {
    getList() {
      getDepList().then(res => {
        console.log(res)
        if (res.code === 200) {
          this.depList = JSON.parse(JSON.stringify(res.data.organize))
          this.formatLevel(this.depList, 0)
          this.depShowList = this.depList
          this.formatDep(this.depShowList)
          this.filterName = this.depList[0].name
          this.tableData = res.data.organize
        }
      })
    },
    formatLevel(data, level) {
      data.forEach(e => {
        if (e.child) {
          e.level = level + 1
        }
        if (e.child.length > 0 && this.num < 4) {
          this.num++
          this.formatLevel(e.child, e.level)
        } else {
          this.num = 0
        }
      })
    },
    formatDep(data) {
      data.forEach(e => {
        if (e.level < 4) {
          e.children = e.child
        }
        if (e.child.length > 0 && this.levelnum < 3) {
          this.levelnum++
          this.formatDep(e.child)
        } else {
          this.levelnum = 1
        }
      })
    },
    append(event) {
      console.log(event, '11111')
      this.depForm = {
        id: '',
        name: '',
        parentid: event.id,
        desc: ''
      }
      this.modelShow = true
      this.modelType = 'new'
      console.log(this.depForm)
      // this.depForm.parentid = event.id
      // this.filterName = event.name
      this.modelTitle = '添加下级'
      console.log(this.filterName)
    },
    edit(event) {
      this.modelType = 'edit'
      this.idList = []
      this.depForm = {
        ...event
      }
      if (event.parentid === '0') {
        this.filterName = ''
        this.fifterId = this.depList[0].id
      } else {
        this.filterName = event.name
        this.fifterId = event.parentid
      }
      this.modelShow = true
      this.modelTitle = '编辑部门'
    },
    // 校验部门能否为父级部门
    // checkParent(event) {
    //   // 本身不能作为上级
    //   for (let i = 0; i < event.length; i++) {
    //     event[i].id = parseInt(event[i].id)
    //     if (event[i].child.length > 0) {
    //       this.checkParent(event[i].child[0])
    //     } else {
    //       console.log(this.idList)
    //     }
    //   }
    // },
    // 拖拽
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log(draggingNode.data)
      console.log(dropNode.data)
      const changeDep = draggingNode.data
      const parentid = dropNode.data.id
      const that = this
      this.depForm = {
        id: changeDep.id,
        name: changeDep.name,
        parentid: parentid,
        desc: changeDep.desc
      }
      updateDep(this.depForm).then(res => {
        if (res.code === 200 || res.code === '200') {
          that.$message({
            message: '部门移动成功',
            type: 'success'
          })

          that.getList()
        }
      })
    },
    allowDrag(draggingNode, dropNode) {
      // console.log(draggingNode)
      // console.log(dropNode)
      return true
    },
    // 禁用
    banTree(event, status) {
      let msg = ''
      if (status === 2) {
        msg = '禁用该部门后，部门里的员工无法使用该系统，确定禁用吗？'
      } else {
        msg = '确定启用该部门吗？'
      }
      const that = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeDep(event.id, status).then(res => {
          if (res.code === 200 || res.data === '200') {
            that.$message({
              type: 'success',
              message: '状态更新成功!'
            })
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
    // 作废
    remove(node, data) {
      const that = this
      this.$confirm('作废该部门会影响到使用该部门的地方，确定作废吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDep(data.id).then(res => {
          if (res.code === 200 || res.data === '200') {
            that.$message({
              type: 'success',
              message: '作废成功!'
            })
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
    // 创建顶级部门
    addTopDep() {
      this.modelShow = true
      this.modelTitle = '添加部门'
      this.modelType = 'new'
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 显示部门列表
    showTree(id) {
      // document.getElementById('focusInput').focus()
      this.fifterTree = true
      this.$refs.deptree.setCurrentKey(id)
    },
    // 隐藏部门列表
    hiddenTree() {
      if (this.filterName !== '') {
        this.fifterTree = false
      }
    },
    // 选择部门
    choseDep(val, status) {
      console.log(val)
      console.log(status)
      // console.log(this.fifterId)
      // // 判断此部门能否被选择为上级部门
      // console.log(this.idList)
      // const flag = this.idList.includes(val.id)
      // console.log(flag)
      // if (flag) {
      //   this.$message({
      //     message: '警告，不能选择此部门为上级部门',
      //     type: 'warning'
      //   })
      // } else {
      this.depForm.parentid = val.id
      this.filterName = val.name
      this.filterText = ''
      this.fifterTree = false
      // }
    },
    saveModel() {
      const that = this
      this.$refs['depForm'].validate((valid) => {
        if (valid) {
          that.submitting = true
          console.log(that.depForm, 'sdad')
          if (that.depForm.id !== '') {
            updateDep(that.depForm).then(res => {
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '部门修改成功',
                  type: 'success'
                })
                that.getList()
                that.resetModel()
                that.modelShow = false
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          } else {
            addDep(that.depForm).then(res => {
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '部门新增成功',
                  type: 'success'
                })
                that.resetModel()
                that.modelShow = false
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
      const that = this
      console.log('重置表单')
      that.$refs['depForm'].resetFields()
      that.depForm = {
        id: '',
        name: '',
        parentid: 0,
        desc: ''
      }
      // that.fifterTree = false
    },
    resetModel1() {
      const that = this
      console.log('重置表单')
      that.$refs['depForm'].resetFields()
      that.depForm = {
        id: '',
        name: '',
        parentid: 0,
        desc: ''
      }
      that.modelShow = false
    }
  }

}

</script>
<style lang="less" scoped>
  .department_bg {
    // background: #fff;
    // padding: 0 10px;
    position: absolute;
    width: 100%;
    top: 0;
    .dep_info {
      background: #fff;
      padding: 20px 10px;
      position: relative;
      margin-top: 10px;
      .dep_info_xian{
          width: 1px;
          background: #ebeef5;
          top: 20px;
          bottom: 20px;
          left: 50%;
          position: absolute;
          z-index: 99;
          overflow: hidden;
      }
      .dep_title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
          padding-left: 140px;
          border: 1px solid #ebeef5;
          background: #f9fafc;
        span {
          width: 30%;
          text-align: left;
          font-family: '微软雅黑 Bold', '微软雅黑';
          font-weight: 700;
          font-style: normal;
          color: #666666;
          font-size: 16px;
        }

        .solt{
          width: 28%;
        }
      }
      /deep/ .el-tree.dep_tree.tree_height.el-tree--highlight-current{
        border: 1px solid #ebeef5;
        border-top: 0;
        height: calc( 100vh - 250px );
        overflow-y: scroll;
      }
      .dep_tree {
        padding: 20px 0;
        padding-left: 60px;
        // margin-right: 140px;

        .custom-tree-node {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          // flex: 1;
          // padding-right: 80px;

          .dep_font {
            font-family: '微软雅黑 Regular', '微软雅黑';
            font-weight: 400;
            font-style: normal;
            color: #666666;
            font-size: 14px;
            display: inline-block;
          }
        }

        .dep_name {
          width: 38%;
          line-height: 32px;
        }

        .dep_btn {
          width: 300px;
          text-align: left;
          display: inline-block;
        }

      }
    }

    .dialogModel {
      .model_layer {
      width: 100%;
      height: calc(100% - 60px);
      background: transparent;
      position: absolute;
      left: 0;
      top: 60px;
      z-index: 100;
      }

      .modelForm {
        // margin: 0 10px;

        .checkDep {
          position: relative;

          .red_star {
            position: absolute;
            left: -90px;
            font-size: 13px;
            font-family: "Arial Normal", "Arial";
            color: #f56c6c;
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

          .text_placeholder {
            color: #c0c4cc;
          }
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
  }

</style>
