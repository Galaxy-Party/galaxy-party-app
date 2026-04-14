import {TypedServer, TypedSocket} from "../../types/types.js";


export function registerHelloHandlers(
    io: TypedServer,
    socket: TypedSocket
) {
    io.emit("hello:message", {value: "Hello World !"})
    socket.on("hello:send", (hello) =>{
        console.log(hello.value)
    })

}