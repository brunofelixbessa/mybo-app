@
<template>
  <q-page class="row justify-center q-pa-md">
    <q-form @submit="onSalvar()" class="col-md-10 col-xs-12 q-gutter-y-md">
      <p class="text-h6">Grupo ou Matriz</p>
      <div class="row">
        <q-input
          v-model="grupo.nome"
          label="Nome"
          class="col"
          outlined
          type="text"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório.']"
        />
        <q-input
          v-model="grupo.valor"
          label="Nome completo"
          class="col"
          outlined
          type="text"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório.']"
        />
        <q-input
          label="Telefone"
          v-model="grupo.telefone"
          class="col"
          outlined
          type="number"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório.']"
        ></q-input>
      </div>
      <div class="row">
        <q-input class="col" outlined v-model="grupo.primary" label="Primaria">
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-color v-model="grupo.primary" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
          class="col"
          outlined
          v-model="grupo.secondary"
          label="Secundaria"
        >
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-color v-model="grupo.secondary" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-file class="col" outlined v-model="grupo.logo" label="Logo">
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
      </div>
      <q-separator></q-separator>
      <p class="text-h6">SubGrupos ou Filiais</p>
      <p>ID e Nome são obrigatórios</p>
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
              v-model="form.id"
              label="ID"
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
            <q-td :props="props">
              <q-btn
                outline
                color="primary"
                icon="edit"
                @click="editarLinha(props.row)"
              ></q-btn>
              <q-btn
                outline
                color="negative"
                icon="delete"
                @click="removerLinha(props.row)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>

      <q-btn
        no-caps
        class="full-width"
        size="xl"
        color="secondary"
        label="Salvar"
        type="submit"
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
      { name: "id", label: "ID", field: "id", align: "left" },
      { name: "nome", label: "Nome", field: "nome", align: "left" },
      { name: "valor", label: "Valor", field: "valor", align: "left" },
      { name: "Ativo", label: "Ativo", field: "ativo", align: "center" },
      { name: "actions", label: "Ações", field: "actions", align: "center" },
    ];
    //const uid = ref("XeGyV7akvVPJaiVtJ4NTe6KY4Y02");

    const linhas = ref([]);
    const form = ref({
      id: "",
      nome: "",
      valor: "",
      ativo: true,
      urlPulica: "",
      qrCode: "",
    });
    const grupo = ref({
      id: "",
      nome: "",
      valor: "",
      primary: "",
      secondary: "",
      logo: "",
      subgrupos: [],
    });

    //Metodos
    onMounted(async () => {
      storeAuth.getUsuario(); //busca no cache
      buscaGrupo();
    });

    const buscaGrupo = async () => {
      const retorno = await buscaUmGrupoCache(storeAuth.usuario.grupoMaster);
      //console.log(retorno);
      //grupo.value = retorno;
      //linhas.value = grupo.value.subgrupos;
    };

    const onSalvar = () => {
      salvarGrupo(grupo.value);
    };

    const addSubGrupo = () => {
      if (form.value.id <= 0 || form.value.nome === "") {
        MsgErro("Codigo deve ser maior que 0 e nome não pode ser vazio");
        return;
      }
      linhas.value.push({
        id: form.value.id,
        nome: form.value.nome,
        valor: form.value.valor,
        ativo: form.value.ativo,
        urlPulica: form.value.urlPulica,
        qrCode: form.value.qrCode,
      });

      form.value.id = "";
      form.value.nome = "";
      form.value.valor = "";
      form.value.ativo = true;
      form.value.urlPulica = "";
      form.value.qrCode = "";
    };

    const removerLinha = async (linha) => {
      try {
        $q.dialog({
          title: "Remover",
          message:
            "Deseja realmente deletar esse grupo? Não será possivel restaurar os dados.",
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          //await remover("campanhas", linha.id);
          MsgSucesso("Removido com sucesso");
          buscaGrupo();
        });
      } catch (error) {
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "cloud_done",
          message: error,
        });
      }
    };

    const editarLinha = (linha) => {
      form.value.codigo = linha.codigo;
      form.value.nome = linha.nome;
      form.value.valor = linha.valor;
      form.value.ativo = linha.ativo;
      form.value.index = linha.index;
    };

    return {
      grupo,
      form,
      columns,
      linhas,
      onSalvar,
      addSubGrupo,
      removerLinha,
      editarLinha,
    };
  },
});
</script>

<style scoped></style>
