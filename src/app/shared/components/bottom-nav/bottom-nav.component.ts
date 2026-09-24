import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  homeOutline,
  gridOutline,
  timeOutline,
  starOutline,
  settingsOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    IonIcon
  ],

  template: `
    <nav class="bottom-nav">

      <a
        routerLink="/home"
        [class.active]="active === 'home'"
      >
        <ion-icon name="home-outline"></ion-icon>
        <span>Home</span>
      </a>

      <a
        routerLink="/categories"
        [class.active]="active === 'categories'"
      >
        <ion-icon name="grid-outline"></ion-icon>
        <span>Categories</span>
      </a>

      <a
        routerLink="/recent"
        [class.active]="active === 'recent'"
      >
        <ion-icon name="time-outline"></ion-icon>
        <span>Recent</span>
      </a>

      <a
        routerLink="/favorites"
        [class.active]="active === 'favorites'"
      >
        <ion-icon name="star-outline"></ion-icon>
        <span>Favorites</span>
      </a>

      <a
        routerLink="/settings"
        [class.active]="active === 'settings'"
      >
        <ion-icon name="settings-outline"></ion-icon>
        <span>Settings</span>
      </a>

    </nav>
  `
})
export class BottomNavComponent {

  @Input() active = '';

  constructor() {
    addIcons({
      'home-outline': homeOutline,
      'grid-outline': gridOutline,
      'time-outline': timeOutline,
      'star-outline': starOutline,
      'settings-outline': settingsOutline
    });
  }
}