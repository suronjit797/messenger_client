import React, { memo, useEffect, useRef, useState } from "react";
import { SortOrder } from "../../__generated__/graphql";
import { useAppSelector } from "../../redux/store";
import { gql } from "../../__generated__";
import { useQuery } from "@apollo/client";
import { MESSAGE_TYPING, SEND_MESSAGE } from "../../constants/constantsVars";
import TypingIndicator from "./TypingIndicator";

const GET_USER_MESSAGE = gql(`
  query GetUserMessages($userId: ID!, $pagination: PaginationInput) {
    getUserMessage(id: $userId, pagination: $pagination) {
      meta { page limit total }
      data {
        _id
        users { _id name email avatar }
        sender { _id name }
        message
        createdAt
      }
    }
  }
`);

interface Props {
  userId: string;
}

const ChatBody: React.FC<Props> = ({ userId }) => {
  // redux
  const { socket } = useAppSelector((state) => state.socket);
  const { user } = useAppSelector((state) => state.auth);

  const lastMessageRef = useRef(null);

  // states
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState<Boolean>(false);
  // const [limit, setLimit] = useState(10);
  // const [page, setPage] = useState(1);

  // gql
  const { loading, data, fetchMore } = useQuery(GET_USER_MESSAGE, {
    variables: {
      userId,
      pagination: { page: 1, limit: 10, sortOrder: SortOrder.Desc, sortBy: "createdAt" },
    },
    onCompleted: (data) => {
      if (data?.getUserMessage?.data) {
        const m = [...data.getUserMessage.data];
        setMessages(m.reverse());
      }
    },
    fetchPolicy: "network-only",
  });

  // // scroll to last message
  useEffect(() => {
    if (lastMessageRef.current && Number(data?.getUserMessage?.meta?.page) <= 1) {
      (lastMessageRef.current as any).scrollIntoView();
    }
  }, [isTyping, data, messages]);

  // socket
  useEffect(() => {
    if (!socket) return;
    socket.on(SEND_MESSAGE, (message) => {
      setMessages((pre) => [...pre, message]);
    });

    socket.on(MESSAGE_TYPING, ({ typing }) => {
      setIsTyping(typing);
    });

    // Cleanup on component unmount
    return () => {
      socket.off(SEND_MESSAGE);
      socket.off(MESSAGE_TYPING);
    };
  }, [socket]);

  const loadMoreMessages = () => {
    if (!data?.getUserMessage?.meta?.total || data?.getUserMessage?.meta?.total <= messages.length) return;

    fetchMore({
      variables: {
        userId,
        pagination: { page: data.getUserMessage.meta.page + 1, limit: 10 },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.getUserMessage?.data) return prev;

        // const newMessages = fetchMoreResult?.getUserMessage?.data.reverse();
        const newMessages = fetchMoreResult?.getUserMessage?.data;
        console.log({ newMessages });
        setMessages((prevMessages) => [...newMessages, ...prevMessages]);

        return {
          getUserMessage: {
            ...fetchMoreResult.getUserMessage,
            data: [...newMessages, ...(prev?.getUserMessage?.data || [])],
          },
        };
      },
    });
  };

  return (
    <div
      className="p-4 overflow-y-auto h-full"
      onScroll={(e) => {
        if ((e.target as any).scrollTop === 0) loadMoreMessages();
      }}
    >
      <div className="flex flex-col h-full">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((m, index) => (
            <div
              className={m.sender._id === user._id ? "justify-end flex" : "flex"}
              key={index}
              ref={index === messages?.length - 1 && !isTyping ? lastMessageRef : null}
            >
              <div
                className={`inline-block m-1 py-2 px-3 rounded-3xl max-w-xs text-sm ${
                  m.sender._id === user._id ? "bg-secondary text-white rounded-br-none" : "bg-white rounded-bl-none"
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: m.message.replace(/\n/g, "<br>") }}></div>
              </div>

              {/* <div className="bg-blue-500 text-white inline-block m-1 p-3 rounded-lg rounded-br-none max-w-xs text-sm">
              {m.message}
            </div> */}
            </div>
          ))
        ) : (
          <div className="mt-5 text-center"> No message found </div>
        )}
        {/* {isTyping ? "typing": "nottyping"} */}
        {isTyping && (
          <div className="mt-auto pb-3">
            <div
              ref={lastMessageRef}
              className="inline-block mx-1 py-3 px-3 rounded-3xl w-14 text-sm bg-white rounded-bl-none"
            >
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ChatBody);
