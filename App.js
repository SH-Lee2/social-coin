// import React, { useContext, useEffect, useState } from "react";
// import auth from "@react-native-firebase/auth";
// import { NavigationContainer } from "@react-navigation/native";
// import InNav from "./navigators/InNav";
// import OutNav from "./navigators/OutNav";
// import { QueryClient, QueryClientProvider } from "react-query";
// import Root from "./navigators/Root";
// import { AuthContext } from "./navigators/AuthProvider";

// const queryClient = new QueryClient();

// export default function App() {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const { user, setUser } = useContext(AuthContext);
//     useEffect(() => {
//         auth().onAuthStateChanged((authUser) => {
//             if (authUser) {
//                 setIsLoggedIn(true);
//             } else {
//                 setIsLoggedIn(false);
//             }
//         });
//     }, []);

//     return (
//         <QueryClientProvider client={queryClient}>
//             <NavigationContainer>
//                 {isLoggedIn ? <Root /> : <OutNav />}
//             </NavigationContainer>
//         </QueryClientProvider>
//     );
// }
import React from "react";
import Providers from "./navigators/Providers";
import { LogBox } from "react-native";
const App = () => {
    LogBox.ignoreAllLogs();
    return <Providers />;
};

export default App;
