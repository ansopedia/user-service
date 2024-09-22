import http from "http";
import { app } from "./app";

const server = http.createServer(app);

export const startServer = (port: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${port}`);
      resolve();
    });
    server.on("error", reject);
  });
};

export const stopServer = (): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log("Server is shutting down...");

  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export default app;
