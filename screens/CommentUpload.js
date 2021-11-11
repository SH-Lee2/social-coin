import React, { useContext, useRef, useState } from "react";
import { Button, Keyboard, Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import firestore from "@react-native-firebase/firestore";
import { AuthContext } from "../navigators/AuthProvider";

const Wrapper = styled.View`
    background-color: #1e272e;
    flex: 1;
`;

const TextInput = styled.TextInput`
    padding: 20px;
    color: white;
`;

const CommentUpload = ({
    navigation,
    route: {
        params: { id, userData, symbol },
    },
}) => {
    const [comment, setComment] = useState("");
    const { user } = useContext(AuthContext);

    const onAddComment = () => {
        firestore()
            .collection(`${id}`)
            .add({
                comment: `${comment}`,
                owner_id: user.uid,
                owner_name: userData.user_name,
                owner_profile_picture: userData.profile_picture,
                like: null,
                comments: null,
                createAd: Date.now(),
            })
            .then((data) => {
                console.log("User added!");
                onAddUserComment(data.id);
            });
    };
    const onAddUserComment = (commentId) => {
        firestore()
            .collection("user")
            .doc(user.uid)
            .collection("comments")
            .add({
                coin_symbol: symbol,
                coin_id: id,
                comment_id: commentId,
                comment,
                createAd: Date.now(),
            });
    };
    const onSubmit = async () => {
        await onAddComment();
        navigation.goBack();
    };
    navigation.setOptions({
        headerRight: () => (
            <TouchableOpacity
                onPress={
                    () => (!comment ? Keyboard.dismiss() : onSubmit())
                    // console.log(comment)
                }
            >
                <Text
                    style={{
                        color: "white",
                    }}
                >
                    남기기
                </Text>
            </TouchableOpacity>
        ),
    });
    return (
        <Wrapper>
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                multiline={true}
                numberOfLines={5}
                value={comment}
                placeholder="의견을 남겨 주세요."
                placeholderTextColor="gray"
                autoFocus={true}
                onChangeText={(text) => setComment(text)}
                textAlignVertical="top"
            />
        </Wrapper>
    );
};
export default CommentUpload;
