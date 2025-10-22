<template>
  <div class="chatbot-container">
    <!-- Chatbot Toggle Button -->
    <button 
      class="chatbot-toggle"
      @click="toggleChat"
      :class="{ 'chatbot-toggle-active': isOpen }"
    >
      <i class="fas fa-comments" v-if="!isOpen"></i>
      <i class="fas fa-times" v-else></i>
      <span class="chatbot-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
    </button>

    <!-- Chatbot Window -->
    <div class="chatbot-window" :class="{ 'chatbot-window-open': isOpen }">
      <!-- Chatbot Header -->
      <div class="chatbot-header">
        <div class="chatbot-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="chatbot-info">
          <h4>EduBot</h4>
          <span class="chatbot-status">Online</span>
        </div>
        <button class="chatbot-minimize" @click="toggleChat">
          <i class="fas fa-minus"></i>
        </button>
      </div>

      <!-- Chat Messages -->
      <div class="chatbot-messages" ref="messagesContainer">
        <div 
          v-for="message in messages" 
          :key="message.id"
          class="chatbot-message"
          :class="{ 'chatbot-message-user': message.isUser }"
        >
          <div class="chatbot-message-avatar" v-if="!message.isUser">
            <i class="fas fa-robot"></i>
          </div>
          <div class="chatbot-message-content">
            <div class="chatbot-message-bubble">
              <p v-html="message.text"></p>
              <span class="chatbot-message-time">{{ formatTime(message.timestamp) }}</span>
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="chatbot-message chatbot-message-bot">
          <div class="chatbot-message-avatar">
            <i class="fas fa-robot"></i>
          </div>
          <div class="chatbot-message-content">
            <div class="chatbot-message-bubble chatbot-typing">
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="chatbot-input">
        <div class="chatbot-input-container">
          <input 
            type="text" 
            v-model="inputMessage"
            @keyup.enter="sendMessage"
            placeholder="Ask me about classes, locations, or anything else..."
            class="chatbot-input-field"
            :disabled="isTyping"
          >
          <button 
            @click="sendMessage"
            class="chatbot-send-btn"
            :disabled="!inputMessage.trim() || isTyping"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        
        <!-- Quick Actions -->
        <div class="chatbot-quick-actions" v-if="messages.length === 0">
          <button 
            v-for="action in quickActions" 
            :key="action.text"
            @click="sendQuickMessage(action.text)"
            class="chatbot-quick-btn"
          >
            {{ action.text }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import { useMainStore } from '../stores'

export default {
  name: 'Chatbot',
  setup() {
    const store = useMainStore()
    
    // Reactive state
    const isOpen = ref(false)
    const inputMessage = ref('')
    const isTyping = ref(false)
    const unreadCount = ref(0)
    const messagesContainer = ref(null)
    
    // Messages array
    const messages = reactive([
      {
        id: 1,
        text: "👋 Hi! I'm EduBot, your virtual assistant for after-school classes. How can I help you today?",
        isUser: false,
        timestamp: new Date()
      }
    ])

    // Quick action buttons
    const quickActions = [
      { text: "Show me all classes" },
      { text: "Math classes" },
      { text: "What's the pricing?" },
      { text: "Help with checkout" }
    ]

    // Computed properties
    const hasUnreadMessages = computed(() => unreadCount.value > 0)

    // Methods
    const toggleChat = () => {
      isOpen.value = !isOpen.value
      if (isOpen.value) {
        unreadCount.value = 0
        nextTick(() => {
          scrollToBottom()
        })
      }
    }

    const sendMessage = async () => {
      if (!inputMessage.value.trim() || isTyping.value) return

      const userMessage = inputMessage.value.trim()
      inputMessage.value = ''

      // Add user message
      messages.push({
        id: Date.now(),
        text: userMessage,
        isUser: true,
        timestamp: new Date()
      })

      scrollToBottom()

      // Show typing indicator
      isTyping.value = true
      
      // Simulate bot response delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

      // Generate bot response
      const botResponse = generateBotResponse(userMessage)
      
      // Remove typing indicator
      isTyping.value = false

      // Add bot response
      messages.push({
        id: Date.now() + 1,
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      })

      scrollToBottom()

      // Increment unread count if chat is closed
      if (!isOpen.value) {
        unreadCount.value++
      }
    }

    const sendQuickMessage = (text) => {
      inputMessage.value = text
      sendMessage()
    }

    const generateBotResponse = (userMessage) => {
      const message = userMessage.toLowerCase()
      
      // Class availability
      if (message.includes('class') || message.includes('available') || message.includes('what') || message.includes('show me all')) {
        const totalClasses = store.lessons.length
        const availableClasses = store.availableLessons.length
        
        if (totalClasses > 0) {
          let response = `📚 We have <strong>${totalClasses} classes</strong> available with <strong>${availableClasses}</strong> having open spots!<br><br>`
          
          if (message.includes('show me all') || message.includes('list all')) {
            response += `<strong>All Available Classes:</strong><br>`
            
            store.lessons.slice(0, 5).forEach(lesson => {
              const status = lesson.space > 0 ? `✅ ${lesson.space} spots` : '❌ Full'
              const icon = lesson.subject === 'Mathematics' ? '🧮' : 
                          lesson.subject === 'Science' ? '🔬' : 
                          lesson.subject === 'Art' ? '🎨' : 
                          lesson.subject === 'Music' ? '🎵' : 
                          lesson.subject === 'English Literature' ? '📖' : '📚'
              
              response += `${icon} <strong>${lesson.subject}</strong> in ${lesson.location}<br>`
              response += `  💰 £${lesson.price} | ${status}<br><br>`
            })
            
            if (store.lessons.length > 5) {
              response += `...and ${store.lessons.length - 5} more classes! Check the main page for the complete list.`
            }
          } else {
            response += `You can browse all classes on the main page. Would you like me to help you find something specific?`
          }
          
          return response
        }
        
        return `📚 We have classes available! Check out our main page to see all options. Would you like me to help you find something specific?`
      }
      
      // Math classes
      if (message.includes('math') || message.includes('mathematics')) {
        const mathClasses = store.lessons.filter(l => l.subject.toLowerCase().includes('math'))
        if (mathClasses.length > 0) {
          const availableMath = mathClasses.filter(l => l.space > 0)
          let response = `🧮 Great choice! We have <strong>${mathClasses.length} math classes</strong> available`
          
          if (availableMath.length > 0) {
            response += ` with <strong>${availableMath.length}</strong> having open spots!<br><br>`
            response += `<strong>Available Math Classes:</strong><br>`
            
            mathClasses.slice(0, 3).forEach(lesson => {
              const status = lesson.space > 0 ? `✅ ${lesson.space} spots` : '❌ Full'
              response += `• <strong>${lesson.subject}</strong> in ${lesson.location}<br>`
              response += `  💰 £${lesson.price} | ${status}<br><br>`
            })
            
            if (mathClasses.length > 3) {
              response += `...and ${mathClasses.length - 3} more! Check the main page for all options.`
            }
          } else {
            response += `, but unfortunately all are currently full. Check back later for new openings!`
          }
          
          return response
        }
        return `🧮 We have several math classes available! Check out our Mathematics section on the main page to see all options.`
      }
      
      // Pricing
      if (message.includes('price') || message.includes('cost') || message.includes('expensive')) {
        if (store.lessons.length > 0) {
          const prices = store.lessons.map(l => l.price)
          const minPrice = Math.min(...prices)
          const maxPrice = Math.max(...prices)
          const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
          
          let response = `💰 Our classes range from <strong>£${minPrice}</strong> to <strong>£${maxPrice}</strong> per session (average: £${avgPrice}).<br><br>`
          response += `<strong>Price Breakdown by Subject:</strong><br>`
          
          // Group by subject and show price ranges
          const subjectPrices = {}
          store.lessons.forEach(lesson => {
            if (!subjectPrices[lesson.subject]) {
              subjectPrices[lesson.subject] = []
            }
            subjectPrices[lesson.subject].push(lesson.price)
          })
          
          Object.keys(subjectPrices).forEach(subject => {
            const prices = subjectPrices[subject]
            const min = Math.min(...prices)
            const max = Math.max(...prices)
            const icon = subject === 'Mathematics' ? '🧮' : 
                        subject === 'Science' ? '🔬' : 
                        subject === 'Art' ? '🎨' : 
                        subject === 'Music' ? '🎵' : 
                        subject === 'English Literature' ? '📖' : '📚'
            
            if (min === max) {
              response += `${icon} <strong>${subject}</strong>: £${min}<br>`
            } else {
              response += `${icon} <strong>${subject}</strong>: £${min} - £${max}<br>`
            }
          })
          
          return response
        }
        return `💰 Our classes have competitive pricing! Check out our class listings to see specific prices for each subject and location.`
      }
      
      // Checkout help
      if (message.includes('checkout') || message.includes('cart') || message.includes('buy') || message.includes('purchase')) {
        return `🛒 To purchase classes: 1) Add classes to your cart, 2) Go to your cart, 3) Fill in your details, 4) Complete the order! I can help you find specific classes if you need.`
      }
      
      // Location queries
      if (message.includes('location') || message.includes('where') || message.includes('near')) {
        const locations = [...new Set(store.lessons.map(l => l.location))]
        return `📍 We have classes in <strong>${locations.join(', ')}</strong>. You can filter by location on the main page to see classes in specific areas.`
      }
      
      // Science classes
      if (message.includes('science') || message.includes('scientific')) {
        const scienceClasses = store.lessons.filter(l => l.subject.toLowerCase().includes('science'))
        if (scienceClasses.length > 0) {
          const availableScience = scienceClasses.filter(l => l.space > 0)
          let response = `🔬 We have <strong>${scienceClasses.length} science classes</strong> available`
          
          if (availableScience.length > 0) {
            response += ` with <strong>${availableScience.length}</strong> having open spots!<br><br>`
            response += `<strong>Available Science Classes:</strong><br>`
            
            scienceClasses.slice(0, 3).forEach(lesson => {
              const status = lesson.space > 0 ? `✅ ${lesson.space} spots` : '❌ Full'
              response += `• <strong>${lesson.subject}</strong> in ${lesson.location}<br>`
              response += `  💰 £${lesson.price} | ${status}<br><br>`
            })
            
            if (scienceClasses.length > 3) {
              response += `...and ${scienceClasses.length - 3} more! Check the main page for all options.`
            }
          } else {
            response += `, but unfortunately all are currently full. Check back later for new openings!`
          }
          
          return response
        }
        return `🔬 We have exciting science classes available! Check out our Science section to explore hands-on experiments and scientific learning.`
      }
      
      // Art classes
      if (message.includes('art') || message.includes('creative') || message.includes('drawing')) {
        const artClasses = store.lessons.filter(l => l.subject.toLowerCase().includes('art'))
        if (artClasses.length > 0) {
          const availableArt = artClasses.filter(l => l.space > 0)
          let response = `🎨 We have <strong>${artClasses.length} art classes</strong> available`
          
          if (availableArt.length > 0) {
            response += ` with <strong>${availableArt.length}</strong> having open spots!<br><br>`
            response += `<strong>Available Art Classes:</strong><br>`
            
            artClasses.slice(0, 3).forEach(lesson => {
              const status = lesson.space > 0 ? `✅ ${lesson.space} spots` : '❌ Full'
              response += `• <strong>${lesson.subject}</strong> in ${lesson.location}<br>`
              response += `  💰 £${lesson.price} | ${status}<br><br>`
            })
            
            if (artClasses.length > 3) {
              response += `...and ${artClasses.length - 3} more! Check the main page for all options.`
            }
          } else {
            response += `, but unfortunately all are currently full. Check back later for new openings!`
          }
          
          return response
        }
        return `🎨 Our art classes are perfect for creative minds! We offer various art programs to help students express their creativity.`
      }
      
      // Music classes
      if (message.includes('music') || message.includes('musical') || message.includes('instrument')) {
        const musicClasses = store.lessons.filter(l => l.subject.toLowerCase().includes('music'))
        if (musicClasses.length > 0) {
          const availableMusic = musicClasses.filter(l => l.space > 0)
          let response = `🎵 We have <strong>${musicClasses.length} music classes</strong> available`
          
          if (availableMusic.length > 0) {
            response += ` with <strong>${availableMusic.length}</strong> having open spots!<br><br>`
            response += `<strong>Available Music Classes:</strong><br>`
            
            musicClasses.slice(0, 3).forEach(lesson => {
              const status = lesson.space > 0 ? `✅ ${lesson.space} spots` : '❌ Full'
              response += `• <strong>${lesson.subject}</strong> in ${lesson.location}<br>`
              response += `  💰 £${lesson.price} | ${status}<br><br>`
            })
            
            if (musicClasses.length > 3) {
              response += `...and ${musicClasses.length - 3} more! Check the main page for all options.`
            }
          } else {
            response += `, but unfortunately all are currently full. Check back later for new openings!`
          }
          
          return response
        }
        return `🎵 We have wonderful music classes available! Check out our Music section to find the perfect musical learning experience.`
      }
      
      // English classes
      if (message.includes('english') || message.includes('literature') || message.includes('reading') || message.includes('writing')) {
        const englishClasses = store.lessons.filter(l => l.subject.toLowerCase().includes('english'))
        if (englishClasses.length > 0) {
          const availableEnglish = englishClasses.filter(l => l.space > 0)
          let response = `📖 We have <strong>${englishClasses.length} English Literature classes</strong> available`
          
          if (availableEnglish.length > 0) {
            response += ` with <strong>${availableEnglish.length}</strong> having open spots!<br><br>`
            response += `<strong>Available English Classes:</strong><br>`
            
            englishClasses.slice(0, 3).forEach(lesson => {
              const status = lesson.space > 0 ? `✅ ${lesson.space} spots` : '❌ Full'
              response += `• <strong>${lesson.subject}</strong> in ${lesson.location}<br>`
              response += `  💰 £${lesson.price} | ${status}<br><br>`
            })
            
            if (englishClasses.length > 3) {
              response += `...and ${englishClasses.length - 3} more! Check the main page for all options.`
            }
          } else {
            response += `, but unfortunately all are currently full. Check back later for new openings!`
          }
          
          return response
        }
        return `📖 Our English Literature classes are designed to enhance reading, writing, and critical thinking skills. Perfect for all levels!`
      }
      
      // Help
      if (message.includes('help') || message.includes('support')) {
        return `🤝 I'm here to help! I can assist with finding classes, explaining pricing, helping with checkout, or answering questions about our programs. What would you like to know?`
      }
      
      // Greeting
      if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return `👋 Hello! Welcome to EduMarket! I'm here to help you find the perfect after-school classes. What are you interested in learning?`
      }
      
      // Default response
      const defaultResponses = [
        "That's a great question! I'd be happy to help you find information about our classes. What specific topic interests you?",
        "I can help you with class information, pricing, locations, or checkout assistance. What would you like to know?",
        "Let me help you find what you're looking for! Are you interested in a particular subject or have questions about our programs?",
        "I'm here to assist! You can ask me about available classes, pricing, locations, or anything else about our educational programs."
      ]
      
      return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
    }

    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    }

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    // Lifecycle
    onMounted(() => {
      // Initialize with some helpful context
      if (store.lessons.length === 0) {
        store.fetchLessons()
      }
    })

    return {
      isOpen,
      inputMessage,
      isTyping,
      unreadCount,
      messagesContainer,
      messages,
      quickActions,
      hasUnreadMessages,
      toggleChat,
      sendMessage,
      sendQuickMessage,
      scrollToBottom,
      formatTime
    }
  }
}
</script>

