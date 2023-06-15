import { Notify, Loading, QSpinnerGears, copyToClipboard } from "quasar";

const MsgSucesso = (message) => {
  Notify.create({
    icon: "announcement",
    type: "positive",
    progress: true,
    multiLine: true,
    html: true,
    position: "top-right",
    message: message || "Tudo certo !",
  });
};
const MsgSucesso2 = (message) => {
  Notify.create({
    icon: "announcement",
    color: "teal",
    progress: true,
    multiLine: true,
    html: true,
    position: "top-right",
    message: message || "Tudo certo !",
  });
};
const MsgErro = (message) => {
  Notify.create({
    icon: "announcement",
    type: "negative",
    multiLine: true,
    progress: true,
    position: "top-right",
    message: message || "Falha !",
  });
};
const MsgAtencao = (message) => {
  Notify.create({
    icon: "announcement",
    type: "warning",
    multiLine: true,
    progress: true,
    html: true,
    position: "top-right",
    message: message || "Atenção !",
  });
};
const MsgCopia = (message) => {
  copyToClipboard(message);
  Notify.create({
    icon: "announcement",
    color: "purple",
    multiLine: true,
    progress: true,
    html: true,
    position: "top-right",
    message: "Copiado para a área de transferência",
  });
};
const MsgPermissao = (message) => {
  Notify.create({
    icon: "lock",
    multiLine: true,
    progress: true,
    position: "top-right",
    message: message || "Sem permissão !",
  });
};
const MsgOcupado = (status) => {
  if (status) {
    Loading.show({
      message: "Aguarde...",
      boxClass: "bg-grey-2 text-grey-9",
      spinnerColor: "secondary",
      spinner: QSpinnerGears,
    });
  } else {
    Loading.hide();
  }
};
const MsgAPI = (data, erro, message) => {
  //console.log(data, erro, message);
  try {
    //
    if (erro) MsgAtencao(message);
    else MsgSucesso(message);
    //

    if (data?.notifications) {
      let lista = MontaLista(data.notifications);
      if (lista) MsgAtencao(lista);
    }
    if (erro) {
      if (data.length > 0) {
        let lista = MontaLista(data);
        if (lista) MsgAtencao(lista);
      }
    }
  } catch (e) {
    console.log(e);
    //MsgErro("Erro desconhecido no serviço de MsgAPI.");
  }
};

const MontaLista = (lista) => {
  let listaRetorno = "";
  if (Array.isArray(lista)) {
    lista.forEach((element) => {
      listaRetorno =
        listaRetorno +
        " <strong>" +
        element.key +
        "</strong> " +
        element.message +
        "<br>";
    });
  } else {
    listaRetorno =
      listaRetorno + " <strong>Conteudo </strong> " + lista + "<br>";
  }

  return listaRetorno;
};

export {
  MsgSucesso,
  MsgErro,
  MsgAtencao,
  MsgPermissao,
  MsgOcupado,
  MsgAPI,
  MsgCopia,
};
