import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonIcon,
  IonSearchbar
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  swapVerticalOutline,
  barbellOutline,
  thermometerOutline,
  beakerOutline,
  squareOutline,
  speedometerOutline,
  timeOutline,
  flashOutline,
  resizeOutline,
  chevronForwardOutline,
  statsChartOutline
} from 'ionicons/icons';

import { BottomNavComponent } from '../shared/components/bottom-nav/bottom-nav.component';

import { ConversionService } from '../core/services/conversion.service';
import { AppStateService } from '../core/services/app-state.service';

import {
  CategoryDef,
  RecentConversion
} from '../core/models/models';

@Component({
  selector: 'app-home',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonSearchbar,
    BottomNavComponent
  ],

  template: `
    <ion-content [fullscreen]="true">

      <main class="page-shell home-shell">

        <!-- HEADER -->
        <header class="topbar">
          <h1>Unit Converter</h1>
        </header>


        <!-- SEARCH -->
        <section class="search-wrap">

          <ion-searchbar
            [(ngModel)]="query"
            (ionInput)="search()"
            placeholder="Search anything..."
            aria-label="Search categories and units">
          </ion-searchbar>


          <div
            class="search-panel"
            *ngIf="query.trim()">

            <button
              type="button"
              *ngFor="let r of results"
              (click)="openResult(r)">

              <ion-icon
                [name]="r.category.icon">
              </ion-icon>

              <span>

                <b>
                  {{ r.title }}
                </b>

                <small>
                  {{ r.subtitle }}
                </small>

              </span>

              <ion-icon
                name="chevron-forward-outline">
              </ion-icon>

            </button>


            <p *ngIf="!results.length">
              No matching categories or units.
            </p>

          </div>

        </section>


        <!-- TIP -->
        <button
          type="button"
          class="tip-card"
          (click)="nextTip()">

          <b>Tip:</b>

          {{ tips[tipIndex] }}

        </button>


        <!-- QUICK CONVERSIONS -->
        <h2>
          Quick Conversions
        </h2>

        <div class="quick-grid">

          <button
            type="button"
            *ngFor="let c of quick; let i = index"
            class="quick-card"
            [style.--i]="i"
            (click)="open(c.id)">

            <ion-icon
              [name]="c.icon">
            </ion-icon>

            <b>
              {{ c.shortName }}
            </b>

          </button>

        </div>


        <!-- MOST USED -->
        <h2>
          Most Used
        </h2>

        <div
          class="horizontal-cards"
          *ngIf="mostUsed.length; else noUsage">

          <button
            type="button"
            class="mini-card"
            *ngFor="let x of mostUsed"
            (click)="open(x.category.id)">

            <ion-icon
              name="stats-chart-outline">
            </ion-icon>

            <b>
              {{ x.category.shortName }}
            </b>

            <small>
              Used
              {{ x.count }}
              {{ x.count === 1 ? 'time' : 'times' }}
            </small>

          </button>

        </div>


        <ng-template #noUsage>

          <p class="muted">
            Your most-used converters will appear here.
          </p>

        </ng-template>


        <!-- RECENT -->
        <h2>
          Recent Conversions
        </h2>

        <div
          class="recent-preview"
          *ngIf="state.recent.length; else noRecent">

          <button
            type="button"
            *ngFor="let r of state.recent.slice(0, 4)"
            (click)="reopen(r)">

            <b>
              {{ r.fromText }}
              →
              {{ r.toText }}
            </b>

            <small>
              {{ categoryName(r.categoryId) }}
            </small>

          </button>

        </div>


        <ng-template #noRecent>

          <p class="muted">
            No recent conversions.
          </p>

        </ng-template>

      </main>

    </ion-content>


    <app-bottom-nav
      active="home">
    </app-bottom-nav>
  `
})
export class HomePage {

  /* =========================================================
     SEARCH
     ========================================================= */

  query = '';

  results: {
    category: CategoryDef;
    title: string;
    subtitle: string;
    from?: string;
    to?: string;
  }[] = [];


  /* =========================================================
     TIPS
     ========================================================= */

  tips: string[] = [

    'Water freezes at 0°C and boils at 100°C.',

    '1 inch equals exactly 2.54 centimeters.',

    '1 nautical mile equals exactly 1,852 meters.',

    '1 kilowatt-hour equals 3.6 megajoules.',

    '1 atmosphere is 101.325 kilopascals.'

  ];

  tipIndex = 0;


  /* =========================================================
     QUICK CONVERTERS
     ========================================================= */

  quick: CategoryDef[] = [];


  constructor(
    public conv: ConversionService,
    public state: AppStateService,
    private router: Router
  ) {

    /* Register icons */

    addIcons({

      swapVerticalOutline,

      barbellOutline,

      thermometerOutline,

      beakerOutline,

      squareOutline,

      speedometerOutline,

      timeOutline,

      flashOutline,

      resizeOutline,

      chevronForwardOutline,

      statsChartOutline

    });


    /*
     * Build the Quick Conversions list.
     */

    const quickIds = [
      'length',
      'weight',
      'temperature',
      'volume',
      'area',
      'speed',
      'time',
      'energy',
      'pressure'
    ];


    this.quick = quickIds

      .map(id => this.conv.getCategory(id))

      .filter(
        (category): category is CategoryDef =>
          category !== undefined &&
          category !== null
      );

  }


