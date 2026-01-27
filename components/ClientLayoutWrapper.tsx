'use client'

import type { ReactNode } from "react";
import { RecoilRoot } from "recoil";
import ReactQueryProvider from "./provider/ReactQueryProvider";

export default function ClientLayoutWrapper({ children } : {children : ReactNode}) {
  return (
    <ReactQueryProvider>
      <RecoilRoot>
        {children}
      </RecoilRoot>
    </ReactQueryProvider>
)
}
