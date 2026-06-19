import { UserService } from "../services/user.service";
import { z } from "zod";
import { CreateUserDTO, LoginUserDTO, UpdatePasswordDTO, UpdateProfileDTO } from "../dtos/user.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authorized.middleware";
const userService = new UserService();

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const userData = CreateUserDTO.safeParse(req.body);
            if (!userData.success) {
                return ApiResponseHelper
                    .error(res, z.prettifyError(userData.error), 400);
            }
            const user = await userService.createUser(userData.data);
            return ApiResponseHelper.success(res, user, "User created successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }
    
    async loginUser(req: Request, res: Response) {
        try{
            const parsedData = LoginUserDTO.safeParse(req.body);
            if (!parsedData.success) {
                return ApiResponseHelper
                    .error(res, z.prettifyError(parsedData.error), 400);
            }
            const { user, token } = await userService.loginUser(parsedData.data);
            return ApiResponseHelper.success(res, { user, token }, "Login successful");
        }catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async whoAmI(req: AuthRequest, res: Response) {
        try {
            const userId = (req.user as any)?._id?.toString() || (req.user as any)?.id;
            if (!userId) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            const user = await userService.getCurrentUser(userId);
            return ApiResponseHelper.success(res, user, "Authenticated user fetched successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async updateProfile(req: AuthRequest, res: Response) {
        try {
            const userId = (req.user as any)?._id?.toString() || (req.user as any)?.id;
            if (!userId) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }

            const profileImage = (req as any).file
                ? `/uploads/profile/${(req as any).file.filename}`
                : undefined;

            const profileData = UpdateProfileDTO.safeParse({
                ...req.body,
                ...(profileImage ? { profileImage } : {}),
            });

            if (!profileData.success) {
                return ApiResponseHelper.error(res, z.prettifyError(profileData.error), 400);
            }

            const user = await userService.updateProfile(userId, profileData.data);
            return ApiResponseHelper.success(res, user, "Profile updated successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async updatePassword(req: AuthRequest, res: Response) {
        try {
            const userId = (req.user as any)?._id?.toString() || (req.user as any)?.id;
            if (!userId) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }

            const passwordData = UpdatePasswordDTO.safeParse(req.body);
            if (!passwordData.success) {
                return ApiResponseHelper.error(res, z.prettifyError(passwordData.error), 400);
            }

            const user = await userService.updatePassword(userId, passwordData.data);
            return ApiResponseHelper.success(res, user, "Password updated successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }
}