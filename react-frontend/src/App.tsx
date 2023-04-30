import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import RawMaterials from "./RawMaterials";
import Customers from "./Customers";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => <div>Dashboard</div>;
// const RawMaterials = () => <div>Raw Materials</div>;
const Orders = () => <div>Orders</div>;
// const Customers = () => <div>Customers</div>;
const Suppliers = () => <div>Suppliers</div>;

const App = () => {
	return (
		<Router>
			<Sidebar />
			<div style={{ marginLeft: "250px", padding: "20px" }}>
				<Routes>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/raw-materials" element={<RawMaterials />} />
					<Route path="/orders" element={<Orders />} />
					<Route path="/customers" element={<Customers />} />
					<Route path="/suppliers" element={<Suppliers />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
