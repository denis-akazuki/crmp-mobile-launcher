import React from 'react';
import {TouchableOpacity, StyleSheet, Image} from 'react-native';

export const ImageButton = (props) => {
  const {style = {}, onPress, source = {}} = props;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={[styles.button]}>
      <Image source={source} style={style} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
  },
});
