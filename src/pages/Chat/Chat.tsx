import React, { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatProfile from "./ChatProfile";
import { gql } from "../../__generated__";
import { useMutation, useQuery } from "@apollo/client";
import ChatBody from "./ChatBody";
import { IoMdAddCircle } from "react-icons/io";
import { BsFillSendFill } from "react-icons/bs";
import { gqlClient } from "../../graphql";
import { GET_USERS_QUERY } from "../../components/ChatList/ChatList";
import * as constantsVars from "../../constants/constantsVars";
import moment from "moment";
import { useAppSelector } from "../../redux/store";

const GET_USER_PROFILE = gql(`
  query Profile($userId: ID!) {
    user(id: $userId) { name email avatar isActive lastActive}
  }
`);

const SEND_MESSAGE = gql(`
    mutation SendMessage($body: CreateMessageInput!) {
    createMessage(body: $body) { _id }
  }
`);

const Chat: React.FC = () => {
  const { userId = "" } = useParams();
  const { socket } = useAppSelector((state) => state.socket);

  // states
  const [messageBody, setMessageBody] = useState("");

  // gql
  const { loading: user_loading, data: user_data } = useQuery(GET_USER_PROFILE, {
    variables: { userId },
    fetchPolicy: "network-only",
  });

  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);

  // socket
  useEffect(() => {
    if (!socket) return;
    // ({user})
    socket.on(constantsVars.GET_ACTIVE_USERS, () => {
      gqlClient.refetchQueries({ include: [GET_USERS_QUERY, GET_USER_PROFILE] });
    });

    // Cleanup on component unmount
    return () => {
      socket.off(constantsVars.GET_ACTIVE_USERS);
    };
  }, [socket]);

  // handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await sendMessage({ variables: { body: { users: [userId], message: messageBody.trim() } } });
    setMessageBody("");
  };

  const textareaEnterToSubmit = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default newline behavior
      if (messageBody.trim()) {
        await sendMessage({ variables: { body: { users: [userId], message: messageBody.trim() } } });
        setMessageBody("");
      }
    }
  };

  const handleFocus = (status: boolean) => {
    if (socket) {
      socket.emit(constantsVars.MESSAGE_INPUT_FOCUSED, { status, userId });
    }
  };
  return (
    <div className="flex">
      {/* center */}
      <div className="message-part bg-slate-200 h-screen overflow-hidden w-full">
        {/* chat header */}
        <div className="h-[75px]">
          <>
            {user_data?.user && (
              <div className="flex items-center px-4 pt-4 pb-2">
                <img src={user_data?.user?.avatar} alt="profile" className="w-12 mr-3 rounded-full" />
                <div className="">
                  <div className="text-lg font-semibold capitalize text-ellipsis	truncate ...">
                    {user_data?.user?.name}
                  </div>
                  <div className="leading-none text-nowrap truncate ...">
                    {user_data?.user?.isActive ? (
                      <>
                        <span className="inline-block bg-green-500 w-2 mr-1 h-2 rounded-full "></span> Active Now{" "}
                      </>
                    ) : (
                      <span className="capitalize"> {moment(user_data?.user?.lastActive).fromNow()} </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        </div>
        <hr className="bg-slate-400 h-[2px]" />

        {/* chat body */}
        <div className="flex flex-col" style={{ height: "calc( 100vh - 76px )" }}>
          <ChatBody {...{ userId }} />

          {/* message input box */}
          <div className="p-4 text-white message_input bg-secondary">
            <form className="flex gap-1 items-center" onSubmit={handleSubmit}>
              <div className="text-2xl p-3 cursor-pointer">
                <IoMdAddCircle />
              </div>
              <textarea
                className="messageTextarea placeholder-slate-500"
                onChange={(e) => setMessageBody(e.target.value)}
                value={messageBody}
                placeholder="Type a Message"
                id="textarea"
                onKeyDown={textareaEnterToSubmit}
                onFocus={() => handleFocus(true)}
                onBlur={() => handleFocus(false)}
              />

              <button
                disabled={!messageBody || loading}
                type="submit"
                className="text-xl p-3 disabled:opacity-30 transition-all"
              >
                <BsFillSendFill />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* right side user profile */}
      {/* <div className="profile-part w-1/4 px-3 py-4 hidden md:block">
        <ChatProfile {...{ user: user_data?.user }} />
      </div> */}
    </div>
  );
};

export default memo(Chat);
