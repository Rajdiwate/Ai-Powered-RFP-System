declare global {
  namespace Express {
    interface Response {
      ok<T>(msg: string, data: T): void;
      created<T>(msg: string, data: T): void;
    }
    interface Request {
      multerLimits?: {
        fileSize: number;
        files: number;
      };
      user: {
        id: string;
        role: string;
      };
    }
  }
}
