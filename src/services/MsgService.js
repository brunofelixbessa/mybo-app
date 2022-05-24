import { useQuasar, QSpinnerGears } from "quasar";
export default function useMsg() {
  const $q = useQuasar();

  const MsgSucesso = (message) => {
    $q.notify({
      progress: true,
      icon: "check",
      type: "positive",
      message: message || "Tudo Certo !",
    });
  };

  const MsgErro = (message) => {
    $q.notify({
      progress: true,
      icon: "warning",
      type: "negative",
      message: message || "Falha !",
    });
  };

  const MsgAviso = (message) => {
    $q.notify({
      progress: true,
      icon: "warning",
      type: "warning",
      message: message || "Aviso !",
    });
  };

  const MsgAguarde = (status) => {
    if (status) {
      $q.loading.show({
        message: "Aguarde...",
        boxClass: "bg-grey-2 text-grey-9",
        spinnerColor: "secondary",
        spinner: QSpinnerGears,
      });
    } else {
      $q.loading.hide();
    }
  };

  return {
    MsgSucesso,
    MsgErro,
    MsgAviso,
    MsgAguarde,
  };
}
