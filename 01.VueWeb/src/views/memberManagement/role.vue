<template>
  <div>
    <router-view />
    <div v-if="isShow" class="roleartment_bg">
      <!-- <div class="fifter">
        <search-fifter :add="btnPermission('group_create')" :add-text="'创建角色'" @addAction="addToprole" />
      </div> -->
      <my-tabs
        :active-name="'all'"
        :allow-fifter="false"
        :tabs-list="typeList"
      />
      <div class="role_info">
        <div v-if="roleList.length>0" class="dep_info_xian_left"/>
        <div v-if="roleList.length>0" class="dep_info_xian_right"/>
        <!-- <el-tabs type="card" class="oneTab">
          <el-tab-pane label="全部部门"> -->
        <div class="role_title">
          <span>角色名称</span>
          <span>所属部门</span>
          <span>操作</span>
        </div>
        <el-tree
          :data="roleList"
          :props="defaultProps"
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          :default-expanded-keys="openArr"
          :indent="30"
          class="role_tree tree_height"
          node-key="id"
          accordion
          draggable
          @node-expand="openNode"
          @node-drop="handleDrop">
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span class="role_font role_name">
              {{ node.label }}
            </span>
            <!-- -->
            <span :style="{paddingLeft:data.level*15+'px'}" class="role_font role_dep">{{ data.organize_name }}</span>
            <!-- :style="{paddingLeft:data.level*30+'px'}" -->
            <span class="role_btn">
              <el-button v-if="btnPermission('group_managepriv')" type="text" size="mini" @click="() => set(data)">
                设置权限
              </el-button>
              <el-button v-if="btnPermission('group_edit')" type="text" size="mini" @click="() => edit(data)">
                编辑
              </el-button>
              <el-button v-if="btnPermission('group_create')&&data.level==1" type="text" size="mini" @click="() => append(data)">
                添加下级
              </el-button>
              <!-- <el-button
                    type="text"
                    size="mini"
                    @click="() => banTree(data)">
                    禁用
                  </el-button> -->
              <el-button
                v-if="btnPermission('group_delete') && data.level != 1"
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
        @close="resetModel">
        <!-- 新建/编辑角色 -->
        <div v-show="depTree||roleTree" class="model_layer" @click="hiddenTree" />
        <el-scrollbar class="fixed_scroll">
          <el-form
            v-if="modelType=='new'&&modelShow"
            ref="roleForm"
            :model="roleForm"
            :rules="rules"
            class="modelForm center"
            label-width="100px"
            label-position="right">
            <el-form-item label="角色名称：" prop="name">
              <el-input v-model.trim="roleForm.name" autocomplete="off" placeholder="请输入角色名称" style="width:500px" />
              <!-- <el-checkbox
                  v-show="modelType=='new'"
                  v-model="type"
                  true-label="1"
                  false-label="0"
                  style="display: block; margin-bottom: -10px;"
                  @change="choseRoleType">管理岗角色</el-checkbox> -->
            </el-form-item>
            <el-form-item class="marTop" >
              <el-checkbox
                v-show="modelType=='new'"
                v-model="type"
                true-label="1"
                false-label="0"
                style="display: block; margin-bottom: -10px;"
                @change="choseRoleType">管理岗角色</el-checkbox>
            </el-form-item>
            <!-- <el-form-item label="所属部门：" class="checkDep">
                <i class="red_star">*</i>
                <div class="fifter_tree" style="width:300px">
                  <div class="fifter_down">
                    <div class="chose_dep" @click="showDepTree">
                      <span v-if="depName==''" class="text_placeholder">请选择上级部门</span>
                      <span>{{ depName }}</span>
                      <div>
                        <i v-show="!depTree" slot="suffix" class="el-input__icon el-icon-arrow-down" @click="showDepTree" />
                        <i v-show="depTree" slot="suffix" class="el-input__icon el-icon-arrow-up" @click="depTree=false" />
                      </div>
                    </div>
                  </div>
                  <transition name="slide-fade">
                    <div v-show="depTree" class="scroll_tree">
                      <el-input
                        v-model="depText"
                        placeholder="模糊查询部门"
                        class="fifter_input"
                        style="width:360px"
                        @focus="showDepTree" />
                      <div class="fifter_up dep_tree dep_tree_fifter">
                        <el-tree
                          ref="deptree"
                          :data="depList"
                          :props="defaultProps"
                          :filter-node-method="filterDepNode"
                          :expand-on-click-node="true"
                          :highlight-current="true"
                          node-key="id"
                          default-expand-all
                          class="filter-tree"
                          @node-click="choseDep"
                          @node-expand="depTree=true"
                          @node-collapse="depTree=true" />
                      </div>
                    </div>
                  </transition>
                </div>
              </el-form-item> -->
            <!-- <el-form-item label="上级角色：" class="checkDep">
                <i class="red_star">*</i>
                <div class="fifter_tree" style="width:300px">
                  <div class="fifter_down">
                    <div class="chose_dep" @click="showRoleTree">
                      <span v-if="roleName==''" class="text_placeholder">请选择上级角色</span>
                      <span>{{ roleName }}</span>
                      <div>
                        <i v-show="!roleTree" slot="suffix" class="el-input__icon el-icon-arrow-down" @click="showRoleTree" />
                        <i v-show="roleTree" slot="suffix" class="el-input__icon el-icon-arrow-up" @click="roleTree=false" />
                      </div>
                    </div>
                  </div>
                  <transition name="slide-fade">
                    <div v-show="roleTree" class="scroll_tree">
                      <el-input
                        v-model="roleText"
                        placeholder="模糊查询角色"
                        class="fifter_input"
                        style="width:360px"
                        @focus="showRoleTree" />
                      <div class="fifter_up dep_tree dep_tree_fifter">
                        <el-tree
                          ref="roletree"
                          :data="roleDepList"
                          :props="defaultProps"
                          :filter-node-method="filterRoleNode"
                          :expand-on-click-node="true"
                          :highlight-current="true"
                          node-key="id"
                          default-expand-all
                          class="filter-tree"
                          @node-click="choseRole"
                          @node-expand="roleTree=true"
                          @node-collapse="roleTree=true" />
                      </div>
                    </div>
                  </transition>
                </div>
              </el-form-item> -->
            <el-form-item label="简介：">
              <el-input
                :rows="4"
                v-model.trim="roleForm.desc"
                type="textarea"
                style="width:500px"
                placeholder="请输入内容,最大长度为120个字"
                maxlength="120" />
            </el-form-item>
          </el-form>
          <el-form
            v-if="modelType=='edit'&&modelShow"
            ref="roleEditForm"
            :model="roleEditForm"
            :rules="rulesEdit"
            class="modelForm center"
            label-width="100px"
            label-position="right">
            <el-form-item label="角色名称：" prop="name">
              <el-input v-model="roleEditForm.name" autocomplete="off" placeholder="请输入角色名称" style="width:500px" />
              <!-- <el-checkbox
                  v-show="modelType=='new' || showLevel =='2'"
                  v-model="type"
                  true-label="1"
                  false-label="0"
                  style="display: block; margin-bottom: -10px;"
                  @change="choseRoleType">管理岗角色</el-checkbox> -->
              <!-- <el-radio-group v-model="roleEditForm.type">
                  <el-radio label="2">组织主要负责角色</el-radio>
                  <el-radio label="1">组织次要负责角色 </el-radio>
                  <el-radio label="0">成员角色 </el-radio>
                </el-radio-group> -->
            </el-form-item>
            <el-form-item class="marTop">
              <el-checkbox
                v-show="modelType=='new' || showLevel =='2'"
                v-model="type"
                true-label="1"
                false-label="0"
                style="display: block; margin-bottom: -10px;"
                @change="choseRoleType">管理岗角色</el-checkbox>
            </el-form-item>
            <el-form-item label="简介：">
              <el-input
                :rows="4"
                v-model="roleEditForm.desc"
                type="textarea"
                style="width:500px"
                placeholder="请输入简介,最大长度为120个字"
                maxlength="120" />
            </el-form-item>
          </el-form>
        </el-scrollbar>
        <div slot="footer" class="dialog-footer">
          <el-button v-if="modelType=='new'" @click="resetForm">重 置</el-button>
          <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  addRole,
  updateRole,
  getDepChoseList,
  delRole,
  changeRole
} from '@/api/system'
  // const id = 1000
