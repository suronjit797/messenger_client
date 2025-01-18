/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { gql } from "../../__generated__";
import { useQuery } from "@apollo/client";
import { Spin } from "antd";

interface AuthProps {
  children: ReactNode;
  roles?: string[];
}

const GET_PROFILE_QUERY = gql(`
  query GetProfileStarter {
    profile {
      _id
      name
      email
      role
    }
  }
`);
const Auth: React.FC<AuthProps> = ({ children, roles = [] }) => {
  // redux
  const dispatch = useAppDispatch();
  const { isLogin, user } = useAppSelector((state) => state.auth);
  
  // hooks

  // gql
  const { loading, data } = useQuery(GET_PROFILE_QUERY);

  useEffect(() => {
    if (data?.profile && Object.keys(data?.profile)) {
      dispatch(setUser(data.profile));
    }
  }, [data]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isLogin) {
      navigate("/login");
    }
  }, [isLogin, loading]);

  useEffect(() => {
    if (isLogin && Array.isArray(roles) && roles.length > 0) {
      const hasAccess = [...roles, "superAdmin"];
      if (!hasAccess.includes(user?.role)) {
        navigate(-1);
      }
    }
  }, [roles, isLogin]);





  if (loading) {
    return (
      <Spin spinning={loading} size="large">
        <div className="h-screen"></div>
      </Spin>
    );
  } else if (!loading && isLogin) {
    return <>{children}</>;
  } else {
    return "";
  }
};

export default Auth;
