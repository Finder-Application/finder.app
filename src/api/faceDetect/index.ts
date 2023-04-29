import {Asset} from 'react-native-image-picker';
import {useMutation} from 'react-query';
import {client} from 'api/client';
import {Descriptor} from 'api/types.common';

interface FaceDetectionResponse {
  data: Descriptor[];
}

const detectImages = async (assets: Asset[]) => {
  const requestData = new FormData();

  assets?.forEach(asset => {
    requestData.append('files', {
      uri: asset.uri,
      name: asset.fileName,
      type: asset.type,
    });
  });

  const {data}: {data: FaceDetectionResponse} = await client.post(
    '/face-api/detect',
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

export const useFaceApi = () => {
  const mutation = useMutation((assets: Asset[]) => detectImages(assets));
  return mutation;
};
