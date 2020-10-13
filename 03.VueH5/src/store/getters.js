const getters = {
  Unread: state => state.app.Unread,
  isLoading: state => state.route.isLoading,
  cancelTokenArr: state => state.app.cancelTokenArr,
}
export default getters
