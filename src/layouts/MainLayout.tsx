import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ChatList from "../components/ChatList/ChatList";
import { useGetRoutes } from "../utils/NavHelper";
import { useEffect, useState } from "react";

import { useAppDispatch } from "../redux/store";
import { IRoute } from "../interfaces/interfaces";
import { setAuth } from "../redux/features/authSlice";
import { IoMdLogOut } from "react-icons/io";

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
      <div className="sidebar w-16 bg-zinc-800 flex flex-row justify-center">
        <div
          onClick={handleLogout}
          className="mt-auto logout text-xl p-2 rounded cursor-pointer text-red-500 hover:bg-[#ffffff15] active:bg-[#ffffff30] "
        >
          <IoMdLogOut />
        </div>
      </div>
      <div
        className={`${
          isNavOpen ? "w-80 opacity-100" : "w-0 opacity-0"
        } main_header capitalize z-50 bg-secondary h-screen overflow-hidden transition-all ease-out duration-200 text-nowrap select-none`}
      >
        <ChatList />
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
