export enum FEATURE {
  POST = 'posts',
  COMMENT = 'comments',
  POST_NOTIS = 'notification/posts',
  COMMENT_NOTIS = 'notification/comments',
  USER = 'users',
}

export enum QUERY_KEY {
  PAGINATION_COMMENTS = 'paginationComments',
  PAGINATION_POSTS = 'paginationPosts',
  PAGINATION_POST_NOTIS = 'paginationPostNotis',
  PAGINATION_CMT_NOTIS = 'paginationCmtNotis',
  COUNT_COMMENT = 'countComment',
}
