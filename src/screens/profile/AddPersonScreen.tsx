import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { addPerson } from '../../store/slices/peopleSlice';
import { savePeople } from '../../services/storage';
import { initNfc, readNfcTag, cleanupNfc } from '../../services/nfc';
import { COLORS, SIZES } from '../../utils/theme';
import { Person } from '../../types/models';

type AddPersonNavigationProp = StackNavigationProp<RootStackParamList, 'AddPerson'>;

const AddPersonScreen = () => {
  const navigation = useNavigation<AddPersonNavigationProp>();
  const dispatch = useDispatch();
  
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<'friend' | 'partner' | 'family'>('friend');
  const [imageUri, setImageUri] = useState('https://via.placeholder.com/150');
  const [nfcTagId, setNfcTagId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [scanning, setScanning] = useState(false);
  const [nfcAvailable, setNfcAvailable] = useState(false);

  useEffect(() => {
    const checkNfc = async () => {
      const isAvailable = await initNfc();
      setNfcAvailable(isAvailable);
    };
    
    checkNfc();
    
    return () => {
      cleanupNfc();
    };
  }, []);

  const handleScanNfc = async () => {
    if (!nfcAvailable) {
      Alert.alert('エラー', 'お使いの端末ではNFCがサポートされていないか、無効になっています。');
      return;
    }
    
    setScanning(true);
    Alert.alert(
      'NFCスキャン',
      'NFCタグを端末に近づけてください',
      [
        {
          text: 'キャンセル',
          onPress: () => {
            setScanning(false);
            cleanupNfc();
          },
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
    
    try {
      const tagId = await readNfcTag();
      setScanning(false);
      
      if (tagId) {
        setNfcTagId(tagId);
        Alert.alert('成功', 'NFCタグを登録しました。');
      } else {
        Alert.alert('エラー', 'NFCタグのスキャンに失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('NFCスキャンエラー:', error);
      setScanning(false);
      Alert.alert('エラー', 'NFCタグのスキャンに失敗しました。もう一度お試しください。');
    } finally {
      cleanupNfc();
    }
  };

  const handleAddPerson = () => {
    if (!name.trim()) {
      Alert.alert('エラー', '名前を入力してください。');
      return;
    }

    const newPerson: Person = {
      id: Date.now().toString(),
      name: name.trim(),
      relationship,
      imageUri,
      nfcTagId,
      meetCount: 0,
      lastMeetDate: null,
      title: '新しい出会い',
      notes: notes.trim(),
      memories: [],
    };

    dispatch(addPerson(newPerson));
    
    // AsyncStorageに保存
    savePeople([newPerson])
      .then(() => {
        Alert.alert(
          '追加完了',
          `${name}さんを追加しました。`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home'),
            },
          ]
        );
      })
      .catch(error => {
        console.error('保存エラー:', error);
        Alert.alert('エラー', 'データの保存に失敗しました。');
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageUri }} 
            style={styles.profileImage} 
          />
          <TouchableOpacity style={styles.changeImageButton}>
            <Text style={styles.changeImageText}>画像を変更</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>名前 *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="名前を入力"
            placeholderTextColor={COLORS.lightText}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>関係</Text>
          <View style={styles.relationshipContainer}>
            <TouchableOpacity
              style={[
                styles.relationshipButton,
                relationship === 'friend' && styles.selectedRelationship,
              ]}
              onPress={() => setRelationship('friend')}
            >
              <Text 
                style={[
                  styles.relationshipText,
                  relationship === 'friend' && styles.selectedRelationshipText,
                ]}
              >
                友達
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.relationshipButton,
                relationship === 'partner' && styles.selectedRelationship,
              ]}
              onPress={() => setRelationship('partner')}
            >
              <Text 
                style={[
                  styles.relationshipText,
                  relationship === 'partner' && styles.selectedRelationshipText,
                ]}
              >
                パートナー
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.relationshipButton,
                relationship === 'family' && styles.selectedRelationship,
              ]}
              onPress={() => setRelationship('family')}
            >
              <Text 
                style={[
                  styles.relationshipText,
                  relationship === 'family' && styles.selectedRelationshipText,
                ]}
              >
                家族
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>NFCタグ</Text>
          <View style={styles.nfcContainer}>
            {nfcTagId ? (
              <Text style={styles.nfcTagText}>{nfcTagId}</Text>
            ) : (
              <Text style={styles.nfcPlaceholder}>NFCタグを登録</Text>
            )}
            <TouchableOpacity 
              style={styles.scanButton} 
              onPress={handleScanNfc}
              disabled={scanning}
            >
              {scanning ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.scanButtonText}>スキャン</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>メモ</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="メモを入力"
            placeholderTextColor={COLORS.lightText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddPerson}>
          <Text style={styles.addButtonText}>追加する</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  formContainer: {
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  changeImageButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  changeImageText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: SIZES.small,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 12,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  relationshipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  relationshipButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 10,
    margin: 2,
    alignItems: 'center',
  },
  selectedRelationship: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  relationshipText: {
    color: COLORS.text,
    fontSize: SIZES.medium,
  },
  selectedRelationshipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  nfcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  nfcPlaceholder: {
    flex: 1,
    color: COLORS.lightText,
    fontSize: SIZES.medium,
  },
  nfcTagText: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.small,
  },
  scanButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: SIZES.small,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: SIZES.large,
  },
});

export default AddPersonScreen;