import React, {useState} from 'react';
import {Control, Controller, FieldValues, useForm} from 'react-hook-form';
import {ScrollView, StyleSheet} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {useCreateNetworkImageUrl} from 'api/networkImages';
import {useUpdateUserInformation} from 'api/user';
import {AxiosError} from 'axios';
import {useAppStore, useAuth} from 'core';
import {
  COMMON_ERROR_MESSAGE,
  FEMALE_AVATAR_PLACE_HOLDER,
  MALE_AVATAR_PLACE_HOLDER,
} from 'screens/constants';
import {
  DropDownPicker,
  Image,
  LinearGradientView,
  Screen,
  SearchInput,
  Text,
  theme,
  Touchable,
  useTheme,
  View,
} from 'ui';

type FormData = {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
};

const FORM_NAMES: {[key: string]: keyof FormData} = {
  FIRST_NAME: 'firstName',
  MIDDLE_NAME: 'middleName',
  LAST_NAME: 'lastName',
  GENDER: 'gender',
};

export const EditProfile = () => {
  const currentUser = useAuth(state => state.user);

  const {colors} = useTheme();
  const {
    handleSubmit,
    control,
    getFieldState,
    getValues,
    formState: {errors},
  } = useForm<FormData>({
    defaultValues: {
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName,
      middleName: currentUser?.middleName,
      gender: currentUser?.gender === false ? 'male' : 'female',
    },
  });

  const [avatar, setAvatar] = useState<ImagePickerResponse>();
  const networkUrlMutation = useCreateNetworkImageUrl();
  const updateUserMutation = useUpdateUserInformation();

  const setShowLoadingModal = useAppStore(state => state.setShowLoadingModal);

  const [isGenderDropdownOpen, setIsGenderDropDownOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState(
    currentUser?.gender !== undefined
      ? currentUser?.gender === false
        ? 'male'
        : 'female'
      : '',
  );
  const [genderItems, setGenderItems] = useState([
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
  ]);

  const onPickAvatar = async () => {
    try {
      setShowLoadingModal(true);
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        includeBase64: true,
      });
      setAvatar(result);
      setShowLoadingModal(false);
    } catch (error) {
      setShowLoadingModal(false);
      console.log('onPickAvatar error: ', error);
    }
  };

  const getImageUrl = async () => {
    if (avatar?.assets?.[0].uri) {
      return networkUrlMutation
        .mutateAsync([avatar?.assets?.[0]])
        .then(value => {
          return value.images[0];
        });
    }
  };

  console.log('currentUser: ', currentUser);
  const onSubmit = async (_: FormData) => {
    if (currentUser) {
      try {
        setShowLoadingModal(true);
        const avatarUrl = await getImageUrl();
        await updateUserMutation
          .mutateAsync({
            body: {
              ...currentUser,
              social: '',
              isActive: true,
              firstName: getValues('firstName'),
              middleName: getValues('middleName'),
              lastName: getValues('lastName'),
              gender: getValues('gender') === 'male' ? false : true,
              avatar: avatarUrl ? avatarUrl : currentUser?.avatar,
            },
          })
          .then(() => {
            showMessage({
              message: 'Update successfully',
              type: 'success',
            });
          })
          .catch((error: AxiosError) => {
            console.log('updateUserMutation error: ', error);

            showMessage({
              message: COMMON_ERROR_MESSAGE,
              type: 'danger',
            });
          });
        setShowLoadingModal(false);
      } catch (error) {
        setShowLoadingModal(false);
        showMessage({
          message: COMMON_ERROR_MESSAGE,
          type: 'danger',
        });
        console.log(' onSubmit error: ', error);
      }
    }
  };
  return (
    <Screen justifyContent="flex-start" alignItems="flex-start">
      <LinearGradientView
        height="13%"
        position="absolute"
        flex={1}
        top={0}
        left={0}
        right={0}
      />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollViewStyle}
        showsVerticalScrollIndicator={false}>
        <Touchable alignSelf="center" marginTop="xl" onPress={onPickAvatar}>
          <Image
            height={100}
            width={100}
            borderRadius={50}
            borderWidth={3}
            borderColor="white"
            source={{
              uri: avatar?.assets?.[0].uri
                ? avatar?.assets?.[0].uri
                : currentUser?.avatar
                ? currentUser?.avatar
                : currentUser?.gender === false
                ? MALE_AVATAR_PLACE_HOLDER
                : FEMALE_AVATAR_PLACE_HOLDER,
            }}
          />
          <Text>Change Picture</Text>
        </Touchable>

        <View>
          <Text fontWeight="700" marginBottom="xs">
            First name&nbsp;
            <Text fontWeight="700" color="red1">
              *
            </Text>
          </Text>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <SearchInput
                backgroundColor="white"
                borderWidth={1}
                borderColor="grey26"
                inputProps={{
                  name: FORM_NAMES.FIRST_NAME,
                  control: control as unknown as Control<FieldValues, any>,
                  placeholder: 'First Name *',
                  placeholderTextColor: colors.grey11,
                  inputMode: 'text',
                  value: value,
                  onBlur,
                  onChangeText: onChange,
                }}
              />
            )}
            name={FORM_NAMES.FIRST_NAME}
            rules={{required: 'First Name is required'}}
          />
        </View>

        <View marginVertical="m">
          <Text fontWeight="700" marginBottom="xs">
            Middle name
          </Text>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <SearchInput
                backgroundColor="white"
                borderWidth={1}
                borderColor="grey26"
                inputProps={{
                  name: FORM_NAMES.MIDDLE_NAME,
                  control: control as unknown as Control<FieldValues, any>,
                  placeholder: 'Middle Name',
                  placeholderTextColor: colors.grey11,
                  inputMode: 'text',
                  value: value,
                  onBlur,
                  onChangeText: onChange,
                }}
              />
            )}
            name={FORM_NAMES.MIDDLE_NAME}
            rules={{required: 'Middle Name is required'}}
          />
        </View>

        <View>
          <Text fontWeight="700" marginBottom="xs">
            Last name&nbsp;
            <Text fontWeight="700" color="red1">
              *
            </Text>
          </Text>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <SearchInput
                backgroundColor="white"
                borderWidth={1}
                borderColor="grey26"
                inputProps={{
                  name: FORM_NAMES.LAST_NAME,
                  control: control as unknown as Control<FieldValues, any>,
                  placeholder: 'Last Name *',
                  placeholderTextColor: colors.grey11,
                  inputMode: 'text',
                  value: value,
                  onBlur,
                  onChangeText: onChange,
                }}
              />
            )}
            name={FORM_NAMES.LAST_NAME}
            rules={{required: 'Last Name is required'}}
          />
        </View>

        <View
          position="relative"
          flexDirection="column"
          justifyContent="flex-start"
          width="40%">
          <Text fontWeight="700" marginBottom="xs" marginTop="m">
            Middle name&nbsp;
            <Text fontWeight="700" color="red1">
              *
            </Text>
          </Text>
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
        </View>

        <Touchable
          zIndex={-1}
          marginTop="l"
          onPress={handleSubmit(onSubmit, e => console.log(e, errors))}>
          <LinearGradientView
            paddingHorizontal="l"
            paddingVertical="m"
            alignItems="center"
            borderRadius={10}
            colors={[colors.green2, colors.green3, colors.green4]}
            locations={[0, 0.64, 0.99]}
            angle={90}>
            <Text fontWeight="700" fontSize={16}>
              Update
            </Text>
          </LinearGradientView>
        </Touchable>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  scrollViewStyle: {
    width: '100%',
  },
  container: {
    width: '100%',
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
