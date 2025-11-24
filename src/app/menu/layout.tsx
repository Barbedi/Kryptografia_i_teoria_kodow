import RightDashboard from "./components/dahsbord";
import React from "react";
import { LogProvider } from "./context/Log";


export default function MenuLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LogProvider>
      {children}
      <RightDashboard /> 
      </LogProvider>
    </>
  );
}