<?php
// Script de conexión a MySQL mejorado
class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        $this->connection = new mysqli("localhost", "root", "sergio11", "mcstore");
        
        if($this->connection->connect_error) {
            die("Error de conexión: " . $this->connection->connect_error);
        }
        
        $this->connection->set_charset("utf8");
    }
    
    public static function getInstance() {
        if(!self::$instance) {
            self::$instance = new Database();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function closeConnection() {
        if($this->connection) {
            $this->connection->close();
        }
    }
}

// Función para obtener conexión
function getDBConnection() {
    return Database::getInstance()->getConnection();
}
?>