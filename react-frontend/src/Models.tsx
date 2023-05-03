import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { ListBox } from "primereact/listbox";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Divider } from "primereact/divider";

type Customer = {
	customer_numb?: number;
	customer_name: string;
	customer_street: string;
	customer_city: string;
	customer_state: string;
	customer_zip: string;
	contact_person: string;
	contact_phone: string;
	contact_fax: string;
};

export default function Model() {
	const emptyCustomer = {
		customer_name: "",
		customer_street: "",
		customer_city: "",
		customer_state: "",
		customer_zip: "",
		contact_person: "",
		contact_phone: "",
		contact_fax: "",
	};

	const [customers, setCustomers] = useState<Customer[]>([]);
	const [customer, setCustomer] = useState<Customer>(emptyCustomer);
	const [dialog, setDialog] = useState(false);
	const [deleteCustomerDialog, setDeleteCustomerDialog] = useState(false);
	const [deleteCustomersDialog, setDeleteCustomersDialog] = useState(false);
	const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
	const [submitted, setSubmitted] = useState(false);
	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
	const toast = useRef<Toast>(null);

	useEffect(() => {
		getCustomers();
	}, []);

	const openNew = () => {
		setCustomer(emptyCustomer);
		setSubmitted(false);
		setDialog(true);
	};

	const hideDialog = () => {
		setSubmitted(false);
		setDialog(false);
	};

	const hideDeleteCustomerDialog = () => {
		setDeleteCustomerDialog(false);
	};

	const hideDeleteCustomersDialog = () => {
		setDeleteCustomersDialog(false);
	};

	const editRow = (customer: Customer) => {
		setCustomer({ ...customer });
		setDialog(true);
	};

	const deleteCustomer = () => {
		const _customers = customers.filter(
			(val) => val.customer_numb !== customer.customer_numb
		);

		const _customer = { ...customer };

		deleteRecord(_customer);
		setCustomers(_customers);
		setDeleteCustomerDialog(false);
		setCustomer(emptyCustomer);
	};

	const confirmDeleteCustomer = (customer: Customer) => {
		setCustomer(customer);
		setDeleteCustomerDialog(true);
	};

	async function getCustomers() {
		const getData = fetch(
			"http://localhost/db_final_project/api.php?endpoint=customers"
		).then((res) => res.json());

		getData.then((data) => {
			setCustomers(data);
		});
	}

	const confirmDeleteSelected = () => {
		setDeleteCustomersDialog(true);
	};

	const deleteSelectedCustomers = () => {
		const _customers = customers.filter((val) => !selectedCustomers.includes(val));

		setCustomers(_customers);
		setDeleteCustomersDialog(false);
		setSelectedCustomers(null);
		toast.current.show({
			severity: "success",
			summary: "Successful",
			detail: "Customers Deleted",
			life: 3000,
		});
	};

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
		const val = (e.target && e.target.value) || "";
		const _customer = { ...customer };

		_customer[`${name}`] = val;

		setCustomer(_customer);
	};

	const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
		const val = e.value || 0;
		const _customer = { ...customer };

		_customer[`${name}`] = val;

		setCustomer(_customer);
	};

	async function createRecord(record: Customer) {
		try {
			const res = fetch(
				"https://localhost/db_final_project/create.php?endpoint=create-customer",
				{
					method: "POST",
					body: JSON.stringify(record),
				}
			);
			res.then((res) => {
				if (res.status === 200) {
					toast.current.show({
						severity: "success",
						summary: "Successful",
						detail: "Customer Created Successfully",
						life: 3000,
					});
				} else {
					toast.current.show({
						severity: "error",
						summary: "Error",
						detail: "Customer Create Error",
						life: 3000,
					});
				}
			});
		} catch (error) {
			console.error("Error creating record:", error);
			alert("Failed to create record");
		}
	}

	async function updateRecord(record: Customer) {
		try {
			const res = await fetch(
				"http://localhost/db_final_project/update.php?endpoint=update-customer",
				{
					method: "POST",
					body: JSON.stringify(record),
				}
			);
			if (res.status === 200) {
				toast.current.show({
					severity: "success",
					summary: "Successful",
					detail: "Record Updated Successfully",
					life: 3000,
				});
			} else {
				toast.current.show({
					severity: "error",
					summary: "Error",
					detail: "Record Update Error",
					life: 3000,
				});
			}
		} catch (error) {
			console.error("Error updating record:", error);
			alert("Failed to update record");
		}
	}

	async function deleteRecord(record: Customer) {
		try {
			const res = await fetch(
				"http://localhost/db_final_project/delete.php?endpoint=delete-customer",
				{
					method: "POST",
					body: JSON.stringify({ customer_numb: record.customer_numb }),
				}
			);

			if (res.status === 200) {
				toast.current.show({
					severity: "success",
					summary: "Successful",
					detail: "Record Deleted Successfully",
					life: 3000,
				});
			} else {
				toast.current.show({
					severity: "error",
					summary: "Error",
					detail: "Record Delete Error",
					life: 3000,
				});
			}
		} catch (error) {
			console.error("Error deleting record:", error);
		}
	}

	const leftToolbarTemplate = () => {
		return (
			<div className="flex gap-2">
				<Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
				<Button
					label="Delete"
					icon="pi pi-trash"
					severity="danger"
					onClick={confirmDeleteSelected}
					disabled={!selectedCustomers || !selectedCustomers.length}
				/>
			</div>
		);
	};

	const saveCustomer = () => {
		setSubmitted(true);

		if (customer.customer_name.trim()) {
			const _customers = [...customers];
			const _customer = { ...customer };

			if (customer.customer_numb) {
				const index = findIndexById(customer.customer_numb);

				_customers[index] = _customer;
				updateRecord(_customers[index]);
			} else {
				_customers.push(_customer);
				createRecord(_customer);
				toast.current.show({
					severity: "success",
					summary: "Successful",
					detail: "Record Created Successfully",
					life: 3000,
				});
			}

			setCustomers(_customers);
			setDialog(false);
			setCustomer(emptyCustomer);
		}
	};

	const findIndexById = (id: number) => {
		let index = -1;

		for (let i = 0; i < customers.length; i++) {
			if (customers[i].customer_numb === id) {
				index = i;
				break;
			}
		}

		return index;
	};

	const customerDialogFooter = (
		<>
			<Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
			<Button label="Save" icon="pi pi-check" onClick={saveCustomer} />
		</>
	);
	const deleteCustomerDialogFooter = (
		<>
			<Button label="No" icon="pi pi-times" outlined onClick={hideDeleteCustomerDialog} />
			<Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteCustomer} />
		</>
	);
	const deleteRawMaterialsDialogFooter = (
		<>
			<Button
				label="No"
				icon="pi pi-times"
				outlined
				onClick={hideDeleteCustomersDialog}
			/>
			<Button
				label="Yes"
				icon="pi pi-check"
				severity="danger"
				onClick={deleteSelectedCustomers}
			/>
		</>
	);

	const handleSelectionChange = (e) => {
		setSelectedCustomers(e.value);
	};

	const itemTemplate = (item) => {
		return (
			<CustomerListItem
				customerName={item.customer_name}
				contactPerson={item.contact_person}
			/>
		);
	};

	return (
		<>
			<Toast ref={toast} />
			<div className="border rounded">
				<Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
				<div className="p-3">
					<h4>Manage Customers</h4>
					<div>
						<Row>
							<Col xs="4">
								<ListBox
									filter
									value={selectedCustomer}
									options={customers}
									onChange={(e) => setSelectedCustomer(e.value)}
									itemTemplate={itemTemplate}
									style={{ minWidth: "12rem" }}
									optionLabel="customer_name"
									placeholder="Select a Customer"
								/>
							</Col>
							{!selectedCustomer ? (
								<Col>
									<div>Select a customer to view its details.</div>
								</Col>
							) : (
								<Col>
									<div>
										<div className="border p-4 rounded">
											<div className="flex justify-content-between">
												<h3 className="text-gray">{selectedCustomer.customer_name}</h3>
												<div>
													<Button
														icon="pi pi-pencil"
														rounded
														outlined
														className="mr-2"
														onClick={() => editRow(selectedCustomer)}
													/>
													<Button
														icon="pi pi-trash"
														rounded
														outlined
														severity="danger"
														onClick={() => confirmDeleteCustomer(selectedCustomer)}
													/>
												</div>
											</div>

											<Divider />
											{selectedCustomer.customer_city && (
												<div>
													<span className="block font-bold text-black text-opacity-25">
														City
													</span>
													<p className="text-xl font-medium">
														{selectedCustomer.customer_city}
													</p>
												</div>
											)}

											{selectedCustomer.customer_state && (
												<div>
													<span className="block font-bold text-black text-opacity-25">
														State
													</span>
													<p className="text-xl font-medium">
														{selectedCustomer.customer_state}
													</p>
												</div>
											)}

											{selectedCustomer.customer_zip && (
												<div>
													<span className="block font-bold text-black text-opacity-25">
														Zip
													</span>
													<p className="text-xl font-medium">
														{selectedCustomer.customer_zip}
													</p>
												</div>
											)}

											{selectedCustomer.contact_person && (
												<div>
													<span className="block font-bold text-black text-opacity-25">
														Contact Person
													</span>
													<p className="text-xl font-medium">
														{selectedCustomer.contact_person}
													</p>
												</div>
											)}

											{selectedCustomer.contact_phone && (
												<div>
													<span className="block font-bold text-black text-opacity-25">
														Contact Phone
													</span>
													<p className="text-xl font-medium">
														{selectedCustomer.contact_phone}
													</p>
												</div>
											)}

											{selectedCustomer.contact_fax && (
												<div>
													<span className="block font-bold text-black text-opacity-25">
														Contact Fax
													</span>
													<p className="text-xl font-medium">
														{selectedCustomer.contact_fax}
													</p>
												</div>
											)}
										</div>
									</div>
								</Col>
							)}
						</Row>
					</div>
				</div>
				<Dialog
					visible={dialog}
					style={{ width: "32rem" }}
					breakpoints={{ "960px": "75vw", "641px": "90vw" }}
					header="Customer Details"
					modal
					className="p-fluid"
					footer={customerDialogFooter}
					onHide={hideDialog}
				>
					<div className="field">
						<label htmlFor="customer_name" className="font-bold">
							Customer Name
						</label>
						<InputText
							id="material_name"
							value={customer.customer_name}
							onChange={(e) => onInputChange(e, "customer_name")}
							required
							autoFocus
							className={classNames({
								"p-invalid": submitted && !customer.customer_name,
							})}
						/>
						{submitted && !customer.customer_name && (
							<small className="p-error">Name is required.</small>
						)}
					</div>
					<div className="field">
						<label htmlFor="um" className="font-bold">
							Customer Street
						</label>
						<InputText
							id="customer_street"
							value={customer.customer_street}
							onChange={(e) => onInputChange(e, "customer_street")}
							required
							autoFocus
							className={classNames({
								"p-invalid": submitted && !customer.customer_street,
							})}
						/>
						{submitted && !customer.customer_street && (
							<small className="p-error">Street is required.</small>
						)}
					</div>
					<div className="field">
						<label htmlFor="customer_name" className="font-bold">
							Custome City
						</label>
						<InputText
							id="material_name"
							value={customer.customer_city}
							onChange={(e) => onInputChange(e, "customer_city")}
							required
							autoFocus
							className={classNames({
								"p-invalid": submitted && !customer.customer_city,
							})}
						/>
						{submitted && !customer.customer_city && (
							<small className="p-error">City is required.</small>
						)}
					</div>
					<div className="field">
						<label htmlFor="um" className="font-bold">
							Customer State
						</label>
						<InputText
							id="customer_state"
							value={customer.customer_state}
							onChange={(e) => onInputChange(e, "customer_state")}
							required
							autoFocus
							className={classNames({
								"p-invalid": submitted && !customer.customer_state,
							})}
						/>
						{submitted && !customer.customer_state && (
							<small className="p-error">State is required.</small>
						)}
					</div>
					<div className="field">
						<label htmlFor="um" className="font-bold">
							Customer Zip
						</label>
						<InputText
							id="customer_zip"
							value={customer.customer_zip}
							onChange={(e) => onInputChange(e, "customer_zip")}
							required
							autoFocus
							className={classNames({
								"p-invalid": submitted && !customer.customer_zip,
							})}
						/>
						{submitted && !customer.customer_zip && (
							<small className="p-error">Zip is required.</small>
						)}
					</div>
					<div className="field">
						<label htmlFor="contact_person" className="font-bold">
							Contact Person
						</label>
						<InputText
							id="material_name"
							value={customer.contact_person}
							onChange={(e) => onInputChange(e, "contact_person")}
							required
							autoFocus
							className={classNames({
								"p-invalid": submitted && !customer.contact_person,
							})}
						/>
						{submitted && !customer.contact_person && (
							<small className="p-error">Contact Person is required.</small>
						)}
					</div>
					<div className="field">
						<label htmlFor="um" className="font-bold">
							Contact Phone
						</label>
						<InputText
							id="contact_phone"
							value={customer.contact_phone}
							onChange={(e) => onInputChange(e, "contact_phone")}
							required
							autoFocus
							className={classNames({
								"p-invalid": submitted && !customer.contact_phone,
							})}
						/>
						{submitted && !customer.contact_phone && (
							<small className="p-error">Contact Phone is required.</small>
						)}
					</div>
					<div className="field">
						<label htmlFor="um" className="font-bold">
							Contact Fax
						</label>
						<InputText
							id="contact_fax"
							value={customer.contact_fax}
							onChange={(e) => onInputChange(e, "contact_fax")}
							required
							autoFocus
							className={classNames({
								"p-invalid": submitted && !customer.contact_fax,
							})}
						/>
						{submitted && !customer.contact_fax && (
							<small className="p-error">Contact Fax is required.</small>
						)}
					</div>
				</Dialog>

				<Dialog
					visible={deleteCustomerDialog}
					style={{ width: "32rem" }}
					breakpoints={{ "960px": "75vw", "641px": "90vw" }}
					header="Confirm"
					modal
					footer={deleteCustomerDialogFooter}
					onHide={hideDeleteCustomerDialog}
				>
					<div className="confirmation-content">
						<i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
						{customer && (
							<span>
								Are you sure you want to delete <b>{customer.customer_name}</b>?
							</span>
						)}
					</div>
				</Dialog>
			</div>
		</>
	);
}

const CustomerListItem = (props) => {
	const { customerName, contactPerson } = props;

	return (
		<div>
			<h6>{customerName}</h6>
			<small>{contactPerson}</small>
		</div>
	);
};
