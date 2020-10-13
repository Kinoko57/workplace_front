<template>
  <div v-if="!item.hidden&&item.children" class="menu-wrapper">
    <router-link v-if="getFirstChild(item.children)" :to="resolvePath(onlyOneChild.path)">
      <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
        <!-- <svg-icon v-if="onlyOneChild.meta&&onlyOneChild.meta.icon" :icon-class="onlyOneChild.meta.icon"/> -->
        <span v-if="onlyOneChild.meta&&onlyOneChild.meta.top_title" slot="title">{{ onlyOneChild.meta.top_title }}</span>
      </el-menu-item>
    </router-link>

    <!-- <el-submenu v-else :index="item.name||item.path">
      <template slot="title">
        <span v-if="item.meta&&item.meta.top_title" slot="title">{{ item.meta.top_title }}</span>
      </template>

      <template v-for="child in item.children">
        <sidebar-item v-if="child.children&&child.children.length>0" :is-nest="true" :item="child" :key="child.path" :base-path="resolvePath(child.path)" class="nest-menu"/>

        <router-link v-else :to="resolvePath(child.path)" :key="child.name">
          <el-menu-item :index="resolvePath(child.path)" >
            <span v-if="child.meta&&child.meta.top_title" slot="title">{{ child.meta.top_title }}</span>
          </el-menu-item>
        </router-link>
      </template>
    </el-submenu> -->

  </div>
</template>

<script>
import path from 'path'

export default {
  name: 'SidebarItem',
  props: {
    // route配置json
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: {
        path: ''
      }
    }
  },
  methods: {
    getFirstChild(children) {
      let flag = true
      children.filter(item => {
        if (children.hidden) {
          return false
        } else {
          if (children.length > 1) {
            if (item.meta.top_title != undefined && item.hidden == false) {
              if (flag) {
                this.onlyOneChild = item
                flag = false
              }
            }
          } else {
            if (flag) {
              this.onlyOneChild = item
              flag = false
            }
          }
          return true
        }
      })
      return true
    },
    hasOneShowingChild(children) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          this.onlyOneChild = item
          return true
        }
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    },
    resolvePath(...paths) {
      return path.resolve(this.basePath, ...paths)
    }
  }

}
</script>
