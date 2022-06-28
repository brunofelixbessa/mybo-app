<template>
  <router-view />
</template>

<script>
import { defineComponent, onBeforeMount } from "vue";
//import { useAuth } from "stores/auth";

export default defineComponent({
  name: "App",
  // setup() {
  //   const storeAuth = useAuth();

  //   onBeforeMount(() => {
  //     buscaStatus();
  //   });

  //   const buscaStatus = async () => {
  //     await storeAuth.verificaStatus();
  //   };
  //   return {
  //     storeAuth,
  //   };
  // },
});
</script>
