
import {TypedServer, TypedSocket} from "../../types/types.js";
import {CreateUserPayload, User} from "../../types/user/models.js";
import {createUser} from "../../services/user.service.js";

export function registerUserHandlers(
    io: TypedServer,
    socket: TypedSocket
) {
    socket.on("user:create", async (payload, ack) => {
        try {
            const { username, imageName = null } = payload;

            if (!username || username.trim() === "") {
                return ack("Username invalide");
            }

            const createUserDto: CreateUserPayload = {
                username: username.trim(),
                imageName,
            };

            const user = await createUser(createUserDto);

            if (user) {
                socket.emit("user:created", user);
                ack();
            } else {
                ack("Erreur serveur");
            }
        } catch (e) {
            ack("Erreur serveur");
        }
    });
}