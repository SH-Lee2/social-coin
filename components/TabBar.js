import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import SearchBar from "./SearchInput";
import { Animated, Text } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";

const Container = styled.View`
    background-color: #1e272e;
    padding-top: 10;
`;

const TabWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    padding-left: 4
    background-color: #1e272e;
`;

const TabButton = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    height: 40
    margin-top : 0;
    margin-right : 16;
    margin-bottom : 0;
    margin-left : 16
    border-bottom-width: 2
    border-bottom-color: ${(props) =>
        props.isFocused ? "white" : "transparent"};
`;

const TabText = styled(Animated.createAnimatedComponent(Text))`
    font-weight: 800;
    color: ${(props) => (props.isFocused ? "white" : "gray")};
`;

export default function TabBar({ state, descriptors, navigation, position }) {
    return (
        <Container>
            <SearchBar />
            <TabWrapper>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = route.name;
                    const isFocused = state.index === index;
                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };
                    const inputRange = state.routes.map((_, i) => i);
                    const opacity = position.interpolate({
                        inputRange,
                        outputRange: inputRange.map((i) =>
                            i === index ? 1 : 0.3
                        ),
                    });
                    return (
                        <TabButton
                            isFocused={isFocused}
                            onPress={onPress}
                            key={`tab_${index}`}
                            accessibilityLabel={
                                options.tabBarAccessibilityLabel
                            }
                        >
                            <TabText isFocused={isFocused} style={{ opacity }}>
                                {label}
                            </TabText>
                        </TabButton>
                    );
                })}
            </TabWrapper>
        </Container>
    );
}
