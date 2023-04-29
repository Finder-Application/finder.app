import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {useFaceApi} from 'api/faceDetect';
import {Descriptor} from 'api/types.common';
import {AxiosError} from 'axios';
import {useAppStore} from 'core/App';
import uniqBy from 'lodash/uniqBy';
import {
  CloseIcon,
  Image,
  PlusIcon,
  Text,
  theme,
  TickIcon,
  Touchable,
  useTheme,
  View,
} from 'ui';

type ImagePickerSectionProps = {
  postImageSource: {
    files: Asset[];
    descriptors: Descriptor[];
  };
  onSelectPostImageResource: (
    files: Asset[],
    descriptors: Descriptor[],
  ) => void;
};

export const ImagePickerSection = (props: ImagePickerSectionProps) => {
  const {postImageSource, onSelectPostImageResource} = props;

  const {colors} = useTheme();

  const setShowLoadingModal = useAppStore(state => state.setShowLoadingModal);
  const faceDetect = useFaceApi();

  const onPickImages = useCallback(async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0,
        includeBase64: true,
      });

      const currentLength = postImageSource?.files?.length ?? 0;
      const newLength = result.assets?.length ?? 0;

      const assets = uniqBy(result.assets, asset => asset.base64);

      if (currentLength + newLength > 5 || newLength > 5) {
        showMessage({
          message: 'Maximum number of files is 5',
          type: 'danger',
        });
      } else {
        setShowLoadingModal(true);

        await faceDetect
          .mutateAsync(assets)
          .then(value => {
            const descriptors = value.data;
            onSelectPostImageResource(
              [...postImageSource.files, ...assets],
              [...postImageSource.descriptors, ...descriptors],
            );
          })
          .catch((error: AxiosError) => {
            const message = (error.response?.data as any).message;
            showMessage({message: message, type: 'danger'});
          })
          .finally(() => {
            setShowLoadingModal(false);
          });
      }
    } catch (error) {
      console.log('onPickImages error: ', error);
      setShowLoadingModal(false);
    }
  }, [postImageSource]);

  const onRemoveImage = useCallback(
    (removedIndex: number) => {
      const files = postImageSource.files?.filter(
        (_, index) => index !== removedIndex,
      );
      const descriptors = postImageSource.descriptors?.filter(
        (_, index) => index !== removedIndex,
      );
      onSelectPostImageResource(files, descriptors);
    },
    [postImageSource],
  );

  return (
    <View padding="m" alignItems="flex-start">
      <Text fontWeight="700" fontSize={16} marginBottom="s">
        Missing Person’s face images
      </Text>

      <View flexDirection="row" flex={1}>
        <Touchable
          justifyContent="center"
          alignItems="center"
          backgroundColor="grey15"
          paddingHorizontal="l"
          paddingVertical="xl"
          onPress={onPickImages}>
          <PlusIcon />
          <Text color="grey14" marginTop="s">
            Upload Image
          </Text>
        </Touchable>
        <View marginLeft="m" flex={1}>
          <View flexDirection="row" alignItems="flex-start" flex={1}>
            <View paddingTop="xs">
              <TickIcon />
            </View>
            <Text fontSize={11} marginLeft="xs" color="grey16">
              The pictures should cover only the face of the missing person
            </Text>
          </View>
          <View flexDirection="row" alignItems="flex-start" flex={1}>
            <View paddingTop="xs">
              <TickIcon />
            </View>
            <Text fontSize={11} marginLeft="xs" color="grey16">
              Would be better if make the face centered
            </Text>
          </View>
          <View flexDirection="row" alignItems="flex-start" flex={1}>
            <View paddingTop="xs">
              <CloseIcon color={colors.red1} />
            </View>
            <Text fontSize={11} marginLeft="xs" color="grey16">
              Don’t use the pictures in which having 2 of faces and over
            </Text>
          </View>
        </View>
      </View>
      <View
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        flex={1}
        marginBottom="m">
        <View flex={1}>
          <Text fontStyle="italic">Maximum uploaded image is 5</Text>
        </View>
        {postImageSource?.files && (
          <Text fontStyle="italic">
            Current: {postImageSource?.files.length}
          </Text>
        )}
      </View>
      <View flexDirection="row" flexWrap="wrap">
        {postImageSource?.files &&
          postImageSource?.files?.map((asset: Asset, index) => (
            <View key={asset.uri} style={styles.imageContainer}>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={styles.image}
                source={{uri: asset.uri}}
              />
              <Touchable
                position="absolute"
                top={5}
                right={5}
                padding="xs"
                borderRadius={20}
                backgroundColor="grey3"
                onPress={() => onRemoveImage(index)}>
                <CloseIcon color={colors.white} width={8} height={8} />
              </Touchable>
            </View>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    marginVertical: theme.spacing.s,
    marginRight: theme.spacing.s,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
  },
});
