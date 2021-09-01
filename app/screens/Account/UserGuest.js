import React from "react";
import { View, Text, Button } from "react-native";
import PropTypes from "prop-types";

const UserGuest = ({ onSubmit }) => (
        <View>
            <Text>Account for User UserGues</Text>
            <Button 
                title = "Login"
                onPress={onSubmit}
            />
            <Button 
                title = "Register"
            />
            
        </View>

);
UserGuest.propTypes = {
    onSubmit: PropTypes.func.isRequired
}
export default UserGuest;