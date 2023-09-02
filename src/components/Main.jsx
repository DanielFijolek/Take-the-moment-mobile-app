import React, {useContext} from 'react';
import {
  StyleSheet,
  Text,
  Button,
  Switch,
  useColorScheme,
  View, PermissionsAndroid,
} from 'react-native';
import {
  Colors,
  Header,
} from 'react-native/Libraries/NewAppScreen';
import {languageContext} from "../../App";

const createStyles = (isDarkMode) => StyleSheet.create({
  body: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: isDarkMode ? Colors.black : Colors.white,
    height: "100%",
  },
  headerText: {
    fontSize: 30,
    marginVertical: 30
  },
  languageBar: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    paddingRight: 5,
    gap: 2,
  },
  outer: {
    flex: 1
  },
  buttons: {
    width: "50%",
    height: "30%",
    justifyContent: "space-around",
  }
});
const Main = ({setIsEnglish, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = createStyles(isDarkMode)
  const toggleSwitch = () => setIsEnglish((previousState) => !previousState)
  const isEnglish = useContext(languageContext)
  const grantPermission = async () => {
    try {
      await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location permissions',
            message:
                'Permission must be granted to use app',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
      );

      await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          {
            title: 'Location permissions',
            message:
                'Permission must be granted to use app',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
      );
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <View style={styles.body}>
      <View style={styles.languageBar}>
        <Text>PL</Text>
        <Switch value={isEnglish} onValueChange={toggleSwitch}/>
        <Text>EN</Text>
      </View>
      <Text style={styles.headerText}>Take the moment APP</Text>

      <View style={styles.buttons}>
        <Button title={isEnglish? "Map": "Mapa"} onPress={async () => {
          await grantPermission();
          navigation.navigate('Map');
        }}/>
      </View>
    </View>
  )
}
export default Main