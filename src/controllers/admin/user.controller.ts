import { UserService } from "../../services/user.service";
import { z } from "zod";
import { AdminCreateUserDTO, AdminUpdateUserDTO, GetUsersQueryDTO } from "../../dtos/user.dto";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { Request, Response } from "express";

const userService = new UserService();

export class AdminUserController {
    // POST /api/v1/admin/users
    async createUser(req: Request, res: Response) {
        try {
            const userData = AdminCreateUserDTO.safeParse(req.body);
            if (!userData.success) {
                return ApiResponseHelper
                    .error(res, z.prettifyError(userData.error), 400);
            }
            const user = await userService.adminCreateUser(userData.data);
            return ApiResponseHelper.success(res, user, "User created successfully", 201);
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    // GET /api/v1/admin/users
    async getUsersPaginated(req: Request, res: Response) {
        try {
            const query = GetUsersQueryDTO.safeParse(req.query);
            if (!query.success) {
                return ApiResponseHelper
                    .error(res, z.prettifyError(query.error), 400);
            }
            const { page, limit, search } = query.data;
            const { items, total } = await userService.adminGetAllUsers({
                page,
                limit,
                search,
            });
            const totalPages = Math.max(1, Math.ceil(total / limit));
            return res.status(200).json({
                status: 200,
                success: true,
                message: "Users retrieved successfully",
                data: items,
                meta: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            });
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    // GET /api/v1/admin/users/:id
    async getUserById(req: Request, res: Response) {
        try {
            const { id }: { id?: string } = req.params;
            if (!id) {
                return ApiResponseHelper.error(res, "User id is required", 400);
            }
            const user = await userService.adminGetUserById(id);
            return ApiResponseHelper.success(res, user, "User retrieved successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    // PUT/PATCH /api/v1/admin/users/:id
    async updateUserById(req: Request, res: Response) {
        try {
            const { id }: { id?: string } = req.params;
            if (!id) {
                return ApiResponseHelper.error(res, "User id is required", 400);
            }
            const userData = AdminUpdateUserDTO.safeParse(req.body);
            if (!userData.success) {
                return ApiResponseHelper
                    .error(res, z.prettifyError(userData.error), 400);
            }
            const user = await userService.adminUpdateUser(id, userData.data);
            return ApiResponseHelper.success(res, user, "User updated successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    // DELETE /api/v1/admin/users/:id
    async deleteUserById(req: Request, res: Response) {
        try {
            const { id }: { id?: string } = req.params;
            if (!id) {
                return ApiResponseHelper.error(res, "User id is required", 400);
            }
            await userService.adminDeleteUser(id);
            return ApiResponseHelper.success(res, null, "User deleted successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }
}
