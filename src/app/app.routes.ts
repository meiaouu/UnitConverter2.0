import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'launch'
  },

  {
    path: 'launch',
    loadComponent: () =>
      import('./pages/launch.page')
        .then(m => m.LaunchPage)
  },

  {
    path: 'welcome',
    loadComponent: () =>
      import('./pages/welcome.page')
        .then(m => m.WelcomePage)
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home.page')
        .then(m => m.HomePage)
  },

  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/categories.page')
        .then(m => m.CategoriesPage)
  },

  {
    path: 'converter/:category',
    loadComponent: () =>
      import('./pages/converter.page')
        .then(m => m.ConverterPage)
  },

  {
    path: 'recent',
    loadComponent: () =>
      import('./pages/recent.page')
        .then(m => m.RecentPage)
  },

  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites.page')
        .then(m => m.FavoritesPage)
  },

  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings.page')
        .then(m => m.SettingsPage)
  },

  /*
   * ABOUT
   */
  {
    path: 'about',
    redirectTo: 'info/about',
    pathMatch: 'full'
  },

  /*
   * PRIVACY POLICY
   */
  {
    path: 'privacy',
    redirectTo: 'info/privacy',
    pathMatch: 'full'
  },

  /*
   * TERMS OF USE
   */
  {
    path: 'terms',
    redirectTo: 'info/terms',
    pathMatch: 'full'
  },

  /*
   * SHARED INFORMATION PAGE
   *
   * /info/about
   * /info/privacy
   * /info/terms
   */
  {
    path: 'info/:type',
    loadComponent: () =>
      import('./pages/info.page')
        .then(m => m.InfoPage)
  },

  /*
   * FALLBACK
   */
  {
    path: '**',
    redirectTo: 'launch'
  }

];