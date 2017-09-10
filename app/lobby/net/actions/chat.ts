import { actionCreator } from "utils/redux";
import { rpc, RpcRealm } from "lobby/net/middleware/rpc";
import { RpcThunk } from "lobby/net/types";
import { getUserName } from "lobby/net/reducers/users";

export const addChat = actionCreator<{
  sender: string;
  name: string;
  message: string;
}>('ADD_CHAT');

const broadcastChat = (userId: string, text: string): RpcThunk<void> =>
(dispatch, getState, context) => {
  dispatch(addChat({
    sender: userId,
    name: getUserName(getState(), userId),
    message: text
  }));
};
export const multi_broadcastChat = rpc(RpcRealm.Multicast, broadcastChat);

const rpcAddChat = (text: string): RpcThunk<void> =>
(dispatch, getState, context) => {
  const userId = context.client.id.toString();
  dispatch(multi_broadcastChat(userId, text));
};
export const server_addChat = rpc(RpcRealm.Server, rpcAddChat);
