import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '../src/constants/theme';
import { useAuth } from '../src/context/AuthContext';
import {
  getStoreProfile,
  saveStoreProfile,
  getSettings,
  saveSettings,
  StoreProfile,
  AppSettings,
} from '../src/services/storage';
import { cities, categories, languageOptions } from '../src/constants/mockData';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState<StoreProfile>({
    storeName: '',
    ownerName: user?.name || '',
    phone: user?.phone || '',
    city: 'Lucknow',
    gstin: '',
    categories: ['1', '2'],
    language: 'hi',
  });
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: false,
    language: 'hi',
    notifications: true,
    hapticFeedback: true,
  });
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const savedProfile = await getStoreProfile();
    if (savedProfile) setProfile(savedProfile);
    const savedSettings = await getSettings();
    if (savedSettings) setSettings(savedSettings);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveStoreProfile(profile);
      await saveSettings(settings);
      setIsEditing(false);
      Alert.alert('Saved', 'Your settings have been updated');
    } catch {
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? All local data will be cleared.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const toggleCategory = (id: string) => {
    setProfile(prev => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter(c => c !== id)
        : [...prev.categories, id],
    }));
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity onPress={isEditing ? handleSave : () => setIsEditing(true)}>
          <Text style={styles.editBtn}>{isEditing ? (isSaving ? 'Saving...' : 'Save') : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {(profile.ownerName || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.ownerName || 'Store Owner'}</Text>
            <Text style={styles.profilePhone}>{profile.phone}</Text>
          </View>
        </View>

        {/* Store Details */}
        <Text style={styles.sectionLabel}>Store Details</Text>
        <View style={styles.sectionCard}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Store Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.fieldInput}
                value={profile.storeName}
                onChangeText={(text) => setProfile(p => ({ ...p, storeName: text }))}
                placeholder="Enter store name"
                placeholderTextColor={Colors.textMuted}
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.storeName || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Owner Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.fieldInput}
                value={profile.ownerName}
                onChangeText={(text) => setProfile(p => ({ ...p, ownerName: text }))}
                placeholder="Enter name"
                placeholderTextColor={Colors.textMuted}
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.ownerName || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>GSTIN</Text>
            {isEditing ? (
              <TextInput
                style={styles.fieldInput}
                value={profile.gstin}
                onChangeText={(text) => setProfile(p => ({ ...p, gstin: text.toUpperCase() }))}
                placeholder="09AXXXX1234X1Z5"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="characters"
                maxLength={15}
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.gstin || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.field}
            onPress={() => isEditing && setShowCityPicker(true)}
            disabled={!isEditing}
          >
            <Text style={styles.fieldLabel}>City</Text>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldValue}>{profile.city}</Text>
              {isEditing && <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        {isEditing && (
          <>
            <Text style={styles.sectionLabel}>Categories</Text>
            <View style={styles.categoriesGrid}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    profile.categories.includes(cat.id) && styles.categoryChipSelected,
                  ]}
                  onPress={() => toggleCategory(cat.id)}
                >
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  <Text style={[
                    styles.categoryText,
                    profile.categories.includes(cat.id) && styles.categoryTextSelected,
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Language */}
        <Text style={styles.sectionLabel}>Language</Text>
        <View style={styles.languageRow}>
          {languageOptions.map(lang => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.langPill,
                settings.language === lang.code && styles.langPillActive,
              ]}
              onPress={() => updateSetting('language', lang.code)}
            >
              <Text style={[
                styles.langPillText,
                settings.language === lang.code && styles.langPillTextActive,
              ]}>
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Settings */}
        <Text style={styles.sectionLabel}>App Settings</Text>
        <View style={styles.sectionCard}>
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
              <Text style={styles.switchLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(v) => updateSetting('notifications', v)}
              trackColor={{ false: Colors.border, true: Colors.primary + '60' }}
              thumbColor={settings.notifications ? Colors.primary : Colors.textMuted}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Ionicons name="phone-portrait-outline" size={22} color={Colors.textPrimary} />
              <Text style={styles.switchLabel}>Haptic Feedback</Text>
            </View>
            <Switch
              value={settings.hapticFeedback}
              onValueChange={(v) => updateSetting('hapticFeedback', v)}
              trackColor={{ false: Colors.border, true: Colors.primary + '60' }}
              thumbColor={settings.hapticFeedback ? Colors.primary : Colors.textMuted}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Ionicons name="moon-outline" size={22} color={Colors.textPrimary} />
              <Text style={styles.switchLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={(v) => updateSetting('darkMode', v)}
              trackColor={{ false: Colors.border, true: Colors.primary + '60' }}
              thumbColor={settings.darkMode ? Colors.primary : Colors.textMuted}
            />
          </View>
        </View>

        {/* About */}
        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.sectionCard}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Version</Text>
            <Text style={styles.fieldValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Built with</Text>
            <Text style={styles.fieldValue}>Expo + React Native</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* City Picker Modal */}
      <Modal visible={showCityPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select City</Text>
              <TouchableOpacity onPress={() => setShowCityPicker(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={cities}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.cityItem, profile.city === item && styles.cityItemSelected]}
                  onPress={() => {
                    setProfile(p => ({ ...p, city: item }));
                    setShowCityPicker(false);
                  }}
                >
                  <Ionicons name="location" size={18} color={profile.city === item ? Colors.primary : Colors.textMuted} />
                  <Text style={[styles.cityItemText, profile.city === item && styles.cityItemTextSelected]}>
                    {item}
                  </Text>
                  {profile.city === item && <Ionicons name="checkmark" size={20} color={Colors.primary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  editBtn: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textWhite,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  profilePhone: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  sectionCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  field: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  fieldLabel: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    flex: 1,
  },
  fieldValue: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: FontWeights.medium,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fieldInput: {
    flex: 1,
    textAlign: 'right',
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: FontWeights.medium,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    marginLeft: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  categoryEmoji: {
    fontSize: 14,
  },
  categoryText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  categoryTextSelected: {
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  languageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  langPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  langPillText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  langPillTextActive: {
    color: Colors.textWhite,
    fontWeight: FontWeights.medium,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  switchLabel: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.errorLight,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  logoutText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing.sm,
  },
  cityItemSelected: {
    backgroundColor: Colors.primaryLight,
  },
  cityItemText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  cityItemTextSelected: {
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
});
