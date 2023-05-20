import React, {useEffect, useState} from 'react';
import {Control, Controller, FieldValues} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import Voice, {
  SpeechResultsEvent,
  SpeechStartEvent,
} from '@react-native-community/voice';
import {HEIGHT, MicroPhoneIcon, SearchInput, Text, Touchable, View} from 'ui';
import {VoiceRecognitionAnimation} from 'ui/animations';

import '../index';

import {FORM_NAMES, PostFormData} from '../index';
type DescriptionProps = {
  control?: Control<PostFormData>;
  onChange?: (value: string) => void;
};
export const Description = (props: DescriptionProps) => {
  const {control, onChange} = props;

  const [result, setResult] = useState('');
  const [isLoading, setLoading] = useState(false);

  const speechStartHandler = (e: SpeechStartEvent) => {
    console.log('speechStart successful', e);
  };
  const speechEndHandler = (e: SpeechStartEvent) => {
    setLoading(false);
    console.log('stop handler', e);
  };
  const speechResultsHandler = (e: SpeechResultsEvent) => {
    const text = e?.value?.[0];
    setResult(text ?? '');
    onChange && onChange(text ?? '');
  };
  const startRecording = async () => {
    setLoading(true);
    try {
      await Voice.start('vi-VN');
    } catch (error) {
      console.log('error', error);
    }
  };
  const stopRecording = async () => {
    try {
      await Voice.stop();
      setLoading(false);
    } catch (error) {
      console.log('error', error);
    }
  };
  const clear = () => {
    setResult('');
  };

  useEffect(() => {
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <View padding="m" marginVertical="s" backgroundColor="blue2" zIndex={-1}>
      <Text fontWeight="700" marginBottom="s">
        Description
      </Text>
      <Text color="grey13" fontStyle="italic">
        * Please provide the specific information of the person you are looking
        for or found by you. The more specific, the more accurate and better
        matching
      </Text>
      <Controller
        control={control}
        render={({field: {onBlur, value = result}}) => (
          <SearchInput
            backgroundColor="white"
            borderWidth={1}
            marginTop="m"
            inputProps={{
              name: FORM_NAMES.DESCRIPTION,
              control: control as unknown as Control<FieldValues, any>,
              multiline: true,
              onChange: e => {
                const text = e.nativeEvent.text;
                onChange && onChange(text);
                setResult(text);
              },
              onBlur: onBlur,
              value: result ?? value,
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
      <View style={styles.btnContainer}>
        {isLoading ? (
          <VoiceRecognitionAnimation width={50} height={50} />
        ) : (
          <Touchable onPress={startRecording}>
            <MicroPhoneIcon />
          </Touchable>
        )}
        {isLoading && (
          <Touchable style={styles.stop} onPress={stopRecording} marginLeft="l">
            <Text fontWeight="bold" color="white">
              Stop
            </Text>
          </Touchable>
        )}
        {result && (
          <Touchable style={styles.clear} onPress={clear} marginLeft="l">
            <Text fontWeight="bold" color="white">
              Clear
            </Text>
          </Touchable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stop: {
    backgroundColor: 'red',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
  },
  clear: {
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    with: '50%',
    justifyContent: 'center',
    marginTop: 24,
  },
});
