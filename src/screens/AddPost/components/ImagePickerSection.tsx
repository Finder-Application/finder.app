import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  Asset,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {useCreateNetworkImageUrl} from 'api/networkImages';
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

export const ImagePickerSection = () => {
  const {colors} = useTheme();

  const [imageResponse, setImageResponse] = useState<ImagePickerResponse>();

  const networkUrlMutation = useCreateNetworkImageUrl();
  const setShowLoadingModal = useAppStore(state => state.setShowLoadingModal);

  const onPickImages = useCallback(async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0,
      });
      console.log('result: ', result);
      setShowLoadingModal(true);
      const images = await networkUrlMutation.mutateAsync(result);
      console.log('images: ', images);

      setImageResponse(prev => ({
        ...prev,
        assets: uniqBy(
          [...(prev?.assets ?? []), ...(result.assets ?? [])],
          item => item.fileName,
        ),
      }));
      setShowLoadingModal(false);
    } catch (error) {
      console.log('onPickImages error: ', error);
      setShowLoadingModal(false);
    }
  }, []);

  const onRemoveImage = useCallback((removedIndex: number) => {
    setImageResponse(prev => {
      return {
        ...prev,
        assets: prev?.assets?.filter((_, index) => index !== removedIndex),
      };
    });
  }, []);

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
        {imageResponse?.assets && (
          <Text fontStyle="italic">
            Current: {imageResponse?.assets.length}
          </Text>
        )}
      </View>
      <View flexDirection="row" flexWrap="wrap">
        {imageResponse?.assets &&
          imageResponse?.assets?.map((asset: Asset, index) => (
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
