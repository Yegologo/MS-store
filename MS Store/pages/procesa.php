<?php
header('Content-Type: application/json');

require_once 'conexion.php';

if($_SERVER["REQUEST_METHOD"] == "POST") {
    $response = ['success' => false, 'message' => ''];
    
    // Obtener y sanitizar datos
    $nombre = trim($_POST["nombre"] ?? '');
    $email = trim($_POST["correo"] ?? '');
    //aqui agregar el hash de la contraseña
    $pass = $_POST["password"] ?? '';
    $confirm_pass = $_POST["confirm-password"] ?? '';
    $terms = isset($_POST["terms"]) ? true : false;

    // Validaciones
    if(empty($nombre) || empty($email) || empty($pass) || empty($confirm_pass)) {
        $response['message'] = 'Todos los campos son obligatorios';
        echo json_encode($response);
        exit();
    }

    if(strlen($nombre) < 3) {
        $response['message'] = 'El nombre debe tener al menos 3 caracteres';
        echo json_encode($response);
        exit();
    }

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'El formato del email no es válido';
        echo json_encode($response);
        exit();
    }

    if(strlen($pass) < 6) {
        $response['message'] = 'La contraseña debe tener al menos 6 caracteres';
        echo json_encode($response);
        exit();
    }

    if($pass !== $confirm_pass) {
        $response['message'] = 'Las contraseñas no coinciden';
        echo json_encode($response);
        exit();
    }

    if(!$terms) {
        $response['message'] = 'Debes aceptar los términos y condiciones';
        echo json_encode($response);
        exit();
    }

    $conn = getDBConnection();

    try {
        // Verificar si el email ya existe
        $check_email = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
        $check_email->bind_param("s", $email);
        $check_email->execute();
        $check_email->store_result();
        
        if($check_email->num_rows > 0) {
            $response['message'] = 'El email ya está registrado';
            echo json_encode($response);
            exit();
        }
        $check_email->close();

        // Insertar nuevo usuario
        $hashed_pass = password_hash($pass, PASSWORD_DEFAULT);
        $insert = $conn->prepare("INSERT INTO usuarios (nombre, email, password, estado, fecha_registro) VALUES (?, ?, ?, 1, NOW())");
        $insert->bind_param("sss", $nombre, $email, $hashed_pass);
        
        if($insert->execute()) {
            $response['success'] = true;
            $response['message'] = 'Registro exitoso. Ahora puedes iniciar sesión.';
        } else {
            $response['message'] = 'Error al registrar el usuario: ' . $conn->error;
        }
        
        $insert->close();
    } catch (Exception $e) {
        $response['message'] = 'Error en el servidor: ' . $e->getMessage();
    } finally {
        $conn->close();
    }
    
    echo json_encode($response);
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>