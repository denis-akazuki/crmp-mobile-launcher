import React from 'react';
import {TouchableOpacity, StyleSheet, Text, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export const CustomButton = (props) => {
  const {
    title = 'Enter',
    style = {},
    textStyle = {},
    onPress,
    source,
    imageStyle = {},
  } = props;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={[styles.button, style]}>
      <LinearGradient
        start={{x: 0.0, y: 0.0}}
        end={{x: 1.0, y: 0}}
        locations={[1, 0.33]}
        colors={['#AA3219', '#721308']}
        style={styles.gradient}>
        <Image source={source} style={imageStyle} />
        <Text style={[styles.text, textStyle]}>{props.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    height: 62,
  },

  text: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17,
    elevation: 10,
  },
});
