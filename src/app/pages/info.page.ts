import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  calculatorOutline,
  shieldCheckmarkOutline,
  documentTextOutline
} from 'ionicons/icons';

type InfoPageType = 'about' | 'privacy' | 'terms';

@Component({
  selector: 'app-info',
  standalone: true,

  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon
  ],

  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button
            (click)="back()"
            aria-label="Go back"
          >
            <ion-icon name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <main class="info-shell">

        <!-- ABOUT -->
        <ng-container *ngIf="page === 'about'">

          <div class="info-hero">
            <div class="info-icon">
              <ion-icon name="calculator-outline"></ion-icon>
            </div>

            <p class="eyebrow">UNIT CONVERTER</p>

            <h1 class="hero-title">
              About
            </h1>

            <p class="intro">
              A fast, simple and privacy-friendly unit conversion
              application designed to work directly on your device.
            </p>
          </div>

          <section class="info-card">
            <h2>About Unit Converter</h2>

            <p>
              Unit Converter helps you quickly convert measurements
              between commonly used units. It includes everyday
              conversions as well as science and engineering
              categories.
            </p>

            <p>
              The application is designed to be easy to use on phones,
              tablets and desktop computers.
            </p>
          </section>

          <section class="info-card">
            <h2>Features</h2>

            <ul>
              <li>Instant unit conversions</li>
              <li>Multiple conversion categories</li>
              <li>Recent conversion history</li>
              <li>Favorite conversion pairs</li>
              <li>Quick conversion shortcuts</li>
              <li>Dark, light and system themes</li>
              <li>Adjustable decimal precision</li>
              <li>Offline-friendly operation</li>
            </ul>
          </section>

          <section class="info-card">
            <h2>Privacy first</h2>

            <p>
              Your recent conversions, favorites, preferences and
              application settings are stored locally on your device.
            </p>

            <p>
              Unit Converter does not require an account to perform
              standard unit conversions.
            </p>
          </section>

          <section class="info-card">
            <h2>Version</h2>

            <p>
              Unit Converter 1.0.0
            </p>
          </section>

        </ng-container>

        <!-- PRIVACY -->
        <ng-container *ngIf="page === 'privacy'">

          <div class="info-hero">
            <div class="info-icon">
              <ion-icon name="shield-checkmark-outline"></ion-icon>
            </div>

            <p class="eyebrow">YOUR PRIVACY</p>

            <h1 class="hero-title">
              Privacy Policy
            </h1>

            <p class="intro">
              This policy explains how Unit Converter handles
              information while you use the application.
            </p>
          </div>

          <section class="info-card">
            <h2>Information stored on your device</h2>

            <p>
              Unit Converter may store application preferences and
              usage information locally in your browser or device
              storage so that features continue to work between
              sessions.
            </p>

            <p>This may include:</p>

            <ul>
              <li>Recent conversions</li>
              <li>Favorite conversion pairs</li>
              <li>Most-used conversion categories</li>
              <li>Theme preference</li>
              <li>Decimal precision preference</li>
              <li>Onboarding status</li>
            </ul>
          </section>

          <section class="info-card">
            <h2>Conversion data</h2>

            <p>
              Standard unit conversions are performed by the
              application itself. Your locally saved conversion
              history is used to provide features such as Recent
              Conversions.
            </p>
          </section>

          <section class="info-card">
            <h2>Local storage</h2>

            <p>
              Application settings and history may be stored using
              local storage on your device. Clearing your browser or
              application storage may remove this information.
            </p>
          </section>

          <section class="info-card">
            <h2>Sharing</h2>

            <p>
              Unit Converter includes optional copy and share
              functions. Information is only passed to the clipboard
              or your device's sharing interface when you choose to
              use those features.
            </p>
          </section>

          <section class="info-card">
            <h2>Changes to this policy</h2>

            <p>
              This Privacy Policy may be updated as the application
              changes. The policy included with the current version of
              the application applies to that version.
            </p>
          </section>

          <p class="policy-date">
            Last updated: September 2026
          </p>

        </ng-container>

        <!-- TERMS -->
        <ng-container *ngIf="page === 'terms'">

          <div class="info-hero">
            <div class="info-icon">
              <ion-icon name="document-text-outline"></ion-icon>
            </div>

            <p class="eyebrow">APPLICATION TERMS</p>

            <h1 class="hero-title">
              Terms of Use
            </h1>

            <p class="intro">
              These terms describe the conditions for using Unit
              Converter.
            </p>
          </div>

          <section class="info-card">
            <h2>Use of the application</h2>

            <p>
              Unit Converter is provided as a general-purpose tool for
              converting measurements between supported units.
            </p>

            <p>
              You may use the application for personal, educational
              and general informational purposes.
            </p>
          </section>

          <section class="info-card">
            <h2>Conversion results</h2>

            <p>
              Reasonable care is taken to provide accurate conversion
              calculations. However, results may be affected by
              rounding, selected precision, unit definitions or
              software errors.
            </p>

            <p>
              You should independently verify results when they are
              being used for safety-critical, medical, scientific,
              engineering, financial, legal or other high-risk
              decisions.
            </p>
          </section>

          <section class="info-card">
            <h2>No warranty</h2>

            <p>
              The application is provided on an "as is" and "as
              available" basis without guarantees that it will always
              be error-free, uninterrupted or suitable for every
              purpose.
            </p>
          </section>

          <section class="info-card">
            <h2>Your responsibilities</h2>

            <p>
              You are responsible for reviewing conversion results and
              determining whether they are appropriate for your
              intended use.
            </p>
          </section>

          <section class="info-card">
            <h2>Application changes</h2>

            <p>
              Features, supported units and these terms may be changed
              as the application is developed and updated.
            </p>
          </section>

          <p class="policy-date">
            Last updated: September 2026
          </p>

        </ng-container>

      </main>
    </ion-content>
  `,

  styles: [`
    .info-hero {
      margin-bottom: 26px;
    }

    .info-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;

      display: grid;
      place-items: center;

      background:
        color-mix(
          in srgb,
          var(--uc-accent) 15%,
          var(--uc-surface)
        );

      border:
        1px solid
        color-mix(
          in srgb,
          var(--uc-accent) 30%,
          var(--uc-border)
        );

      color: var(--uc-accent);

      margin-bottom: 16px;
    }

    .info-icon ion-icon {
      font-size: 28px;
    }

    .info-card {
      width: 100%;

      background: var(--uc-surface);

      border:
        1px solid
        var(--uc-border);

      border-radius: 16px;

      padding: 20px;

      margin-bottom: 14px;
    }

    .info-card h2 {
      margin: 0 0 12px;

      color: var(--uc-text);

      font-size: 18px;
    }

    .info-card p {
      margin: 0 0 12px;

      color: var(--uc-muted);

      line-height: 1.7;
    }

    .info-card p:last-child {
      margin-bottom: 0;
    }

    .info-card ul {
      margin: 10px 0 0;
      padding-left: 22px;

      color: var(--uc-muted);

      line-height: 1.8;
    }

    .policy-date {
      color: var(--uc-muted);

      font-size: 13px;

      margin:
        24px
        0
        10px;
    }

    @media (max-width: 620px) {
      .info-card {
        padding: 16px;
      }
    }
  `]
})
export class InfoPage implements OnInit {

  page: InfoPageType = 'about';

  title = 'About';

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {
    addIcons({
      arrowBackOutline,
      calculatorOutline,
      shieldCheckmarkOutline,
      documentTextOutline
    });
  }

ngOnInit(): void {

  this.route.paramMap.subscribe(params => {

    const type = params.get('type');

    if (
      type === 'about' ||
      type === 'privacy' ||
      type === 'terms'
    ) {
      this.page = type;
    } else {
      this.page = 'about';
    }

    switch (this.page) {

      case 'privacy':
        this.title = 'Privacy Policy';
        break;

      case 'terms':
        this.title = 'Terms of Use';
        break;

      default:
        this.title = 'About';
        break;
    }

  });
}

  back(): void {
    this.location.back();
  }
}