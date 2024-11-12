import { Box, Button, Flex, Grid, Heading, Link, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
	LuHelpCircle,
	LuHome,
	LuLogOut,
	LuMenu,
	LuSettings,
	LuUser,
	LuX,
} from "react-icons/lu";

const WrapperDashboard: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
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

	const menuItems = [
		{ icon: LuHome, label: "Dashboard" },
		{ icon: LuUser, label: "Profile" },
		{ icon: LuSettings, label: "Settings" },
		{ icon: LuHelpCircle, label: "Help" },
		...Array(20)
			.fill(null)
			.map((_, i) => ({
				icon: LuSettings,
				label: `Menu Item ${i + 1}`,
			})),
	];

	const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 20px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: rgba(255, 255, 255, 0.5);
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
				borderColor="whiteAlpha.300"
			>
				<Text fontSize="xl" fontWeight="bold">
					Dashboard
				</Text>
				{isMobile && (
					<Button
						variant="ghost"
						onClick={() => setIsMobileMenuOpen(false)}
						p="2"
						borderRadius="lg"
						_hover={{ bg: "whiteAlpha.200" }}
						color="white"
					>
						<LuX size={20} />
					</Button>
				)}
			</Flex>

			{/* Scrollable Sidebar Content */}
			<Box flex="1" overflowY="auto" className="custom-scrollbar">
				<Box as="nav" p="4">
					{menuItems.map((item, index) => (
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
							color="white"
						>
							<Box as={item.icon} />
							<Text ml="3">{item.label}</Text>
						</Link>
					))}
				</Box>
			</Box>

			{/* Sidebar Footer */}
			<Box p="4" borderTop="1px solid" borderColor="whiteAlpha.300">
				<Button
					variant="ghost"
					display="flex"
					alignItems="center"
					w="full"
					borderRadius="lg"
					_hover={{ bg: "whiteAlpha.200" }}
					color="white"
				>
					<LuLogOut size={20} />
					<Text ml="3">Logout</Text>
				</Button>
			</Box>
		</Flex>
	);

	return (
		<Box bg="gray.100" minH="100vh">
			{/* Mobile Overlay */}
			{isMobile && isMobileMenuOpen && (
				<Box
					position="fixed"
					inset="0"
					bg="blackAlpha.600"
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
				bg="gray.900"
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
					bg="white"
					boxShadow="sm"
					position="fixed"
					top={0}
					right={0}
					left={isMobile ? 0 : "64"}
					zIndex={30}
					alignItems="center"
					px={{ base: 4, lg: 6 }}
					transition="left 0.3s"
				>
					{isMobile && (
						<Button
							variant="ghost"
							onClick={() => setIsMobileMenuOpen(true)}
							p="2"
							borderRadius="lg"
							_hover={{ bg: "gray.100" }}
						>
							<LuMenu size={20} />
						</Button>
					)}

					<Flex
						flex="1"
						alignItems="center"
						justifyContent="space-between"
						ml={isMobile ? 4 : 0}
					>
						<Box>Item 1</Box>
						<Flex gap="4">
							<Box>Item 2</Box>
							<Box>Item 3</Box>
						</Flex>
					</Flex>
				</Flex>

				{/* Main Content */}
				<Box as="main" pt="16" px={{ base: 4, lg: 6 }} py="8">
					{children}

					{/* Example Grid Content */}
					<Grid
						templateColumns={{
							base: "1fr",
							md: "repeat(2, 1fr)",
							lg: "repeat(3, 1fr)",
						}}
						gap="6"
						mt="6"
					>
						{Array(90)
							.fill(null)
							.map((_, i) => (
								<Box key={i} bg="white" borderRadius="lg" boxShadow="sm" p="2">
									<Heading
										as="h2"
										fontSize="lg"
										fontWeight="semibold"
										mb="4"
										color="black"
									>
										Card {i + 1}
									</Heading>
									<Text color="gray.600">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
										do eiusmod tempor incididunt ut labore et dolore magna
										aliqua.
									</Text>
								</Box>
							))}
					</Grid>
				</Box>
			</Box>
		</Box>
	);
};

export default WrapperDashboard;
