import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../../../infratructure/theme/colors";

export const CustomHeaderButton = props => {
    return <HeaderButton
        {...props}
        IconComponent={Ionicons}
        iconSize={23}
        color={props.color ?? colors.primary}
    />
};