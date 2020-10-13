<template>
  <el-menu
    :show-timeout="200"
    :default-active="activeRoute"
    :collapse="false"
    mode="horizontal"
    background-color="#494949"
    text-color="#fff"
    active-text-color="#fff"
  >
    <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path"/>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  data() {
    return {
      flag: false,
      activeRoute: ''
    }
  },
  computed: {
    ...mapGetters(['permission_routers', 'sidebar']),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    $route(val) {
      this.select(val.path)
    }
  },
  mounted() {
    console.log('顶部导航')
    this.select(this.$route.path)
  },
  methods: {
    select(path) {
      const item = this.routes.find(e => {
        if (e.path === '/') { return }
        return '/' + path.split('/')[1] === e.path
      })
      for (const i in item.children) {
        if (item.children[i].hidden == false) {
          this.activeRoute = item.path + '/' + item.children[i].path
          break
        }
      }
      if (item !== undefined) {
        this.$store.commit('SWITCHMENUBAR', item)
      } else {
        this.$store.commit('SWITCHMENUBAR', { children: [], full: true })
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

