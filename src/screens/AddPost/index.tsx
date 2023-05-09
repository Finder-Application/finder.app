import React, {memo, useEffect, useState} from 'react';
import {Control, Controller, FieldValues, useForm} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {ItemType, ValueType} from 'react-native-dropdown-picker';
import {showMessage} from 'react-native-flash-message';
import {ScrollView} from 'react-native-gesture-handler';
import {Asset} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {useCreateNetworkImageUrl} from 'api/networkImages';
import {CreatePostBody, useCreatePost, useUpdatePost} from 'api/posts';
import {Descriptor} from 'api/types.common';
import {AxiosError} from 'axios';
import {useAppStore} from 'core/App';
import {useAuth} from 'core/Auth';
import moment from 'moment';
import {AddPostStackParamList} from 'navigation/AddPostNavigator';
import {RootStackNavigationProps} from 'navigation/types';
import {buildNavigationOptions} from 'navigation/utils';
import {InitAuth} from 'screens/Auth/InitScreen';
import {
  Button,
  CalendarIcon,
  CloseIcon,
  DropDownPicker,
  HEIGHT,
  LinearGradientView,
  Screen,
  SearchInput,
  Text,
  theme,
  Touchable,
  useTheme,
  View,
} from 'ui';
import {GeoUtils} from 'utils';

import {ImagePickerSection} from './components/ImagePickerSection';
const DOB_FORMAT = 'MM/DD/YYYY';
const MISSING_TIME_FORMAT = 'MM/DD/YYYY';

const initRegionItems = GeoUtils.getAllProvinces().map(province => ({
  label: province.name,
  value: province.idProvince,
}));

const FORM_NAMES: {[key: string]: keyof FormData} = {
  TITLE: 'title',
  FULL_NAME: 'fullName',
  NICK_NAME: 'nickName',

  GENDER: 'gender',
  DATE_OF_BIRTH: 'dateOfBirth',
  HOME_TOWN_REGION: 'homeTownRegion',
  HOME_TOWN_STATE: 'homeTownState',
  HOME_TOWN_COMMUNE: 'homeTownCommune',
  HOME_TOWN_HAMLET: 'homeTownHamlet',

  MISSING_ADDRESS_REGION: 'missingAddressRegion',
  MISSING_ADDRESS_STATE: 'missingAddressState',
  MISSING_ADDRESS_COMMUNE: 'missingAddressCommune',
  MISSING_ADDRESS_HAMLET: 'missingAddressHamlet',

  MISSING_TIME: 'missingTime',
  DESCRIPTION: 'description',
};

type HomeTownForm = {
  region: string | null;
  state: string | null;
  commune: string | null;
  hamlet: string | null;
};

type MissingAddressForm = HomeTownForm;

type FormData = {
  title: string;
  fullName: string;
  nickName: string;
  gender: string;
  dateOfBirth: string;
  homeTownRegion: string;
  homeTownState: string;
  homeTownCommune: string;
  homeTownHamlet: string;
  missingAddressRegion: string;
  missingAddressState: string;
  missingAddressCommune: string;
  missingAddressHamlet: string;
  missingTime: string;
  description: string;
};

