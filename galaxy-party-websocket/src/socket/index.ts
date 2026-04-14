import {TypedServer, TypedSocket} from "../types/types.js";
import {registerHelloHandlers} from "./handlers/hello.js";
import {registerUserHandlers} from "./handlers/user.js";


export function initSocket(io: TypedServer) {
    io.on("connection", (socket: TypedSocket) => {
        registerHelloHandlers(io, socket);
        registerUserHandlers(io, socket);
    });
}