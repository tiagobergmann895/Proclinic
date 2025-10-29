-- Dados iniciais do Proclinic
INSERT INTO "User" (id, name, email, role, "passwordHash") VALUES 
('admin-1', 'Administrador', 'admin@proclinic.com', 'gestor', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('recep-1', 'Recepcionista', 'recepcao@proclinic.com', 'recepcao', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('prof-1', 'Dr. João Silva', 'joao@proclinic.com', 'profissional', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('fin-1', 'Financeiro', 'financeiro@proclinic.com', 'financeiro', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Patient" (id, name, "birthDate", document, phone, email, address, "createdAt") VALUES 
('patient-1', 'Maria Silva', '1990-05-15', '123.456.789-00', '(11) 99999-9999', 'maria@email.com', 'Rua das Flores, 123', NOW()),
('patient-2', 'João Santos', '1985-03-20', '987.654.321-00', '(11) 88888-8888', 'joao@email.com', 'Av. Paulista, 456', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Item" (id, name, category, unit, sku, "minStock", "isControlled", "createdAt") VALUES 
('item-1', 'Seringa 5ml', 'Material Cirúrgico', 'unidade', 'SYR-5ML-001', 10, true, NOW()),
('item-2', 'Gaze Estéril', 'Material Cirúrgico', 'unidade', 'GAZ-EST-001', 50, true, NOW()),
('item-3', 'Álcool 70%', 'Medicamento', 'ml', 'ALC-70-001', 100, false, NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "ProcedureType" (id, name, description, "defaultDurationMin", "defaultItems") VALUES 
('proc-type-1', 'Consulta Médica', 'Consulta médica geral', 30, '[]'),
('proc-type-2', 'Cirurgia Simples', 'Cirurgia ambulatorial', 60, '[{"itemId": "item-1", "quantity": 2}, {"itemId": "item-2", "quantity": 5}]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "PriceRule" (id, scope, "scopeId", "marginTarget", "minMargin", "maxMargin") VALUES 
('price-rule-1', 'GLOBAL', NULL, 0.6, 0.3, 0.8),
('price-rule-2', 'PROCEDURE_TYPE', 'proc-type-1', 0.5, 0.2, 0.7)
ON CONFLICT (id) DO NOTHING;



