import "@/styles/globals.css";
import { useRouter } from "next/router";
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
  const router = useRouter();

    const hiddenChatbotRoutes = ["/login", "/register", "/forgot-password", "/update-password"];
    const shouldShowChatbot = !hiddenChatbotRoutes.includes(router.pathname);
    
  return (
    <AuthProvider>
      <LocationProvider>
        <div className={`${robotoCondensed.variable} font-sans`}>
          <Navbar />
          <Component {...pageProps} />
          {shouldShowChatbot && <Chatbot />}
        </div>
      </LocationProvider>
    </AuthProvider>
  );
}
