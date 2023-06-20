import React from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { MenuOption } from "react-native-popup-menu";
import { Feather } from '@expo/vector-icons';
import { Text } from "react-native";
import { fonts } from "../../../infratructure/theme/fonts";
import { colors } from "../../../infratructure/theme/colors";
export const MenuItem = props => {

    let Icon = props.iconPack ?? Feather;
    return <MenuOption onSelect={props.onSelect} >
        <View style={styles.menuItemContainer} >
            <Text style={styles.text}>{props.text}</Text>
            <Icon name={props.icon} size={19} color={colors.primary} />
        </View>

    </MenuOption>
}

const styles = StyleSheet.create({
    menuItemContainer: {
        flexDirection: 'row',
        padding: 5
    },
    text: {
        fontFamily: fonts.body,
        flex: 1
    }
});