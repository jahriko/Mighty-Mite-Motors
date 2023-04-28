<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once 'config.php';

// Get the requested API endpoint
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

switch ($endpoint) {
	case 'delete-raw-material':
		deleteRawMaterial($conn);
		break;
	default:
		echo json_encode(['message' => 'Invalid API endpoint']);
		break;
}

// Delete the raw material
function deleteRawMaterial($conn)
{
	// Get the posted data
	$postData = file_get_contents("php://input");
	$data = json_decode($postData, true);

	// Delete the raw material
	$stmt = $conn->prepare("DELETE FROM raw_material WHERE material_id_numb=?");
	$stmt->bind_param("i", $data['material_id_numb']);

	if ($stmt->execute()) {
		http_response_code(200);
		echo json_encode(array("message" => "Record deleted successfully."));
	} else {
		http_response_code(500);
		echo json_encode(array("message" => "Failed to delete record."));
	}

	$stmt->close();
}

?>