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

interface RawMaterial {
	material_id_numb?: number;
	material_name: string;
	unit_of_measurement: string;
	quantity_in_stock: number;
	reorder_point: number;
}

export default function RawMaterial() {
	const emptyRawMaterial = {
		material_id_numb: 0,
		material_name: "",
		unit_of_measurement: "",
		quantity_in_stock: 0,
		reorder_point: 0,
	};

	const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
	const [dialog, setDialog] = useState(false);
	const [deleteRawMaterialDialog, setDeleteRawMaterialDialog] = useState(false);
	const [deleteRawMaterialsDialog, setDeleteRawMaterialsDialog] = useState(false);
	const [rawMaterial, setRawMaterial] = useState<RawMaterial>(emptyRawMaterial);
	const [selectedRawMaterials, setSelectedRawMaterials] = useState<RawMaterial[]>([]);
	const [submitted, setSubmitted] = useState(false);
	const [globalFilter, setGlobalFilter] = useState<string>("");
	const toast = useRef<Toast>(null);
	const dt = useRef(null);

	useEffect(() => {
		getRawMaterials();
	}, []);

	const openNew = () => {
		setRawMaterial(emptyRawMaterial);
		setSubmitted(false);
		setDialog(true);
	};

	const hideDialog = () => {
		setSubmitted(false);
		setDialog(false);
	};

	const hideDeleteRawMaterialDialog = () => {
		setDeleteRawMaterialDialog(false);
	};

	const hideDeleteRawMaterialsDialog = () => {
		setDeleteRawMaterialsDialog(false);
	};

	const editRow = (rawMaterial: RawMaterial) => {
		setRawMaterial({ ...rawMaterial });
		setDialog(true);
	};

	const deleteRawMaterial = () => {
		const _rawMaterials = rawMaterials.filter(
			(val) => val.material_id_numb !== rawMaterial.material_id_numb
		);

		const _rawMaterial = { ...rawMaterial };
		console.log(_rawMaterial.material_name);

		deleteRecord(_rawMaterial);
		setRawMaterials(_rawMaterials);
		setDeleteRawMaterialDialog(false);
		setRawMaterial(emptyRawMaterial);
	};

	const confirmDeleteRawMaterial = (rawMaterial: RawMaterial) => {
		setRawMaterial(rawMaterial);
		setDeleteRawMaterialDialog(true);
	};

	async function getRawMaterials() {
		const getData = fetch(
			"http://localhost/db_final_project/api.php?endpoint=raw-materials"
		).then((res) => res.json());

		getData.then((data) => {
			setRawMaterials(data);
		});
	}

	const confirmDeleteSelected = () => {
		setDeleteRawMaterialsDialog(true);
	};

	const deleteSelectedRawMaterials = () => {
		const _rawMaterials = rawMaterials.filter(
			(val) => !selectedRawMaterials.includes(val)
		);

		setRawMaterials(_rawMaterials);
		setDeleteRawMaterialsDialog(false);
		setSelectedRawMaterials(null);
		toast.current.show({
			severity: "success",
			summary: "Successful",
			detail: "Raw Materials Deleted",
			life: 3000,
		});
	};

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
		const val = (e.target && e.target.value) || "";
		const _rawMaterial = { ...rawMaterial };

		_rawMaterial[`${name}`] = val;

		setRawMaterial(_rawMaterial);
	};

	const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
		const val = e.value || 0;
		const _rawMaterial = { ...rawMaterial };

		_rawMaterial[`${name}`] = val;

		setRawMaterial(_rawMaterial);
	};

	async function updateRecord(record: RawMaterial) {
		try {
			const res = await fetch(
				"http://localhost/db_final_project/update.php?endpoint=update-raw-material",
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

	async function deleteRecord(record: RawMaterial) {
		try {
			const res = await fetch(
				"http://localhost/db_final_project/delete.php?endpoint=delete-raw-material",
				{
					method: "POST",
					body: JSON.stringify({ material_id_numb: record.material_id_numb }),
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
					disabled={!selectedRawMaterials || !selectedRawMaterials.length}
				/>
			</div>
		);
	};

	const actionBodyTemplate = (rowData: RawMaterial) => {
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
					onClick={() => confirmDeleteRawMaterial(rowData)}
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
			<h4 className="m-0">Manage Raw Materials</h4>
			<span className="p-input-icon-left">
				<i className="pi pi-search" />
				<InputText type="search" onInput={handleInputChange} placeholder="Search..." />
			</span>
		</div>
	);

	const saveRawMaterial = () => {
		setSubmitted(true);

		if (rawMaterial.material_name.trim()) {
			const _rawMaterials = [...rawMaterials];
			const _rawMaterial = { ...rawMaterial };

			if (rawMaterial.material_id_numb) {
				const index = findIndexById(rawMaterial.material_id_numb);

				_rawMaterials[index] = _rawMaterial;
				updateRecord(_rawMaterials[index]);
			} else {
				_rawMaterials.push(_rawMaterial);
				toast.current.show({
					severity: "success",
					summary: "Successful",
					detail: "Record Created Successfully",
					life: 3000,
				});
			}

			setRawMaterials(_rawMaterials);
			setDialog(false);
			setRawMaterial(emptyRawMaterial);
		}
	};

	const findIndexById = (id: number) => {
		let index = -1;

		for (let i = 0; i < rawMaterials.length; i++) {
			if (rawMaterials[i].material_id_numb === id) {
				index = i;
				break;
			}
		}

		return index;
	};

	const rawMaterialDialogFooter = (
		<>
			<Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
			<Button label="Save" icon="pi pi-check" onClick={saveRawMaterial} />
		</>
	);
	const deleteRawMaterialDialogFooter = (
		<>
			<Button
				label="No"
				icon="pi pi-times"
				outlined
				onClick={hideDeleteRawMaterialDialog}
			/>
			<Button
				label="Yes"
				icon="pi pi-check"
				severity="danger"
				onClick={deleteRawMaterial}
			/>
		</>
	);
	const deleteRawMaterialsDialogFooter = (
		<>
			<Button
				label="No"
				icon="pi pi-times"
				outlined
				onClick={hideDeleteRawMaterialsDialog}
			/>
			<Button
				label="Yes"
				icon="pi pi-check"
				severity="danger"
				onClick={deleteSelectedRawMaterials}
			/>
		</>
	);

	const handleSelectionChange = (e) => {
		setSelectedRawMaterials(e.value);
	};

	return (
		<div>
			<Toast ref={toast} />
			<div className="card p-fluid">
				<Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

				<DataTable
					ref={dt}
					value={rawMaterials}
					selection={selectedRawMaterials}
					onSelectionChange={handleSelectionChange}
					dataKey="material_id_numb"
					paginator
					rows={10}
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					editMode="row"
					globalFilter={globalFilter}
					header={header}
				>
					<Column selectionMode="multiple" exportable={false}></Column>
					<Column
						field="material_name"
						header="Material Name"
						editor={(options) => textEditor(options)}
						sortable
						style={{ width: "20%" }}
					></Column>
					<Column
						field="unit_of_measurement"
						header="Unit of Measurement"
						editor={(options) => textEditor(options)}
						sortable
						style={{ width: "20%" }}
					></Column>
					<Column
						field="quantity_in_stock"
						header="Quantity in Stock"
						editor={(options) => textEditor(options)}
						sortable
						style={{ width: "20%" }}
					></Column>
					<Column
						field="reorder_point"
						header="Reorder Point"
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
				header="Raw Material Details"
				modal
				className="p-fluid"
				footer={rawMaterialDialogFooter}
				onHide={hideDialog}
			>
				<div className="field">
					<label htmlFor="name" className="font-bold">
						Material Name
					</label>
					<InputText
						id="material_name"
						value={rawMaterial.material_name}
						onChange={(e) => onInputChange(e, "material_name")}
						required
						autoFocus
						className={classNames({
							"p-invalid": submitted && !rawMaterial.material_name,
						})}
					/>
					{submitted && !rawMaterial.material_name && (
						<small className="p-error">Material name is required.</small>
					)}
				</div>
				<div className="field">
					<label htmlFor="um" className="font-bold">
						Unit of Measurement
					</label>
					<InputText
						id="unit_of_measurement"
						value={rawMaterial.unit_of_measurement}
						onChange={(e) => onInputChange(e, "unit_of_measurement")}
						required
						autoFocus
						className={classNames({
							"p-invalid": submitted && !rawMaterial.unit_of_measurement,
						})}
					/>
					{submitted && !rawMaterial.unit_of_measurement && (
						<small className="p-error">Unit of Measurement is required.</small>
					)}
				</div>
				<div className="field col">
					<label htmlFor="quantity" className="font-bold">
						Quantity In Stock
					</label>
					<InputNumber
						id="quantity"
						value={rawMaterial.quantity_in_stock}
						onValueChange={(e) => onInputNumberChange(e, "quantity")}
					/>
				</div>
				<div className="field col">
					<label htmlFor="reorder_point" className="font-bold">
						Reorder Point
					</label>
					<InputNumber
						id="reorder_point"
						value={rawMaterial.reorder_point}
						onValueChange={(e) => onInputNumberChange(e, "reorder_point")}
					/>
				</div>
			</Dialog>

			<Dialog
				visible={deleteRawMaterialDialog}
				style={{ width: "32rem" }}
				breakpoints={{ "960px": "75vw", "641px": "90vw" }}
				header="Confirm"
				modal
				footer={deleteRawMaterialDialogFooter}
				onHide={hideDeleteRawMaterialDialog}
			>
				<div className="confirmation-content">
					<i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
					{rawMaterial && (
						<span>
							Are you sure you want to delete <b>{rawMaterial.material_name}</b>?
						</span>
					)}
				</div>
			</Dialog>

			<Dialog
				visible={deleteRawMaterialsDialog}
				style={{ width: "32rem" }}
				breakpoints={{ "960px": "75vw", "641px": "90vw" }}
				header="Confirm"
				modal
				footer={deleteRawMaterialsDialogFooter}
				onHide={hideDeleteRawMaterialsDialog}
			>
				<div className="confirmation-content">
					<i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
					{rawMaterial && (
						<span>Are you sure you want to delete the selected products?</span>
					)}
				</div>
			</Dialog>
		</div>
	);
}
