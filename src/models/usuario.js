interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  dataNascimento: Date;
  foto: string;
  ativo: boolean;
  admin: boolean;
  token: string;
}
