<?php
header('Content-Type: application/json');

include 'conexion.php';

if(!isset($_GET['id'])) {
    echo json_encode(['error' => 'ID no proporcionado']);
    exit();
}

$id = intval($_GET['id']);

try {
    $query = "SELECT id, nombre, email, estado FROM usuarios WHERE id = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    
    $result = $stmt->get_result();
    
    if($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(['error' => 'Usuario no encontrado']);
    }
    
    $stmt->close();
    $conexion->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        'error' => 'Error en el servidor',
        'message' => $e->getMessage()
    ));
}
?>