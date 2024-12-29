import io from "socket.io-client";
import { feathers } from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import authentication from "@feathersjs/authentication-client";

const client = feathers();

const uri = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;

const socket = io(uri, {
  transports: ["websocket"],
  forceNew: true,
});

client.configure(socketio(socket));

client.configure(
  authentication({
    storage: window.localStorage,
    jwtStrategy: "jwt",
  })
);

export default client;
