/**
 * Unity Launcher
 * Developed by Akazuki
 */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  ImageBackground,
  Text,
  Image,
  NativeModules,
} from 'react-native';
const {SetupClientModule} = NativeModules;

import PushNotification from 'react-native-push-notification';
import RNFS, {DocumentDirectoryPath, downloadFile} from 'react-native-fs';
import * as Progress from 'react-native-progress';
import {unzip} from 'react-native-zip-archive';
const config = require('./configs/config.json');
const variables = require('./variables/variables');

export default function Install({route, navigation}) {
  const [progress, setProgress] = useState(0);
  const [textState, setTextState] = useState();
  let {download_state} = route.params;
  const clientType = 2;
  let vendor;

  const startDownloading = async () => {
    PushNotification.createChannel(
      {
        channelId: config.projectName + '-notification',
        channelName: config.projectName + ' Launcher',
        importance: 4,
        vibrate: false,
      },
      (created) => console.log(`createChannel returned '${created}'`),
    );

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
            switch (download_state) {
              case 1: {
                DownloadFiles(config.launcher, 'launcher.apk', undefined);
                break;
              }
              case 4: {
                RNFS.exists(
                  clientType == 1
                    ? 'file:///storage/emulated/0/Android/data/com.rockstargames.gtasa/'
                    : 'file:///storage/emulated/0/' + config.projectName,
                )
                  .then(async (response) => {
                    await RNFS.unlink(
                      clientType == 1
                        ? 'file:///storage/emulated/0/Android/data/com.rockstargames.gtasa/'
                        : 'file:///storage/emulated/0/' + config.projectName,
                    );

                    DownloadFiles(
                      config.filesFull,
                      'files_full.zip',
                      clientType == 1
                        ? 'file:///storage/emulated/0/Android/data/'
                        : 'file:///storage/emulated/0/',
                    );
                  })
                  .catch((error) => {
                    DownloadFiles(
                      config.filesFull,
                      'files_full.zip',
                      clientType == 1
                        ? 'file:///storage/emulated/0/Android/data/'
                        : 'file:///storage/emulated/0/',
                    );
                  });
                break;
              }
            }
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

  const DownloadFiles = (URL, file, pathToUnzip) => {
    const options = {
      fromUrl: URL,
      toFile: `${RNFS.ExternalDirectoryPath}/${file}`,
      begin: _downloadFileBegin,
      progress: _downloadFileProgress,

      progressDivider: 1,
    };

    RNFS.downloadFile(options).promise.then((r) => {
      switch (download_state) {
        case 1: {
          SetupClientModule.setup(`${RNFS.ExternalDirectoryPath}/launcher.apk`);
          PushNotification.removeAllDeliveredNotifications();
          break;
        }
        case 4: {
          UnZipFiles(`${RNFS.ExternalDirectoryPath}/${file}`, pathToUnzip)
            .then((path) => {
              if (vendor == 'Adreno') {
                DownloadFiles(
                  config.texdbA,
                  'texdb.zip',
                  clientType == 1
                    ? 'file:///storage/emulated/0/Android/data/'
                    : 'file:///storage/emulated/0/',
                );
              } else if (vendor == 'Mali') {
                DownloadFiles(
                  config.texdbM,
                  'texdb.zip',
                  clientType == 1
                    ? 'file:///storage/emulated/0/Android/data/'
                    : 'file:///storage/emulated/0/',
                );
              } else if (vendor == 'PowerVR' || vendor == 'Tegra') {
                DownloadFiles(
                  config.texdbP,
                  'texdb.zip',
                  clientType == 1
                    ? 'file:///storage/emulated/0/Android/data/'
                    : 'file:///storage/emulated/0/',
                );
              }

              download_state = 5;
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        }
        case 5: {
          UnZipFiles(`${RNFS.ExternalDirectoryPath}/${file}`, pathToUnzip)
            .then((path) => {
              DownloadFiles(config.baseClient, 'base_client.apk', undefined);

              download_state = 6;
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        }
        case 6: {
          navigation.navigate('InstallApkActivity');
          PushNotification.removeAllDeliveredNotifications();
          break;
        }
      }
    });
  };

  const UnZipFiles = (target, destination) => {
	setTextState("Распаковка...");
    PushNotification.localNotification({
      id: 0,
      channelId: config.projectName + '-notification',
      ongoing: true,
      message: "Распаковка...",
	  vibration: 0,
	  onlyAlertOnce: true,
      playSound: false,
    });
    return new Promise((resolve, reject) => {
      unzip(target, destination, 'UTF-8')
        .then((path) => {
          resolve(path);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const _downloadFileBegin = () => {
    console.log('Download Begin');
  };

  useEffect(() => {
    if (global.gpuInfoModule[0] == 'A') {
      vendor = 'Adreno';
      startDownloading();
    } else if (global.gpuInfoModule[0] == 'M') {
      vendor = 'Mali';
      startDownloading();
    } else if (global.gpuInfoModule[0] == 'T') {
      vendor = 'Tegra';
      startDownloading();
    } else if (global.gpuInfoModule[0] == 'P') {
      vendor = 'PowerVR';
      startDownloading();
    } else {
      Alert.alert(
        config.projectName + ' Mobile',
        'Технические неполадки, свяжитесь с разработчиком!',
      );
      navigation.navigate('Home');
    }
  }, []);

  const _downloadFileProgress = (data) => {
    const percentage = data.bytesWritten / data.contentLength;
    setProgress(percentage);
    setTextState(
      download_state == 1
        ? 'Обновление лаунчера'
        : download_state == 4
        ? 'Обновление кэша...'
        : download_state == 5
        ? 'Обновление текстур...'
        : download_state == 6
        ? 'Обновление клиента...'
        : undefined,
    );
    const percentageSecond =
      ((100 * data.bytesWritten) / data.contentLength) | 0;
    PushNotification.localNotification({
      id: 0,
      channelId: config.projectName + '-notification',
      ongoing: true,
      subText: percentageSecond.toString() + '%',
      message:
        download_state == 1
          ? 'Обновление лаунчера'
          : download_state == 4
          ? 'Обновление кэша...'
          : download_state == 5
          ? 'Обновление текстур...'
          : download_state == 6
          ? 'Обновление клиента...'
          : undefined,
	  vibration: 0,
	  onlyAlertOnce: true,
      playSound: false,
    });
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../img/bg.png')}>
        <View style={{marginTop: 100, flex: 1, justifyContent: 'center'}}>
          <Image
            style={styles.logo}
            source={require('../img/logoDownload.png')}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 80}}>
          <Text style={styles.downloadState}>{textState}</Text>
          <Progress.Bar
            style={{
              marginLeft: 20,
              marginRight: 20,
              marginTop: 19,
            }}
            unfilledColor="#1F1F1F"
            styleAttr="Horizontal"
            indeterminate={false}
            progress={progress}
            width={null}
            borderWidth={0}
            borderRadius={5}
            color="#721308"
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
  logo: {
    alignSelf: 'center',
    width: 244,
    height: 294,
  },
  downloadState: {
    textAlign: 'center',
    fontSize: 19,
    fontFamily: 'Roboto',
    color: '#FFFFFF',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});
