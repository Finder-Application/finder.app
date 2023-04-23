import {ImagePickerResponse} from 'react-native-image-picker';
import {useMutation} from 'react-query';
import {client} from 'api/client';

export interface NetWorkImageServiceResponse {
  images: string[];
}

const getNetworkImageUrls = async (result: ImagePickerResponse) => {
  const requestData = new FormData();

  result.assets?.forEach(asset => {
    requestData.append('files', {
      uri: asset.uri,
      name: asset.fileName,
      type: asset.type,
    });
  });

  const {data}: {data: NetWorkImageServiceResponse} = await client.post(
    '/api/public/util/upload-multiple',
    requestData,
    {
      headers: {
        'content-type': 'multipart/form-data',
        Accept: 'application/json',
      },
    },
  );

  return data;
};

export const useCreateNetworkImageUrl = () => {
  const mutation = useMutation((result: ImagePickerResponse) =>
    getNetworkImageUrls(result),
  );
  return mutation;
};
