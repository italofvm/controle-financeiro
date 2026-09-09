import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LucideArrowDown, LucideArrowLeftRight, LucideBanknote, LucideCar, LucideChartBarStacked, LucideCircleAlert, LucideEllipsis, LucideGamepad2, LucideHouse, LucideLaptop, LucideLayoutDashboard, LucidePanelLeft, LucidePen, LucidePlus, LucideSearch, LucideSettings, LucideSettings2, LucideTrash, LucideTriangleAlert, LucideUtensils, LucideWalletCards, LucideX, provideLucideIcons } from '@lucide/angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideLucideIcons(LucideLayoutDashboard, LucideArrowLeftRight, LucideChartBarStacked, LucideSettings, LucidePlus, LucidePanelLeft, LucideArrowDown, LucideSearch, LucidePen, LucideTrash, LucideX, LucideCircleAlert, LucideSettings2, LucideTriangleAlert, LucideUtensils, LucideHouse, LucideCar, LucideGamepad2, LucideLaptop, LucideBanknote, LucideWalletCards, LucideEllipsis),
  ]
};
