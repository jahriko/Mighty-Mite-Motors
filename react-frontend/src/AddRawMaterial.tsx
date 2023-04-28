// // RawMaterials.js
// import { useState } from "react";
// import { InputText } from "primereact/inputtext";
// import { InputNumber } from "primereact/inputnumber";
// import { Button } from "primereact/button";
// import { supabase } from "./utils";

// const AddRawMaterials = () => {
// 	const [materialName, setMaterialName] = useState("");
// 	const [unitOfMeasurement, setUnitOfMeasurement] = useState("");
// 	const [quantityInStock, setQuantityInStock] = useState<number | null>(0);
// 	const [reorderPoint, setReorderPoint] = useState<number | null>(0);

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();

// 		const { error } = await supabase.from("raw_materials").insert([
// 			{
// 				material_name: materialName,
// 				unit_of_measurement: unitOfMeasurement,
// 				quantity_in_stock: quantityInStock,
// 				reorder_point: reorderPoint,
// 			},
// 		]);

// 		if (error) {
// 			console.error("Error inserting record:", error);
// 		} else {
// 			alert("Record inserted successfully");
// 		}
// 	};

// 	const openNew() {
// 		set
// 	}

// 	return (
// 		<form onSubmit={handleSubmit}>
// 			<h2>Create Raw Material</h2>

// 			<div className="p-field">
// 				<label htmlFor="materialName">Material Name:</label>
// 				<InputText
// 					id="materialName"
// 					value={materialName}
// 					onChange={(e) => setMaterialName(e.target.value)}
// 					required
// 				/>
// 			</div>

// 			<div className="p-field">
// 				<label htmlFor="unitOfMeasurement">Unit of Measurement:</label>
// 				<InputText
// 					id="unitOfMeasurement"
// 					value={unitOfMeasurement}
// 					onChange={(e) => setUnitOfMeasurement(e.target.value)}
// 					required
// 				/>
// 			</div>

// 			<div className="p-field">
// 				<label htmlFor="quantityInStock">Quantity In Stock:</label>
// 				<InputNumber
// 					id="quantityInStock"
// 					value={quantityInStock}
// 					onChange={(e) => setQuantityInStock(e.value)}
// 					required
// 					showButtons
// 					buttonLayout="horizontal"
// 				/>
// 			</div>

// 			<div className="p-field">
// 				<label htmlFor="reorderPoint">Reorder Point:</label>
// 				<InputNumber
// 					id="reorderPoint"
// 					value={reorderPoint}
// 					onChange={(e) => setReorderPoint(e.value)}
// 					required
// 					showButtons
// 					buttonLayout="horizontal"
// 				/>
// 			</div>

// 			<Button type="submit" label="Submit" />
// 		</form>
// 	);
// };

// export default AddRawMaterials;
