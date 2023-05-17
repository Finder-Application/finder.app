import React from 'react';
import {Control, FieldValues, useForm} from 'react-hook-form';
import {ScrollView, StyleSheet} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {yupResolver} from '@hookform/resolvers/yup';
import {useChangePassword} from 'api/auth';
import {AxiosError} from 'axios';
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
  oldPassword: string;
  newPassword: string;
  confirmingPassword: string;
};

const FORM_NAMES: {[key: string]: keyof FormData} = {
  OLD_PASSWORD: 'oldPassword',
  NEW_PASSWORD: 'newPassword',
  CONFIRMING_PASSWORD: 'confirmingPassword',
};

const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required(),
  newPassword: yup.string().required().min(6),
  confirmingPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

export const ChangePassword = () => {
  const currentUser = useAuth(state => state.user);

  const {colors} = useTheme();
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: {errors},
  } = useForm<FormData>({
    resolver: yupResolver(changePasswordSchema),
  });

  const changePasswordMutation = useChangePassword();

  const setShowLoadingModal = useAppStore(state => state.setShowLoadingModal);

  const onSubmit = async (_: FormData) => {
    console.log('onSubmit: ', _);
    if (currentUser) {
      try {
        setShowLoadingModal(true);
        await changePasswordMutation
          .mutateAsync({
            password: getValues('newPassword'),
            oldPassword: getValues('oldPassword'),
          })

          .then(() => {
            showMessage({
              message: 'Change password successfully',
              type: 'success',
            });
          })
          .catch((error: AxiosError) => {
            console.log('changePasswordMutation error: ', error);

            showMessage({
              message: COMMON_ERROR_MESSAGE,
              type: 'danger',
            });
          });
        reset();
        setShowLoadingModal(false);
      } catch (error) {
        setShowLoadingModal(false);
        showMessage({
          message: COMMON_ERROR_MESSAGE,
          type: 'danger',
        });
        console.log('error: ', error);
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
            Old password&nbsp;
            <Text fontWeight="700" color="red1">
              *
            </Text>
          </Text>
          <SearchInput
            backgroundColor="white"
            borderWidth={1}
            borderColor="grey26"
            inputProps={{
              name: FORM_NAMES.OLD_PASSWORD,
              control: control as unknown as Control<FieldValues, any>,
              placeholder: 'Your password *',
              placeholderTextColor: colors.grey11,
              inputMode: 'text',
              secureTextEntry: true,
            }}
          />
        </View>

        <View marginVertical="m">
          <Text fontWeight="700" marginBottom="xs">
            New password&nbsp;
            <Text fontWeight="700" color="red1">
              *
            </Text>
          </Text>
          <SearchInput
            backgroundColor="white"
            borderWidth={1}
            borderColor="grey26"
            inputProps={{
              name: FORM_NAMES.NEW_PASSWORD,
              control: control as unknown as Control<FieldValues, any>,
              placeholder: 'New password *',
              placeholderTextColor: colors.grey11,
              inputMode: 'text',
              secureTextEntry: true,
            }}
          />
        </View>

        <View>
          <Text fontWeight="700" marginBottom="xs">
            Confirm password&nbsp;
            <Text fontWeight="700" color="red1">
              *
            </Text>
          </Text>
          <SearchInput
            backgroundColor="white"
            borderWidth={1}
            borderColor="grey26"
            inputProps={{
              name: FORM_NAMES.CONFIRMING_PASSWORD,
              control: control as unknown as Control<FieldValues, any>,
              placeholder: 'Confirm password *',
              placeholderTextColor: colors.grey11,
              inputMode: 'text',
              secureTextEntry: true,
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
              Change password
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
