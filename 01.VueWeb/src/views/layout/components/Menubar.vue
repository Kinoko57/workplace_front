<template>
  <div v-if="!$store.state.user.menubarRouters.full" class="menubar">
    <!-- <div style="width:100%;"> -->
    <div>
      <div style="overflow: hidden;width:100%">
        <div class="top_nav">
          <div class="top_nav_style">
            <svg-icon v-if="$store.state.user.menubarRouters.meta&&$store.state.user.menubarRouters.meta.icon" :icon-class="$store.state.user.menubarRouters.meta.icon"/>
            <span>{{ $store.state.user.menubarRouters.meta.title }}</span>
          </div>
        </div>
        <div class="left_nav">
          <el-menu ref="myMenu" :default-active="defaultActive" :router="true" mode="vertical">
            <template v-for="(val,i) in $store.state.user.menubarRouters.children">
              <!-- <el-submenu v-if="val.children&&val.alwaysShow==false" :index="i.toString()" :key="i">
                  <template slot="title">
                    <span>1{{ val.meta.title }}</span>
                  </template>

                  <template v-for="(child) in val.children">
                    <router-link
                      :to="$store.state.user.menubarRouters.path+'/'+val.path+'/'+child.path"
                      :key="child.name">
                      <el-menu-item
                        :index="$store.state.user.menubarRouters.path+'/'+val.path+'/'+child.path"
                        :data-index="$store.state.user.menubarRouters.path+'/'+val.path+'/'+child.path">
                        <span>2{{ child.meta.name }}</span>
                      </el-menu-item>
                    </router-link>
                  </template>
                </el-submenu> -->
              <el-menu-item
                v-if="val.meta.hidden!=true&&val.hidden!=true"
                :index="$store.state.user.menubarRouters.path + '/' +val.path"
                :key="i"
                :data-index="$store.state.user.menubarRouters.path + '/' +val.path"
                class="menu-item">
                <router-link :to="$store.state.user.menubarRouters.path + '/' +val.path">
                  <span>{{ val.meta.title }}</span>
                </router-link>
              </el-menu-item>
            </template>
          </el-menu>
        </div>

      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: 'Menubar',
  data() {
    return {
      isCollapse: true,
      data: {},
      defaultActive: ''
    }
  },
  watch: {
    defaultActive(newValue, oldValue) {
      console.log(newValue)
      console.log(oldValue)
    },
    $route(to) {
      // this.defaultActive = to.fullPath
      this.$nextTick(() => {
        if (this.$refs.myMenu) {
          console.log('watch')
          console.log(to)
          if (to.meta.parentPath != undefined) {
            this.$refs.myMenu.activeIndex = to.meta.parentPath
          } else {
            this.$refs.myMenu.activeIndex = to.fullPath
          }
          // this.defaultActive = to.fullPath
          // this.$refs.myMenu.activeIndex = to.fullPath
          // console.log(this.defaultActive)
          this.$forceUpdate()
        } else {
          console.log('没拿到？')
        }
      })
    }
  },
  mounted() {
    console.log(this.$route)
    this.$nextTick(() => {
      console.log('mounted')
      console.log(this.$refs.myMenu)
      if (this.$refs.myMenu) {
        // this.$refs.myMenu.activeIndex = this.$route.path
        if (this.$route.meta.parentPath != undefined) {
          this.$refs.myMenu.activeIndex = this.$route.meta.parentPath
        } else {
          this.$refs.myMenu.activeIndex = this.$route.path
        }
        console.log(this.defaultActive)
      }
    })
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .menubar {
    .top_nav {
      font-size: 14px;
      color: #FFFFFF;
      height: 49px;
      background-color: rgba(60, 142, 233, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      .top_nav_style{
        span{
          font-size: 14px;
          color: #FFFFFF;
        }
      }
    }
    .left_nav{
      .el-menu{
        width: 136px;
        margin:  0 auto;
      }
    }
  }

  // .el-menu{
  //   display: flex;
  //   justify-content: center;
  //   background-color: #f0f2f5;
  // }
  // .el-menu-item {
  //   transition: none;
  // }
  // .el-submenu .el-menu-item {
  //   min-width: initial;
  // }
  // /deep/ .el-scrollbar__wrap {
  //   overflow-x: hidden;
  // }

</style>
