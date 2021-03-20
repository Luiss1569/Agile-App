import React, { useContext, useEffect, useState } from 'react';
import { Alert, Animated, Text, View } from 'react-native';

import {
  Container,
  Search,
  SearchInput,
  SearchFinder,
  LoadingIcon,
  ListContainer,
  FlatList,
  HeaderContainer,
} from './styles';

import SearchIcon from '../../../../assets/search.svg';
import MyLocationIcon from '../../../../assets/my_location.svg';
import { useNavigation } from '@react-navigation/core';
import { ThemeContext } from 'styled-components';
import * as geoLocation from 'expo-location';

// import { request, PERMISSIONS } from 'react-native-permissions'
// import Geolocation from '@react-native-community/geolocation'
import Api from '../../../../services/Api';
import ListItem from '../../../../components/UserItem';

const Home = () => {
  const [locationField, setLocationField] = useState('');
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [list, setList] = useState([]);
  const [pagina, setPg] = useState(1);

  const navigation = useNavigation();
  const theme = useContext(ThemeContext);

  async function getBarbers(pg = 1) {
    setLoading(true);
    let lat = coords ? coords.latitude : null;
    let long = coords ? coords.longitude : null;

    const response = await Api.getUsers(lat, long, locationField);
    setPg(pg + 1);

    if (response.error === '') {
      if (response.loc) {
        setLocationField(response.loc);
      }
      if (pg === 1) {
        setList(response.data);
      } else {
        //setList([...list, ...response.data]);
      }
    } else {
      Alert.alert('Erro:' + response.error);
    }
    setLoading(false);
    setRefreshing(false);
  }

  function handleLocationSearch() {
    setCoords({});
    getBarbers();
  }

  function onRefresh() {
    setRefreshing(true);
    getBarbers();
  }

  useEffect(() => {
    (async () => {
      await getLocation();
      getBarbers();
    })();
  }, []);

  async function getLocation() {
    let { status } = await geoLocation.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada!');
      return;
    }

    const {
      coords: { latitude, longitude },
    } = await geoLocation.getCurrentPositionAsync({});
    setLoading(true);
    setLocationField('');
    setCoords({ latitude, longitude });
    console.log();
  }

  const HeaderComponent = (props) => (
    <HeaderContainer>

      <Search>
        <SearchInput
          placeholder="Onde você esta?"
          placeholderTextColor={theme.primary}
          value={locationField}
          onChangeText={(e) => setLocationField(e)}
          onEndEditing={handleLocationSearch}
        />
        <SearchFinder onPress={() => getLocation()}>
        <SearchIcon width="26" height="26" fill={theme.textInverted} />
        </SearchFinder>
      </Search>
    </HeaderContainer>
  );

  return (
    <Container>
      <ListContainer>
        <FlatList
          data={list}
          keyExtractor={(item: { name: string }) => item.name + pagina}
          renderItem={({ item }) => <ListItem data={item} />}
          refreshing={refreshing}
          onRefresh={onRefresh}
          scrollEventThrottle={20}
          ListHeaderComponent={ <HeaderComponent />}
          ListFooterComponent={
            <View style={{ height: 500 }}>
              {loading && <LoadingIcon size="large" color={theme.primary} />}
            </View>
          }
          showsVerticalScrollIndicator={false}
          onEndReached={() => getBarbers(pagina)}
          onEndReachedThreshold={0.1}
        />
      </ListContainer>
    </Container>
  );
};

export default Home;
