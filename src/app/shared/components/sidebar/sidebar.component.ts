import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgClass, LucideDynamicIcon],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  linkAtivo: string = '';
  isCollapsed: boolean = false;

  ativarLink(nomeLink: string) {
    this.linkAtivo = nomeLink;
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
