import net from "net";

/**
 * Finds an available port starting from the given port number
 * @param startPort - The port number to start searching from
 * @returns Promise<number> - An available port number
 */
const releasePortAndResolve = (server: net.Server, port: number, resolve: (port: number) => void): void => {
  server.close(() => {
    // Small delay to ensure port is fully released
    setTimeout(() => resolve(port), 50);
  });
};

const handleServerListen = (server: net.Server, resolve: (port: number) => void): void => {
  const { port } = server.address() as net.AddressInfo;
  releasePortAndResolve(server, port, resolve);
};

export const findAvailablePort = (startPort: number = 3000): Promise<number> => {
  return new Promise((resolve) => {
    const server = net.createServer();

    const handleError = () => {
      // Port is in use, try the next one
      resolve(findAvailablePort(startPort + 1));
    };

    server.on("error", handleError);
    server.listen(startPort, () => handleServerListen(server, resolve));
  });
};

/**
 * Gets a random available port for test environments
 * @returns Promise<number> - An available port number
 */
export const getRandomAvailablePort = (): Promise<number> => {
  // Start from a high port range to avoid conflicts with common services
  // Using Math.random() is acceptable here as this is only for test port selection, not security-critical
  // eslint-disable-next-line sonarjs/pseudo-random
  const basePort = 8000 + Math.floor(Math.random() * 1000);
  return findAvailablePort(basePort);
};
