import {StackNavigationProp} from '@react-navigation/stack';

import {AddPostStackParamList} from './AddPostNavigator';
import type {AuthStackParamList} from './AuthNavigator';
import {HomeStackParamList} from './HomeNavigator';

export type RootStackParamList = AuthStackParamList &
  AddPostStackParamList &
  HomeStackParamList;

export type RootStackNavigationProps = StackNavigationProp<RootStackParamList>;

// export type RootStackParamList = AuthStackParamList & XXXStackParamList  &  YYYStackParamList  ;

// very important to type check useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
