import Router from "@/components/general/Router";
import WrapperDashboard from "@/components/general/WrapperDashboard";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
const queryClient = new QueryClient();

const App = () => {
	return (
		<ChakraProvider value={defaultSystem}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider attribute={"class"} disableTransitionOnChange>
					<WrapperDashboard>
						<Router />
					</WrapperDashboard>
				</ThemeProvider>
			</QueryClientProvider>
		</ChakraProvider>
	);
};

export default App;
