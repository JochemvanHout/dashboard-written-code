<template>
  <page-content :title="'Opdrachten en Urenregistraties'"
                :class="'dashboard-shifts-wrapper'"
                >

    <p-tabs v-model="tabIndex">

      <p-tab :title="`Incidenteel (${ShiftsIncidental.length})`">

      <div class="filter-wrapper">
        <button class="filter-button" @click="showFilterMenu = !showFilterMenu">Filter</button>
        <div class="filter-items" v-if="showFilterMenu">

          <div class="filter-list">
            <h5>Locaties</h5>
            <form v-for="location in temporaryLocationArray" :key="location" @change="filterData(IncidentalFiltersLocation, IncidentalFiltersOrganisaton, IncidentalFiltersQualificaction)">
              <input type="checkbox" v-model="IncidentalFiltersLocation" :value="location" class="checkbox-input"/>
              <label class="checkbox-label"> {{location}}</label>
            </form>
          </div>

          <div class="filter-list">
            <h5>Organisaties</h5>
            <form v-for="organisation in temporaryOrganisationArray" :key="organisation" @change="filterData(IncidentalFiltersLocation, IncidentalFiltersOrganisaton, IncidentalFiltersQualificaction)">
              <input type="checkbox" v-model="IncidentalFiltersOrganisaton" :value="organisation"/>
              <label> {{organisation}}</label>
            </form>
          </div>

          <div class="filter-list">
            <h5>Kwalificatie</h5>
            <form v-for="qualification in temporaryQualificationArray" :key="qualification" @change="filterData(IncidentalFiltersLocation, IncidentalFiltersOrganisaton, IncidentalFiltersQualificaction)">
              <input type="checkbox" v-model="IncidentalFiltersQualificaction" :value="qualification"/>
              <label> {{qualification}}</label>
            </form>
          </div>
        </div>
      </div>

        <table id="shift-table">
          <tr>
            <th v-for="header in tableFormatShifts" :key="header.id" :class="{'column-active': header.isActive}" @click="sortData(header.tableKey, ShiftsIncidental, header);">
              {{header.tableHeader + header.direction}}
            </th>
          </tr>
          <shift-item
            v-for="shift in ShiftsIncidental" 
            :key="shift.id" 
            :shift="shift">
          </shift-item>
          <p v-if="ShiftsIncidental.length === 0">Geen opdrachten gevonden voor deze filters!</p>
      </table>
      </p-tab>

      <p-tab :title="`Periodiek (${ShiftsPeriodic.length})`">

      <div class="filter-wrapper">
        <button class="filter-button" @click="showFilterMenu = !showFilterMenu">Filter</button>
        <div class="filter-items" v-if="showFilterMenu">

          <div class="filter-list">
            <h5>Locaties</h5>
            <form v-for="location in temporaryLocationArray" :key="location" @change="filterDataPeriodic(PeriodicFiltersLocation, PeriodicFiltersOrganisaton, PeriodicFiltersQualificaction)">
              <input type="checkbox" v-model="PeriodicFiltersLocation" :value="location" />
              <label> {{location}}</label>
            </form>
          </div>

          <div class="filter-list">
            <h5>Organisaties</h5>
            <form v-for="organisation in temporaryOrganisationArray" :key="organisation" @change="filterDataPeriodic(PeriodicFiltersLocation, PeriodicFiltersOrganisaton, PeriodicFiltersQualificaction)">
              <input type="checkbox" v-model="PeriodicFiltersOrganisaton" :value="organisation"/>
              <label> {{organisation}}</label>
            </form>
          </div>

          <div class="filter-list">
            <h5>Kwalificatie</h5>
            <form v-for="qualification in temporaryQualificationArray" :key="qualification" @change="filterDataPeriodic(PeriodicFiltersLocation, PeriodicFiltersOrganisaton, PeriodicFiltersQualificaction)">
              <input type="checkbox" v-model="PeriodicFiltersQualificaction" :value="qualification"/>
              <label> {{qualification}}</label>
            </form>
          </div>
        </div>
      </div>

        <table id="shift-table">
          <tr>
            <th v-for="header in tableFormatShifts" :key="header.id" :class="{'column-active': header.isActive}" @click="sortData(header.tableKey, ShiftsPeriodic, header);">
              {{header.tableHeader + header.direction}}
            </th>
          </tr>

          <shift-item
            v-for="shift in ShiftsPeriodic" 
            :key="shift.id" 
            :shift="shift">
          </shift-item>
        </table>
      </p-tab> 


      <p-tab :title="`Urenregistraties (${HourRegistration.length})`">
        <table id="shift-table">
          <tr>
            <th v-for="header in tableFormatHours" :key="header.id" :class="{'column-active': header.isActive}" @click="sortData(header.tableKey, HourRegistration, header);">
              {{header.tableHeader + header.direction}}
            </th>
          </tr>
            <hour-item
              v-for="hour in HourRegistration" 
              :key="hour.id" 
              :hour="hour">
            </hour-item>
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
import ShiftItem from './items/DashboardShiftItem.vue';
import HourItem from './items/DashboardHourItem.vue';

  interface IShift {
    id: number,
    date: Date,
    organisation: string,
    location: string,
    freelancersCurrent: number,
    freelancersNeeded: number,
    qualification: string
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
      PTabs,
      ShiftItem,
      HourItem
    },
  })


