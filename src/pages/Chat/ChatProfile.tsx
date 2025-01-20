import React from "react";
import { ProfileQuery } from "../../__generated__/graphql";

interface Props {
  user: ProfileQuery["user"];
}

const ChatProfile: React.FC<Props> = ({ user }) => {
  return (
    <div>
      <div className="px-4">
        <img src={user?.avatar} alt="avatar" className="w-full rounded-full" />
      </div>
      <h2 className="text-2xl font-bold capitalize text-center my-4"> {user?.name} </h2>
      <div className="text-center">...</div>
    </div>
  );
};

export default ChatProfile;
