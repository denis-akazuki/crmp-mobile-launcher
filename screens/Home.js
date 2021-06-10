/**
 * Unity Launcher
 * Developed by Akazuki
 */
import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Alert,
  Linking,
  PermissionsAndroid,
  BackHandler,
  NativeModules,
} from 'react-native';

import RNFS from 'react-native-fs';
var SendIntentAndroid = require('react-native-send-intent');
const {RNGpuInfoModule} = NativeModules;
import VersionCheck from 'react-native-version-check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomButton} from './drawable/CustomButton.js';
import {CustomInput} from './drawable/CustomInput.js';
import {ImageButton} from './drawable/ImageButton.js';
const config = require('./configs/config.json');
const ini = require('./ini.js');
const variables = require('./variables/variables');

export default function Home({navigation}) {
  const [nick, onChangeText] = React.useState('');
  const iniFunctions = new ini();
  const clientType = 2;

  const goSettings = async () => {
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
			RNFS.exists(
				clientType == 1
				  ? 'file:///storage/emulated/0/Android/data/com.rockstargames.gtasa/'
				  : 'file:///storage/emulated/0/' + config.projectName,
			  ).then((response) => {
				if (!response) {
				  return Alert.alert(
					config.projectName + ' Mobile',
					'Клиент не установлен!',
				  );
				}
				navigation.navigate('Settings');
			});
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

  const startGameButton = () => {
    RNFS.exists(
      clientType == 1
        ? 'file:///storage/emulated/0/Android/data/com.rockstargames.gtasa/'
        : 'file:///storage/emulated/0/' + config.projectName,
    ).then((response) => {
      if (!response) {
        return Alert.alert(
          config.projectName + ' Mobile',
          'Клиент не установлен!',
        );
      }
      if (nick.indexOf('_') == -1) {
        return Alert.alert(
          config.projectName + ' Mobile',
          'Для входа в игру необходимо указать ник\n\nНапример: Jordan_Unity',
        );
      }
      setName();
      SendIntentAndroid.openApp(config.packageName).then((wasOpened) => {
        if (!wasOpened) {
          Alert.alert(config.projectName + ' Mobile', 'Клиент не установлен!');
        }
      });
    });
  };

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
			Alert.alert(config.projectName + ' Mobile', "Вы действительно желаете установить игру на свой девайс?", 
			[
				{
					text: "Да",
					onPress: () => navigation.navigate("Install")
				},
				{
					text: "Нет"
				}
			]);
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

  const openVk = async () => {
    const supported = await Linking.canOpenURL(config.vk);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(config.vk);
    }
  };

  const openSite = async () => {
    const supported = await Linking.canOpenURL(config.webSite);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(config.webSite);
    }
  };

  const checkUpdates = () => {
    fetch('http://ваш сайт/config.json')
      .then((response) => response.json())
      .then((response) => {
        const launcher_data = response;
        const client_version = VersionCheck.getCurrentVersion();
        const server_version = launcher_data.version;
        const gVersion = launcher_data.gVersion;

        if (launcher_data.launcher == 5) {
          BackHandler.exitApp();
        } else {
          if (server_version > client_version) {
            navigation.navigate('LauncherUpdatedActivity', {download_state: 1});
          } else {
            RNFS.exists(
              clientType == 1
                ? 'file:///storage/emulated/0/Android/data/com.rockstargames.gtasa/'
                : 'file:///storage/emulated/0/' + config.projectName,
            )
              .then(async (response) => {
                if (response == false) {
                  return 1;
                }
                if ((await AsyncStorage.getItem('gVersion')) == null) {
                  return 1;
                }
                SendIntentAndroid.isAppInstalled(config.packageName).then(
                  async (wasInstalled) => {
                    if (wasInstalled) {
                      if (gVersion > (await AsyncStorage.getItem('gVersion'))) {
                        navigation.navigate('LauncherUpdatedActivity', {
                          download_state: 4,
                        });
                      }
                    }
                  },
                );
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      })
      .done();
  };

  const getName = async () => {
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
            RNFS.exists(
              clientType == 1
                ? 'file:///storage/emulated/0/Android/data/com.rockstargames.gtasa/files/SAMP/settings.ini'
                : 'file:///storage/emulated/0/' +
                    config.projectName +
                    '/SAMP/settings.ini',
            )
              .then(async (exists) => {
                let settings = await RNFS.readFile(
                  clientType == 1
                    ? 'file:///storage/emulated/0/Android/data/com.rockstargames.gtasa/files/SAMP/settings.ini'
                    : 'file:///storage/emulated/0/' +
                        config.projectName +
                        '/SAMP/settings.ini',
                  'utf8',
                );
                let settingsParse = iniFunctions.parseINIString(settings);
                onChangeText(settingsParse.client.name);
              })
              .catch((error) => {});
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

  const setName = async () => {
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
            RNFS.exists(
              clientType == 1
                ? 'file:///storage/emulated/0/Android/data/com.rockstargames.gtasa/files/SAMP/settings.ini'
                : 'file:///storage/emulated/0/' +
                    config.projectName +
                    '/SAMP/settings.ini',
            )
              .then(async (exists) => {
                let settings = await RNFS.readFile(
                  clientType == 1
                    ? 'file:///storage/emulated/0/Android/data/com.rockstargames.gtasa/files/SAMP/settings.ini'
                    : 'file:///storage/emulated/0/' +
                        config.projectName +
                        '/SAMP/settings.ini',
                  'utf8',
                );

                let settingsParse = iniFunctions.parseINIString(settings);
                settingsParse.client.name = nick;

                RNFS.writeFile(
                  clientType == 1
                    ? 'file:///storage/emulated/0/Android/data/com.rockstargames.gtasa/files/SAMP/settings.ini'
                    : 'file:///storage/emulated/0/' +
                        config.projectName +
                        '/SAMP/settings.ini',
                  iniFunctions.stringifyIni(settingsParse),
                  'utf8',
                )
                  .then((result) => {
                    console.log(`Ваш ник: ${settingsParse.client.name}`);
                  })
                  .catch((error) => {});
              })
              .catch((error) => {
                console.log(error);
              });
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

  useEffect(() => {
    checkUpdates();
    getName();
    RNGpuInfoModule.getGlRenderer().then((result) => {
      global.gpuInfoModule = result;
    });
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../img/bg.png')}>
        <Image
          style={{marginTop: 29, width: 155, height: 110, alignSelf: 'center'}}
          source={require('../img/logo.png')}
        />
        <CustomInput
          style={{
            marginTop: 42,
          }}
          onChangeText={(text) => onChangeText(text)}
          defaultValue={nick}
        />
        <View
          style={{
            marginTop: 48,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <CustomButton
            title={'\t\tUNITY MOBILE\nCRMP С БОНУСОМ'}
            style={{
              height: 107,
              marginLeft: 10,
              width: '59%',
            }}
          />
          <CustomButton
            source={require('../img/play.png')}
            imageStyle={{
              left: 5,
              height: 55,
              width: 55,
            }}
            style={{
              marginLeft: 18,
              height: 107,
              marginRight: 10,
              width: 108,
            }}
            onPress={startGameButton}
          />
        </View>
        <CustomButton
          title="Установить игру"
          onPress={startInstall}
          style={{
            marginTop: 48,
            marginLeft: 10,
            marginRight: 10,
          }}
          imageStyle={{
            height: 16,
            width: 12,
            tintColor: '#FFFFFF',
          }}
          source={require('../img/coolicon.png')}
        />
        <CustomButton
          title="Настройки"
          onPress={goSettings}
          style={{
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
          }}
          imageStyle={{
            height: 17,
            width: 17,
            tintColor: '#FFFFFF',
          }}
          source={require('../img/settings.png')}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ImageButton
            style={{
              width: 40,
              height: 44,
            }}
            source={require('../img/information.png')}
            onPress={openSite}
          />
          <ImageButton
            style={{
              marginLeft: 43,
              width: 40,
              height: 44,
            }}
            source={require('../img/site.png')}
            onPress={openSite}
          />
          <ImageButton
            style={{
              marginLeft: 43,
              width: 40,

              height: 44,
            }}
            source={require('../img/vk.png')}
            onPress={openVk}
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});
