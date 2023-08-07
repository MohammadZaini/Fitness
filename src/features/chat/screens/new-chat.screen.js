import React, { useEffect, useState } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { CustomHeaderButton } from "../components/custom-header-button.component";
import { FontAwesome } from '@expo/vector-icons';
import { colors } from "../../../infratructure/theme/colors";
import { PageContainer } from "../../../components/page-container";
import { ChatNameContainer, ChatNameInput, ChatNameInputContainer, DefaultText, LoadingContainer, SearchBarContainer, SearchInput, UsersContainer } from "../components/new-chat.styles";
import { searchUsers } from "../../../utils/actions/user-actions";
import { ActivityIndicator } from "react-native-paper";
import { FlatList } from "react-native";
import { DataItem } from "../../../components/data-item.component";
import { useDispatch, useSelector } from "react-redux";
import { setStoredUsers } from "../../../../store/user-slice";
import { View } from "react-native";
import { ProfileImage } from "../../../components/profile-image.component";
import { StyleSheet } from "react-native";
import { useRef } from "react";

const NewChatScreen = props => {

    const dispatch = useDispatch();

    const [isLoading, setIsloading] = useState(false);
    const [users, setUsers] = useState(); // An object of users data
    const [noResultsFound, setNoResultsFound] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [chatName, setChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);

    const userData = useSelector(state => state.auth.userData);
    const storedUsers = useSelector(state => state.users.storedUsers);

    const chatId = props.route.params && props.route.params.chatId;
    const existingUsers = props.route.params && props.route.params.existingUsers;
    const isGroupChat = props.route.params && props.route.params.isGroupChat;

    const isGroupChatDisabled = selectedUsers.length === 0 || (isNewChat && chatName === "");

    const isNewChat = !chatId;

    const selectedUsersFlatList = useRef();

    useEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => {
                return <HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
                    <Item
                        title="Close"
                        onPress={() => props.navigation.goBack()}
                    />
                </HeaderButtons>
            },
            headerTitle: isGroupChat ? "Add Participants" : "New Chat",

            headerRight: () => {
                return (
                    isGroupChat &&
                    <HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
                        <Item
                            title={isNewChat ? "Create" : "Add"}
                            disabled={isGroupChatDisabled}
                            color={isGroupChatDisabled ? colors.lightGrey : colors.primary}
                            onPress={() => {
                                const screenName = isNewChat ? "ChatList" : "ChatSettings"
                                props.navigation.navigate(screenName, {
                                    selectedUsers,
                                    chatName,
                                    chatId
                                })
                            }}
                        />
                    </HeaderButtons>
                );
            },
        })
    }, [chatName, selectedUsers]);

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

    const userPressed = userId => {

        if (isGroupChat) {
            const newSelectedUsers = selectedUsers.includes(userId)
                ? selectedUsers.filter(id => id !== userId)
                : selectedUsers.concat(userId);

            setSelectedUsers(newSelectedUsers);
        } else {
            props.navigation.navigate("ChatList", { selectedUserId: userId });
        };
    };

    return (
        <PageContainer >

            {
                isNewChat && isGroupChat &&

                <ChatNameContainer>
                    <ChatNameInputContainer>
                        <ChatNameInput
                            value={chatName}
                            onChangeText={setChatName}
                        />
                    </ChatNameInputContainer>
                </ChatNameContainer>
            }

            {
                isGroupChat &&
                <View>
                    <FlatList
                        style={styles.selectedUsersStyle}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        ref={ref => selectedUsersFlatList.current = ref}
                        onContentSizeChange={() => selectedUsers.length > 0 && selectedUsersFlatList.current.scrollToEnd()}
                        data={selectedUsers}
                        keyExtractor={item => item}
                        renderItem={(itemData) => {
                            const userId = itemData.item
                            const userData = storedUsers[userId]
                            return <ProfileImage
                                style={styles.selectedUsersStyle}
                                size={40}
                                uri={userData.profilePicture}
                                onPress={() => userPressed(userId)}
                                showRemoveButton={true}
                            />
                        }}
                    />
                </View>


            }

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
                    // keyExtractor={user => user}
                    renderItem={(itemData) => {
                        const userId = itemData.item
                        const userData = users[userId]

                        if (existingUsers && existingUsers.includes(userId)) {
                            return;
                        }

                        return (
                            <DataItem
                                uri={userData.profilePicture}
                                title={`${userData.firstName} ${userData.lastName}`}
                                subTitle={userData.about}
                                onPress={() => userPressed(userId)}
                                userType={userData.userType}
                                gender={userData.gender}
                                type={isGroupChat ? "checkbox" : ""}
                                isChecked={selectedUsers.includes(userId)}
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

const styles = StyleSheet.create({
    selectedUsersContainer: {
        height: 60,
        justifyContent: 'center'
    },
    selectedUsersList: {
        height: "100%",
        paddingTop: 10
    },
    selectedUsersStyle: {
        marginRight: 10,
    }
})

export default NewChatScreen;