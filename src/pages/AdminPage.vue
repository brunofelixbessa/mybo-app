@
<template>
  <q-page class="row justify-center q-pa-md">
    <q-form @submit="onSalvar()" class="col-md-10 col-xs-12 q-gutter-y-md">
      <p class="text-h6">Grupo ou Matriz</p>
      <div class="row q-gutter-x-md">
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
      <div class="row q-gutter-x-md">
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
        <q-file
          class="col"
          outlined
          bottom-slots
          v-model="logo"
          label="Label"
          counter
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" @click.stop />
          </template>
          <template v-slot:append>
            <q-icon
              name="close"
              @click.stop="model = null"
              class="cursor-pointer"
            />
          </template>

          <template v-slot:hint> Field hint </template>
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
              :readonly="editando"
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
              v-if="!editando"
              class="col-1"
              icon="add"
              color="primary"
              size="lg"
              @click="addSubGrupo()"
            />
            <q-btn
              v-else
              class="col-1"
              icon="save"
              color="primary"
              size="lg"
              @click="editarSubGrupo()"
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
import { MsgAtencao, MsgErro, MsgSucesso, MsgCopia } from "/src/util/useMsg";
import useFiretore from "src/services/FireStoreService";
import { useAuth } from "stores/auth";
import { useQuasar } from "quasar";

export default defineComponent({
  setup() {
    const storeAuth = useAuth();
    const { salvarGrupo, buscaUmGrupoCache, removerSubGrupo } = useFiretore();
    const $q = useQuasar();

    //Variaveis
    const columns = [
      { name: "id", label: "ID", field: "id", align: "left" },
      { name: "nome", label: "Nome", field: "nome", align: "left" },
      { name: "valor", label: "Valor", field: "valor", align: "left" },
      { name: "Ativo", label: "Ativo", field: "ativo", align: "center" },
      { name: "actions", label: "Ações", field: "actions", align: "center" },
    ];

    const editando = ref(false);

    const linhas = ref([]);
    const form = ref({
      id: "",
      nome: "",
      valor: "",
      ativo: true,
      urlPulica: "",
      qrCode: "",
      index: "",
    });
    const grupo = ref({
      nome: "",
      valor: "",
      primary: "",
      secondary: "",
      logo: "",
      subgrupos: [],
      admin: "",
      telefone: "",
    });

    const logo = ref(null);
    const user = storeAuth.getUser;

    //Metodos
    onMounted(async () => {
      //storeAuth.retornaUsuario(); //busca no cache
      //console.log(user);
      buscaGrupo();
    });

    const buscaGrupo = async () => {
      const retorno = await buscaUmGrupoCache(user.grupoMaster);
      grupo.value = retorno;
      linhas.value = grupo.value?.subgrupos;
    };
    const onSalvar = async () => {
      // primary: "#344955",
      // secondary: "#f9aa33",
      grupo.value.admin = user.uid;
      grupo.value.subgrupos = linhas.value;
      // console.log(linhas.value);
      await salvarGrupo(grupo.value);
    };
    const addSubGrupo = () => {
      let existe = false;

      if (form.value.id <= 0 || form.value.nome === "") {
        MsgErro("Codigo deve ser maior que 0 e nome não pode ser vazio");
        return;
      }

      linhas.value.forEach((element) => {
        if (element.id === form.value.id) {
          MsgErro("ID deve ser único");
          existe = true;
          return;
        }
      });

      if (!existe) {
        linhas.value.push({
          id: form.value.id,
          nome: form.value.nome,
          valor: form.value.valor,
          ativo: form.value.ativo,
          urlPulica: form.value.urlPulica,
          qrCode: form.value.qrCode,
        });

        limpaForm();
      }
    };
    const limpaForm = () => {
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
            "Deseja realmente deletar esse subgrupo? Não será possivel restaurar os dados.",
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          linhas.value.splice(linhas.value.indexOf(linha), 1);
          console.log(linhas.value);

          await removerSubGrupo(grupo.value);
          await salvarGrupo(grupo.value);

          MsgSucesso("SubGrupo Removrdo com sucesso");
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
      form.value.id = linha.id;
      form.value.nome = linha.nome;
      form.value.valor = linha.valor;
      form.value.ativo = linha.ativo;
      form.value.index = linha.index;
      editando.value = true;
    };
    const editarSubGrupo = () => {
      const index = linhas.value.findIndex(
        (element) => element.id === form.value.id
      );
      linhas.value[index].nome = form.value.nome;
      linhas.value[index].valor = form.value.valor;
      linhas.value[index].ativo = form.value.ativo;
      linhas.value[index].urlPulica = form.value.urlPulica;
      linhas.value[index].qrCode = form.value.qrCode;
      limpaForm();
      editando.value = false;
    };

    return {
      grupo,
      form,
      columns,
      linhas,
      logo,
      onSalvar,
      addSubGrupo,
      removerLinha,
      editarLinha,
      editarSubGrupo,
      editando,
    };
  },
});
</script>

<style scoped></style>
