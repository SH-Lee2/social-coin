import { Entypo, FontAwesome } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import Post, {
    IconWrapper,
    PostCreateAd,
    PostDisplayName,
    PostHeader,
    PostTitle,
    PostTitleText,
    UserAvatar,
} from "../components/Post";

import { AuthContext } from "../navigators/AuthProvider";
import firestore from "@react-native-firebase/firestore";
import { Keyboard } from "react-native";
import { List } from "./Community";

const Container = styled.View`
flex : 1
background-color: #1e272e;
`;

const Wrapper = styled.View`
    background-color: #2d3436;
    flex-direction: row;
    padding-top: 20;
    padding-bottom: 20;
    padding-left : 20
    padding-right : 20
`;

// commentInput

const CommentInputWrapper = styled.View`
    flex-direction: row;
    background-color: white;
    height: 60;
    align-items: center;
    padding-left: 5;
`;

const TextWrapper = styled.View`
    padding-left: 20;
    padding-right: 40;
`;
const CommentInput = styled.TextInput`
    padding-left: 20;
    flex: 1;
`;
const SubmitBtn = styled.TouchableOpacity`
    background-color: ${(props) => (props.disabled ? "#b2bec3" : "#0984e3")};
    height: 100%;
    justify-content: center;
    padding-left : 10
    padding-right : 10
    height: 60;

`;
const SubmitText = styled.Text`
    color: white;
`;

const AddComments = ({
    route: {
        params: { item, userData },
    },
}) => {
    const [comment, setComment] = useState(null);
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const commentToAddCoin = () => {
        firestore()
            .collection(item.coin_id)
            .doc(item.opnion_id)
            .collection("comments")
            .add({
                comment,
                owner_id: user.uid,
                owner_name: userData.user_name,
                owner_profile_picture: userData.profile_picture,
                like: null,
                coin_id: item.coin_id,
                createAd: Date.now() + 32400000,
                opnion_id: item.opnion_id,
            })
            .then((data) => {
                setComment(null);
                Keyboard.dismiss();
                firestore()
                    .collection(item.coin_id)
                    .doc(item.opnion_id)
                    .collection("comments")
                    .doc(data.id)
                    .update({ comment_id: data.id });
                commentToAddUser(data.id);
            });
    };
    const commentToAddUser = (commentId) => {
        firestore()
            .collection("user")
            .doc(user.uid)
            .collection("comments")
            .doc(commentId)
            .set({
                coin_symbol: item.symbol,
                coin_id: item.coin_id,
                comment_id: commentId,
                comment,
                createAd: Date.now() + 32400000,
            });
    };
    useEffect(() => {
        firestore()
            .collection(item.coin_id)
            .doc(item.opnion_id)
            .collection("comments")
            .orderBy("createAd", "desc")
            .onSnapshot((snapshot) => {
                setPosts(snapshot.docs.map((doc) => doc.data()));
            });
    }, []);
    const createdTime = new Date(item.createAd).toISOString().split("T");
    const fullDay = createdTime[0].substring(2);
    const fullTime = createdTime[1].substring(0, 5);
    return (
        <Container>
            <Wrapper>
                <UserAvatar source={{ uri: item.owner_profile_picture }} />
                <TextWrapper>
                    <PostHeader>
                        <PostDisplayName>{item.owner_name}</PostDisplayName>
                        <PostCreateAd>
                            {fullDay}
                            {"   "} {fullTime}
                        </PostCreateAd>
                    </PostHeader>
                    <PostTitle>
                        <PostTitleText>{item.comment}</PostTitleText>
                    </PostTitle>
                    <IconWrapper>
                        <Entypo name="heart" size={24} color="gray" />
                        <FontAwesome
                            name="commenting-o"
                            size={24}
                            color="gray"
                            style={{ paddingLeft: 30 }}
                        />
                    </IconWrapper>
                </TextWrapper>
            </Wrapper>
            <List
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <Post index={index} item={item} screen={"comment"} />
                )}
            />
            <CommentInputWrapper>
                <UserAvatar source={{ uri: item.owner_profile_picture }} />
                <CommentInput
                    placeholder="댓글을 남겨 주세요"
                    placeholderTextColor="gray"
                    onChangeText={(text) => setComment(text)}
                    value={comment}
                    onSubmitEditing={() => commentToAddCoin()}
                />
                <SubmitBtn
                    disabled={comment ? false : true}
                    activeOpacity={0.5}
                    onPress={() => commentToAddCoin()}
                >
                    <SubmitText commment={comment}>등록</SubmitText>
                </SubmitBtn>
            </CommentInputWrapper>
        </Container>
    );
};

export default AddComments;
