import { Usuario } from "../usuario";

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}