  /* =========================================================
     MOST USED
     ========================================================= */

  get mostUsed(): {
    category: CategoryDef;
    count: number;
  }[] {

    return Object.entries(this.state.usage)

      .sort(
        (a, b) =>
          b[1] - a[1]
      )

      .slice(0, 5)

      .map(([id, count]) => {

        return {

          category:
            this.conv.getCategory(id),

          count

        };

      })

      .filter(
        (
          item
        ): item is {
          category: CategoryDef;
          count: number;
        } => !!item.category
      );

  }


  /* =========================================================
     TIP
     ========================================================= */

  nextTip(): void {

    this.tipIndex =
      (this.tipIndex + 1) %
      this.tips.length;

  }


  /* =========================================================
     OPEN CONVERTER
     ========================================================= */

  open(
    categoryId: string,
    from?: string,
    to?: string,
    value?: number
  ): void {

    /*
     * Protect against invalid category IDs.
     */

    if (!categoryId) {

      console.error(
        'Cannot open converter: category ID is empty.'
      );

      return;

    }


    const category =
      this.conv.getCategory(categoryId);


    if (!category) {

      console.error(
        'Cannot open converter. Unknown category:',
        categoryId
      );

      return;

    }


    /*
     * Count this converter as used.
     */

    this.state.increment(categoryId);


    /*
     * Only add query parameters that actually
     * contain a value.
     */

    const queryParams:
      Record<string, string | number> = {};


    if (from) {

      queryParams['from'] = from;

    }


    if (to) {

      queryParams['to'] = to;

    }


    if (
      value !== undefined &&
      value !== null &&
      Number.isFinite(Number(value))
    ) {

      queryParams['value'] = value;

    }


    /*
     * IMPORTANT:
     *
     * Every converter now uses:
     *
     * /converter/length
     * /converter/weight
     * /converter/temperature
     * etc.
     */

    this.router.navigate(
      [
        '/converter',
        categoryId
      ],
      {
        queryParams
      }
    )
    .then(success => {

      if (!success) {

        console.error(
          'Angular Router rejected navigation to:',
          categoryId
        );

      }

    })
    .catch(error => {

      console.error(
        'Converter navigation failed:',
        error
      );

    });

  }


  /* =========================================================
     CATEGORY NAME
     ========================================================= */

  categoryName(
    categoryId: string
  ): string {

    return (
      this.conv
        .getCategory(categoryId)
        ?.name
      ||
      categoryId
    );

  }


  /* =========================================================
     REOPEN RECENT CONVERSION
     ========================================================= */

  reopen(
    recent: RecentConversion
  ): void {

    this.open(

      recent.categoryId,

      recent.fromUnitId,

      recent.toUnitId,

      recent.input

    );

  }


  /* =========================================================
     SEARCH
     ========================================================= */

  search(): void {

    const q =
      this.query
        .trim()
        .toLowerCase();


    if (!q) {

      this.results = [];

      return;

    }


    /*
     * Allows searches such as:
     *
     * meter to feet
     * kg to lb
     * celsius to fahrenheit
     */

    const pair =
      q.match(
        /^(.+?)\s+(?:to|in|→)\s+(.+)$/i
      );


    const found: {
      category: CategoryDef;
      title: string;
      subtitle: string;
      from?: string;
      to?: string;
    }[] = [];


    for (
      const category
      of this.conv.categories
    ) {


      /* Search for conversion pair */

      if (pair) {

        const fromUnit =
          this.conv.findUnit(
            category,
            pair[1]
          );


        const toUnit =
          this.conv.findUnit(
            category,
            pair[2]
          );


        if (
          fromUnit &&
          toUnit
        ) {

          found.push({

            category,

            title:
              `${fromUnit.name} → ${toUnit.name}`,

            subtitle:
              category.name,

            from:
              fromUnit.id,

            to:
              toUnit.id

          });

        }

      }


      /* Category matching */

      const categoryMatches =

        category.name
          .toLowerCase()
          .includes(q)

        ||

        category.description
          .toLowerCase()
          .includes(q);


      /* Unit matching */

      const unitMatches =
        category.units.some(unit => {

          const nameMatches =
            unit.name
              .toLowerCase()
              .includes(q);


          const symbolMatches =
            unit.symbol
              .toLowerCase()
              .includes(q);


          const aliasMatches =
            unit.aliases.some(
              alias =>
                alias
                  .toLowerCase()
                  .includes(q)
            );


          return (
            nameMatches ||
            symbolMatches ||
            aliasMatches
          );

        });


      if (
        categoryMatches ||
        unitMatches
      ) {

        found.push({

          category,

          title:
            category.name,

          subtitle:
            category.description

        });

      }

    }


    /*
     * Remove duplicate results.
     */

    this.results =
      found

        .filter(
          (
            result,
            index,
            array
          ) =>

            array.findIndex(
              item =>

                item.title ===
                  result.title

                &&

                item.category.id ===
                  result.category.id

            ) === index
        )

        .slice(0, 8);

  }


  /* =========================================================
     OPEN SEARCH RESULT
     ========================================================= */

  openResult(
    result: {
      category: CategoryDef;
      title: string;
      subtitle: string;
      from?: string;
      to?: string;
    }
  ): void {

    /*
     * Close search panel first.
     */

    this.query = '';

    this.results = [];


    this.open(

      result.category.id,

      result.from,

      result.to

    );

  }

}