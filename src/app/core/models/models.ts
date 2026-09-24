export interface UnitDef { id:string; name:string; symbol:string; aliases:string[]; factor?:number; offset?:number; }
export interface CategoryDef { id:string; name:string; shortName:string; icon:string; description:string; group:'Everyday'|'Science & Engineering'|'More Tools'; units:UnitDef[]; }
export interface RecentConversion { id:string; categoryId:string; fromUnitId:string; toUnitId:string; input:number; output:number; fromText:string; toText:string; createdAt:number; }
export interface FavoritePair { id:string; categoryId:string; fromUnitId:string; toUnitId:string; createdAt:number; }
export type ThemeMode='dark'|'light'|'system';
export type Precision='auto'|'0'|'1'|'2'|'3'|'4'|'5'|'6';
