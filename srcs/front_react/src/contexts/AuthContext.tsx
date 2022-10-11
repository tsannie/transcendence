import React from "react";

export type User = {
  id: number;
  username: string;
  email: string;
  enabled2FA: boolean;
}

export type AuthContextType = {
  isLogin: boolean;
  user: User | null;
  setUser: (user: User) => void;
  login: (user: User) => void;
  logout: () => void;
  //monitoringSocket: WebSocket | null;
}

export const AuthContext = React.createContext<Partial<AuthContextType>>({});

interface IProps {
  children: JSX.Element | JSX.Element[];
}

export const AuthProvider = ({ children }: IProps) => {

  const [user, setUser] = React.useState<User | null>(null);
  const [isLogin, setIsLogin] = React.useState(false);


  const login = (user: User) => {
    setIsLogin(true);
    if (!user)
      setUser(user);
  }

  const logout = () => {
    setIsLogin(false);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ isLogin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

}
