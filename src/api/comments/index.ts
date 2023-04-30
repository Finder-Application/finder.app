import {useInfiniteQuery, useMutation} from 'react-query';
import {queryClient} from 'api/APIProvider';
import {client} from 'api/client';
import {FEATURE, QUERY_KEY} from 'api/constants';
import {
  IParamsDefault,
  ResponseDeleteSuccess,
  TResponseList,
} from 'api/types.common';

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

const tempToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRydW5namFtaW5sZUBnbWFpbC5jb20iLCJ1dWlkIjoiN2VlOGM2OTEtNjhlNC0xMWVkLWJlZjEtNDUxYjVmMTRhOGRjIiwidXNlcklkIjoxNCwibGFzdE5hbWUiOiJ0cnVuZ2phbWlubGUiLCJpYXQiOjE2ODI3ODI4MDZ9.iZV1owKNwbIKE9mgmOJlExplf4dopE8BIEkjWYOl2NL6g_APxatV3t93rnPytPSfg9S5_HbV-sd0FhhTGOFD_f_YMvYRkwxEkXJtsRqXQoRdOdxw4TQPhInXHGh1K9SJ6i8BPZsatCx-rsALEvvl3oDE3XLAE8Q6V3Dtj3S0ulvvnr2P1Qqtvppd3qnppo_r1IMh0ljCIhWnzcgVI4T1YUudfUw87y4yLzSMYD5m03Nk5gbHEfgAxD8ET_tYYrR6YxYcnHLReWbYRy-UxweLRoB96NYOqzz_F62L6CmVPRIUHHDqiSb4LQgvV0_pF4DePKsdxdDhr5EiapZ8R8vycgAaq4jPMyXAAqaHMrngN1H0jVjHkLight7auSB-kMzLa3eZw5ZUjSLWdq0cWu039PFVPuMopEYt9CeCvHC56Q6vd2Nhi8MBxshMEFhvJ5TRyqAaukCSv92AqGO1JcdtFYrf3GQD6nYHPBTPRzPos_VG-HY0INdVc7Is_4NBqg6HNhlYhzhT6kqehd2XwSWNodC6EEKLBaOs63SL0cy3rhiCtvHU0aWfKlwwUcAd2I4K1ofHkIZYs-B698vU-mU27ZESB18Qyog02CRnLtwukosDjBkxZ91iTLzg7W0dAan2o3rk5-K8YOdnN4HWAslGdGY-8ShWPssfrZoFyydjt0Y';
const createComment = async (
  body: CreateComment | CreateSubComment,
): Promise<ResponseCreateComment> => {
  const baseUrl = '/api/private/comments';
  return client.post(
    baseUrl,
    {
      ...body,
    },
    {headers: {Authorization: `Bearer ${tempToken}`}},
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
      onSuccess: async () => {
        queryClient.invalidateQueries([QUERY_KEY.PAGINATION_COMMENTS]);
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
      onSuccess: async () => {
        queryClient.invalidateQueries([QUERY_KEY.PAGINATION_COMMENTS]);
      },
    },
  );
  return mutation;
};

export const useDeleteComment = () => {
  const mutation = useMutation((body: {id: number}) => deleteItem(body.id));
  return mutation;
};
