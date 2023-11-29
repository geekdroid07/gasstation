import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import React from 'react';

export default function CustomButton({label, onPress, loading = false, style = {}, textStyle = {}, disabled = false}) {
  
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{
        backgroundColor: disabled ? '#eaeaef' : '#4fbaf0',
        padding: 20,
        borderRadius: 100,
        marginBottom: 30,
        ...style
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 16,
          color: disabled ? '#000' : '#fff',
          ...textStyle
        }}>
        {loading ? <ActivityIndicator /> : label}
      </Text>
    </TouchableOpacity>
  );
}
