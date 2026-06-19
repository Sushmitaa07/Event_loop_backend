import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateUser } from "../middlewares/authorized.middleware";
import { uploadProfileImage } from "../middlewares/upload.middleware";
import { ApiResponseHelper } from "../utils/apihelper.util";

const userRouter = Router();
const userController = new UserController();

const handleProfileUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadProfileImage.single("profileImage")(
    req,
    res,
    (error: any) => {
      if (error) {
        return ApiResponseHelper.error(
          res,
          error.message,
          400
        );
      }
      next();
    }
  );
};

// Auth
userRouter.post("/register", userController.createUser);
userRouter.post("/login", userController.loginUser);

// Profile
userRouter.get(
  "/whoami",
  authenticateUser,
  userController.whoAmI
);

userRouter.patch(
  "/update",
  authenticateUser,
  handleProfileUpload,
  userController.updateProfile
);

// Dedicated avatar upload endpoint
userRouter.patch(
  "/me/avatar",
  authenticateUser,
  handleProfileUpload,
  userController.updateProfile
);

userRouter.patch(
  "/update-password",
  authenticateUser,
  userController.updatePassword
);

export default userRouter;