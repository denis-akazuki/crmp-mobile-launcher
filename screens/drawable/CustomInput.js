import React from 'react';
import {TouchableOpacity, TextInput, StyleSheet, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export const CustomInput = (props) => {
  const {style = {}, onChangeText, defaultValue} = props;

  return (
    <TouchableOpacity activeOpacity={1} style={[styles.button, style]}>
      <LinearGradient
        start={{x: 0.0, y: 0.0}}
        end={{x: 1.0, y: 0}}
        locations={[1, 0.33]}
        colors={['#AA3219', '#721308']}
        style={styles.gradient}>
        <Image
          source={require('../../img/iconPlayer.png')}
          style={styles.player}
        />
        <TextInput
          style={{marginLeft: 15, color: '#FFFFFF'}}
          onChangeText={onChangeText}
          defaultValue={defaultValue}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  player: {
    height: 20,
    width: 16,
    tintColor: '#FFFFFF',
    marginLeft: 21,
  },
  button: {
    height: 53,

    marginLeft: 10,
    marginRight: 10,
  },
  gradient: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    elevation: 10,
  },
});
