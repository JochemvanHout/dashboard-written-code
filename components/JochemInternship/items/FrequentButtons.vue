<template>

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


</style>
