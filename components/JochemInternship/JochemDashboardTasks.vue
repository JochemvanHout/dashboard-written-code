<template>
  <page-content :title="'Taken'"
                :class="'dashboard-tasks-wrapper'"
                >

    <p-tabs v-model="tabIndex">

    <!-- Taken voor zzp'ers -->
    <p-tab :title="`Zzp (${tasklistFreelancer.length})`">

      <input @change="filterData(userInputFreelancer, 'freelancer')" class="form-control" v-model="userInputFreelancer" placeholder="Zoek in taken">

      <div class="frequent-buttons-wrapper">
        <button class="frequent-button" v-on:click="filterData('', 'freelancer')">Alles</button>
        <button class="frequent-button" v-on:click="filterData('VOG', 'freelancer')">VOG</button>
        <button class="frequent-button" v-on:click="filterData('Aansprakelijkheid', 'freelancer')">Aansprakelijkheid</button>
        <button class="frequent-button" v-on:click="filterData('Klachtenregeling', 'freelancer')">Klachtenregeling</button>
      </div>

      <div class="table-wrapper">

        <table id="shift-table">
        <thead>
          <tr>
            <th v-for="header in tableFormatTasks" :key="header.id" :class="{'column-active': header.isActive}" v-on:click="sortData(header.tableKey, tasklistFreelancer, header);">
              {{header.tableHeader + header.direction}}
            </th>
          </tr>
        </thead>

        <tbody>
          <task-item 
              v-for="task in tasklistFreelancer" 
              :key="task.id" 
              :task="task">
          </task-item>
        </tbody>

        </table>
      </div>

    </p-tab>

    <!-- Taken voor zorginstellingen -->
    <p-tab :title="`Zorginstelling (${tasklistOrganisation.length})`">
      <input @change="filterData(userInputOrganisation, 'organisation')" class="form-control" v-model="userInputOrganisation" placeholder="Zoek in taken">
      <div class="frequent-buttons-wrapper">
        <button class="frequent-button" v-on:click="filterData('', 'organisation')">Alles</button>
        <button class="frequent-button" v-on:click="filterData('zzp', 'organisation')">Geen zzp'ers</button>
      </div>
      <table id="shift-table">
      <thead>
        <tr>
          <th v-for="header in tableFormatTasks" :key="header.id" :class="{'column-active': header.isActive}" @click="sortData(header.tableKey, tasklistOrganisation, header);">
            {{header.tableHeader + header.direction}}
          </th>
        </tr>
      </thead>
      <tbody>
        <task-item 
            v-for="task in tasklistOrganisation" 
            :key="task.id" 
            :task="task">
        </task-item>
      </tbody>
      </table>
    </p-tab>

    <!-- Legacy taken -->
    <p-tab :title="`Overig (${tasklistLegacy.length})`">
      <input @change="filterData(userInputLegacy, 'legacy')" class="form-control" v-model="userInputLegacy" placeholder="Zoek in taken">
      <div class="frequent-buttons-wrapper">
        <button class="frequent-button" v-on:click="filterData('', 'legacy')">Alles</button>
        <button class="frequent-button" v-on:click="filterData('logboek', 'legacy')">Logboek</button>
        <button class="frequent-button" v-on:click="filterData('klacht', 'legacy')">Klachten</button>
        <button class="frequent-button" v-on:click="filterData('ziek', 'legacy')">Ziekmeldingen</button>
      </div>

      
      <table id="shift-table">
      <thead>
        <tr>
          <th v-for="header in tableFormatTasks" :key="header.id" :class="{'column-active': header.isActive}" @click="sortData(header.tableKey, tasklistLegacy, header);">
            {{header.tableHeader + header.direction}}
          </th>
        </tr>
      </thead>
      <tbody>
        <task-item 
            v-for="task in tasklistLegacy" 
            :key="task.id" 
            :task="task">
        </task-item>
      </tbody>
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
import TaskItem from './items/DashboardTaskItem.vue';
import FrequentButtons from './items/FrequentButtons.vue';

  enum priorityList {
    low = 0,
    medium = 1,
    high = 2,
    extreme = 3
  }

  interface ITaskEntry {
    id: number;
    priority: number;
    freelancer: string;
    organisation: string;
    task: string;
    inactive: boolean;
    date: Date;
  }

  @Component({
    components: {
      PageContent,
      PTab,
      PTabs,
      TaskItem
    },
  })

export default class JochemDashboardTasks extends Mixins(InternAssignmentMixin) {

  tasklistFreelancer: ITaskEntry[] = [];
  tasklistOrganisation: ITaskEntry[] = [];
  tasklistLegacy: ITaskEntry[] = [];

  freelancerRawData: ITaskEntry[] = [];
  organisationRawData: ITaskEntry[] = [];
  legacyRawData: ITaskEntry[] = [];
  

  tabIndex = 0;
  lastSortName: string = '';
  ascOrDesc: number = -1;