export default {
  name: 'RoleManage',
  data() {
    // var checkDept = (rule, value, callback) => {
    //   console.log(!this.depName)
    //   if (this.depName === '') {
    //     return callback(new Error('请选择部门'))
    //   } else {
    //     callback()
    //   }
    // }
    var checkRole = (rule, value, callback) => {
      if (this.roleName === '') {
        return callback(new Error('请选择角色'))
      } else {
        callback()
      }
    }
    return {
      typeList: [
        { label: '全部部门', name: 'all' }
      ],
      isShow: true,
      tableData: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      openId: 0,
      openArr: [],
      roleList: [],
      roleDepList: [],
      depList: [],
      modelShow: false,
      modelTitle: '',
      modelType: 'new',
      depTree: false,
      roleTree: false,
      depText: '',
      // depName: '',
      depId: 0,
      roleText: '',
      roleName: '',
      type: false,
      roleForm: {
        name: '',
        type: 0,
        organize_id: '',
        parentid: 0,
        desc: ''
      },
      submitting: false,
      showLevel: 0,
      rules: {
        name: [{
          required: true,
          message: '角色名称不能为空',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 20,
          message: '角色名称长度在2-20位',
          trigger: 'blur'
        }],
        // depName: [{
        //   validator: checkDept,
        //   trigger: 'change'
        // }],
        roleName: [{
          validator: checkRole,
          trigger: 'change'
        }]
      },
      roleEditForm: {
        id: '',
        name: '',
        type: 0,
        desc: ''
      },
      rulesEdit: {
        name: [{
          required: true,
          message: '角色名称不能为空',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 20,
          message: '角色名称长度在2-20位',
          trigger: 'blur'
        }]
      },
      num: 0
    }
  },
  watch: {
    depText(val) {
      if (this.modelShow) {
        console.log(this.$refs)
        this.$refs.deptree.filter(val)
      }
    },
    roleText(val) {
      if (this.modelShow) {
        this.$refs.roletree.filter(val)
      }
    }
  },
  created() {

  },
  mounted() {
    if (this.$route.name === 'Set') {
      this.isShow = false
    }
    if (this.isShow) {
      // 获取角色列表和部门列表
      this.getList()
    }
  },
  methods: {
    getList() {
      const that = this
      getRoleList().then(res => {
        console.log(res)
        if (res.code === 200 || res.code === '200') {
          that.roleList = JSON.parse(JSON.stringify(res.data.groups))
          this.formatLevel(this.roleList, 0)
          console.log(that.roleList)
          that.roleDepList = JSON.parse(JSON.stringify(res.data.groups))
          this.roleName = this.roleDepList[0].name
          if (that.openId !== 0) {
            that.openArr = []
            that.openArr.push(that.openId)
          }
        }
      })
      getDepChoseList().then(res => {
        console.log(res)
        if (res.code === 200 || res.code === '200') {
          that.depList = JSON.parse(JSON.stringify(res.data.organize))
          // this.depName = this.depList[0].name
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
    append(event) {
      this.modelShow = true
      if (event.organize_id === undefined) {
        this.roleForm.organize_id = this.depList[0].id
        this.roleForm.organize_name = this.depList[0].name
      } else {
        this.roleForm.organize_id = event.organize_id
      }
      this.roleForm.parentid = event.id
      this.roleForm.parent_name = this.roleDepList[0].name
      if (event.organize_name !== undefined) {
        // this.depName = event.organize_name
      }
      // } else {
      //   // this.depName = this.depList[0].name
      // }
      this.type = false
      this.roleName = event.name
      this.modelType = 'new'
      this.modelTitle = '创建角色'
    },
    set(event) {
      this.isShow = false
      this.$router.push({
        path: '/memberManagement/role/set?id=' + event.id + '&name=' + event.name
      })
    },
    edit(event) {
      console.log(event, '2324')
      this.modelType = 'edit'
      this.showLevel = event.level
      this.roleEditForm = {
        ...event
      }
      if (this.roleEditForm.type === '1') {
        this.type = true
      }
      this.modelShow = true
      this.modelTitle = '编辑角色'
    },
    banTree(event) {

    },
    remove(node, data) {
      const that = this
      this.$confirm('作废该角色会影响到使用该角色的地方，确定作废吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRole(data.id).then(res => {
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
    choseRoleType(e) {
      console.log(e)
      this.roleEditForm.type = e
      this.roleForm.type = e
    },
    // 创建顶级部门
    addToprole() {
      // this.roleForm.parentid = 0
      // this.roleForm.parent_name = this.depList[0].name
      // this.roleForm.organize_id = 0
      // this.roleForm.organize_name = this.roleList[0].name
      // this.depName = ''
      this.roleName = ''
      this.modelShow = true
      this.modelType = 'new'
      this.modelTitle = '创建角色'
    },
    openNode(obj, node, event) {
      console.log(obj)
      this.openId = obj.id
    },
    // 拖拽
    allowDrag(draggingNode, dropNode) {
      if (draggingNode.data.id === 0) {
        return false
      } else {
        return true
      }
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.organize_id !== draggingNode.data.organize_id) {
        return false
      } else {
        console.log('允许放置')
        return type === 'inner'
      }
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      this.roleEditForm = {
        ...draggingNode.data
      }
      this.roleEditForm.parentid = dropNode.data.id
      this.roleEditForm.parent_name = dropNode.data.name
      if (this.roleEditForm.type === '1') {
        this.type = true
      }
      const that = this
      updateRole(this.roleEditForm).then(res => {
        if (res.code === 200 || res.code === '200') {
          that.$message({
            message: '角色修改成功',
            type: 'success'
          })
          // that.resetModel()
          that.getList()
        } else {
          that.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    // 过滤
    filterDepNode(value, data) {
      console.log(value)
      console.log(data)
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    filterRoleNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 显示部门列表
    showDepTree() {
      this.depTree = true
      this.roleTree = false
      // this.$refs.deptree.setCurrentKey(id)
    },
    hiddenTree() {
      this.depTree = false
      this.roleTree = false
    },
    // 显示角色列表
    showRoleTree() {
      this.roleTree = true
      this.depTree = false
      // this.$refs.roletree.setCurrentKey(id)
    },
    // 选择部门
    choseDep(val) {
      this.roleForm.organize_id = val.id
      this.roleForm.organize_name = val.name
      // this.depName = val.name
      changeRole(val.id).then(res => {
        if (res.code === 200 || res.code === '200') {
          if (res.data.groups.length > 0) {
            this.roleDepList = JSON.parse(JSON.stringify(res.data.groups))
            this.roleName = this.roleDepList[0].name
            this.roleForm.parentid = this.roleDepList[0].id
          } else {
            this.roleDepList = []
            this.roleName = '顶级角色'
            this.roleForm.parentid = 0
          }
        }
      })
      this.depTree = false
      this.depText = ''
      this.roleText = ''
    },
    choseRole(val) {
      this.roleForm.parentid = val.id
      this.roleForm.parent_name = val.name
      this.roleName = val.name
      this.roleTree = false
      this.roleText = ''
    },
    saveModel() {
      const that = this
      if (this.modelType === 'new') {
        // if (this.depName === '') {
        //   this.$message.warning('角色不能为空！')
        // } else
        // if (this.roleName === '') {
        //   this.$message.warning('角色不能为空！')
        // } else {
        this.$refs['roleForm'].validate((valid) => {
          if (valid) {
            that.submitting = true
            console.log(that.roleForm)
            addRole(that.roleForm).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '角色新增成功',
                  type: 'success'
                })
                that.submitting = false
                that.resetModel()
                that.getList()
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
                that.submitting = false
              }
            })
          } else {
            console.log('error submit!!')
              // this.$message.warning('信息填写不完整或者信息填写有误！')
            this.$nextTick(() => {
              this.checkFormErr()
            })
            return false
          }
        })
        // }
      } else {
        this.$refs['roleEditForm'].validate((valid) => {
          if (valid) {
            that.submitting = true
            updateRole(that.roleEditForm).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '角色修改成功',
                  type: 'success'
                })
                that.submitting = false
                that.resetModel()
                that.getList()
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
                that.submitting = false
              }
            })
          } else {
            console.log('error submit!!')
              // this.$message.warning('信息填写不完整或者信息填写有误！')
            this.$nextTick(() => {
              this.checkFormErr()
            })
            return false
          }
        })
      }
    },
    resetModel() {
      console.log('重置表单')
      if (this.modelType === 'edit') {
        this.$refs['roleEditForm'].resetFields()
        this.roleEditForm = {
          id: '',
          name: '',
          type: 0,
          desc: ''
        }
      } else {
        this.$refs['roleForm'].resetFields()
        this.roleForm = {
          name: '',
          type: 0,
          organize_id: '',
          parentid: 0,
          desc: ''
        }
      }
      // this.depName = ''
      this.roleName = ''
      // this.depName = ''
      this.roleText = ''
      this.modelShow = false
      this.depTree = false
      this.roleTree = false
      this.type = 0
    },
    resetForm() {
      console.log('重置表单')
      if (this.modelType === 'edit') {
        this.$refs['roleEditForm'].resetFields()
        this.roleEditForm = {
          id: '',
          name: '',
          type: 0,
          desc: ''
        }
      } else {
        this.$refs['roleForm'].resetFields()
        // this.roleForm = {
        //   name: '',
        //   type: 0,
        //   organize_id: '',
        //   parentid: 0,
        //   desc: ''
        // }
        this.roleForm.name = ''
        this.roleForm.type = 0
        // this.roleForm.parentid = 0
        this.roleForm.desc = ''
        console.log(this.roleForm)
      }
      // this.depName = ''
      this.roleName = ''
      // this.depName = ''
      this.roleText = ''
      this.depTree = false
      this.roleTree = false
      this.type = 0
    }
  }
}

