<template>
  <q-page class="bg-grey-3 colunm q-pa-md">
    <q-input outlined label="Celular"> </q-input>
    <q-btn label="Salvar número"></q-btn>
  </q-page>
</template>
npm install -g firebase-tools

<script>
import { defineComponent, onMounted } from "vue";
//import { db, setDoc, doc } from "boot/firebase";

export default defineComponent({
  name: "IndexPage",
  setup() {
    onMounted(() => {
      console.log("IndexPage mounted");
      buscar();
    });

    const buscar = async () => {
      // await setDoc(doc(db, "cities", "LA"), {
      //   name: "Los Angeles",
      //   state: "CA",
      //   country: "USA",
      // });
    };
    return {
      buscar,
    };
  },
});
</script>