  userInputFreelancer: string = '';
  userInputOrganisation: string = '';
  userInputLegacy: string = '';

  created(): void {

    this.freelancerRawData = this.makeGetCallTasks('https://run.mocky.io/v3/99607fa7-7f93-4c88-84d7-7e558f6ab649');
    this.organisationRawData = this.makeGetCallTasks('https://run.mocky.io/v3/710d2ef2-4152-4c9a-bb30-00f431701dcc');
    this.legacyRawData = this.makeGetCallTasks('https://run.mocky.io/v3/5de5649a-91b0-4c8e-b512-55330002086b');

    // In order to always have a pure copy of the original API call
    // The values are duplicated to new variables
    this.tasklistFreelancer = this.freelancerRawData;
    this.tasklistOrganisation = this.organisationRawData;
    this.tasklistLegacy = this.legacyRawData;
 
  }

  mounted(): void {
  
  }

  sortData(name: string, dataArray: ITaskEntry[], header: any): void{

    // Set all task headers to inactive
    this.tableFormatTasks.forEach(entry => {entry.isActive = false; entry.direction = '';});

    // Set the correct header to active
    header.isActive = !header.isActive;
    header.direction = ' ▼';

    let order = this.ascOrDesc;

    if(this.lastSortName === name) { // If the pressed header is the same one, flip it
      if(order === -1){
        order = 1; 
        header.direction = ' ▲';
      } else {
        order = -1;
        header.direction = ' ▼';
      }
    } else { // If it's a new column reset it
      order = -1;
      header.direction = ' ▼';
    }

    this.ascOrDesc = order;
    this.lastSortName = name;

    dataArray.sort((a: any, b: any) => a[name] == b[name] ? 0 : a[name] < b[name] ? -1 * order : 1 * order);
  }

  filterData(data: string, list: string){
    switch(list) {
      case 'freelancer':
        this.tasklistFreelancer = this.freelancerRawData.filter(task => task.freelancer.toLowerCase().includes(data.toLowerCase()) || task.task.toLowerCase().includes(data.toLowerCase()) );
        break;
      
      case 'organisation':
        this.tasklistOrganisation = this.organisationRawData.filter(task => task.organisation.toLowerCase().includes(data.toLowerCase()) || task.task.toLowerCase().includes(data.toLowerCase()) );
        break;

      case 'legacy':
        this.tasklistLegacy = this.legacyRawData.filter(task => task.freelancer.toLowerCase().includes(data.toLowerCase()) || task.task.toLowerCase().includes(data.toLowerCase()) );
        break;

      default:
        console.error('geen matches gevonden voor deze zoekterm');
        break;
    }
    
  }

  tableFormatTasks = [
    {
      id: 0,
      tableHeader: 'Prio',
      tableKey: 'priority',
      direction: '',
      isActive: false
    },
    {
      id: 1,
      tableHeader: 'Zzp\'er',
      tableKey: 'freelancer',
      direction: '',
      isActive: false
    },
    {
      id: 2,
      tableHeader: 'Taak',
      tableKey: 'task',
      direction: '',
      isActive: false
    },
    {
      id: 3,
      tableHeader: 'Datum',
      tableKey: 'date',
      direction: '',
      isActive: false
    }
  ] 

} // End of Class

</script>

<style lang="scss" scoped>
  .dashboard-tasks-wrapper {
    margin-top: 30px;
    height: 80vh;

    ::v-deep .card-block {
      min-height: initial !important;
      // height: 100% !important;
      height: 85vh;
      overflow-y:auto; 
      .table-wrapper {
        min-height: 400px !important;

        .no-data-wrapper {
          margin-bottom: 50px;
        }
      }
    }
  }

  .frequent-buttons-wrapper {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .frequent-button {
    border-radius:20px;
    border:1px solid black;
    margin-right: 5px;

    background-color:transparent;
    cursor:pointer;
    text-decoration:none;

      &:hover {
        background-color:#bfd2e6;
      }

      &:active {
        position:relative;
        background-color:#bfd2e6;
        top:1px;
        outline: none;
      }

      &:focus {
        outline: none;
        background-color:#bfd2e6;
      }
  }

  input {
    height: 40px;
    border: 1px $p-form-input-border solid;
    width: 50%;
    border-radius: 5px;
    background-color: transparent;

    &:hover, &:focus {
      box-shadow: none;
    }

    &.error {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: 5px solid $p-form-input-border-left-error;
    }

    &:focus, &.error:focus {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: 5px solid $p-form-input-border-left-focus;
      transition: border 200ms ease-in;
    }

    &.no-focus:focus {
      border-left: 1px solid $p-form-input-border;
      transition: none;
    }
  }

  .table-wrapper {
    overflow-y: auto;
    flex-grow: 1;

    thead {
      position: sticky;
    }

    table{
      width:100%;
    }

    tbody{

    }

  }
</style>



