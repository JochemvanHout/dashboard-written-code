<template>
  <tr class="task-entry" @click="redirectToPage(task)">
    <td>
      <div class="task-priority-indicator"
        :style="{'background-color': calculatePriorityColor(task.priority)}">   
      </div>
    </td>

    <td>{{task.freelancer || task.organisation}}</td>
    <td>{{task.task}}</td>
    <td>{{task.date | sanitizeDate}}</td>
  </tr>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import InternAssignmentMixin from '@/mixins/InternAssignmentMixin';
@Component

export default class DashboardTaskItem extends Mixins(InternAssignmentMixin) {
  @Prop(Object)
    readonly task!: object;  
    
  created (): void{
    // console.log(this.task);
  }
}

</script>

<style scoped lang="scss">

  .task-priority-indicator {
    background-color: black;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    // margin: auto;
  }

  .task-text {
    width: 40%;
  }

  .task-entry {
    border-bottom: 1px solid rgb(219, 219, 219);
    height: 60px;
    &:hover{
      color: #004d9d;
      background-color: #f5f5f5;
      cursor: pointer;
    }
  }


</style>
