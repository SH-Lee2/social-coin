import { useNavigation } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/native";
import firestore from "@react-native-firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Alert, Pressable, TouchableOpacity } from "react-native";
import { AuthContext } from "../navigators/AuthProvider";
import { get } from "react-native/Libraries/Utilities/PixelRatio";

export const Container = styled.View`
    flex: 1;
    flex-direction : row
    align-items : flex-start
    border-bottom-color: gray
    border-bottom-width: 1
    padding-top : 20
    padding-bottom :20
    padding-right : 20
`;
export const UserAvatar = styled.Image`
    border-radius: 100;
    width: 40;
    height: 40;
`;
export const Wrapper = styled.View`
    padding-left: 20;
    flex: 1;
`;
export const PostHeader = styled.View`
    flex-direction: row;
    align-items: center;
`;
export const PostDisplayName = styled.Text`
    color: white;
    margin-right: 20
    font-size: 14;
`;
export const PostCreateAd = styled.Text`
    color: white;
    font-size: 12;
`;
export const PostTitle = styled.View`
    margin-top: 10;
`;
export const PostTitleText = styled.Text`
    color: white;
    font-size: 16;
`;
export const IconWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    margin-top: 15;
`;

const Post = ({ item, userData, screen }) => {
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const deleteUserOpnion = async () => {
        const ref = firestore().collection("user");
        const totalID = await firestore()
            .collection(item.coin_id)
            .doc(item.opnion_id)
            .collection("comments")
            .get()
            .then((doc) => doc.docs.map((d) => d.data().owner_id));
        console.log(totalID);
        // user에 댓글 삭제
        // 다른사람이 의견을 삭제하면 의견에 달린 댓글 도 삭제 됨 그때 댓글을 단  모든 유저 댓글이 삭제
        totalID.forEach((user) =>
            ref
                .doc(user)
                .collection("comments")
                .get()
                .then((doc) => {
                    doc.docs.filter((v) => {
                        if (v.id === v.data().comment_id) v.ref.delete();
                    });
                })
        );
        // user에 의견 삭제
        ref.doc(user.uid).collection("opnions").doc(item.opnion_id).delete(); //
    };

    const deleteCoinOpnion = () => {
        //collection 하위 doc 모두 삭제
        const ref = firestore()
            .collection(item.coin_id)
            .doc(item.opnion_id)
            .collection("comments");
        ref.get().then((querySnapshot) => {
            Promise.all(querySnapshot.docs.map((d) => d.ref.delete()));
        });
        firestore().collection(item.coin_id).doc(item.opnion_id).delete();
    };

    const deleteUserComment = () => {
        firestore()
            .collection("user")
            .doc(user.uid)
            .collection("comments")
            .doc(item.comment_id)
            .delete();
    };
    const deleteCoinComment = () => {
        firestore()
            .collection(item.coin_id)
            .doc(item.opnion_id)
            .collection("comments")
            .doc(item.comment_id)
            .delete();
    };
    return (
        <Pressable
            onLongPress={() => {
                if (user.uid === item.owner_id) {
                    Alert.alert(
                        `${screen === "opnion" ? "의견" : "댓글"} 삭제`,
                        `${
                            screen === "opnion" ? "의견" : "댓글"
                        }을 삭제하시겠습니까?`,
                        [
                            {
                                text: "취소",
                                onPress: () => console.log("Cancel Pressed"),
                            },
                            {
                                text: "네",
                                onPress: () => {
                                    {
                                        screen === "opnion"
                                            ? (deleteUserOpnion(),
                                              deleteCoinOpnion())
                                            : (deleteUserComment(),
                                              deleteCoinComment());
                                    }
                                },
                            },
                        ]
                    );
                }
            }}
            delayLongPress={500}
        >
            <Container>
                <UserAvatar
                    source={{
                        uri: item.owner_profile_picture
                            ? item.owner_profile_picture
                            : item.coin_symbol
                            ? `https://cryptoicon-api.vercel.app/api/icon/${item.coin_symbol.toLowerCase()}`
                            : "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
                    }}
                />

                <Wrapper>
                    <PostHeader>
                        <PostDisplayName>
                            {item.owner_name
                                ? item.owner_name
                                : `${item.coin_symbol}에 쓴 ${
                                      screen === "comment" ? "댓글" : "의견"
                                  }`}
                        </PostDisplayName>
                        <PostCreateAd>1분전</PostCreateAd>
                    </PostHeader>
                    <PostTitle>
                        <PostTitleText>{item.comment}</PostTitleText>
                    </PostTitle>

                    <IconWrapper>
                        <Entypo name="heart" size={24} color="gray" />
                        {screen !== "comment" && (
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("추가", {
                                        item,
                                        userData,
                                    })
                                }
                            >
                                <FontAwesome
                                    name="commenting-o"
                                    size={24}
                                    color="gray"
                                    style={{ paddingLeft: 30 }}
                                />
                            </TouchableOpacity>
                        )}
                    </IconWrapper>
                </Wrapper>
            </Container>
        </Pressable>
    );
};
export default Post;
