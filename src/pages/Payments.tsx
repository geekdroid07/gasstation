import { View, Text, SafeAreaView, FlatList, PermissionStatus, PermissionsAndroid, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import COLORS from '../consts/colors'
import Loading from '../components/Loading'
import Separator from '../components/Separator'
import axios from 'axios'
import ItemPayment from '../components/ItemPayment'
import { SunmiPrinter, SunmiPrinterStatus } from 'react-native-suno-sunmi-printer';
import { useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LOCALSTORAGE_TOKEN } from '../const'
import displayToast from '../utilities/toast.utility';
// import { captureRef } from 'react-native-view-shot';
// import Barcode from '@kichiyaki/react-native-barcode-generator';
// import qrcode from 'qrcode';
import lodash from 'lodash';

export default function Payments({navigation}) {

  const [data, setData] = useState();
  const [item, setItem] = useState<any>();
  const user = useSelector((state: any) => state.user);
  const viewRef = useRef<any>();


  
  const print = async (payment) => {


    if (Platform.OS === 'android') {
      const grantedWriteStorage: PermissionStatus =
        await PermissionsAndroid.request(
          'android.permission.WRITE_EXTERNAL_STORAGE',
          {
            title: 'Solicitar permiso de escritura',
            message:
              '¿Permitir que la aplicación recupere datos para imprimir facturas?',
            buttonNegative: 'No',
            buttonPositive: 'Aceptar',
          }
        );
      const grantedReadStorage: PermissionStatus =
        await PermissionsAndroid.request(
          'android.permission.READ_EXTERNAL_STORAGE',
          {
            title: 'Solicitar permiso para leer datos',
            message:
              '¿Permitir que la aplicación acceda y lea datos para imprimir facturas?',
            buttonNegative: 'No',
            buttonPositive: 'Aceptar',
          }
        );
      if (
        grantedReadStorage === 'granted' &&
        grantedWriteStorage === 'granted'
      ) {
        try {
          const printer = new SunmiPrinter();
          if (SunmiPrinterStatus.hasPaper && !SunmiPrinterStatus.coverOpen) {

            // await printer.printTextWithFont('SMARTFOOD \n\n\n', 'Festivo', 50)
            // const base64 = await captureRef(viewRef, {
            //   format: 'png',
            //   quality: 0.7,
            //   result: 'base64'
            // });
            // console.log(base64);
            
            // await printer.printBitmap(base64, 6, 162, 2, 0)
            
            const noticket = lodash.padStart(payment.NoTicket, 4, '0');
            await printer.setAlignment(1);
            await printer.printTextWithFont(`BOLETO \n`, 'Festivo', 50);
            await printer.printTextWithFont(`${noticket} \n\n`, 'Festivo', 50);
            
            
            await printer.setFontSize(23)
            await printer.printString('Pago de Venta \n\n');
            await printer.printString('SERVICENTRO GABINO SRL \n');
            await printer.printString('Calle Duarte #45 \n');
            
            await printer.printString('SUCURSAL: ECO SABANA \n');
            await printer.printString('RNC: 10573930 \n');
            await printer.printString('TEL: (829) 798-2699 \n');
            await printer.printString(`Id de Venta: ${payment?.SaleId} \n`);
            
            await printer.setAlignment(0);
            await printer.printString('Tipo Venta: Sistema \n')
            await printer.printString('Bombero: DARLIN SAVIER \n')
            await printer.printString('Metodo Pago: Tarjeta \n')
            await printer.printString('Tarjeta:  \n')
            await printer.printString('Placa: \n')
            await printer.printString(`Fecha Venta: ${payment?.EndDate} ${payment?.EndTime}`)
            await printer.printString(`Producto: ${payment?.ProductName} \n`)
            await printer.printString(`Lado: ${payment?.Pump} \n`)
            await printer.printString(`Manguera: ${payment?.Nozzle} \n`)
            await printer.printString(`Volumen: ${payment?.Volume} \n`)
            await printer.printString(`Precio: ${payment?.Precio} \n`)
            await printer.printString(`Monto: ${payment?.Money} \n`)
            await printer.printString('\n')
            await printer.printString('\n')

            await printer.setAlignment(1);

            await printer.printString(`_________________ \n`)
            await printer.printString(`Firma \n`)

            await printer.printString('\n')
            await printer.printString('\n')
            await printer.printString('\n')
            await printer.printString('\n')


            await printer.cutPaper();
          }
        } catch (e) {
          console.log('Print error =>', e);
        }
      }
    }
  };
  
  const getAll = async () => {
    let BASE_URL = user?.URL_SORTEOS;
    try {
      
      if (!BASE_URL) {
        const info = await AsyncStorage.getItem(LOCALSTORAGE_TOKEN);
        if (info) {
          const infouser = JSON.parse(info);
          BASE_URL = infouser?.URL_SORTEOS;
        }
      }
      const {data} = await axios.get(`${BASE_URL}api/sorteos?sort[0]=createdAt:desc`);
      if (data?.data) {
        setData(data?.data?.map(x => ({
          ...x.attributes
        })))
      }
    } catch (error: any) {
      console.log(error.request._response);
      displayToast(`${error.config.url} - ${error.request._response}`, 'info');      
    }
  }

  const onClick = item  => {
    setItem(item);
    print(item);
  }
  
  useEffect(() => {
    getAll();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
        <View className="">
            <Text className="mb-4 text-center">Pagos</Text>
            {/* <View ref={viewRef}>
              <Barcode value='test' text='test' />
            </View> */}
            <FlatList
              showsVerticalScrollIndicator={false}
              numColumns={1}
              ListEmptyComponent={<Loading title={'No hay sorteos todavia'} />}
              ItemSeparatorComponent={<Separator />}
              data={data}
              renderItem={({item, index}) => <ItemPayment i={index} item={item} onClick={onClick} />}
            />
        </View>
    </SafeAreaView>
  )
}