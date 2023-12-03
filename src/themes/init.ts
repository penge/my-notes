(() => {
  let theme = localStorage.getItem("theme") as string | null;
  let customTheme = localStorage.getItem("customTheme") as string | null;

  const init = () => {
    if (theme === null || customTheme === null || !["light", "dark", "custom"].includes(theme)) {
      return false;
    }

    document.getElementById("theme")!.innerHTML = theme === "custom"
      ? customTheme.trim()
      : `@import "themes/${theme}.css";`;

    document.documentElement.id = theme;
    document.documentElement.dataset.page = window.location.pathname.substring(1).split(".").shift();
    return true;
  };

  const updateTheme = (aTheme: string) => {
    theme = aTheme;
    localStorage.setItem("theme", aTheme);
  };

  const updateCustomTheme = (aCustomTheme: string) => {
    customTheme = aCustomTheme;
    localStorage.setItem("customTheme", aCustomTheme);
  };

  if (!init()) {
    chrome.storage.local.get(["theme", "customTheme"], (items) => {
      updateTheme(items.theme);
      updateCustomTheme(items.customTheme);
      init();
    });
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") {
      return;
    }

    if (changes.theme) {
      updateTheme(changes.theme.newValue);
      init();
    }

    if (changes.customTheme) {
      updateCustomTheme(changes.customTheme.newValue);
      init();
    }
  });
})();
