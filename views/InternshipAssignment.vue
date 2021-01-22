<template>
  <section class="internship-assignment">
    <!-- <h1>Welkom, Recruitment medewerker!</h1> -->
      
      <b-row class="dashboard-row">
        <b-col cols="12" sm="12" md="12" lg="12" xl="6">
          <jochem-dashboard-tasks></jochem-dashboard-tasks>
        </b-col>

        <b-col cols="12" sm="12" md="12" lg="12" xl="6">
          <jochem-dashboard-shifts></jochem-dashboard-shifts>
        </b-col>
      </b-row>
      

  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import JochemDashboardTasks from '@/components/JochemInternship/JochemDashboardTasks.vue';
// import JochemDashboardInvoices from '@/components/JochemInternship/JochemDashboardInvoices.vue';
import JochemDashboardShifts from '@/components/JochemInternship/JochemDashboardShifts.vue';


@Component({
  name: 'internship-assignment',
  components: {
    JochemDashboardTasks,
    JochemDashboardShifts
  },
})

export default class InternshipAssignment extends Vue {

}
</script>

<style lang="scss">

  th {
    cursor: pointer;
    border-bottom: 2px solid #004d9d;
    min-width: 50px;
  }

  .column-active {
    font-weight: 800;
    color: #004d9d;
  }
</style>