export const AddPost = memo(
  ({route}: StackScreenProps<AddPostStackParamList>) => {
    const navigation = useNavigation<RootStackNavigationProps>();

    const postParam = route?.params?.post;
    const isEdit = postParam !== undefined;

    const {colors} = useTheme();
    const {
      handleSubmit,
      control,
      reset,
      getFieldState,
      getValues,
      formState: {errors},
    } = useForm<FormData>({
      defaultValues: {
        title: postParam?.title,
        fullName: postParam?.fullName,
        nickName: postParam?.nickname,
        gender: postParam
          ? postParam?.gender === 0
            ? 'male'
            : 'female'
          : undefined,
        dateOfBirth: postParam?.dateOfBirth
          ? new Date(postParam?.dateOfBirth).toString()
          : undefined,
        missingTime: postParam?.missingTime
          ? new Date(postParam?.missingTime).toString()
          : undefined,
        homeTownRegion: GeoUtils.getIDProvinceByName(
          postParam?.hometown?.region || '',
        ),
        homeTownState: GeoUtils.getIDDistrictByName(
          postParam?.hometown?.state || '',
        ),
        homeTownCommune: GeoUtils.getIDWardByName(
          postParam?.hometown?.commune || '',
        ),
        homeTownHamlet: postParam?.hometown?.hamlet ?? '',
        missingAddressRegion: GeoUtils.getIDProvinceByName(
          postParam?.missingAddress?.region || '',
        ),
        missingAddressState: GeoUtils.getIDDistrictByName(
          postParam?.missingAddress?.state || '',
        ),
        missingAddressCommune: GeoUtils.getIDWardByName(
          postParam?.missingAddress?.commune || '',
        ),
        missingAddressHamlet: postParam?.missingAddress?.hamlet ?? '',
        description: postParam?.description,
      },
    });

    const createPostMutation = useCreatePost();
    const updatePostMutation = useUpdatePost();
    const networkUrlMutation = useCreateNetworkImageUrl();

    const setShowLoadingModal = useAppStore(state => state.setShowLoadingModal);
    const isLoggedIn = useAuth(state => state.isLoggedIn);
    const [postImageResource, setPostImageResource] = useState<{
      files: Asset[];
      descriptors: Descriptor[];
    }>({
      files:
        postParam?.photos.map(photo => ({
          uri: photo,
          id: photo,
          fileName: photo,
          type: 'image/png',
        })) ?? [],
      descriptors: [],
    });

    const [isGenderDropdownOpen, setIsGenderDropDownOpen] = useState(false);
    const [selectedGender, setSelectedGender] = useState(
      postParam ? (postParam?.gender === 0 ? 'male' : 'female') : '',
    );
    const [genderItems, setGenderItems] = useState([
      {label: 'Male', value: 'male'},
      {label: 'Female', value: 'female'},
    ]);

    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
      postParam?.dateOfBirth ? new Date(postParam?.dateOfBirth) : undefined,
    );
    const [openDobPicker, setOpenDobPicker] = useState(false);

    const [missingTime, setMissingTime] = useState<Date | undefined>(
      postParam?.dateOfBirth ? new Date(postParam?.missingTime) : undefined,
    );
    const [openMissingTimePicker, setOpenMissingTimePicker] = useState(false);

    // Home Town States
    const [homeTownForm, setHomeTownForm] = useState<HomeTownForm>({
      region: GeoUtils.getIDProvinceByName(postParam?.hometown?.region || ''),
      state: GeoUtils.getIDDistrictByName(postParam?.hometown?.state || ''),
      commune: GeoUtils.getIDWardByName(postParam?.hometown?.commune || ''),
      hamlet: postParam?.hometown?.hamlet ?? null,
    });
    const [isHomeTownRegionDropdownOpen, setIsHomeTownRegionDropDownOpen] =
      useState(false);
    const [isHomeTownStateDropdownOpen, setIsHomeTownStateDropDownOpen] =
      useState(false);
    const [isHomeTownCommuneDropdownOpen, setIsHomeTownCommuneDropDownOpen] =
      useState(false);
    const [homeTownRegionItems, setHomeTownRegionItems] =
      useState(initRegionItems);
    const [homeTownStateItems, setHomeTownStateItems] = useState<
      ItemType<ValueType>[]
    >([]);
    const [homeTownCommuneItems, setHomeTownCommuneItems] = useState<
      ItemType<ValueType>[]
    >([]);
    // End of Home Town States

    // Missing Address States
    const [missingAddressForm, setMissingAddressForm] =
      useState<MissingAddressForm>({
        region: GeoUtils.getIDProvinceByName(
          postParam?.missingAddress?.region || '',
        ),
        state: GeoUtils.getIDDistrictByName(
          postParam?.missingAddress?.state || '',
        ),
        commune: GeoUtils.getIDWardByName(
          postParam?.missingAddress?.commune || '',
        ),
        hamlet: postParam?.missingAddress?.hamlet ?? null,
      });
    const [
      isMissingAddressRegionDropdownOpen,
      setIsMissingAddressRegionDropDownOpen,
    ] = useState(false);
    const [
      isMissingAddressStateDropdownOpen,
      setIsMissingAddressStateDropDownOpen,
    ] = useState(false);
    const [
      isMissingAddressCommuneDropdownOpen,
      setIsMissingAddressCommuneDropDownOpen,
    ] = useState(false);
    const [missingAddressRegionItems, setMissingAddressRegionItems] =
      useState(initRegionItems);
    const [missingAddressStateItems, setMissingAddressStateItems] = useState<
      ItemType<ValueType>[]
    >([]);
    const [missingAddressCommuneItems, setMissingAddressCommuneItems] =
      useState<ItemType<ValueType>[]>([]);
    // End of Missing Address States

    useEffect(() => {
      if (homeTownForm.region) {
        const states = GeoUtils.getAllDistricts(homeTownForm.region).map(
          state => ({
            label: state.name,
            value: state.idDistrict,
          }),
        );
        setHomeTownStateItems(states);
      }
    }, [homeTownForm.region]);

    useEffect(() => {
      if (homeTownForm.state) {
        const states = GeoUtils.getAllCommunes(homeTownForm.state).map(
          state => ({
            label: state.name,
            value: state.idCommune,
          }),
        );
        setHomeTownCommuneItems(states);
      }
    }, [homeTownForm.state]);

    useEffect(() => {
      if (missingAddressForm.region) {
        const states = GeoUtils.getAllDistricts(missingAddressForm.region).map(
          state => ({
            label: state.name,
            value: state.idDistrict,
          }),
        );
        setMissingAddressStateItems(states);
      }
    }, [missingAddressForm.region]);

    useEffect(() => {
      if (missingAddressForm.state) {
        const states = GeoUtils.getAllCommunes(missingAddressForm.state).map(
          state => ({
            label: state.name,
            value: state.idCommune,
          }),
        );
        setMissingAddressCommuneItems(states);
      }
    }, [missingAddressForm.state]);

    useEffect(() => {
      navigation.setOptions({
        ...buildNavigationOptions(navigation, ''),
        title: `${isEdit ? 'Edit' : 'Create'} Post`,
        headerShown: true,
        headerRight: () => (
          <Text fontSize={16} fontWeight="600" color="green2" marginRight="l">
            {isEdit ? 'Edit' : 'Post'}
          </Text>
        ),
      });
    }, []);

    const getImageUrls = async () => {
      if (postImageResource.files.length > 0) {
        const {files} = postImageResource;
        if (files && files.length > 0) {
          return networkUrlMutation.mutateAsync(files).then(value => {
            return value.images;
          });
        }
      }

      return [];
    };

    const getPayloadDescriptors = (networkImageUrls: string[]) => {
      return postImageResource?.descriptors?.reduce(
        (prev: {id: string; descriptor: Descriptor}[], descriptor, index) => {
          const url: string = networkImageUrls[index];
          if (url) {
            const id = url?.split('img-')[1];
            const newLocal = {
              id: id,
              descriptor: descriptor,
            };
            return [...prev, newLocal];
          }
          return prev;
        },
        [],
      );
    };

    const getRequestPayloadInfo = () => {
      return {
        title: getValues('title'),
        fullName: getValues('fullName'),
        nickname: getValues('nickName'),
        dateOfBirth: new Date(getValues('dateOfBirth')),
        gender: getValues('gender') !== 'male',
        hometown: {
          region: GeoUtils.getProvince(getValues('homeTownRegion')),
          state: GeoUtils.getDistrict(getValues('homeTownState')),
          commune: GeoUtils.getCommune(getValues('homeTownCommune')),
          hamlet: getValues('homeTownHamlet'),
        },
        missingAddress: {
          region: GeoUtils.getProvince(getValues('missingAddressRegion')),
          state: GeoUtils.getDistrict(getValues('missingAddressState')),
          commune: GeoUtils.getCommune(getValues('missingAddressCommune')),
          hamlet: getValues('missingAddressHamlet'),
        },
        description: getValues('description'),
        missingTime: new Date(getValues('missingTime')),
      };
    };

    const hasFormValid = () => {
      if (postImageResource.files.length === 0) {
        showMessage({
          message: 'Must have at least 1 image of this person to post!',
          type: 'danger',
        });
        return false;
      }
      return true;
    };

    const handleCreatePost = async (body: CreatePostBody) => {
      return createPostMutation
        .mutateAsync({
          ...body,
        })
        .then(() => {
          showMessage({
            message: 'Create post successfully',
            type: 'success',
          });
          onResetForm();
        })
        .catch((error: AxiosError) => {
          const message = (error.response?.data as any).message;
          showMessage({message: message, type: 'danger'});
        });
    };

    const handleUpdatePost = async (id: string, body: CreatePostBody) => {
      await updatePostMutation
        .mutateAsync({
          id: id,
          body: body,
        })
        .then(() => {
          showMessage({
            message: 'Update post successfully',
            type: 'success',
          });
          onResetForm();
          navigation.goBack();
        })
        .catch((error: AxiosError) => {
          const message = (error.response?.data as any).message;
          showMessage({message: message, type: 'danger'});
        });
    };

    const onResetForm = () => {
      reset();
      setDateOfBirth(undefined);
      setMissingTime(undefined);
      setHomeTownForm({
        region: null,
        state: null,
        commune: null,
        hamlet: null,
      });
      setMissingAddressForm({
        region: null,
        state: null,
        commune: null,
        hamlet: null,
      });
      setPostImageResource({files: [], descriptors: []});
    };

    const onSubmit = async (_: FormData) => {
      const isFormValid = hasFormValid();

      if (isFormValid) {
        setShowLoadingModal(true);
        try {
          const networkImageUrls = await getImageUrls();
          const descriptors = getPayloadDescriptors(networkImageUrls);
          const body = {
            ...getRequestPayloadInfo(),
            photos: [...networkImageUrls],
            descriptors: descriptors ?? [],
          };

          const payload = {
            ...body,
          };
          if (isEdit) {
            console.log('Run Edit');
            await handleUpdatePost(postParam?.id?.toString(), payload);
          } else {
            await handleCreatePost(payload);
          }
        } catch (error) {
          console.log('Create Post Error: ', JSON.stringify(error));
        }
        setShowLoadingModal(false);
      }
    };

    return (
      <>
        {!isLoggedIn ? (
          <InitAuth />
        ) : (
          <Screen
            justifyContent="flex-start"
            alignItems="flex-start"
            paddingHorizontal={undefined}
            style={{paddingBottom: 0}}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.contentContainer}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}>
              <View flexDirection="row" marginVertical="s" marginHorizontal="m">
                <Button
                  backgroundColor="grey4"
                  borderRadius={5}
                  onPress={() => {
                    navigation.goBack();
                  }}
                  paddingVertical="s"
                  paddingHorizontal="l"
                  label={
                    <View flexDirection="row" alignItems="center">
                      <CloseIcon color={colors.grey10} />
                      <Text marginLeft="s" color="grey10" fontWeight="500">
                        Cancel
                      </Text>
                    </View>
                  }
                />
              </View>
              <View
                backgroundColor="white"
                paddingVertical="m"
                borderRadius={10}
                marginHorizontal="m"
                shadowOffset={{width: 2, height: 10}}
                shadowRadius={7}
                elevation={7}
                shadowColor="blackOpacity10">
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <SearchInput
                      marginHorizontal="m"
                      backgroundColor="white"
                      borderWidth={1}
                      inputProps={{
                        name: FORM_NAMES.TITLE,
                        control: control as unknown as Control<
                          FieldValues,
                          any
                        >,
                        placeholder: 'Title here',
                        placeholderTextColor: colors.grey11,
                        value: value,
                        onBlur,
                        onChangeText: onChange,
                      }}
                    />
                  )}
                  name={FORM_NAMES.TITLE}
                  rules={{required: 'Title is required'}}
                />

                {/* Missing Person Information */}
                <View
                  paddingHorizontal="m"
                  backgroundColor="blue2"
                  marginTop="m"
                  paddingVertical="m"
                  borderBottomWidth={1}
                  borderBottomColor="grey4">
                  <Text fontWeight="700" fontSize={16} marginBottom="m">
                    Missing Person Information
                  </Text>
                  <Text fontWeight="700" marginBottom="s">
                    Information
                  </Text>
                  <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                      <SearchInput
                        backgroundColor="white"
                        borderWidth={1}
                        inputProps={{
                          name: FORM_NAMES.FULL_NAME,
                          control: control as unknown as Control<
                            FieldValues,
                            any
                          >,
                          placeholder: 'Full Name *',
                          placeholderTextColor: colors.grey11,
                          inputMode: 'text',
                          value: value,
                          onBlur,
                          onChangeText: onChange,
                        }}
                      />
                    )}
                    name={FORM_NAMES.FULL_NAME}
                    rules={{required: 'FullName is required'}}
                  />

                  <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                      <SearchInput
                        backgroundColor="white"
                        borderWidth={1}
                        marginVertical="m"
                        inputProps={{
                          name: FORM_NAMES.NICK_NAME,
                          control: control as unknown as Control<
                            FieldValues,
                            any
                          >,
                          placeholder: 'Nickname',
                          placeholderTextColor: colors.grey11,
                          value: value,
                          onBlur,
                          onChangeText: onChange,
                        }}
                      />
                    )}
                    name={FORM_NAMES.NICK_NAME}
                  />

                  <View
                    position="relative"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between">
                    <Controller
                      control={control}
                      render={({field: {onChange}}) => (
                        <View flex={1}>
                          <DropDownPicker
                            placeholder="Gender"
                            open={isGenderDropdownOpen}
                            value={selectedGender}
                            items={genderItems}
                            onChangeValue={onChange}
                            setOpen={setIsGenderDropDownOpen}
                            setValue={setSelectedGender}
                            setItems={setGenderItems}
                            arrowIconStyle={styles.arrowIcon}
                            dropDownContainerStyle={styles.pickerContainer}
                            textStyle={styles.dropDownText}
                            style={styles.selectContainer}
                            width="100%"
                            containerStyle={[styles.dropDownContainer]}
                            tickIconStyle={styles.tickIcon}
                            listMode="SCROLLVIEW"
                            flatListProps={{
                              nestedScrollEnabled: true,
                            }}
                            borderColor={
                              getFieldState('gender').error ? 'red' : undefined
                            }
                          />
                          {getFieldState('gender').error && (
                            <View zIndex={-1}>
                              <Text fontSize={12} color="red">
                                {getFieldState('gender').error?.message}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                      name={FORM_NAMES.GENDER}
                      rules={{required: 'Gender is required'}}
                    />

                    <Controller
                      control={control}
                      render={({field: {onChange}}) => (
                        <View flex={1} marginLeft="m">
                          <Touchable
                            flexDirection="row"
                            backgroundColor="grey4"
                            borderRadius={5}
                            paddingVertical="s"
                            paddingHorizontal="m"
                            onPress={() => setOpenDobPicker(true)}>
                            <CalendarIcon />
                            <Text
                              color="grey12"
                              marginLeft="s"
                              fontWeight="500">
                              {dateOfBirth
                                ? moment(dateOfBirth).format(DOB_FORMAT)
                                : DOB_FORMAT}
                            </Text>
                            <DatePicker
                              modal
                              mode="date"
                              open={openDobPicker}
                              date={dateOfBirth ?? new Date()}
                              onDateChange={value => {
                                onChange(value);
                              }}
                              onConfirm={value => {
                                setOpenDobPicker(false);
                                setDateOfBirth(value);
                                onChange(value);
                              }}
                              onCancel={() => {
                                setOpenDobPicker(false);
                              }}
                            />
                          </Touchable>
                          {getFieldState('dateOfBirth').error && (
                            <View zIndex={-1}>
                              <Text fontSize={12} color="red">
                                {getFieldState('dateOfBirth').error?.message}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                      name={FORM_NAMES.DATE_OF_BIRTH}
                      rules={{required: 'Date of birth is required'}}
                    />
                  </View>
                </View>
                {/* End of Missing Person Information */}

                {/* Home Town */}
                <View padding="m" backgroundColor="blue2" zIndex={-1}>
                  <Text fontWeight="700" marginBottom="s">
                    Home town
                  </Text>
                  <View flexDirection="row" alignItems="center">
                    <Controller
                      control={control}
                      render={({field: {onChange}}) => (
                        <View flex={1}>
                          <DropDownPicker
                            searchable={true}
                            placeholder="Region"
                            open={isHomeTownRegionDropdownOpen}
                            value={homeTownForm?.region}
                            items={homeTownRegionItems}
                            setOpen={setIsHomeTownRegionDropDownOpen}
                            onSelectItem={(item: ItemType<ValueType>) => {
                              setHomeTownForm(prevState => ({
                                ...prevState,
                                region: item.value as string,
                              }));
                            }}
                            onChangeValue={onChange}
                            setValue={() => {}}
                            setItems={setHomeTownRegionItems}
                            arrowIconStyle={styles.arrowIcon}
                            dropDownContainerStyle={styles.dropDownContainer}
                            textStyle={styles.dropDownText}
                            style={styles.selectContainer}
                            width="100%"
                            containerStyle={styles.pickerContainer}
                            tickIconStyle={styles.tickIcon}
                            listMode="SCROLLVIEW"
                            flatListProps={{
                              nestedScrollEnabled: true,
                            }}
                            searchWithRegionalAccents={true}
                          />
                          {getFieldState('homeTownRegion').error && (
                            <View zIndex={-1}>
                              <Text fontSize={12} color="red">
                                {getFieldState('homeTownRegion').error?.message}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                      name={FORM_NAMES.HOME_TOWN_REGION}
                      rules={{required: 'HomeTown Region is required'}}
                    />
                  </View>
                  <View
                    flexDirection="row"
                    alignItems="center"
                    marginVertical="m">
                    <Controller
                      control={control}
                      render={({field: {onChange}}) => (
                        <View flex={1}>
                          <DropDownPicker
                            searchable={true}
                            placeholder="State"
                            disabled={!homeTownForm.region}
                            disabledStyle={{opacity: 0.6}}
                            open={isHomeTownStateDropdownOpen}
                            value={homeTownForm.state}
                            items={homeTownStateItems}
                            setOpen={setIsHomeTownStateDropDownOpen}
                            onSelectItem={(item: ItemType<ValueType>) => {
                              setHomeTownForm(prevState => ({
                                ...prevState,
                                state: item.value as string,
                              }));
                            }}
                            onChangeValue={onChange}
                            setValue={() => {}}
                            setItems={setHomeTownStateItems}
                            arrowIconStyle={styles.arrowIcon}
                            dropDownContainerStyle={styles.dropDownContainer}
                            textStyle={styles.dropDownText}
                            style={styles.selectContainer}
                            width="100%"
                            containerStyle={styles.pickerContainer}
                            tickIconStyle={styles.tickIcon}
                            listMode="SCROLLVIEW"
                            flatListProps={{
                              nestedScrollEnabled: true,
                            }}
                            searchWithRegionalAccents={true}
                          />
                          {getFieldState('homeTownState').error && (
                            <View zIndex={-1}>
                              <Text fontSize={12} color="red">
                                {getFieldState('homeTownState').error?.message}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                      name={FORM_NAMES.HOME_TOWN_STATE}
                      rules={{required: 'HomeTown State is required'}}
                    />
                  </View>
                  <View flexDirection="row" alignItems="center">
                    <Controller
                      control={control}
                      render={({field: {onChange}}) => (
                        <View flex={1}>
                          <DropDownPicker
                            searchable={true}
                            placeholder="Commune"
                            disabled={!homeTownForm.state}
                            disabledStyle={{opacity: 0.6}}
                            open={isHomeTownCommuneDropdownOpen}
                            value={homeTownForm.commune}
                            items={homeTownCommuneItems}
                            setOpen={setIsHomeTownCommuneDropDownOpen}
                            onSelectItem={(item: ItemType<ValueType>) => {
                              setHomeTownForm(prevState => ({
                                ...prevState,
                                commune: item.value as string,
                              }));
                            }}
                            onChangeValue={onChange}
                            setValue={() => {}}
                            setItems={setHomeTownCommuneItems}
                            arrowIconStyle={styles.arrowIcon}
                            dropDownContainerStyle={styles.dropDownContainer}
                            textStyle={styles.dropDownText}
                            style={styles.selectContainer}
                            width="100%"
                            containerStyle={styles.pickerContainer}
                            tickIconStyle={styles.tickIcon}
                            listMode="SCROLLVIEW"
                            flatListProps={{
                              nestedScrollEnabled: true,
                            }}
                            searchWithRegionalAccents={true}
                          />
                          {getFieldState('homeTownCommune').error && (
                            <View zIndex={-1}>
                              <Text fontSize={12} color="red">
                                {
                                  getFieldState('homeTownCommune').error
                                    ?.message
                                }
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                      name={FORM_NAMES.HOME_TOWN_COMMUNE}
                      rules={{required: 'HomeTown Commune is required'}}
                    />
                  </View>
                  <Controller
                    control={control}
                    render={({field: {onChange, onBlur}}) => (
                      <SearchInput
                        backgroundColor="white"
                        borderWidth={1}
                        marginTop="m"
                        inputProps={{
                          name: FORM_NAMES.HOME_TOWN_HAMLET,
                          control: control as unknown as Control<
                            FieldValues,
                            any
                          >,
                          placeholder: 'Hamlet',
                          placeholderTextColor: colors.grey11,
                          onBlur: onBlur,
                          onChange: event => {
                            const value = event.nativeEvent.text;
                            setHomeTownForm(prevState => ({
                              ...prevState,
                              hamlet: value,
                            }));
                            onChange(value);
                          },
                        }}
                      />
                    )}
                    name={FORM_NAMES.HOME_TOWN_HAMLET}
                  />
                </View>
                {/* End of Home Town */}

                {/* Missing Address */}
                <View
                  padding="m"
                  marginVertical="s"
                  backgroundColor="blue2"
                  zIndex={-1}>
                  <Text fontWeight="700" marginBottom="s">
                    Missing Address
                  </Text>
                  <View flexDirection="row" alignItems="center">
                    <Controller
                      control={control}
                      render={({field: {onChange}}) => (
                        <View flex={1}>
                          <DropDownPicker
                            searchable={true}
                            placeholder="Region"
                            onChangeValue={onChange}
                            open={isMissingAddressRegionDropdownOpen}
                            value={missingAddressForm?.region}
                            items={missingAddressRegionItems}
                            setOpen={setIsMissingAddressRegionDropDownOpen}
                            onSelectItem={(item: ItemType<ValueType>) => {
                              setMissingAddressForm(prevState => ({
                                ...prevState,
                                region: item.value as string,
                              }));
                            }}
                            setValue={() => {}}
                            setItems={setMissingAddressRegionItems}
                            arrowIconStyle={styles.arrowIcon}
                            dropDownContainerStyle={styles.dropDownContainer}
                            textStyle={styles.dropDownText}
                            style={styles.selectContainer}
                            width="100%"
                            containerStyle={styles.pickerContainer}
                            tickIconStyle={styles.tickIcon}
                            listMode="SCROLLVIEW"
                            flatListProps={{
                              nestedScrollEnabled: true,
                            }}
                            searchWithRegionalAccents={true}
                          />
                          {getFieldState('missingAddressRegion').error && (
                            <View zIndex={-1}>
                              <Text fontSize={12} color="red">
                                {
                                  getFieldState('missingAddressRegion').error
                                    ?.message
                                }
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                      name={FORM_NAMES.MISSING_ADDRESS_REGION}
                      rules={{required: 'Missing Region Address is required'}}
                    />
                  </View>
                  <View
                    flexDirection="row"
                    alignItems="center"
                    marginVertical="m">
                    <Controller
                      control={control}
                      render={({field: {onChange}}) => (
                        <View flex={1}>
                          <DropDownPicker
                            searchable={true}
                            placeholder="State"
                            onChangeValue={onChange}
                            disabled={!missingAddressForm.region}
                            disabledStyle={{opacity: 0.6}}
                            open={isMissingAddressStateDropdownOpen}
                            value={missingAddressForm.state}
                            items={missingAddressStateItems}
                            setOpen={setIsMissingAddressStateDropDownOpen}
                            onSelectItem={(item: ItemType<ValueType>) => {
                              setMissingAddressForm(prevState => ({
                                ...prevState,
                                state: item.value as string,
                              }));
                            }}
                            setValue={() => {}}
                            setItems={setMissingAddressStateItems}
                            arrowIconStyle={styles.arrowIcon}
                            dropDownContainerStyle={styles.dropDownContainer}
                            textStyle={styles.dropDownText}
                            style={styles.selectContainer}
                            width="100%"
                            containerStyle={styles.pickerContainer}
                            tickIconStyle={styles.tickIcon}
                            listMode="SCROLLVIEW"
                            flatListProps={{
                              nestedScrollEnabled: true,
                            }}
                            searchWithRegionalAccents={true}
                          />
                          {getFieldState('missingAddressState').error && (
                            <View zIndex={-1}>
                              <Text fontSize={12} color="red">
                                {
                                  getFieldState('missingAddressState').error
                                    ?.message
                                }
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                      name={FORM_NAMES.MISSING_ADDRESS_STATE}
                      rules={{required: 'Missing State Address is required'}}
                    />
                  </View>
                  <View flexDirection="row" alignItems="center">
                    <Controller
                      control={control}
                      render={({field: {onChange}}) => (
                        <View flex={1}>
                          <DropDownPicker
                            searchable={true}
                            placeholder="Commune"
                            onChangeValue={onChange}
                            disabled={!missingAddressForm.state}
                            disabledStyle={{opacity: 0.6}}
                            open={isMissingAddressCommuneDropdownOpen}
                            value={missingAddressForm.commune}
                            items={missingAddressCommuneItems}
                            setOpen={setIsMissingAddressCommuneDropDownOpen}
                            onSelectItem={(item: ItemType<ValueType>) => {
                              setMissingAddressForm(prevState => ({
                                ...prevState,
                                commune: item.value as string,
                              }));
                            }}
                            setValue={() => {}}
                            setItems={setMissingAddressCommuneItems}
                            arrowIconStyle={styles.arrowIcon}
                            dropDownContainerStyle={styles.dropDownContainer}
                            textStyle={styles.dropDownText}
                            style={styles.selectContainer}
                            width="100%"
                            containerStyle={styles.pickerContainer}
                            tickIconStyle={styles.tickIcon}
                            listMode="SCROLLVIEW"
                            flatListProps={{
                              nestedScrollEnabled: true,
                            }}
                            searchWithRegionalAccents={true}
                          />
                          {getFieldState('missingAddressCommune').error && (
                            <View zIndex={-1}>
                              <Text fontSize={12} color="red">
                                {
                                  getFieldState('missingAddressCommune').error
                                    ?.message
                                }
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                      name={FORM_NAMES.MISSING_ADDRESS_COMMUNE}
                      rules={{required: 'Missing Commune Address is required'}}
                    />
                  </View>
                  <Controller
                    control={control}
                    render={({field: {onChange, onBlur}}) => (
                      <SearchInput
                        backgroundColor="white"
                        borderWidth={1}
                        marginTop="m"
                        inputProps={{
                          name: FORM_NAMES.MISSING_ADDRESS_HAMLET,
                          control: control as unknown as Control<
                            FieldValues,
                            any
                          >,
                          placeholder: 'Hamlet',
                          placeholderTextColor: colors.grey11,
                          onBlur: onBlur,
                          onChange: event => {
                            const value = event.nativeEvent.text;
                            setMissingAddressForm(prevState => ({
                              ...prevState,
                              hamlet: value,
                            }));
                            onChange(value);
                          },
                        }}
                      />
                    )}
                    name={FORM_NAMES.MISSING_ADDRESS_HAMLET}
                  />
                </View>
                <View />
                {/* End of Missing Address */}

                {/* Missing Time */}
                <View
                  padding="m"
                  marginVertical="s"
                  backgroundColor="blue2"
                  zIndex={-1}>
                  <Text fontWeight="700" marginBottom="s">
                    Missing Time
                  </Text>
                  <Controller
                    control={control}
                    render={({field: {onChange}}) => (
                      <View flex={1} marginLeft="m">
                        <Touchable
                          flex={1}
                          flexDirection="row"
                          backgroundColor="grey4"
                          borderRadius={5}
                          paddingVertical="s"
                          paddingHorizontal="m"
                          justifyContent="space-between"
                          onPress={() => setOpenMissingTimePicker(true)}>
                          <View />
                          <Text color="grey12" marginLeft="s" fontWeight="500">
                            {missingTime
                              ? moment(missingTime).format(MISSING_TIME_FORMAT)
                              : MISSING_TIME_FORMAT}
                          </Text>
                          <CalendarIcon />
                        </Touchable>
                        <DatePicker
                          modal
                          mode="date"
                          open={openMissingTimePicker}
                          date={missingTime ?? new Date()}
                          onConfirm={value => {
                            setOpenMissingTimePicker(false);
                            setMissingTime(value);
                            onChange(value);
                          }}
                          onCancel={() => {
                            setOpenMissingTimePicker(false);
                          }}
                        />
                        {getFieldState('missingTime').error && (
                          <View zIndex={-1}>
                            <Text fontSize={12} color="red">
                              {getFieldState('missingTime').error?.message}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                    name={FORM_NAMES.MISSING_TIME}
                    rules={{required: 'Missing time is required'}}
                  />
                </View>
                {/* End of Missing Time */}

                {/* Description  */}
                <View
                  padding="m"
                  marginVertical="s"
                  backgroundColor="blue2"
                  zIndex={-1}>
                  <Text fontWeight="700" marginBottom="s">
                    Description
                  </Text>
                  <Text color="grey13" fontStyle="italic">
                    * Please provide the specific information of the person you
                    are looking for or found by you. The more specific, the more
                    accurate and better matching
                  </Text>
                  <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                      <SearchInput
                        backgroundColor="white"
                        borderWidth={1}
                        marginTop="m"
                        inputProps={{
                          name: FORM_NAMES.DESCRIPTION,
                          control: control as unknown as Control<
                            FieldValues,
                            any
                          >,
                          onChange: onChange,
                          onBlur: onBlur,
                          value: value,
                          textAlignVertical: 'top',
                          style: {
                            height: HEIGHT / 6,
                          },
                        }}
                      />
                    )}
                    name={FORM_NAMES.DESCRIPTION}
                    rules={{required: 'Description is required'}}
                  />
                </View>
                {/* End of Description  */}

                {/* Missing Person's face images  */}
                <ImagePickerSection
                  postImageSource={postImageResource}
                  onSelectPostImageResource={(files, descriptors) => {
                    setPostImageResource(_ => ({
                      files: files,
                      descriptors: descriptors,
                    }));
                  }}
                />
                {/* End of Missing Person's face images  */}
                <Touchable
                  alignSelf="flex-end"
                  marginTop="l"
                  marginRight="m"
                  onPress={handleSubmit(onSubmit, e => console.log(e, errors))}>
                  <LinearGradientView
                    paddingHorizontal="l"
                    paddingVertical="s"
                    borderRadius={10}
                    colors={[colors.green2, colors.green3, colors.green4]}
                    locations={[0, 0.64, 0.99]}
                    angle={90}>
                    <Text fontWeight="600" fontSize={16}>
                      {isEdit ? 'Edit' : 'Create'} Post
                    </Text>
                  </LinearGradientView>
                </Touchable>
              </View>
            </ScrollView>
          </Screen>
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  arrowIcon: {
    width: 15,
    height: 15,
  },
  dropDownContainer: {
    width: '100%',
    borderWidth: 0,
    flex: 1,
    position: 'relative', // to fix scroll issue ... it is by default 'absolute'
    top: 0, //to fix gap between label box and container
  },
  dropDownText: {color: theme.colors.grey12, fontWeight: '500', fontSize: 15},
  tickIcon: {
    width: 15,
    height: 15,
  },
  pickerContainer: {
    flex: 1,
  },
  selectContainer: {
    minHeight: 0,
    borderRadius: 5,
    paddingVertical: theme.spacing.s,
    backgroundColor: theme.colors.grey4,
    borderWidth: 0,
  },
});
