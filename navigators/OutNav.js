import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Join from "../screens/Join";
import Login from "../screens/Login";

const Nav = createNativeStackNavigator();

const OutNav = () => {
    return (
        <Nav.Navigator
            screenOptions={{
                animation: "slide_from_right",
                headerTintColor: "white",
                headerStyle: {
                    backgroundColor: "#1e272e",
                },
                headerTitleAlign: "center",
            }}
        >
            <Nav.Screen name="Login" component={Login} />
            <Nav.Screen name="Join" component={Join} />
        </Nav.Navigator>
    );
};

export default OutNav;
