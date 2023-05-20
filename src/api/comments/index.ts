import {useInfiniteQuery, useMutation, useQuery} from 'react-query';
import {queryClient} from 'api/APIProvider';
import {client} from 'api/client';
import {FEATURE, QUERY_KEY} from 'api/constants';
import {
  IParamsDefault,
  ResponseDeleteSuccess,
  TResponseList,
} from 'api/types.common';
import {getToken} from 'core/Auth/utils';

import {
  Comment,
  CreateComment,
  CreateSubComment,
  ResponseCreateComment,
} from './types';

const getListComment = async <T, P>(
  params: P | IParamsDefault<{}>,
  feature: FEATURE,
  isPublic?: boolean,
): Promise<TResponseList<T>> => {
  const baseUrl = `/api/${isPublic ? 'public' : 'private'}/${feature}`;
  params = params as IParamsDefault<{}>;
  const {optionKey, q: query} = params;
  const {data} = await client.get(baseUrl, {
    params: {
      ...params,
      filter: JSON.stringify(params.filter),
      order:
        params.order && `${params.order?.field}:${params.order?.direction}`,
      q: query,
      ...optionKey,
    },
  });

  return data;
};

export const useGetComments = (
  params: IParamsDefault<Comment>,
  onSuccess: (data: any) => void,
) => {
  return useInfiniteQuery(
    [QUERY_KEY.PAGINATION_COMMENTS, params],
    async ({pageParam = 1}) => {
      const result = await getListComment<Comment, typeof params>(
        {...params, page: pageParam},
        FEATURE.COMMENT,
        true,
      );
      return result;
    },
    {
      getNextPageParam: lastPage => {
        return lastPage.meta?.hasNextPage ? lastPage.meta.page + 1 : undefined;
      },
      onSuccess,
    },
  );
};

const createComment = async (
  body: CreateComment | CreateSubComment,
): Promise<ResponseCreateComment> => {
  const baseUrl = '/api/private/comments';
  return client.post(
    baseUrl,
    {
      ...body,
    },
    {headers: {Authorization: `Bearer ${getToken()?.access}`}},
  );
};

const deleteItem = (itemId: number): Promise<ResponseDeleteSuccess> => {
  const baseUrl = `/api/private/comments/${itemId}`;
  return client.delete(baseUrl);
};

export const useCreateComment = () => {
  const mutation = useMutation(
    ['CREATE_COMMENT'],
    (body: CreateComment) => createComment(body),
    {
      onSuccess: async (_, variable) => {
        queryClient.invalidateQueries([QUERY_KEY.PAGINATION_COMMENTS]);

        queryClient.invalidateQueries(['COUNT_COMMENT' + variable?.postId]);
      },
    },
  );
  return mutation;
};

export const useCreateSubComment = () => {
  const mutation = useMutation(
    ['CREATE_SUB_COMMENT'],
    (body: CreateSubComment) => createComment(body),
    {
      onSuccess: async (_, variable) => {
        queryClient.invalidateQueries([QUERY_KEY.PAGINATION_COMMENTS]);

        queryClient.invalidateQueries(['COUNT_COMMENT' + variable.postId]);
      },
    },
  );
  return mutation;
};

export const useDeleteComment = () => {
  const mutation = useMutation((body: {id: number}) => deleteItem(body.id));
  return mutation;
};

const getTotalComment = async (postId: number) => {
  const baseUrl = `/api/public/comments/count?id=${postId}`;
  const {data} = await client.get(baseUrl);
  return data?.total || 0;
};

export const useCountTotalComment = (postId: number) =>
  useQuery('COUNT_COMMENT' + postId, () => getTotalComment(postId));
