import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../navigators/AuthProvider";
import { Container, List } from "./Home";
import firestore from "@react-native-firebase/firestore";
import Coin from "../components/Coin";
import { View } from "react-native";

const Like = () => {
    const { user } = useContext(AuthContext);
    const [pick, setPick] = useState([]);
    const getUserCoinPick = () => {
        firestore()
            .collection("user")
            .doc(user.uid)
            .onSnapshot((snapshot) => {
                snapshot.data().coins && setPick(snapshot.data().coins);
            });
    };
    useEffect(() => {
        getUserCoinPick();
    }, []);
    return (
        <Container>
            <List
                data={pick}
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

export default Like;
