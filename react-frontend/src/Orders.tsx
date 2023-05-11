import React, { useState, useRef, useEffect } from "react";

import {
	DataTable,
	DataTableExpandedRows,
	DataTableRowEvent,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import {
	Model,
	Order,
	OrderLine,
	useModels,
	useOrders,
	useCustomers,
	Customer,
	useCreateOrder,
} from "./utils/api";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";

type ModelDescNumb = Pick<OrderLine, "model_description" | "model_numb">;

type CustomerNameID = Pick<Order, "customer_name" | "customer_numb">;

type OrderWithoutOrders = Omit<Order, "orders" | "order_numb" | "customer_name">;

export default function Orders() {
	const emptyOrder = {
		order_numb: 0,
		customer_numb: 0,
		customer_name: "",
		order_date: new Date(),
		order_total: 0,
		order_filled: false,
		orders: [],
	};

	const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows>(null);
	const [globalFilter, setGlobalFilter] = useState<string>("");
	const [order, setOrder] = useState<Order>(emptyOrder);
	const [orders, setOrders] = useState<Order[]>([]);
	const [submitted, setSubmitted] = useState(false);
	const [orderTotal, setOrderTotal] = useState(0);
	const [dialog, setDialog] = useState(false);
	const toast = useRef<Toast>(null);
	const { data } = useOrders();
	const { data: modelData } = useModels();
	const { data: customerData } = useCustomers();
	const [checked, setChecked] = useState(false);
	const createOrder = useCreateOrder();

	useEffect(() => {
		setOrders(data);
	}, [data]);

	const [orderLine, setOrderLine] = useState<OrderLine[]>([]);

	const [selectedModel, setSelectedModel] = useState<ModelDescNumb>({
		model_description: "",
		model_numb: 0,
	});
	const [selectedCustomer, setSelectedCustomer] = useState<CustomerNameID>({
		customer_name: "",
		customer_numb: 0,
	});
	const [modelQuantity, setModelQuantity] = useState<number>(0);

	const statusOrderBodyTemplate = (rowData: Order) => {
		return (
			<Tag
				className={`order-badge status-${rowData.order_filled ? "success" : "warning"}`}
				value={rowData.order_filled ? "Filled" : "Pending"}
			/>
		);
	};

	const hideDialog = () => {
		setSubmitted(false);
		setDialog(false);
	};

	const openNew = () => {
		setOrder(emptyOrder);
		setSubmitted(false);
		setDialog(true);
	};

	const handleSubmit = () => {
		setSubmitted(true);

		if (orderLine.length > 0) {
			const date = new Date();
			const formattedDate = date.toISOString().split("T")[0];
			
			const _order: Omit<Order, "order_numb" | "customer_name"> = {
				customer_numb: selectedCustomer.customer_numb,
				order_date: formattedDate,
				order_total: orderTotal,
				order_filled: checked ? 1 : 0,
				orders: orderLine,
			};


			// const _orders = [...orders];
			// _orders.push(_order);

			// setOrders(_orders);
			createOrder.mutate(_order);

			setOrder(emptyOrder);
			setOrderLine([]);
			setOrderTotal(0);
			setDialog(false);

			toast.current?.show({
				severity: "success",
				summary: "Successful",
				detail: "Order Created",
				life: 3000,
			});
		} else {
			toast.current?.show({
				severity: "error",
				summary: "Unsuccessful",
				detail: "Please fill out all fields",
				life: 3000,
			});
		}
	};

	const orderDialogFooter = (
		<>
			<Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
			<Button label="Save" icon="pi pi-check" onClick={handleSubmit} />
		</>
	);

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
		const val = (e.target && e.target.value) || "";
		const _order = { ...order };

		_order[`${name}`] = val;

		setOrder(_order);
	};

	const leftToolbarTemplate = () => {
		return (
			<div className="flex gap-2">
				<Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
				{/* <Button
					label="Delete"
					icon="pi pi-trash"
					severity="danger"
					onClick={confirmDeleteSelected}
					disabled={!selectedRawMaterials || !selectedRawMaterials.length}
				/> */}
			</div>
		);
	};

	const allowExpansion = (rowData: Order) => {
		return rowData.orders.length > 0;
	};

	const rowExpansionTemplate = (rowData: Order) => {
		return (
			<div className="p-3">
				<DataTable value={rowData.orders} footer={footer(rowData.order_total)}>
					<Column field="model_description" header="Model" sortable />
					<Column field="quantity_ordered" header="Quantity" sortable />
					<Column field="unit_price" header="Unit Price" sortable />
					<Column field="line_total" header="Line Total" sortable />
				</DataTable>
			</div>
		);
	};

	const header = (
		<div className="flex flex-wrap gap-2 align-items-center justify-content-between">
			<h4 className="m-0">Manage Orders</h4>
		</div>
	);

	const footer = (orderTotal) => {
		return <div className="flex justify-content-end">Order Total: {orderTotal}</div>;
	};

	const selectedModelTemplate = (option: Model, props) => {
		if (option) {
			return (
				<div>
					<div>{option.model_description}</div>
				</div>
			);
		}
		return <span>{props.placeholder}</span>;
	};

	const modelOptionTemplate = (option) => {
		return (
			<div>
				<div>{option.model_description}</div>
			</div>
		);
	};

	const selectedCustomerTemplate = (option: Customer, props) => {
		if (option) {
			return (
				<div>
					<div>{option.customer_name}</div>
				</div>
			);
		}
		return <span>{props.placeholder}</span>;
	};

	const customerOptionTemplate = (option) => {
		return (
			<div>
				<div>{option.customer_name}</div>
			</div>
		);
	};

	const getSRP = (model_numb: number) => {
		const model = modelData.find((model) => model.model_numb === model_numb);
		return model?.suggested_retail_price;
	};

	const leftToolbarTemplateModel = () => {
		return (
			<div className="flex gap-3">
				<Dropdown
					placeholder="Select Model"
					style={{ width: "15rem" }}
					options={modelData}
					optionLabel="model_description"
					onChange={(e) => {
						setSelectedModel(e.value);
					}}
					value={selectedModel}
					valueTemplate={selectedModelTemplate}
					itemTemplate={modelOptionTemplate}
				/>
				<InputNumber
					placeholder="Quantity"
					onValueChange={(e) => setModelQuantity(e.value)}
					showButtons
					min={1}
					style={{ width: "9rem" }}
				/>
			</div>
		);
	};

	const rightToolbarTemplateModel = () => {
		return (
			<div>
				<Button
					label="Add"
					icon="pi pi-plus"
					severity="success"
					style={{ width: "6rem" }}
					onClick={() => {
						const _orderLine = [...orderLine];
						_orderLine.push({
							order_numb: order.order_numb,
							model_numb: selectedModel.model_numb,
							model_description: selectedModel.model_description,
							quantity_ordered: modelQuantity,
							unit_price: getSRP(selectedModel.model_numb),
							line_total: modelQuantity * getSRP(selectedModel.model_numb),
						});
						setOrderLine(_orderLine);
						setOrderTotal(orderTotal + modelQuantity * getSRP(selectedModel.model_numb));
					}}
				/>
			</div>
		);
	};

	const handleDeleteModel = (rowData: OrderLine) => {
		const _orderLine = orderLine.filter(
			(order) => order.model_numb !== rowData.model_numb
		);
		setOrderLine(_orderLine);

		const _orderTotal = orderTotal - rowData.line_total;
		setOrderTotal(_orderTotal);

		toast.current?.show({
			severity: "success",
			summary: "Successful",
			detail: "Model Deleted",
			life: 3000,
		});
	};

	const actionBodyModelTemplate = (rowData: OrderLine) => {
		return (
			<Button
				icon="pi pi-trash"
				className="p-button-rounded p-button-danger"
				onClick={() => handleDeleteModel(rowData)}
			/>
		);
	};

	const handleCustomerDropdownChange = (e: DropdownChangeEvent) => {
		setSelectedCustomer(e.value);
	};

	const customerDropdownOptions = () => {
		return customerData?.map((customer) => {
			return {
				customer_name: customer.customer_name,
				customer_numb: customer.customer_numb,
			};
		});
	};

	return (
		<div>
			<Toast ref={toast} />
			<div className="card p-fluid">
				<Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
				<DataTable
					value={data}
					expandedRows={expandedRows}
					onRowToggle={(e) => setExpandedRows(e.data)}
					rowExpansionTemplate={rowExpansionTemplate}
					dataKey="order_numb"
					header={header}
				>
					<Column expander={allowExpansion} style={{ width: "5rem" }} />
					<Column field="order_numb" header="Order #" sortable />
					<Column field="customer_name" header="Customer" sortable />
					<Column field="order_date" header="Date Ordered" sortable />
					<Column
						field="order_filled"
						header="Filled?"
						sortable
						body={statusOrderBodyTemplate}
					/>
				</DataTable>
			</div>
			<Dialog
				visible={dialog}
				style={{ width: "50rem" }}
				breakpoints={{ "960px": "75vw", "641px": "90vw" }}
				header="New Order"
				modal
				className="p-fluid"
				footer={orderDialogFooter}
				onHide={hideDialog}
			>
				<div className="field">
					<label htmlFor="order_number" className="font-bold pr-3">
						Customer Name
					</label>
					<Dropdown
						placeholder="Select Customer"
						options={customerDropdownOptions()}
						optionLabel="customer_name"
						onChange={handleCustomerDropdownChange}
						value={selectedCustomer}
						valueTemplate={selectedCustomerTemplate}
						itemTemplate={customerOptionTemplate}
					/>
				</div>
				<div>
					<Toolbar
						className="mb-4"
						left={leftToolbarTemplateModel}
						right={rightToolbarTemplateModel}
					></Toolbar>
					<DataTable value={orderLine}>
						<Column field="model_description" header="Model" />
						<Column field="quantity_ordered" header="Quantity" />
						<Column field="unit_price" header="Unit Price" />
						<Column field="line_total" header="Total" />
						<Column body={actionBodyModelTemplate} />
					</DataTable>
				</div>
				<div className="flex  mt-5 justify-content-between">
					<p className="font-bold">Order Total: ${Math.round(orderTotal)}</p>
					<div>
						<Checkbox
							onChange={(e) => setChecked(e.checked)}
							checked={checked}
						></Checkbox>
						<span className="font-medium ml-3">Order Filled</span>
					</div>
				</div>
			</Dialog>
		</div>
	);
}
