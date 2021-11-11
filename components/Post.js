import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import firestore from "@react-native-firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { DatePickerIOSBase, TouchableOpacity } from "react-native";
const Container = styled.View`
    flex: 1;
    flex-direction : row
    align-items : flex-start
    border-bottom-color: gray;
    border-bottom-width: 1
    padding-top : 20;
    padding-bottom :10
    
`;
const UserAvatar = styled.Image`
    border-radius: 100;
    width: 40;
    height: 40;
`;
const Wrapper = styled.View`
    padding-left: 20;
`;
const PostHeader = styled.View`
    flex-direction: row;
    align-items: center;
`;
const PostDisplayName = styled.Text`
    color: white;
    margin-right: 20
    font-size: 14;
`;
const PostCreateAd = styled.Text`
    color: white;
    font-size: 12;
`;
const PostTitle = styled.View`
    margin-top: 10;
`;
const PostTitleText = styled.Text`
    color: white;
    font-size: 16;
`;
const IconWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 15;
`;

const Post = ({ item }) => {
    const navigation = useNavigation();
    return (
        <Container>
            {item.owner_profile_picture ? (
                <UserAvatar source={{ uri: item.owner_profile_picture }} />
            ) : (
                <UserAvatar
                    source={{
                        uri: `https://cryptoicon-api.vercel.app/api/icon/${item.coin_symbol.toLowerCase()}`,
                    }}
                />
            )}
            <Wrapper>
                <PostHeader>
                    <PostDisplayName>
                        {item.owner_name
                            ? item.owner_name
                            : `${item.coin_symbol}에 쓴 의견`}
                    </PostDisplayName>
                    <PostCreateAd>1분전</PostCreateAd>
                </PostHeader>
                <PostTitle>
                    <PostTitleText>{item.comment}</PostTitleText>
                </PostTitle>
                <IconWrapper>
                    <Entypo name="heart" size={24} color="gray" />
                    <TouchableOpacity
                        onPress={() => navigation.navigate("추가", {})}
                    >
                        <FontAwesome
                            name="commenting-o"
                            size={24}
                            color="gray"
                        />
                    </TouchableOpacity>
                </IconWrapper>
            </Wrapper>
        </Container>
    );
};
export default Post;
