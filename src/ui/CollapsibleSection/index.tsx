import React, {useState} from 'react';
import {ChevronUpIcon, Touchable, View} from 'ui';

type CollapsibleSectionProps = {
  isOpened?: boolean;
  header?: React.ReactNode;
  children?: React.ReactNode;
};
const CollapsibleSection = (
  props: CollapsibleSectionProps & React.ComponentProps<typeof Touchable>,
) => {
  const {header = <View />, children, isOpened = false, ...rest} = props;

  const [open, setopen] = useState(isOpened);

  const onPress = () => {
    setopen(!open);
  };

  return (
    <Touchable onPress={onPress} activeOpacity={1} {...rest}>
      <View
        flexDirection="row"
        justifyContent="space-between"
        borderBottomWidth={open ? 1 : 0}
        borderBottomColor="grey8"
        paddingBottom="s"
        alignItems="center">
        {header}

        <View style={{transform: [{rotate: open ? '0deg' : '180deg'}]}}>
          <ChevronUpIcon />
        </View>
      </View>
      <View>{open && children}</View>
    </Touchable>
  );
};

export default CollapsibleSection;
