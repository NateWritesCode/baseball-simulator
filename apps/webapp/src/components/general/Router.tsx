import Explore from "@/components/pages/Explore";
import Home from "@/components/pages/Home";
import IdGame from "@/components/pages/IdGame";
import IdPerson from "@/components/pages/IdPerson";
import IdPlayer from "@/components/pages/IdPlayer";
import Person from "@/components/pages/Person";
import Player from "@/components/pages/Player";
import Search from "@/components/pages/Search";
import Standings from "@/components/pages/Standings";
import Test from "@/components/pages/Test";
import { Route, Switch } from "wouter";

const Router = () => {
	return (
		<>
			<Switch>
				<Route path="/" component={Home} />
				<Route path={"/explore"} component={Explore} />
				<Route path={"/game/:idGame"} component={IdGame} />
				<Route path={"/player"} component={Player} />
				<Route path={"/player/:idPlayer"} component={IdPlayer} />
				<Route path={"/person"} component={Person} />
				<Route path={"/person/:idPerson"} component={IdPerson} />
				<Route path={"/search"} component={Search} />
				<Route path={"/standings/:idGameGroup"} component={Standings} />
				<Route path={"/test"} component={Test} />
				<Route>404: No such page!</Route>
			</Switch>
		</>
	);
};

export default Router;
