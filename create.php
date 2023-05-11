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
	case 'create-order':
		newOrder($conn);
		break;
	case 'create-order-line':
		newOrderLine($conn);
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

// Insert new order
function newOrder($conn)
{
	// Get the posted data
	$postData = file_get_contents("php://input");
	$data = json_decode($postData, true);

	$sql = "INSERT INTO `order` (customer_numb, order_date, order_total, order_filled) 
			VALUES (?, ?, ?, ?)";
	$stmt = $conn->prepare($sql);
	$stmt->bind_param(
		"ssss",
		$data['customer_numb'],
		$data['order_date'],
		$data['order_total'],
		$data['order_filled']
	);
	$stmt->execute();

	$sql = "INSERT INTO order_line (order_numb, model_numb, quantity_ordered, unit_price, line_total) 
			VALUES (?, ?, ?, ?, ?)";
	$stmt = $conn->prepare($sql);

	foreach ($data['orders'] as $order_line) {
		$stmt->bind_param(
			"sssss",
			$data['order_numb'],
			$order_line['model_numb'],
			$order_line['quantity_ordered'],
			$order_line['unit_price'],
			$order_line['line_total']
		);
		$stmt->execute();
	}

	$stmt->close();
}

// Insert new order line
function newOrderLine($conn)
{
	// Get the posted data
	$postData = file_get_contents("php://input");
	$data = json_decode($postData, true);

	// Insert the order line
	$stmt = $conn->prepare("INSERT INTO order_line (order_numb, material_numb, quantity_ordered, quantity_shipped) VALUES (?, ?, ?, ?)");
	$stmt->bind_param("iiii", $data['order_numb'], $data['material_numb'], $data['quantity_ordered'], $data['quantity_shipped']);

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
	$stmt = $conn->prepare("INSERT INTO supplier (supplier_name, supplier_street, supplier_city, supplier_state, supplier_zip, contact_person, contact_phone, contact_fax) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
	$stmt->bind_param("ssssssss", $data['supplier_name'], $data['supplier_street'], $data['supplier_city'], $data['supplier_state'], $data['supplier_zip'], $data['contact_phone'], $data['contact_fax']);

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