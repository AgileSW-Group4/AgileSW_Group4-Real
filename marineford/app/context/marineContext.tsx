import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// 1. Define interfaces for your data structures
// Customize these based on your actual data
interface Wallet {
  id: string;
  balance: number;
}

interface Payment {
  id: string;
  amount: number;
}

interface Category {
  id: string;
  name: string;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
}

// 2. Define the shape of the Context
interface MarineContextType {
  user_Wallet: Wallet[];
  setUserWallet: Dispatch<SetStateAction<Wallet[]>>;
  userPaymet: Payment[];

}


export const MarineContext = createContext<MarineContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const MarineContextProvider = ({ children }: Props) => {
  const [user_Wallet, setUserWallet] = useState<Wallet[]>([]);
  const [userPaymet, setUserPaymet] = useState<Payment[]>([]);


  // 4. Wrap the state and setters in the value object
  const value: MarineContextType = {
    user_Wallet,
    setUserWallet,
    userPaymet,
  };

  return (
    <MarineContext.Provider value={value}>
      {children}
    </MarineContext.Provider>
  );
};