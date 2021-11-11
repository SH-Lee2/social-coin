import React, { useContext, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import auth from "@react-native-firebase/auth";
import { AuthContext } from "../navigators/AuthProvider";

const Container = styled.View`
    background-color: #1e272e;
    flex: 1;
    color: white;
    padding-top: 20;
`;

const Wrapper = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const Text = styled.Text`
    font-size: 14;
    text-align: center;
    color: white;
    padding-top: 20;
`;

const TextInput = styled.TextInput`
    width: 100%;
    padding-top : 10
    padding-bottom : 10
    padding-right : 10
    padding-left : 10
    border-radius: 20;
    margin-bottom: 10;
    font-size: 14;
    color: white;
    background-color: rgba(255, 255, 255, 0.5);
`;
const Btn = styled.TouchableOpacity`
    width: 100%;
    padding-top : 10
    padding-bottom : 10
    padding-right : 10
    padding-left : 10
    border-width: 1;
    border-radius: 20;
    border-color: rgba(255, 255, 255, 0.5);
    justify-content: center;
    align-items: center;
`;
const BtnText = styled.Text`
    color: white;
    font-size: 16;
`;

const Login = ({ navigation: { navigate } }) => {
    const { login } = useContext(AuthContext);
    const passwordInput = useRef();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmitEmailEditing = () => {
        passwordInput.current.focus();
    };

    return (
        <Container>
            <TextInput
                placeholder="이메일"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                value={email}
                returnKeyType="next"
                onChangeText={(text) => setEmail(text)}
                onSubmitEditing={onSubmitEmailEditing}
                placeholderTextColor={"rgba(255, 255, 255, 0.7)"}
            />
            <TextInput
                ref={passwordInput}
                placeholder="비밀번호"
                secureTextEntry
                value={password}
                returnKeyType="done"
                onChangeText={(text) => setPassword(text)}
                onSubmitEditing={() => login(email, password)}
                placeholderTextColor={"rgba(255, 255, 255, 0.7)"}
            />
            <Btn onPress={() => login(email, password)}>
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <BtnText>로그인</BtnText>
                )}
            </Btn>
            <Wrapper>
                <Text
                    style={{
                        marginRight: 10,
                    }}
                >
                    계정이 없습니까?{" "}
                </Text>
                <TouchableOpacity onPress={() => navigate("Join")}>
                    <Text>계정 생성 &rarr;</Text>
                </TouchableOpacity>
            </Wrapper>
        </Container>
    );
};
export default Login;
