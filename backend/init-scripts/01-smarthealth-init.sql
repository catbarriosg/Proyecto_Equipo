-- ============================================================================
-- CLÍNICA AGENDA MÉDICA (backend SmartHealth) - ESTRUCTURA Y DATOS DE EJEMPLO
-- ============================================================================
-- Se ejecuta automáticamente la primera vez que se crea el volumen de MySQL.
-- Para volver a cargar estos datos: docker compose down -v  y luego  docker compose up
--
-- Cuentas de demostración (las crea ms-auth al iniciar, con contraseña cifrada):
--   admin@clinica.cl      / Admin123!     (administrador)
--   dr.juan@clinica.cl    / Medico123!    (médico, personal ID 1)
--   dra.maria@clinica.cl  / Medico123!    (médica, personal ID 2)
--   ana.perez@gmail.com   / Paciente123!  (paciente ID 1)
-- ============================================================================

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS db_smarthealth_hospitales CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS db_smarthealth_personal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS db_smarthealth_pacientes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS db_smarthealth_camas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS db_smarthealth_triaje CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS db_smarthealth_historial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS db_smarthealth_listas_de_espera CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS db_smarthealth_equipamiento CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS db_smarthealth_insumos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS db_smarthealth_auth CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS db_smarthealth_citas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================================
-- 1. SUCURSALES DE LA CLÍNICA (ms-hospitales, tabla hospitales)
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
    nivel_complejidad VARCHAR(10) NOT NULL,
    capacidad_total_camas INT DEFAULT 0,
    horario VARCHAR(500),
    imagen_url VARCHAR(255),
    descripcion_imagen VARCHAR(150),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO hospitales (id, nombre, direccion, region, comuna, telefono, correo_institucional, nivel_complejidad, capacidad_total_camas, horario, imagen_url, descripcion_imagen) VALUES
(1, 'Santiago Centro', 'Av. Salud 1234, Santiago', 'Metropolitana', 'Santiago', '+56223456789', 'santiago.centro@clinicaagendamedica.cl', 'MEDIANA', 0,
    'Lunes a viernes: 08:00 a 20:00\nSábados: 09:00 a 14:00', '/fachada-clinica.png', 'Fachada de la sucursal Santiago Centro'),
(2, 'Providencia', 'Av. Providencia 2456, Providencia', 'Metropolitana', 'Providencia', '+56223456790', 'providencia@clinicaagendamedica.cl', 'MEDIANA', 0,
    'Lunes a viernes: 08:00 a 19:00\nSábados: 09:00 a 13:00', '/recepcion-clinica.png', 'Recepción de la sucursal Providencia'),
(3, 'Maipú', 'Av. Pajaritos 3210, Maipú', 'Metropolitana', 'Maipú', '+56223456791', 'maipu@clinicaagendamedica.cl', 'BAJA', 0,
    'Lunes a viernes: 08:30 a 18:30\nSábados: cerrado', '/sala-espera.png', 'Sala de espera de la sucursal Maipú'),
(4, 'La Florida', 'Av. Vicuña Mackenna 7890, La Florida', 'Metropolitana', 'La Florida', '+56223456792', 'laflorida@clinicaagendamedica.cl', 'BAJA', 0,
    'Lunes a viernes: 09:00 a 19:00\nSábados: 09:00 a 14:00', '/box-clinica.png', 'Box de atención de la sucursal La Florida');

-- ============================================================================
-- 2. PERSONAL Y ESPECIALIDADES (ms-personal)
-- ============================================================================
USE db_smarthealth_personal;

DROP TABLE IF EXISTS especialidades;
CREATE TABLE especialidades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(500),
    icono VARCHAR(10),
    activa BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO especialidades (nombre, slug, descripcion, icono) VALUES
('Medicina General', 'medicina-general', 'Atención médica integral para la prevención, diagnóstico y tratamiento de distintas condiciones de salud.', '🩺'),
('Pediatría', 'pediatria', 'Atención médica especializada para niños y adolescentes, acompañando su crecimiento y desarrollo.', '👶'),
('Ginecología', 'ginecologia', 'Atención y cuidado integral de la salud de la mujer en las distintas etapas de su vida.', '🌸'),
('Cardiología', 'cardiologia', 'Prevención, diagnóstico y tratamiento de enfermedades relacionadas con el corazón y el sistema cardiovascular.', '❤️'),
('Traumatología', 'traumatologia', 'Atención de lesiones y enfermedades relacionadas con huesos, articulaciones y músculos.', '🦴'),
('Dermatología', 'dermatologia', 'Evaluación, diagnóstico y tratamiento de enfermedades de la piel, el cabello y las uñas.', '🧴');

