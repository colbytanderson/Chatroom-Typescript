const KEY = 'darkMode';

const isDarkMode = () => !!localStorage.getItem(KEY);

export const toggleDarkMode = () => {
  const newValue = !isDarkMode();
  if (newValue) {
    localStorage.setItem(KEY, 'true');
    document.body.classList.add('bp3-dark');
  }
  else {
    localStorage.removeItem(KEY);
    document.body.classList.remove('bp3-dark');
  }
};

export const setupDarkMode = () => {
  if (isDarkMode()) {
    document.body.classList.add('bp3-dark');
  }
};
