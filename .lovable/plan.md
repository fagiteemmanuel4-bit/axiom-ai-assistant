

# Axiom AI Chat Interface — by Tyora

## Overview
A sleek, dark-themed AI chatbot web app called **Axiom**, built by **Tyora**. It features a conversational AI interface with code canvas support, web browsing capabilities, and a polished minimal design matching the provided screenshots.

---

## Page 1: Main Chat Interface (Home)

### Header
- **Top-left**: Axiom logo (sound wave icon from uploaded assets) + "Axiom" text in white
- **Top-right**: "Login" button (outlined, white) — clicking shows a toast notification: *"Axiom authentication coming soon!"*

### Empty State (No Messages)
- Centered heading: **"What's on your mind today?"**
- Input bar at bottom with placeholder "Ask Axiom" and a send button

### Chat View (With Messages)
- **User messages**: Right-aligned, dark grey bubble with slight rounded corners, edit icon
- **AI messages**: Left-aligned, plain text (no bubble), with markdown rendering
- **Code blocks**: Rendered in a **canvas-style panel** with:
  - Language label header (e.g., "Python")
  - Copy button in top-right corner
  - Syntax-highlighted code with line numbers
  - Dark background, bordered container
- Streaming responses — text appears token by token with a "writing codes..." indicator when generating code

### Footer
- **Bottom-left**: Home icon (resets to empty state)
- **Bottom-center**: Disclaimer text: *"Axiom can make mistakes please review its responses"*
- **Bottom-right**: Trash/bin icon — clicking shows a **confirmation dialog**: *"Are you sure you want to clear all chat history?"* with Confirm/Cancel buttons

---

## AI Integration

- Uses **OpenRouter API** (DeepSeek R1 model) via edge function for AI responses
- System prompt configures Axiom to:
  - Know it's **Axiom**, made by **Tyora**
  - Know its upcoming model: **Axiom net24.6**
  - Describe current capabilities: conversation, web browsing, code generation
  - Describe future capabilities: workspace integration, smart home control, full app building, image/video generation, editing, email management, multitasking as a virtual AI worker for startups, social media management
- Chat history persisted in **localStorage**
- Markdown rendering for AI responses with proper code block formatting

---

## Design System
- **Background**: Pure dark/black (#0a0a0a / near-black)
- **Text**: White primary, muted grey secondary
- **Input bar**: Dark grey rounded pill shape
- **User bubbles**: Slightly lighter dark grey
- **Code canvas**: Dark with subtle border, slightly different background
- **Icons**: Bootstrap Icons throughout
- **Typography**: Clean sans-serif, minimal spacing
- **Fully responsive**: Works on mobile, tablet, and desktop

---

## Key Interactions
1. Type message → AI streams response with markdown + code canvas support
2. Click Login → Toast notification "Axiom coming soon"
3. Click trash icon → Confirmation dialog → Clears all chat from localStorage
4. Click home icon → Returns to empty "What's on your mind today?" state
5. Code blocks show with language labels, line numbers, and copy functionality

