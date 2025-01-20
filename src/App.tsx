import { RouterProvider } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import { routes } from "./routes/Routes";
import Swal from "sweetalert2";
import { Bounce, ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { io } from "socket.io-client";
import { setSocket } from "./redux/features/socketSlice";
import { ApolloProvider } from "@apollo/client";
import { gqlClient } from "./graphql.js";

// antd theming
const customDarkTheme = {
  token: {
    colorBgBase: "#2c2c2c",
    colorTextBase: "#f7f7f7",
    colorWarning: "#ffc107",
    colorError: "#dc3545",
    colorSuccess: "#198754",
    colorPrimary: "#0d6efd",
    colorPrimaryHover: "#0c60d0",
    colorBgDisabled: "#4b93fd",
    colorInfo: "#0dcaf0",
    wireframe: false,
    fontSize: 16,
    sizeStep: 5,
  },
  algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
};

function App() {
  const dispatch = useAppDispatch();
  const { socket } = useAppSelector((state) => state.socket);
  const { isLogin, token } = useAppSelector((state) => state.auth);
  // hooks
  // useSocket();
  useEffect(() => {
    if (isLogin) {
      const newSocket = io(import.meta.env.VITE_API_BASE_URL, {
        auth: { token },
        transports: ["websocket"],
      });

      dispatch(setSocket(newSocket));

      return () => {
        newSocket.disconnect();
        dispatch(setSocket(null));
      };
    } else {
      if (socket) {
        socket.disconnect();
        dispatch(setSocket(null));
      }
    }
  }, [isLogin, token]);

  // net error
  useEffect(() => {
    if (!navigator.onLine) {
      Swal.fire({
        icon: "error",
        title: "No Internet Connection!",
        text: "Please make sure your internet connection on and try again",
        confirmButtonText: "Try again",
      }).then(async (result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    }
  }, []);

  return (
    <>
      <ApolloProvider client={gqlClient}>
        <ConfigProvider theme={customDarkTheme}>
          <div className="">
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              transition={Bounce}
            />
            <RouterProvider router={routes}></RouterProvider>
          </div>
        </ConfigProvider>
      </ApolloProvider>
    </>
  );
}

export default App;
