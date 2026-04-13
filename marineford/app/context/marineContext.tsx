"use client";

import React, { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';

export interface Incident {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  risk_level: number;
  status: 'กำลังดำเนินการ' | 'รอดำเนินการ' | 'เสร็จสิ้น';
  responsible_unit: string;
  vdo_url: string;
  created_at: string;
  updated_at: string;
}


export interface UserData {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string;
    phone: string;
    confirmed_at: string;
    last_sign_in_at: string;
    app_metadata: {
      provider: string;
      providers: string[];
    };
    user_metadata: {
      email_verified: boolean;
      username: string;
    };
    identities: {
      identity_id: string;
      id: string;
      user_id: string;
      identity_data: {
        email: string;
        email_verified: boolean;
        phone_verified: boolean;
        sub: string;
      };
      provider: string;
      last_sign_in_at: string;
      created_at: string;
      updated_at: string;
      email: string;
    }[];
    created_at: string;
    updated_at: string;
    is_anonymous: boolean;
  };
  weak_password: null | string;
}


// Define the shape of the Context
interface MarineContextType {
  useIncident: Incident[];          // currently displayed (possibly filtered)
  setIncident: Dispatch<SetStateAction<Incident[]>>;
  allIncidents: Incident[];         // full unfiltered master list
  userData: UserData | null;        // logged-in user data
  setUserData: Dispatch<SetStateAction<UserData | null>>;
}


export const MarineContext = createContext<MarineContextType | undefined>(undefined);

// Safe hook — throws a clear error if used outside <MarineContextProvider>
export const useMarineContext = (): MarineContextType => {
  const ctx = React.useContext(MarineContext);
  if (!ctx) throw new Error("useMarineContext must be used inside <MarineContextProvider>");
  return ctx;
};

interface Props {
  children: ReactNode;
}

export const MarineContextProvider = ({ children }: Props) => {
  const [useIncident, setIncident] = useState<Incident[]>([]);
  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);

  const value: MarineContextType = {
    useIncident, setIncident, allIncidents, userData, setUserData
  };

  const Get_Incident = async () => {
    try {
      const res = await fetch('/api/Incident', {
        method: 'GET',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        console.log("Fetch Incident Success:", json.data);
        setIncident(json.data);
        setAllIncidents(json.data);  // keep master copy for filtering
      } else {
        console.log("Fetch Incident failed:", json);
        setIncident([]);
        setAllIncidents([]);
      }
    } catch (error) {
      console.log("Fail to Fetch Incidents:", error);
    }
  };

  useEffect(() => {
    Get_Incident();
  }, []);

  return (
    <MarineContext.Provider value={value}>
      {children}
    </MarineContext.Provider>
  );
};