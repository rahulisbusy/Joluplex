import { createContext } from "react";

export interface User {
  id?: number;
  name: string;
  email: string | null;
  image?: string;
}


interface AuthContextType {
  user: User | undefined;
  setuser: (user: User | undefined) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  setuser: () => {},
  logout: async () => {},
});
