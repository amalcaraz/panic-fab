export interface IEnum {
  [key: string]: any;
}

export function getEnumKeys<T extends IEnum>(enumObj: T): any {
  return Object.keys(enumObj).filter((t: any) => typeof enumObj[t] === 'number');
}

export function getCombinations<T extends any>(items: any[][], fn: (...i: any[]) => T = (i) => i, fnArgs = []): T[] {
  return items[0].reduce((prev: T[], curr: any) => items.length > 1
    ? prev.concat(getCombinations(items.slice(1), fn, fnArgs.concat(curr)))
    : prev.concat(fn(...fnArgs.concat(curr)))
    , []);
}
