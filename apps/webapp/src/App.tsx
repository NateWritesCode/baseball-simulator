import { ThemeProvider } from "@webapp/components/general/theme-provider";
import type { ReactNode } from "react";

const App: React.FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-them">
			{children}
		</ThemeProvider>
	);
};

export default App;
