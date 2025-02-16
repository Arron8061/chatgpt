import AppContextProvider from "@/components/AppContext";
import EventBusContextProvider from "@/components/EventBusContext";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "棠 依 云",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppContextProvider>
          <EventBusContextProvider>{children}</EventBusContextProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}
