<template>
  <section class="jochem-opdracht">
      
      <h1 class="welcome-message">Dit is een tijdelijke pagina.</h1>
      <h2>Je wordt uiteindelijk doorgeleid naar de juiste taak, opdracht of registratie</h2>

     <button @click="redirectToPage">
     Ga terug naar het dashboard
     </button>

      <div v-for="data in this.$route.params.data" :key="data">
        {{data}}
      </div>
      

  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'internship-assignment-second',
  components: {

  },
})

export default class JochemOpdracht extends Vue {

  redirectToPage(): void{
    this.$router.push({ name: 'recruitment' });
  }

  created(): void {
    
    console.log(this.$route.params.data);

  }

}

</script>

<style lang="scss">
h1 {
  font-weight: bold;
}
</style>
