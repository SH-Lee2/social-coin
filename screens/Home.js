import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components/native";
import { ActivityIndicator, View } from "react-native";
import { coins } from "../api";
import Coin from "../components/Coin";

export const Container = styled.View`
    background-color: #1e272e;
    flex: 1;
`;
export const Loader = styled.View`
    flex: 1;
    background-color: #1e272e;
    justify-content: center;
    align-items: center;
`;

export const List = styled.FlatList`
    padding: 20px 10px;
    width: 100%;
`;
const Home = () => {
    const { isLoading, data } = useQuery("coins", coins);
    const [cleanData, setCleanData] = useState([]);
    console.log("Home");
    useEffect(() => {
        if (data) {
            setCleanData(
                data.filter(
                    (coin) => coin.rank != 0 && coin.is_active && !coin.is_new
                )
            );
        }
    }, [data]);
    if (isLoading) {
        return (
            <Loader>
                <ActivityIndicator color="white" size="large" />
            </Loader>
        );
    }
    return (
        <Container>
            <List
                data={cleanData}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                //열
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                }}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <Coin index={index} symbol={item.symbol} id={item.id} />
                )}
            />
        </Container>
    );
};
export default Home;
