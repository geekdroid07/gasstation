import { View, Text } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'
import COLORS from '../consts/colors';

export default function ItemPayment({item, i, onClick}) {

    const onFunClick = () => {
        onClick(item);
    }
 
    return (
        <View className="flex-col w-full p-4">
            <View className="flex-row justify-between w-auto">
                <Text className="text-base text-[#000]">{item?.Volume} Galones</Text>
                <Text className="text-base text-[#000]">{item?.ProductName}</Text>
            </View>
            <View className="flex-row justify-between w-auto">
                <Text className="text-lg font-bold text-[#000]">Vales de Credito</Text>
            </View>
            <View className="flex-row items-center justify-between w-auto">
                <Text>{item?.SaleId} {item?.Turno}</Text>
                <Text className="text-lg font-bold text-[#000]">{item?.Nombre}</Text>
            </View>
            <View className="flex-row justify-end w-auto">
                <Text>{item?.SaleId} {item?.Turno}</Text>
            </View>

            <CustomButton label={`IMPRIMIR RD$ ${item?.Money}`} style={{
                    backgroundColor: COLORS.red,
                    borderRadius: 10,
                    marginTop: 10,
                    marginBottom: 0
                }} onPress={onFunClick} 
            />
        </View>
    )
}