'use client'

import { RecoilRoot } from "recoil";

export default function ClientLayoutWrapper({ children }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
