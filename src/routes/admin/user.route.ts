import { Router } from "express";
import { AdminUserController } from "../../controllers/admin/user.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middlewares/authorized.middleware";

const adminUserRouter = Router();
const adminUserController = new AdminUserController();

// apply middlewares to all routes in this router (admin role only)
adminUserRouter.use(authorizedMiddleware, adminMiddleware);

// 5 core admin user routes
adminUserRouter.get(
    "/",
    adminUserController.getUsersPaginated
);
adminUserRouter.post(
    "/",
    adminUserController.createUser
);
adminUserRouter.get(
    "/:id",
    adminUserController.getUserById
);
adminUserRouter.put(
    "/:id",
    adminUserController.updateUserById
);
adminUserRouter.patch(
    "/:id",
    adminUserController.updateUserById
);
adminUserRouter.delete(
    "/:id",
    adminUserController.deleteUserById
);

export default adminUserRouter;
