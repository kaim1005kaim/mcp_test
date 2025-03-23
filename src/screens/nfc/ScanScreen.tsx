import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { RootState } from '../../store';
import { initNfc, readNfcTag, cleanupNfc } from '../../services/nfc';
import { incrementMeetCount } from '../../store/slices/peopleSlice';
import { savePeople } from '../../services/storage';
import { COLORS } from '../../utils/theme';

type ScanScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Scan'>;

const ScanScreen = () => {
  const [scanning, setScanning] = useState(false);
  const [nfcAvailable, setNfcAvailable] = useState(false);
  const [message, setMessage] = useState('NFCの準備中...');
  const navigation = useNavigation<ScanScreenNavigationProp>();
  const dispatch = useDispatch();
  const { people } = useSelector((state: RootState) => state.people);

  useEffect(() => {
    const checkNfc = async () => {
      const isAvailable = await initNfc();
      setNfcAvailable(isAvailable);
      
      if (!isAvailable) {
        Alert.alert('エラー', 'お使いの端末ではNFCがサポートされていないか、無効になっています。');
      } else {
        setMessage('NFCタグを端末に近づけてください');
        startScan();
      }
    };
    
    checkNfc();
    
    return () => {
      cleanupNfc();
    };
  }, []);

  const startScan = async () => {
    if (!nfcAvailable) return;
    
    setScanning(true);
    setMessage('NFCタグをスキャン中...');
    
    try {
      const tagId = await readNfcTag();
      
      if (tagId) {
        const matchedPerson = people.find(p => p.nfcTagId === tagId);
        
        if (matchedPerson) {
          dispatch(incrementMeetCount(matchedPerson.id));
          // 更新されたデータを保存
          savePeople(people.map(p => 
            p.id === matchedPerson.id 
              ? {...p, meetCount: p.meetCount + 1, lastMeetDate: new Date().toISOString()} 
              : p
          ));
          
          navigation.navigate('MeetSuccess', { personId: matchedPerson.id });
        } else {
          Alert.alert('未登録のタグ', 'このNFCタグは登録されていません。');
          setMessage('NFCタグを端末に近づけてください');
          startScan(); // 再スキャン
        }
      } else {
        setMessage('スキャンに失敗しました。もう一度お試しください。');
        setTimeout(() => {
          setMessage('NFCタグを端末に近づけてください');
          startScan(); // 再スキャン
        }, 2000);
      }
    } catch (error) {
      console.error('NFCスキャンエラー:', error);
      setMessage('エラーが発生しました。もう一度お試しください。');
      setTimeout(() => {
        setMessage('NFCタグを端末に近づけてください');
        startScan(); // 再スキャン
      }, 2000);
    } finally {
      setScanning(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.nfcContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} animating={scanning} />
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  nfcContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '90%',
    height: 200,
  },
  messageText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: COLORS.text,
  },
});

export default ScanScreen;