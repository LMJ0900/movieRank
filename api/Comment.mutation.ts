import { supabase } from "@/lib/data";
import { CommentRowType } from "@/types/type";
import { UserQuery } from "./User.query";

type Params = {
    movieCd: string;
    userId: string;
    content: string;
}

export class CommentMutation {
    static async addComment(params : Params) {
       const { movieCd, userId, content } = params;
       const newComment = content.trim();
       if (!newComment) throw new Error('빈 댓글입니다.');

       const { data, error } = await supabase
             .from("comments")
             .insert([{ movie_id: movieCd, user_id: userId, content: newComment }])
             .select("id, user_id, content, created_at"); 

             if (error) throw error;
             if (!data?.[0]) throw new Error('댓글 생성 결과가 없습니다.');
      
        const nickname = await UserQuery.fetchNickname(userId);

        if (!nickname) throw new Error('프로필을 불러올 수 없습니다.');

        const newCommentData: CommentRowType = {
            ...(data[0]),
            profiles: { nickname: nickname },
        };

        return newCommentData
    }
}