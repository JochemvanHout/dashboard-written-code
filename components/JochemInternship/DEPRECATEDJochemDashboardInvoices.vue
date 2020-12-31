<template>
  <page-content :title="'Urenregistraties & Facturen'"
                :class="'dashboard-invoices-wrapper'"
                >

    <p-tabs v-model="tabIndex">

      <p-tab :title="`Urenregistraties (${hourRegistration.length})`">
        <table id="hours-table">
          <tr>
            <th v-on:click="sortData('freelancer', hourRegistration)">ZZP'er</th>
            <th v-on:click="sortData('organisation', hourRegistration)">Organisatie</th>
            <th v-on:click="sortData('date', hourRegistration)">Datum</th>
          </tr>
            <!-- invoices list -->
            <tr v-for="registration in hourRegistration" :key="registration.id" class="registration-entry" @click="redirectToPage(registration)">
              <td>{{registration.freelancer}}</td>
              <td>{{registration.organisation}}</td>
              <td>{{registration.date | sanitizeDate}}</td>
            </tr>
      </table>
      </p-tab>

      <p-tab :title="`Facturen (${invoices.length})`">
        <table id="invoice-table">
          <tr>
            <th v-on:click="sortData('organisation', invoices)">Organisatie</th>
            <th v-on:click="sortData('invoiceNumber', invoices)">Factuur Nummer</th>
            <th v-on:click="sortData('amount', invoices)">Bedrag</th>
            <th v-on:click="sortData('daysTooLate', invoices)">Dagen te laat</th>
          </tr>
            <!-- invoices list -->
            <tr v-for="invoice in invoices" :key="invoice.id" class="invoice-entry" @click="redirectToPage(invoice)">
              <td>{{invoice.organisation}}</td>
              <td>{{invoice.invoiceNumber}}</td>
              <td>€ {{invoice.amount}}</td>
              <td>{{invoice.daysTooLate}}</td>
            </tr>
      </table>
      </p-tab>

    </p-tabs>


  </page-content>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from 'vue-property-decorator';
import Axios from 'axios';

import { Action, Getter, State } from 'vuex-class';
import InternAssignmentMixin from '@/mixins/InternAssignmentMixin';
import PTabs from '@pidz/vue-components/tabs/PTabs.vue';
import PTab from '@pidz/vue-components/tabs/PTab.vue';
import PageContent from '@/components/Content/PageContent.vue';

  interface IInvoice {
    id: number,
    organisation: string,
    invoiceNumber: number,
    amount: number,
    daysTooLate: number
  }

  interface IOpenHourRegistration {
    id: number,
    freelancer: string,
    organisation: string,
    date: Date
  }


  @Component({
    components: {
      PageContent,
      PTab,
      PTabs
    },
  })


export default class JochemDashboardInvoices extends Mixins(InternAssignmentMixin){
  invoices: IInvoice[] = [];
  hourRegistration: IOpenHourRegistration[] = [];

  tabIndex = 0;
  lastSortName: string = '';
  ascOrDesc: number = -1;

  created(): void {
    Axios.get('https://run.mocky.io/v3/1ecee638-fa3c-40b8-ad88-064263d1ddcc')
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      })
      .then((data) => {
        data.forEach((element: IInvoice) => {
          this.invoices.push(element);
        });
      }); 

    Axios.get('https://run.mocky.io/v3/5e808519-b3f0-42ef-894e-57d607315ef8')
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      })
      .then((data) => {
        data.forEach((element: IOpenHourRegistration) => {
          this.hourRegistration.push(element);
        });
      }); 
  }

  sortData(name: string, dataArray: IInvoice[]){
    let order = this.ascOrDesc;
    if(this.lastSortName === name) {
      if(order === -1){
        order = 1;
      } else {
        order = -1;
      }
    }
    this.ascOrDesc = order;
    this.lastSortName = name;

    dataArray.sort((a: any, b: any) => a[name] == b[name] ? 0 : a[name] < b[name] ? -1 * order : 1 * order);

  }
}
</script>

<style lang="scss" scoped>
  .dashboard-invoices-wrapper {
    margin-top: 30px;
    // height: 40vh;

    ::v-deep .card-block {
      min-height: initial !important;
      // height: 100% !important;
      height: 40vh;
      overflow-y:auto; 
      .table-wrapper {
        min-height: 400px !important;

        .no-data-wrapper {
          margin-bottom: 50px;
        }
      }
    }
  }

  .invoice-entry, .registration-entry {
    border-bottom: 1px solid rgb(219, 219, 219);
    :hover{
      color: #004d9d;
      cursor: pointer;
    }
  }

</style>
