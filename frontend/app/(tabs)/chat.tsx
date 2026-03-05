import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '../../src/constants/theme';
import { chatMessages as initialMessages, languageOptions, quickChips, storeOwner } from '../../src/constants/mockData';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

const aiResponses: { [key: string]: string } = {
  'price': `Rajesh ji, Basmati Rice 5kg market update:\n\n📊 Prices:\n• Amazon: ₹389\n• BigBasket: ₹345\n• Local avg: ₹355\n\nAapka price ₹350 competitive hai! 👍\n\n💡 Diwali ke liye ₹375-380 consider karein.`,
  'stock': `${storeOwner.name} ji, aapka stock status:\n\n✅ Basmati Rice 5kg: 45 units\n⚠️ Toor Dal 1kg: 2 units (Low!)\n✅ Sugar 1kg: 78 units\n⚠️ Maggi 4-pack: 5 units (Low!)\n\n🚨 Suggestion: Dal aur Maggi ka order karein!`,
  'weather': `🌧️ Lucknow Weather Update:\nKal se barish ka forecast hai.\n\n📈 Business Impact:\n• Dal demand +15% ↑\n• Rice demand +12% ↑\n• Umbrella/raincoat +40% ↑\n\n👉 Extra stock rakhein dry goods ka.`,
  'festival': `🎆 Diwali Preparation Guide:\n\n📊 Last Year Data:\n• Sales +45% vs normal\n• Top sellers: Sweets, Dry fruits, Diyas\n\n📋 Stock Recommendations:\n• Kaju Katli: 20kg\n• Almonds: 15kg\n• Decorative items: 50 units\n\nOrder karna hai toh "order festival" bolein!`,
  'sales': `Aaj ki sales summary:\n\n💰 Total Revenue: ₹12,850\n📦 Items Sold: 47\n🏆 Top Seller: Basmati Rice (12 units)\n📈 Average Bill: ₹273\n\n🚀 Kal se 18% zyada hai! Bahut accha!`,
  'order': `Order placement ready!\n\n🛒 Available Wholesalers:\n• Vijay Wholesale - Dal specialist\n• Sharma Traders - Rice & Grains\n• Metro Cash & Carry - FMCG\n\nKaunsa item order karna hai?`,
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
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

    setIsTyping(true);
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let aiResponse = '';

      for (const [key, value] of Object.entries(aiResponses)) {
        if (lowerText.includes(key)) {
          aiResponse = value;
          break;
        }
      }

      if (!aiResponse) {
        aiResponse = `${storeOwner.name} ji, main aapki madad ke liye ready hoon! 🙏\n\nAap mujhse puch sakte hain:\n• Price check\n• Stock status\n• Weather forecast\n• Festival preparation\n• Today's sales\n\nKya jaanna chahte hain?`;
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

  const handleQuickChip = (action: string) => {
    sendMessage(action);
  };

  const handleMicPress = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      sendMessage('Mausam kaisa hai aaj?');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* WhatsApp-style Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>🧮</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Munim-ji AI</Text>
            <Text style={styles.headerSubtitle}>Your Business Advisor • Online</Text>
          </View>
        </View>
      </View>

      {/* Language Pills */}
      <View style={styles.languageBar}>
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
              <Text style={[
                styles.languagePillText,
                selectedLanguage === lang.code && styles.languagePillTextSelected,
              ]}>
                {lang.label}
              </Text>
              {selectedLanguage === lang.code && (
                <Ionicons name="checkmark" size={12} color={Colors.textWhite} style={{ marginLeft: 4 }} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                <Text style={[
                  styles.messageText,
                  message.type === 'user' ? styles.userMessageText : styles.aiMessageText,
                ]}>
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
              <View style={[styles.messageContent, styles.aiMessageContent, styles.typingContainer]}>
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
                  <View style={[styles.typingDot, { animationDelay: '200ms' }]} />
                  <View style={[styles.typingDot, { animationDelay: '400ms' }]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Listening Overlay */}
        {isListening && (
          <View style={styles.listeningOverlay}>
            <View style={styles.listeningPulse}>
              <Ionicons name="mic" size={40} color={Colors.error} />
            </View>
            <Text style={styles.listeningText}>🎤 Listening in Hindi...</Text>
          </View>
        )}

        {/* Quick Chips */}
        <View style={styles.quickChipsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickChipsScroll}>
            {quickChips.map((chip, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickChip}
                onPress={() => handleQuickChip(chip.action)}
              >
                <Text style={styles.quickChipText}>{chip.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type or speak..."
              placeholderTextColor={Colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
          </View>
          
          {inputText.trim() ? (
            <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(inputText)}>
              <Ionicons name="send" size={20} color={Colors.textWhite} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.micButton} onPress={handleMicPress}>
              <Ionicons name="mic" size={24} color={Colors.textWhite} />
            </TouchableOpacity>
          )}
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
    backgroundColor: Colors.whatsappGreen,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    color: Colors.textWhite,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  languageBar: {
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  languagePillSelected: {
    backgroundColor: Colors.whatsappGreen,
    borderColor: Colors.whatsappGreen,
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
    borderRadius: 16,
    backgroundColor: Colors.whatsappGreen + '20',
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
    borderRadius: BorderRadius.lg,
  },
  userMessageContent: {
    backgroundColor: Colors.whatsappBubble,
    borderBottomRightRadius: 4,
  },
  aiMessageContent: {
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 4,
    ...Shadows.sm,
  },
  messageText: {
    fontSize: FontSizes.md,
    lineHeight: 22,
  },
  userMessageText: {
    color: Colors.textPrimary,
  },
  aiMessageText: {
    color: Colors.textPrimary,
  },
  typingContainer: {
    paddingVertical: Spacing.md,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 6,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
  },
  listeningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listeningPulse: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  listeningText: {
    fontSize: FontSizes.lg,
    color: Colors.textWhite,
    fontWeight: FontWeights.medium,
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
    borderColor: Colors.whatsappGreen,
    ...Shadows.sm,
  },
  quickChipText: {
    fontSize: FontSizes.sm,
    color: Colors.whatsappGreen,
    fontWeight: FontWeights.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.md,
    backgroundColor: Colors.card,
    gap: Spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm : 0,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textInput: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    maxHeight: 100,
    paddingVertical: Platform.OS === 'ios' ? 0 : Spacing.sm,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.whatsappGreen,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
});
