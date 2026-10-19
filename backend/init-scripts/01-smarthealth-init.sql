-- ============================================================================
-- SMARTHEALTH - SETUP COMPLETO Y POBLACIoN DE DATOS CHILENOS
-- ============================================================================
-- Este script crea todas las tablas segun las entidades JPA definidas
-- y las puebla con datos de prueba realistas chilenos
-- ============================================================================

-- ============================================================================
-- CREAR BASES DE DATOS SI NO EXISTEN
-- ============================================================================
CREATE DATABASE IF NOT EXISTS db_smarthealth_hospitales;
CREATE DATABASE IF NOT EXISTS db_smarthealth_personal;
CREATE DATABASE IF NOT EXISTS db_smarthealth_pacientes;
CREATE DATABASE IF NOT EXISTS db_smarthealth_camas;
CREATE DATABASE IF NOT EXISTS db_smarthealth_triaje;
CREATE DATABASE IF NOT EXISTS db_smarthealth_historial;
CREATE DATABASE IF NOT EXISTS db_smarthealth_listas_de_espera;
CREATE DATABASE IF NOT EXISTS db_smarthealth_equipamiento;
CREATE DATABASE IF NOT EXISTS db_smarthealth_insumos;

-- ============================================================================
-- 1. TABLA: HOSPITALES (db_smarthealth_hospitales)
-- ============================================================================
USE db_smarthealth_hospitales;

DROP TABLE IF EXISTS hospitales;
CREATE TABLE hospitales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    region VARCHAR(100) NOT NULL,
    comuna VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL UNIQUE,
    correo_institucional VARCHAR(255) NOT NULL UNIQUE,
    nivel_complejidad ENUM('BAJA', 'MEDIANA', 'ALTA') NOT NULL,
    capacidad_total_camas INT DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO hospitales (nombre, direccion, region, comuna, telefono, correo_institucional, nivel_complejidad, capacidad_total_camas) VALUES
('Hospital Clinico Universidad de Chile', 'Avenida La Paz 1003', 'Metropolitana', 'Santiago', '+56225551234', 'contacto@hcuch.cl', 'ALTA', 350),
('Hospital del Salvador', 'Avenida Salvador 364', 'Metropolitana', 'Santiago', '+56225552345', 'info@hsalvador.cl', 'ALTA', 280),
('Hospital Exequiel Gonzalez Cortes', 'Avenida Concha y Toro 3459', 'Metropolitana', 'Santiago', '+56225553456', 'contacto@hegc.cl', 'MEDIANA', 150),
('Hospital San Borja Arriaran', 'San Borja 899', 'Metropolitana', 'Santiago', '+56225554567', 'info@hsba.cl', 'MEDIANA', 200),
('Hospital de Urgencia Asistencia Publica', 'Avenida Portugal 125', 'Metropolitana', 'Santiago', '+56225555678', 'contacto@huap.cl', 'ALTA', 300),
('Hospital Felix Bulnes Cerda', 'Bulnes 280', 'Metropolitana', 'Santiago', '+56225556789', 'info@hfb.cl', 'MEDIANA', 180),
('Hospital Barros Luco Trudeau', 'Diagonal Oriente 3001', 'Metropolitana', 'San Miguel', '+56225557890', 'contacto@hblt.cl', 'MEDIANA', 220),
('Hospital Sotero del Rio', 'Avenida Concha y Toro 3459', 'Metropolitana', 'Puente Alto', '+56225558901', 'info@hsr.cl', 'MEDIANA', 190),
('Hospital Dr. Luis Tisne Brousse', 'Avenida Americo Vespucio 640', 'Metropolitana', 'nunoa', '+56225559012', 'contacto@hltb.cl', 'BAJA', 120),
('Hospital Dr. Sotero del Rio', 'Avenida Concha y Toro 3459', 'Metropolitana', 'Puente Alto', '+56225550123', 'info@hsdr.cl', 'BAJA', 100);

-- ============================================================================
-- 2. TABLA: PERSONAL (db_smarthealth_personal)
-- ============================================================================
USE db_smarthealth_personal;

