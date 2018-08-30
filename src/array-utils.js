// @flow

function groupBy<T>(input: T[], fn: T => string): Map<string, T[]> {
  return input.reduce((acc, item) => {
    const key = fn(item);
    return acc.set(key, (acc.get(key) || []).concat([item]));
  }, (new Map(): Map<string, T[]>));
}

function flatten<T>(input: T[][]): T[] {
  return input.reduce((acc, subArray) => acc.concat(subArray), []);
}

function sum<T>(input: T[], fn: T => number) {
  return input.reduce((total, item) => total + fn(item), 0);
}

export { groupBy, flatten, sum };
