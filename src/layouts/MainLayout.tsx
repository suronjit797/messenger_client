import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ChatList from "../components/ChatList/ChatList";
import { useGetRoutes } from "../utils/NavHelper";
import { useEffect, useState } from "react";

import { useAppDispatch } from "../redux/store";
import { IRoute } from "../interfaces/interfaces";
import { setAuth } from "../redux/features/authSlice";
import { IoMdLogOut } from "react-icons/io";
import { HiBars3 } from "react-icons/hi2";

const MainLayout = () => {
  const location = useLocation();
  const [routes] = useGetRoutes();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setAuth({ token: null, user: {} }));
    localStorage.clear();
    navigate("/login");
  };

  // state
  const [currentPage, setCurrentPage] = useState<IRoute | undefined>();
  const [isNavOpen, setIsNavOpen] = useState(true);

  // effects
  useEffect(() => {
    if (location?.pathname && Array.isArray(routes)) {
      const findRoute = routes.find((route) => route.path === location.pathname);
      setCurrentPage(findRoute);
    }
  }, [location?.pathname, routes]);

  return (
    <div className="flex">
      <div className="flex">
        <div className="sidebar w-16 bg-zinc-800 flex flex-col items-center">
          <div className="text-xl mt-4 cursor-pointer" onClick={() => setIsNavOpen((pre) => !pre)}>
            <HiBars3 />
          </div>
          <div
            onClick={handleLogout}
            className="mt-auto logout text-xl p-2 rounded cursor-pointer text-red-500 hover:bg-[#ffffff15] active:bg-[#ffffff30] "
          >
            <IoMdLogOut />
          </div>
        </div>
        <div
          className={`${
            isNavOpen ? "md:w-80 md:opacity-100 w-0 opacity-0" : "md:w-0 md:opacity-0 w-80 opacity-100"
          } main_header capitalize z-50 bg-secondary h-screen overflow-hidden transition-all ease-out duration-200 text-nowrap select-none absolute left-16 md:relative md:left-0`}
        >
          <ChatList />
        </div>
      </div>
      <div className="w-full h-screen overflow-hidden flex flex-col">
        {/* main body */}
        <main className="bg-white text-black overflow-y-auto scroll h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
