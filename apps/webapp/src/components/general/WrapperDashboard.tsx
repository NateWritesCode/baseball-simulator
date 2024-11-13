import SimulateButton from "@/components/general/SimulateButton";
import { ColorModeButton, useColorMode } from "@/components/ui/color-mode";
import { Box, Button, Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import { PiBaseballHelmetDuotone } from "react-icons/pi";
import SelectLeague from "../league/SelectLeague";
import SelectTeam from "../team/SelectTeam";
import UniverseDate from "../universe/UniverseDate";

const WrapperDashboard: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { colorMode } = useColorMode();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const scrollbarColor =
		colorMode === "light" ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.3)";
	const scrollbarColorHover =
		colorMode === "light" ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)";

	const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color:   ${scrollbarColor};
      border-radius: 20px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: ${scrollbarColorHover};
    }
  `;

	const SidebarContent = () => (
		<Flex flexDir="column" h="full">
			<style>{scrollbarStyles}</style>
			{/* Sidebar Header */}
			<Flex
				h="16"
				alignItems="center"
				justifyContent="space-between"
				px="4"
				borderBottom="1px solid"
				borderColor="border"
				borderRightWidth={1}
				borderRightStyle={"solid"}
			>
				<Flex alignItems={"center"} gap="2">
					<Icon fontSize={["3xl", "3xl", "4xl"]}>
						<PiBaseballHelmetDuotone />
					</Icon>
					<Text fontSize={["sm", "sm", "lg"]} fontWeight="bold">
						Baseball Simulator
					</Text>
				</Flex>
				{isMobile && (
					<IconButton
						variant="outline"
						onClick={() => setIsMobileMenuOpen(false)}
						p="2"
						size="sm"
						borderRadius={"sm"}
					>
						<LuX />
					</IconButton>
				)}
			</Flex>

			{/* Scrollable Sidebar Content */}
			<Box
				flex="1"
				overflowY="auto"
				className="custom-scrollbar"
				borderColor="border"
				borderRightWidth={1}
				borderRightStyle={"solid"}
			>
				<Box as="nav" p="4">
					<SelectLeague />
					<SelectTeam />
					{/* {menuItems.map((item, index) => (
						<Link
							key={`${item.label}-${index}`}
							href="#"
							display="flex"
							alignItems="center"
							p="3"
							mb="2"
							borderRadius="lg"
							_hover={{ bg: "whiteAlpha.200", textDecoration: "none" }}
							transition="all 0.2s"
							color="fg"
						>
							<Box as={item.icon} />
							<Text ml="3">{item.label}</Text>
						</Link>
					))} */}
				</Box>
			</Box>

			{/* Sidebar Footer */}
			<Box
				p="4"
				borderColor="border"
				borderTopWidth={1}
				borderTopStyle={"solid"}
				borderRightWidth={1}
				borderRightStyle={"solid"}
			>
				<ColorModeButton />
			</Box>
		</Flex>
	);

	return (
		<Box bg="bg" minH="100vh">
			{/* Mobile Overlay */}
			{isMobile && isMobileMenuOpen && (
				<Box
					position="fixed"
					inset="0"
					bg="bg"
					onClick={() => setIsMobileMenuOpen(false)}
					zIndex={40}
					transition="opacity 0.3s"
				/>
			)}

			{/* Sidebar */}
			<Box
				position="fixed"
				top="0"
				bottom="0"
				left="0"
				h="full"
				w="64"
				bg="bg"
				color="fg"
				zIndex={isMobile ? 50 : "auto"}
				transform={
					isMobile
						? isMobileMenuOpen
							? "translateX(0)"
							: "translateX(-100%)"
						: "translateX(0)"
				}
				transition="transform 0.3s ease-in-out"
			>
				<SidebarContent />
			</Box>

			{/* Main Content Area */}
			<Box ml={isMobile ? 0 : "64"} transition="margin 0.3s">
				{/* Fixed Header */}
				<Flex
					as="header"
					h="16"
					color="fg"
					bg="bg"
					position="fixed"
					top={0}
					right={0}
					left={isMobile ? 0 : "64"}
					zIndex={30}
					alignItems="center"
					px={{ base: 4, lg: 6 }}
					transition="left 0.3s"
					borderColor={"border"}
					borderBottomWidth={1}
					borderBottomStyle={"solid"}
				>
					{isMobile && (
						<Button
							variant="outline"
							onClick={() => setIsMobileMenuOpen(true)}
							p="2"
							borderRadius="lg"
						>
							<LuMenu size={20} />
						</Button>
					)}

					<Flex
						flex="1"
						alignItems="center"
						justifyContent="flex-end"
						ml={isMobile ? 4 : 0}
						gap="2"
					>
						<Box>
							<UniverseDate />
						</Box>
						<Box>
							<SimulateButton />
						</Box>
					</Flex>
				</Flex>

				{/* Main Content */}
				<Box as="main" pt="16">
					{children}
				</Box>
			</Box>
		</Box>
	);
};

export default WrapperDashboard;
