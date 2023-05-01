import {useInfiniteQuery, useMutation, useQuery} from 'react-query';
import {client} from 'api/client';
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
    ['FETCH_POSTS', params],
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

const tempToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRydW5namFtaW5sZUBnbWFpbC5jb20iLCJ1dWlkIjoiN2VlOGM2OTEtNjhlNC0xMWVkLWJlZjEtNDUxYjVmMTRhOGRjIiwidXNlcklkIjoxNCwibGFzdE5hbWUiOiJ0cnVuZ2phbWlubGUiLCJpYXQiOjE2ODI3ODI4MDZ9.iZV1owKNwbIKE9mgmOJlExplf4dopE8BIEkjWYOl2NL6g_APxatV3t93rnPytPSfg9S5_HbV-sd0FhhTGOFD_f_YMvYRkwxEkXJtsRqXQoRdOdxw4TQPhInXHGh1K9SJ6i8BPZsatCx-rsALEvvl3oDE3XLAE8Q6V3Dtj3S0ulvvnr2P1Qqtvppd3qnppo_r1IMh0ljCIhWnzcgVI4T1YUudfUw87y4yLzSMYD5m03Nk5gbHEfgAxD8ET_tYYrR6YxYcnHLReWbYRy-UxweLRoB96NYOqzz_F62L6CmVPRIUHHDqiSb4LQgvV0_pF4DePKsdxdDhr5EiapZ8R8vycgAaq4jPMyXAAqaHMrngN1H0jVjHkLight7auSB-kMzLa3eZw5ZUjSLWdq0cWu039PFVPuMopEYt9CeCvHC56Q6vd2Nhi8MBxshMEFhvJ5TRyqAaukCSv92AqGO1JcdtFYrf3GQD6nYHPBTPRzPos_VG-HY0INdVc7Is_4NBqg6HNhlYhzhT6kqehd2XwSWNodC6EEKLBaOs63SL0cy3rhiCtvHU0aWfKlwwUcAd2I4K1ofHkIZYs-B698vU-mU27ZESB18Qyog02CRnLtwukosDjBkxZ91iTLzg7W0dAan2o3rk5-K8YOdnN4HWAslGdGY-8ShWPssfrZoFyydjt0Y';
const createPost = async (body: CreatePostBody) => {
  const baseUrl = '/api/private/posts';
  return client.post(
    baseUrl,
    {
      ...body,
    },
    {headers: {Authorization: `Bearer ${tempToken}`}},
  );
};

export const useCreatePost = () => {
  const mutation = useMutation((body: CreatePostBody) => createPost(body));
  return mutation;
};
