export async function withTimeout<T>(promise: PromiseLike<T>, ms = 10000): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
  )
  return Promise.race([Promise.resolve(promise), timeout])
}
