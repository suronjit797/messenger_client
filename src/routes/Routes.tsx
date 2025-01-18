import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import NotFound from "../pages/NotFound/NotFound";
import Home from "../pages/Home/Home";
import Auth from "../components/Auth/Auth";
import UserList from "../pages/User/UserList";
import Chat from "../pages/Chat/Chat";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <Auth>
        <MainLayout />
      </Auth>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },

      // admin
      {
        path: "/user",
        element: (
          //! is user match his role
          <Auth roles={["admin"]}>
            <UserList />
          </Auth>
        ),
      },

      {
        path: "/chat/:userId",
        element: <Chat />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "*",
    element: <NotFound />,
  },
]);
