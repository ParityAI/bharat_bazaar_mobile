import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '../src/constants/theme';
import { notifications } from '../src/constants/mockData';

const getNotificationStyle = (type: string) => {
  switch (type) {
    case 'urgent':
      return { color: Colors.error, bg: Colors.errorLight, icon: 'alert-circle' as const };
    case 'warning':
      return { color: Colors.warning, bg: Colors.warningLight, icon: 'warning' as const };
    case 'info':
      return { color: Colors.info, bg: Colors.infoLight, icon: 'information-circle' as const };
    case 'success':
      return { color: Colors.success, bg: Colors.successLight, icon: 'checkmark-circle' as const };
    default:
      return { color: Colors.textMuted, bg: Colors.divider, icon: 'ellipse' as const };
  }
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [readAll, setReadAll] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>🔔 Notifications</Text>
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>3 new</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.markAllButton} onPress={() => setReadAll(true)}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notifications.map((notification, index) => {
          const typeStyle = getNotificationStyle(notification.type);
          const isNew = !readAll && index < 3;
          
          return (
            <View 
              key={notification.id} 
              style={[
                styles.notificationCard,
                isNew && styles.notificationCardNew,
              ]}
            >
              <View style={[styles.iconContainer, { backgroundColor: typeStyle.bg }]}>
                <Ionicons name={typeStyle.icon} size={22} color={typeStyle.color} />
              </View>
              
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                  {isNew && <View style={styles.newDot} />}
                </View>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                {notification.action && (
                  <TouchableOpacity style={[styles.actionButton, { borderColor: typeStyle.color }]} onPress={() => {
                    Alert.alert('Action', `${notification.action} - Feature coming soon!`, [{ text: 'OK' }]);
                  }}>
                    <Text style={[styles.actionButtonText, { color: typeStyle.color }]}>
                      {notification.action}
                    </Text>
                    <Ionicons name="arrow-forward" size={14} color={typeStyle.color} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
        
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  newBadge: {
    backgroundColor: Colors.error,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  newBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textWhite,
  },
  markAllButton: {
    padding: Spacing.sm,
  },
  markAllText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  notificationCardNew: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  newDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: Spacing.sm,
  },
  notificationMessage: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.sm,
    gap: 4,
  },
  actionButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
});
