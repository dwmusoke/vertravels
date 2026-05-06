/**
 * AI Travel Assistant - Smart Chatbot
 * Provides personalized travel recommendations and booking assistance
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@vertravels/ui'
import { Button } from '@vertravels/ui'
import { Input } from '@vertravels/ui'
import { Avatar, AvatarFallback } from '@vertravels/ui'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  MessageSquare,
  Send,
  Plane,
  Hotel,
  MapPin,
  Car,
  X,
  Bot,
  User,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  suggestions?: string[]
  bookingData?: any
}

interface TravelPreferences {
  budget?: number
  destination?: string
  travelDates?: {
    from: string
    to: string
  }
  interests?: string[]
  cabinClass?: 'economy' | 'business' | 'first'
  hotelStars?: number
  travelers?: number
}

export function AITravelAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Vera, your AI travel assistant. I can help you plan trips, find the best deals, and answer travel questions. How can I assist you today?",
      timestamp: new Date(),
      suggestions: [
        'Find flights to Paris',
        'Best hotels in Tokyo',
        'Plan a 7-day Europe trip',
        'Cheapest time to visit Dubai'
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [preferences, setPreferences] = useState<TravelPreferences>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClientComponentClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function generateAIResponse(userMessage: string): Promise<string> {
    // In production, this would call an AI API (OpenAI, Anthropic, etc.)
    // For now, we'll use rule-based responses
    
    const lowerMessage = userMessage.toLowerCase()
    
    // Flight-related queries
    if (lowerMessage.includes('flight') || lowerMessage.includes('fly') || lowerMessage.includes('airline')) {
      const destinations = lowerMessage.match(/\b([A-Z]{3})\b/)?.[0] || 
                          lowerMessage.match(/to (\w+)/i)?.[1]
      
      if (destinations) {
        return `I'd be happy to help you find flights! Let me search for the best deals to ${destinations}. What are your travel dates?`
      }
      
      return `I can help you find the best flight deals! Where would you like to fly to? I can search across multiple airlines including Emirates, Qatar Airways, Lufthansa, and more.`
    }
    
    // Hotel-related queries
    if (lowerMessage.includes('hotel') || lowerMessage.includes('accommodation') || lowerMessage.includes('stay')) {
      const city = lowerMessage.match(/in (\w+)/i)?.[1]
      
      if (city) {
        return `Great choice! ${city} has amazing hotels. What's your budget per night, and what amenities are important to you? (pool, gym, spa, etc.)`
      }
      
      return `I can help you find the perfect hotel! Which city are you planning to visit? I have access to 180,000+ hotels worldwide with instant confirmation.`
    }
    
    // Budget-related queries
    if (lowerMessage.includes('cheap') || lowerMessage.includes('budget') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return `I understand budget is important! I can find you the best deals by:\n\n• Comparing prices across multiple providers\n• Suggesting alternative travel dates\n• Finding package deals (flight + hotel)\n• Alerting you to price drops\n\nWhat's your approximate budget for this trip?`
    }
    
    // Destination recommendations
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('where should')) {
      return `I'd love to recommend some destinations! To give you the best suggestions, tell me:\n\n• What type of experience are you looking for? (beach, city, adventure, culture)\n• What's your budget range?\n• When are you planning to travel?\n• How long is your trip?`
    }
    
    // Visa requirements
    if (lowerMessage.includes('visa') || lowerMessage.includes('document') || lowerMessage.includes('requirement')) {
      return `Visa requirements depend on your nationality and destination. I can help you:\n\n• Check visa requirements for your destination\n• Apply for e-visas online\n• Get travel insurance\n• Prepare required documents\n\nWhich country are you planning to visit?`
    }
    
    // Package deals
    if (lowerMessage.includes('package') || lowerMessage.includes('bundle') || lowerMessage.includes('deal')) {
      return `Package deals can save you up to 40%! I can create custom packages including:\n\n✈️ Flights\n🏨 Hotels\n🚗 Car rentals\n🎯 Tours & activities\n\nWould you like me to search for package deals? Just tell me your destination and dates!`
    }
    
    // Default response
    return `I understand you're looking for travel assistance. I can help you with:\n\n✈️ Flight bookings (400+ airlines)\n🏨 Hotel reservations (180,000+ properties)\n🎯 Tours & activities (40,000+ experiences)\n🚗 Car rentals\n🛂 Visa applications\n📦 Custom packages\n\nWhat would you like to book or know more about?`
  }

  async function handleSend() {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Extract preferences from message
    await extractPreferences(input)

    // Generate AI response
    setTimeout(async () => {
      const response = await generateAIResponse(input)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        suggestions: getSuggestions(response)
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  async function extractPreferences(message: string) {
    // Extract budget
    const budgetMatch = message.match(/\$(\d+)/)
    if (budgetMatch) {
      setPreferences(prev => ({ ...prev, budget: parseInt(budgetMatch[1]) }))
    }

    // Extract destination
    const destMatch = message.match(/to (\w+)/i)
    if (destMatch) {
      setPreferences(prev => ({ ...prev, destination: destMatch[1] }))
    }

    // Extract number of travelers
    const travelersMatch = message.match(/(\d+)\s*(travelers?|people|passengers|adults|children)/i)
    if (travelersMatch) {
      setPreferences(prev => ({ ...prev, travelers: parseInt(travelersMatch[1]) }))
    }
  }

  function getSuggestions(response: string): string[] {
    if (response.includes('flight')) {
      return ['Search flights', 'Set price alert', 'View deals']
    }
    if (response.includes('hotel')) {
      return ['Browse hotels', 'Filter by price', 'Show map view']
    }
    if (response.includes('package')) {
      return ['Create package', 'Compare prices', 'Customize trip']
    }
    return ['Tell me more', 'Search now', 'Ask something else']
  }

  async function handleSuggestionClick(suggestion: string) {
    setInput(suggestion)
    // Auto-send after short delay
    setTimeout(() => {
      handleSend()
    }, 300)
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-900 text-white rotate-90' 
            : 'bg-gradient-to-br from-sky-500 to-teal-500 text-white hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Bot className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-96 h-[600px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Vera - AI Assistant</h3>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online • Powered by AI
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={message.role === 'user' ? 'bg-sky-100' : 'bg-teal-100'}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[75%] ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-sky-500 text-white rounded-tr-sm'
                        : 'bg-white text-gray-900 shadow-sm rounded-tl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.role === 'assistant' && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1 bg-sky-100 text-sky-700 text-xs rounded-full hover:bg-sky-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-teal-100">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about travel..."
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon" className="bg-sky-500 hover:bg-sky-600">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              AI-powered travel assistant • Responses may vary
            </p>
          </div>
        </Card>
      )}
    </>
  )
}

// Export as component for easy integration
export default AITravelAssistant
