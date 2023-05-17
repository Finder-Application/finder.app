import React from 'react';
import {Control, FieldValues, useForm} from 'react-hook-form';
import {ScrollView, StyleSheet} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {yupResolver} from '@hookform/resolvers/yup';
import {useUpdateUserInformation} from 'api/user';
import {AxiosError} from 'axios';
import {regex} from 'config';
import {useAppStore, useAuth} from 'core';
import {COMMON_ERROR_MESSAGE} from 'screens/constants';
import {
  LinearGradientView,
  Screen,
  SearchInput,
  Text,
  theme,
  Touchable,
  useTheme,
  View,
} from 'ui';
import * as yup from 'yup';

type FormData = {
  email: string;
  address: string;
  phone: string;
};

const FORM_NAMES: {[key: string]: keyof FormData} = {
  EMAIL: 'email',
  ADDRESS: 'address',
  PHONE: 'phone',
};

const editContactSchema = yup.object().shape({
  email: yup.string().required().email(),
  address: yup.string().required(),
  phone: yup
    .string()
    .required()
    .matches(regex.phone, 'Phone number is not valid'),
});

export const EditContact = () => {
  const currentUser = useAuth(state => state.user);

  const {colors} = useTheme();
  const {
    handleSubmit,
    control,
    getValues,
    formState: {errors},
  } = useForm<FormData>({
    defaultValues: {
      email: currentUser?.email,
      phone: currentUser?.phone,
      address: currentUser?.address,
    },
    resolver: yupResolver(editContactSchema),
  });

  const updateUserMutation = useUpdateUserInformation();

  const setShowLoadingModal = useAppStore(state => state.setShowLoadingModal);

  const onSubmit = async (_: FormData) => {
    console.log('onSubmit: ', _);
    if (currentUser) {
      try {
        setShowLoadingModal(true);
        await updateUserMutation
          .mutateAsync({
            body: {
              ...currentUser,
              social: '',
              isActive: true,
              email: getValues('email'),
              address: getValues('address'),
              phone: getValues('phone'),
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
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollViewStyle}
        showsVerticalScrollIndicator={false}>
        <View marginTop="xl">
          <Text fontWeight="700" marginBottom="xs">
            Email&nbsp;
            <Text fontWeight="700" color="red1">
              *
            </Text>
          </Text>
          <SearchInput
            backgroundColor="white"
            borderWidth={1}
            borderColor="grey26"
            inputProps={{
              name: FORM_NAMES.EMAIL,
              control: control as unknown as Control<FieldValues, any>,
              placeholder: 'First Name *',
              placeholderTextColor: colors.grey11,
              inputMode: 'text',
            }}
          />
        </View>

        <View marginVertical="m">
          <Text fontWeight="700" marginBottom="xs">
            Living place&nbsp;
            <Text fontWeight="700" color="red1">
              *
            </Text>
          </Text>
          <SearchInput
            backgroundColor="white"
            borderWidth={1}
            borderColor="grey26"
            inputProps={{
              name: FORM_NAMES.ADDRESS,
              control: control as unknown as Control<FieldValues, any>,
              placeholder: 'Living place *',
              placeholderTextColor: colors.grey11,
              inputMode: 'text',
            }}
          />
        </View>

        <View>
          <Text fontWeight="700" marginBottom="xs">
            Phone&nbsp;
            <Text fontWeight="700" color="red1">
              *
            </Text>
          </Text>
          <SearchInput
            backgroundColor="white"
            borderWidth={1}
            borderColor="grey26"
            inputProps={{
              name: FORM_NAMES.PHONE,
              control: control as unknown as Control<FieldValues, any>,
              placeholder: 'Phone number *',
              placeholderTextColor: colors.grey11,
              inputMode: 'numeric',
            }}
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
