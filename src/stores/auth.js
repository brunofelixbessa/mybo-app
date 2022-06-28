import { defineStore } from "pinia";

import {
  auth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  db,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateProfile,
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
    // Testando actions
    async login(form) {
      const { email, password } = form;
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        switch (error.code) {
          case "auth/user-not-found":
            alert("User not found");
            break;
          case "auth/wrong-password":
            alert("Wrong password");
            break;
          default:
            alert("Something went wrong");
        }
        return;
      }
      this.usuario = auth.currentUser;
    },
    // Fim teste actions
    async loginGoogle() {
      await signInWithPopup(auth, new GoogleAuthProvider())
        .then((result) => {
          this.buscaUsuario(result.user);
          //this.atualizaUsuarioNoFirestore(result.user);
        })
        .catch((error) => {
          console.log(error);
          //this.removeUsuario(error.message);
        });
    },
    async loginEmail(form) {
      await signInWithEmailAndPassword(auth, form.email, form.password)
        .then((result) => {
          //this.guardaUsuario(result.user);
          //this.usuario.nome = result.user;
          //this.atualizaUsuarioNoFirestore();
        })
        .catch((error) => {
          this.removeUsuario(error.message);
        });
    },
    async cadastrarUsuario(form) {
      await createUserWithEmailAndPassword(auth, form.email, form.password)
        .then((result) => {
          // Cadastra e já loga
          if (result) {
            //console.log(result);
            //this.hidrataUsuario(result.user);
            //this.usuario.displayName = form.nome; // Adiciona o nome e atualiza o profile
            //this.atualizarProfile();
          }
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/email-already-in-use":
              alert("Email já está cadastrado.");
              break;
            case "auth/invalid-email":
              alert("Invalid email");
              break;
            case "auth/operation-not-allowed":
              alert("Operation not allowed");
              break;
            case "auth/weak-password":
              alert("Weak password");
              break;
            default:
              alert("Erro desconhecido.");
          }
          //console.log(error);
          this.removeUsuario(error.message);
        });
    },
    async atualizarProfile() {
      await updateProfile(auth.currentUser, {
        displayName: this.usuario.displayName,
        photoURL: "https://cdn.quasar.dev/logo-v2/svg/logo.svg",
      })
        .then(() => {
          // Profile updated!
          this.atualizaUsuarioNoFirestore(this.usuario);
          this.buscaUsuario(this.usuario);
        })
        .catch((error) => {
          console.log(error);
          // An error occurred
          // ...
        });
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
    async buscaUsuario(user) {
      try {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        //console.log("Buscando", docSnap.data());
        if (docSnap.exists) {
          console.log("Usuario encontrado", docSnap.data());
          this.usuario = docSnap.data(); // Se existe, pega os dados do usuario
          window.localStorage.setItem("usuario", JSON.stringify(this.usuario)); // Salva no localStorage
        } else {
          console.log("Usuario não encontrado");
          thi.atualizaUsuarioNoFirestore(user);
          window.localStorage.setItem("usuario", JSON.stringify(this.usuario)); // Salva no localStorage
        }
      } catch (error) {
        console.log(error.message);
      }
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
    async atualizaUsuarioNoFirestore(user) {
      try {
        const docRef = doc(db, "usuarios", user.uid);
        await setDoc(
          docRef,
          {
            ...this.usuario,
            atualizado: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (error) {
        console.log(error);
      }
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
    setAdmin() {
      this.usuario.admin = true;
      this.usuario.leitor = true;
      this.usuario.editor = true;
      this.atualizaUsuarioNoFirestore(this.usuario);
    },
  },
});
