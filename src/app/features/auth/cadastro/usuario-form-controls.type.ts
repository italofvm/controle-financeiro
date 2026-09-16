import { FormControl } from "@angular/forms";

type UsuarioFormControls = {
  nome: FormControl<string>;
  email: FormControl<string>;
  senha: FormControl<string>;
  confirmarSenha: FormControl<string>;
}

export default UsuarioFormControls;
