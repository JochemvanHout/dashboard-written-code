<template>
  <tr class="hour-entry" @click="redirectToPage(hour)">
    <td>{{hour.freelancer}}</td>
    <td>{{hour.organisation}}</td>
    <td>{{hour.date | sanitizeDate}}</td>
  </tr>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import InternAssignmentMixin from '@/mixins/InternAssignmentMixin';
@Component

export default class DashboardHourItem extends Mixins(InternAssignmentMixin) {
  @Prop(Object)
    readonly hour!: object;  
    
  created (): void{
    // console.log(this.task);
  }
}

</script>

<style scoped lang="scss">
  .hour-entry {
    border-bottom: 1px solid rgb(219, 219, 219);
    height: 60px;
    &:hover{
      color: #004d9d;
      background-color: #f5f5f5;
      cursor: pointer;
    }
  }
</style>
