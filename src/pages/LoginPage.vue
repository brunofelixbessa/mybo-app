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
import { ref } from "vue";
import { useAuth } from "stores/auth";
import { useRouter } from "vue-router";

export default {
  name: "LoginPage",

  setup() {
    const router = useRouter();
    const storeAuth = useAuth();
    const form = ref({
      email: "",
      password: "",
    });

    const cadastrando = ref(false);

    const google = () => {
      storeAuth.loginGoogle();
      if (storeAuth.user) {
        router.push("/");
      }
    };
    const criarCadastro = () => {
      storeAuth.cadastrarUsuario(form.value.email, form.value.password);
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
