# VibeFlow: Your go-to companion for breathing exercises, meditation, and AI-powered support for stress relief, mindfulness, and mental well-being.

## Description

VibeFlow is a comprehensive well-being assistant designed to help users manage stress, reduce anxiety, and foster positive mental health. It features a range of tools including breathing exercises, meditation videos, and an AI-powered assistant. The AI provides compassionate, evidence-based advice to guide users through their emotions and challenges, offering tailored mindfulness exercises, breathing techniques, and personalized recommendations based on their input.

The application leverages the Llama 3 model through Ollama for advanced natural language processing and generation, delivering a responsive and intelligent conversational experience.

## Technologies Used

- **Next.js 14** (React framework)
- **TypeScript**
- **Tailwind CSS**
- **Ollama** (for local deployment of the Llama 3 model)

## Prerequisites

- Node.js (version 18 or later)
- Ollama installed and operational on your local machine

## Setup and Running the Project

1. Clone the repository:
   ```
   git clone https://github.com/cse-amarjeet/VibeFlow.git
   cd VibeFlow
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Ensure Ollama is running locally with the Llama 3 model loaded. If Ollama is not installed, download it from [this link](https://ollama.com/download).
   ```
   ollama run llama3
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000` to access the application.

## Features

- Customized breathing exercises with sound
- Meditation videos with high-quality sound
- Real-time chat interface
- AI-powered responses using the Llama 3 model
- Mindfulness exercises and breathing techniques
- Personalized mental health advice
