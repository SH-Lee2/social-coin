import React, { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useQuery } from "react-query";
import styled from "styled-components/native";
import { coinTickers, history, info } from "../api";
import { Icon } from "../components/Coin";
import firestore from "@react-native-firebase/firestore";
import { AuthContext } from "../navigators/AuthProvider";
import { Entypo } from "@expo/vector-icons";
import { VictoryChart, VictoryLine, VictoryScatter } from "victory-native";

const ClickLike = styled.TouchableOpacity``;

const Container = styled.ScrollView`
    background-color: #1e272e;
    padding-left: 10;
    padding-right : 10
    flex: 1;
`;
const CoinInfoWrapper = styled.View`
    flex: 1;
`;
const Wrapper = styled.View`
    margin-top: 30
    background-color: rgba(255, 255, 255, 0.1);
    padding-left : 20;
    padding-right : 20;
    margin-bottom : 10

`;
const CommuntityHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-top: 10;
`;
const CommuntiyTitle = styled.Text`
    font-size: 20;
    color: white;
`;
const CommunityCount = styled.Text`
    font-size: 20;
    color: white;
`;
const CommentWrapper = styled.View`
    justify-content: center;
    padding-top : 20
    padding-bottom : 20
`;
const Comment = styled.Text`
    color : white
    font-size : 15
`;

const CoinInfoTitle = styled.Text`
    color: white;
    font-size: 20;
    padding-bottom: 10;
`;

const HeaderWrapper = styled.View`
    align-items: center;
    padding-top: 5;
    padding-bottom: 5;
`;

const Price = styled.Text`
    color: ${(props) => (props.rate > 0 ? "green" : "red")}
    font-size: 16
`;
const Detail = ({
    navigation,
    route: {
        params: { id, symbol },
    },
}) => {
    const { user } = useContext(AuthContext);
    const [commentCount, setCommentCount] = useState("");
    const [lastComment, setLastComment] = useState("");
    const [pick, setPick] = useState(false);
    const [price, setPrice] = useState(null);
    const [rate, setRate] = useState(null);
    const { isLoading: coinTickersLoading, data: coinTickersData } = useQuery(
        ["coinTickers", id],
        coinTickers
    );

    const { isLoading: infoLoading, data: infoData } = useQuery(
        ["coinInfo", id],
        info
    );
    const { isLoading: historyLoading, data: historyData } = useQuery(
        ["coinHistory", id],
        history
    );
    firestore()
        .collection("user")
        .doc(user.uid)
        .get()
        .then((doc) =>
            doc.data().coins.filter((v) => {
                if (v === id) setPick(true);
            })
        );
    const clickLike = () => {
        setPick(!pick);
        firestore()
            .collection("user")
            .doc(user.uid)
            .update({
                coins: pick
                    ? firestore.FieldValue.arrayRemove(id)
                    : firestore.FieldValue.arrayUnion(id),
            });
    };
    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <HeaderWrapper>
                    <Icon
                        source={{
                            uri: `https://cryptoicon-api.vercel.app/api/icon/${symbol.toLowerCase()}`,
                        }}
                    />
                    {!coinTickersData ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Price rate={rate}>
                            $ {price}
                            {"  "} {rate}%
                        </Price>
                    )}
                </HeaderWrapper>
            ),
            headerRight: () => (
                <ClickLike onPress={() => clickLike()}>
                    {pick ? (
                        <Entypo name="heart" size={24} color="pink" />
                    ) : (
                        <Entypo name="heart" size={24} color="gray" />
                    )}
                </ClickLike>
            ),
        });
    }, [pick]);
    useEffect(() => {
        firestore()
            .collection(`${id}`)
            .orderBy("createAd", "desc")
            .onSnapshot((doc) => {
                setCommentCount(doc.size);
                doc.docs.length
                    ? setLastComment(doc.docs[0].data().comment)
                    : setLastComment("댓글 없음");
            });
    }, []);

    const roundToTwo = (num) => {
        return +(Math.round(num + "e+2") + "e-2");
    };

    useEffect(() => {
        if (coinTickersData) {
            const {
                quotes: {
                    USD: { price, percent_change_15m },
                },
            } = coinTickersData;
            setPrice(roundToTwo(price));
            setRate(percent_change_15m);
        }
    }, [coinTickersData]);

    const [victoryData, setVictoryData] = useState(null);
    useEffect(() => {
        if (historyData) {
            setVictoryData(
                historyData.map((price) => ({
                    x: new Date(price.timestamp).getTime(),
                    y: price.price,
                }))
            );
        }
    }, [historyData]);

    return (
        <Container refreshControl={<RefreshControl />}>
            {!victoryData ? (
                <ActivityIndicator color="white" />
            ) : (
                <VictoryChart height={Dimensions.get("window").height / 2}>
                    <VictoryLine
                        animate
                        interpolation="monotoneX"
                        data={victoryData}
                        style={{ data: { stroke: "#1abc9c" } }}
                    />
                    <VictoryScatter
                        data={victoryData}
                        style={{ data: { fill: "#1abc9c" } }}
                    />
                </VictoryChart>
            )}
            {!infoLoading ? (
                <CoinInfoWrapper>
                    <CoinInfoTitle>코인 설명</CoinInfoTitle>
                    <Text
                        style={{
                            color: "white",
                        }}
                    >
                        {infoData.description
                            ? infoData.description
                            : "코인 정보가 없습니다."}
                    </Text>
                </CoinInfoWrapper>
            ) : (
                <ActivityIndicator color="white" />
            )}

            <Wrapper>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("Community", { symbol, id })
                    }
                >
                    <CommuntityHeader>
                        <CommuntiyTitle>커뮤니티</CommuntiyTitle>
                        <CommunityCount>{commentCount} &gt;</CommunityCount>
                    </CommuntityHeader>
                    <CommentWrapper>
                        <Comment>{lastComment}</Comment>
                    </CommentWrapper>
                </TouchableOpacity>
            </Wrapper>
        </Container>
    );
};

export default Detail;
