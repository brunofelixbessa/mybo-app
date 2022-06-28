import { ref } from "vue";
import {
  db,
  doc,
  addDoc,
  getDoc,
  setDoc,
  collection,
  updateDoc,
  deleteField,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "boot/firebase";

import { useAuth } from "stores/auth";

import useMsg from "src/services/MsgService";

const result = ref(null);

export default function useFiretore() {
  const { MsgSucesso, MsgAviso } = useMsg();
  const storeAuth = useAuth();

  const salvarGrupo = async (data) => {
    try {
      const docRef = doc(db, "grupos", data.id);
      await setDoc(
        docRef,
        {
          ...data,
          atualizado: serverTimestamp(),
          id: docRef.id,
        },
        { merge: true }
      );
      MsgSucesso("Grupo salvo com sucesso!");

      const usuario = storeAuth.getUser;
      usuario.grupoMaster = docRef.id;
      storeAuth.guardaUsuario(); // Guarda dados novos do usuario no stoarage
    } catch (error) {
      console.log(error);
      MsgAviso("Erro ao salvar grupo!");
    }
  };

  const buscaUmGrupoCache = async (id) => {
    try {
      const docRef = doc(db, "grupos", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        MsgAviso("Grupo master não encontrado!");
      }
    } catch (error) {
      console.log(error);
      MsgAviso("Erro ao buscar grupo!");
    }
  };
  const buscaUmGrupoQuery = async (chave, valor) => {
    const q = query(collection(db, "grupos"), where(chave, "==", valor));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  };
  const buscaUmGrupoSnap = async (id) => {
    const unsub = onSnapshot(doc(db, "cities", "SF"), (doc) => {
      console.log("Current data: ", doc.data());
    });
    return unsub;
  };

  const removerSubGrupo = async (data) => {
    const docRef = doc(db, "grupos", data.id);
    await updateDoc(docRef, {
      subgrupos: deleteField(),
    });
  };

  return {
    result,
    salvarGrupo,
    buscaUmGrupoCache,
    buscaUmGrupoSnap,
    removerSubGrupo,
  };
}
