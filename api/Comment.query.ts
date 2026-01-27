import { supabase } from '@/lib/data';
import { CommentRowType } from '@/types/type';

export const commentKeys = {
    comments: (movieCd?: string) => ['comments', movieCd] as const,
}

export class CommentQuery {
    static async fetchComments(movieCd: string): Promise<CommentRowType[]>{
        const { data, error } = await supabase
          .from('comments')
          .select('id, user_id, content, created_at, profiles(nickname)')
          .eq('movie_id', movieCd)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return (data ?? []) as CommentRowType[];
    }
}