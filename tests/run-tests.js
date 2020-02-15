/* global console */

export default async function runTests(PREFIX, testFunctions) {
  for (const fn of testFunctions) {
    console.log(`${PREFIX}: ${fn.name}()`);
    await fn();
    console.log("\r\n");
  }
}
