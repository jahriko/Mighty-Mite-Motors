import axios from "axios";
import {
	UseQueryResult,
	useQuery,
	QueryClient,
	useMutation,
} from "@tanstack/react-query";

const queryClient = new QueryClient();
const readUrl = "http://localhost/db_final_project/api.php?endpoint=";
const createUrl = "http://localhost/db_final_project/create.php?endpoint=create-";
const updateUrl = "http://localhost/db_final_project/update.php?endpoint=update-";
const deleteUrl = "http://localhost/db_final_project/delete.php?endpoint=delete-";

export type RawMaterial = {
	material_id_numb?: number;
	material_name: string;
	unit_of_measurement: string;
	quantity_in_stock: number;
	reorder_point: number;
};

export const useRawMaterials = (): UseQueryResult<RawMaterial[]> => {
	return useQuery<RawMaterial[]>(["raw-materials"], () =>
		axios.get(`${readUrl}raw-materials`).then((res) => {
			console.log("axios get");
			return res.data;
		})
	);
};

export const useUpdateRawMaterial = () => {
	return useMutation({
		mutationFn: (data: RawMaterial) => {
			return axios.post(`${updateUrl}raw-material`, data);
		},
		onSuccess: () => queryClient.invalidateQueries(["raw-materials"]),
	});
};

export const useCreateRawMaterial = () => {
	return useMutation({
		mutationFn: (data: RawMaterial) => {
			return axios.post(`${createUrl}raw-material`, data);
		},
		onSuccess: () => queryClient.invalidateQueries(["raw-materials"]),
	});
};

export const useDeleteRawMaterial = () => {
	return useMutation({
		mutationFn: (data: RawMaterial) => {
			return axios.delete("http://localhost/db_final_project/delete.php", {
				params: {
					endpoint: "delete-raw-material",
				},
				data: { material_id_numb: data.material_id_numb },
				headers: { "Content-Type": "application/json" },
			});
		},
		onSuccess: () => queryClient.invalidateQueries(["raw-materials"]),
	});
};
