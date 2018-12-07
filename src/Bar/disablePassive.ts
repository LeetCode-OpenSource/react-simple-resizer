export let disablePassive: boolean | AddEventListenerOptions = true;

try {
  // @ts-ignore
  window.addEventListener('test', null, {
    get passive() {
      disablePassive = { passive: false };
      return true;
    },
  });
} catch {}
