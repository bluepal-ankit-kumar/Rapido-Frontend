import React, { createContext, useContext, useState } from 'react';
import theme from '../config/theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
	const [currentTheme, setCurrentTheme] = useState(theme);

	// Example: switch theme (light/dark)
	const switchTheme = (newTheme) => setCurrentTheme(newTheme);

	return (
		<ThemeContext.Provider value={{ theme: currentTheme, switchTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	return useContext(ThemeContext);
}
