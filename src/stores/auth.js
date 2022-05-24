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
    uid: "",
    usuario: {},
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
          this.setUsuario(user);
          console.log("Usuario logado");
        } else {
          this.removeUsuario("Usuario deslogado status");
        }
      });
    },
    setUsuario(usuario) {
      this.usuario = usuario;
      this.isAuthenticated = true;
      this.uid = usuario.uid;
      window.localStorage.setItem("usuario", JSON.stringify(usuario));
      this.atualizaUsuarioNoFirestore();
    },
    getUsuario() {
      const result = JSON.parse(window.localStorage.getItem("usuario"));
      console.log("getUsuario", result);
      if (result) {
        this.usuario = result;
        console.log("Aqui", this.uid);
        this.uid = result.uid;
        this.isAuthenticated = true;
      } else {
        this.removeUsuario("Removido usuario localStorage");
      }
    },
    removeUsuario(msg) {
      this.usuario = {};
      this.isAuthenticated = false;
      this.uid = "";
      window.localStorage.removeItem("usuario");
      console.log(msg);
    },
    async atualizaUsuarioNoFirestore() {
      await setDoc(doc(db, "usuarios", this.usuario.uid), {
        uid: this.usuario.uid,
        email: this.usuario.email,
        nome: this.usuario.displayName,
        foto: this.usuario.photoURL,
        emailVerificado: this.usuario.emailVerified,
        status: true,
      });
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
