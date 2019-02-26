<template class="back">
  <div>
    <H2>患者概況(Episode Summary)</H2>
    <table style="width:80%">
      <tr>
        <th width="15%">病歷號 / 住院序號</th>
        <th width="15%">姓名</th>
        <th width="10%">性別 / 年齢</th>
        <th width="10%">目前床號</th>
        <th width="50%">入院診斷</th>
      </tr>
      <tr>
        <td align="center">{{patientInfo.chartNo}} / {{patientInfo.serno}}</td>
        <td align="center">{{patientInfo.ptName}}</td>
        <td align="center">{{patientInfo.sex}} / {{patientInfo.age}}</td>
        <td align="center">{{patientInfo.bedNo}}</td>
        <td align="center">{{patientInfo.diagnosisF}}</td>

      </tr>

    </table>
  </div>


</template>

<script>
    export default {
      name: "EpisodeSummary",
      computed: {
        patientInfo() {
          return this.$store.state.patientInfo;
        }
      }
    }
</script>

<style scoped>
  table, th, td {
    border: 1px solid black;
  }
  .back {
    background-color:rgba(0, 0, 0, 0.2);
    background-size: cover;
  }
</style>
