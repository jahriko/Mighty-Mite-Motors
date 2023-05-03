import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import "./Login.css";

const LoginPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const credentials = {
		username: "admin",
		password: "password123",
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (username === credentials.username && password === credentials.password) {
			setError(false);
			setIsAuthenticated(true);
		} else {
			setError(true);
		}
	};

	return (
		<div className="login-page">
			<div className="login-form">
				<h1>Login</h1>
				<form onSubmit={handleSubmit}>
					<div className="p-field">
						<label htmlFor="username">Username</label>
						<InputText
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className={classNames({ "p-invalid": error })}
						/>
					</div>
					<div className="p-field">
						<label htmlFor="password">Password</label>
						<InputText
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={classNames({ "p-invalid": error })}
						/>
					</div>
					{error && <small className="p-error">Invalid username or password</small>}
					<Button type="submit" label="Login" />
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
