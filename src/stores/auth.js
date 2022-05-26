import { defineStore } from "pinia";
import { db } from "boot/firebase";
import { doc, setDoc } from "firebase/firestore";

import {
  auth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
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
      status: "",
      permissoes: ["ler", "editar", "baixar"], //Leitor , Editor, Admin
    },
    isAuthenticated: false,
  }),
  getters: {
    userID() {
      return !!this.uid;
    },
    isAuthenticatedOld() {
      return !!this.usuario;
    },
  },
  actions: {
    async loginGoogle() {
      const Google = new GoogleAuthProvider();

      await signInWithPopup(auth, Google)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          //const token = credential.accessToken;
          this.setUsuario(result.user);
        })
        .catch((error) => {
          this.removeUsuario(error.message);
        });
    },
    async loginEmail(email, password) {
      await signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          this.setUsuario(result.user);
        })
        .catch((error) => {
          this.removeUsuario(error.message);
        });
    },
    async cadastrarUsuario(email, password) {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          //Cadastra e já loga
          this.loginEmail(email, password);
        })
        .catch((error) => {
          this.removeUsuario(error.message);
        });
    },
    async signout() {
      await signOut(auth)
        .then(() => {
          this.removeUsuario("Usuario deslogado logout");
        })
        .catch((error) => {
          this.removeUsuario(error.message);
        });
    },
    verificaStatus() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.getUsuario(user);
          console.log("Usuario logado");
        } else {
          this.removeUsuario("Usuario deslogado status");
        }
      });
    },
    setUsuario(user) {
      this.usuario = user; // Hidrata a variavel interna e salva localmente
      window.localStorage.setItem("usuario", JSON.stringify(this.usuario));
      this.atualizaUsuarioNoFirestore(this.usuario); //Salva no firestore
      this.getUsuario(); // So depois pega do storage local
    },
    getUsuario() {
      const user = JSON.parse(window.localStorage.getItem("usuario"));
      //console.log("getUsuario", result);
      if (user) {
        this.usuario = user;
        this.isAuthenticated = true;
      }
    },
    removeUsuario() {
      this.usuario = {};
      this.isAuthenticated = false;
      window.localStorage.removeItem("usuario");
    },
    async atualizaUsuarioNoFirestore(user) {
      await setDoc(doc(db, "usuarios", user.uid), user);
    },
    async atualizarEmailDoUSuario(emailNovo) {
      await updateEmail(auth.currentUser, emailNovo)
        .then(() => {
          // Email updated!
          // ...
        })
        .catch((error) => {
          // An error occurred
          // ...
        });
    },
    async enviarEmailDeVerificacao() {
      await sendEmailVerification(auth.currentUser).then(() => {
        // Email verification sent!
        // ...
      });
    },
    async redefinirSenhaDoUsuario() {
      const user = auth.currentUser;
      const newPassword = getASecureRandomPassword();

      await updatePassword(user, newPassword)
        .then(() => {
          // Update successful.
        })
        .catch((error) => {
          // An error ocurred
          // ...
        });
    },
    async emailDeRedefinicaoDeSenha(email) {
      await sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          // ..
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    },
  },
});
