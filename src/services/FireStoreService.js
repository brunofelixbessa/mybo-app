import { ref } from "vue";
import {
  db,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "boot/firebase";
//import { doc, getDoc, setDoc } from "firebase/firestore";
import useMsg from "src/services/MsgService";

const result = ref(null);

export default function useFiretore() {
  const { MsgSucesso, MsgAviso } = useMsg();

  const salvarGrupo = async (data) => {
    const docRef = doc(db, "grupos", data.id);
    await setDoc(docRef, data)
      .then(() => {
        MsgSucesso("Grupo salvo com sucesso");
      })
      .catch(() => {
        MsgAviso("Erro desconhecido ao salvar grupo");
      });
  };

  const buscaUmGrupoCache = async (id) => {
    console.log("buscaUmGrupoCache", id);
    if (id) {
      const docRef = doc(db, "grupos", id);
      const doc = await getDoc(docRef);
      return doc;
    }
    // const docRef = doc(db, "grupos", id);
    // const docSnap = await getDoc(docRef);
    // console.log("Document data:", docSnap.data());
    // if (docSnap.exists()) {
    //   //console.log("Document data:", docSnap.data());
    //   return docSnap.data();
    // } else {
    //   console.log("No such document!");
    // }
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

  return {
    result,
    salvarGrupo,
    buscaUmGrupoCache,
    buscaUmGrupoSnap,
  };
}
