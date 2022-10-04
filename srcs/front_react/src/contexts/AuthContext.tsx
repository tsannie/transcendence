import React from "react";

export type User = {
  id: number;
  username: string;
  email: string;
  isTwoFactor: boolean;
}

export type AuthContextType = {
  isLogin: boolean;
  user: User | null;
  setUser: (user: User) => void;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = React.createContext<Partial<AuthContextType>>({});

interface IProps {
  children: JSX.Element | JSX.Element[];
}

export const AuthProvider: React.FC<IProps> = ({ children }: IProps) => {

  const [user, setUser] = React.useState<User | null>(null);
  const [isLogin, setIsLogin] = React.useState(false);


  const login = (user: User) => {
    setIsLogin(true);
    setUser(user);
  }

  const logout = () => {
    setIsLogin(false);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ isLogin, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

}
