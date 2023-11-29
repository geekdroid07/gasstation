import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import CustomButton from './CustomButton'

export default function ItemHome({item, i, Volume, Monto, selectItem = () => {}}) {

    const Sortear = () => {
        selectItem(item);
    }

    useEffect(() => {
        // console.log(item.Volume);
        // console.log(Volume && Monto && item.Money < Number(Monto) && item.Volume < Number(Volume) ? true : false);
        
    }, [item, Volume, Monto])
 
    return (
        <View className="flex-col w-full p-4">
            <View className="flex justify-start mb-4">
                <Text className="text-base font-bold text-[#000]">{i}</Text>
            </View>
            <View className="flex-row justify-between w-auto">
                <Text className="text-base text-[#000]">{item?.Volume} Galones</Text>
                <Text className="text-base text-[#000]">{item?.ProductName}</Text>
            </View>
            <View className="flex-row justify-between w-auto">
                <Text className="text-base font-bold text-[#000]">Lado {item?.Pump}</Text>
            </View>
            <View className="flex-row items-center justify-between w-auto">
                <Text>{item?.EndDate}</Text>
                <Text>Id {item?.SaleId}</Text>
                <Text className="text-base font-bold text-[#000]">Manguera {item?.Nozzle}</Text>
            </View>
            <View className="flex-row justify-end w-auto">
                <Text>{item?.EndTime}</Text>
            </View>

            <CustomButton
                disabled={item.Sorteado || (Volume && Monto && item.Money < Number(Monto) && item.Volume < Volume ? true : false)}
                label={'SORTEAR'} 
                style={{
                    backgroundColor: item.Sorteado || (Volume && Monto && item.Money < Number(Monto) && item.Volume < Volume ? true : false) ? '#eaeaef' : '#1be68d',
                    borderRadius: 10,
                    marginTop: 10,
                    marginBottom: 0
                }}
                onPress={Sortear} 
            />
        </View>
    )
}