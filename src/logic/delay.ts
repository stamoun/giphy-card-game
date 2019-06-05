export function delay<T>(ms: number, result: T): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => resolve(result), ms);
  });
}
