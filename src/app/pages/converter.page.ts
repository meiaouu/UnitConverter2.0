import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';

import { ToastController } from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  starOutline,
  star,
  swapVerticalOutline,
  copyOutline,
  shareSocialOutline,
  trashOutline,
  repeatOutline
} from 'ionicons/icons';

import { ConversionService } from '../core/services/conversion.service';
import { AppStateService } from '../core/services/app-state.service';
import { CategoryDef } from '../core/models/models';

@Component({
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption
  ],

  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button
            (clicke )="back()"
            aria-label="Go back"
          >
            <ion-icon name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>
          {{ category?.name || 'Converter' }}
        </ion-title>

        <ion-buttons slot="end">
          <ion-button
            (click)="toggleFavorite()"
            aria-label="Favorite pair"
          >
            <ion-icon
              [name]="isFavorite ? 'star' : 'star-outline'"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <main
        class="converter-shell"
        *ngIf="category as c"
      >
        <div class="converter-intro">
          <span class="icon-box">
            <ion-icon [name]="c.icon"></ion-icon>
          </span>

          <div>
            <p class="eyebrow">
              CONVERT BETWEEN UNITS
            </p>

            <h1>{{ c.name }}</h1>

            <p class="intro">
              {{ c.description }}
            </p>
          </div>
        </div>

        <section class="conversion-panel">
          <label>FROM</label>

          <div class="value-row">
            <ion-input
              type="number"
              inputmode="decimal"
              [(ngModel)]="value"
              (ionInput)="convert(true)"
              placeholder="0"
              aria-label="Value to convert"
            ></ion-input>

            <ion-select
              [(ngModel)]="from"
              (ionChange)="convert(true)"
              interface="popover"
              aria-label="From unit"
            >
              <ion-select-option
                *ngFor="let u of c.units"
                [value]="u.id"
              >
                {{ u.name }} ({{ u.symbol }})
              </ion-select-option>
            </ion-select>
          </div>

          <button
            type="button"
            class="swap-btn"
            [class.spin]="swapping"
            (click)="swap()"
          >
            <ion-icon name="swap-vertical-outline"></ion-icon>
            <span>Swap units</span>
          </button>

          <label>TO</label>

          <div class="value-row result-row">
            <div
              class="result-value"
              aria-live="polite"
            >
              {{ formatted || '—' }}
            </div>

            <ion-select
              [(ngModel)]="to"
              (ionChange)="convert(true)"
              interface="popover"
              aria-label="To unit"
            >
              <ion-select-option
                *ngFor="let u of c.units"
                [value]="u.id"
              >
                {{ u.name }} ({{ u.symbol }})
              </ion-select-option>
            </ion-select>
          </div>
        </section>

        <section
          class="equation"
          *ngIf="formatted"
        >
          <small>RESULT</small>

          <strong>
            {{ displayInput }} {{ fromSymbol }}
            =
            {{ formatted }} {{ toSymbol }}
          </strong>
        </section>

        <div class="action-grid">
          <button
            type="button"
            (click)="copy()"
          >
            <ion-icon name="copy-outline"></ion-icon>
            Copy Result
          </button>

          <button
            type="button"
            (click)="share()"
          >
            <ion-icon name="share-social-outline"></ion-icon>
            Share Result
          </button>

          <button
            type="button"
            (click)="clear()"
          >
            <ion-icon name="trash-outline"></ion-icon>
            Clear
          </button>

          <button
            type="button"
            (click)="swap()"
          >
            <ion-icon name="repeat-outline"></ion-icon>
            Swap Units
          </button>
        </div>

        <button
          type="button"
          class="favorite-wide"
          (click)="toggleFavorite()"
        >
          <ion-icon
            [name]="isFavorite ? 'star' : 'star-outline'"
          ></ion-icon>

          {{
            isFavorite
              ? 'Remove Favorite Pair'
              : 'Favorite Pair'
          }}
        </button>

        <section class="quick-values">
          <h2>Quick values</h2>

          <div>
            <button
              type="button"
              *ngFor="let v of [1, 10, 100, 1000]"
              (click)="setValue(v)"
            >
              {{ v }}
            </button>
          </div>
        </section>
      </main>
    </ion-content>
  `
})
export class ConverterPage implements OnInit, OnDestroy {

  category?: CategoryDef;

  from = '';
  to = '';

  value: number | null = 100;

  formatted = '';
  output: number | null = null;

  swapping = false;

  timer?: ReturnType<typeof setTimeout>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public conv: ConversionService,
    public state: AppStateService,
    private toast: ToastController
  ) {
    addIcons({
      arrowBackOutline,
      starOutline,
      star,
      swapVerticalOutline,
      copyOutline,
      shareSocialOutline,
      trashOutline,
      repeatOutline
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      const categoryId =
        params.get('category') || 'length';

      this.category =
        this.conv.getCategory(categoryId) ||
        this.conv.categories[0];

      if (!this.category) {
        return;
      }

      /*
       * Default units
       */
      this.from =
        this.category.units[0]?.id || '';

      this.to =
        this.category.units[1]?.id ||
        this.from;

      /*
       * Read values from URL.
       *
       * This is used when opening a conversion
       * from Recent or Favorites.
       */
      const query =
        this.route.snapshot.queryParamMap;

      const queryFrom =
        query.get('from');

      const queryTo =
        query.get('to');

      const queryValue =
        query.get('value');

      /*
       * Validate FROM unit.
       */
      if (
        queryFrom &&
        this.category.units.some(
          unit => unit.id === queryFrom
        )
      ) {
        this.from = queryFrom;
      }

      /*
       * Validate TO unit.
       */
      if (
        queryTo &&
        this.category.units.some(
          unit => unit.id === queryTo
        )
      ) {
        this.to = queryTo;
      }

      /*
       * Restore input value.
       */
      if (
        queryValue !== null &&
        Number.isFinite(Number(queryValue))
      ) {
        this.value = Number(queryValue);
      }

      /*
       * Calculate immediately.
       *
       * false prevents simply opening the converter
       * from creating a history entry.
       *
       * A history entry will be created after the user
       * actually changes the value/unit or uses a quick
       * conversion.
       */
      this.convert(false);
    });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  /*
   * FAVORITE
   */

  get isFavorite(): boolean {
    if (!this.category) {
      return false;
    }

    return this.state.isFavorite(
      this.category.id,
      this.from,
      this.to
    );
  }

  /*
   * UNIT SYMBOLS
   */

  get fromSymbol(): string {
    return (
      this.category?.units.find(
        unit => unit.id === this.from
      )?.symbol || ''
    );
  }

  get toSymbol(): string {
    return (
      this.category?.units.find(
        unit => unit.id === this.to
      )?.symbol || ''
    );
  }

  /*
   * INPUT DISPLAY
   */

  get displayInput(): string {
    if (this.value === null) {
      return '';
    }

    return this.conv.format(
      Number(this.value),
      this.state.precision
    );
  }

  /*
   * CONVERSION
   */

  convert(saveHistory: boolean): void {

    /*
     * Stop any pending history save first.
     *
     * This prevents an old value from being saved
     * while the user is still typing.
     */
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    if (
      this.value === null ||
      this.value === undefined ||
      !Number.isFinite(Number(this.value))
    ) {
      this.formatted = '';
      this.output = null;
      return;
    }

    if (
      !this.category ||
      !this.from ||
      !this.to
    ) {
      this.formatted = '';
      this.output = null;
      return;
    }

    try {

      const numericValue =
        Number(this.value);

      this.output =
        this.conv.convert(
          numericValue,
          this.category.id,
          this.from,
          this.to
        );

      if (
        this.output === null ||
        !Number.isFinite(this.output)
      ) {
        this.formatted = '';
        this.output = null;
        return;
      }

      this.formatted =
        this.conv.format(
          this.output,
          this.state.precision
        );

      /*
       * Save after the user stops typing/changing
       * the conversion for 500 ms.
       */
      if (saveHistory) {

        this.timer = setTimeout(() => {
          this.saveHistory();
        }, 500);

      }

    } catch (error) {

      console.error(
        'Conversion failed:',
        error
      );

      this.formatted = '';
      this.output = null;
    }
  }

  /*
   * SAVE TO RECENT HISTORY
   */

  private saveHistory(): void {

    if (
      !this.category ||
      this.value === null ||
      this.output === null ||
      !Number.isFinite(Number(this.value)) ||
      !Number.isFinite(this.output)
    ) {
      return;
    }

    const numericValue =
      Number(this.value);

    const inputText =
      this.conv.format(
        numericValue,
        this.state.precision
      );

    const outputText =
      this.conv.format(
        this.output,
        this.state.precision
      );

    this.state.addRecent({
      id:
        `${Date.now()}-` +
        Math.random()
          .toString(36)
          .slice(2, 8),

      categoryId:
        this.category.id,

      fromUnitId:
        this.from,

      toUnitId:
        this.to,

      input:
        numericValue,

      output:
        this.output,

      fromText:
        `${inputText} ${this.fromSymbol}`,

      toText:
        `${outputText} ${this.toSymbol}`,

      createdAt:
        Date.now()
    });
  }

  /*
   * SWAP UNITS
   */

  swap(): void {

    if (!this.category) {
      return;
    }

    const oldFrom =
      this.from;

    this.from =
      this.to;

    this.to =
      oldFrom;

    this.swapping =
      true;

    this.convert(true);

    setTimeout(() => {
      this.swapping = false;
    }, 250);
  }

  /*
   * QUICK VALUES
   */

  setValue(value: number): void {
    this.value = value;
    this.convert(true);
  }

  /*
   * CLEAR CONVERTER
   */

  clear(): void {

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    this.value = null;
    this.output = null;
    this.formatted = '';
  }

  /*
   * FAVORITES
   */

  toggleFavorite(): void {

    if (!this.category) {
      return;
    }

    this.state.toggleFavorite(
      this.category.id,
      this.from,
      this.to
    );

    this.show(
      this.isFavorite
        ? 'Favorite saved'
        : 'Favorite removed'
    );
  }

  /*
   * COPY RESULT
   */

  async copy(): Promise<void> {

    if (
      !this.formatted ||
      this.value === null
    ) {
      return;
    }

    const text =
      `${this.displayInput} ${this.fromSymbol}` +
      ` = ` +
      `${this.formatted} ${this.toSymbol}`;

    try {

      if (
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {
        await navigator.clipboard.writeText(
          text
        );

      } else {

        this.fallbackCopy(text);

      }

    } catch {

      this.fallbackCopy(text);

    }

    await this.show(
      'Result copied'
    );
  }

  /*
   * FALLBACK COPY
   */

  private fallbackCopy(
    text: string
  ): void {

    const textarea =
      document.createElement(
        'textarea'
      );

    textarea.value =
      text;

    textarea.style.position =
      'fixed';

    textarea.style.opacity =
      '0';

    document.body.appendChild(
      textarea
    );

    textarea.focus();
    textarea.select();

    try {
      document.execCommand(
        'copy'
      );
    } catch {
      // Ignore fallback clipboard errors.
    }

    textarea.remove();
  }

  /*
   * SHARE RESULT
   */

  async share(): Promise<void> {

    if (
      !this.formatted ||
      this.value === null
    ) {
      return;
    }

    const text =
      `${this.displayInput} ${this.fromSymbol}` +
      ` = ` +
      `${this.formatted} ${this.toSymbol}`;

    if (navigator.share) {

      try {

        await navigator.share({
          title:
            'Unit Converter',
          text
        });

        return;

      } catch {
        /*
         * The user may have cancelled the native
         * share dialog. Fall through to copy.
         */
      }
    }

    await this.copy();
  }

  /*
   * TOAST
   */

  private async show(
    message: string
  ): Promise<void> {

    const toast =
      await this.toast.create({
        message,
        duration: 1300,
        position: 'bottom'
      });

    await toast.present();
  }

  /*
   * BACK
   */

  back(): void {
    this.location.back();
  }
}