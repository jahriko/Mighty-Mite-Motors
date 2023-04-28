<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once 'config.php';

// Get the requested API endpoint
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

switch ($endpoint) {
	case 'new-raw-material':
		newRawMaterial($conn);
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
	$stmt = $conn->prepare("INSERT INTO raw_material (material_id_numb, material_name, material_price, material_quantity, supplier_id_numb) VALUES (?, ?, ?, ?, ?)");
	$stmt->bind_param("isiii", $data->material_id_numb, $data->material_name, $data->material_price, $data->material_quantity, $data->supplier_id_numb);

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