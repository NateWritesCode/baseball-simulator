import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "@webapp/components/general/Router";
import { ThemeProvider } from "@webapp/components/general/theme-provider";

const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-them">
				{/* <WrapperDashboard> */}
				<Router />
				{/* </WrapperDashboard> */}
			</ThemeProvider>
		</QueryClientProvider>
	);
};

export default App;
