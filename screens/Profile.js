import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import firestore from "@react-native-firebase/firestore";
import { AuthContext } from "../navigators/AuthProvider";
import ProfileTab from "../navigators/ProfileTab";
import { Entypo } from "@expo/vector-icons";
import { List } from "./Community";
import Post from "../components/Post";
import { ActivityIndicator } from "react-native";

const Container = styled.View`
    background-color: #1e272e;
    flex: 1;
`;

//프로필 상단
const Wrapper = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding-left : 20
    padding-right : 20
    padding-top : 20
    padding-bottom : 20

`;
const UserInfo = styled.View`
    flex: 1;
    justify-content: space-between;
`;
const Name = styled.Text`
    color: white;
    font-size: 25;
`;
const CommentWrapper = styled.View``;

const Comment = styled.Text`
    color: white;
    font-size: 16;
`;
export const ProfileImg = styled.Image`
    width: 100;
    height: 100;
    border-radius: 100;
`;

//편집
export const EditBtn = styled.TouchableOpacity``;
export const EditText = styled.Text`
    color: white;
`;

const Profile = ({ navigation }) => {
    const { user, setUser } = useContext(AuthContext);
    const [userData, setUserData] = useState([]);
    const [commentSize, setCommentSize] = useState(null);
    navigation.setOptions({
        headerRight: () => (
            <EditBtn onPress={() => navigation.navigate("편집", { userData })}>
                <EditText>편집</EditText>
            </EditBtn>
        ),
    });

    const getUserData = () => {
        firestore()
            .collection("user")
            .doc(user.uid)
            .onSnapshot((snapshot) => {
                setUserData(snapshot.data());
            });
    };
    const getOpnionCount = () => {
        firestore()
            .collection("user")
            .doc(user.uid)
            .collection("opnions")
            .get()
            .then((snapshot) => {
                setCommentSize(snapshot.size);
            });
    };
    useEffect(() => {
        getUserData();
        getOpnionCount();
    }, []);
    return (
        <Container>
            <Wrapper>
                <UserInfo>
                    <Name>
                        {userData ? userData.user_name : user.displayName}
                    </Name>
                    <CommentWrapper>
                        <Comment>
                            <Entypo name="edit" size={18} color="gray" /> 의견{" "}
                            {commentSize}
                        </Comment>
                    </CommentWrapper>
                </UserInfo>
                <EditBtn
                    onPress={() => navigation.navigate("편집", { userData })}
                >
                    <ProfileImg
                        source={{
                            uri: userData.profile_picture
                                ? userData.profile_picture
                                : "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
                        }}
                    />
                </EditBtn>
            </Wrapper>

            <ProfileTab />
        </Container>
    );
};
export default Profile;

// 시간되면 페이지 이동시 이미지 미리 다운로드 하는거 설정
