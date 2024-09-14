import React, { createContext, useState, ReactNode, useContext } from "react";

interface Researcher {
  email: string;
  password?: string; // Password is optional here as we might not need it after login
}

interface UserContextType {
  user: Researcher | null;
  setUser: React.Dispatch<React.SetStateAction<Researcher | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Researcher | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
