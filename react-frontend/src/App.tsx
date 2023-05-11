import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import RawMaterials from "./RawMaterials";
import Customers from "./Customers";
import Orders from "./Orders";
import Models from "./Models";
import Suppliers from "./Suppliers";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

const Dashboard = () => <div>Dashboard</div>;

const App = () => {
	return (
		<>
			<Router>
				<Sidebar />
				<div style={{ marginLeft: "250px", padding: "20px" }}>
					<Routes>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/raw-materials" element={<RawMaterials />} />
						<Route path="/orders" element={<Orders />} />
						<Route path="/customers" element={<Customers />} />
						<Route path="/suppliers" element={<Suppliers />} />
						{/* <Route path="/models" element={<Models />} /> */}
					</Routes>
				</div>
			</Router>
		</>

		// <div className="login-page">
		// 	<div className="login-form">
		// 		<h1>Login</h1>
		// 		<form onSubmit={handleSubmit}>
		// 			<div className="p-field">
		// 				<label htmlFor="username">Username</label>
		// 				<InputText
		// 					id="username"
		// 					value={username}
		// 					onChange={(e) => setUsername(e.target.value)}
		// 					className={classNames({ "p-invalid": error })}
		// 				/>
		// 			</div>
		// 			<div className="p-field">
		// 				<label htmlFor="password">Password</label>
		// 				<InputText
		// 					id="password"
		// 					type="password"
		// 					value={password}
		// 					onChange={(e) => setPassword(e.target.value)}
		// 					className={classNames({ "p-invalid": error })}
		// 				/>
		// 			</div>
		// 			{error && <small className="p-error">Invalid username or password</small>}
		// 			<Button type="submit" label="Login"></Button>
		// 		</form>
		// 	</div>
		// </div>
	);
};

export default App;
