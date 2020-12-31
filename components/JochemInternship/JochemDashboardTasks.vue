<template>
  <page-content :title="'Taken'"
                :class="'dashboard-tasks-wrapper'"
                >

    <!-- TODO: make this into a loop, instead of seperate instances  -->
    <p-tabs v-model="tabIndex">
      <p-tab :title="`Zzp (${tasklistFreelancer.length})`">

        <input  @change="filterData(userInput)" class="form-control" v-model="userInput" placeholder="Zoek in taken">

        <div class="frequent-buttons">
          <button class="filter-button" v-on:click="filterData('')">Alles</button>
          <button class="filter-button" v-on:click="filterData('VOG')">VOG</button>
          <button class="filter-button" v-on:click="filterData('Aansprakelijkheid')">Aansprakelijkheid</button>
          <button class="filter-button" v-on:click="filterData('Klachtenregeling')">Klachtenregeling</button>
        </div>

        <table id="shift-table">

        <tr>
          <th v-for="header in tableFormatTasks" :key="header.id" :class="{'column-active': header.isActive}" v-on:click="sortData(header.tableKey, tasklistFreelancer, header);">
            {{header.tableHeader + header.direction}}
          </th>
        </tr>

          <TaskItem 
              v-for="task in tasklistFreelancer" 
              :key="task.id" 
              :task="task">
          </TaskItem>
      </table>

      </p-tab>

      <p-tab :title="`Zorginstelling (${tasklistOrganisation.length})`">

        <table id="shift-table">
          <tr>
            <th v-for="header in tableFormatTasks" :key="header.id" :class="{'column-active': header.isActive}" @click="sortData(header.tableKey, tasklistOrganisation, header);">
              {{header.tableHeader + header.direction}}
            </th>
          </tr>

          <TaskItem 
              v-for="task in tasklistOrganisation" 
              :key="task.id" 
              :task="task">
          </TaskItem>
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
import TaskItem from './DashboardTaskItem.vue';

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

  freelancerRawData: ITaskEntry[] = [];
  organisationRawData: ITaskEntry[] = [];

  tabIndex = 0;
  lastSortName: string = '';
  ascOrDesc: number = -1;

  userInput: string = '';

  testString: string = 'Hello I am a string!';

  created(): void {

    this.freelancerRawData = this.makeGetCallTasks('https://run.mocky.io/v3/99607fa7-7f93-4c88-84d7-7e558f6ab649');
    this.organisationRawData = this.makeGetCallTasks('https://run.mocky.io/v3/710d2ef2-4152-4c9a-bb30-00f431701dcc');

    // In order to always have a pure copy of the original API call
    // The values are duplicated to new variables
    this.tasklistFreelancer = this.freelancerRawData;
    this.tasklistOrganisation = this.organisationRawData;
 

  }

  mounted(): void {
    // sortData('Prio', tasklistFreelancer, tableFormatTasks[0]);
  }

  sortData(name: string, dataArray: ITaskEntry[], header: any): void{

    // Set all task headers to inactive
    this.tableFormatTasks.forEach(entry => {entry.isActive = false; entry.direction = '';});

    // Set the correct header to active
    header.isActive = !header.isActive;
    header.direction = '▼';

    let order = this.ascOrDesc;

    if(this.lastSortName === name) { // If the pressed header is the same one, flip it
      if(order === -1){
        order = 1; 
        header.direction = '▲';
      } else {
        order = -1;
        header.direction = '▼';
      }
    } else { // If it's a new column reset it
      order = -1;
      header.direction = '▼';
    }

    this.ascOrDesc = order;
    this.lastSortName = name;

    dataArray.sort((a: any, b: any) => a[name] == b[name] ? 0 : a[name] < b[name] ? -1 * order : 1 * order);
  }

  filterData(data: string){
    console.log(data);
    this.tasklistFreelancer = this.freelancerRawData.filter(task => task.freelancer.toLowerCase().includes(data.toLowerCase()) || task.task.toLowerCase().includes(data.toLowerCase()) );
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
      tableHeader: 'Naam',
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

  .task-priority-indicator {
    background-color: red;

    // border: 2px solid red;
    border-radius: 50%;
    width: 10px;
    height: 10px;
  }

  .task-text {
    width: 80%;
  }

  .column-active {
    font-weight: 800;
    color: #004d9d;
  }

  .frequent-buttons {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .filter-button {
    background-color:transparent;
    border-radius:20px;
    border:2px solid #004d9d;
    display:inline-block;
    cursor:pointer;
    color:#004d9d;
    text-decoration:none;
  }
  .filter-button:hover {
    background-color:transparent;
  }
  .filter-button:active {
    position:relative;
    background-color:#bfd2e6;
    top:1px;
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
</style>