</script>
<style lang="less" scoped>
  .roleartment_bg {
    // background: #fff;
    // padding: 0 10px;
    position: absolute;
    width: 100%;
    top: 0;
    .role_info {
      background: #fff;
      padding: 20px 10px;
      position: relative;
      margin-top: 10px;
      .dep_info_xian_left{
          width: 1px;
          background: #ebeef5;
          top: 20px;
          bottom: 20px;
          left: 40%;
          position: absolute;
          z-index: 99;
          overflow: hidden;
      }
      .dep_info_xian_right{
          width: 1px;
          background: #ebeef5;
          top: 20px;
          bottom: 20px;
          left: 70%;
          position: absolute;
          z-index: 99;
          overflow: hidden;
      }
      .role_title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 70px;
        border: 1px solid #ebeef5;
        background: #f9fafc;
        span {
          width: 30%;
          text-align: center;
          font-family: '微软雅黑 Bold', '微软雅黑';
          font-weight: 700;
          font-style: normal;
          color: #666666;
          font-size: 14px;
        }

        span:first-child {
          text-align: center;
        }
      }
      .role_tree {
        border: 1px solid #ebeef5;
        padding: 20px 62px;
        height: calc( 100vh - 250px );
        overflow-y: scroll;
        border-top: none;

        .custom-tree-node {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .role_font {
            font-family: '微软雅黑 Regular', '微软雅黑';
            font-weight: 400;
            font-style: normal;
            color: #666666;
            font-size: 14px;
            display: inline-block;
          }

          .role_name {
            width: 34%;
          }

          .role_dep {
            // width: 30%;
            width: 210px;
          }

          .role_btn {
            // width: 32%;
            width: 200px;
            text-align: left;
            display: inline-block;
          }
        }

      }
    }

    .oneTab{
      margin-top: 10px;
    }

    .marTop{
      margin-top: -10px;
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
            font-family: 'Arial Normal', 'Arial';
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
          .text_placeholder{
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
