import net from "net";

/**
 * Finds an available port starting from the given port number
 * @param startPort - The port number to start searching from
 * @returns Promise<number> - An available port number
 */
export const findAvailablePort = (startPort: number = 3000): Promise<number> => {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.listen(startPort, () => {
      const { port } = server.address() as net.AddressInfo;
      server.close(() => {
        // Small delay to ensure port is fully released
        setTimeout(() => resolve(port), 50);
      });
    });

    server.on("error", () => {
      // Port is in use, try the next one
      resolve(findAvailablePort(startPort + 1));
    });
  });
};

/**
 * Gets a random available port for test environments
 * @returns Promise<number> - An available port number
 */
export const getRandomAvailablePort = (): Promise<number> => {
  // Start from a high port range to avoid conflicts with common services
  const basePort = 8000 + Math.floor(Math.random() * 1000);
  return findAvailablePort(basePort);
};
