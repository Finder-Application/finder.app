import React, {memo, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {ItemType, ValueType} from 'react-native-dropdown-picker';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {RootStackNavigationProps} from 'navigation/types';
import {buildNavigationOptions} from 'navigation/utils';
import {
  Button,
  CalendarIcon,
  CloseIcon,
  DropDownPicker,
  HEIGHT,
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
const MISSING_TIME_FORMAT = 'MM/DD/YYYY hh:mm A';

const initRegionItems = GeoUtils.getAllProvinces().map(province => ({
  label: province.name,
  value: province.idProvince,
}));

const FORM_NAMES = {
  TITLE: 'title',
  FULL_NAME: 'fullName',
  NICK_NAME: 'nickName',

  HOME_TOWN_REGION: 'homeTownRegion',
  HOME_TOWN_STATE: 'homeTownState',
  HOME_TOWN_COMMUNE: 'homeTownCommune',
  HOME_TOWN_HAMLET: 'homeTownHamlet',

  MISSING_ADDRESS_REGION: 'missingAddressRegion',
  MiSSING_ADDRESS_STATE: 'missingAddressState',
  MISSING_ADDRESS_COMMUNE: 'missingAddressCommune',
  MISSING_ADDRESS_HAMLET: 'missingAddressHamlet',

  DESCRIPTION: 'DESCRIPTION',
};

type HomeTownForm = {
  region: string | null;
  state: string | null;
  commune: string | null;
  hamlet: string | null;
};

type MissingAddressForm = HomeTownForm;

export const AddPost = memo(() => {
  const navigation = useNavigation<RootStackNavigationProps>();

  const {colors} = useTheme();
  const {control} = useForm();

  const [isGenderDropdownOpen, setIsGenderDropDownOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const [genderItems, setGenderItems] = useState([
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
  ]);

  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [openDobPicker, setOpenDobPicker] = useState(false);

  const [missingTime, setMissingTime] = useState<Date | undefined>();
  const [openMissingTimePicker, setOpenMissingTimePicker] = useState(false);

  // Home Town States
  const [homeTownForm, setHomeTownForm] = useState<HomeTownForm>({
    region: null,
    state: null,
    commune: null,
    hamlet: null,
  });
  const [isHomeTownRegionDropdownOpen, setIsHomeTownRegionDropDownOpen] =
    useState(false);
  const [isHomeTownStateDropdownOpen, setIsHomeTownStateDropDownOpen] =
    useState(false);
  const [homeTownRegionItems, setHomeTownRegionItems] =
    useState(initRegionItems);
  const [homeTownStateItems, setHomeTownStateItems] = useState<
    ItemType<ValueType>[]
  >([]);
  // End of Home Town States

  // Missing Address States
  const [missingAddressForm, setMissingAddressForm] =
    useState<MissingAddressForm>({
      region: null,
      state: null,
      commune: null,
      hamlet: null,
    });
  const [
    isMissingAddressRegionDropdownOpen,
    setIsMissingAddressRegionDropDownOpen,
  ] = useState(false);
  const [
    isMissingAddressStateDropdownOpen,
    setIsMissingAddressStateDropDownOpen,
  ] = useState(false);
  const [missingAddressRegionItems, setMissingAddressRegionItems] =
    useState(initRegionItems);
  const [missingAddressStateItems, setMissingAddressStateItems] = useState<
    ItemType<ValueType>[]
  >([]);
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
    navigation.setOptions({
      ...buildNavigationOptions(navigation, ''),
      title: 'Create Post',
      headerShown: true,
      headerRight: () => (
        <Text fontSize={16} fontWeight="600" color="green2" marginRight="l">
          Post
        </Text>
      ),
    });
  }, []);

  return (
    <Screen
      justifyContent="flex-start"
      alignItems="flex-start"
      paddingHorizontal={undefined}>
      <ScrollView
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
          shadowOffset={{width: 2, height: 10}}
          shadowRadius={7}
          elevation={7}
          marginHorizontal="m"
          shadowColor="blackOpacity10">
          <SearchInput
            marginHorizontal="m"
            backgroundColor="white"
            borderWidth={1}
            borderColor="white2"
            inputProps={{
              name: FORM_NAMES.TITLE,
              control,
              placeholder: 'Title here',
              placeholderTextColor: colors.grey11,
            }}
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
            <SearchInput
              backgroundColor="white"
              borderWidth={1}
              borderColor="white2"
              inputProps={{
                name: FORM_NAMES.FULL_NAME,
                control,
                placeholder: 'Full Name *',
                placeholderTextColor: colors.grey11,
                inputMode: 'text',
              }}
            />
            <SearchInput
              backgroundColor="white"
              borderWidth={1}
              borderColor="white2"
              marginVertical="m"
              inputProps={{
                name: FORM_NAMES.NICK_NAME,
                control,
                placeholder: 'Nickname',
                placeholderTextColor: colors.grey11,
              }}
            />
            <View
              position="relative"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
              <DropDownPicker
                placeholder="Gender"
                open={isGenderDropdownOpen}
                value={selectedGender}
                items={genderItems}
                setOpen={setIsGenderDropDownOpen}
                setValue={setSelectedGender}
                setItems={setGenderItems}
                arrowIconStyle={styles.arrowIcon}
                dropDownContainerStyle={styles.pickerContainer}
                textStyle={styles.dropDownText}
                style={styles.selectContainer}
                width="100%"
                containerStyle={styles.dropDownContainer}
                tickIconStyle={styles.tickIcon}
                listMode="SCROLLVIEW"
                flatListProps={{
                  nestedScrollEnabled: true,
                }}
              />
              <Touchable
                flex={1}
                flexDirection="row"
                backgroundColor="grey4"
                borderRadius={5}
                paddingVertical="s"
                paddingHorizontal="m"
                marginLeft="m"
                onPress={() => setOpenDobPicker(true)}>
                <CalendarIcon />
                <Text color="grey12" marginLeft="s" fontWeight="500">
                  {dateOfBirth
                    ? moment(dateOfBirth).format(DOB_FORMAT)
                    : DOB_FORMAT}
                </Text>
              </Touchable>
            </View>
          </View>
          {/* End of Missing Person Information */}

          {/* Home Town */}
          <View padding="m" backgroundColor="blue2" zIndex={-1}>
            <Text fontWeight="700" marginBottom="s">
              Home town
            </Text>
            <View
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
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
            </View>
            <View
              flexDirection="row"
              alignItems="center"
              marginVertical="m"
              justifyContent="space-between">
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
            </View>
            <SearchInput
              backgroundColor="white"
              borderWidth={1}
              borderColor="white2"
              inputProps={{
                name: FORM_NAMES.HOME_TOWN_COMMUNE,
                control,
                placeholder: 'Commune',
                placeholderTextColor: colors.grey11,
                onChange: event => {
                  const value = event.nativeEvent.text;
                  setHomeTownForm(prevState => ({
                    ...prevState,
                    commune: value,
                  }));
                },
              }}
            />
            <SearchInput
              backgroundColor="white"
              borderWidth={1}
              borderColor="white2"
              marginTop="m"
              inputProps={{
                name: FORM_NAMES.HOME_TOWN_HAMLET,
                control,
                placeholder: 'Hamlet',
                placeholderTextColor: colors.grey11,
                onChange: event => {
                  const value = event.nativeEvent.text;
                  setHomeTownForm(prevState => ({
                    ...prevState,
                    hamlet: value,
                  }));
                },
              }}
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
            <View
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
              <DropDownPicker
                searchable={true}
                placeholder="Region"
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
            </View>
            <View
              flexDirection="row"
              alignItems="center"
              marginVertical="m"
              justifyContent="space-between">
              <DropDownPicker
                searchable={true}
                placeholder="State"
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
            </View>
            <SearchInput
              backgroundColor="white"
              borderWidth={1}
              borderColor="white2"
              inputProps={{
                name: FORM_NAMES.MISSING_ADDRESS_COMMUNE,
                control,
                placeholder: 'Commune',
                placeholderTextColor: colors.grey11,
                onChange: event => {
                  const value = event.nativeEvent.text;
                  setMissingAddressForm(prevState => ({
                    ...prevState,
                    commune: value,
                  }));
                },
              }}
            />
            <SearchInput
              backgroundColor="white"
              borderWidth={1}
              borderColor="white2"
              marginTop="m"
              inputProps={{
                name: FORM_NAMES.MISSING_ADDRESS_HAMLET,
                control,
                placeholder: 'Hamlet',
                placeholderTextColor: colors.grey11,
                onChange: event => {
                  const value = event.nativeEvent.text;
                  setMissingAddressForm(prevState => ({
                    ...prevState,
                    hamlet: value,
                  }));
                },
              }}
            />
          </View>
          {/* End of Missing Address */}
          <View />

          {/* Missing Time */}
          <View
            padding="m"
            marginVertical="s"
            backgroundColor="blue2"
            zIndex={-1}>
            <Text fontWeight="700" marginBottom="s">
              Missing Time
            </Text>

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
              * Please provide the specific information of the person you are
              looking for or found by you. The more specific, the more accurate
              and better matching
            </Text>

            <SearchInput
              backgroundColor="white"
              borderWidth={1}
              borderColor="white2"
              marginTop="m"
              inputProps={{
                name: FORM_NAMES.DESCRIPTION,
                control,
                onChange: event => {
                  const value = event.nativeEvent.text;
                  setMissingAddressForm(prevState => ({
                    ...prevState,
                    hamlet: value,
                  }));
                },
                textAlignVertical: 'top',
                style: {
                  height: HEIGHT / 6,
                },
              }}
            />
          </View>
          {/* End of Description  */}

          {/* Missing Person's face images  */}
          <ImagePickerSection />
          {/* End of Missing Person's face images  */}
        </View>
      </ScrollView>
      <DatePicker
        modal
        mode="date"
        open={openDobPicker}
        date={dateOfBirth ?? new Date()}
        onConfirm={value => {
          setOpenDobPicker(false);
          setDateOfBirth(value);
        }}
        onCancel={() => {
          setOpenDobPicker(false);
        }}
      />
      <DatePicker
        modal
        mode="datetime"
        open={openMissingTimePicker}
        date={missingTime ?? new Date()}
        onConfirm={value => {
          setOpenMissingTimePicker(false);
          setMissingTime(value);
        }}
        onCancel={() => {
          setOpenMissingTimePicker(false);
        }}
      />
    </Screen>
  );
});

const styles = StyleSheet.create({
  contentContainer: {flexGrow: 1, paddingBottom: 100},

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
