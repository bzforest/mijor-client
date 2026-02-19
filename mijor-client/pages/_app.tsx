import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto_Condensed } from "next/font/google";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto-condensed",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={robotoCondensed.variable}>
      <Component {...pageProps} />
    </div>
  );
}
