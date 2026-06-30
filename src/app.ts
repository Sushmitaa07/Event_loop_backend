import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import userRouter from "./routes/user.route";
import adminUserRouter from "./routes/admin/user.route";
import { HttpException } from "./exceptions/http-exception";
import { ApiResponseHelper } from "./utils/apihelper.util";
import cors from "cors";
import { PORT } from "./configs/constant";

const app: Application = express();

app.use(express.json()); // json input
app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

// CORS
app.use(cors());

// Serve uploaded profile images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// AUTH ROUTES (register, login)
app.use("/api/v1/auth", userRouter);

// USER ROUTES (whoami, update, update-password)
app.use("/api/v1/users", userRouter);

// ADMIN USER MANAGEMENT ROUTES (CRUD + pagination/search, admin only)
app.use("/api/v1/admin/users", adminUserRouter);

// HEALTH CHECK
app.get("/", (req: Request, res: Response) => {
    return res.send("Hello, TypeScript-Express!");
});

// use PORT from configuration (src/configs/constant.ts)

// global api handler (at the last)
app.use((req: Request, res: Response) => {
    return res.status(404).json({ message: "API not found" });
});

// global error handler (at the last)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);

    if (err instanceof HttpException) {
        return ApiResponseHelper.error(res, err.message, err.status);
    }

    return ApiResponseHelper.error(res, "Internal Server Error", 500);
});

// export techniques
const DUMMY: string = "Dummy Export";

export {
    PORT,
    DUMMY
};

// default export
export default app;