import { updateRawMaterial } from './api';
// get raw materials api
import axios from "axios";
import { UseQueryResult, UseQueryOptions, useQuery } from "@tanstack/react-query";

const readUrl = "http://localhost/db_final_project/api.php?endpoint=";
const createUrl = "http://localhost/db_final_project/create.php?endpoint=";
const updateUrl = "http://localhost/db_final_project/update.php?endpoint=update-";
const deleteUrl = "http://localhost/db_final_project/delete.php?endpoint=";

export type RawMaterial = {
	material_id_numb?: number;
	material_name: string;
	unit_of_measurement: string;
	quantity_in_stock: number;
	reorder_point: number;
};

export const useRawMaterials = (): UseQueryResult<RawMaterial[]> => {
	return useQuery<RawMaterial[]>(["raw-materials"], () =>
		axios.get(`${readUrl}raw-materials`).then((res) => res.data)
	);
};

export const updateRawMaterial = async (data: RawMaterial) => {
	try {
		const response = await axios.post(`${updateUrl}update-raw-material`, data);
		return response.data;
	} catch (error) {
		console.log(error);
	}
}

// export const updateRawMaterial = async (data: RawMaterial) => {
// 	try {
// 		const response = await axios.post(`${updateUrl}raw-material`, data);
// 		return response.data;
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

export const createRawMaterial = async (data: RawMaterial) => {
	try {
		const response = await axios.post(`${createUrl}raw-material`, data);
		toast.current.show({
			severity: "success",
			summary: "Successful",
			detail: "Record Updated Successfully",
			life: 3000,
		});
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const deleteRawMaterial = async (id: number) => {
	try {
		const response = await axios.post(`${deleteUrl}raw-material`, {
			material_id_numb: id,
		});
		return response.data;
	} catch (error) {
		console.log(error);
	}
};
