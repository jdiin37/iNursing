export default {
  getUrlKey:function(name){
    return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
  },
  /*西元(UTC)年轉民國年YYYMMDD
    in : adDate 西元年(UTC Dates (Date-Time)格式) 2018-07-12T16:00:00Z[UTC]
    return : YYY/MM/DD
    sample : $UtilityJs.AD2ROC_Date(item.createDate)
   */
  AD2ROC_Date:function (adDate) {
    let date = new Date(adDate.replace('[UTC]', '')); //去掉[UTC]
    let YYY = date.getFullYear() - 1911;
    let MM = ("0" + (date.getMonth() + 1)).slice(-2);   //0-11
    let DD = ("0" + date.getDate()).slice(-2);  //1-31
    //console.log("date : " + date);
    return YYY + "/" + MM + "/" + DD;
  },
  /* not test */
  Process_Duplicate:function (val, myArr) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[val]).indexOf(obj[val]) === pos;
    });
  },
  /** 格式化 從Api取得的民國年日期時間
   * @cellValue  日期 / 時間  String
   * */
  formatDateTime:function(cellValue) {
  if(cellValue === undefined || cellValue === null||cellValue=="[object Window]"||cellValue==""||cellValue=="null"){
    return "";

  }else{
    if(cellValue.length==7){
      var y = cellValue.substring(0,3);
      var m = cellValue.substring(3,5);
      var d = cellValue.substring(5,7);
//	   			 console.log(y+"/"+m+"/"+d);
      if(cellValue.startsWith("0")){
        var y = cellValue.substring(1,3); //如果民國年小於 100年 ，去除前面的0
      }
      return y+"/"+m+"/"+d;

    }else if(cellValue.length==6){
      var hh = cellValue.substring(0,2);
      var mm = cellValue.substring(2,4);
      var ss = cellValue.substring(4,6);
//	   			 console.log(hh+":"+mm+":"+ss);
      return hh+":"+mm+":"+ss;

    }else if(cellValue.length==11){ //例:手術輸入日期 10702261546

      var y = cellValue.substring(0,3);
      var m = cellValue.substring(3,5);
      var d = cellValue.substring(5,7);
      if(cellValue.startsWith("0")){
        var y = cellValue.substring(1,3); //如果民國年小於 100年 ，去除前面的0
      }
      var hh = cellValue.substring(7,9);
      var mm = cellValue.substring(9,11);

      return y+"/"+m+"/"+d+"  "+hh+":"+mm;


    }else{
      var hh = cellValue.substring(0,2);
      var mm = cellValue.substring(2,4);
//	   			 console.log(hh+":"+mm);
      return hh+":"+mm;

    }
  }

}

}
