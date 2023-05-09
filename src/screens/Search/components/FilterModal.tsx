import React, {useState} from 'react';
import {Modal, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {ItemType, ValueType} from 'react-native-dropdown-picker';
import moment from 'moment';
import {
  CalendarIcon,
  ChevronDownIcon,
  CloseIcon,
  DropDownPicker,
  LinearGradientView,
  ResetIcon,
  Text,
  theme,
  Touchable,
  View,
} from 'ui';
import {GeoUtils} from 'utils';

type FilterModalProps = {
  visible?: boolean;
  filterValue?: {
    gender?: number;
    city?: string;
    birthYear?: moment.Moment | null;
  };
  onClose?: () => void;
  onSubmit?: (payload: {
    gender?: number;
    city?: string;
    birthYear?: moment.Moment | null;
  }) => void;
  onReset?: () => void;
};

const initRegionItems = GeoUtils.getAllProvinces().map(province => ({
  label: province.name,
  value: province.idProvince,
}));

export const FilterModal = (props: FilterModalProps) => {
  const {visible = false, filterValue, onClose, onSubmit, onReset} = props;

  const [missingTime, setMissingTime] = useState<Date | undefined>(
    filterValue?.birthYear
      ? new Date(filterValue?.birthYear.toString())
      : undefined,
  );
  const [openMissingTimePicker, setOpenMissingTimePicker] = useState(false);

  const [isGenderDropdownOpen, setIsGenderDropDownOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState(
    filterValue?.gender !== undefined
      ? filterValue.gender === 0
        ? 'male'
        : 'female'
      : '',
  );
  const [genderItems, setGenderItems] = useState([
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
  ]);

  const [city, setCity] = useState<string>(
    GeoUtils.getIDProvinceByName(filterValue?.city || ''),
  );
  const [isCityDropdownOpen, setIsCityDropDownOpen] = useState(false);
  const [cityRegionItems, setCityRegionItems] = useState(initRegionItems);
  return (
    <Modal visible={visible} animationType="slide">
      <View
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="m"
        paddingVertical="m">
        <Touchable onPress={onClose}>
          <CloseIcon width={18} height={18} />
        </Touchable>
        <Text fontSize={16} color="grey21" fontWeight="700">
          FILTER
        </Text>
        <Touchable
          onPress={() => {
            if (onReset) {
              onReset();
              setSelectedGender('');
              setCity('');
              setMissingTime(undefined);
            }
          }}>
          <ResetIcon />
        </Touchable>
      </View>

      <View
        marginTop="l"
        flexDirection="row"
        paddingHorizontal="m"
        justifyContent="space-between">
        <View flex={1}>
          <Text fontWeight="700" marginBottom="s">
            Birth year
          </Text>
          <Touchable
            flex={1}
            flexDirection="row"
            backgroundColor="grey22"
            borderRadius={5}
            paddingVertical="m"
            marginRight="m"
            justifyContent="space-evenly"
            alignItems="center"
            onPress={() => setOpenMissingTimePicker(true)}>
            <View />
            <CalendarIcon />
            <Text color="grey12" marginLeft="s" fontWeight="500">
              {missingTime ? moment(missingTime).format('YYYY') : 'YYYY'}
            </Text>
            <ChevronDownIcon />
          </Touchable>
          <DatePicker
            modal
            mode="date"
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
        </View>
        <View flex={1}>
          <Text fontWeight="700" marginBottom="s">
            Gender
          </Text>
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
            containerStyle={[styles.dropDownContainer]}
            tickIconStyle={styles.tickIcon}
            listMode="SCROLLVIEW"
            flatListProps={{
              nestedScrollEnabled: true,
            }}
          />
        </View>
      </View>
      <View paddingHorizontal="m" marginTop="l" zIndex={-1}>
        <View>
          <Text fontWeight="700" marginBottom="s">
            City
          </Text>
          <DropDownPicker
            searchable={true}
            placeholder="Region"
            open={isCityDropdownOpen}
            value={city}
            items={cityRegionItems}
            setOpen={setIsCityDropDownOpen}
            onSelectItem={(item: ItemType<ValueType>) => {
              setCity((item.value ?? '') as string);
            }}
            // onChangeValue={onChange}
            setValue={() => {}}
            setItems={setCityRegionItems}
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
          <Touchable
            onPress={() => {
              onSubmit &&
                onSubmit({
                  gender: selectedGender && selectedGender === 'male' ? 0 : 1,
                  birthYear: missingTime && moment(missingTime),
                  city: city && GeoUtils.getProvince(city),
                });
              onClose && onClose();
            }}
            marginTop="xl">
            <LinearGradientView
              alignItems="center"
              paddingVertical="m"
              borderRadius={8}>
              <Text fontWeight="700">APPLY FILTER</Text>
            </LinearGradientView>
          </Touchable>
        </View>
      </View>
    </Modal>
  );
};

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
    position: 'relative', // to fix scroll issue ... it is by default 'absolute'
    top: 0, //to fix gap between label box and container
  },
  dropDownText: {color: theme.colors.grey12, fontWeight: '500', fontSize: 15},
  tickIcon: {
    width: 15,
    height: 15,
  },
  pickerContainer: {},
  selectContainer: {
    minHeight: 0,
    borderRadius: 5,
    paddingVertical: theme.spacing.m,
    backgroundColor: theme.colors.grey22,
    borderWidth: 0,
  },
});
