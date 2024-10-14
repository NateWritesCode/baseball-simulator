import SimulateButton from "@webapp/components/general/SimulateButton";
import { Button } from "@webapp/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
} from "@webapp/components/ui/dropdown-menu";
import { Mic, SquareUser, Triangle } from "lucide-react";

const WrapperDashboard: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return (
		<div className="grid h-screen w-full pl-[53px]">
			<aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
				<div className="border-b p-2">
					<Button variant="outline" size="icon" aria-label="Home">
						<Triangle className="size-5 fill-foreground" />
					</Button>
				</div>
				<nav className="grid gap-1 p-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-lg"
								aria-label="Playground"
							>
								<Mic className="size-5" />
							</Button>
						</DropdownMenuTrigger>
					</DropdownMenu>
				</nav>
				<nav className="mt-auto grid gap-1 p-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-lg"
								aria-label="Playground"
							>
								<SquareUser className="size-5" />
							</Button>
						</DropdownMenuTrigger>
					</DropdownMenu>
				</nav>
			</aside>
			<div className="flex flex-col">
				<header className="sticky top-0 z-10 flex h-[57px] items-center place-content-between gap-1 border-b bg-background px-4">
					<h1 className="text-xl font-semibold">Baseball Simulator</h1>
					<div>
						<SimulateButton />
					</div>
				</header>
				<main className="ml-[4px]">{children}</main>
			</div>
		</div>
	);
};

export default WrapperDashboard;
