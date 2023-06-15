<template>
  <q-page class="colunm q-pa-md">
    <q-input outlined label="Celular"> </q-input>
    <q-btn label="Abrir" @click="buscar()"></q-btn>
    <q-btn label="Fechar " @click="salvar()"></q-btn>
    <q-select
      filled
      v-model="modelMultiple"
      multiple
      :options="options"
      use-chips
      stack-label
      label="Tags para filtro"
    />
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { MsgAtencao, MsgErro, MsgSucesso, MsgCopia } from "/src/util/useMsg";

export default defineComponent({
  name: "IndexPage",
  setup() {
    const modelMultiple = ref(["Facebook"]);
    const options = ["Google", "Facebook", "Twitter", "Apple", "Oracle"];

    let timer;

    onMounted(() => {});

    const buscar = async () => {
      // await setDoc(doc(db, "cities", "LA"), {
      //   name: "Los Angeles",
      //   state: "CA",
      //   country: "USA",
      // });
      //this.myNotify();
      MsgAguarde(true);
      timer = setTimeout(() => {
        MsgAguarde(false);
        timer = void 0;
      }, 3000);
    };
    const salvar = async () => {
      // await setDoc(doc(db, "cities", "LA"), {
      //   name: "Los Angeles",
      //   state: "CA",
      //   country: "USA",
      // });
    };

    return {
      buscar,
      salvar,
      modelMultiple,
      options,
    };
  },
});
</script>
