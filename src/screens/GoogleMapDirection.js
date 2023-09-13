import React, {useContext, useState, useEffect} from 'react';
import {Text, View, SafeAreaView, StyleSheet, Dimensions} from 'react-native';
import {CustomeHeader} from '../common/CustomeHeader';
import {GlobalContext} from '../store/GlobalProvider';
import MapView, {Polyline, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from 'react-native';

export function GoogleMapDirection ({navigation, route})
{
    // const [currentLongitude, setCurrentLongitude] = useState(10.352050177688794);
    // const [currentLatitude, setCurrentLatitude] = useState(107.0897521847366);
    const global = useContext(GlobalContext);
    let username = global.username;

    let X = route.params.X;
    let Y = route.params.Y;
    let TENKH = route.params.tenkh;
    let DIACHI = route.params.diachi;

    const [currentLongitude, setCurrentLongitude] = useState(0);
    const [currentLatitude, setCurrentLatitude] = useState(0);
    const [initialRegion, setInitialRegion] = useState();
    const [locationStatus, setLocationStatus] = useState('');
    //const origin = {latitude: 10.352050177688794, longitude: 107.0897521847366};
    // const destination = {latitude: 10.364200738876741, longitude: 107.07610793770762};
    const destination = {latitude: parseFloat(X), longitude: parseFloat(Y)};
    // const GOOGLE_MAPS_APIKEY = 'AIzaSyA7ilNj5rz-yyMN5T9lMiK2neX4puZ2IWU';
    const GOOGLE_MAPS_APIKEY = 'AIzaSyDe50TfHAIg0SUo_AUzNTsr3IDpfO73K9E'; // key thần thánh của anh Long

    useEffect(() => {
        const requestLocationPermission = async () => {
          if (Platform.OS === 'ios') {
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                  title: 'Location Access Required',
                  message: 'This App needs to Access your location',
                },
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //To Check, If Permission is granted
                getOneTimeLocation();
                subscribeLocationLocation();
              } else {
                setLocationStatus('Permission Denied');
              }
            } catch (err) {
              console.warn(err);
            }
          }
        };
        requestLocationPermission();
        return () => {
          Geolocation.clearWatch(watchID);
        };
      }, []);
      
      const getOneTimeLocation = () => {
        setLocationStatus('Getting Location ...');
        Geolocation.getCurrentPosition(
          //Will give you the current location
          (position) => {
            setLocationStatus('You are Here');
            //getting the Longitude from the location json
            const currentLongitude = 
            parseFloat(position.coords.longitude);     
            //getting the Latitude from the location json
            const currentLatitude = 
            parseFloat(position.coords.latitude);     
            //Setting Longitude state
            setCurrentLongitude(currentLongitude);
            
            //Setting Longitude state
            setCurrentLatitude(currentLatitude);

            let region = {
                latitude: currentLatitude != 0 ? currentLatitude : X,
                longitude: currentLongitude != 0 ? currentLongitude : Y,
                latitudeDelta: 0.0922,                 
                longitudeDelta: 0.0421
            };
            setInitialRegion(region);

          },
          (error) => {
            setLocationStatus(error.message);
          },
          {
            enableHighAccuracy: false, //máy ảo để true, real device để false
            timeout: 30000,
            maximumAge: 1000
          },
        );
      };
      
      const subscribeLocationLocation = () => {
        watchID = Geolocation.watchPosition(
          (position) => {
            //Will give you the location on location change          
            setLocationStatus('You are Here');
            //console.log(position);    
            //getting the Longitude from the location json        
            const currentLongitude =
            parseFloat(position.coords.longitude);     
            //getting the Latitude from the location json
            const currentLatitude = 
            parseFloat(position.coords.latitude);     
            //Setting Longitude state
            setCurrentLongitude(currentLongitude);     
            //Setting Latitude state
            setCurrentLatitude(currentLatitude);

            let region = {
                latitude: currentLatitude != 0 ? currentLatitude : X,
                longitude: currentLongitude != 0 ? currentLongitude : Y,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            };
            setInitialRegion(region);
            
          },
          (error) => {
            setLocationStatus(error.message);
          },
          {
            enableHighAccuracy: false,//máy ảo để true, real device để false
            maximumAge: 1000
          },
        );
      };

    return(
        <SafeAreaView 
          style={{flex: 1}}
          >
            <CustomeHeader
                title = 'Google maps'
                isHome={false}
                navigation={navigation} 
            />  
            <View style={styles.container}>
              <MapView style={styles.map}
                  zoomEnabled={true}
                  showsUserLocation={true}
                  //specify our coordinates.
                  initialRegion={{
                    latitude: X,
                    longitude: Y,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >                 
                  <Marker
                      coordinate={destination}
                      title={TENKH}
                      description={DIACHI}
                  />
                  <MapViewDirections
                    origin={{latitude : currentLatitude, longitude: currentLongitude}}
                    destination={destination}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={3}
                    strokeColor="hotpink"
                  />         
                </MapView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      flex: 1, //the container will fill the whole screen.
      justifyContent: "flex-end",
      alignItems: "center",
    },
    map: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    },
  });