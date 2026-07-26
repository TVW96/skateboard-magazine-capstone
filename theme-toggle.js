const themeToggle = document.querySelector("[data-theme-toggle]");
const themeStorageKey = "push-color-theme";
const root = document.documentElement;
const systemTheme = window.matchMedia("(prefers-color-scheme: light)");

function getTheme() {
  return localStorage.getItem(themeStorageKey) || (systemTheme.matches ? "light" : "dark");
}

function setTheme(theme) {
  root.dataset.theme = theme;

  if (!themeToggle) {
    return;
  }

  const nextTheme = theme === "dark" ? "light" : "dark";
  themeToggle.setAttribute("aria-pressed", String(theme === "light"));
  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
}

setTheme(getTheme());

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(themeStorageKey, nextTheme);
  setTheme(nextTheme);
});

systemTheme.addEventListener("change", () => {
  if (!localStorage.getItem(themeStorageKey)) {
    setTheme(getTheme());
  }
});
