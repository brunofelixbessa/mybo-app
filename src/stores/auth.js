import { defineStore } from "pinia";
import { MsgAtencao, MsgErro, MsgSucesso, MsgOcupado } from "/src/util/useMsg";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  db,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "boot/firebase";

export const useAuth = defineStore("useAuthStore", {
  state: () => ({
    usuario: {
      uid: "",
      email: "",
      displayName: "",
      photoURL: "",
      emailVerified: false,
      grupoMaster: "",
      subGrupo: "",
      ativo: true,
      admin: true,
      leitor: true,
      editor: true,
    },
    isAuthenticated: false,
  }),
  getters: {
    getUser: (state) => state.usuario,
    //isAuthenticated: (state) => state.authenticated,
  },
  actions: {
    async loginEmail(form) {
      MsgOcupado(true);
      await signInWithEmailAndPassword(auth, form.email, form.password)
        .then((result) => {
          //console.log(result);
          //this.guardaUsuario(result.user);
          this.hidrataUsuario(result.user);
          this.usuario.nome = result.user;
          this.atualizaUsuarioNoFirestore();
          MsgSucesso("Logado com sucesso");
        })
        .catch((error) => {
          //console.log(error.code);
          switch (error.code) {
            case "auth/invalid-email":
              MsgAtencao("Email ou senha inválido.");
              break;
            default:
              MsgErro("Erro desconhecido.");
          }
          //console.log(error);
          this.removeUsuario(error.message);
        });
      MsgOcupado(false);
    },
    async cadastrarUsuario(form) {
      //console.log(form);
      MsgOcupado(true);
      await createUserWithEmailAndPassword(auth, form.email, form.password)
        .then((result) => {
          // Cadastra e já loga
          if (result) {
            console.log(result);
            this.hidrataUsuario(result.user);
            this.usuario.displayName = form.nome; // Adiciona o nome e atualiza o profile
            this.atualizarProfile();
            MsgSucesso("Logado com sucesso");
          }
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/email-already-in-use":
              MsgAtencao("Email já está cadastrado.");
              break;
            case "auth/invalid-email":
              MsgAtencao("Invalid email");
              break;
            case "auth/operation-not-allowed":
              MsgAtencao("Operation not allowed");
              break;
            case "auth/weak-password":
              MsgAtencao("Weak password");
              break;
            default:
              MsgErro("Erro desconhecido.");
          }
          console.log(error);
          this.removeUsuario(error.message);
        });
      MsgOcupado(false);
    },
    async verificaStatus() {
      this.usuario = JSON.parse(window.localStorage.getItem("usuario")); // Busca localstorage
      await onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("verificaStatus Usuario logado ", user);
          this.isAuthenticated = true;
          //this.buscaUsuario(user);
        } else {
          this.isAuthenticated = false;
          this.removeUsuario();
        }
      });
    },
    hidrataUsuario(user) {
      this.usuario.uid = user.uid;
      this.usuario.email = user.email;
      this.usuario.displayName = user.displayName || "nome não definido";
      this.usuario.photoURL = user.photoURL;
      this.usuario.emailVerified = user.emailVerified;
      this.usuario.grupoMaster = user.grupoMaster || "";
      this.usuario.subGrupo = user.subGrupo || "";
      this.usuario.ativo = user.ativo || true;
      this.usuario.admin = user.admin || true;
      this.usuario.leitor = user.leitor || true;
      this.usuario.editor = user.editor || true;
    },
    async removeUsuario() {
      signOut(auth)
        .then(() => {
          this.usuario = {};
          this.isAuthenticated = false;
          window.localStorage.removeItem("usuario");
          console.log("Usuario deslogado...");
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
    async atualizaUsuarioNoFirestore() {
      //
      const docRef = doc(db, "usuarios", this.usuario.uid);
      console.log(docRef);
      await setDoc(
        docRef,
        {
          ...this.usuario,
          atualizado: serverTimestamp(),
        },
        { merge: true }
      )
        .then((result) => {
          console.log(result, 3);
        })
        .catch((error) => {
          console.log(error, 2);
        });
    },
  },
});
