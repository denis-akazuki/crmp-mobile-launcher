/**
 * Unity Launcher
 * Developed by Akazuki
 */
import React from 'react';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  ImageBackground,
  Image,
  NativeModules,
} from 'react-native';
const {SetupClientModule} = NativeModules;

import {CustomButton} from './drawable/CustomButton.js';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InstallApkActivity() {
  const startInstall = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            fetch('http://slaughter.perses.feralhosting.com/config.json')
              .then((response) => response.json())
              .then(async (response) => {
                const launcher_data = response;
                const gVersion = launcher_data.gVersion;
                storeData('gVersion', gVersion);
              })
              .done();
            SetupClientModule.setup(
              `${RNFS.ExternalDirectoryPath}/base_client.apk`,
            );
          } else {
            console.log('Read storage denied.');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        console.log('Write storage denied.');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const storeData = async (name, data) => {
    try {
      await AsyncStorage.setItem(name, data);
    } catch (e) {
      // saving error
    }
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../img/bg.png')}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Image
            style={styles.logo}
            source={require('../img/logoDownload.png')}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 10}}>
          <CustomButton
            style={styles.button}
            title="Установить APK"
            onPress={startInstall}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  button: {
    marginLeft: 10,
    marginRight: 10,
  },
  logo: {
    marginTop: 100,
    width: 244,
    height: 294,
    alignSelf: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});
