import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import { colors } from "../../../infratructure/theme/colors";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const CustomHeaderButton = props => {
    return <HeaderButton
        {...props}
        IconComponent={MaterialCommunityIcons}
        iconSize={23}
        color={props.color ?? colors.primary}
    />
};