DROP TABLE IF EXISTS personal;
CREATE TABLE personal (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    rut VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    especialidad VARCHAR(100),
    numero_colegiatura VARCHAR(50) UNIQUE,
    departamento VARCHAR(100) NOT NULL,
    hospital_id BIGINT NOT NULL,
    descripcion VARCHAR(500),
    imagen_url VARCHAR(255),
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- hospital_id = sucursal donde atiende
INSERT INTO personal (id, nombre, rut, email, telefono, rol, especialidad, numero_colegiatura, departamento, hospital_id, descripcion, imagen_url) VALUES
(1, 'Dr. Juan Pérez', '13579246-2', 'dr.juan@clinica.cl', '+56912345680', 'MEDICO', 'Medicina General', 'COL-12346', 'Consulta ambulatoria', 1,
    'Atención médica integral para la prevención, diagnóstico y tratamiento de distintas condiciones de salud.', '/logo-hombre.png'),
(2, 'Dra. María González', '14680357-1', 'dra.maria@clinica.cl', '+56912345681', 'MEDICO', 'Pediatría', 'COL-12347', 'Consulta ambulatoria', 2,
    'Atención médica especializada para niños y adolescentes, acompañando su crecimiento y desarrollo.', '/logo-mujer.png'),
(3, 'Dr. Carlos Rodríguez', '12457896-5', 'dr.carlos@clinica.cl', '+56912345678', 'MEDICO', 'Cardiología', 'COL-12345', 'Consulta ambulatoria', 1,
    'Prevención, diagnóstico y tratamiento de enfermedades relacionadas con el corazón.', '/logo-hombre.png'),
(4, 'Dra. Ana Martínez', '17654321-3', 'dra.ana@clinica.cl', '+56912345682', 'MEDICO', 'Ginecología', 'COL-12348', 'Consulta ambulatoria', 3,
    'Atención y cuidado integral de la salud de la mujer en las distintas etapas de su vida.', '/logo-mujer.png'),
(5, 'Dr. Felipe Soto', '18765432-7', 'dr.felipe@clinica.cl', '+56912345683', 'MEDICO', 'Traumatología', 'COL-12349', 'Consulta ambulatoria', 4,
    'Atención de lesiones y enfermedades relacionadas con huesos, articulaciones y músculos.', '/logo-hombre.png'),
(6, 'Dra. Camila Rojas', '11222333-9', 'dra.camila@clinica.cl', '+56912345684', 'MEDICO', 'Dermatología', 'COL-12350', 'Consulta ambulatoria', 2,
    'Evaluación y atención de enfermedades de la piel, cabello y uñas.', '/logo-mujer.png'),
(7, 'Enfermera Magdalena Díaz', '19876543-0', 'magdalena.diaz@clinica.cl', '+56912345685', 'ENFERMERO', NULL, NULL, 'Enfermería', 1, NULL, NULL),
(8, 'Roberto Silva', '20345678-6', 'roberto.silva@clinica.cl', '+56912345686', 'ADMINISTRATIVO', NULL, NULL, 'Admisión', 1, NULL, NULL),
(9, 'Técnico David López', '21456789-K', 'david.lopez@clinica.cl', '+56912345687', 'TECNICO', NULL, NULL, 'Mantenimiento', 2, NULL, NULL);

-- ============================================================================
-- 3. PACIENTES (ms-pacientes)
-- ============================================================================
USE db_smarthealth_pacientes;

DROP TABLE IF EXISTS pacientes;
CREATE TABLE pacientes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rut VARCHAR(20) NOT NULL UNIQUE,
    nombre_completo VARCHAR(100) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    prevision VARCHAR(40),
    telefono VARCHAR(20),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    id_historial_clinico BIGINT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Los pacientes 1 y 2 son de la clínica; del 3 en adelante son los datos originales que usan camas y triaje
INSERT INTO pacientes (id, rut, nombre_completo, correo, fecha_nacimiento, prevision, telefono) VALUES
(1, '16543210-K', 'Ana Pérez', 'ana.perez@gmail.com', '1990-04-12', 'Fonasa', '+56987654321'),
(2, '15432109-8', 'Carlos Soto', 'carlos.soto@gmail.com', '1985-09-03', 'Isapre Colmena', '+56987654322'),
(3, '12345678-1', 'Andres Felipe Morales Ruiz', 'andres.morales@mail.com', '1975-03-15', NULL, NULL),
(4, '13456789-2', 'Maria Carolina Fuentes Gomez', 'maria.fuentes@mail.com', '1982-07-22', NULL, NULL),
(5, '14567890-3', 'Roberto German Lopez Parra', 'roberto.lopez@mail.com', '1968-11-08', NULL, NULL),
(6, '15678901-4', 'Silvia Paulina Cortes Valencia', 'silvia.cortes@mail.com', '1990-05-30', NULL, NULL),
(7, '16789012-5', 'Jose Manuel Garcia Salazar', 'jose.garcia@mail.com', '1978-09-14', NULL, NULL),
(8, '17890123-6', 'Isabel Marcela Diaz Rojas', 'isabel.diaz@mail.com', '1985-02-28', NULL, NULL),
(9, '18901234-7', 'Miguel Angel Ramirez Flores', 'miguel.ramirez@mail.com', '1972-12-20', NULL, NULL),
(10, '19012345-8', 'Francisca Lorena Moreno Ortiz', 'francisca.moreno@mail.com', '1988-06-17', NULL, NULL),
(11, '20123456-9', 'Fernando Luis Valdez Sepulveda', 'fernando.valdez@mail.com', '1981-04-09', NULL, NULL),
(12, '21234567-0', 'Susana Veronica Silva Acosta', 'susana.silva@mail.com', '1976-10-25', NULL, NULL);

-- ============================================================================
-- 4. CITAS / HORAS MÉDICAS (ms-citas)
-- ============================================================================
USE db_smarthealth_citas;

DROP TABLE IF EXISTS citas;
CREATE TABLE citas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE,
    paciente_id BIGINT NOT NULL,
    paciente_nombre VARCHAR(120) NOT NULL,
    paciente_rut VARCHAR(12),
    paciente_correo VARCHAR(120),
    medico_id BIGINT NOT NULL,
    medico_nombre VARCHAR(120) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    sucursal_id BIGINT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado VARCHAR(20) NOT NULL,
    motivo VARCHAR(300),
    franja VARCHAR(40) UNIQUE,
    creado_por_usuario_id BIGINT,
    rol_creador VARCHAR(20),
    creado_en DATETIME(6),
    actualizado_en DATETIME(6),
    INDEX idx_citas_paciente (paciente_id),
    INDEX idx_citas_medico_fecha (medico_id, fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fechas relativas a hoy; las futuras se corren al lunes si caen domingo
INSERT INTO citas (id, codigo, paciente_id, paciente_nombre, paciente_rut, paciente_correo, medico_id, medico_nombre, especialidad, sucursal_id, fecha, hora, estado, motivo, rol_creador, creado_en, actualizado_en) VALUES
(1, 'AM-000001', 1, 'Ana Pérez', '16543210-K', 'ana.perez@gmail.com', 1, 'Dr. Juan Pérez', 'Medicina General', 1,
    DATE_ADD(CURDATE(), INTERVAL 10 + (DAYOFWEEK(DATE_ADD(CURDATE(), INTERVAL 10 DAY)) = 1) DAY), '10:00:00', 'CONFIRMADA', 'Control anual', 'PACIENTE', NOW(), NOW()),
(2, 'AM-000002', 1, 'Ana Pérez', '16543210-K', 'ana.perez@gmail.com', 3, 'Dr. Carlos Rodríguez', 'Cardiología', 1,
    DATE_SUB(CURDATE(), INTERVAL 30 DAY), '10:30:00', 'ATENDIDA', 'Control cardiovascular', 'PACIENTE', NOW(), NOW()),
(3, 'AM-000003', 2, 'Carlos Soto', '15432109-8', 'carlos.soto@gmail.com', 2, 'Dra. María González', 'Pediatría', 2,
    DATE_ADD(CURDATE(), INTERVAL 12 + (DAYOFWEEK(DATE_ADD(CURDATE(), INTERVAL 12 DAY)) = 1) DAY), '11:00:00', 'CONFIRMADA', 'Control de niño sano', 'PACIENTE', NOW(), NOW()),
(4, 'AM-000004', 1, 'Ana Pérez', '16543210-K', 'ana.perez@gmail.com', 6, 'Dra. Camila Rojas', 'Dermatología', 2,
    DATE_ADD(CURDATE(), INTERVAL 5 DAY), '12:30:00', 'CANCELADA', 'Revisión de lunar', 'PACIENTE', NOW(), NOW());

-- Las citas activas bloquean su horario (ver Cita.actualizarFranja)
UPDATE citas SET franja = CONCAT(medico_id, '|', DATE_FORMAT(fecha, '%Y-%m-%d'), '|', TIME_FORMAT(hora, '%H:%i'))
WHERE estado IN ('SOLICITADA', 'CONFIRMADA');

-- ============================================================================
-- 5. HISTORIAL CLÍNICO (ms-historial)
-- ============================================================================
USE db_smarthealth_historial;

DROP TABLE IF EXISTS historial_clinico;
CREATE TABLE historial_clinico (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    diagnostico VARCHAR(500) NOT NULL,
    tratamiento VARCHAR(1000),
    id_paciente BIGINT NOT NULL,
    fecha DATE,
    motivo VARCHAR(300),
    especialidad VARCHAR(100),
    id_medico BIGINT,
    medico_nombre VARCHAR(120),
    id_cita BIGINT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO historial_clinico (diagnostico, tratamiento, id_paciente, fecha, motivo, especialidad, id_medico, medico_nombre, id_cita) VALUES
('Estado de salud general estable', 'Mantener controles médicos periódicos.', 1, '2026-08-15', 'Control médico general', 'Medicina General', 1, 'Dr. Juan Pérez', NULL),
('Control sin observaciones relevantes', 'Continuar controles según indicación médica.', 1, DATE_SUB(CURDATE(), INTERVAL 30 DAY), 'Control cardiovascular', 'Cardiología', 3, 'Dr. Carlos Rodríguez', 2),
('Infarto agudo de miocardio', 'Angioplastia coronaria, medicacion anticoagulante', 3, '2026-03-10', NULL, NULL, NULL, NULL, NULL),
('Neumonia viral', 'Reposo, antibioticos, inhaladores', 4, '2026-04-02', NULL, NULL, NULL, NULL, NULL),
('Sindrome cervical', 'Rehabilitacion fisica, relajantes musculares', 5, '2026-05-21', NULL, NULL, NULL, NULL, NULL),
('Fractura de tibia', 'Cirugia de reduccion abierta, inmovilizacion', 6, '2026-06-11', NULL, NULL, NULL, NULL, NULL),
('Apendicitis aguda', 'Apendicectomia laparoscopica, cuidados postquirurgicos', 7, '2026-07-30', NULL, NULL, NULL, NULL, NULL);

-- ============================================================================
-- 6. SERVICIOS INTERNOS (sin vistas en el frontend): camas, triaje, listas de espera, equipamiento, insumos
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
('URGENCIA-03', 'URGENCIA', 'DISPONIBLE', 'Urgencia', 4, NULL);

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
('13456789-2', 7, '140/90', 37.2, 85, 96, 'Fiebre y tos persistente', 'AMARILLO', 9),
('14567890-3', 1, '118/78', 36.8, 70, 99, 'Mareos y nauseas', 'VERDE', 4),
('15678901-4', 3, '160/100', 38.5, 95, 92, 'Dolor severo en extremidad', 'ROJO', 12),
('16789012-5', 7, '130/85', 36.3, 75, 97, 'Herida lacerante en mano', 'AMARILLO', 7);

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
(3, 101, 'Ecocardiograma', 1, 'Santiago Centro', 'ALTA', 'PENDIENTE', DATE_ADD(NOW(), INTERVAL 15 DAY), 'Derivado desde cardiología'),
(4, 102, 'Espirometría', 1, 'Santiago Centro', 'MEDIA', 'PENDIENTE', DATE_ADD(NOW(), INTERVAL 30 DAY), 'Estudios previos completados'),
(5, 103, 'Resonancia de columna', 2, 'Providencia', 'MEDIA', 'PENDIENTE', DATE_ADD(NOW(), INTERVAL 25 DAY), 'Evaluación traumatológica pendiente'),
(7, 104, 'Endoscopía digestiva', 1, 'Santiago Centro', 'CRITICA', 'EN_ESPERA', DATE_ADD(NOW(), INTERVAL 5 DAY), 'Requiere ayuno de 8 horas'),
(9, 105, 'Holter de presión', 3, 'Maipú', 'ALTA', 'PENDIENTE', DATE_ADD(NOW(), INTERVAL 10 DAY), 'Riesgo moderado, requiere monitoreo');

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
('MED-005', 'Acido acetilsalicilico 100mg', 'Medicamento', 800, 150, 500.00, DATE_ADD(NOW(), INTERVAL 270 DAY), 4),
('QUI-005', 'Jeringas desechables 10ml', 'Quirurgico', 6000, 1000, 350.00, DATE_ADD(NOW(), INTERVAL 180 DAY), 4);

-- ============================================================================
-- PERMISOS: el usuario de la aplicación accede a todas las bases
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
GRANT ALL PRIVILEGES ON db_smarthealth_auth.* TO 'smarthealth_user'@'%';
GRANT ALL PRIVILEGES ON db_smarthealth_citas.* TO 'smarthealth_user'@'%';
FLUSH PRIVILEGES;
