# 🌌 NextFlow

![NextFlow Banner](./assets/banner.png)

**NextFlow** is an advanced, visually stunning **node-based AI workflow editor**.  
Designed with a premium **dark-mode, glassmorphic aesthetic**, inspired by platforms like Krea.ai, NextFlow empowers users to build powerful **multi-modal AI pipelines**—seamlessly connecting text generation, computer vision, and media processing within a limitless canvas.

---

## ✨ Features

- **🎨 Premium Visual Node Editor**  
  Pixel-perfect, highly responsive infinite canvas powered by **React Flow**, featuring:
  - Custom-designed nodes
  - Smooth micro-animations
  - Glowing connections
  - Glassmorphic UI elements

- **🤖 Cutting-Edge AI Models**  
  Native integration with Google's Generative AI models:
  - **Gemini 3.0 Flash** – Lightning-fast text generation
  - **Gemini 3.1 Pro** – Highly capable multi-modal AI

- **🧩 Diverse Node Library**
  - **LLM Node:** Advanced prompting & execution
  - **Media Processing Nodes:** Upload Images/Videos, Crop Images, Extract Frames (Powered by Transloadit)
  - **I/O Nodes:** Dynamic text inputs and rich markdown outputs

- **🛡️ Rock-Solid Authentication**  
  Secure and beautifully styled flows via **Clerk**, perfectly matching the premium UI

- **⚡ Background Execution**  
  Offload complex workflow runs to robust background jobs using **Trigger.dev**, ensuring a stutter-free frontend experience

- **📚 Workflow History**  
  Track previous node executions, payloads, and results in real-time with a clean sliding history panel

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19  
- **Visual Canvas:** React Flow  
- **Styling & Animations:** Tailwind CSS v4, Framer Motion, Radix UI  
- **Database & ORM:** PostgreSQL + Prisma ORM  
- **Authentication:** Clerk  
- **AI Integration:** Google Generative AI SDK (`@google/generative-ai`)  
- **Media Processing:** Transloadit & Fluent-FFmpeg  
- **State Management:** Zustand (with Zundo for Undo/Redo)  
- **Background Jobs:** Trigger.dev v4  

---

## 🚀 Getting Started

### Prerequisites
- Node.js and npm (or pnpm/yarn)
- API keys for:
  - **Clerk** (Authentication)
  - **Google AI** (Gemini API)
  - **Transloadit** (Media Processing)
  - **Trigger.dev** (Background Jobs)
- A PostgreSQL database connection string (e.g., Supabase or Neon)

### Installation

1. **Clone the repository:**
bash
git clone https://github.com/animesh-94/Nextflow-.git
cd Nextflow-

2. Install dependencies:
npm install

3. Environment Setup:
Create a .env file in the root directory and add your secret keys (refer to .env.example):
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
DATABASE_URL=your_postgres_url
GEMINI_API_KEY=your_gemini_key
TRANSLOADIT_AUTH_KEY=your_transloadit_key
TRANSLOADIT_SECRET_KEY=your_transloadit_secret

4. Initialize Database:
Deploy the schema using Prisma:
npx prisma generate
npx prisma db push

5. Start the Development Server:
npm run dev

🛣️ Roadmap
Add specialized AI interaction nodes (Image Generation, Audio Processing)
Implement collaborative multiplayer workflow editing
Export workflows as JSON templates for community sharing
Implement custom variable binding across disconnected nodes
🤝 Contributing

Contributions are welcome!
Feel free to open an issue or submit a Pull Request to help improve NextFlow.

📄 License

This project is licensed under the MIT License – see the LICENSE file for details.
