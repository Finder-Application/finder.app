import {useInfiniteQuery, useMutation, useQuery} from 'react-query';
import {queryClient} from 'api/APIProvider';
import {client, privateClient} from 'api/client';
import {FEATURE, QUERY_KEY} from 'api/constants';
import {IParamsDefault, TResponseList} from 'api/types.common';
import {getToken} from 'core/Auth/utils';

import {PostNotis} from './types';

const getListNotiPosts = async <T, P>(
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
    headers: {Authorization: `Bearer ${getToken()?.access}`},
  });

  return data;
};

export const useGetListNotiPosts = (params: IParamsDefault<PostNotis>) => {
  return useInfiniteQuery(
    ['FETCH_NOTI_POSTS', params],
    async ({pageParam = 1}) => {
      const result = await getListNotiPosts<PostNotis, typeof params>(
        {...params, page: pageParam},
        FEATURE.POST_NOTIS,
        false,
      );
      return result;
    },
    {
      getNextPageParam: lastPage => {
        return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined;
      },
    },
  );
};

export const useGetListNotiComment = (params: IParamsDefault<PostNotis>) => {
  return useInfiniteQuery(
    ['FETCH_NOTI_COMMENTS', params],
    async ({pageParam = 1}) => {
      const result = await getListNotiPosts<PostNotis, typeof params>(
        {...params, page: pageParam},
        FEATURE.COMMENT_NOTIS,
        false,
      );
      return result;
    },
    {
      getNextPageParam: lastPage => {
        return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined;
      },
    },
  );
};

export const useGetTotalNoti = () => {
  return useQuery(
    [QUERY_KEY.COUNT_COMMENT],
    async () => {
      const count = await client.get('/api/private/notification/count-noti', {
        headers: {Authorization: `Bearer ${getToken()?.access}`},
      });

      return count?.data?.count;
    },
    {
      refetchInterval: 10000,
    },
  );
};

const installFcm = async (body: {token: string}) => {
  const baseUrl = '/api/private/notification/install-fcm';
  return privateClient.post(baseUrl, {
    ...body,
  });
};

export const useCreateInstallation = () => {
  const mutation = useMutation((body: {token: string}) => installFcm(body), {
    onSuccess: () => {
      console.log(':) : useCreateInstallation -> onSuccess');
    },
    onError: e => {
      console.log(':) : useCreateInstallation -> onError', e);
    },
  });
  return mutation;
};

const seenNoti = async (body: {id: number; type: string}) => {
  const baseUrl = '/api/private/notification/seen-notification';
  return privateClient.post(baseUrl, {
    ...body,
  });
};

export const useSeenNoti = () => {
  const mutation = useMutation(
    (body: {id: number; type: string}) => seenNoti(body),
    {
      onSuccess: (_, {type}) => {
        if (type === 'comment') {
          queryClient.invalidateQueries(['FETCH_NOTI_COMMENTS']);
        } else {
          queryClient.invalidateQueries(['FETCH_NOTI_POSTS']);
        }
      },
    },
  );
  return mutation;
};
