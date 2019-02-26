/** 趨勢圖物件
 * @label  標籤  String
 * @data  資料  Array
 * @borderColor  線的顏色 String
 * */
function datasets (label,data,borderColor) {
    this.label = label;
    this.data = data;
    this.borderColor = borderColor;
  }
/** 趨勢圖  顯示兩條線以上與  function datasets ( label,data,borderColor ) 的第二個參數 data  合併使用之
 * @dataLabel  資料 Array
 * */
  function dataLabel(dataLabel){
    this.dataLabel = dataLabel;
  }

/** TPR趨勢圖 顯示 X軸(日期)資料
 * @arrayData  原始物件陣列 (從API取得)
 * */
function renderRecordDateColName(arrayData){
  var colModel = [];

  for(var j=0;j<arrayData.length;j++){
    var date = formatDateTime(arrayData[j].assessDate);
    var time = formatDateTime(arrayData[j].assessTime);
    colModel.push(date+" "+time);
  }
  return colModel;
}

/** 格式化 從Api取得的民國年日期時間
  * @cellValue  日期 / 時間  String
  * */
function formatDateTime(cellValue) {
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
//須將 function 名稱 寫在 export 方可在其他地方 import 使用之
  export {
  datasets,dataLabel,renderRecordDateColName,formatDateTime
  }

//   // 另一種 function 寫法
// /** 格式化 從Api取得的民國年日期時間
//  * @cellValue  日期 / 時間  String
//  * */
//
// export const formatDateTime = (cellValue) =>{
//   if(cellValue === undefined || cellValue === null||cellValue=="[object Window]"||cellValue==""||cellValue=="null"){
//     return "";
//
//   }else{
//     if(cellValue.length==7){
//       var y = cellValue.substring(0,3);
//       var m = cellValue.substring(3,5);
//       var d = cellValue.substring(5,7);
// //	   			 console.log(y+"/"+m+"/"+d);
//       if(cellValue.startsWith("0")){
//         var y = cellValue.substring(1,3); //如果民國年小於 100年 ，去除前面的0
//       }
//       return y+"/"+m+"/"+d;
//
//     }else if(cellValue.length==6){
//       var hh = cellValue.substring(0,2);
//       var mm = cellValue.substring(2,4);
//       var ss = cellValue.substring(4,6);
// //	   			 console.log(hh+":"+mm+":"+ss);
//       return hh+":"+mm+":"+ss;
//
//     }else if(cellValue.length==11){ //例:手術輸入日期 10702261546
//
//       var y = cellValue.substring(0,3);
//       var m = cellValue.substring(3,5);
//       var d = cellValue.substring(5,7);
//       if(cellValue.startsWith("0")){
//         var y = cellValue.substring(1,3); //如果民國年小於 100年 ，去除前面的0
//       }
//       var hh = cellValue.substring(7,9);
//       var mm = cellValue.substring(9,11);
//
//       return y+"/"+m+"/"+d+"  "+hh+":"+mm;
//
//
//     }else{
//       var hh = cellValue.substring(0,2);
//       var mm = cellValue.substring(2,4);
// //	   			 console.log(hh+":"+mm);
//       return hh+":"+mm;
//
//     }
//   }
//
// };

