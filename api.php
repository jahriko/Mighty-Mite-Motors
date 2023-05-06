<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once 'config.php';

// Get the requested API endpoint
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

switch ($endpoint) {
    case 'models':
        getModels($conn);
        break;
    case 'customers':
        getCustomers($conn);
        break;
    case 'orders':
        getOrders($conn);
        break;
    case 'raw-materials':
        getRawMaterials($conn);
        break;
    case 'suppliers':
        getSuppliers($conn);
        break;
    case 'update-raw-material':
        updateRawMaterial($conn);
        break;

    case 'line_schedules':
        getLineSched($conn);
        break;

    // Add more cases for each table and related API functions
    default:
        echo json_encode(['message' => 'Invalid API endpoint']);
        break;
}

// Fetch all models
function getModels($conn)
{
    $sql = "SELECT * FROM model";
    $result = $conn->query($sql);
    $models = [];
    while ($row = $result->fetch_assoc()) {
        array_push($models, $row);
    }
    echo json_encode($models);
}

// Fetch all customers
function getCustomers($conn)
{
    $sql = "SELECT * FROM customer";
    $result = $conn->query($sql);
    $customers = [];
    while ($row = $result->fetch_assoc()) {
        array_push($customers, $row);
    }
    echo json_encode($customers);
}

// Fetch all orders
function getOrders($conn)
{
    $sql = "SELECT * FROM `order`";
    $result = $conn->query($sql);
    $orders = [];
    while ($row = $result->fetch_assoc()) {
        array_push($orders, $row);
    }
    echo json_encode($orders);
}

// Fetch all raw materials
function getRawMaterials($conn)
{
    $sql = "SELECT * FROM raw_material";
    $result = $conn->query($sql);
    $rawMaterials = [];
    while ($row = $result->fetch_assoc()) {
        array_push($rawMaterials, $row);
    }
    echo json_encode($rawMaterials);
}

// Fetch all suppliers
function getSuppliers($conn)
{
    $sql = "SELECT * FROM supplier";
    $result = $conn->query($sql);
    $suppliers = [];
    while ($row = $result->fetch_assoc()) {
        array_push($suppliers, $row);
    }
    echo json_encode($suppliers);
}




// Fetch all line schedule
function getLineSched($conn)
{
    $sql = "SELECT * FROM line_schedule";
    $result = $conn->query($sql);
    $LineSched = [];
    while ($row = $result->fetch_assoc()) {
        array_push($LineSched, $row);
    }
    echo json_encode($LineSched);
}


// Add more functions to handle other tables and related API operations

$conn->close();
?>