import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useContext, useEffect, useState } from "react";
import Post from "../components/Post";
import firestore from "@react-native-firebase/firestore";
import { List } from "../screens/Community";
import { AuthContext } from "./AuthProvider";
import styled from "styled-components/native";
import { ActivityIndicator } from "react-native";
import TabBar from "../components/TabBar";

const Container = styled.View`
    flex : 1
    background-color: #1e272e;
    flex-direction: row
    justify-content : center

`;

const Empty = styled.Text`
    color: white;
    padding-top: 50%;
`;

const Nav = createMaterialTopTabNavigator();

const Opinion = () => {
    const { user, setUser } = useContext(AuthContext);
    const [commentsData, setCommentsData] = useState([]);
    const [loadging, setLoading] = useState(false);
    const getComments = async () => {
        await firestore()
            .collection("user")
            .doc(user.uid)
            .collection("opnions")
            .orderBy("createAd", "desc")
            .get()
            .then((snapshot) => {
                setCommentsData(snapshot.docs.map((doc) => doc.data()));
            });
    };
    useEffect(async () => {
        await getComments();
        setLoading(true);
    }, []);

    return (
        <Container>
            {loadging ? (
                commentsData.length !== 0 ? (
                    <List
                        data={commentsData}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => (
                            <Post index={index} item={item} />
                        )}
                    />
                ) : (
                    <Empty>작성한 의견이 없습니다.</Empty>
                )
            ) : (
                <ActivityIndicator color="white" />
            )}
        </Container>
    );
};

const Comments = () => {
    return (
        <Container>
            <Empty>작성한 댓글이 없습니다</Empty>
        </Container>
    );
};
const ProfileTab = () => {
    return (
        <Nav.Navigator
            tabBar={(props) => <TabBar {...props} screen={"profile"} />}
        >
            <Nav.Screen name="의견" component={Opinion} />
            <Nav.Screen name="댓글" component={Comments} />
        </Nav.Navigator>
    );
};

export default ProfileTab;
