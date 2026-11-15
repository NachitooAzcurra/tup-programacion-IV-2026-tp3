-- ============================================================
-- Trabajo Práctico N.º 3 - Programación IV
-- Base de datos: gestión de vehículos, conductores y viajes
-- ============================================================

DROP DATABASE IF EXISTS tp_vehiculos;
CREATE DATABASE tp_vehiculos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tp_vehiculos;

-- ------------------------------------------------------------
-- Tabla: usuarios (autenticación)
-- ------------------------------------------------------------
CREATE TABLE usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt, nunca texto plano',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- Tabla: vehiculos
-- ------------------------------------------------------------
CREATE TABLE vehiculos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  marca VARCHAR(50) NOT NULL,
  modelo VARCHAR(50) NOT NULL,
  patente VARCHAR(10) NOT NULL UNIQUE,
  anio SMALLINT UNSIGNED NOT NULL,
  capacidad_carga DECIMAL(8, 2) NOT NULL COMMENT 'Capacidad de carga en kg',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- Tabla: conductores
-- ------------------------------------------------------------
CREATE TABLE conductores (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  numero_documento VARCHAR(15) NOT NULL UNIQUE,
  numero_licencia VARCHAR(20) NOT NULL UNIQUE,
  fecha_alta_licencia DATE NOT NULL,
  fecha_vencimiento_licencia DATE NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_vencimiento CHECK (fecha_vencimiento_licencia >= fecha_alta_licencia)
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- Tabla: viajes
-- ------------------------------------------------------------
CREATE TABLE viajes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  vehiculo_id INT UNSIGNED NOT NULL,
  conductor_id INT UNSIGNED NOT NULL,
  fecha_salida DATETIME NOT NULL,
  fecha_llegada DATETIME NULL,
  origen VARCHAR(150) NOT NULL,
  destino VARCHAR(150) NOT NULL,
  kilometros DECIMAL(10, 2) NOT NULL,
  observaciones TEXT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_viaje_vehiculo
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_viaje_conductor
    FOREIGN KEY (conductor_id) REFERENCES conductores (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_km CHECK (kilometros >= 0)
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- Datos de prueba
-- ------------------------------------------------------------
INSERT INTO vehiculos (marca, modelo, patente, anio, capacidad_carga) VALUES
  ('Ford',     'Ranger XL',   'AB123CD', 2021, 1100.00),
  ('Mercedes', 'Sprinter',    'AC456FG', 2019, 1800.50),
  ('Toyota',   'Hilux SRV',   'AE789JK', 2022, 1050.00);

INSERT INTO conductores (nombre, apellido, numero_documento, numero_licencia, fecha_alta_licencia, fecha_vencimiento_licencia) VALUES
  ('Juan',   'Pérez',   '30123456', 'LIC-2024-001', '2024-03-10', '2027-03-10'),
  ('María',  'Gómez',   '32456789', 'LIC-2024-002', '2024-08-02', '2027-08-02'),
  ('Carlos', 'López',   '28987654', 'LIC-2025-003', '2025-01-15', '2028-01-15');

INSERT INTO viajes (vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones) VALUES
  (1, 1, '2026-11-01 08:00:00', '2026-11-01 14:30:00', 'La Rioja', 'Chilecito',  104.50, 'Entrega de mercadería'),
  (1, 2, '2026-11-05 07:00:00', '2026-11-05 12:00:00', 'La Rioja', 'Villa Unión', 240.00, NULL),
  (2, 1, '2026-11-08 06:30:00', '2026-11-08 19:00:00', 'La Rioja', 'Córdoba',    400.75, 'Carga refrigerada'),
  (3, 3, '2026-11-10 09:00:00', NULL,                  'La Rioja', 'San Juan',   190.20, 'Viaje en curso');
