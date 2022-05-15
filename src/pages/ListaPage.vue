<template>
  <q-page class="bg-grey-3 colunm">
    <div class="row q-pa-sm bg-primary">
      <q-input
        bg-color="white"
        class="col"
        @keyup.enter="onClickAdd"
        outlined
        v-model="novaTarefa"
        type="text"
        placeholder="Adicionar tarefa"
      >
        <template v-slot:append>
          <q-btn color="primary" round icon="add" @click="onClickAdd" />
        </template>
      </q-input>
    </div>
    <q-list separator bordered class="bg-white">
      <q-item
        v-for="(item, index) in lista"
        :key="item.id"
        @click="item.marcado = !item.marcado"
        :class="{ 'checado bg-blue-1': item.marcado }"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-checkbox
            class="no-pointer-events"
            v-model="item.marcado"
            val="teal"
            color="primary"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.nome }}</q-item-label>
        </q-item-section>
        <q-item-section v-if="item.marcado" side>
          <q-btn
            @click.stop="excluirItem(index)"
            flat
            round
            color="primary"
            dense
            icon="delete"
          ></q-btn>
        </q-item-section>
      </q-item>
    </q-list>
    <div v-if="!lista.length" class="sem-tarefas absolute-center text-center">
      <q-icon name="info" color="primary" size="100px" />
      <div class="text-h5 text-primary text-center">Sem tarefas</div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar } from "quasar";

export default {
  name: "ListaPage",
  setup() {
    const $q = useQuasar();
    const lista = ref([
      {
        id: 1,
        nome: "Razvan",
        marcado: false,
      },
      {
        id: 2,
        nome: "Teste",
        marcado: true,
      },
    ]);
    const novaTarefa = ref("");

    //Metodos
    const excluirItem = (index) => {
      $q.dialog({
        title: "Confirm",
        message: "Quer realmente excluir o item?",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        lista.value.splice(index, 1);
        $q.notify({
          message: "Item excluido com sucesso",
          color: "positive",
        });
      });
    };
    const onClickAdd = () => {
      if (novaTarefa.value) {
        lista.value.push({
          id: lista.value.length + 1,
          nome: novaTarefa.value,
          marcado: false,
        });
        novaTarefa.value = "";
        $q.notify({
          message: "Item adicionado com sucesso",
          color: "positive",
        });
      } else {
        $q.notify({
          message: "Por favor, preencha o campo",
          color: "negative",
        });
      }
    };

    return {
      lista,
      novaTarefa,
      excluirItem,
      onClickAdd,
      dataHoje: "ok",
    };
  },
};
</script>

<style scoped>
.checado .q-item__label {
  color: #bbb;
  text-decoration: line-through;
}
.sem-tarefas {
  opacity: 0.5;
}
</style>
