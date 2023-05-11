import { DataTable, DataTableExpandedRows } from "primereact/datatable";
import { useState, useRef  } from "react";
import { Toast } from "primereact/toast";
import { Model, useModels } from "./utils/api";
import { Column } from "primereact/column";

export default function Models() {
	const [models, setModels] = useState<Model[]>([]);
	const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows>(null);
	const toast = useRef<Toast>(null);
	const { data } = useModels();

	const allowExpansion = (rowData: Model) => {
		return rowData.materials.length > 0;
	};

	const rowExpansionTemplate = (rowData: Model) => {
		return (
			<div className="p-3">
				<DataTable value={rowData.materials} dataKey="material_id_numb">
					<Column field="material_name" header="Material" sortable />
					<Column field="quantity_needed" header="Quantity Needed" sortable />
				</DataTable>
			</div>
		);
	};

	return (
		<div>
			<Toast ref={toast} />
			<DataTable
				value={data}
				expandedRows={expandedRows}
				onRowToggle={(e) => setExpandedRows(e.data)}
				rowExpansionTemplate={rowExpansionTemplate}
				dataKey="model_numb"
			>
				<Column expander={allowExpansion} style={{ width: "5rem" }} />
				<Column field="model_description" header="Model" sortable />
				<Column field="suggested_retail_price" header="SRP" sortable />
				<Column field="time_to_manufacture" header="Time to Manufacture" sortable />
			</DataTable>
		</div>
	);
}
