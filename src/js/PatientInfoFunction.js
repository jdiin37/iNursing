export default {

  getPatinpInfo:function(chartNo, serno){
    var patinp = {
      chartNo:'',
      serno:'',
      ptType:'',
      bedNo:'',
      ckinDate:'',
      ckinIcd:'',
      diagnosisF:'',
      vs:'',
      r:'',
      cr:'',
      divNo:'',
      age:''
    };

    // let url = "/iNursingSrv/rest/patinp/" + chartNo + "/" + serno;
    // console.log("getPatinpInfo url=" + url);
    // this.$http.get(url)
    //   .then(response =>{
    //     patinp = response.data.resultSet[0];
    //   })
    //   .catch(error =>  {
    //     console.log("getInpPat: error : " + error);
    //   });

    return patinp;
  }
}
