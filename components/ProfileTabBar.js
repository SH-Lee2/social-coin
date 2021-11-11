import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Animated, Text } from "react-native";

const Container = styled.View`
    background-color: #1e272e;
    padding-top: 10;
`;

const TabWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
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
    width : 50%
    border-bottom-width: 2
    border-bottom-color: ${(props) =>
        props.isFocused ? "white" : "transparent"};
`;

const TabText = styled(Animated.createAnimatedComponent(Text))`
    font-weight: 800;
    font-size : 18
    color: ${(props) => (props.isFocused ? "white" : "gray")};
`;

export default function ProfileTabBar({
    state,
    descriptors,
    navigation,
    position,
}) {
    return (
        <Container>
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
