import React, { useContext } from "react";
import InNav from "./InNav";
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from "@react-navigation/drawer";
import { Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import auth from "@react-native-firebase/auth";
import TopTab from "./TopTab";
import { AuthContext } from "./AuthProvider";

function CustomDrawerContent(props) {
    const nav = useNavigation();
    const { logout } = useContext(AuthContext);
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <DrawerItemList {...props} />
            <DrawerItem label="프로필" onPress={() => nav.navigate("프로필")} />
            <TouchableOpacity
                style={{
                    position: "absolute",
                    right: 0,
                    bottom: 15,
                    width: 260,
                    flexDirection: "row",
                }}
                label="로그아웃"
                onPress={() => {
                    logout();
                }}
            >
                <Text style={{ marginRight: 5, color: "gray" }}>로그아웃</Text>
                <MaterialIcons name="logout" size={20} color="gray" />
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
}

const Nav = createDrawerNavigator();

const Root = () => {
    return (
        <Nav.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Nav.Screen name="Home" component={InNav} />
            {/* <Nav.Screen name="Home" component={TopTab} /> */}
        </Nav.Navigator>
    );
};

export default Root;
