import React, { createContext, useState } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async (email, password) => {
                    try {
                        await auth().signInWithEmailAndPassword(
                            email,
                            password
                        );
                    } catch (e) {
                        console.log(e);
                    }
                },
                register: async (email, passord, name, image) => {
                    const uploadImg = async (Img) => {
                        const filename = Img.substring(
                            Img.lastIndexOf("/") + 1
                        );
                        const storageRef = storage().ref(`photos/${filename}`);
                        const task = storageRef.putFile(Img);
                        try {
                            await task;
                            const url = await storageRef.getDownloadURL();
                            return url;
                        } catch (e) {
                            console.log("이미지 다운 실패");
                        }
                    };

                    try {
                        await auth()
                            .createUserWithEmailAndPassword(email, passord)
                            .then(async () => {
                                firestore()
                                    .collection("user")
                                    .doc(auth().currentUser.uid)
                                    .set({
                                        email,
                                        owner_id: auth().currentUser.uid,
                                        profile_picture: image
                                            ? await uploadImg(image)
                                            : image,
                                        user_name: name,
                                        coins: [],
                                    })
                                    .catch((e) => {
                                        console.log("firestore 추가 실패");
                                    });
                            })
                            .catch((e) => {
                                console.log("가입 실패");
                            });
                    } catch (e) {
                        console.log(e);
                    }
                },
                logout: async () => {
                    try {
                        await auth().signOut();
                    } catch (e) {
                        console.log("로그아웃 실패");
                    }
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
