import { useAssets } from "expo-asset";
import { UserInterfaceIdiom } from "expo-constants";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import { EditBtn, EditText, ProfileImg } from "./Profile";
import * as ImagePicker from "expo-image-picker";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import {
    Alert,
    Dimensions,
    Keyboard,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";
import { AuthContext } from "../navigators/AuthProvider";

const Container = styled.View`
    background-color: #1e272e;
    flex: 1;
    align-items: center;
    padding-top: 40;
`;

//프로필 사진
const ProfileImgClick = styled.TouchableOpacity``;

// 닉네임
const DisplayNameTitle = styled.Text`
    margin-top : 30
    color: white;
    font-size : 20
`;
const DisplayNameInput = styled.TextInput`
    color: white;
    font-size: 18;
    margin-top: 10;
    padding-bottom : 10
    width: ${Dimensions.get("window").width / 2};
    text-align: center;
    border-bottom-width: 2;
    border-color: gray;
`;

const Edit = ({
    navigation,
    route: {
        params: { userData },
    },
}) => {
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState([]);

    navigation.setOptions({
        headerRight: () => (
            <EditBtn
                onPress={() => {
                    if (
                        user.user_name !== name ||
                        user.profile_picture !== image
                    ) {
                        updateProfile();
                    }
                }}
            >
                <EditText>저장</EditText>
            </EditBtn>
        ),
    });

    const uploadImg = async (Img) => {
        const filename = Img.substring(Img.lastIndexOf("/") + 1);
        const storageRef = storage().ref(`photos/${filename}`);
        const task = storageRef.putFile(Img);
        try {
            await task;
            const url = await storageRef.getDownloadURL();
            return url;
        } catch (e) {
            console.log("이미지 다운 실패");
        }
    };
    const updateProfile = async () => {
        const imageUrl = await uploadImg(image);
        await firestore()
            .collection("user")
            .doc(user.uid)
            .update({
                user_name: !name ? userData.user_name : name,
                profile_picture: !image ? userData.profile_picture : imageUrl,
            })
            .then(() => {
                updateComment();
                Alert.alert("프로필 변경 완료");
            })
            .catch((e) => console.log("update fail : ", e));
        Keyboard.dismiss();
    };

    const getComment = () => {
        firestore()
            .collection("user")
            .doc(user.uid)
            .collection("comments")
            .get()
            .then((doc) => setComments(doc.docs.map((doc) => doc.data())));
    };

    const updateComment = async () => {
        getComment();
        comments.forEach(async (doc) => {
            await firestore()
                .collection(doc.coin_id)
                .doc(doc.comment_id)
                .update({
                    owner_name: !name ? userData.user_name : name,
                    owner_profile_picture: !image
                        ? userData.profile_picture
                        : imageUrl,
                });
        });
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

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Container>
                <ProfileImgClick onPress={() => pickImage()}>
                    <ProfileImg />
                    <ProfileImg
                        source={{
                            uri:
                                image.length === 0
                                    ? userData.profile_picture
                                    : image,
                        }}
                    />
                </ProfileImgClick>
                <DisplayNameTitle> 닉네임</DisplayNameTitle>
                <DisplayNameInput
                    maxLength={10}
                    placeholder={userData.user_name}
                    value={name}
                    placeholderTextColor="gray"
                    onChangeText={(text) => setName(text)}
                />
            </Container>
        </TouchableWithoutFeedback>
    );
};

export default Edit;
