import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import { Icon } from "../components/Coin";
import firestore from "@react-native-firebase/firestore";
import {
    Keyboard,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    View,
    ScrollView,
} from "react-native";
import Post from "../components/Post";
import { AuthContext } from "../navigators/AuthProvider";

const Container = styled.View`
    background-color: #1e272e;
    flex: 1;
    justify-content: center;
`;

export const List = styled.FlatList`
    padding-top: 20;
    padding-left: 20;
`;
const Wrapper = styled.TouchableOpacity`
    flex-direction: row;
    background-color: white;
    height: 60;
    align-items: center;
    padding-left: 5;
    position: absolute;
    bottom: 0;
    width: 100%;
`;
// 나중에 이미지로 변경
const UserAvatar = styled.Image`
    border-radius: 100;
    width: 50;
    height: 50;
    padding-left: 10;
`;
const CommentText = styled.Text`
    flex :1
    color : gray
    background-color: white;
    padding-left : 20
    `;

const Community = ({
    navigation,
    route: {
        params: { symbol, id },
    },
}) => {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Icon
                    source={{
                        uri: `https://cryptoicon-api.vercel.app/api/icon/${symbol.toLowerCase()}`,
                    }}
                />
            ),
        });
    }, []);

    useEffect(() => {
        firestore()
            .collection("user")
            .doc(user.uid)
            .onSnapshot((snapshot) => {
                setUserData(snapshot.data());
            });
    }, []);

    useEffect(() => {
        firestore()
            .collection(id)
            .orderBy("createAd", "desc")
            .onSnapshot((snapshot) => {
                setPosts(snapshot.docs.map((doc) => doc.data()));
            });
        setLoading(true);
    }, []);
    return (
        <Container>
            {!loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <List
                    data={posts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <Post index={index} item={item} />
                    )}
                />
            )}

            <Wrapper
                activeOpacity={1}
                onPress={() =>
                    navigation.navigate("의견", { userData, id, symbol })
                }
            >
                <UserAvatar
                    source={{
                        uri: userData.profile_picture
                            ? userData.profile_picture
                            : "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
                    }}
                />

                <CommentText>{userData.user_name} 으로 의견 남기기</CommentText>
            </Wrapper>
        </Container>
    );
};

export default Community;
// Keyboard.dismiss 키보드 입력하다 다른데 클릭하면 없애줌
