import { db } from '../config/database';

beforeAll(async () => {
  // Aguardar inicialização do banco
  await new Promise(resolve => setTimeout(resolve, 1000));
});

afterAll(async () => {
  // Fechar conexão com banco
  db.close();
});

// Teste básico para evitar erro de "no tests"
describe('Setup', () => {
  it('should initialize database', () => {
    expect(db).toBeDefined();
  });
}); 