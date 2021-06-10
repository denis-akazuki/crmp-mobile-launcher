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
  PermissionsAndroid,
  Text,
} from 'react-native';

import RNFS from 'react-native-fs';
import {CustomButton} from './drawable/CustomButton.js';
const config = require('./configs/config.json');
const ini = require('./ini.js');
import Slider from 'react-native-sliders';
const variables = require('./variables/variables');

export default function Settings({navigation}) {
  const [pageSize, onpageSizeChange] = React.useState();
  const [fps, onFpsChange] = React.useState();
  const iniFunctions = new ini();
  const clientType = 2;

  const readSettings = () => {
    return new Promise((resolve, reject) => {
      RNFS.exists(
        clientType == 1
          ? 'file:///storage/emulated/0/Android/data/com.rockstargames.gtasa/files/SAMP/settings.ini'
          : 'file:///storage/emulated/0/' +
              config.projectName +
              '/SAMP/settings.ini',
      )
        .then(async (exists) => {
          resolve(
            await RNFS.readFile(
              clientType == 1
                ? 'file:///storage/emulated/0/Android/data/com.rockstargames.gtasa/files/SAMP/settings.ini'
                : 'file:///storage/emulated/0/' +
                    config.projectName +
                    '/SAMP/settings.ini',
              'utf8',
            ),
          );
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const reinstallGame = async () => {
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
            navigation.navigate('Install');
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

  const setPageSize = () => {
    readSettings().then((settings) => {
      let settingsParse = iniFunctions.parseINIString(settings);
      settingsParse.gui.ChatMaxMessages = String(pageSize).replace(
        /[{()}]/g,
        '',
      );

      RNFS.writeFile(
        clientType == 1
          ? 'file:///storage/emulated/0/Android/data/com.rockstargames.gtasa/files/SAMP/settings.ini'
          : 'file:///storage/emulated/0/' +
              config.projectName +
              '/SAMP/settings.ini',
        iniFunctions.stringifyIni(settingsParse),
        'utf8',
      ).catch((error) => {});
    });
  };

  useEffect(() => {
    readSettings().then((settings) => {
      let settingsParse = iniFunctions.parseINIString(settings);
      onpageSizeChange(settingsParse.gui.ChatMaxMessages);
      onFpsChange(settingsParse.client.fps);
    });
  }, []);

  const setFpsCount = () => {
    readSettings().then((settings) => {
      let settingsParse = iniFunctions.parseINIString(settings);
      settingsParse.client.fps = String(fps).replace(/[{()}]/g, '');

      RNFS.writeFile(
        clientType == 1
          ? 'file:///storage/emulated/0/Android/data/com.rockstargames.gtasa/files/SAMP/settings.ini'
          : 'file:///storage/emulated/0/' +
              config.projectName +
              '/SAMP/settings.ini',
        iniFunctions.stringifyIni(settingsParse),
        'utf8',
      ).catch((error) => {});
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../img/bg.png')}>
        <Image
          style={{marginTop: 29, width: 155, height: 110, alignSelf: 'center'}}
          source={require('../img/logo.png')}
        />
        <View
          style={{
            marginLeft: 16,
            marginTop: 80,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            style={{
              width: 25,
              height: 23,
            }}
            source={require('../img/refresh.png')}
          />
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: 'Roboto',
            }}>
            {'\tFPS Лимит'}
          </Text>
          <View
            style={{
              marginLeft: 24,
              flex: 1,
              flexDirection: 'column',
            }}>
            <View
              style={{
                flexDirection: 'row',
				justifyContent: 'space-between',
				marginRight: 10,
              }}>
              <Text
                style={{
                  color: '#FFFFFF',
                  textAlign: 'left',
                }}>
                30
              </Text>
              <Text
                style={{
                  color: '#FFFFFF',
                  textAlign: 'center',
                }}>
                60
              </Text>
              <Text
                style={{
                  color: '#FFFFFF',
                  textAlign: 'right',
                }}>
                90
              </Text>
            </View>
            <Slider
              value={fps}
              style={{marginRight: 10}}
              onValueChange={(value) => onFpsChange(value)}
              minimumValue={30}
              maximumValue={90}
              step={30}
              minimumTrackTintColor="#721308"
              maximumTrackTintColor="#A93118"
              thumbStyle={{
                backgroundColor: '#FFFFFF',
                width: 15,
                height: 15,
              }}
              thumbImage={require('../img/track.png')}
              onSlidingComplete={setFpsCount}
            />
          </View>
        </View>
        <View
          style={{
            marginTop: 19,
            marginLeft: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            style={{
              marginTop: 1,
              width: 18,
              height: 17,
            }}
            source={require('../img/message.png')}
          />
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: 'Roboto',
            }}>
            {'\tРазмер чата'}
          </Text>
          <View
            style={{
			  marginLeft: 16,
			  flex: 1,
              flexDirection: 'column',
            }}>
            <View
              style={{
                flexDirection: 'row',
				justifyContent: 'space-between',
				marginRight: 10,
              }}>
              <Text
                style={{
                  color: '#FFFFFF',
                  textAlign: 'left',
                }}>
                8
              </Text>
              <Text
                style={{
                  color: '#FFFFFF',
                  textAlign: 'center',
                }}>
                {pageSize}
              </Text>
              <Text
                style={{
                  color: '#FFFFFF',
                  textAlign: 'right',
                }}>
                15
              </Text>
            </View>
            <Slider
              value={pageSize}
              style={{marginRight: 10}}
              onValueChange={(value) => onpageSizeChange(value)}
              minimumValue={8}
              maximumValue={15}
              step={1}
              minimumTrackTintColor="#721308"
              maximumTrackTintColor="#A93118"
              thumbStyle={{
                backgroundColor: '#FFFFFF',
                width: 15,
                height: 15,
              }}
              thumbImage={require('../img/track.png')}
              onSlidingComplete={setPageSize}
            />
          </View>
        </View>
        <CustomButton
          title="Переустановить игру"
          onPress={reinstallGame}
          style={{
            marginTop: 59,
            marginLeft: 10,
            marginRight: 10,
          }}
          imageStyle={{
            height: 24,
            width: 25,
            tintColor: '#FFFFFF',
          }}
          source={require('../img/autorenew.png')}
        />
        <Text
          style={{
            padding: 10,
            color: '#333',
            textAlign: 'center',
          }}>{`GPU: ${global.gpuInfoModule}`}</Text>
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
