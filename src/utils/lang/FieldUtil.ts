import {listify} from "radash";

export function isNull(value?: any): boolean {
  return typeof value === "undefined" || value === null;
}

export function isNotNull(value?: any): boolean {
  return !isNull(value);
}

export function copyProperties<S extends Record<string, any>, T extends Record<string, any>>(source: S, target: T, focus = false) {
  listify(source, (k, v) => {
    if (focus) {
      // @ts-ignore
      target[k] = v;
    } else if (isNotNull(v) && v) {
      // @ts-ignore
      target[k] = v;
    }
  });
}

export function getEffectiveNumber(num: number, min: number, max: number): number {
  if (num < min) {
    return min;
  }
  if (num >= max) {
    return max - 1;
  }
  return num;
}


export function isEmptyArray(arr?: Array<any>): boolean {
  if (!arr) {
    return true;
  }
  if (!Array.isArray(arr)) {
    return true;
  }
  return arr.length === 0;
}

export function isNotEmptyArray(arr?: Array<any>): boolean {
  return !isEmptyArray(arr);
}

export function isEmptyString(str: any): boolean {
  if (typeof str === 'undefined') {
    return true
  } else if (typeof str !== 'string') {
    str = `${str}`;
  }
  return str.length === 0;
}

export function isNotEmptyString(str: any): boolean {
  return !isEmptyString(str);
}



export function versionCompare(version1: string, version2: string): number {
  const v1 = version1.split('.').map(Number);
  const v2 = version2.split('.').map(Number);
  for (let i = 0; i < v1.length; i++) {
    if (v1[i] > v2[i]) {
      return 1;
    } else if (v1[i] < v2[i]) {
      return -1;
    }
  }
  return 0;
}

export function isVersionUpdate(newVersion: string, oldVersion: string, minVersion: string): boolean {
  // 新版本必须大于等于最小版本，旧版本必须小于最小版本
  return versionCompare(newVersion, minVersion) >= 0 && versionCompare(oldVersion, minVersion) < 0;
}

export function subStr(str: string, len: number): string {
  if (isEmptyString(str)) {
    return '';
  }
  return str.substring(0, len);
}