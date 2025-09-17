'use client'

import type { ReactNode } from "react";
import { RecoilRoot } from "recoil";

export default function ClientLayoutWrapper({ children } : {children : ReactNode}) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
