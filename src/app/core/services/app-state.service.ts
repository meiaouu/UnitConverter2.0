import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { StorageService } from './storage.service';
import {
  FavoritePair,
  Precision,
  RecentConversion,
  ThemeMode
} from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  private recentSubject: BehaviorSubject<RecentConversion[]>;
  private favoritesSubject: BehaviorSubject<FavoritePair[]>;
  private usageSubject: BehaviorSubject<Record<string, number>>;
  private themeSubject: BehaviorSubject<ThemeMode>;
  private precisionSubject: BehaviorSubject<Precision>;

  readonly recent$;
  readonly favorites$;
  readonly usage$;
  readonly theme$;
  readonly precision$;

  constructor(private store: StorageService) {

    // Initialize AFTER StorageService has been injected.
    // This fixes TS2729:
    // "Property 'store' is used before its initialization."

    this.recentSubject = new BehaviorSubject<RecentConversion[]>(
      this.store.get<RecentConversion[]>('uc.recent', [])
    );

    this.favoritesSubject = new BehaviorSubject<FavoritePair[]>(
      this.store.get<FavoritePair[]>('uc.favorites', [])
    );

    this.usageSubject = new BehaviorSubject<Record<string, number>>(
      this.store.get<Record<string, number>>('uc.usage', {})
    );

    this.themeSubject = new BehaviorSubject<ThemeMode>(
      this.store.get<ThemeMode>('uc.theme', 'dark')
    );

    this.precisionSubject = new BehaviorSubject<Precision>(
      this.store.get<Precision>('uc.precision', 'auto')
    );

    this.recent$ = this.recentSubject.asObservable();
    this.favorites$ = this.favoritesSubject.asObservable();
    this.usage$ = this.usageSubject.asObservable();
    this.theme$ = this.themeSubject.asObservable();
    this.precision$ = this.precisionSubject.asObservable();

    this.applyTheme(this.themeSubject.value);
  }

  // ============================================================
  // GETTERS
  // ============================================================

  get recent(): RecentConversion[] {
    return this.recentSubject.value;
  }

  get favorites(): FavoritePair[] {
    return this.favoritesSubject.value;
  }

  get usage(): Record<string, number> {
    return this.usageSubject.value;
  }

  get theme(): ThemeMode {
    return this.themeSubject.value;
  }

  get precision(): Precision {
    return this.precisionSubject.value;
  }

  // ============================================================
  // RECENT CONVERSIONS
  // ============================================================

  addRecent(item: RecentConversion): void {
    const current = this.recentSubject.value;

    // Remove the same conversion if it already exists,
    // then place the newest conversion first.
    const filtered = current.filter(existing => {
      return !(
        existing.categoryId === item.categoryId &&
        existing.fromUnitId === item.fromUnitId &&
        existing.toUnitId === item.toUnitId &&
        existing.input === item.input
      );
    });

    const updated = [
      item,
      ...filtered
    ].slice(0, 30);

    this.recentSubject.next(updated);
    this.store.set('uc.recent', updated);
  }

  removeRecent(id: string): void {
    const updated = this.recentSubject.value.filter(
      item => item.id !== id
    );

    this.recentSubject.next(updated);
    this.store.set('uc.recent', updated);
  }

  deleteRecent(id: string): void {
  this.removeRecent(id);
}

  clearRecent(): void {
    this.recentSubject.next([]);
    this.store.set('uc.recent', []);
  }

  // Alias used by settings/history code if needed.
  clearHistory(): void {
    this.clearRecent();
  }

  // ============================================================
  // FAVORITES
  // ============================================================

  private favoriteId(
    categoryId: string,
    fromUnitId: string,
    toUnitId: string
  ): string {
    return `${categoryId}:${fromUnitId}:${toUnitId}`;
  }

  /**
   * Supports both:
   *
   * isFavorite('length:m:ft')
   *
   * and:
   *
   * isFavorite('length', 'm', 'ft')
   */
  isFavorite(
    idOrCategory: string,
    fromUnitId?: string,
    toUnitId?: string
  ): boolean {

    const id =
      fromUnitId !== undefined && toUnitId !== undefined
        ? this.favoriteId(
            idOrCategory,
            fromUnitId,
            toUnitId
          )
        : idOrCategory;

    return this.favoritesSubject.value.some(
      favorite => favorite.id === id
    );
  }

  /**
   * Supports the API used by converter.page.ts and
   * favorites.page.ts:
   *
   * toggleFavorite(categoryId, fromUnitId, toUnitId)
   */
  toggleFavorite(
    categoryId: string,
    fromUnitId: string,
    toUnitId: string
  ): boolean {

    const id = this.favoriteId(
      categoryId,
      fromUnitId,
      toUnitId
    );

    const current = this.favoritesSubject.value;

    const exists = current.some(
      favorite => favorite.id === id
    );

    if (exists) {
      const updated = current.filter(
        favorite => favorite.id !== id
      );

      this.favoritesSubject.next(updated);
      this.store.set('uc.favorites', updated);

      return false;
    }

    const favorite: FavoritePair = {
      id,
      categoryId,
      fromUnitId,
      toUnitId,
      createdAt: Date.now()
    };

    const updated = [
      favorite,
      ...current
    ];

    this.favoritesSubject.next(updated);
    this.store.set('uc.favorites', updated);

    return true;
  }

  removeFavorite(id: string): void {
    const updated = this.favoritesSubject.value.filter(
      favorite => favorite.id !== id
    );

    this.favoritesSubject.next(updated);
    this.store.set('uc.favorites', updated);
  }

  clearFavorites(): void {
    this.favoritesSubject.next([]);
    this.store.set('uc.favorites', []);
  }

  // ============================================================
  // USAGE / MOST USED
  // ============================================================

  /**
   * This is the method expected by:
   *
   * categories.page.ts
   * home.page.ts
   *
   * Example:
   * this.state.increment(id)
   */
  increment(categoryId: string): void {
    if (!categoryId) {
      return;
    }

    const current = this.usageSubject.value;

    const updated: Record<string, number> = {
      ...current,
      [categoryId]:
        (current[categoryId] || 0) + 1
    };

    this.usageSubject.next(updated);
    this.store.set('uc.usage', updated);
  }

  // Optional alias for clearer API usage elsewhere.
  incrementUsage(categoryId: string): void {
    this.increment(categoryId);
  }

  clearUsage(): void {
    this.usageSubject.next({});
    this.store.set('uc.usage', {});
  }

  // ============================================================
  // THEME
  // ============================================================

  setTheme(theme: ThemeMode): void {
    this.themeSubject.next(theme);
    this.store.set('uc.theme', theme);

    this.applyTheme(theme);
  }

 private applyTheme(theme: ThemeMode): void {
  if (typeof document === 'undefined') {
    return;
  }

  let dark = theme === 'dark';

  if (
    theme === 'system' &&
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function'
  ) {
    dark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
  }

  const html = document.documentElement;
  const body = document.body;

  // This is the important part.
  // global.scss uses :root.light
  html.classList.toggle('light', !dark);

  // Keep these for Ionic/custom compatibility.
  html.classList.toggle('ion-palette-dark', dark);
  html.classList.toggle('dark-theme', dark);
  html.classList.toggle('light-theme', !dark);

  html.setAttribute(
    'color-theme',
    dark ? 'dark' : 'light'
  );

  if (body) {
    body.classList.toggle('dark', dark);
    body.classList.toggle('light', !dark);
    body.classList.toggle('dark-theme', dark);
    body.classList.toggle('light-theme', !dark);

    body.setAttribute(
      'color-theme',
      dark ? 'dark' : 'light'
    );
  }
}

  // ============================================================
  // PRECISION
  // ============================================================

  setPrecision(precision: Precision): void {
    this.precisionSubject.next(precision);
    this.store.set('uc.precision', precision);
  }

  // ============================================================
  // ONBOARDING
  // ============================================================

  /**
   * Expected by launch.page.ts:
   *
   * state.onboardingDone()
   */
  onboardingDone(): boolean {
    return this.store.get<boolean>(
      'uc.onboardingDone',
      false
    );
  }

  completeOnboarding(): void {
    this.store.set(
      'uc.onboardingDone',
      true
    );
  }

  /**
   * Alias in case welcome.page.ts uses setOnboardingDone().
   */
  setOnboardingDone(): void {
    this.completeOnboarding();
  }

  resetOnboarding(): void {
    this.store.set(
      'uc.onboardingDone',
      false
    );
  }

  // ============================================================
  // RESET
  // ============================================================

  resetAll(): void {
    this.store.remove('uc.recent');
    this.store.remove('uc.favorites');
    this.store.remove('uc.usage');
    this.store.remove('uc.theme');
    this.store.remove('uc.precision');
    this.store.remove('uc.onboardingDone');

    this.recentSubject.next([]);
    this.favoritesSubject.next([]);
    this.usageSubject.next({});
    this.themeSubject.next('dark');
    this.precisionSubject.next('auto');

    this.applyTheme('dark');
  }
}