export default class JochemDashboardShifts extends Mixins(InternAssignmentMixin) {
  ShiftsPeriodic: IShift[] = [];
  ShiftsIncidental: IShift[] = [];
  HourRegistration: IOpenHourRegistration[] = [];

  ShiftsPeriodicRawData: IShift[] = [];
  ShiftsIncidentalRawData: IShift[] = [];
  HourRegistrationRawData: IOpenHourRegistration[] = [];

  tabIndex = 0;
  lastSortName: string = '';
  ascOrDesc: number = -1;
  showFilterMenu: boolean = false;

  IncidentalFiltersLocation: string[] = [];
  IncidentalFiltersOrganisaton: string[] = [];
  IncidentalFiltersQualificaction: string[] = [];

  PeriodicFiltersLocation: string[] = [];
  PeriodicFiltersOrganisaton: string[] = [];
  PeriodicFiltersQualificaction: string[] = [];

  created(): void {

    this.ShiftsPeriodicRawData = this.makeGetCallTasks('https://run.mocky.io/v3/74b373b1-0adf-48b9-b25e-9e74d83565f4');     // https://run.mocky.io/v3/d9fc9897-f2b7-4bda-9189-b0a118c945b1
    this.ShiftsIncidentalRawData = this.makeGetCallTasks('https://run.mocky.io/v3/f7c6768b-86c8-4f19-a402-5186a6ab0cad');  // https://run.mocky.io/v3/cc3ba3f7-1860-4c90-9f5a-a0300c511daf
    this.HourRegistrationRawData = this.makeGetCallTasks('https://run.mocky.io/v3/5e808519-b3f0-42ef-894e-57d607315ef8');

    this.ShiftsPeriodic = this.ShiftsPeriodicRawData;
    this.ShiftsIncidental = this.ShiftsIncidentalRawData;
    this.HourRegistration = this.HourRegistrationRawData;

  }

