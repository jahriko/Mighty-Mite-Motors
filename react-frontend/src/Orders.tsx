import React, { useState, useEffect, useRef } from "react";
import {
	DataTable,
	DataTableExpandedRows,
	DataTableRowEvent,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "./service/ProductService";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";

type Order = {
	order_numb: number;
	customer_numb: number;
	customer_name: string;
	order_date: Date;
	order_total: number;
	order_filled: boolean;
	orders: OrderLine[];
};

type OrderLine = {
	order_numb: number;
	model_numb: number;
	model_description: string;
	quantity_ordered: string;
	unit_price: string;
	line_total: string;
};

export default function Orders() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows>(null);
	const [orderTotal, setOrderTotal] = useState(0);
	const toast = useRef<Toast>(null);

	useEffect(() => {
		fetch("http://localhost/db_final_project/api.php?endpoint=orders")
			.then((res) => res.json())
			.then((data) => setOrders(data));
	}, []);

	const onRowExpand = (event: DataTableRowEvent) => {
		toast.current.show({
			severity: "info",
			summary: "Product Expanded",
			detail: event.data.name,
			life: 3000,
		});
	};

	const onRowCollapse = (event: DataTableRowEvent) => {
		toast.current.show({
			severity: "success",
			summary: "Product Collapsed",
			detail: event.data.name,
			life: 3000,
		});
	};

	const expandAll = () => {
		const _expandedRows: DataTableExpandedRows = {};

		orders.forEach((p) => (_expandedRows[`${p.order_numb}`] = true));

		setExpandedRows(_expandedRows);
	};

	const collapseAll = () => {
		setExpandedRows(null);
	};

	const statusOrderBodyTemplate = (rowData: Order) => {
		return (
			<Tag
				className={`order-badge status-${rowData.order_filled ? "success" : "warning"}`}
				value={rowData.order_filled ? "Filled" : "Pending"}
			/>
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

	// const footer = `Order Total: ${orders order_total}`;

	//create a function to get the total of the order
	const footer = (orderTotal) => {
		return <div className="flex justify-content-end">Order Total: {orderTotal}</div>;
	};

	return (
		<div className="card">
			<Toast ref={toast} />
			<DataTable
				value={orders}
				expandedRows={expandedRows}
				onRowToggle={(e) => setExpandedRows(e.data)}
				rowExpansionTemplate={rowExpansionTemplate}
				dataKey="order_numb"
			>
				<Column expander={allowExpansion} style={{ width: "5rem" }} />
				<Column field="order_numb" header="Order #" sortable />
				<Column field="customer_name" header="Customer" sortable />
				<Column field="order_date" header="Date Ordered" sortable />
				<Column
					field="order_filled"
					header="Date Filled"
					sortable
					body={statusOrderBodyTemplate}
				/>
			</DataTable>
		</div>
	);
}
