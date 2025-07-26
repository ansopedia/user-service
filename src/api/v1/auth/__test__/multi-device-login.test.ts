// import { UserDAL } from "@/api/v1/user/user.dal";
// import { generateRefreshToken } from "@/utils";

// import { AuthDAL } from "../auth.dal";
// import { AuthModel } from "../auth.model";
// import { AuthService } from "../auth.service";

// describe("Multi-Device Login Support", () => {
//   let userId: string;

//   beforeAll(async () => {
//     // Create a test user or get an existing user id
//     const user = await UserDAL.getUserByEmail("testuser@example.com");
//     if (user) {
//       userId = user.id;
//     } else {
//       // Create user logic here if needed
//       throw new Error("Test user not found");
//     }
//   });

//   afterEach(async () => {
//     // Clean up all auth tokens for the user after each test
//     await AuthDAL.deleteAllAuthsByUserId(userId);
//   });

//   it("should allow multiple refresh tokens per user", async () => {
//     const refreshToken1 = await generateRefreshToken({ id: userId });
//     const refreshToken2 = await generateRefreshToken({ id: userId });

//     await AuthDAL.insertAuthToken({ userId, refreshToken: refreshToken1 });
//     await AuthDAL.insertAuthToken({ userId, refreshToken: refreshToken2 });

//     const tokens = await AuthModel.find({ userId });
//     expect(tokens.length).toBe(2);
//     expect(tokens.map((t) => t.refreshToken)).toEqual(expect.arrayContaining([refreshToken1, refreshToken2]));
//   });

//   it("should logout from a single session by refresh token", async () => {
//     const refreshToken1 = await generateRefreshToken({ id: userId });
//     const refreshToken2 = await generateRefreshToken({ id: userId });

//     await AuthDAL.insertAuthToken({ userId, refreshToken: refreshToken1 });
//     await AuthDAL.insertAuthToken({ userId, refreshToken: refreshToken2 });

//     await AuthService.logout(userId, refreshToken1);

//     const tokens = await AuthModel.find({ userId });
//     expect(tokens.length).toBe(1);
//     expect(tokens[0].refreshToken).toBe(refreshToken2);
//   });

//   it("should logout from all sessions", async () => {
//     const refreshToken1 = await generateRefreshToken({ id: userId });
//     const refreshToken2 = await generateRefreshToken({ id: userId });

//     await AuthDAL.insertAuthToken({ userId, refreshToken: refreshToken1 });
//     await AuthDAL.insertAuthToken({ userId, refreshToken: refreshToken2 });

//     await AuthService.logout(userId);

//     const tokens = await AuthModel.find({ userId });
//     expect(tokens.length).toBe(0);
//   });

//   it("should renew token for a valid refresh token", async () => {
//     const refreshToken = await generateRefreshToken({ id: userId });
//     await AuthDAL.insertAuthToken({ userId, refreshToken });

//     const auth = await AuthService.verifyRefreshToken(refreshToken);
//     expect(auth).toBeDefined();
//     expect(auth.refreshToken).toBe(refreshToken);
//   });

//   it("should reject renewal for invalid refresh token", async () => {
//     await expect(AuthService.verifyRefreshToken("invalidtoken")).rejects.toThrow();
//   });
// });
