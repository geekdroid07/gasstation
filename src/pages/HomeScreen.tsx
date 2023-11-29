import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  PermissionStatus,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  FlatList
} from 'react-native-gesture-handler';
import COLORS from '../consts/colors';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOCALSTORAGE_TOKEN } from '../const';
import displayToast from '../utilities/toast.utility';
import Separator from '../components/Separator';
import ItemHome from '../components/ItemHome';
import SelectDropdown from 'react-native-select-dropdown';
import Loading from '../components/Loading';
import axios from 'axios';
import { AlertDialog, Button } from 'native-base';
import tw from 'twrnc';
import { Formik, useFormik } from 'formik';
import InputField from '../components/InputField';
import { SunmiPrinter, SunmiPrinterStatus } from 'react-native-suno-sunmi-printer';
import lodash from 'lodash';

const {width} = Dimensions.get('screen');
const cardWidth = width / 2 - 20;

const lados = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

const HomeScreen = ({navigation}) => {
  const user = useSelector((state: any) => state.user);
  const [data, setData] = useState([]);
  const [payments, setPayments] = useState([]);
  const [pump, setPump] = useState(0);
  const [limit, setLimit] = useState(10);
  const [monto, setMonto] = useState(null);
  const [volume, setVolume] = useState(null);
  const [item, setItem] = useState<any>();
  
  const [isOpenDialog, setIsOpen] = useState(false);
  const onCloseDialog = () => setIsOpen(false);
  const cancelRef = useRef(null);

  const getLimit = async () => {
    let BASE_URL = user?.URL_SORTEOS;
    try {
      if (BASE_URL?.length < 1) {
        const info = await AsyncStorage.getItem(LOCALSTORAGE_TOKEN);
        if (info) {
          const infouser = JSON.parse(info);
          BASE_URL = infouser?.URL_SORTEOS;
        }
      }
      const {data} = await axios.get(`${BASE_URL}api/limits?pagination[page]=1&pagination[pageSize]=1`)
      if (data?.data[0]?.attributes) {
        setLimit(data?.data[0]?.attributes?.LIMIT)
        setVolume(data?.data[0]?.attributes?.Volume)
        setMonto(data?.data[0]?.attributes?.Monto)
      }
    } catch (error: any) {
      // console.log(error.config.url);
      displayToast(`${error.config.url} - ${BASE_URL}`, 'info');
      
    }
  }

  const getAll = async () => {
    let BASE_URL: string = user?.URL;
    try {
      if (BASE_URL?.length < 1) {
        const info = await AsyncStorage.getItem(LOCALSTORAGE_TOKEN);
        if (info) {
          const infouser = JSON.parse(info);
          BASE_URL = infouser?.URL;
        }
      }
      const {data} = await axios.get(`${BASE_URL}api/ListadoVentas/GetListadoVentas?Pump=${pump}&Nozzle=0&Limit=${limit}`, {
        headers: { 'Accept': 'application/json' }
      });
      const result = data?.List?.map(x => {
        const index = payments.findIndex((y: any) => y.SaleId === x.SaleId);
        if (index >= 0) {
          x.Sorteado = true
        }
        return x;
      })
      setData(result)
    
    } catch (error: any) {
      // displayToast(`${error.config.url} - ${BASE_URL}`, 'info');
    }
  }


  const getAllPayments = async () => {
    let BASE_URL = user?.URL_SORTEOS;
    try {
      
      if (!BASE_URL) {
        const info = await AsyncStorage.getItem(LOCALSTORAGE_TOKEN);
        if (info) {
          const infouser = JSON.parse(info);
          BASE_URL = infouser?.URL_SORTEOS;
        }
      }
      const {data} = await axios.get(`${BASE_URL}api/sorteos`);
      if (data?.data) {
        setPayments(data?.data?.map(x => ({
          ...x.attributes
        })))
      }
    } catch (error: any) {
      console.log(error.request._response);
      displayToast(`${error.config.url} - ${error.request._response}`, 'info');      
    }
  }

  useEffect(() => {
    getAll();
  }, [pump, limit, payments])


  const selectItem = item  => {
    setIsOpen(true);
    setItem(item);
  }

  useEffect(() => {
    getAll();
    getAllPayments();
    getLimit();
    navigation.addListener('focus', () => {
      getAllPayments();
    })
  }, []);

  const initialValues = {
    Numero: '',
    Cedula: '',
    Nombre: ''
  };

  const {handleSubmit, handleChange, setFieldValue, values, resetForm, errors, handleBlur, touched} =
    useFormik({
      initialValues,
      onSubmit: async (formValues) => {
        try {
          let BASE_URL: string = user?.URL_SORTEOS;
          if (BASE_URL?.length < 1) {
            const info = await AsyncStorage.getItem(LOCALSTORAGE_TOKEN);
            if (info) {
              const infouser = JSON.parse(info);
              BASE_URL = infouser?.URL_SORTEOS;
            }
          }
          if (formValues.Cedula.length > 0 && formValues.Numero.length > 0 && formValues.Nombre.length > 0 && item) {
            
            const {status, data} = await axios.post(`${BASE_URL}api/sorteos`, {
              data: {
                ...item,
                ...formValues,  
              }
            });
            console.log(data?.data?.attributes);
            
            if (status === 200) {
              resetForm();
              onCloseDialog();
              displayToast('GUARDADO CORRECTAMENTE', 'info');
              navigation.navigate('Payments');
              print(data?.data?.attributes)
            } else {
              displayToast('Ocurrió un error', 'info');
            }
          } else {
            displayToast('Por favor llenar todos los campos', 'info')
          }
        } catch (error: any) {
          const errors = error?.response?.data?.error?.details?.errors
          if (errors[0]?.path.includes('SaleId')) {
            displayToast('Esta venta ya ha sido sorteada.', 'info');
          } else {
            displayToast('Ocurrió un error', 'info');
          }
        }
      }
    });


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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>

      <AlertDialog
        closeOnOverlayClick={false}
        leastDestructiveRef={cancelRef}
        isOpen={isOpenDialog}
        onClose={onCloseDialog}>
        <AlertDialog.Content>
          <AlertDialog.Header>¿Deseas sortear esta venta?</AlertDialog.Header>
          <AlertDialog.Body>
          <KeyboardAvoidingView behavior="position">

            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
            >
              <>
                <InputField
                  label={'NOMBRE'}
                  handleChange={handleChange('Nombre')}
                  handleBlur={handleBlur('Nombre')}
                  inputType='text'
                  value={values.Nombre}
                  fieldButtonFunction={() => {}}
                  fieldButtonLabel=''
                  icon={null}
                  keyboardType="default"
                />

                <InputField
                  label={'TELEFONO'}
                  handleChange={handleChange('Numero')}
                  handleBlur={handleBlur('Numero')}
                  inputType='text'
                  value={values.Numero}
                  fieldButtonFunction={() => {}}
                  fieldButtonLabel=''
                  icon={null}
                  keyboardType={'numeric'}
                />

                <InputField
                  label={'CEDULA'}
                  value={values.Cedula}
                  keyboardType={'numeric'}
                  handleChange={handleChange('Cedula')}
                  handleBlur={handleBlur('Cedula')}
                  icon={null}
                  inputType="text"
                  fieldButtonLabel=''
                  fieldButtonFunction={() => {}}
                />
                
              </>
            </Formik>

            </KeyboardAvoidingView>
            <View style={[tw.style('w-full mt-8'), {alignItems: 'flex-end'}]}>
              <Button.Group>
                <Button
                  variant="unstyled"
                  colorScheme="coolGray"
                  onPress={onCloseDialog}
                  isLoading={false}
                  disabled={false}
                  ref={cancelRef}>
                  Cancelar
                </Button>
                <Button
                  isLoading={false}
                  disabled={false}
                  onPress={handleSubmit}>
                  SORTEAR
                </Button>
              </Button.Group>
            </View>
          </AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>




      <View className="ml-4">
        <Text style={{marginTop: 5, fontSize: 22, color: '#000', fontWeight: 'bold'}}>
          Ventas del lado {pump}
        </Text>
      </View>
      <SelectDropdown
        data={lados}
        onSelect={(selectedItem) => {
          setPump(selectedItem);
        }}
        buttonStyle={{
          width: '100%'
        }}
        defaultButtonText={`Ultimas ${pump}`}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem
        }}
        rowTextForSelection={(item, index) => {
          return item
        }}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={1}
        ListEmptyComponent={<Loading title={''} />}
        ItemSeparatorComponent={<Separator />}
        data={data}
        renderItem={({item, index}) => <ItemHome  
                                          navigation={navigation} 
                                          selectItem={selectItem} 
                                          i={index}
                                          Volume={volume}
                                          Monto={monto} 
                                          item={item} 
                                        />}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  inputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sortBtn: {
    width: 50,
    height: 50,
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesListContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  categoryBtn: {
    height: 45,
    width: 120,
    marginRight: 7,
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  categoryBtnImgCon: {
    height: 35,
    width: 35,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: 220,
    width: cardWidth,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 50,
    borderRadius: 15,
    elevation: 13,
    backgroundColor: COLORS.white,
  },
  addToCartBtn: {
    height: 30,
    width: 30,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
