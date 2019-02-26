import Vue from "vue"

/*西元年轉民國年
  in : adDate 西元年(ISO Dates (Date-Time)格式) 2018-07-12T16:00:00Z[UTC]
  return : YYY/MM/DD
*/
  Vue.filter('Filter_Date_AD2ROC', function(adDate) {
    let aryDate = adDate.split("-");
    let YYY = aryDate[0] - 1911;
    let MM = aryDate[1];
    let tDD = aryDate[2].split("T");
    let DD = tDD[0];
    return YYY + "/" + MM + "/" + DD;
  }),


  /*
   輸入字元轉大寫
   in: 輸入字元
   return:大寫字元
   */
   Vue.filter('Upper', function (value) {
       return value.toUpperCase();
   })
