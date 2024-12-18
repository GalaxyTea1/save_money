import useThemeStore from '../stores/themeStore';

const ThemeToggle = () => {
  const { isDark, toggleDark, theme, setTheme } = useThemeStore();

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleDark}
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
      >
        {isDark ? '🌞' : '🌙'}
      </button>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'default' | 'blue' | 'green')}
        className="rounded-lg border-gray-300 dark:bg-gray-700"
      >
        <option value="default">Default</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
      </select>
    </div>
  );
};

export default ThemeToggle; 