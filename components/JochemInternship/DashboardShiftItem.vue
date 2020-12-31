<template>
  <tr class="shift-entry" @click="redirectToPage(shift)">
    <td>{{shift.organisation}}</td>
    <td>{{shift.location}}</td>
    <td>{{shift.date | sanitizeDate}}</td>
    <td>{{shift.freelancersCurrent}} van de {{shift.freelancersNeeded}}</td>
  </tr>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import InternAssignmentMixin from '@/mixins/InternAssignmentMixin';
@Component

export default class DashboardShiftItem extends Mixins(InternAssignmentMixin) {
  @Prop(Object)
    readonly shift!: object;  
    
  created (): void{
    // console.log('shift item ' + this.shift);
  }
}

</script>

<style scoped lang="scss">
  .shift-entry {
    border-bottom: 1px solid rgb(219, 219, 219);
    height: 60px;
    &:hover{
      color: #004d9d;
      // font-weight: bold;
      cursor: pointer;
    }
  }
</style>
