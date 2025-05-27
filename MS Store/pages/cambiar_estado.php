<?php
header('Content-Type: application/json');
include 'conexion.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id']) || !isset($data['estado'])) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit();
}

$id = intval($data['id']);
$estado = intval($data['estado']);

try {
    $conn = getDBConnection();
    $stmt = $conn->prepare("UPDATE usuarios SET estado = ? WHERE id = ?");
    $stmt->bind_param("ii", $estado, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Estado del usuario actualizado']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar el estado']);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
}
?>


