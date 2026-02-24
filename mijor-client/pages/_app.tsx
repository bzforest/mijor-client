import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto_Condensed } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/contexts/LocationContext";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans", 
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <LocationProvider>
        <div className={`${robotoCondensed.variable} font-sans`}>
          <Component {...pageProps} />
        </div>
      </LocationProvider>
    </AuthProvider>
  );
}
