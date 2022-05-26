<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          color="secondary"
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-space />
        <div class="flex flex-center" style="height: 150px">
          <span class="text-h3">MyBO</span>
        </div>
        <q-space />
      </q-toolbar>

      <q-img src="~assets/fundo.jpg" class="header-img absolute-top" />
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="250"
      :breakpoint="600"
      class="bg-primary"
    >
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #232f34;
        "
      >
        <q-list padding>
          <q-item clickable active-class="my-menu-link" v-ripple to="/" exact>
            <q-item-section avatar>
              <q-icon color="secondary" name="home" />
            </q-item-section>

            <q-item-section class="text-secondary"> Home </q-item-section>
          </q-item>

          <q-item
            clickable
            active-class="my-menu-link"
            v-ripple
            to="/lista"
            exact
            color="secondary"
          >
            <q-item-section avatar>
              <q-icon color="secondary" name="list" />
            </q-item-section>

            <q-item-section class="text-secondary"> Lista </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon color="secondary" name="send" />
            </q-item-section>

            <q-item-section class="text-secondary"> Send </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon color="secondary" name="drafts" />
            </q-item-section>

            <q-item-section class="text-secondary"> Drafts </q-item-section>
          </q-item>

          <q-item
            v-if="storeAuth.isAuthenticated"
            clickable
            v-ripple
            to="/admin"
            exact
          >
            <q-item-section avatar>
              <q-icon color="secondary" name="settings" />
            </q-item-section>

            <q-item-section class="text-secondary">
              Configuração
            </q-item-section>
          </q-item>

          <!-- Versao -->
          <q-item class="absolute-bottom" clickable v-ripple>
            <q-item-section avatar>
              <q-icon color="secondary" name="info" />
            </q-item-section>

            <q-item-section class="text-secondary"> v1.0 </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="~assets/fundo.jpg" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-btn
            round
            v-if="storeAuth.isAuthenticated"
            @click="sairDoSistema()"
          >
            <q-avatar size="42px">
              <img :src="storeAuth.usuario.photoURL" />
            </q-avatar>
          </q-btn>

          <q-btn v-else round color="secondary" icon="login" to="/login" />

          <div class="text-weight-bold">
            {{ storeAuth.usuario.displayName }}
          </div>
          <div>{{ storeAuth.usuario.email }}</div>
          <!-- <div>{{ dataHoje }}</div> -->
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
//import { date } from "quasar";
import { useAuth } from "stores/auth";

export default defineComponent({
  name: "MainLayout",
  // computed: {
  //   dataHoje() {
  //     let timeStamp = Date.now();
  //     return date.formatDate(timeStamp, "dddd, DD [de] MMMM [de] YYYY");
  //   },
  // },

  setup() {
    const leftDrawerOpen = ref(false);
    const storeAuth = useAuth();
    const router = useRouter();

    onMounted(() => {
      storeAuth.getUsuario();
      //console.log(storeAuth.isAuthenticated);
    });

    const sairDoSistema = () => {
      storeAuth.signout();
      router.push("/login");
    };

    return {
      storeAuth,
      sairDoSistema,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
<style scoped>
.header-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.2;
  filter: grayscale(100%);
}
.my-menu-link {
  background-color: #232f34;
}
</style>
