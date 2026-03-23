# 🌌 NextFlow

**NextFlow** is a high-performance, visually stunning node-based AI workflow orchestrator. 

Designed with a premium dark-mode, glassmorphic aesthetic inspired by elite creative platforms, NextFlow empowers users to architect sophisticated **multi-modal AI pipelines**. Seamlessly bridge text generation, computer vision, and complex media processing within a limitless, fluid canvas.

---

## ✨ Features

### 🎨 Elite Visual Orchestration
Experience a pixel-perfect, highly responsive infinite canvas powered by **React Flow**, featuring:
* **Custom-Architected Nodes:** Purpose-built for AI logic and media handling.
* **Fluid Micro-animations:** Interactive elements that breathe life into your workflow.
* **Luminous Connectivity:** Glowing edge connections and glassmorphic UI components.

### 🤖 Next-Gen Model Integration
Native, first-class support for Google’s most advanced Generative AI models:
* **Gemini 3.0 Flash:** Ultra-low latency text generation for rapid-fire execution.
* **Gemini 3.1 Pro:** State-of-the-art multi-modal reasoning for complex logic.

### 🧩 Specialized Node Ecosystem
* **LLM Intelligence:** Advanced prompt engineering and execution controls.
* **Media Processing:** Integrated image/video uploads, intelligent cropping, and frame extraction (Powered by **Transloadit**).
* **Dynamic I/O:** Flexible text inputs and rich Markdown output rendering.

### ⚡ Infrastructure & Performance
* **Atomic State Management:** Powered by **Zustand** with **Zundo** for robust Undo/Redo capabilities.
* **Asynchronous Execution:** Complex pipelines are offloaded to **Trigger.dev**, ensuring a stutter-free, non-blocking frontend experience.
* **Persistent History:** Real-time tracking of node executions, payloads, and results via a sleek sliding panel.
* **Secure Auth:** Beautifully styled, secure authentication via **Clerk**, integrated seamlessly with the dark-mode UI.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) + React 19 |
| **Visual Engine** | React Flow |
| **Styling** | Tailwind CSS v4, Framer Motion, Radix UI |
| **Database** | PostgreSQL + Prisma ORM |
| **Authentication** | Clerk |
| **AI Intelligence** | Google Generative AI SDK (`@google/generative-ai`) |
| **Media Logic** | Transloadit & Fluent-FFmpeg |
| **Background Jobs** | Trigger.dev v4 |

---

## 🚀 Getting Started

### Prerequisites
Ensure you have Node.js (v18+) and active API keys for the following:
* **Clerk** (Auth)
* **Google AI Studio** (Gemini API)
* **Transloadit** (Media Processing)
* **Trigger.dev** (Background Jobs)
* **PostgreSQL** (e.g., Supabase, Neon, or Local)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/animesh-94/Nextflow-.git](https://github.com/animesh-94/Nextflow-.git)
    cd Nextflow-
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
    CLERK_SECRET_KEY=your_secret
    DATABASE_URL=your_postgres_url
    GEMINI_API_KEY=your_gemini_key
    TRANSLOADIT_AUTH_KEY=your_transloadit_key
    TRANSLOADIT_SECRET_KEY=your_transloadit_secret
    ```

4.  **Database Synchronization**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Launch Development Server**
    ```bash
    npm run dev
    ```

---

## 🛣️ Roadmap
- [ ] **Expanded Modalities:** Dedicated nodes for Image Generation and Audio Synthesis.
- [ ] **Multiplayer Collaboration:** Real-time, multi-user workflow editing.
- [ ] **Template Marketplace:** Export and share workflow JSONs with the community.
- [ ] **Global Variables:** Custom variable binding across disconnected node clusters.

## 🤝 Contributing
NextFlow thrives on community innovation. If you have ideas for new nodes or UI improvements, feel free to open an issue or submit a Pull Request.

## 📄 License
This project is licensed under the **MIT License**.
