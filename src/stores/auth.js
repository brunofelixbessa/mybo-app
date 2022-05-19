import { defineStore } from "pinia";
//import { useRouter } from "vue-router";
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
    usuario: {},
    isAuthenticated: false,
  }),
  getters: {
    userOld(state) {
      return this.user;
    },
    isAuthenticatedOld() {
      return !!this.user;
    },
  },
  actions: {
    async loginGoogle() {
      const Google = new GoogleAuthProvider();
      //const router = useRouter();

      await signInWithPopup(auth, Google)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          this.usuario = result.user;
          this.isAuthenticated = true;
          //console.log("Usuario", this.usuario);
          // ... notyfication
          // ... router.push /home
          // router.push("/");
        })
        .catch((error) => {
          console.log("Erro" + error);
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    },
    async loginEmail(email, password) {
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          state.user = userCredential.user;
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    },
    async cadastrarUsuario(email, password) {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          state.user = userCredential.user;
          //alert("¡Registrado!");
        })
        .catch((error) => {
          const errorCode = error.code;
          this.errorMessage = error.message;
          //alert(this.errorMessage);
        });
    },
    async signout() {
      await signOut(auth)
        .then(() => {
          alert("Sessão finalizada!");
        })
        .catch((error) => {
          const errorCode = error.code;
          this.errorMessage = error.message;
          alert(this.errorMessage);
        });
    },
    verificaStatus() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          this.isAuthenticated = true;
          console.log(uid);
          // ...
        } else {
          this.isAuthenticated = false;
          // User is signed out
          // ...
        }
      });
    },
  },
});
