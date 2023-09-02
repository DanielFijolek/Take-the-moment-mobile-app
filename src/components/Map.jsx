import React, {useState, useEffect, useContext} from 'react';
import {
    Alert,
    StyleSheet,
    useColorScheme,
    View,
    Button, Image
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {Colors} from "react-native/Libraries/NewAppScreen";
import Geolocation from "react-native-geolocation-service";
import {languageContext} from "../../App";
import AddPoint from "./AddPoint";
import firestore from "@react-native-firebase/firestore";
import Point from "./Point";
import CustomMarker from "../../marker.png"

const createStyles = (isDarkMode) => StyleSheet.create({
    body: {
        display: "flex",
        position: "relative",
        flexDirection: "column",
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        height: "100%",
        width: "100%",
    },
    map: {
        zIndex: 5,
        height: "95%",
        width: "100%",
    },
    buttonContainer: {
        zIndex: 10,
        height: "5%"
    }
});

const initLoc = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
}
const Map = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const styles = createStyles(isDarkMode);
    const [userLocation, setUserLocation] = useState(initLoc);
    const [markerLoc, setMarkerLoc] = useState(initLoc);
    const [openAddPoint, setOpenAddPoint] = useState(false)
    const [points, setPoints] = useState([]);
    const [openPoint, setOpenPoint] = useState(false)
    const [point, setPoint] = useState({name:"", photo: ""})
    const isEnglish = useContext(languageContext)

    function onResult(QuerySnapshot) {
      setPoints(QuerySnapshot.docs.map((e) => e.data()));
    }

    function onError(error) {
      console.error(error);
    }

    useEffect(() => {
        Geolocation.getCurrentPosition(
            position => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setMarkerLoc({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });

            },
            error => {
                Alert.alert(error.message.toString());
            },
            {
                showLocationDialog: true,
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0
            }
        );

        const subscriber = firestore()
          .collection('Points').onSnapshot(onResult, onError);

        return () => subscriber();
    },[])

    const handleOpenPoint = (name, photo) => {
        setPoint({name, photo})
        setOpenPoint(true)
    }

    useEffect(() => {
        setMarkerLoc({
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                })
    }, [points])

    return (
        <View style={styles.body}>
            {openAddPoint || openPoint ?
                (openAddPoint? <AddPoint setOpen={setOpenAddPoint} latlong={markerLoc}/> : <Point {...point} setOpen={setOpenPoint}/>) :
            (<>
                <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    region={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        draggable
                        coordinate={{
                            latitude: markerLoc.latitude,
                            longitude: markerLoc.longitude,
                        }}
                        onDragEnd={(e) => setMarkerLoc(e.nativeEvent.coordinate)}>
                        <Image source={CustomMarker} style={{height: 40, width:40 }} />
                    </Marker>
                    {points.map((point) => {
                        return (<Marker
                            key={point.photo}
                            coordinate={{
                            latitude: point.coordinate.latitude,
                            longitude: point.coordinate.longitude,
                            }}
                            onPress={() => handleOpenPoint(point.name, point.photo)}
                        />)
                        })
                    }
                </MapView>
                <View style={styles.buttonContainer}>
                    <Button
                    style={styles.openAddPointsButton}
                    title={isEnglish ? 'Add point' : 'Dodaj punkt'}
                    onPress={() => setOpenAddPoint(true)}/>
                </View>

            </>)
            }
        </View>
    )
}

export default Map;