DROP TABLE IF EXISTS personal;
CREATE TABLE personal (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    rut VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL,
    rol ENUM('MEDICO', 'ENFERMERO', 'ADMINISTRATIVO', 'TECNICO', 'OTRO') NOT NULL,
    especialidad VARCHAR(100),
    numero_colegiatura VARCHAR(50) UNIQUE,
    departamento VARCHAR(100) NOT NULL,
    hospital_id BIGINT NOT NULL,
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO personal (nombre, rut, email, telefono, rol, especialidad, numero_colegiatura, departamento, hospital_id) VALUES
('Dr. Carlos Rodriguez Lopez', '12345678-1', 'carlos.rodriguez@hospital.cl', '+56912345678', 'MEDICO', 'Cardiologia', 'COL-12345', 'Cardiologia', 1),
('Enfermera Magdalena Diaz Gonzalez', '13456789-2', 'magdalena.diaz@hospital.cl', '+56912345679', 'ENFERMERO', NULL, NULL, 'UCI', 1),
('Dr. Juan Perez Martinez', '14567890-3', 'juan.perez@hospital.cl', '+56912345680', 'MEDICO', 'Traumatologia', 'COL-12346', 'Traumatologia', 2),
('Administrativo Roberto Silva Flores', '15678901-4', 'roberto.silva@hospital.cl', '+56912345681', 'ADMINISTRATIVO', NULL, NULL, 'Admision', 2),
('Dr. Miguel angel Garcia Huerta', '16789012-5', 'miguel.garcia@hospital.cl', '+56912345682', 'MEDICO', 'Neurologia', 'COL-12347', 'Neurologia', 3),
('Tecnico David Lopez Rojas', '17890123-6', 'david.lopez@hospital.cl', '+56912345683', 'TECNICO', NULL, NULL, 'Mantenimiento', 3),
('Enfermera Patricia Araya Cortes', '18901234-7', 'patricia.araya@hospital.cl', '+56912345684', 'ENFERMERO', NULL, NULL, 'Urgencia', 4),
('Dr. Fernando Mora Valdes', '19012345-8', 'fernando.mora@hospital.cl', '+56912345685', 'MEDICO', 'Pediatria', 'COL-12348', 'Pediatria', 4),
('Administrativo Lorena Vasquez Espinoza', '20123456-9', 'lorena.vasquez@hospital.cl', '+56912345686', 'ADMINISTRATIVO', NULL, NULL, 'Facturacion', 5),
('Dr. Alejandro Campos Soto', '21234567-0', 'alejandro.campos@hospital.cl', '+56912345687', 'MEDICO', 'Oftalmologia', 'COL-12349', 'Oftalmologia', 5);

-- ============================================================================
-- 3. TABLA: PACIENTES (db_smarthealth_pacientes)
-- ============================================================================
USE db_smarthealth_pacientes;

DROP TABLE IF EXISTS pacientes;
CREATE TABLE pacientes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rut VARCHAR(20) NOT NULL UNIQUE,
    nombre_completo VARCHAR(100) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    id_historial_clinico BIGINT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO pacientes (rut, nombre_completo, correo, fecha_nacimiento) VALUES
('12345678-1', 'Andres Felipe Morales Ruiz', 'andres.morales@mail.com', '1975-03-15'),
('13456789-2', 'Maria Carolina Fuentes Gomez', 'maria.fuentes@mail.com', '1982-07-22'),
('14567890-3', 'Roberto German Lopez Parra', 'roberto.lopez@mail.com', '1968-11-08'),
('15678901-4', 'Silvia Paulina Cortes Valencia', 'silvia.cortes@mail.com', '1990-05-30'),
('16789012-5', 'Jose Manuel Garcia Salazar', 'jose.garcia@mail.com', '1978-09-14'),
('17890123-6', 'Isabel Marcela Diaz Rojas', 'isabel.diaz@mail.com', '1985-02-28'),
('18901234-7', 'Miguel angel Ramirez Flores', 'miguel.ramirez@mail.com', '1972-12-20'),
('19012345-8', 'Francisca Lorena Moreno Ortiz', 'francisca.moreno@mail.com', '1988-06-17'),
('20123456-9', 'Fernando Luis Valdez Sepulveda', 'fernando.valdez@mail.com', '1981-04-09'),
('21234567-0', 'Susana Veronica Silva Acosta', 'susana.silva@mail.com', '1976-10-25');

-- ============================================================================
-- 4. TABLA: CAMAS (db_smarthealth_camas)
-- ============================================================================
USE db_smarthealth_camas;

DROP TABLE IF EXISTS camas;
CREATE TABLE camas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    tipo ENUM('BASICA', 'UCI', 'UTI', 'PEDIATRICA', 'MATERNIDAD', 'URGENCIA') NOT NULL,
    estado ENUM('DISPONIBLE', 'OCUPADA', 'MANTENCION', 'RESERVADA') NOT NULL,
    sector VARCHAR(50),
    hospital_id BIGINT NOT NULL,
    rut_paciente_actual VARCHAR(20),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activa BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO camas (codigo, tipo, estado, sector, hospital_id, rut_paciente_actual) VALUES
('UCI-01', 'UCI', 'OCUPADA', 'Piso 3', 1, '12345678-1'),
('UCI-02', 'UCI', 'DISPONIBLE', 'Piso 3', 1, NULL),
('BASICA-101', 'BASICA', 'DISPONIBLE', 'Piso 1', 1, NULL),
('BASICA-102', 'BASICA', 'OCUPADA', 'Piso 1', 1, '13456789-2'),
('URGENCIA-01', 'URGENCIA', 'DISPONIBLE', 'Urgencia', 2, NULL),
('URGENCIA-02', 'URGENCIA', 'OCUPADA', 'Urgencia', 2, '14567890-3'),
('PEDIATRICA-01', 'PEDIATRICA', 'DISPONIBLE', 'Piso 2', 2, NULL),
('BASICA-201', 'BASICA', 'DISPONIBLE', 'Piso 2', 3, NULL),
('BASICA-202', 'BASICA', 'OCUPADA', 'Piso 2', 3, '15678901-4'),
('MATERNIDAD-01', 'MATERNIDAD', 'DISPONIBLE', 'Piso 4', 3, NULL),
('MATERNIDAD-02', 'MATERNIDAD', 'DISPONIBLE', 'Piso 4', 3, NULL),
('UTI-01', 'UTI', 'OCUPADA', 'Piso 5', 4, '16789012-5'),
('UTI-02', 'UTI', 'DISPONIBLE', 'Piso 5', 4, NULL),
('BASICA-301', 'BASICA', 'DISPONIBLE', 'Piso 1', 4, NULL),
('URGENCIA-03', 'URGENCIA', 'DISPONIBLE', 'Urgencia', 5, NULL);

-- ============================================================================
-- 5. TABLA: TRIAJES (db_smarthealth_triaje)
-- ============================================================================
USE db_smarthealth_triaje;

DROP TABLE IF EXISTS triajes;
CREATE TABLE triajes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rut_paciente VARCHAR(20) NOT NULL,
    personal_id BIGINT NOT NULL,
    fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    presion_arterial VARCHAR(20) NOT NULL,
    temperatura DECIMAL(5, 2) NOT NULL,
    frecuencia_cardiaca INT NOT NULL,
    saturacion_oxigeno INT NOT NULL,
    sintomas VARCHAR(500) NOT NULL,
    nivel_urgencia VARCHAR(20) NOT NULL,
    puntuacion_triaje INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO triajes (rut_paciente, personal_id, presion_arterial, temperatura, frecuencia_cardiaca, saturacion_oxigeno, sintomas, nivel_urgencia, puntuacion_triaje) VALUES
('12345678-1', 1, '120/80', 36.5, 72, 98, 'Dolor de pecho moderado', 'AMARILLO', 8),
('13456789-2', 2, '140/90', 37.2, 85, 96, 'Fiebre y tos persistente', 'AMARILLO', 9),
('14567890-3', 1, '118/78', 36.8, 70, 99, 'Mareos y nauseas', 'VERDE', 4),
('15678901-4', 3, '160/100', 38.5, 95, 92, 'Dolor severo en extremidad', 'ROJO', 12),
('16789012-5', 2, '130/85', 36.3, 75, 97, 'Herida lacerante en mano', 'AMARILLO', 7);

-- ============================================================================
-- 6. TABLA: HISTORIAL_CLINICO (db_smarthealth_historial)
-- ============================================================================
USE db_smarthealth_historial;

DROP TABLE IF EXISTS historial_clinico;
CREATE TABLE historial_clinico (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    diagnostico VARCHAR(255) NOT NULL,
    tratamiento VARCHAR(500),
    id_paciente BIGINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO historial_clinico (diagnostico, tratamiento, id_paciente) VALUES
('Infarto agudo de miocardio', 'Angioplastia coronaria, medicacion anticoagulante', 1),
('Neumonia viral', 'Reposo, antibioticos, inhaladores', 2),
('Sindrome cervical', 'Rehabilitacion fisica, relajantes musculares', 3),
('Fractura de tibia', 'Cirugia de reduccion abierta, inmovilizacion', 4),
('Apendicitis aguda', 'Apendicectomia laparoscopica, cuidados postquirurgicos', 5);

-- ============================================================================
-- 7. TABLA: LISTAS_ESPERA (db_smarthealth_listas_de_espera)
-- ============================================================================
USE db_smarthealth_listas_de_espera;

DROP TABLE IF EXISTS listas_espera;
CREATE TABLE listas_espera (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_paciente BIGINT NOT NULL,
    id_procedimiento BIGINT NOT NULL,
    nombre_procedimiento VARCHAR(255) NOT NULL,
    id_hospital BIGINT NOT NULL,
    nombre_hospital VARCHAR(255) NOT NULL,
    prioridad ENUM('BAJA', 'MEDIA', 'ALTA', 'CRITICA') NOT NULL,
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_programada DATETIME,
    notas VARCHAR(500),
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO listas_espera (id_paciente, id_procedimiento, nombre_procedimiento, id_hospital, nombre_hospital, prioridad, estado, fecha_programada, notas) VALUES
(1, 101, 'Bypass coronario', 1, 'Hospital Clinico Universidad de Chile', 'ALTA', 'PENDIENTE', DATE_ADD(NOW(), INTERVAL 15 DAY), 'Paciente en espera de lecho disponible'),
(2, 102, 'Lobectomia pulmonar', 1, 'Hospital Clinico Universidad de Chile', 'MEDIA', 'PENDIENTE', DATE_ADD(NOW(), INTERVAL 30 DAY), 'Estudios preoperatorios completados'),
(3, 103, 'Artroplastia de cadera', 2, 'Hospital del Salvador', 'MEDIA', 'PENDIENTE', DATE_ADD(NOW(), INTERVAL 25 DAY), 'Evaluacion cardiaca pendiente'),
(5, 104, 'Trasplante renal', 1, 'Hospital Clinico Universidad de Chile', 'CRITICA', 'EN_ESPERA', DATE_ADD(NOW(), INTERVAL 5 DAY), 'Donante identificado, compatible'),
(7, 105, 'Cateterismo cardiaco', 3, 'Hospital Exequiel Gonzalez Cortes', 'ALTA', 'PENDIENTE', DATE_ADD(NOW(), INTERVAL 10 DAY), 'Riesgo moderado, requiere monitoreo');

-- ============================================================================
-- 8. TABLA: EQUIPAMIENTO (db_smarthealth_equipamiento)
-- ============================================================================
USE db_smarthealth_equipamiento;

DROP TABLE IF EXISTS equipamiento;
CREATE TABLE equipamiento (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_serie VARCHAR(100) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    hospital_ubicacion_id BIGINT,
    fecha_adquisicion DATE,
    proximo_mantenimiento DATE,
    costo_unitario DECIMAL(12, 2),
    vida_util_meses INT,
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO equipamiento (numero_serie, nombre, marca, estado, hospital_ubicacion_id, fecha_adquisicion, proximo_mantenimiento, costo_unitario, vida_util_meses) VALUES
('RX-2024-001', 'Maquina de Rayos X Diagnostico', 'GE Healthcare', 'Disponible', 1, '2020-06-15', '2026-06-15', 250000.00, 72),
('ECG-2024-002', 'Electrocardiograma Digital', 'Philips', 'Disponible', 1, '2021-03-20', '2026-03-20', 45000.00, 60),
('VENTILADOR-001', 'Ventilador Mecanico UCI', 'Siemens', 'En Uso', 1, '2019-09-10', '2026-09-10', 180000.00, 84),
('MONITOR-001', 'Monitor Multiparametrico', 'GE Healthcare', 'Disponible', 2, '2022-01-30', '2026-01-30', 95000.00, 48),
('ULTRASOUND-001', 'Ecografo 4D', 'Mindray', 'Mantenimiento', 2, '2021-11-15', '2026-11-15', 320000.00, 60),
('DESFIBRILADOR-001', 'Desfibrilador Automatico Externo', 'Zoll', 'Disponible', 3, '2023-02-28', '2026-02-28', 35000.00, 36),
('BOMBA-INFUSION-001', 'Bomba de Infusion Volumetrica', 'Baxter', 'Disponible', 3, '2022-07-12', '2026-07-12', 28000.00, 48),
('OXIMETRO-001', 'Pulsioximetro de Dedo', 'Nonin', 'Disponible', 4, '2023-05-20', '2026-05-20', 12000.00, 36);

-- ============================================================================
-- 9. TABLA: INSUMOS (db_smarthealth_insumos)
-- ============================================================================
USE db_smarthealth_insumos;

DROP TABLE IF EXISTS insumos;
CREATE TABLE insumos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    cantidad_disponible INT NOT NULL,
    cantidad_minima INT NOT NULL,
    precio_unitario DECIMAL(10, 2),
    fecha_vencimiento DATE,
    hospital_ubicacion_id BIGINT,
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO insumos (codigo, nombre, tipo, cantidad_disponible, cantidad_minima, precio_unitario, fecha_vencimiento, hospital_ubicacion_id) VALUES
('MED-001', 'Amoxicilina 500mg', 'Medicamento', 500, 100, 800.00, DATE_ADD(NOW(), INTERVAL 180 DAY), 1),
('MED-002', 'Paracetamol 500mg', 'Medicamento', 1200, 200, 300.00, DATE_ADD(NOW(), INTERVAL 240 DAY), 1),
('QUI-001', 'Gasas esteriles 10x10cm', 'Quirurgico', 2000, 300, 150.00, DATE_ADD(NOW(), INTERVAL 365 DAY), 1),
('QUI-002', 'Guantes latex quirurgicos', 'Quirurgico', 5000, 500, 2500.00, DATE_ADD(NOW(), INTERVAL 180 DAY), 1),
('MED-003', 'Suero fisiologico 500ml', 'Medicamento', 450, 100, 1200.00, DATE_ADD(NOW(), INTERVAL 90 DAY), 2),
('QUI-003', 'Mascarillas N95', 'Quirurgico', 3000, 500, 800.00, DATE_ADD(NOW(), INTERVAL 120 DAY), 2),
('MED-004', 'Insulina NPH 100u/ml', 'Medicamento', 120, 30, 8500.00, DATE_ADD(NOW(), INTERVAL 180 DAY), 3),
('QUI-004', 'Vendas elasticas 5cm', 'Quirurgico', 800, 150, 1500.00, DATE_ADD(NOW(), INTERVAL 365 DAY), 3),
('MED-005', 'acido acetilsalicilico 100mg', 'Medicamento', 800, 150, 500.00, DATE_ADD(NOW(), INTERVAL 270 DAY), 4),
('QUI-005', 'Jeringas desechables 10ml', 'Quirurgico', 6000, 1000, 350.00, DATE_ADD(NOW(), INTERVAL 180 DAY), 4);

-- ============================================================================
-- RESUMEN FINAL
-- ============================================================================
SELECT 
    'Hospitales:' as Tabla, COUNT(*) as Total FROM db_smarthealth_hospitales.hospitales
UNION ALL
SELECT 'Personal:', COUNT(*) FROM db_smarthealth_personal.personal
UNION ALL
SELECT 'Pacientes:', COUNT(*) FROM db_smarthealth_pacientes.pacientes
UNION ALL
SELECT 'Camas:', COUNT(*) FROM db_smarthealth_camas.camas
UNION ALL
SELECT 'Triajes:', COUNT(*) FROM db_smarthealth_triaje.triajes
UNION ALL
SELECT 'Historiales:', COUNT(*) FROM db_smarthealth_historial.historial_clinico
UNION ALL
SELECT 'Listas Espera:', COUNT(*) FROM db_smarthealth_listas_de_espera.listas_espera
UNION ALL
SELECT 'Equipamiento:', COUNT(*) FROM db_smarthealth_equipamiento.equipamiento
UNION ALL
SELECT 'Insumos:', COUNT(*) FROM db_smarthealth_insumos.insumos;

SELECT 'OPERACION COMPLETADA EXITOSAMENTE' as Resultado;

-- ============================================================================
-- PERMISOS: Otorgar acceso a smarthealth_user en todas las bases de datos
-- ============================================================================
GRANT ALL PRIVILEGES ON db_smarthealth_hospitales.* TO 'smarthealth_user'@'%';
GRANT ALL PRIVILEGES ON db_smarthealth_personal.* TO 'smarthealth_user'@'%';
GRANT ALL PRIVILEGES ON db_smarthealth_pacientes.* TO 'smarthealth_user'@'%';
GRANT ALL PRIVILEGES ON db_smarthealth_camas.* TO 'smarthealth_user'@'%';
GRANT ALL PRIVILEGES ON db_smarthealth_triaje.* TO 'smarthealth_user'@'%';
GRANT ALL PRIVILEGES ON db_smarthealth_historial.* TO 'smarthealth_user'@'%';
GRANT ALL PRIVILEGES ON db_smarthealth_listas_de_espera.* TO 'smarthealth_user'@'%';
GRANT ALL PRIVILEGES ON db_smarthealth_equipamiento.* TO 'smarthealth_user'@'%';
GRANT ALL PRIVILEGES ON db_smarthealth_insumos.* TO 'smarthealth_user'@'%';
FLUSH PRIVILEGES;

