<template>
  <!-- <div id="app">
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view class="view"></router-view>
    </transition>
    <img src="../../assets/images/house-cover-error.png" id="ErrorImg" alt="" style="display:none">
  </div> -->
  <div id="app">
    <el-header height="52px">
      <myHeader></myHeader>
    </el-header>
    <!-- el-main -->
    <div class="main-view">
      <router-view></router-view>
    </div>
    <myFooter></myFooter>
  </div>
</template>
<script>
import Vue from 'vue'
// import VueCookie from 'vue-cookie'
import {
  Container, Header, Aside, Main, Row, Col,
  Loading, Icon,
  Button, ButtonGroup, Input,
  Menu, MenuItem, Submenu,
  Dropdown, DropdownMenu, DropdownItem,
  Form, FormItem, Checkbox, CheckboxGroup, Radio, RadioGroup, DatePicker, Select, Option, Switch,
  Breadcrumb, BreadcrumbItem,
  Table, TableColumn, Pagination, Avatar,
  Tabs, TabPane,
  Alert, Tooltip, Popover,
  Upload,
  Tag, Divider, Autocomplete,
  Image, Drawer,
  Message, MessageBox, Dialog, Popconfirm,
} from 'element-ui'

// import 'element-ui/lib/theme-chalk/index.css'
import { mapState } from 'vuex'
import myHeader from '@/components/common/header'
import myFooter from '@/components/common/footer'
// import './element-variables.scss'

Vue
  .use(Container).use(Header).use(Aside).use(Main).use(Row).use(Col)
  .use(Loading).use(Icon)
  .use(Button).use(ButtonGroup).use(Input)
  .use(Menu).use(MenuItem).use(Submenu)
  .use(Dropdown).use(DropdownMenu).use(DropdownItem)
  .use(Form).use(FormItem).use(Checkbox).use(CheckboxGroup).use(Radio).use(RadioGroup).use(DatePicker).use(Select).use(Option).use(Switch)
  // .use(InputNumber)
  .use(Breadcrumb).use(BreadcrumbItem)
  .use(Table).use(TableColumn).use(Pagination).use(Avatar)
  .use(Tabs).use(TabPane)
  .use(Alert).use(Tooltip).use(Popover)
  .use(Upload)
  .use(Tag).use(Divider).use(Autocomplete)
  .use(Image).use(Drawer)
  .use(Dialog).use(Popconfirm)
  // .use(VueCookie)
Vue.prototype.$message = Message
// Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$loading = Loading.service
Vue.prototype.$confirm = MessageBox.confirm

export default {
  name: 'App',
  components: { myHeader, myFooter, },
  computed: {
    ...mapState({
      listCity: state => state.listCity,
    }),
  },
  methods: {
  },
}
</script>

<style lang="scss" src="./common.scss"></style>
