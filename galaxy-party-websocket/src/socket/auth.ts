import jwt from "jsonwebtoken";
import { parse as parseCookie } from "cookie";
import type { ExtendedError } from "socket.io";
import { TypedSocket } from "../types/types.js";

const ACCESS_TOKEN_COOKIE = "access_token";

interface JwtPayload {
    sub: string;
    iss?: string;
    exp?: number;
}

export function socketAuthMiddleware(
    socket: TypedSocket,
    next: (err?: ExtendedError) => void
) {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return next(new Error("JWT_SECRET not configured"));
        }

        const cookieHeader = socket.handshake.headers.cookie;
        if (!cookieHeader) {
            return next(new Error("Unauthorized"));
        }

        const cookies = parseCookie(cookieHeader);
        const token = cookies[ACCESS_TOKEN_COOKIE];
        if (!token) {
            return next(new Error("Unauthorized"));
        }

        const keyBytes = Buffer.from(secret, "base64");
        const payload = jwt.verify(token, keyBytes, {
            algorithms: ["HS256"],
            issuer: "galaxy-party",
        }) as JwtPayload;
        if (!payload.sub) {
            return next(new Error("Unauthorized"));
        }

        socket.data.userId = payload.sub;
        next();
    } catch {
        next(new Error("Unauthorized"));
    }
}