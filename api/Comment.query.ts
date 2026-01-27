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

    static async getLikesByIds(ids: number[]){
        if (ids.length === 0) return [];
        const { data, error } = await supabase
          .from('likes')
          .select('comment_id') // 최소 컬럼
          .in('comment_id', ids);
        
        if (error) throw error;
        return data ?? [];
    }

    static async getMyLikesByCommentIds(userId: string, ids: number[]) {
    if (ids.length === 0) return [];
    const { data, error } = await supabase
      .from('likes')
      .select('comment_id')
      .eq('user_id', userId)
      .in('comment_id', ids);

    if (error) throw error;
    return data ?? [];
  }
}