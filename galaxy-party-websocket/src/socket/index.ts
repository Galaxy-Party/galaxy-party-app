import {TypedServer, TypedSocket} from "../types/types.js";
import {registerHelloHandlers} from "./handlers/hello.js";
import {registerUserHandlers} from "./handlers/user.js";
import {registerRoomHandlers} from "./handlers/room.js";


export function initSocket(io: TypedServer) {
    io.on("connection", (socket: TypedSocket) => {
        registerHelloHandlers(io, socket);
        registerUserHandlers(io, socket);
        registerRoomHandlers(io, socket);
    });
}