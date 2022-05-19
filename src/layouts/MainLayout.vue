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
          <q-item
            clickable
            active-class="my-menu-link"
            v-ripple
            to="/home"
            exact
          >
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
        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="~assets/fundo.jpg" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar
            v-if="storeAuth.isAuthenticated"
            size="56px"
            class="q-mb-sm"
          >
            <img :src="storeAuth.usuario.photoURL" />
          </q-avatar>
          <q-avatar v-else color="primary" text-color="white">M</q-avatar>

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
import { defineComponent, ref, onBeforeMount } from "vue";
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

    return {
      storeAuth,
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
