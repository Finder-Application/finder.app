import React from 'react';
import {Control, FieldValues, useForm} from 'react-hook-form';
import {ScrollView, StyleSheet} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';
import {useSendOtp} from 'api/auth';
import {AxiosError} from 'axios';
import {useAppStore} from 'core/App';
import {AuthStackNavigationProps} from 'navigation/AuthNavigator';
import {AppScreens} from 'screens/constants';
import {
  LinearGradientView,
  Screen,
  SearchInput,
  Text,
  theme,
  Touchable,
  View,
} from 'ui';
import {ChevronLeftIcon} from 'ui/icons/ChevronLeft';
import * as yup from 'yup';

interface FormData {
  email: string;
}

const schema = yup.object().shape({
  email: yup.string().required().email(),
});

const INPUT_HEIGHT = 56;

export const ForgotPassword = () => {
  const navigation = useNavigation<AuthStackNavigationProps>();

  const {handleSubmit, control, getValues} = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const {mutateAsync} = useSendOtp({
    onSuccess() {
      showMessage({
        message: 'Send otp successfully! Please check your email',
        type: 'success',
      });
    },
  });
  const setShowLoadingModal = useAppStore(state => state.setShowLoadingModal);

  const onSubmit = async (_: FormData) => {
    setShowLoadingModal(true);
    await mutateAsync(getValues('email'))
      .then(() => {
        setShowLoadingModal(false);
        navigation.navigate(AppScreens.CreateNewPassword, {
          email: getValues('email'),
        });
      })
      .catch((err: AxiosError) => {
        console.log('useSendOtp error:  ', err);
        const data = err?.response?.data;
        if (err?.response?.data) {
          const {message} = data as any;
          if (typeof message === 'string') {
            showMessage({message: message, type: 'danger'});
          }
        }
      })
      .finally(() => setShowLoadingModal(false));
  };

  return (
    <Screen backgroundColor="white" style={styles.screenContainer}>
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={styles.contentContainer}>
        <View marginTop="xl">
          <Text fontSize={32} fontWeight="700">
            Forgot Password?
          </Text>
          <Text
            fontSize={16}
            fontWeight="500"
            color="grey19"
            marginTop="m"
            marginBottom="xl">
            Don't worry! It occurs. Please enter the email address linked with
            your account.
          </Text>
          <SearchInput
            key={'email'}
            backgroundColor="grey18"
            borderWidth={1}
            borderColor="grey17"
            inputProps={{
              name: 'email',
              control: control as unknown as Control<FieldValues, any>,
              placeholder: 'Enter your email',
              placeholderTextColor: theme.colors.grey19,
              style: {
                fontSize: 15,
                height: INPUT_HEIGHT,
                paddingLeft: theme.spacing.m,
              },
              keyboardType: 'email-address',
            }}
          />
          <Touchable onPress={handleSubmit(onSubmit)} marginTop="xl">
            <LinearGradientView
              alignItems="center"
              paddingVertical="m"
              borderRadius={8}>
              <Text fontWeight="700">Send Code</Text>
            </LinearGradientView>
          </Touchable>
        </View>
        <Touchable
          backgroundColor="white"
          borderColor="grey17"
          borderRadius={12}
          borderWidth={1}
          paddingVertical="m"
          paddingHorizontal="l"
          position="absolute"
          top={10}
          left={0}
          onPress={() => navigation.goBack()}>
          <ChevronLeftIcon />
        </Touchable>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    paddingBottom: theme.spacing.l,
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: theme.spacing.xl,
  },
});
