<template>
  <!-- PatientLits : 使用 dialog 顯示 -->

  <v-dialog v-model="patientListStatus"
            max-width="1200"
            value=false
            scrollable>
    <v-card>
      <iframe>
        <PopupWindow></PopupWindow>
      </iframe>
      <v-card-actions>

        <v-btn color="primary" flat @click.stop="patientListClick">選取</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import PopupWindow from "./PopupWindow"

  export default {
        name: "HtmlTest02",
        data() {
          return {
            patientListStatus:true
          }
        },
      created : function() {

      },
      components:{
        PopupWindow
      },
    }
</script>

<style scoped>

</style>
