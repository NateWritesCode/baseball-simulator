import Home from "@webapp/components/pages/Home";
import IdPerson from "@webapp/components/pages/IdPerson";
import IdPlayer from "@webapp/components/pages/IdPlayer";
import Person from "@webapp/components/pages/Person";
import Player from "@webapp/components/pages/Player";
import { Route, Switch } from "wouter";

const Router = () => {
	return (
		<>
			<Switch>
				<Route path="/" component={Home} />
				<Route path={"/player"} component={Player} />
				<Route path={"/player/:idPlayer"} component={IdPlayer} />
				<Route path={"/person"} component={Person} />
				<Route path={"/person/:idPerson"} component={IdPerson} />
				<Route>404: No such page!</Route>
			</Switch>
		</>
	);
};

export default Router;
