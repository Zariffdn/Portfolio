// Browsers that block site data throw on the storage getter itself, not only
// on reads and writes, so every access goes through these. A blocked read
// reports null and a blocked write or removal reports false; none of them
// ever throws.
export function readStorage(area, key) {
  try {
    return window[area].getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(area, key, value) {
  try {
    window[area].setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(area, key) {
  try {
    window[area].removeItem(key);
    return true;
  } catch {
    return false;
  }
}
