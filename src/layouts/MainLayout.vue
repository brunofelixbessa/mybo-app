<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <!-- <q-toolbar-title> Quasar App </q-toolbar-title> -->

        <!-- <div>Quasar v9</div> -->
      </q-toolbar>
      <div class="q-px-lg q-pt-xl q-mb-md">
        <div class="text-h3">MyBO</div>
        <div class="text-sutitle">{{ dataHoje }}</div>
      </div>
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
          height: calc(100% - 185px);
          margin-top: 185px;
          border-right: 1px solid #232f34;
        "
      >
        <q-list padding>
          <q-item
            clickable
            :active="link === '/home'"
            active-class="my-menu-link"
            v-ripple
            to="/home"
          >
            <q-item-section avatar>
              <q-icon color="secondary" name="home" />
            </q-item-section>

            <q-item-section class="text-secondary"> Home </q-item-section>
          </q-item>

          <q-item
            clickable
            :active="link === 'lista'"
            active-class="my-menu-link"
            v-ripple
            to="/lista"
            color="secondary"
          >
            <q-item-section avatar>
              <q-icon color="secondary" name="list" />
            </q-item-section>

            <q-item-section class="text-secondary"> Lista </q-item-section>
          </q-item>

          <q-item
            clickable
            :active="link === 'send'"
            active-class="my-menu-link"
            v-ripple
          >
            <q-item-section avatar>
              <q-icon color="secondary" name="send" />
            </q-item-section>

            <q-item-section class="text-secondary"> Send </q-item-section>
          </q-item>

          <q-item
            clickable
            :active="link === 'drafts'"
            active-class="my-menu-link"
            v-ripple
          >
            <q-item-section avatar>
              <q-icon color="secondary" name="drafts" />
            </q-item-section>

            <q-item-section class="text-secondary"> Drafts </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="~assets/fundo.jpg" style="height: 185px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold">Razvan Stoenescu</div>
          <div>@rstoenescu</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { date } from "quasar";

export default defineComponent({
  name: "MainLayout",
  computed: {
    dataHoje() {
      let timeStamp = Date.now();
      return date.formatDate(timeStamp, "dddd, DD [de] MMMM [de] YYYY");
    },
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
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
