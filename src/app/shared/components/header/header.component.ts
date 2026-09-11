import { Component, DestroyRef, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { LucideDynamicIcon } from "@lucide/angular";
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [LucideDynamicIcon, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  usuarioNome: string | undefined;

  private readonly destroyRef = inject(DestroyRef);
  title: string = '';
  isOpen = false;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {

  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      let route = this.activatedRoute;

      while (route.firstChild) { route = route.firstChild; }
      this.title = route.snapshot.data['title'];
    })

    this.authService.usuario$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(usuario => {
      this.usuarioNome = usuario?.nome;
    });
  }


  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  fecharDropdown() {
    this.isOpen = false;
  }

  @ViewChild('profileMenu') profileMenu!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (event.target instanceof Node && !this.profileMenu.nativeElement.contains(event.target)) {
      this.fecharDropdown();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
