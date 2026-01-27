export type ToggleLikeReq = {
  userId: string;
  commentId: number;
  hasLiked: boolean;
};