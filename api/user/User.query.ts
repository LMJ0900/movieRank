import { supabase } from "@/lib/data";

export class UserQuery {
  static async fetchNickname(userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data?.nickname ?? null;
  }
}