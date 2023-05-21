import {useInfiniteQuery, useMutation, useQuery} from 'react-query';
import {client, privateClient} from 'api/client';
import {FEATURE} from 'api/constants';
import {FaceDescriptor, IParamsDefault, TResponseList} from 'api/types.common';

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
  return privateClient.post(baseUrl, {
    ...body,
  });
};

export const useCreatePost = () => {
  const mutation = useMutation(['CREATE_POST'], (body: CreatePostBody) =>
    createPost(body),
  );
  return mutation;
};

const updatePost = async (params: UpdatePostParams) => {
  const {id, body} = params;
  const baseUrl = `/api/private/posts/${id}`;
  return privateClient.put(baseUrl, {
    ...body,
  });
};

export const useUpdatePost = () => {
  const mutation = useMutation((params: UpdatePostParams) =>
    updatePost(params),
  );
  return mutation;
};

export const useRelevantPosts = (params: {id: number}) =>
  useQuery(['GET_RELEVANT_POSTS', params.id], async () => {
    const {data}: {data: Post[]} = await privateClient.get(
      `/api/private/posts/relevant/${params.id}`,
    );
    return data;
  });

export const useDeletePost = () =>
  useMutation(['DELETE_POST'], async (params: {id: number}) => {
    const data = await privateClient.delete(`/api/private/posts/${params.id}`);
    return data;
  });
