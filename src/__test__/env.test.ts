describe('Environment Variables', () => {
  it('should have an application port', () => {
    expect(process.env.APP_PORT).toBeDefined();
  });
});
