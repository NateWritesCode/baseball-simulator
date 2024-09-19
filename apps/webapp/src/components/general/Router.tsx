import Home from "@webapp/components/home/Home";
import { Route, Switch } from "wouter";

const Router = () => {
	return (
		<>
			<Switch>
				<Route path="/" component={Home} />
				<Route>404: No such page!</Route>
			</Switch>
		</>
	);
};

export default Router;
