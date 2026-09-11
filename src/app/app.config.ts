import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LucideArrowDown, LucideArrowLeftRight, LucideBanknote, LucideCar, LucideChartBarStacked, LucideCircleAlert, LucideDownload, LucideEllipsis, LucideGamepad2, LucideHouse, LucideLaptop, LucideLayoutDashboard, LucideLoaderCircle, LucideMonitor, LucideMoon, LucidePanelLeft, LucidePen, LucidePlus, LucideSearch, LucideSettings, LucideSettings2, LucideSun, LucideTrash, LucideTriangleAlert, LucideUtensils, LucideWalletCards, LucideX, provideLucideIcons } from '@lucide/angular';
import { routes } from './app.routes';
import { TemaService } from './core/services/tema.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(() => {
      inject(TemaService);
    }),
    provideLucideIcons(LucideLayoutDashboard, LucideArrowLeftRight, LucideChartBarStacked, LucideSettings, LucidePlus, LucidePanelLeft, LucideArrowDown, LucideSearch, LucidePen, LucideTrash, LucideX, LucideCircleAlert, LucideSettings2, LucideTriangleAlert, LucideUtensils, LucideHouse, LucideCar, LucideGamepad2, LucideLaptop, LucideBanknote, LucideWalletCards, LucideEllipsis, LucideLoaderCircle, LucideSun, LucideMoon, LucideMonitor, LucideDownload),
  ]
};
