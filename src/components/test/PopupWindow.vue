<template>
  <frameset cols="200,*" >
    <frame src="http://www.pchome.com.tw">
    <frame src="http://172.16.2.33:8080/iFormSys/form-template/AD002_v100.html">
  </frameset>
</template>

<script>
    export default {
        name: "PopupWindow",
        created : function() {
          //window.location.href="http://172.16.2.33:8080/iFormSys/form-template/AD002_v100.html";
        }
    }
</script>

<style scoped>

</style>
