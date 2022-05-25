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
          row-key="index"
        >
          <template v-slot:top>
            <q-input
              v-model="form.codigo"
              label="Codigo"
              class="col-2"
              outlined
              type="number"
            />
            <q-input
              v-model="form.nome"
              label="Nome"
              class="col-5"
              outlined
              type="text"
            />
            <q-input
              v-model="form.valor"
              label="Valor"
              class="col-2"
              outlined
              type="text"
            />
            <q-toggle class="col-2" v-model="form.ativo" label="Ativo" />
            <q-btn
              class="col-1"
              icon="add"
              color="primary"
              size="lg"
              @click="addSubGrupo()"
            />
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-x-sm">
              <b-btn
                dense
                icon="edit"
                color="info"
                @click="editarLinha(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </b-btn>
              <b-btn
                dense
                icon="delete"
                color="negative"
                @click="removerLinha(props.row)"
                ><q-tooltip>Deletar</q-tooltip></b-btn
              >
            </q-td>
          </template>

          <!-- <template v-slot:header-selection="scope">
            <q-toggle v-model="scope.selected" label="Ativo" />
          </template>

          <template v-slot:body-selection="scope">
            <q-toggle v-model="scope.selected" />
          </template>-->
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
    const { salvarGrupo, buscaUmGrupoCache } = useFiretore();
    const { MsgSucesso, MsgErro } = useMsg();

    //Variaveis
    const columns = [
      { name: "index", label: "#", field: "index", align: "left" },
      { name: "codigo", label: "Codigo", field: "codigo", align: "left" },
      { name: "nome", label: "Nome", field: "nome", align: "left" },
      { name: "valor", label: "Valor", field: "valor", align: "left" },
      { name: "Ativo", label: "Ativo", field: "ativo", align: "center" },
      { name: "actions", label: "actions", field: "actions", align: "center" },
    ];
    //const uid = ref("XeGyV7akvVPJaiVtJ4NTe6KY4Y02");

    const selecionadas = ref([]);
    const linhas = ref([]);
    const form = ref({
      index: "",
      codigo: "",
      nome: "",
      valor: "",
      ativo: true,
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
      grupo.value = await buscaUmGrupoCache(storeAuth.uid);
      linhas.value = grupo.value.subgrupos;
    });

    const onSalvar = () => {
      // linhas.value.forEach((element) => {
      //   //console.log(element);
      //   grupo.value.subgrupos.push(element);
      // });
      //console.log(grupo.value);
      //console.log(selecionadas.value);
      salvarGrupo(grupo.value);
    };

    const addSubGrupo = () => {
      if (form.value.codigo <= 0 || form.value.nome === "") {
        MsgErro("Codigo deve ser maior que 0 e nome não pode ser vazio");
        return;
      }
      linhas.value.push({
        index: linhas.value.length,
        codigo: form.value.codigo,
        nome: form.value.nome,
        valor: form.value.valor,
        ativo: form.value.ativo,
      });

      form.value.codigo = "";
      form.value.nome = "";
      form.value.valor = "";
    };

    const onEditar = () => {
      // console.log("excluirItem");
    };

    return {
      grupo,
      form,
      columns,
      linhas,
      selecionadas,
      onSalvar,
      onEditar,
      addSubGrupo,
    };
  },
});
</script>

<style scoped></style>
