import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../src/constants/theme';
import { chatMessages as initialMessages, languageOptions, quickChips, storeOwner } from '../src/constants/mockData';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

const aiResponses: { [key: string]: string } = {
  'stock check': `Rajesh ji, aapka stock status:\n\n• Basmati Rice 5kg: 45 units ✅\n• Toor Dal 1kg: 12 units ⚠️ Low\n• Sugar 1kg: 78 units ✅\n• Maggi 4-pack: 5 units ⚠️ Low\n\nSuggestion: Dal aur Maggi ka order karein!`,
  "today's sales": `Aaj ki sales summary:\n\n• Total Revenue: ₹12,850\n• Items Sold: 47\n• Top Seller: Basmati Rice (12 units)\n• Average Bill: ₹273\n\nKal se 18% zyada hai! 📈`,
  'price suggestion': `Popular products ke liye price suggestions:\n\n• Basmati Rice 5kg: ₹365 (Balanced strategy)\n• Toor Dal 1kg: ₹155 (Competitive)\n• Sugar 1kg: ₹48 (Premium)\n\nDiwali special: 5-10% premium add karein!`,
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    Keyboard.dismiss();

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let aiResponse = '';

      // Check for quick chips
      for (const [key, value] of Object.entries(aiResponses)) {
        if (lowerText.includes(key)) {
          aiResponse = value;
          break;
        }
      }

      // Default response
      if (!aiResponse) {
        aiResponse = `${storeOwner.name} ji, main aapki madad ke liye ready hoon! 🙏\n\nAap mujhse puch sakte hain:\n• Stock status\n• Today's sales\n• Price suggestions\n• Weather forecast\n• Festival recommendations\n\nKya jaanna chahte hain?`;
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickChip = (chip: string) => {
    sendMessage(chip);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>🧮</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Munim-ji AI</Text>
            <Text style={styles.headerSubtitle}>Your Business Advisor</Text>
          </View>
        </View>
      </View>

      {/* Language Selector */}
      <View style={styles.languageSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.languagePills}>
          {languageOptions.map(lang => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languagePill,
                selectedLanguage === lang.code && styles.languagePillSelected,
              ]}
              onPress={() => setSelectedLanguage(lang.code)}
            >
              <Text
                style={[
                  styles.languagePillText,
                  selectedLanguage === lang.code && styles.languagePillTextSelected,
                ]}
              >
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(message => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.type === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              {message.type === 'ai' && (
                <View style={styles.aiMessageAvatar}>
                  <Text style={styles.aiAvatarSmall}>🧮</Text>
                </View>
              )}
              <View
                style={[
                  styles.messageContent,
                  message.type === 'user' ? styles.userMessageContent : styles.aiMessageContent,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.type === 'user' ? styles.userMessageText : styles.aiMessageText,
                  ]}
                >
                  {message.message}
                </Text>
              </View>
            </View>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <View style={styles.aiMessageAvatar}>
                <Text style={styles.aiAvatarSmall}>🧮</Text>
              </View>
              <View style={[styles.messageContent, styles.aiMessageContent, styles.typingIndicator]}>
                <Text style={styles.typingText}>Munim-ji is typing...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Chips */}
        <View style={styles.quickChipsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickChipsScroll}>
            {quickChips.map((chip, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickChip}
                onPress={() => handleQuickChip(chip)}
              >
                <Text style={styles.quickChipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor={Colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={styles.micButton}>
              <Ionicons name="mic-outline" size={22} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color={Colors.textWhite} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  aiAvatarText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  languageSelector: {
    backgroundColor: Colors.card,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  languagePills: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  languagePill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  languagePillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  languagePillText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  languagePillTextSelected: {
    color: Colors.textWhite,
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.md,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  aiBubble: {
    justifyContent: 'flex-start',
  },
  aiMessageAvatar: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  aiAvatarSmall: {
    fontSize: 16,
  },
  messageContent: {
    maxWidth: '75%',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  userMessageContent: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  aiMessageContent: {
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageText: {
    fontSize: FontSizes.md,
    lineHeight: 22,
  },
  userMessageText: {
    color: Colors.textWhite,
  },
  aiMessageText: {
    color: Colors.textPrimary,
  },
  typingIndicator: {
    backgroundColor: Colors.divider,
  },
  typingText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  quickChipsContainer: {
    backgroundColor: Colors.background,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  quickChipsScroll: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  quickChip: {
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  quickChipText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.md,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm : 0,
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    maxHeight: 100,
    paddingVertical: Platform.OS === 'ios' ? 0 : Spacing.sm,
  },
  micButton: {
    padding: Spacing.xs,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.textMuted,
  },
});
