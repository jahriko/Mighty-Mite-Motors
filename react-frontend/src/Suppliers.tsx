import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import {
	useUpdateSupplier,
	Supplier,
	useCreateSupplier,
	useDeleteSupplier,
	useSuppliers,
} from "./utils/api";

export default function Suppliers() {
	const emptySupplier = {
		supplier_numb: 0,
		supplier_name: "",
		supplier_street: "",
		supplier_city: "",
		supplier_state: "",
		supplier_zip: "",
		supplier_phone: "",
	};

	const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);
	const [deleteSuppliersDialog, setDeleteSuppliersDialog] = useState(false);
	const [deleteSupplierDialog, setDeleteSupplierDialog] = useState(false);
	const [supplier, setSupplier] = useState<Supplier>(emptySupplier);
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [globalFilter, setGlobalFilter] = useState<string>("");
	const updateSupplier = useUpdateSupplier();
	const createSupplier = useCreateSupplier();
	const deleteSupplier = useDeleteSupplier();
	const [submitted, setSubmitted] = useState(false);
	const [dialog, setDialog] = useState(false);
	const { data } = useSuppliers();
	const toast = useRef<Toast>(null);
	const dt = useRef(null);

	const handleSuccess = (action) => {
		setDialog(false);
		setSupplier(emptySupplier);
		toast.current?.show({
			severity: "success",
			summary: "Successful",
			detail: `Supplier ${action}`,
			life: 3000,
		});
	};

	const handleError = (action) => {
		toast.current?.show({
			severity: "error",
			summary: "Error Message",
			detail: `Supplier Not ${action}`,
			life: 3000,
		});
	};

	const handleSubmit = () => {
		setSubmitted(true);

		// Update Supplier
		if (supplier.supplier_numb) {
			updateSupplier.mutate(supplier, {
				onSuccess: () => handleSuccess("Updated"),
				onError: () => handleError("Updated"),
			});
		}
		// Create Supplier
		else {
			createSupplier.mutate(supplier, {
				onSuccess: () => handleSuccess("Created"),
				onError: () => handleError("Created"),
			});
		}
	};

	const openNew = () => {
		setSupplier(emptySupplier);
		setSubmitted(false);
		setDialog(true);
	};

	const hideDialog = () => {
		setSubmitted(false);
		setDialog(false);
	};

	const hideDeleteRawMaterialDialog = () => {
		setDeleteSupplierDialog(false);
	};

	const hideDeleteSuppliersDialog = () => {
		setDeleteSuppliersDialog(false);
	};

	const editRow = (supplier: Supplier) => {
		setSupplier({ ...supplier });
		setDialog(true);
	};

	const handleDelete = () => {
		const _rawMaterials = suppliers.filter(
			(val) => val.supplier_numb !== supplier.supplier_numb
		);

		const _supplier = { ...supplier };

		setSuppliers(_rawMaterials);

		deleteSupplier.mutate(_supplier, {
			onSuccess: () => handleSuccess("Deleted"),
			onError: () => handleError("Deleted"),
		});

		setDeleteSupplierDialog(false);
		setSupplier(emptySupplier);
	};

	const confirmDeleteSupplier = (supplier: Supplier) => {
		setSupplier(supplier);
		console.log(supplier);
		setDeleteSupplierDialog(true);
	};

	const confirmDeleteSelected = () => {
		setDeleteSuppliersDialog(true);
	};

	const deleteSelectedSuppliers = () => {
		const _suppliers = suppliers.filter((val) => !selectedSuppliers.includes(val));

		setSuppliers(_suppliers);
		setDeleteSuppliersDialog(false);
		setSelectedSuppliers(null);
		toast.current.show({
			severity: "success",
			summary: "Successful",
			detail: "Suppliers Deleted",
			life: 3000,
		});
	};

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
		const val = (e.target && e.target.value) || "";
		const _rawMaterial = { ...supplier };

		_rawMaterial[`${name}`] = val;

		setSupplier(_rawMaterial);
	};

	const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
		const val = e.value || 0;
		const _rawMaterial = { ...supplier };

		_rawMaterial[`${name}`] = val;

		setSupplier(_rawMaterial);
	};

	const textEditor = (options) => {
		return (
			<InputText
				type="text"
				value={options.value}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					options.editorCallback(e.target.value)
				}
			/>
		);
	};

	const leftToolbarTemplate = () => {
		return (
			<div className="flex gap-2">
				<Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
				<Button
					label="Delete"
					icon="pi pi-trash"
					severity="danger"
					onClick={confirmDeleteSelected}
					disabled={!selectedSuppliers || !selectedSuppliers.length}
				/>
			</div>
		);
	};

	const actionBodyTemplate = (rowData: Supplier) => {
		return (
			<>
				<Button
					icon="pi pi-pencil"
					rounded
					outlined
					className="mr-2"
					onClick={() => editRow(rowData)}
				/>
				<Button
					icon="pi pi-trash"
					rounded
					outlined
					severity="danger"
					onClick={() => confirmDeleteSupplier(rowData)}
				/>
			</>
		);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		setGlobalFilter(newValue);
	};

	const header = (
		<div className="flex flex-wrap gap-2 align-items-center justify-content-between">
			<h4 className="m-0">Manage Suppliers</h4>
			<span className="p-input-icon-left">
				<i className="pi pi-search" />
				<InputText type="search" onInput={handleInputChange} placeholder="Search..." />
			</span>
		</div>
	);

	const dialogSupplierFooter = (
		<>
			<Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
			<Button label="Save" icon="pi pi-check" onClick={handleSubmit} />
		</>
	);
	const deleteSupplierDialogFooter = (
		<>
			<Button
				label="No"
				icon="pi pi-times"
				outlined
				onClick={hideDeleteRawMaterialDialog}
			/>
			<Button label="Yes" icon="pi pi-check" severity="danger" onClick={handleDelete} />
		</>
	);
	const deleteSuppliersDialogFooter = (
		<>
			<Button
				label="No"
				icon="pi pi-times"
				outlined
				onClick={hideDeleteSuppliersDialog}
			/>
			<Button
				label="Yes"
				icon="pi pi-check"
				severity="danger"
				onClick={deleteSelectedSuppliers}
			/>
		</>
	);

	const handleSelectionChange = (e) => {
		setSelectedSuppliers(e.value);
	};

	return (
		<div>
			<Toast ref={toast} />
			<div className="card p-fluid">
				<Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

				<DataTable
					ref={dt}
					value={data}
					selection={selectedSuppliers}
					onSelectionChange={handleSelectionChange}
					dataKey="supplier_numb"
					paginator
					rows={10}
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					editMode="row"
					globalFilter={globalFilter}
					header={header}
				>
					<Column selectionMode="multiple" exportable={false}></Column>
					<Column
						field="supplier_name"
						header="Supplier"
						editor={(options) => textEditor(options)}
						sortable
						style={{ width: "20%" }}
					></Column>
					<Column
						field="supplier_city"
						header="City"
						editor={(options) => textEditor(options)}
						sortable
						style={{ width: "20%" }}
					></Column>
					<Column
						field="supplier_state"
						header="State"
						editor={(options) => textEditor(options)}
						sortable
						style={{ width: "20%" }}
					></Column>
					<Column
						field="supplier_phone"
						header="Phone Number"
						editor={(options) => textEditor(options)}
						sortable
						style={{ width: "20%" }}
					></Column>
					<Column
						body={actionBodyTemplate}
						exportable={false}
						style={{ minWidth: "12rem" }}
					></Column>
				</DataTable>
			</div>
			<Dialog
				visible={dialog}
				style={{ width: "32rem" }}
				breakpoints={{ "960px": "75vw", "641px": "90vw" }}
				header="Supplier Details"
				modal
				className="p-fluid"
				footer={dialogSupplierFooter}
				onHide={hideDialog}
			>
				<div className="field">
					<label htmlFor="name" className="font-bold">
						Supplier Name
					</label>
					<InputText
						id="supplier_name"
						value={supplier.supplier_name}
						onChange={(e) => onInputChange(e, "supplier_name")}
						required
						autoFocus
						className={classNames({
							"p-invalid": submitted && !supplier.supplier_name,
						})}
					/>
					{submitted && !supplier.supplier_name && (
						<small className="p-error">Name is required.</small>
					)}
				</div>
				<div className="field">
					<label htmlFor="um" className="font-bold">
						City
					</label>
					<InputText
						id="supplier_city"
						value={supplier.supplier_city}
						onChange={(e) => onInputChange(e, "supplier_city")}
						required
						autoFocus
						className={classNames({
							"p-invalid": submitted && !supplier.supplier_city,
						})}
					/>
					{submitted && !supplier.supplier_city && (
						<small className="p-error">City is required.</small>
					)}
				</div>
				<div className="field">
					<label htmlFor="um" className="font-bold">
						State
					</label>
					<InputText
						id="supplier_state"
						value={supplier.supplier_state}
						onChange={(e) => onInputChange(e, "supplier_state")}
						required
						autoFocus
						className={classNames({
							"p-invalid": submitted && !supplier.supplier_state,
						})}
					/>
					{submitted && !supplier.supplier_state && (
						<small className="p-error">State is required.</small>
					)}
				</div>
				<div className="field">
					<label htmlFor="um" className="font-bold">
						Phone Number
					</label>
					<InputText
						id="supplier_phone"
						value={supplier.supplier_phone}
						onChange={(e) => onInputChange(e, "supplier_phone")}
						required
						autoFocus
						className={classNames({
							"p-invalid": submitted && !supplier.supplier_phone,
						})}
					/>
					{submitted && !supplier.supplier_phone && (
						<small className="p-error">Phone Number is required.</small>
					)}
				</div>
			</Dialog>

			<Dialog
				visible={deleteSupplierDialog}
				style={{ width: "32rem" }}
				breakpoints={{ "960px": "75vw", "641px": "90vw" }}
				header="Confirm"
				modal
				footer={deleteSupplierDialogFooter}
				onHide={hideDeleteRawMaterialDialog}
			>
				<div className="confirmation-content">
					<i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
					{supplier && (
						<span>
							Are you sure you want to delete <b>{supplier.supplier_name}</b>?
						</span>
					)}
				</div>
			</Dialog>

			<Dialog
				visible={deleteSuppliersDialog}
				style={{ width: "32rem" }}
				breakpoints={{ "960px": "75vw", "641px": "90vw" }}
				header="Confirm"
				modal
				footer={deleteSuppliersDialogFooter}
				onHide={hideDeleteSuppliersDialog}
			>
				<div className="confirmation-content">
					<i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
					{supplier && (
						<span>Are you sure you want to delete the selected suppliers?</span>
					)}
				</div>
			</Dialog>
		</div>
	);
}
