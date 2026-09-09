import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";

@Component({
  selector: 'app-main-layout',
  imports: [SidebarComponent, RouterOutlet, HeaderComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}
