import { DataTableExpandedRows } from "primereact/datatable";
import { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";

type Model = {
	model_numb: number;
	model_description: string;
	suggested_retail_price: number;
	shipping_weight: number;
	time_to_manufacture: number;
};

export default Models() {
	const [models, setModels] = useState<Model[]>([]);
	const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows>(null);
	const toast = useRef<Toast>(null);

	useEffect(() => {
		fetch("http://localhost/db_final_project/api.php?endpoint=models")
			.then((res) => res.json())
			.then((data) => setModels(data));
	}, []);

}

// [{
// 	model_numb: "1",
// 	model_description: "Model A",
// 	suggested_retail_price: "999.99",
// 	time_to_manufacture: "01:00:00",
// 	materials: [
// 		{		
// 			material_name: "Metal Alloy",
// 			material_id_numb: "1",
// 			quantity_needed: "5",
// 		},
// 		{		
// 			material_name: "Rubber",
// 			material_id_numb: "4",
// 			quantity_needed: "1",
// 		},
// 	]

// }]