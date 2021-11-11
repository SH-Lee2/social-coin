import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import auth from "@react-native-firebase/auth";
import { ActivityIndicator, Alert } from "react-native";
import { ProfileImg } from "./Profile";
import * as ImagePicker from "expo-image-picker";
import firestore from "@react-native-firebase/firestore";
import { AuthContext } from "../navigators/AuthProvider";

const Container = styled.View`
    background-color: #1e272e;
    flex: 1;
    align-items: center;
    color: white;
    padding-top: 20;
`;
const ImgContainer = styled.TouchableOpacity`
    padding-bottom: 20;
`;
const TextInput = styled.TextInput`
    width: 100%;
    padding-top: 10
    padding-bottom : 10
    padding-right: 20;
    padding-left: 20;
    border-radius: 20;
    margin-bottom: 10;
    font-size: 16;
    color: white;
    background-color: rgba(255, 255, 255, 0.5);
`;
const Btn = styled.TouchableOpacity`
    width: 100%;
    padding-top: 10
    padding-bottom : 10
    padding-right: 20;
    padding-left: 20;
    border-width: 1;
    border-radius: 20;
    border-color: rgba(255, 255, 255, 0.5);
    justify-content: center;
    align-items: center;
`;
const BtnText = styled.Text`
    color: white;
    font-size: 16;
`;

const Join = () => {
    const emailInput = useRef();
    const passwordInput = useRef();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);

    const onSubmitNameEditing = () => {
        emailInput.current.focus();
    };

    const onSubmitEditing = () => {
        passwordInput.current.focus();
    };
    const onSubmitPasswordEditing = async () => {
        if (email === "" || password === "") {
            return Alert.alert("Fill in the form.");
        }
        if (loading) {
            return;
        }
        setLoading(true);
        try {
            await auth()
                .createUserWithEmailAndPassword(email, password)
                .then(() => {
                    firestore()
                        .collection("users")
                        .doc(auth().currentUser.uid)
                        .set({
                            user_name: name,
                            email,
                            owner_id: auth().currentUser.uid,
                            profile_picture: image,
                        });
                })
                .catch((error) => alert(error.message));
        } catch (e) {
            switch (e.code) {
                case "auth/weak-password": {
                    Alert.alert("Write a stronger password!");
                }
            }
        }
    };
    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const { status } =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    alert(
                        "Sorry, we need camera roll permissions to make this work!"
                    );
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            console.log(result.path);
            setImage(result.uri);
        }
    };
    return (
        <Container>
            <ImgContainer onPress={() => pickImage()}>
                <ProfileImg
                    source={{
                        uri: image
                            ? image
                            : "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
                    }}
                />
            </ImgContainer>
            <TextInput
                placeholder="닉네임"
                autoCapitalize="none"
                autoCorrect={false}
                value={name}
                returnKeyType="next"
                onChangeText={(text) => setName(text)}
                onSubmitEditing={onSubmitNameEditing}
                placeholderTextColor={"rgba(255, 255, 255, 0.7)"}
            />
            <TextInput
                ref={emailInput}
                placeholder="Email"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                value={email}
                returnKeyType="next"
                onChangeText={(text) => setEmail(text)}
                onSubmitEditing={onSubmitEditing}
                placeholderTextColor={"rgba(255, 255, 255, 0.7)"}
            />
            <TextInput
                ref={passwordInput}
                placeholder="Password"
                secureTextEntry
                value={password}
                returnKeyType="done"
                onChangeText={(text) => setPassword(text)}
                onSubmitEditing={() => register(email, password, name, image)}
                placeholderTextColor={"rgba(255, 255, 255, 0.7)"}
            />
            <Btn onPress={() => register(email, password, name, image)}>
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <BtnText>Create Account</BtnText>
                )}
            </Btn>
        </Container>
    );
};
export default Join;
