import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AddComments from "../screens/AddComments";
import CommentUpload from "../screens/CommentUpload";
import Community from "../screens/Community";
import Detail from "../screens/Detail";
import Edit from "../screens/Edit";
import Profile from "../screens/Profile";
import TopTab from "./TopTab";

const Nav = createNativeStackNavigator();

const InNav = () => {
    return (
        <Nav.Navigator
            screenOptions={{
                // animation: "slide_from_right",
                presentation: "fullScreenModal",
                headerStyle: {
                    backgroundColor: "#1e272e",
                },
                headerTintColor: "white",
                headerTitleAlign: "center",
            }}
        >
            <Nav.Screen
                name="코인"
                component={TopTab}
                options={{
                    headerShown: false,
                }}
            />
            <Nav.Screen name="Detail" component={Detail} />
            <Nav.Screen name="Community" component={Community} />
            <Nav.Screen name="의견" component={CommentUpload} />
            <Nav.Screen name="프로필" component={Profile} />
            <Nav.Screen name="편집" component={Edit} options={{ title: "" }} />
            <Nav.Screen name="추가" component={AddComments} />
        </Nav.Navigator>
    );
};

export default InNav;
