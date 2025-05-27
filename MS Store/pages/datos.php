<?php
header('Content-Type: application/json');

require_once 'conexion.php';

$response = ['success' => false, 'data' => [], 'error' => ''];

try {
    // Parámetros de filtrado con valores por defecto
    $limite = isset($_GET['limite']) ? intval($_GET['limite']) : 10;
    $estado = isset($_GET['estado']) && $_GET['estado'] !== 'all' ? intval($_GET['estado']) : null;
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    
    $conn = getDBConnection();
    
    // Construir consulta base con seguridad
    $query = "SELECT id, nombre, email, estado, DATE_FORMAT(fecha_registro, '%d/%m/%Y %H:%i') as fecha_formateada FROM usuarios";
    $conditions = [];
    $params = [];
    $types = '';
    
    // Añadir condiciones de filtrado
    if(!empty($search)) {
        $conditions[] = "(nombre LIKE ? OR email LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $types .= 'ss';
    }
    
    if($estado !== null) {
        $conditions[] = "estado = ?";
        $params[] = $estado;
        $types .= 'i';
    }
    
    // Combinar condiciones
    if(!empty($conditions)) {
        $query .= " WHERE " . implode(" AND ", $conditions);
    }
    
    // Ordenar y limitar
    $query .= " ORDER BY fecha_registro DESC";
    
    if($limite > 0) {
        $query .= " LIMIT ?";
        $params[] = $limite;
        $types .= 'i';
    }
    
    // Preparar y ejecutar consulta
    $stmt = $conn->prepare($query);
    
    if(!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $usuarios = [];
    
    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }
    
    $response['success'] = true;
    $response['data'] = $usuarios;
    
    $stmt->close();
} catch (Exception $e) {
    $response['error'] = 'Error en el servidor: ' . $e->getMessage();
    http_response_code(500);
} finally {
    if(isset($conn)) {
        $conn->close();
    }
}

echo json_encode($response);
?>