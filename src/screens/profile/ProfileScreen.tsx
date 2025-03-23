import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { RootState } from '../../store';
import { updatePerson } from '../../store/slices/peopleSlice';
import { savePeople } from '../../services/storage';
import { COLORS, SIZES } from '../../utils/theme';
import { Person, Memory } from '../../types/models';

type ProfileRouteProp = RouteProp<RootStackParamList, 'Profile'>;
type ProfileNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface ProfileScreenProps {
  route: ProfileRouteProp;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ route }) => {
  const { personId } = route.params;
  const navigation = useNavigation<ProfileNavigationProp>();
  const dispatch = useDispatch();
  const person = useSelector((state: RootState) => 
    state.people.people.find(p => p.id === personId)
  );
  const [selectedTab, setSelectedTab] = useState<'info' | 'memories'>('info');

  if (!person) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>ユーザーが見つかりませんでした</Text>
      </View>
    );
  }

  const lastMeetDate = person.lastMeetDate 
    ? new Date(person.lastMeetDate).toLocaleDateString('ja-JP') 
    : '未記録';

  const getRelationshipJapanese = (relationship: string) => {
    switch (relationship) {
      case 'friend': return '友達';
      case 'partner': return 'パートナー';
      case 'family': return '家族';
      default: return relationship;
    }
  };

  const renderMemoryItem = (memory: Memory) => {
    return (
      <View key={memory.id} style={styles.memoryItem}>
        {memory.type === 'photo' ? (
          <Image 
            source={{ uri: memory.content }} 
            style={styles.memoryImage} 
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.memoryContent}>{memory.content}</Text>
        )}
        <Text style={styles.memoryDate}>
          {new Date(memory.createdAt).toLocaleDateString('ja-JP')}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: person.imageUri || 'https://via.placeholder.com/150' }} 
          style={styles.profileImage} 
        />
        <Text style={styles.nameText}>{person.name}</Text>
        <Text style={styles.relationshipText}>
          {getRelationshipJapanese(person.relationship)}
        </Text>
        <View style={styles.countContainer}>
          <Text style={styles.countText}>{person.meetCount}</Text>
          <Text style={styles.countLabel}>回会った</Text>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleLabel}>タイトル</Text>
        <Text style={styles.titleText}>{person.title}</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'info' && styles.selectedTab]} 
          onPress={() => setSelectedTab('info')}
        >
          <Text style={styles.tabText}>情報</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'memories' && styles.selectedTab]} 
          onPress={() => setSelectedTab('memories')}
        >
          <Text style={styles.tabText}>メモリー</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'info' ? (
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>最後に会った日</Text>
            <Text style={styles.infoValue}>{lastMeetDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NFCタグID</Text>
            <Text style={styles.infoValue}>{person.nfcTagId || '未登録'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>メモ</Text>
            <Text style={styles.infoValue}>{person.notes || '未記入'}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.memoriesContainer}>
          {person.memories && person.memories.length > 0 ? (
            person.memories.map(renderMemoryItem)
          ) : (
            <Text style={styles.emptyMemoriesText}>
              まだメモリーがありません。思い出を追加しましょう。
            </Text>
          )}
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>メモリーを追加</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  nameText: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  relationshipText: {
    fontSize: SIZES.medium,
    color: COLORS.lightText,
    marginBottom: 10,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 5,
  },
  countText: {
    fontSize: SIZES.xxLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 5,
  },
  countLabel: {
    fontSize: SIZES.medium,
    color: COLORS.lightText,
  },
  titleContainer: {
    padding: 15,
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
  },
  titleLabel: {
    fontSize: SIZES.small,
    color: COLORS.lightText,
    marginBottom: 5,
  },
  titleText: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 15,
  },
  infoRow: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: SIZES.small,
    color: COLORS.lightText,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  memoriesContainer: {
    backgroundColor: 'white',
    padding: 15,
  },
  memoryItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  memoryImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  memoryContent: {
    fontSize: SIZES.medium,
    color: COLORS.text,
    marginBottom: 10,
  },
  memoryDate: {
    fontSize: SIZES.small,
    color: COLORS.lightText,
    textAlign: 'right',
  },
  emptyMemoriesText: {
    fontSize: SIZES.medium,
    color: COLORS.lightText,
    textAlign: 'center',
    marginVertical: 30,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: SIZES.large,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ProfileScreen;