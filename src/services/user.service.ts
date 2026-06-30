import { UserMongoRepository, GetAllPaginatedParams } from "../repositories/user.repository";
import { CreateUserDTO, LoginUserDTO, UpdatePasswordDTO, UpdateProfileDTO, AdminCreateUserDTO, AdminUpdateUserDTO } from "../dtos/user.dto";
import { IUser } from "../models/user.model";
import { HttpException } from "../exceptions/http-exception";
import bycryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";

const userRepository = new UserMongoRepository();

export type PublicUser = {
    id: string;
    fullName: string;
    email: string;
    contactNumber?: string;
    gender?: string;
    profileImage?: string | null;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export class UserService {
    private toPublicUser(user: IUser): PublicUser {
        return {
            id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            contactNumber: user.contactNumber,
            gender: user.gender,
            profileImage: user.profileImage || null,
            role: (user as any).role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    async createUser(userData: CreateUserDTO): Promise<PublicUser> {
        const existingEmail = await userRepository.getUserByEmail(userData.email);
        if (existingEmail) {
            throw new HttpException(400, "Email already exists");
        }
        const hashedPassword = await bycryptjs.hash(userData.password, 10);
        userData.password = hashedPassword;
        const user = await userRepository.createUser(userData);
        return this.toPublicUser(user);
    }

    async loginUser(loginData: LoginUserDTO) {
        const user = await userRepository.getUserByEmail(loginData.email);
        if (!user) {
            throw new HttpException(400, "Invalid email");
        }
        const isPasswordValid = await bycryptjs.compare(
            loginData.password,
            user.password
        );
        if (!isPasswordValid) {
            throw new HttpException(400, "Invalid password");
        }
        const token = jwt.sign(
            { id: user._id, fullName: user.fullName, email: user.email },
            SECRET_KEY,
            { expiresIn: "30d" }
        );
        
        console.log("Token:", token);
        return { user: this.toPublicUser(user), token };
    }

    async getCurrentUser(userId: string): Promise<PublicUser> {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new HttpException(404, "User not found");
        }
        return this.toPublicUser(user);
    }

    async updateProfile(userId: string, profileData: UpdateProfileDTO): Promise<PublicUser> {
        const updatedUser = await userRepository.update(userId, profileData);
        if (!updatedUser) {
            throw new HttpException(404, "User not found");
        }
        return this.toPublicUser(updatedUser);
    }

    async updatePassword(userId: string, passwordData: UpdatePasswordDTO): Promise<PublicUser> {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new HttpException(404, "User not found");
        }
        const isPasswordValid = await bycryptjs.compare(
            passwordData.currentPassword,
            user.password
        );
        if (!isPasswordValid) {
            throw new HttpException(400, "Current password is incorrect");
        }
        const hashedPassword = await bycryptjs.hash(passwordData.newPassword, 10);
        const updatedUser = await userRepository.update(userId, { password: hashedPassword });
        if (!updatedUser) {
            throw new HttpException(404, "User not found");
        }
        return this.toPublicUser(updatedUser);
    }

    async updateUserRole(userId: string, role: "admin" | "user"): Promise<PublicUser> {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new HttpException(404, "User not found");
        }
        const updatedUser = await userRepository.update(userId, { role });
        if (!updatedUser) {
            throw new HttpException(404, "User not found");
        }
        return this.toPublicUser(updatedUser);
    }

    // ----- Admin User Management -----

    async adminGetAllUsers(params: GetAllPaginatedParams) {
        const { items, total } = await userRepository.getAllPaginated(params);
        return {
            items: items.map((u) => this.toPublicUser(u)),
            total,
        };
    }

    async adminGetUserById(id: string): Promise<PublicUser> {
        const user = await userRepository.getUserById(id);
        if (!user) {
            throw new HttpException(404, "User not found");
        }
        return this.toPublicUser(user);
    }

    async adminCreateUser(userData: AdminCreateUserDTO): Promise<PublicUser> {
        const existingEmail = await userRepository.getUserByEmail(userData.email);
        if (existingEmail) {
            throw new HttpException(400, "Email already exists");
        }
        const hashedPassword = await bycryptjs.hash(userData.password, 10);
        const user = await userRepository.createUser({
            ...userData,
            password: hashedPassword,
        });
        return this.toPublicUser(user);
    }

    async adminUpdateUser(id: string, userData: AdminUpdateUserDTO): Promise<PublicUser> {
        const existing = await userRepository.getUserById(id);
        if (!existing) {
            throw new HttpException(404, "User not found");
        }
        if (userData.email && userData.email !== existing.email) {
            const existingEmail = await userRepository.getUserByEmail(userData.email);
            if (existingEmail) {
                throw new HttpException(400, "Email already exists");
            }
        }
        const payload: Record<string, any> = { ...userData };
        if (userData.password) {
            payload.password = await bycryptjs.hash(userData.password, 10);
        }
        const updatedUser = await userRepository.update(id, payload);
        if (!updatedUser) {
            throw new HttpException(404, "User not found");
        }
        return this.toPublicUser(updatedUser);
    }

    async adminDeleteUser(id: string): Promise<boolean> {
        const existing = await userRepository.getUserById(id);
        if (!existing) {
            throw new HttpException(404, "User not found");
        }
        return userRepository.delete(id);
    }
}