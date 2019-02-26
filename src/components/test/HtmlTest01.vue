<template>
  <frameset cols="20%,80%" >
    <frame  src="http://www.pchome.com.tw">
    <frame src="http://172.16.2.33:8080/iFormSys/form-template/AD002_v100.html">
  </frameset>

</template>

<script>
    export default {
        name: "HtmlTest01",
        data(){
          return {
            phtml:''
          }
        },
        created: function () {
        }
    }
</script>

<style scoped>

</style>
