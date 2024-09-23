import Home from "@webapp/components/home/Home";
import IdPlayer from "@webapp/components/pages/IdPlayer";
import Player from "@webapp/components/pages/Player";
import { Route, Switch } from "wouter";

const Router = () => {
	return (
		<>
			<Switch>
				<Route path="/" component={Home} />
				<Route path={"/player"} component={Player} />
				<Route path={"/player/:idPlayer"} component={IdPlayer} />
				<Route>404: No such page!</Route>
			</Switch>
		</>
	);
};

export default Router;
