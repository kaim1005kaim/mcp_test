import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { RootState } from '../../store';
import { COLORS, SIZES } from '../../utils/theme';

type MeetSuccessRouteProp = RouteProp<RootStackParamList, 'MeetSuccess'>;
type MeetSuccessNavigationProp = StackNavigationProp<RootStackParamList, 'MeetSuccess'>;

interface MeetSuccessProps {
  route: MeetSuccessRouteProp;
}

const MeetSuccessScreen: React.FC<MeetSuccessProps> = ({ route }) => {
  const { personId } = route.params;
  const navigation = useNavigation<MeetSuccessNavigationProp>();
  const person = useSelector((state: RootState) => 
    state.people.people.find(p => p.id === personId)
  );

  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // アニメーションの開始
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // 自動的にホーム画面に戻る
    const timeout = setTimeout(() => {
      navigation.navigate('Home');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigation, scaleAnim, opacityAnim]);

  if (!person) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>ユーザーが見つかりませんでした</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>ホームに戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.successContainer, 
          { 
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }
        ]}
      >
        <Image 
          source={{ uri: person.imageUri || 'https://via.placeholder.com/150' }} 
          style={styles.image} 
        />
        <Text style={styles.nameText}>{person.name}</Text>
        <Text style={styles.meetCountText}>
          {person.meetCount}回目の出会い
        </Text>
        <Text style={styles.titleText}>{person.title}</Text>
      </Animated.View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>ホームに戻る</Text>
      </TouchableOpacity>
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
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    width: '90%',
    marginBottom: 30,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  nameText: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  meetCountText: {
    fontSize: SIZES.large,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  titleText: {
    fontSize: SIZES.medium,
    color: COLORS.text,
    textAlign: 'center',
  },
  errorText: {
    fontSize: SIZES.large,
    color: COLORS.error,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MeetSuccessScreen;