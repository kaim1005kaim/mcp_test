import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Person } from '../../types/models';
import { COLORS, SIZES } from '../../utils/theme';

interface PersonCardProps {
  person: Person;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

const PersonCard: React.FC<PersonCardProps> = ({ person, onPress }) => {
  const getRelationshipJapanese = (relationship: string) => {
    switch (relationship) {
      case 'friend': return '友達';
      case 'partner': return 'パートナー';
      case 'family': return '家族';
      default: return relationship;
    }
  };

  const lastMeetDate = person.lastMeetDate 
    ? new Date(person.lastMeetDate).toLocaleDateString('ja-JP') 
    : '未記録';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: person.imageUri || 'https://via.placeholder.com/150' }} 
          style={styles.image} 
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{person.name}</Text>
          <Text style={styles.relationship}>{getRelationshipJapanese(person.relationship)}</Text>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.countContainer}>
          <Text style={styles.count}>{person.meetCount}</Text>
          <Text style={styles.countLabel}>回会った</Text>
        </View>
        
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>最後に会った日:</Text>
          <Text style={styles.date}>{lastMeetDate}</Text>
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.titleLabel}>タイトル</Text>
          <Text style={styles.title}>{person.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 450,
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: (width - CARD_WIDTH) / 2,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 7,
    overflow: 'hidden',
  },
  imageContainer: {
    height: '50%',
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  nameContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  name: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  relationship: {
    fontSize: SIZES.medium,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  count: {
    fontSize: SIZES.xxLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 5,
  },
  countLabel: {
    fontSize: SIZES.medium,
    color: COLORS.lightText,
  },
  dateContainer: {
    marginVertical: 15,
  },
  dateLabel: {
    fontSize: SIZES.small,
    color: COLORS.lightText,
    marginBottom: 5,
  },
  date: {
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  titleContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
  },
  titleLabel: {
    fontSize: SIZES.small,
    color: COLORS.lightText,
    marginBottom: 5,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

export default PersonCard;