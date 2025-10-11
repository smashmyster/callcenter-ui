import { Mic, Sparkles, ShieldCheck, Ticket, BookOpen } from "lucide-react"

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
    key: string
}

export enum ETools{
    TRANSCRIBE,
    POLICYCHECK,
    SUMMARIZE_CHAT,
    JIRA_TICKETS,
    SOCIAL_POSTING

}

export interface ITool{
    id:string,
    label:string,
    icon:any,
    desc:string,
    type:ETools
}

export const tools = [
    { id: "stt", label: "Transcribe Audio", icon: Mic, desc: "Upload and transcribe a call",type:ETools.TRANSCRIBE },
    { id: "summarize", label: "Summarize", icon: Sparkles, desc: "Summarize text for analytics",type:ETools.SUMMARIZE_CHAT },
    { id: "audit", label: "Policy Audit", icon: ShieldCheck, desc: "Check against policies",type:ETools.SOCIAL_POSTING },
    { id: "jira", label: "Create Jira", icon: Ticket, desc: "Open a ticket for follow-up",type:ETools.JIRA_TICKETS },
    { id: "policies", label: "Browse Policies", icon: BookOpen, desc: "Search policy sections",type:ETools.POLICYCHECK },
  ];
