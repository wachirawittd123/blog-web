import ToastProvider from "@/components/ToastProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "../tailwind.config"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastProvider />
      <Component {...pageProps} />
    </>
  );
}
