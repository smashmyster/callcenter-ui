export interface Conversation {
    id: string
    userId: string
    summary: string 
    createdAt: Date
    messages?: Message[]
    sources?: InfoSource[]
    title:string
}

export interface Message {
    id: string
    conversationId: string
    content: string
    role: string
    createdAt: Date
    source?: InfoSource[]
    answer?: string
}

export interface InfoSource {
    id: string
    messageId: string
    type: string
    title: string
    snippet: string
    score: number
    confidence: number
}

expo