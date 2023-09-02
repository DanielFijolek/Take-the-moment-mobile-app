import React, {useState, createContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
  Dimensions, View,
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Main from "./src/components/Main";
import Map from  "./src/components/Map"

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableLatestRenderer} from 'react-native-maps';
export const languageContext = createContext(null);
const Stack = createNativeStackNavigator();
enableLatestRenderer();
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = createStyles(isDarkMode);
  const [isEnglish, setIsEnglish] = useState(false)

  return (
    <languageContext.Provider value={isEnglish}>
      <SafeAreaView style={{height: Dimensions.get("window").height}}>
        <ScrollView
          contentContainerStyle={styles.outer}
          contentInsetAdjustmentBehavior="automatic">
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Main" screenOptions={{headerShown: false}}>
              <Stack.Screen name="test">
                {(props) => <Main {...props} setIsEnglish={setIsEnglish}></Main>}
              </Stack.Screen>
              <Stack.Screen
                  name="Map"
                  component={Map}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ScrollView>
      </SafeAreaView>
    </languageContext.Provider>

  );
};

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
    marginVertical: 50
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

export default App;
