"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/data";

export function useLoginCheck() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (!error && data?.user) {
                setUser(data.user);
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        fetchUser();

        // ✅ Supabase의 인증 상태 변화 감지 (로그인/로그아웃 자동 반영)
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return { user, loading };
}
