import React, {useState, useEffect, useContext} from 'react';
import {
    Alert,
    StyleSheet,
    useColorScheme,
    View,
    Button, Text, Image
} from 'react-native';
import {Colors} from "react-native/Libraries/NewAppScreen";
import storage from "@react-native-firebase/storage";
import {languageContext} from "../../App";
import firestore from "@react-native-firebase/firestore";

const createStyles = (isDarkMode) => StyleSheet.create({
    body: {
        display: "flex",
        position: "relative",
        flexDirection: "column",
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        height: "100%",
        width: "100%",
    },
    text: {
        marginTop: 50,
        color: isDarkMode ? Colors.white : Colors.black
    },
    image: {
        marginTop: 30,
        marginBottom: 20,
        width: 300,
        height: 400
    },
    topBar: {
        display: "flex",
        flexDirection: "row",
        alignSelf: "flex-end",
        alignItems: "center",
        paddingRight: 5,
        gap: 2,
    },
    inputsContainer: {
        display: 'flex',
        alignItems: "center",
        columnGap: 5,
        height: "80%",
    },
});

const Point = ({name, photo, setOpen}) => {
    const isDarkMode = useColorScheme() === 'dark';
    const styles = createStyles(isDarkMode);
    const [photoUrl, setPhotoUrl] = useState('')
    const isEnglish = useContext(languageContext)

    useEffect(() => {
        const getPhotoUrl = async () => {
            setPhotoUrl(await storage().ref(photo).getDownloadURL())
        }
        getPhotoUrl().catch(e => console.log(e))
    })

    const deletePoint = async () => {
        let doc =  await firestore()
            .collection('Points')
            .where('name', '==', name)
            .get()

        firestore()
          .collection('Points')
          .doc(doc.docs[0].ref.path.split('/')[1])
          .delete()
          .then(() => {
            console.log('User deleted!');
            setOpen(false);
          });
    }

    return(
        <View style={styles.body}>
            <View style={styles.topBar}>
                <Button title={'x'} onPress={() => setOpen(false)}/>
            </View>
            <View style={styles.inputsContainer}>
                <Text style={styles.text}>{name}</Text>
                {!!photoUrl? <Image style={styles.image} source={{uri: photoUrl}}/> :
                    <Text style={styles.text}> {isEnglish? 'Loading image': 'Ładuję zdjęcie'} </Text>}
                <Button title={isEnglish? 'Delete photo': 'Usuń zdjęcie'}
                        onPress={() => deletePoint()}
                />
            </View>
        </View>
    )
};

export default Point;