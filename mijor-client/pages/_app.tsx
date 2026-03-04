import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto_Condensed } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocationProvider } from "@/contexts/LocationContext";
import Chatbot from "@/components/common/Chatbot";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
  display: "swap",
});

import Navbar from "@/components/common/navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <LocationProvider>
        <div className={`${robotoCondensed.variable} font-sans`}>
          <Navbar />
          <Component {...pageProps} />
          <Chatbot />
        </div>
      </LocationProvider>
    </AuthProvider>
  );
}