<style scoped>
/* Chatbot Container */
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: 'Inter', sans-serif;
}

/* Toggle Button */
.chatbot-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chatbot-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
}

.chatbot-toggle-active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.chatbot-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Chatbot Window */
.chatbot-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 380px;
  height: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transform: translateY(20px) scale(0.9);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chatbot-window-open {
  transform: translateY(0) scale(1);
  opacity: 1;
  visibility: visible;
}

/* Header */
.chatbot-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.chatbot-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.chatbot-info h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.chatbot-status {
  font-size: 12px;
  opacity: 0.9;
}

.chatbot-minimize {
  margin-left: auto;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.chatbot-minimize:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Messages */
.chatbot-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chatbot-message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.chatbot-message-user {
  flex-direction: row-reverse;
}

.chatbot-message-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  flex-shrink: 0;
}

.chatbot-message-content {
  max-width: 80%;
}

.chatbot-message-bubble {
  background: #f8fafc;
  border-radius: 18px;
  padding: 12px 16px;
  position: relative;
  border: 1px solid #e2e8f0;
}

.chatbot-message-user .chatbot-message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.chatbot-message-bubble p {
  margin: 0;
  line-height: 1.4;
  font-size: 14px;
}

.chatbot-message-time {
  font-size: 11px;
  opacity: 0.7;
  display: block;
  margin-top: 4px;
}

.chatbot-message-user .chatbot-message-time {
  color: rgba(255, 255, 255, 0.8);
}

/* Typing Indicator */
.chatbot-typing {
  padding: 16px 20px;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Input */
.chatbot-input {
  padding: 20px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.chatbot-input-container {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.chatbot-input-field {
  flex: 1;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  padding: 12px 16px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.chatbot-input-field:focus {
  border-color: #667eea;
}

.chatbot-input-field:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.chatbot-send-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.chatbot-send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.chatbot-send-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
}

/* Quick Actions */
.chatbot-quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chatbot-quick-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #475569;
}

.chatbot-quick-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Responsive Design */
@media (max-width: 480px) {
  .chatbot-container {
    bottom: 10px;
    right: 10px;
  }
  
  .chatbot-window {
    width: calc(100vw - 20px);
    height: calc(100vh - 100px);
    right: -10px;
  }
  
  .chatbot-toggle {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}

/* Scrollbar Styling */
.chatbot-messages::-webkit-scrollbar {
  width: 4px;
}

.chatbot-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chatbot-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.chatbot-messages::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
