import React, { useRef, useState } from "react";
import { gql, useQuery } from "@apollo/client";
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
  // ref
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<any[]>([]);

  const { loading, data, fetchMore } = useQuery(GET_USER_MESSAGE, {
    variables: {
      userId,
      pagination: { page: 1, limit: 10, sortOrder: "desc", sortBy: "createdAt" },
    },
    onCompleted: (data) => {
      console.log({ data });
      if (data?.getUserMessage?.data) {
        const m = [...data.getUserMessage.data];
        setMessages(m.reverse());
      }
    },
    fetchPolicy: "network-only",
  });

  const loadMoreMessages = () => {
    if (data?.getUserMessage?.meta?.total <= messages.length) return;

    fetchMore({
      variables: {
        userId,
        pagination: { page: data.getUserMessage.meta.page + 1, limit: 10 },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        const newMessages = fetchMoreResult.getUserMessage.data.reverse();
        setMessages((prevMessages) => [...newMessages, ...prevMessages]);

        return {
          getUserMessage: {
            ...fetchMoreResult.getUserMessage,
            data: [...newMessages, ...prev.getUserMessage.data],
          },
        };
      },
    });
  };

  return (
    <div className="flex flex-col-reverse h-full overflow-y-auto">
      <div
        onScroll={(e) => {
          if ((e.target as any).scrollTop === 0) loadMoreMessages();
        }}
        className="flex-1 overflow-y-auto"
      >
        {messages.map((message, index) => (
          <div key={message._id} ref={index === 0 ? lastMessageRef : null}>
            <div
              className={`inline-block m-1 py-2 px-3 rounded-3xl max-w-xs text-sm ${
                message.sender._id === userId ? "bg-secondary text-white rounded-br-none" : "bg-white rounded-bl-none"
              }`}
            >
              {message.message}
            </div>
          </div>
        ))}
        {loading && <p>Loading...</p>}
      </div>
      {/* <div className="mt-2">
        <TypingIndicator />
      </div> */}
    </div>
  );
};

export default ChatBody;
