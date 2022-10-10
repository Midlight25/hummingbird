/**
 * Checks the API to make sure it's valid
 * @param {string} key API Key to check
 * @return {bool} Valid Access or not
 */
export function checkAuth(key: string): boolean {
  if (key === "ABC") {
    return true;
  }
  return false;
}
