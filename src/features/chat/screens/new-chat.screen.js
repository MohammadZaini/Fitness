import React, { useEffect, useState } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { CustomHeaderButton } from "../components/custom-header-button.component";
import { FontAwesome } from '@expo/vector-icons';
import { colors } from "../../../infratructure/theme/colors";
import { PageContainer } from "../../../components/page-container";
import { DefaultText, LoadingContainer, SearchBarContainer, SearchInput, UsersContainer } from "../components/new-chat.styles";
import { searchUsers } from "../../../utils/actions/user-actions";
import { ActivityIndicator } from "react-native-paper";
import { FlatList } from "react-native";
import { DataItem } from "../../../components/data-item.component";
import { useDispatch, useSelector } from "react-redux";
import { setStoredUsers } from "../../../../store/user-slice";

const NewChatScreen = props => {
    const [isLoading, setIsloading] = useState(false);
    const [users, setUsers] = useState(); // An object of users data
    const [noResultsFound, setNoResultsFound] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const userData = useSelector(state => state.auth.userData)

    const dispatch = useDispatch();

    useEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => {
                return <HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
                    <Item
                        title="Cancel"
                        onPress={() => props.navigation.goBack()}
                    />
                </HeaderButtons>
            }
        })
    }, []);

    useEffect(() => {

        const delaySearch = setTimeout(async () => {
            if (!searchTerm || searchTerm === "") {
                setUsers();
                setNoResultsFound(false);
                return;
            };

            setIsloading(true);

            const usersResult = await searchUsers(searchTerm);
            delete usersResult[userData.userId];
            setUsers(usersResult);

            if (Object.keys(usersResult).length === 0) {
                setNoResultsFound(true);
            } else {
                setNoResultsFound(false);

                dispatch(setStoredUsers({ newUsers: usersResult }))
            };

            setIsloading(false)
        }, 500);

        return () => clearTimeout(delaySearch);

    }, [searchTerm]);

    const userPressed = (userId) => {
        props.navigation.navigate("Chats", { selectedUserId: userId })
    };

    return (
        <PageContainer >
            <SearchBarContainer>
                <FontAwesome name="search" size={15} color={colors.lightGrey} />
                <SearchInput value={searchTerm} onChangeText={setSearchTerm} />
            </SearchBarContainer>

            {
                isLoading &&
                <LoadingContainer>
                    <ActivityIndicator size="large" color={colors.primary} />
                </LoadingContainer>

            }

            {
                !isLoading && !noResultsFound && users &&
                <FlatList
                    data={Object.keys(users)}
                    keyExtractor={user => user}
                    renderItem={(itemData) => {
                        const userId = itemData.item
                        const userData = users[userId]
                        return (
                            <DataItem
                                uri={userData.profilePicture}
                                title={userData.firstName}
                                subTitle={userData.about}
                                onPress={() => userPressed(userId)}
                                personType={userData.personType}
                                gender={userData.gender}
                            />
                        )
                    }}

                />
            }

            {
                !isLoading && noResultsFound && (
                    <UsersContainer>
                        <FontAwesome name="question" size={55} color={colors.lightGrey} />
                        <DefaultText>No users found</DefaultText>

                    </UsersContainer>
                )
            }

            {
                !isLoading && !users && (
                    <UsersContainer>
                        <FontAwesome name="users" size={55} color={colors.lightGrey} />
                        <DefaultText>Enter a name to search for a coach or a trainee</DefaultText>
                    </UsersContainer>
                )
            }

        </PageContainer>
    );
};

export default NewChatScreen;


