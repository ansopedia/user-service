describe('Environment Variables', () => {
  it('should have an application port', () => {
    expect(process.env.APP_PORT).toBeDefined();
  });
  it('should have a database host', () => {
    expect(process.env.DB_HOST).toBeDefined();
  });
});
