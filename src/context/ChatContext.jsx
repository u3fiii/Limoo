import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { cannedSellerReplies, initialThreads } from '../data/chats'
import { getProductById } from '../data/products'

const ChatContext = createContext(null)

function uid(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function pickReply() {
  return cannedSellerReplies[Math.floor(Math.random() * cannedSellerReplies.length)]
}

export function ChatProvider({ children }) {
  const [threads, setThreads] = useState(initialThreads)

  const getThreadBySeller = useCallback(
    (sellerId) => threads.find((t) => t.sellerId === sellerId),
    [threads],
  )

  const getThreadById = useCallback(
    (threadId) => threads.find((t) => t.id === threadId),
    [threads],
  )

  const ensureThread = useCallback((sellerId) => {
    let created = null
    setThreads((prev) => {
      const existing = prev.find((t) => t.sellerId === sellerId)
      if (existing) return prev
      created = {
        id: uid('t'),
        sellerId,
        lastPreview: '',
        unread: 0,
        basket: [],
        messages: [],
      }
      return [created, ...prev]
    })
    return created
  }, [])

  const [pendingStage, setPendingStage] = useState(null)

  const openThreadForSeller = useCallback(
    (sellerId, stagedProductId = null) => {
      const existing = threads.find((t) => t.sellerId === sellerId)
      const threadId = existing?.id ?? uid('t')
      if (!existing) {
        setThreads((prev) => [
          {
            id: threadId,
            sellerId,
            lastPreview: '',
            unread: 0,
            basket: [],
            messages: [],
          },
          ...prev,
        ])
      }
      if (stagedProductId) {
        setPendingStage({ threadId, productId: stagedProductId })
      }
      return threadId
    },
    [threads],
  )

  const consumePendingStage = useCallback((threadId) => {
    let productId = null
    setPendingStage((prev) => {
      if (prev?.threadId === threadId) {
        productId = prev.productId
        return null
      }
      return prev
    })
    return productId
  }, [])

  const peekPendingStage = useCallback(
    (threadId) => (pendingStage?.threadId === threadId ? pendingStage.productId : null),
    [pendingStage],
  )

  const clearPendingStage = useCallback((threadId) => {
    setPendingStage((prev) => (prev?.threadId === threadId ? null : prev))
  }, [])

  const appendMessages = useCallback((threadId, newMessages, extras = {}) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t
        const messages = [...t.messages, ...newMessages]
        const last = messages[messages.length - 1]
        return {
          ...t,
          ...extras,
          messages,
          lastPreview:
            last?.type === 'text'
              ? last.content
              : last?.type === 'product'
                ? 'کارت کالا ارسال شد'
                : last?.type === 'system'
                  ? last.content
                  : t.lastPreview,
        }
      }),
    )
  }, [])

  const sendText = useCallback(
    (threadId, content) => {
      const msg = {
        id: uid('m'),
        type: 'text',
        sender: 'buyer',
        content,
        timestamp: Date.now(),
      }
      appendMessages(threadId, [msg])

      // Simulated seller reply
      window.setTimeout(() => {
        appendMessages(threadId, [
          {
            id: uid('m'),
            type: 'text',
            sender: 'seller',
            content: pickReply(),
            timestamp: Date.now(),
          },
        ])
      }, 1000 + Math.random() * 1000)
    },
    [appendMessages],
  )

  const sendProduct = useCallback(
    (threadId, productId, note) => {
      const productMsgId = uid('m')
      const productMsg = {
        id: productMsgId,
        type: 'product',
        sender: 'buyer',
        productId,
        productState: 'staged',
        note: note?.trim() || undefined,
        timestamp: Date.now(),
      }
      appendMessages(threadId, [productMsg])

      // Seller acknowledges, adds to basket, confirms card
      window.setTimeout(() => {
        const product = getProductById(productId)
        setThreads((prev) =>
          prev.map((t) => {
            if (t.id !== threadId) return t
            const alreadyInBasket = t.basket.some((b) => b.productId === productId)
            const basket = alreadyInBasket
              ? t.basket
              : [...t.basket, { productId, price: product.price, qty: 1 }]

            const messages = [
              ...t.messages.map((m) =>
                m.id === productMsgId ? { ...m, productState: 'confirmed' } : m,
              ),
              {
                id: uid('m'),
                type: 'text',
                sender: 'seller',
                content: 'اوکیه، الان برات تو سبد می‌ذارم.',
                timestamp: Date.now(),
              },
              {
                id: uid('m'),
                type: 'system',
                sender: 'system',
                content: 'کالا به سبد اضافه شد',
                timestamp: Date.now() + 1,
              },
            ]

            return {
              ...t,
              basket,
              messages,
              lastPreview: 'کالا به سبد اضافه شد',
            }
          }),
        )
      }, 1200 + Math.random() * 600)
    },
    [appendMessages],
  )

  const markThreadRead = useCallback((threadId) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unread: 0 } : t)),
    )
  }, [])

  const value = useMemo(
    () => ({
      threads,
      getThreadById,
      getThreadBySeller,
      ensureThread,
      openThreadForSeller,
      peekPendingStage,
      clearPendingStage,
      sendText,
      sendProduct,
      markThreadRead,
    }),
    [
      threads,
      getThreadById,
      getThreadBySeller,
      ensureThread,
      openThreadForSeller,
      peekPendingStage,
      clearPendingStage,
      sendText,
      sendProduct,
      markThreadRead,
    ],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}
