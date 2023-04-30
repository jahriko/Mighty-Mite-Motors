<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once 'config.php';

//Update the requested API endpoint

$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

switch ($endpoint) {
	case 'update-raw-material':
		updateRawMaterial($conn);
		break;
	case 'update-customer':
		updateCustomer($conn);
		break;
	// Add more cases for each table and related API functions
	default:
		echo json_encode(['message' => 'Invalid API endpoint']);
		break;
}

// Update the raw material
function updateRawMaterial($conn)
{
	$data = json_decode(file_get_contents("php://input"));

	// Validate the input data
	if (!isset($data->material_id_numb) || !isset($data->material_name) || !isset($data->unit_of_measurement) || !isset($data->quantity_in_stock) || !isset($data->reorder_point)) {
		echo json_encode(['message' => 'Invalid input data']);
		return;
	}

	// Prepare an SQL statement to update the record
	$stmt = $conn->prepare("UPDATE raw_material SET material_name=?, unit_of_measurement=?, quantity_in_stock=?, reorder_point=? WHERE material_id_numb=?");
	$stmt->bind_param("ssiii", $data->material_name, $data->unit_of_measurement, $data->quantity_in_stock, $data->reorder_point, $data->material_id_numb);

	if ($stmt->execute()) {
		echo json_encode(['message' => 'Raw material record updated successfully']);
	} else {
		echo json_encode(['message' => 'Failed to update raw material record']);
	}

	$stmt->close();
}

// Update the customer
function updateCustomer($conn)
{
	$data = json_decode(file_get_contents("php://input"));

	// Validate the input data
	if (!isset($data->customer_id_numb) || !isset($data->customer_name) || !isset($data->customer_street) || !isset($data->customer_city) || !isset($data->customer_state) || !isset($data->customer_zip) || !isset($data->contact_person) || !isset($data->contact_phone) || !isset($data->contact_fax)) {
		echo json_encode(['message' => 'Invalid input data']);
		return;
	}

	// Prepare an SQL statement to update the record
	$stmt = $conn->prepare("UPDATE customer SET customer_name=?, customer_street=?, customer_city=?, customer_state=?, customer_zip=?, contact_person=?, contact_phone=?, contact_fax=? WHERE customer_id_numb=?");
	$stmt->bind_param("ssssssssi", $data->customer_name, $data->customer_street, $data->customer_city, $data->customer_state, $data->customer_zip, $data->contact_person, $data->contact_phone, $data->contact_fax, $data->customer_id_numb);

	if ($stmt->execute()) {
		echo json_encode(['message' => 'Customer record updated successfully']);
	} else {
		echo json_encode(['message' => 'Failed to update customer record']);
	}

	$stmt->close();
}

$conn->close();
?>