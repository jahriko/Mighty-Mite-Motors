import { NavLink, useMatch } from "react-router-dom";
import styled from "@emotion/styled";



const SidebarContainer = styled.div`
	background-color: #282c34;
	width: 250px;
	height: 100vh;
	position: fixed;
	left: 0;
	top: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	font-family: Inter;
`;

const Logo = styled.h1`
	color: white;
	margin-top: 20px;
`;

const NavMenu = styled.ul`
	list-style: none;
	width: 100%;
	padding: 0;
`;

const NavItem = styled.li`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 50px;
	width: 100%;
`;

const StyledNavLink = styled(NavLink)`
	text-decoration: none;
	padding: 15px 0;
	color: white;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: background-color 0.3s ease;

	&:hover,
	&.active {
		background-color: #3d4049;
	}
`;

const CustomNavLink = ({ to, children }) => {
	const match = useMatch(to);

	return (
		<StyledNavLink to={to} className={match ? "active" : ""}>
			{children}
		</StyledNavLink>
	);
};

const Sidebar = () => {
	return (
		<SidebarContainer>
			<Logo>MMM</Logo>
			<NavMenu>
				<NavItem>
					<CustomNavLink to="/dashboard">Dashboard</CustomNavLink>
				</NavItem>
				<NavItem>
					<CustomNavLink to="/raw-materials">Raw Materials</CustomNavLink>
				</NavItem>
				<NavItem>
					<CustomNavLink to="/orders">Orders</CustomNavLink>
				</NavItem>
				<NavItem>
					<CustomNavLink to="/customers">Customers</CustomNavLink>
				</NavItem>
				<NavItem>
					<CustomNavLink to="/suppliers">Suppliers</CustomNavLink>
				</NavItem>
			</NavMenu>
		</SidebarContainer>
	);
};

export default Sidebar;
