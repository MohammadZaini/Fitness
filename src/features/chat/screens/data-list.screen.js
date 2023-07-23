import React from 'react'
import { useEffect } from 'react';
import { View, Text } from 'react-native'
import { PageContainer } from '../../../components/page-container';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { DataItem } from '../../../components/data-item.component';

const DataListScreen = props => {

    const { title, data, type, chatId } = props.route.params;
    const storedUsers = useSelector(state => state.users.storedUsers);
    const userData = useSelector(state => state.auth.userData);

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: title
        })
    }, [title]);

    return (
        <PageContainer>
            <FlatList
                data={data}
                keyExtractor={item => item}
                renderItem={itemData => {
                    let key, onPress, image, title, subTitle, itemType;

                    if (type === "users") {
                        const uid = itemData.item;
                        const currentUser = storedUsers[uid];

                        if (!currentUser) return;

                        const isLoggedInUser = uid === userData.userId;

                        key = uid;
                        image = currentUser.profilePicture;
                        title = `${currentUser.firstName} ${currentUser.lastName}`;
                        subTitle = currentUser.about
                        itemType = isLoggedInUser ? undefined : "link"
                        onPress = isLoggedInUser ? undefined : () => props.navigation.navigate("Contact", { uid, chatId })
                    };

                    return <DataItem
                        key={key}
                        onPress={onPress}
                        uri={image}
                        title={title}
                        subTitle={subTitle}
                        type={itemType}
                    />
                }}
            />
        </PageContainer>
    )
}

export default DataListScreen