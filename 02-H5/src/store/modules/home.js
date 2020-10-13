/**
 * home.js
 * 用于home模块的状态管理
 */
/* eslint-disable */
import * as types from '../mutation-type'  // 引入定义的方法
const home = {
  state: {
    number: 1,
    carnum: 0,
    carpro:[],
    carAmount:0.00,
    carShip:0.00,
    carDifference:0.00,
    carScore:0,
    isbind: false,
    score: 0,
    news:false,
    newsnum:0,
    issign:false,
    userInfo:{},
    searchData:[],
    choseAddr:{},
    footNum:0,
    footList:[],
    signData:{},
    scanId:'',
    invite_id: 0,
    is_member:false,
    is_share: 0,
    is_first: 0,
    routeLeft:false,
    routeRight:false
  },
  mutations: {
    [types.SET_NUM](state, num) {   // 修改state 可通过mapMutations调用
      state.number = num
    },
    [types.SET_CARNUM](state, num) {   
      state.carnum = num
    },
    [types.SET_CARPRO](state, num) {   
      state.carpro = num
    },
    [types.SET_CARAMOUNT](state, num) {   
      state.carAmount = num
    },
    [types.SET_CARSHIP](state, num) {   
      state.carShip = num
    },
    [types.SET_CARDIFFERENCE](state, num) {   
      state.carDifference = num
    },
    [types.SET_CARSCORE](state, num) {   
      state.carScore = num
    },
    [types.SET_ISBIND](state, num) {   
      state.isbind = num
    },
    [types.SET_SCORE](state, num) {   
      state.score = num
    },
    [types.SET_INVITER](state, num) {   
      state.invite_id = num
    },
    [types.SET_MEMBER](state, num) {   
      state.is_member = num
    },
    [types.SET_SHARE](state, num) {   
      state.is_share = num
    },
    [types.SET_NEWS](state, num) {   
      state.news = num
    },
    [types.SET_NEWSNUM](state, num) {   
      state.newsnum = num
    },
    [types.SET_ISSIGN](state, num) {   
      state.issign = num
    },
    [types.SET_USERINFO](state, num) {   
      state.userInfo = num
    },
    [types.SET_SEARCHDATA](state, num) {   
      state.searchData = num
    },
    [types.SET_CHOSEADDR](state, num) {   
      state.choseAddr = num
    },
    [types.SET_FOOTNUM](state, num) {   
      state.footNum = num
    },
    [types.SET_FOOTLIST](state, num) {   
      state.footList = num
    },
    [types.SET_SIGNDATA](state, num) {   
      state.signData = num
    },
    [types.SET_SCANID](state, num) {   
      state.scanId = num
    },
    [types.SET_ROUTELEFT](state, num) {   
      state.routeLeft = num
    },
    [types.SET_ROUTERIGHT](state, num) {   
      state.routeRight = num
    },
    [types.SET_FIRST](state, num) {   // 修改state 可通过mapMutations调用
      state.is_first = num
    },
  },
  actions: {},
  getters: {            // 定义getters，可以通过mapGetters拓展函数调用
    number: state => {
      return state.number
    },
    carnum: state => {
      return state.carnum
    },
    carpro: state => {
      return state.carpro
    },
    carAmount:state => {
      return state.carAmount
    },
    carScore:state => {
      return state.carScore
    },
    isbind: state => {
      return state.isbind
    },
    score: state => {
      return state.score
    },
    invite_id: state => {
      return state.invite_id
    },
    is_member: state => {
      return state.is_member
    },
    is_share: state => {
      return state.is_share
    },
    is_first:state=>{
      return state.is_first
    },
    news: state => {
      return state.news
    },
    newsnum: state => {
      return state.newsnum
    },
    issign: state => {
      return state.issign
    },
    userInfo:state => {
      return state.userInfo
    },
    searchData:state => {
      return state.searchData
    },
    choseAddr:state => {
      return state.choseAddr
    },
    footNum:state => {
      return state.footNum
    },
    footList:state => {
      return state.footList
    },
    signData:state => {
      return state.signData
    },
    scanId:state => {
      return state.scanId
    },
    routeLeft:state => {
      return state.routeLeft
    },
    routeRight:state => {
      return state.routeRight
    }
  }
}
export default home    // 输出home模块
