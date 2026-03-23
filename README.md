# 🌌 NextFlow
![Banner Image Placeholder - e.g. A gorgeous screenshot of your node editor]
**NextFlow** is an advanced, visually stunning node-based AI workflow editor. Meticulously designed with a premium dark-mode, glassmorphic aesthetic inspired by state-of-the-art platforms like Krea.ai, NextFlow empowers users to build powerful, multi-modal AI pipelines—seamlessly connecting text generation, computer vision, and media processing within a limitless canvas.
## ✨ Features
- **🎨 Premium Visual Node Editor**: Experience a pixel-perfect, highly responsive infinite canvas powered by React Flow. Featuring custom-designed nodes with smooth micro-animations, glowing connections, and glassmorphic UI elements.
- **🤖 Cutting-Edge AI Models**: Native integration with Google's latest Generative AI models, including the lightning-fast **Gemini 3.0 Flash** and the highly capable **Gemini 3.1 Pro**.
- **🧩 Diverse Node Library**:
  - **LLM Node**: Advanced prompting and execution.
  - **Media Processing Nodes**: Upload Images/Videos, Crop Images, Extract Frames (Powered by Transloadit).
  - **I/O Nodes**: Dynamic Text inputs and rich markdown outputs.
- **🛡️ Rock-Solid Authentication**: Secure, beautifully styled user flows via Clerk, perfectly matching the application's premium aesthetic.
- **⚡ Background Execution**: Complex workflow runs are offloaded to robust background jobs using Trigger.dev to ensure a stutter-free frontend experience.
- **📚 Workflow History**: A clean, sliding history panel to track previous node executions, payloads, and results in real time.
## 🛠️ Tech Stack
NextFlow leverages the latest and most powerful tools in the modern React ecosystem:
- **Framework:** Next.js 16 (App Router) + React 19
- **Visual Canvas:** React Flow
- **Styling & Animations:** Tailwind CSS v4, Framer Motion, Radix UI primitives
- **Database & ORM:** PostgreSQL + Prisma ORM
- **Authentication:** Clerk
- **AI Integration:** Google Generative AI SDK (`@google/generative-ai`)
- **Media Processing:** Transloadit & Fluent-FFmpeg
- **State Management:** Zustand (with Zundo for Undo/Redo states)
- **Background Jobs:** Trigger.dev v4
## 🚀 Getting Started
### Prerequisites
Make sure you have Node.js and npm (or pnpm/yarn) installed. You will also need active API keys for:
- Clerk (Authentication)
- Google AI (Gemini API)
- Transloadit (Media Processing)
- Trigger.dev (Background Jobs)
- A PostgreSQL database connection string (e.g., Supabase or Neon)
### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/animesh-94/Nextflow-.git
Install dependencies:

bash
npm install
Environment Setup: Create a .env file in the root directory and add your secret keys. (Refer to .env.example if available):

env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
DATABASE_URL=your_postgres_url
GEMINI_API_KEY=your_gemini_key
TRANSLOADIT_AUTH_KEY=your_transloadit_key
TRANSLOADIT_SECRET_KEY=your_transloadit_secret
Initialize Database: Deploy the database schema using Prisma:

bash
npx prisma generate
npx prisma db push
Start the Development Server:

bash
npm run dev
Your application will be live at http://localhost:3000.

🛣️ Roadmap
 Add more specialized AI interaction nodes (Image Generation, Audio processing).
 Implement collaborative multiplayer workflow editing.
 Export workflows as JSON templates for community sharing.
 Implement custom variable binding across disconnected nodes.
🤝 Contributing
Contributions are always welcome! Feel free to open an issue or submit a Pull Request if you'd like to help improve NextFlow.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
