<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once 'config.php';

// Get the requested API endpoint
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

switch ($endpoint) {
	case 'create-raw-material':
		newRawMaterial($conn);
		break;
	case 'create-customer':
		newCustomer($conn);
		break;
	case 'create-supplier':
		newSupplier($conn);
		break;
	default:
		echo json_encode(['message' => 'Invalid API endpoint']);
		break;
}

// Insert new raw material
function newRawMaterial($conn)
{
	// Get the posted data
	$postData = file_get_contents("php://input");
	$data = json_decode($postData, true);

	// Insert the raw material
	$stmt = $conn->prepare("INSERT INTO raw_material (material_name, unit_of_measurement, quantity_in_stock, reorder_point) VALUES (?, ?, ?, ?)");
	$stmt->bind_param("ssii", $data['material_name'], $data['unit_of_measurement'], $data['quantity_in_stock'], $data['reorder_point']);

	if ($stmt->execute()) {
		http_response_code(200);
		echo json_encode(array("message" => "Record inserted successfully."));
	} else {
		http_response_code(500);
		echo json_encode(array("message" => "Failed to insert record."));
	}

	$stmt->close();
}

// Insert new customer
function newCustomer($conn)
{
	// Get the posted data
	$postData = file_get_contents("php://input");
	$data = json_decode($postData, true);

	// Insert the customer
	$stmt = $conn->prepare("INSERT INTO customer (customer_name, customer_street, customer_city, customer_state, customer_zip, contact_person, contact_phone, contact_fax) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
	$stmt->bind_param("ssssssss", $data['customer_name'], $data['customer_street'], $data['customer_city'], $data['customer_state'], $data['customer_zip'], $data['contact_phone'], $data['contact_fax']);

	if ($stmt->execute()) {
		http_response_code(200);
		echo json_encode(array("message" => "Record inserted successfully."));
	} else {
		http_response_code(500);
		echo json_encode(array("message" => "Failed to insert record."));
	}

	$stmt->close();
}

// Insert new supplier
function newSupplier($conn)
{
	// Get the posted data
	$postData = file_get_contents("php://input");
	$data = json_decode($postData, true);

	// Insert the supplier
	$stmt = $conn->prepare("INSERT INTO supplier (supplier_name, email, phone_number, address) VALUES (?, ?, ?, ?)");
	$stmt->bind_param("ssss", $data['supplier_name'], $data['email'], $data['phone_number'], $data['address']);

	if ($stmt->execute()) {
		http_response_code(200);
		echo json_encode(array("message" => "Record inserted successfully."));
	} else {
		http_response_code(500);
		echo json_encode(array("message" => "Failed to insert record."));
	}

	$stmt->close();
}

?>