  sortData(name: string, dataArray: IShift[] | IOpenHourRegistration[], header: any): void{

    // Set all task headers to inactive
    this.tableFormatShifts.forEach(entry => {entry.isActive = false; entry.direction = '';});

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

  // filterData = (location: string[], organisation: string[], qualification: string[]): void => {
  //   const data = { location, organisation, qualification };

  //   console.log(data);

  //   if (Object.values(data).flat().length === 0) this.ShiftsIncidental = this.ShiftsIncidentalRawData;

  //   const output = Object.keys(data)
  //     .map((key) => this.ShiftsIncidentalRawData.filter((shift) => data[key].includes(shift[key])))
  //     .flat();

  //   console.log({ output });

  //   this.ShiftsIncidental = output;
  // };


  filterData(locations: string[], organisations: string[], qualifications: string[]): void{

    let filteredShiftsList: any[] = [];
    let tempValue: any[] = [];

    if(locations.length > 0){
      locations.forEach(location => {
        filteredShiftsList.push.apply(filteredShiftsList, this.ShiftsIncidentalRawData.filter(shift => shift.location.includes(location)));
      });
    } else {
      filteredShiftsList = this.ShiftsIncidentalRawData;
    }

    if(organisations.length > 0){
      organisations.forEach(organisation => {
        tempValue.push.apply(tempValue, filteredShiftsList.filter(shift => shift.organisation.includes(organisation)));
      });
      filteredShiftsList = tempValue;
      tempValue = [];
    }

    if(qualifications.length > 0){
      qualifications.forEach(qualification => {
        tempValue.push.apply(tempValue, filteredShiftsList.filter(shift => shift.qualification.includes(qualification)));
      });
      filteredShiftsList = tempValue;
    }

    this.ShiftsIncidental = filteredShiftsList;

    // If nothing is found give a message
    if(filteredShiftsList.length === 0){
      this.ShiftsIncidental = filteredShiftsList;
    }

    // If nothing is selected
    if(locations.length === 0 && organisations.length === 0 && qualifications.length === 0){
      this.ShiftsIncidental = this.ShiftsIncidentalRawData;
    }
  
  }


    filterDataPeriodic(locations: string[], organisations: string[], qualifications: string[]): void{

    let filteredShiftsList: any[] = [];
    let tempValue: any[] = [];

    if(locations.length > 0){
      locations.forEach(location => {
        filteredShiftsList.push.apply(filteredShiftsList, this.ShiftsPeriodicRawData.filter(shift => shift.location.includes(location)));
      });
    } else {
      filteredShiftsList = this.ShiftsPeriodicRawData;
    }

    if(organisations.length > 0){
      organisations.forEach(organisation => {
        tempValue.push.apply(tempValue, filteredShiftsList.filter(shift => shift.organisation.includes(organisation)));
      });
      filteredShiftsList = tempValue;
      tempValue = [];
    }

    if(qualifications.length > 0){
      qualifications.forEach(qualification => {
        tempValue.push.apply(tempValue, filteredShiftsList.filter(shift => shift.qualification.includes(qualification)));
      });
      filteredShiftsList = tempValue;
    }

    this.ShiftsPeriodic = filteredShiftsList;

    // If nothing is found give a message
    if(filteredShiftsList.length === 0){
      this.ShiftsPeriodic = filteredShiftsList;
    }

    // If nothing is selected
    if(locations.length === 0 && organisations.length === 0 && qualifications.length === 0){
      this.ShiftsPeriodic = this.ShiftsPeriodicRawData;
    }
  
  }

  tableFormatShifts = [
    {
      id: 0,
      tableHeader: 'Organisatie',
      tableKey: 'organisation',
      direction: '',
      isActive: false
    },
    {
      id: 1,
      tableHeader: 'Locatie',
      tableKey: 'location',
      direction: '',
      isActive: false
    },
    {
      id: 2,
      tableHeader: 'Startdatum',
      tableKey: 'date',
      direction: '',
      isActive: false
    },
    {
      id: 3,
      tableHeader: 'Zzp\'ers',
      tableKey: 'freelancersCurrent',
      direction: '',
      isActive: false
    }
  ] 

    tableFormatHours = [
    {
      id: 0,
      tableHeader: 'Zzp\'er',
      tableKey: 'freelancer',
      direction: '',
      isActive: false
    },
    {
      id: 1,
      tableHeader: 'Organisatie',
      tableKey: 'organisation',
      direction: '',
      isActive: false
    },
    {
      id: 2,
      tableHeader: 'Datum',
      tableKey: 'date',
      direction: '',
      isActive: false
    }
  ]

  temporaryOrganisationArray = ['SWZ', 'Archipel Zorggroep', 'Holland Distribution', 'Zorg in oktober', 'Samen Verder', 'Lunet Zorg', 'Koninkelijke Kentalis', 'ORO', 'Archipel Thuis', 'Zorg Balans', 'Avoord'].sort();
  temporaryLocationArray = ['Eindhoven', 'Mierlo', 'Nuenen', 'Helmond' , 'Geldrop' , 'Veldhoven' , 'Son' , 'Breugel' , 'Best' , 'Leende', 'Valkenswaard' , 'Veghel' , 'Boxtel' , 'Tilburg'].sort();
  temporaryQualificationArray = ['Helpende', 'Verzorgende', 'Verpleegkundige niveau 4', 'Verpleegkundige niveau 5' , 'Begeleider niveau 3' , 'Begeleider niveau 4' , 'Verzorgende IG'].sort();

}
</script>

<style lang="scss" scoped>
  .dashboard-shifts-wrapper {
    margin-top: 30px;

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

  .filter-wrapper{
    margin: 0 -30px 20px -30px;
  }

  .filter-button {
    margin-left: 30px;
    margin-bottom: 10px;
    background-color: #004d9d;
    display:inline-block;
    cursor:pointer;
    color:white;
    text-decoration:none;
    width:10%;
      &:focus {
        outline: none;
      }
  }

  .filter-items {
    padding:10px;
    max-height: 30vh;
    background-color: #ecf8fd;
    margin-top: 20px;
    margin-bottom: 20px;
    overflow:auto;
    display: flex;
    justify-content: space-around;
  }

  .filter-list {
    overflow: auto;
    padding: 10px;

      input {
        margin-right: 5px;
        height:20px;
        width: 20px;
        background-color: #ecf8fd;
      }

      .checkbox-label {
        font-size: 16px;
      }

  }
</style>
