import React, { useState } from "react";
import styled from "styled-components/native";
import { EvilIcons } from "@expo/vector-icons";
const SearchBarWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    background-color: #efefef;
    border-radius: 4
    padding-top : 10
    padding-right : 14
    padding-bottom : 10
    padding-left : 12
    margin-right : 20;
    margin-left : 20;
    
    background-color: #1e272e;
    display: flex;
`;

const SearchInput = styled.TextInput`
    margin-left: 10px;
    include-font-padding: false;
    padding: 0px;
    color: white;
`;

export default function SearchBar() {
    const [value, setValue] = useState("");

    return (
        <SearchBarWrapper>
            <EvilIcons name="search" size={24} color="white" />
            <SearchInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setValue}
                placeholder="검색어를 입력해 주세요."
                returnKeyType="search"
                returnKeyLabel="search"
                value={value}
                placeholderTextColor="gray"
            />
        </SearchBarWrapper>
    );
}
