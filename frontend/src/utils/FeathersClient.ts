import io from "socket.io-client";
import { feathers } from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import authentication from "@feathersjs/authentication-client";
import { dynamicStorage } from "./DynamicStorage";

const client = feathers();

const uri = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;

const socket = io(uri, {
  transports: ["websocket"],
  forceNew: true,
});

client.configure(socketio(socket));

if (typeof window !== 'undefined') {
  client.configure(
    authentication({
      storage: dynamicStorage,
      jwtStrategy: "jwt",
    })
  );

  const token = dynamicStorage.getItem("feathers-jwt");

  if (token) {
    client.authentication.setAccessToken(token);
    client.reAuthenticate();
  }
}

export default client;
