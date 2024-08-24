declare global {
  namespace Express {
    // interface User extends CreateUser {}
    interface Request {
      user: CreateUser;
    }

    interface User extends GoogleUser {
      id: string;
    }
  }
}
