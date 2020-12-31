import { Component, Vue } from 'vue-property-decorator';
import Axios from 'axios';

interface ITaskEntry {
  id: number;
  priority: number;
  zzper: string;
  inactive: boolean;
  date: Date;
}

interface IShift {
  id: number,
  date: Date,
  organisation: string,
  location: string,
  freelancersCurrent: number,
  freelancersNeeded: number
}

interface IOpenHourRegistration {
  id: number,
  freelancer: string,
  organisation: string,
  date: Date
}

enum priorityColor {
  '#52e378' = 0,
  '#f0d62e' = 1,
  '#c92014' = 2,
  '#240604' = 3
}

@Component
export default class InternAssignmentMixin extends Vue {

  redirectToPage(data: any): void{
    console.log(data);
    this.$router.push({ name: 'infopagestage', params: { data: data } });
  }

  calculatePriorityColor(priority: number){
    return priorityColor[priority];
  }

 sanitizePriorityData(priority: number, inactive: boolean){
    if(inactive){
      return 2;
    } else if (priority == 2){
      return 1;
    }
    return priority;
  }

  makeGetCallTasks(APICall: string): any{
    const tempStore: ITaskEntry[] = [];
    Axios.get(APICall)
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      })
      .then((data) => {
        data.forEach((element: ITaskEntry) => {
          element.priority = this.sanitizePriorityData(element.priority, element.inactive);
          element.date = new Date(element.date);
          tempStore.push(element);
        });
        
      });  
      return tempStore;
  }

  // makeGetCallTasks(APICall: string): any{
  //   const tempStore: ITaskEntry[] = [];
  //   return Axios.get(APICall)
  //     .then((response) => {
  //       return response.data;
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     })
  //     .then((data) => {
  //       data.forEach((element: ITaskEntry) => {
  //         element.priority = this.sanitizePriorityData(element.priority, element.inactive);
  //         element.date = new Date(element.date);
  //         tempStore.push(element);
  //       });
        
  //     });  
  // }

  makeGetCallShifts(APICall: string): any{
    const tempStore: IShift[] = [];
    Axios.get(APICall)
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      })
      .then((data) => {
        data.forEach((element: IShift) => {
          element.date = new Date(element.date);
          tempStore.push(element);
        });
        
      });  
      return tempStore;
  }

  makeGetCallHourRegistration(APICall: string): any{
    const tempStore: IOpenHourRegistration[] = [];
    Axios.get(APICall)
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      })
      .then((data) => {
        data.forEach((element: IOpenHourRegistration) => {
          element.date = new Date(element.date);
          tempStore.push(element);
        });
        
      });
      
      return tempStore;
  }  
}
