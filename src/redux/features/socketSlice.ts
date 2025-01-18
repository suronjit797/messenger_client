import { createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

export interface ServerToClientEvents {
  message: (data: string) => void;
  activeUsers: (data: { user: { _id: string; name: string; email: string; avatar: string } }) => void;
  sendMessage: (data: string) => void;
  messageTyping: (data: {typing: boolean}) => void;
}

export interface ClientToServerEvents {
  sendMessage: (data: string) => void;
  messageInputFocus: (data: { status: boolean; userId: string }) => void;
}

export interface IState {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
}

const initialState: IState = {
  socket: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, { payload }) => {
      state.socket = payload;
    },
  },
});

const socketReducer = socketSlice.reducer;

export const { setSocket } = socketSlice.actions;
export default socketReducer;
