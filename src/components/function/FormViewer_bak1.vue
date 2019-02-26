<template>
  <span v-html="phtml"></span>
</template>

<script>
    export default {
        name: "FormViewer",
        data() {
          return {
            phtml: ""
          }
        },
        created: function () {
          let url = "http://172.16.2.33:8080/iFormSys/form-template/AD00_v100.html";
          this.$http.get(url)
            .then(response =>{
                this.phtml = response.data;
            })
            .catch(error =>  {
              console.log("Login: error : " + error);
            });
        }
    }
</script>

<style scoped>

</style>
