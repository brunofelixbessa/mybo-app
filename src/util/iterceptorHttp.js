import { apiGrupovab } from "boot/axios";
import { useAuth } from "stores/auth";
import { MsgPermissao, MsgErro } from "/src/util/useMsg";

export const addInterceptors = (Router) => {
  const store = useAuth();

  apiGrupovab.interceptors.response.use(
    (response) => {
      //commonStore.REMOVE_REQUEST();
      //console.log("Tem response", response); // Aqui mostra todas as respostas do servidor
      return response;
    },
    async (error) => {
      //commonStore.REMOVE_REQUEST();
      //Router.currentRoute.value.path.includes("lock")
      // console.log(
      //   "Error response",
      //   error.config.url,
      //   Router.currentRoute.value
      // );
      // Aqui mostra todas as respostas do servidor que derem algum erro
      if (!error.response) {
        "Error 1", error.response;
        MsgPermissao(
          "Falha de conexão com a API. Informe o setor responsavel."
        );
        // Aqui deloga e vai pra login
        store.signOut();
        Router.push("/login");
        return Promise.reject(
          new Error("Falha de conexão, tente novamente mais tarde!")
        );
      }

      // Apenas para erros de falta de permissão
      if (error.response.status === 403) {
        MsgPermissao(
          "403 - Usuário sem permissão nessa rota! => " + error.config.url
        );
      }

      // Apenas para erros de falta de autorização
      // TODO deslogar e mandar para tela de login
      if (error.response.status === 401) {
        MsgPermissao(
          "401 - Usuário não autorizado! Verifique seu login e senha."
        );

        // Aqui deloga e vai pra login
        store.signOut();
        Router.push("/login");

        if (Router.currentRoute.value.path.includes("lock"))
          return Promise.resolve();

        // console.log("Error 2", Router.currentRoute.value.path); // Pega a rota atual que gerou a requisição

        // // Ainda precisa fazer o refresh token
        // if (error.config.url.includes("refresh")) {
        //   console.log("Error 3", error);
        //   commonStore.ADD_REQUEST();
        //   storage.setBlocked(true);
        //   await authStore.SET_BLOCK(true).then(() => {
        //     Router.push({
        //       name: "Lock Screen",
        //       query: { to: Router.currentRoute.value.path },
        //     });
        //   });
        // } else if (
        //   !error.config.url.includes("create") &&
        //   !error.config.url.includes("refresh") &&
        //   !error.config.url.includes("verify")
        // ) {
        //   try {
        //     console.log("Error 4", error);
        //     //commonStore.ADD_REQUEST();
        //     //await authStore.VALID_TOKEN(authStore.getUserToken?.access);
        //   } catch (error) {
        //     console.log("Error 5", error);
        //     //commonStore.REMOVE_REQUEST();
        //     if (authStore.isBlocked)
        //       Router.push({
        //         name: "Lock Screen",
        //         query: { to: Router.currentRoute.value.path },
        //       });
        //     else {
        //       // commonStore.ADD_REQUEST();
        //       await authStore.SIGN_OUT();
        //       Router.push({
        //         path: "/login",
        //         query: { to: Router.currentRoute.value.path },
        //       });
        //     }
        //   }
        // }
        return Promise.reject(error);
      } else return Promise.reject(error);
    }
  );
};
