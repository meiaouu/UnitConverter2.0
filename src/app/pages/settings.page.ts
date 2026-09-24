import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  moonOutline,
  calculatorOutline,
  timeOutline,
  refreshOutline,
  chevronForwardOutline,
  informationCircleOutline,
  shieldCheckmarkOutline,
  documentTextOutline,
  trashOutline,
  settingsOutline
} from 'ionicons/icons';

import { AppStateService } from '../core/services/app-state.service';
import { Precision, ThemeMode } from '../core/models/models';
import { BottomNavComponent } from '../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-settings',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BottomNavComponent
  ],

  templateUrl: './settings.page.html'
})
export class SettingsPage implements OnInit {

  appearance: ThemeMode = 'dark';
  precision: Precision = 'auto';
  historyCount = 0;

  constructor(
    public state: AppStateService,
    private router: Router
  ) {
    addIcons({
      moonOutline,
      calculatorOutline,
      timeOutline,
      refreshOutline,
      chevronForwardOutline,
      informationCircleOutline,
      shieldCheckmarkOutline,
      documentTextOutline,
      trashOutline,
      settingsOutline
    });
  }

  ngOnInit(): void {
    this.syncSettings();
  }

  ionViewWillEnter(): void {
    this.syncSettings();
  }

  private syncSettings(): void {
    this.appearance = this.state.theme;
    this.precision = this.state.precision;
    this.historyCount = this.state.recent.length;
  }

  setAppearance(): void {
    this.state.setTheme(this.appearance);
  }

  setPrecision(): void {
    this.state.setPrecision(this.precision);
  }

  clearHistory(): void {
    this.state.clearRecent();
    this.historyCount = 0;
  }

  resetOnboarding(): void {
    this.state.resetOnboarding();

    this.router.navigateByUrl('/welcome', {
      replaceUrl: true
    });
  }

  go(path: string): void {
    this.router.navigateByUrl(path);
  }
}