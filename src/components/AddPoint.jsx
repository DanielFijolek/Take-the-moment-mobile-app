import React, {useState, useEffect, useContext, useRef} from 'react';
import {
    StyleSheet,
    useColorScheme,
    View,
    TextInput,
    Button,
    Text, Alert
} from 'react-native';
import {Colors} from "react-native/Libraries/NewAppScreen";
import {languageContext} from "../../App";
import {Camera, useCameraDevices} from "react-native-vision-camera";
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const createStyles = (isDarkMode) => StyleSheet.create({
    body: {
        position: 'relative',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        height: "100%",
        width: "100%",
    },
    topBar: {
        display: "flex",
        flexDirection: "row",
        alignSelf: "flex-end",
        alignItems: "center",
        paddingRight: 5,
        gap: 2,
    },
    input: {
        color: isDarkMode ? Colors.white : Colors.black,
        borderColor: isDarkMode ? Colors.white : Colors.black,
        width: 300,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    inputsContainer: {
        display: 'flex',
        justifyContent: "space-evenly",
        height: "80%",
    },
    cam: {
        height: 400,
        width: 300,
    }
});

const AddPoint = ({setOpen, latlong}) => {
    const isDarkMode = useColorScheme() === 'dark';
    const styles = createStyles(isDarkMode);
    const [name, setName] = useState('Test name');
    const isEnglish = useContext(languageContext)
    const [photo, setPhoto] = useState('')
    const camera = useRef(null)
    const devices = useCameraDevices()
    const device = devices.back

    const takePhotoOptions = {
        qualityPrioritization: 'speed',
        flash: 'off'
    };

    const takePhoto = async () => {
        try {
            if (camera.current == null) throw new Error('Camera Ref is Null');
            console.log('Photo taking ....');
            const newPhoto = await camera.current.takePhoto(takePhotoOptions);
            setPhoto(newPhoto.path)
        } catch (error) {
            console.log(error);
        }
    };

    const savePoint = async () => {
        const photoName = photo.split("/")[photo.split("/").length - 1]
        const reference = storage().ref(photoName);
        setOpen(false);

        const task = await reference.putFile(photo);
        const point = {
            coordinate: {
                latitude: latlong.latitude,
                longitude: latlong.longitude
            },
            photo: task.metadata.fullPath,
            name
        }

        firestore()
          .collection('Points')
          .add(point)
          .then(() => {
            console.log('Point added');
          });
    }

    if (device == null) return (
        <View style={styles.body}><Text>{isEnglish? 'Loading...': 'Ładuje stronę...'}</Text>
        </View>
    )
    return (
        <View style={styles.body}>
            <View style={styles.topBar}>
                <Button title={'x'} onPress={() => setOpen(false)}/>

            </View>
            <View style={styles.inputsContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    value={name}/>
                <Camera
                    ref={camera}
                    style={styles.cam}
                    device={device}
                    isActive={true}
                    photo={true}
                />
                <Button title={isEnglish ? 'Take photo' : "Zrób zdjęcie"}
                        onPress={() => takePhoto()}
                />
                <Button disabled={!photo} title={isEnglish ? 'Add Point' : "Dodaj punkt"}
                        onPress={() => savePoint()}/>
            </View>
        </View>

    )
}

export default  AddPoint