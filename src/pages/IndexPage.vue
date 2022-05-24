<template>
  <q-page class="colunm q-pa-md">
    <q-input outlined label="Celular"> </q-input>
    <q-btn label="Abrir" @click="buscar()"></q-btn>
    <q-btn label="Fechar " @click="salvar()"></q-btn>
  </q-page>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import useMsg from "src/services/MsgService";

export default defineComponent({
  name: "IndexPage",
  setup() {
    const { MsgAguarde, MsgSucesso, MsgAviso } = useMsg();

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
    };
  },
});
</script>
