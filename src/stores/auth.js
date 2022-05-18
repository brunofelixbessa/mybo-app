import { defineStore } from "pinia";
import { auth, signInWithPopup, GoogleAuthProvider } from "boot/firebase";

export const useAuth = defineStore("useAuthStore", {
  state: () => ({
    user: {},
  }),
  getters: {
    user(state) {
      return state.user;
    },
    isAuthenticated() {
      return !!state.user;
    },
  },
  actions: {
    loginGoogle() {
      const Google = new GoogleAuthProvider();
      signInWithPopup(auth, Google)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          state.user = result.user;
          // ...
        })
        .catch((error) => {
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
    register() {
      const { auth, createUserWithEmailAndPassword } = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          const user = userCredential.user;
          alert("¡Registrado!");
        })
        .catch((error) => {
          const errorCode = error.code;
          this.errorMessage = error.message;
          alert(this.errorMessage);
        });
    },
    signIn() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          alert("¡Sesión iniciada!");
          router.push("/auth");
          const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          this.errorMessage = error.message;
          alert(this.errorMessage);
        });
    },
    signout() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          alert("¡Sesión finalizada!");
        })
        .catch((error) => {
          const errorCode = error.code;
          this.errorMessage = error.message;
          alert(this.errorMessage);
        });
    },
  },
});
