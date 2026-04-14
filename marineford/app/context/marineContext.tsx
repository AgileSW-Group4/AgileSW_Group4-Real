"use client";

import React, { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';


interface Incident {
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

// Define the shape of the Context
interface MarineContextType {
  useIncident: Incident[];
  setIncident: Dispatch<SetStateAction<Incident[]>>;
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

  const value: MarineContextType = {
    useIncident, setIncident
  };

  const Get_Incident = async () => {
    try {
      const res = await fetch('/api/getIncident', {
        method: 'GET',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        // ✅ log อยู่หลัง setIncident แล้ว ข้อมูลจะถูกต้อง
        console.log("Fetch Incident Success:", json.data);
        setIncident(json.data);
      } else {
        console.log("Fetch Incident failed:", json);
        setIncident([]);
      }
    } catch (error) {
      console.log("Fail to Fetch Incidents:", error);
    }
  };

  useEffect(() => {
    Get_Incident();
    // ✅ ลบ console.log(useIncident) ออก เพราะจะแสดงค่า [] เสมอก่อน state จะ update
  }, []);


  return (
    <MarineContext.Provider value={value}>
      {children}
    </MarineContext.Provider>
  );
};
