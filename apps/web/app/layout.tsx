"use client"
import "@ui/styles/globals.css";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { Toaster } from "react-hot-toast"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <RecoilRoot>
      {children}
      <Toaster  position="bottom-right"
  reverseOrder={false}></Toaster>
  </RecoilRoot>
      </body>
    </html>
  );
}