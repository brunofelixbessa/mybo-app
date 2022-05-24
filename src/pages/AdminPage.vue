@
<template>
  <q-page class="row justify-center q-pa-md">
    <q-form class="col-md-8 col-xs-12 q-gutter-y-md">
      <h5>Grupo ou Matriz</h5>
      <div class="row">
        <q-input
          v-model="grupo.nome"
          label="Nome"
          class="col"
          outlined
          type="text"
        />
        <q-input
          v-model="grupo.valor"
          label="Nome completo"
          class="col"
          outlined
          type="number"
        />
      </div>
      <q-separator></q-separator>
      <h5>SubGrupos ou Filiais</h5>

      <div class="row">
        <q-table
          class="col"
          title="Treats"
          :rows="linhas"
          :columns="columns"
          row-key="codigo"
          selection="multiple"
          v-model:selected="selected"
        >
          <template v-slot:top>
            <q-input
              v-model="subgrupo.codigo"
              label="Codigo"
              class="col"
              outlined
              type="number"
            />
            <q-input
              v-model="subgrupo.nome"
              label="Nome"
              class="col"
              outlined
              type="text"
            />
            <q-input
              v-model="subgrupo.valor"
              label="Valor"
              class="col"
              outlined
              type="text"
            />
            <q-space />
            <q-btn icon="add" color="secondary" size="lg" />
          </template>

          <template v-slot:header-selection="scope">
            <q-toggle v-model="scope.selected" label="Ativo" />
          </template>

          <template v-slot:body-selection="scope">
            <q-toggle v-model="scope.selected" />
          </template>
        </q-table>
      </div>

      <q-btn
        no-caps
        class="full-width"
        size="xl"
        color="secondary"
        label="Salvar"
        @click="onSalvar()"
      ></q-btn>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import useMsg from "src/services/MsgService";
import useFiretore from "src/services/FireStoreService";
import { useAuth } from "stores/auth";

export default defineComponent({
  setup() {
    const storeAuth = useAuth();
    const { salvarGrupo, buscaUmGrupo } = useFiretore();

    //Variaveis
    const columns = [
      { name: "codigo", label: "Codigo", field: "codigo", align: "left" },
      { name: "nome", label: "Nome", field: "nome", align: "left" },
      { name: "valor", label: "Valor", field: "valor", align: "left" },
      { name: "status", label: "Ativo", field: "status", align: "center" },
    ];
    //const uid = ref("XeGyV7akvVPJaiVtJ4NTe6KY4Y02");

    const selected = ref([]);

    const linhas = ref([]);
    const subgrupo = ref({
      codigo: 9,
      nome: "Sub grupo Teste",
      valor: 0,
      status: true,
    });
    const grupo = ref({
      id: "",
      nome: "",
      valor: "",
      subgrupos: [],
    });

    //Metodos
    onMounted(async () => {
      storeAuth.getUsuario(); //busca no cache
      grupo.value = await buscaUmGrupo(storeAuth.uid);
      linhas.value = grupo.value.subgrupos;
    });

    const onSalvar = () => {
      grupo.value.subgrupos.push(subgrupo);
      salvarGrupo(grupo.value);
    };

    const onEditar = () => {
      // console.log("excluirItem");
    };

    return {
      grupo,
      subgrupo,
      columns,
      linhas,
      selected,
      onSalvar,
      onEditar,
    };
  },
});
</script>

<style scoped></style>
