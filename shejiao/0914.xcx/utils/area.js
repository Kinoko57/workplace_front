var AreaJson = getApp().globalData.areaJson
console.log(getApp().globalData.areaJson,"是被")
function setArea(data){
  AreaJson = data

}

/**
 * 获取所有省份
 */
function getProvinces() {
  var provinces = [];
  for (var i = 0; i < AreaJson.length; i++) {
    provinces.push({ name: AreaJson[i].local_name,id:AreaJson[i].id});
  }
  return provinces;
}

/**
 * 获取省对应的所有城市
 */
function getCitys(provinceIndex) {
  var citys = [];
  if (AreaJson.length>0){
    for (var i = 0; i < AreaJson[provinceIndex].child.length; i++) {
      citys.push({ name: AreaJson[provinceIndex].child[i].local_name, id: AreaJson[provinceIndex].child[i].id });
    }
    return citys;
  }

}

/**
 * 获取省市对应的所有地区
 */
function getAreas(provinceIndex, cityIndex) {
  var areas = [];
  if (AreaJson.length > 0){
    areas = AreaJson[provinceIndex].child[cityIndex].child;
    return areas;
  }
}
/** 
 *  根据省市区获取对应的index
 * */
function getIndex(areaArr) {
  console.log(areaArr,"areaArr")
  for (var i = 0; i < AreaJson.length; i++) {
    if (areaArr[0].name == AreaJson[i].local_name) {
      for (var j = 0; j < AreaJson[i].child.length; j++) {
        if (areaArr[1].name == AreaJson[i].child[j].local_name) {
          for (var k = 0; k < AreaJson[i].child[j].child.length; k++) {
            if (areaArr[2].local_name == AreaJson[i].child[j].child[k].local_name) {
              console.log([i, j, k],"[i, j, k]")
              return [i, j, k]
            }
          }
        }
      }
    }
  }
}
module.exports = {
  setArea: setArea,
  getProvinces: getProvinces,
  getCitys: getCitys,
  getAreas: getAreas,
  getIndex: getIndex
}



