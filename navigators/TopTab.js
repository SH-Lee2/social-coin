import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import TabBar from "../components/TabBar";
import Home from "../screens/Home";
import Like from "../screens/Like";

const Nav = createMaterialTopTabNavigator();

function TopTab() {
    return (
        <Nav.Navigator
            tabBar={(props) => <TabBar {...props} screen={"home"} />}
        >
            <Nav.Screen name="전체" component={Home} />
            <Nav.Screen name="관심" component={Like} />
        </Nav.Navigator>
    );
}

export default TopTab;
