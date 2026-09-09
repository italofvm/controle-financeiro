import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from "./layout/main-layout/main-layout.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainLayoutComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'controle-financeiro';
}
