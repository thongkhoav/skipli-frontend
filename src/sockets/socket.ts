import { io } from "socket.io-client";
import { getBaseUrl } from "~/utils/constants";

export const socket = io(getBaseUrl(), {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});
