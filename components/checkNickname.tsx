import { supabase } from "@/lib/data";

// ✅ 닉네임 중복 체크 함수
export const checkNickname = async (nickname:string) => {
    const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("nickname", nickname);

    if (error) {
        console.error("닉네임 중복 체크 오류:", error);
        return true;
    }

    return data.length > 0; // 닉네임이 존재하면 true 반환
};