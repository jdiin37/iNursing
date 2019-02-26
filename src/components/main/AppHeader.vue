<template>

  <v-toolbar color="primary" dark fixed app>
    <v-toolbar-side-icon @click.stop="menu_click"></v-toolbar-side-icon>
    <v-toolbar-title>{{patientInfo.chartNo}}, {{patientInfo.ptName}}, {{patientInfo.sex}} </v-toolbar-title>
    <v-spacer></v-spacer>使用者: <input type="button" @click="logOut" title="登出" :value="loginUser.empName"/>
    <v-text-field prepend-icon="search" label="Search" solo-inverted class="mx-3" flat>
    </v-text-field>
    <v-btn icon  @click.native="PatientList_click" ><v-icon>group</v-icon></v-btn>
  </v-toolbar>

</template>

<script>
    export default {
        name: "Header",
        data() {
          return {
            drawer:'true'
          }
        },
        computed : {
          loginUser() {
            return this.$store.state.loginUser;
          },

          patientInfo() {
              return this.$store.state.patientInfo;
          }
        },
        methods: {
          menu_click: function (event) {
            this.$emit('menu_click', "");
          },
          PatientList_click: function (event) {
            this.$emit('PatientList_click', "");
          },
          logOut: function(){
            this.$emit('Logout','');
          }
        }
    }
</script>

<style scoped>

</style>
