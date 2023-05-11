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

export type Order = {
	order_numb: number;
	customer_numb: number;
	customer_name: string;
	order_date: string;
	order_total: number;
	order_filled: number;
	orders: OrderLine[];
};

export type OrderLine = {
	order_numb: number;
	model_numb: number;
	model_description: string;
	quantity_ordered: number;
	unit_price: number;
	line_total: number;
};

export const useOrders = (): UseQueryResult<Order[]> => {
	return useQuery<Order[]>(["orders"], () =>
		axios.get(`${readUrl}orders`).then((res) => {
			return res.data;
		})
	);
};

export const useCreateOrder = () => {
	return useMutation({
		mutationFn: (data: Omit<Order, "order_numb" | "customer_name">) => {
			console.log("order data:", data);
			return axios.post(`${createUrl}order`, data);
		},
		onSuccess: () => queryClient.invalidateQueries(["orders"]),
	});
};

// Model

export type Model = {
	model_numb: number;
	model_description: string;
	suggested_retail_price: number;
	time_to_manufacture: number;
	materials: Material[];
};

export type Material = {
	material_name: string;
	material_id_numb: string;
	quantity_needed: string;
};

export const useModels = (): UseQueryResult<Model[]> => {
	return useQuery<Model[]>(["models"], () =>
		axios.get(`${readUrl}models`).then((res) => {
			return res.data;
		})
	);
};

export type Supplier = {
	supplier_numb: number;
	supplier_name: string;
	supplier_street: string;
	supplier_city: string;
	supplier_state: string;
	supplier_zip: string;
	supplier_phone: string;
};

export const useSuppliers = (): UseQueryResult<Supplier[]> => {
	return useQuery<Supplier[]>(["suppliers"], () =>
		axios.get(`${readUrl}suppliers`).then((res) => {
			return res.data;
		})
	);
};

export const useUpdateSupplier = () => {
	return useMutation({
		mutationFn: (data: Supplier) => {
			return axios.post(`${updateUrl}supplier`, data);
		},
		onSuccess: () => queryClient.invalidateQueries(["suppliers"]),
	});
};

export const useCreateSupplier = () => {
	return useMutation({
		mutationFn: (data: Supplier) => {
			return axios.post(`${createUrl}supplier`, data);
		},
		onSuccess: () => queryClient.invalidateQueries(["suppliers"]),
	});
};

export const useDeleteSupplier = () => {
	return useMutation({
		mutationFn: (data: Supplier) => {
			return axios.delete("http://localhost/db_final_project/delete.php", {
				params: {
					endpoint: "delete-supplier",
				},
				data: { supplier_numb: data.supplier_numb },
				headers: { "Content-Type": "application/json" },
			});
		},
		onSuccess: () => queryClient.invalidateQueries(["suppliers"]),
	});
};

export type Customer = {
	customer_numb: number;
	customer_name: string;
	customer_street: string;
	customer_city: string;
	customer_state: string;
	customer_zip: string;
	contact_person: string;
	contact_phone: string;
	contact_fax: string;
};

export const useCustomers = (): UseQueryResult<Customer[]> => {
	return useQuery<Customer[]>(["customers"], () =>
		axios.get(`${readUrl}customers`).then((res) => {
			return res.data;
		})
	);
};

export const useUpdateCustomer = () => {
	return useMutation({
		mutationFn: (data: Customer) => {
			return axios.post(`${updateUrl}customer`, data);
		},
		onSuccess: () => queryClient.invalidateQueries(["customers"]),
	});
}

export const useCreateCustomer = () => {
	return useMutation({
		mutationFn: (data: Customer) => {
			return axios.post(`${createUrl}customer`, data);
		},
		onSuccess: () => queryClient.invalidateQueries(["customers"]),
	});
}

export const useDeleteCustomer = () => {
	return useMutation({
		mutationFn: (data: Customer) => {
			return axios.delete("http://localhost/db_final_project/delete.php", {
				params: {
					endpoint: "delete-customer",
				},
				data: { customer_numb: data.customer_numb },
				headers: { "Content-Type": "application/json" },
			});
		},
		onSuccess: () => queryClient.invalidateQueries(["customers"]),
	});
}


