<?php
include("conexion.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST["name"] ?? '';
    $category_id = $_POST["category_id"] ?? 0;
    $description = $_POST["description"] ?? '';
    $price = $_POST["price"] ?? 0;
    $stock = $_POST["stock"] ?? 0;
    $status = 'available';

    // Procesar imagen
    if (isset($_FILES["image_url"]) && $_FILES["image_url"]["error"] === 0) {
        $image_name = uniqid() . "_" . basename($_FILES["image_url"]["name"]);
        $upload_dir = "../img/products/";
        $target_file = $upload_dir . $image_name;

        if (move_uploaded_file($_FILES["image_url"]["tmp_name"], $target_file)) {
            $stmt = $conexion->prepare("INSERT INTO products (category_id, name, description, price, stock, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("issdiss", $category_id, $name, $description, $price, $stock, $image_name, $status);

            if ($stmt->execute()) {
                header("Location: ../admin/pages/products.html?success=1");
                exit();
            } else {
                echo "Error al guardar: " . $stmt->error;
            }

            $stmt->close();
        } else {
            echo "Error al mover la imagen al servidor.";
        }
    } else {
        echo "Imagen no válida o no enviada.";
    }

    $conexion->close();
} else {
    echo "Acceso denegado.";
}
?>
