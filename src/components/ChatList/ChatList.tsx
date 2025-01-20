import { Link, NavLink } from "react-router-dom";
// import { useGetRoutes } from "../../utils/NavHelper";
// import { useAppSelector } from "../../redux/store";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Input, Spin } from "antd";
import { gql } from "../../__generated__";
import { useQuery } from "@apollo/client";

export const GET_USERS_QUERY = gql(`
  query MyChatUsers {
    myChatUsers {
      meta { page limit }
      data { _id name email avatar isActive }
    }
  }
`);

const ChatList: React.FC = () => {
  // const [routes] = useGetRoutes();
  // const { user } = useAppSelector((state) => state.auth);

  const [isSearchOpen, setIsSearchOpen] = useState(false);


  // gql
  const { loading, data } = useQuery(GET_USERS_QUERY);
  const { data: users = [], meta = {} } = data?.myChatUsers || {};

  useEffect(()=>{

  },[])

  const onSearchChange = (values: string) => {
    console.log(values);
  };

  return (
    <Spin spinning={loading}>
      <div className="flex flex-col h-screen">
        {/* Logo */}
        <div className="relative z-10 py-3 text-center bg-secondary px-3 h-12 flex items-center justify-between">
          {/* search bar */}
          <div
            className={`select-none p-2 text-lg rounded cursor-pointer hover:bg-[#ffffff15] active:bg-[#ffffff30] ${
              isSearchOpen && "bg-[#ffffff15]"
            }`}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <CiSearch />
          </div>
          {/* header */}
          <Link className="font-bold " to="/">
            Chat app
          </Link>
          <div className="p-2 rounded"></div>
          <div className="bars"></div>
        </div>

        <div
          style={{
            transform: `translateY(${isSearchOpen ? 0 : -38}px)`,
            transition: "all .3s linear",
          }}
        >
          {/* search */}
          <div className="px-2">
            <Input
              placeholder="Search By Name"
              onChange={(e) => onSearchChange(e.target.value)}
              size="large"
              prefix={<CiSearch />}
            />
          </div>
          {/* nav */}
          <div className="px-1 py-2 overflow-y-auto scroll mt-1">
            {Array.isArray(users) &&
              users.length > 0 &&
              users.map((user, index) => {
                return (
                  <NavLink
                    key={index}
                    className={({ isActive }) =>
                      `cursor-pointer mb-1 flex hover:bg-[#ffffff15] active:bg-[#ffffff30] transition-all easy items-center px-3 py-2 rounded-md ${
                        isActive ? "bg-active" : ""
                      }`
                    }
                    to={`/chat/${user?._id}`}
                  >
                    <span className="relative w-9 h-9 rounded-full mr-3">
                      <img src={user.avatar} className="w-full rounded-full" />
                      { !!user.isActive &&  <div className="absolute bg-green-400 z-10 h-3 w-3 rounded-full right-0 bottom-[-3px] border-solid border-secondary border-2"></div>}
                    </span>
                    <span>{user.name}</span>
                  </NavLink>
                );
              })}
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default ChatList;
