import { ref } from "vue";
import { db, doc, getDoc, setDoc } from "boot/firebase";
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
  const buscarAdministrador = () => {
    // const q = query(collection(db, "grupos"));
    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   snapshot.docChanges().forEach((change) => {
    //     if (change.type === "added") {
    //       console.log("New city: ", change.doc.data());
    //     }
    //     if (change.type === "modified") {
    //       console.log("Modified city: ", change.doc.data());
    //     }
    //     if (change.type === "removed") {
    //       console.log("Removed city: ", change.doc.data());
    //     }
    //   });
    // });
  };
  const buscaUmGrupo = async (id) => {
    const docRef = doc(db, "grupos", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Dados encontrados");
      return docSnap.data();
    } else {
      console.log("Sem dados de grupot!");
    }
  };
  const adcionarUmSubGrupo = async () => {};

  return {
    result,
    salvarGrupo,
    buscarAdministrador,
    buscaUmGrupo,
    adcionarUmSubGrupo,
  };
}
