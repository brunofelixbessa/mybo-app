<template>
  <q-page class="flex flex-center row q-pa-md">
    <q-form class="col-md-5 col-xs-12 q-gutter-y-md">
      <div class="text-center text-h3">Acesso restrito</div>
      <q-input class="q-mt-md" outlined v-model="form.email" label="Email" />

      <q-input v-model="form.password" label="Senha" outlined type="password" />
      <q-input
        v-if="cadastrando"
        v-model="form.password2"
        label="Repetir Senha"
        outlined
        type="password"
      />

      <q-btn
        v-if="!cadastrando"
        no-caps
        class="full-width"
        size="xl"
        color="secondary"
        label="Entrar"
      />
      <q-btn
        v-else
        no-caps
        class="full-width"
        size="xl"
        color="secondary"
        label="Cadastrar"
        @click="criarCadastro()"
      />
      <q-btn
        outline
        no-caps
        class="full-width"
        size="xl"
        color="negative"
        label="Google"
        @click="google()"
      />
      <q-space />
      <q-btn
        v-if="!cadastrando"
        outline
        no-caps
        class="full-width"
        color="primary"
        label="Não tenho conta"
        @click="cadastrando = !cadastrando"
      />
      <q-btn
        v-else
        outline
        no-caps
        class="full-width"
        color="primary"
        label="Cancelar"
        @click="cadastrando = !cadastrando"
      />
      <q-btn
        flat
        no-caps
        class="full-width"
        color="primary"
        label="Esqueci a senha"
      />
    </q-form>
  </q-page>
</template>
<script>
import { ref, onMounted } from "vue";
import { useAuth } from "stores/auth";
import { useRouter } from "vue-router";
import useMsg from "src/services/MsgService";

export default {
  name: "LoginPage",

  onBeforeMount() {
    //this.storeAuth.verificaStatus();
    console.log("LoginPage2");
  },

  setup() {
    const { MsgAguarde, MsgSucesso, MsgAviso } = useMsg();
    const router = useRouter();
    const storeAuth = useAuth();
    const form = ref({
      email: "",
      password: "",
      password2: "",
    });

    const paginaRequerente = router.currentRoute.value.query.to || "/";
    const cadastrando = ref(false);

    onMounted(() => {
      storeAuth.verificaStatus();
      console.log("LoginPage");
      if (storeAuth.isAuthenticated) {
        router.push(paginaRequerente);
      }
    });

    const google = async () => {
      await storeAuth.loginGoogle();
      router.push(paginaRequerente);
    };
    const criarCadastro = async () => {
      //Verifica senhas igauis
      if (form.value.password !== form.value.password2) {
        MsgAviso("Senhas não conferem");
        return;
      }
      MsgAguarde(true);
      //Cadastr no firebase
      await tstoreAuth.cadastrarUsuario(form.value.email, form.value.password);
      MsgAguarde(false);

      router.push(paginaRequerente);
    };

    return {
      form,
      cadastrando,
      google,
      criarCadastro,
    };
  },
};
</script>

<style></style>
