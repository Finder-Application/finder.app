import {useInfiniteQuery, useMutation, useQuery} from 'react-query';
import {client} from 'api/client';
import {FEATURE} from 'api/constants';
import {FaceDescriptor, IParamsDefault, TResponseList} from 'api/types.common';
import {getToken} from 'core/Auth/utils';

import {Address, Post, PostEntity} from './types';

const getList = async <T, P>(
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

export const useFetchingPosts = (params: IParamsDefault<PostEntity>) => {
  return useInfiniteQuery(
    ['FETCH_POSTS', JSON.stringify(params)],
    async ({pageParam = 1}) => {
      const result = await getList<Post, typeof params>(
        {...params, page: pageParam},
        FEATURE.POST,
        true,
      );
      return result;
    },
    {
      getNextPageParam: lastPage => {
        return lastPage?.meta?.hasNextPage
          ? lastPage?.meta?.page + 1
          : undefined;
      },
    },
  );
};

export const useGetPostDetail = (id?: number) => {
  return useQuery(
    ['GET_POST_DETAIL', id],

    {
      enabled: !!id && id !== -1,
      queryFn: async (): Promise<Post> =>
        (await client.get<Post>(`/api/public/posts/${id}`)).data,
    },
  );
};

export interface CreatePostBody {
  title: string;
  fullName: string;
  nickname: string;
  dateOfBirth: Date;
  gender: boolean;
  missingAddress: Address;
  hometown: Address;
  missingTime: Date;
  photos: string[];
  description: string;
  descriptors: FaceDescriptor[];
}

export interface UpdatePostParams {
  id: string;
  body: CreatePostBody;
}

const createPost = async (body: CreatePostBody) => {
  const baseUrl = '/api/private/posts';
  return client.post(
    baseUrl,
    {
      ...body,
    },
    {headers: {Authorization: `Bearer ${getToken()?.access}`}},
  );
};

export const useCreatePost = () => {
  const mutation = useMutation((body: CreatePostBody) => createPost(body));
  return mutation;
};

const updatePost = async (params: UpdatePostParams) => {
  const {id, body} = params;
  const baseUrl = `/api/private/posts/${id}`;
  return client.put(
    baseUrl,
    {
      ...body,
    },
    {headers: {Authorization: `Bearer ${getToken()?.access}`}},
  );
};

export const useUpdatePost = () => {
  const mutation = useMutation((params: UpdatePostParams) =>
    updatePost(params),
  );
  return mutation;
};
