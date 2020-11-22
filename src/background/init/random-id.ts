export default function randomId(): string {
  const randomPool = new Uint8Array(32);
  crypto.getRandomValues(randomPool);
  let hex = "";
  for (let i = 0; i < randomPool.length; i += 1) {
    hex += randomPool[i].toString(16);
  }
  return hex;
}
