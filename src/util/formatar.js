import { date, exportFile } from "quasar";

const DataInicio = () => {
  const timeStamp = Date.now();
  const inicio = date.startOfDate(timeStamp, "month");
  const resultado = date.formatDate(inicio, "DD/MM/YYYY");
  return resultado;
};

const DataFim = () => {
  const timeStamp = Date.now();
  const fim = date.endOfDate(timeStamp, "month");
  const resultado = date.formatDate(fim, "DD/MM/YYYY");
  return resultado;
};

const Hoje = () => {
  const timeStamp = Date.now();
  const resultado = date.formatDate(timeStamp, "DD/MM/YYYY");
  return resultado;
};

const HojeHoras = () => {
  const timeStamp = Date.now();
  const resultado = date.formatDate(timeStamp, "DD/MM/YYYY HH:mm:ss");
  return resultado;
};

const Amanha = () => {
  const hoje = Date.now();
  const amanha = date.addToDate(hoje, { days: 1 });
  const resultado = date.formatDate(amanha, "DD/MM/YYYY");
  return resultado;
};

const dataVenc = () => {
  // data de vencimento solicitada pela Luana (dia 10 de todo mês posterior)
  const dataAtual = Date.now();

  const proximoMes = date.addToDate(dataAtual, { months: 1 });

  const resultado = date.formatDate(proximoMes, "10/MM/YYYY");

  return resultado;
};

const HojeUTC = () => {
  const timeStamp = Date.now();
  const resultado = date.formatDate(timeStamp, "YYYY-MM-DDTHH:mm:ss.SSSZ");
  return resultado;
};

const HojeSIMP = () => {
  const timeStamp = Date.now();
  const resultado = date.formatDate(timeStamp, "YYYY-MM-DD HH:mm:ss");
  return resultado;
};

const Datado = (data) => {
  const resultado = date.formatDate(data, "DD/MM/YYYY");
  return resultado;
};

const DatadoHoras = (data) => {
  const resultado = date.formatDate(data, "DD/MM/YYYY HH:mm:ss");
  return resultado;
};

const DatadoAPI = (data) => {
  const dt = date.extractDate(data, "DD/MM/YYYY");
  const resultado = date.formatDate(dt, "YYYY-MM-DD");
  return resultado;
};

const DatadoUTC = (data) => {
  const dt = date.extractDate(data, "DD/MM/YYYY");
  const resultado = date.formatDate(dt, "YYYY-MM-DDTHH:mm:ss.SSSZ");
  return resultado;
};

const DatadoHorasUTC = (data) => {
  const dt = date.extractDate(data, "DD/MM/YYYY HH:mm");
  const resultado = date.formatDate(dt, "YYYY-MM-DDTHH:mm:ss.SSSZ");
  return resultado;
};

const MoedaBR = (valor) => {
  //console.log(valor);
  const aux = valor.toString().indexOf(",");
  if (aux > -1) {
    // Aqui devolve como numero caso venha formatado
    const aux = valor.toString().replace("R$", "");
    //console.log(aux);
    const aux1 = aux.toString().replace(".", "");
    //console.log(aux1);
    const aux2 = aux1.toString().replace(",", ".");
    //console.log(aux2);
    return parseFloat(aux2);
  } else {
    // Aqui devolve fomatado caso venha como numero
    const resultado = valor.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
    //console.log(resultado);
    return resultado;
  }
};

const Sub15 = (data) => {
  if (data) {
    if (data.toString().length > 15) {
      return data.toString().substring(0, 15) + "...";
    }
  }
  return data;
};
const Sub30 = (data) => {
  if (data) {
    if (data.toString().length > 30) {
      return data.toString().substring(0, 30) + "...";
    }
  }
  return data;
};

const ajustaLinhasCSV = (val, formatFn, row) => {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;
  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);
  //
  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
};

const exportarTabela = (linhas, colunas) => {
  const content = [colunas.map((col) => ajustaLinhasCSV(col.label)).join(";")]
    .concat(
      linhas.map((row) =>
        colunas
          .map((col) =>
            ajustaLinhasCSV(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(";")
      )
    )
    .join("\r\n");

  const status = exportFile(
    "TabelaExportada.csv",
    "\ufeff" + content,
    "text/csv"
  );
  if (status !== true) console.log("Não foi possível fazer o download...");
};

export {
  Sub15,
  Sub30,
  exportarTabela,
  MoedaBR,
  Hoje,
  HojeUTC,
  Datado,
  DatadoUTC,
  DatadoHorasUTC,
  DataInicio,
  DataFim,
  HojeHoras,
  //DatadoTransacao,
  HojeSIMP,
  DatadoAPI,
  DatadoHoras,
  Amanha,
  dataVenc,
};
