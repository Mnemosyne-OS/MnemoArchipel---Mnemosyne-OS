# 🌱 The Archipel — Sovereign Personal CRM

[![Mnemosyne OS Cartridge](https://img.shields.io/badge/Mnemosyne%20OS-Cartridge-0ea5e9?style=for-the-badge)](https://github.com/yaka0007/Mnemosyne-Neural-OS)
[![License: EULA](https://img.shields.io/badge/License-Mnemosyne%20OS%20Cartridge%20EULA-10b981?style=for-the-badge)](./LICENSE.md)

Welcome to **The Archipel**, the default Sovereign Personal CRM cartridge for **Mnemosyne OS**. Designed with an offline-first, local-first philosophy, it helps you map, nurture, and explore your social networks without third-party servers.

> [!IMPORTANT]
> **The Archipel is a cartridge — it runs inside Mnemosyne OS.** Install the host app first, then load this cartridge from MnemoHub (or link it in dev mode).
>
> [![Download latest release](https://img.shields.io/badge/⬇%20Download-Mnemosyne%20OS%20latest-0ea5e9?style=for-the-badge)](https://github.com/yaka0007/Mnemosyne-Neural-OS/releases/latest) &nbsp; [![Mnemosyne OS repository](https://img.shields.io/badge/GitHub-Mnemosyne%20OS-181717?style=for-the-badge&logo=github)](https://github.com/yaka0007/Mnemosyne-Neural-OS)

![The Archipel Dashboard](./docs/images/dashboard.png)

---

## ✨ Key Capabilities

### 🏝️ 1. Topological 2D & 3D Visualizer
- **Warmth Physics Engine**: Your social network is modeled as a floating archipelago of nodes. Contacts are connected via spring forces.
- **Visual Warmth**: Inactive nodes cool down over time (turning gray/dormant), while active nodes glow in vibrant colors.
- **Dynamic 3D Navigation**: Fully interactive WebGL/Three.js-style 3D physics rendering to rotate and navigate your social islands.

![Topological 2D View](./docs/images/network_2d.png)

### 🎭 2. Avatar Studio
- **SVG Generation**: Fully parameterized vector customizer supporting custom RGB skin tones, hairstyles, head shapes, and emotional expressions.
- **Orbiting Accessories**: Equip up to 5 animated accessories (baguette 🥖, color palette 🎨, cool glasses 🕶️, sword ⚔️, guitar 🎸) orbiting in 3D paths around the avatar.

![Avatar Studio](./docs/images/avatar_studio.png)

### 🧠 3. Cognitive Memory Trainer
- **Quiz Mini-game**: An active-recall memory training card. It randomly selects contacts and grills you on their categories, current moods, or notable facts to maintain fresh cognitive connection logs.

### ✍️ 4. Semantic Brain Dump & RAG
- **Offline LLM Integration**: Free-text brain dump gets distilled locally. Mnemosyne's local model API extracts key facts and updates the database.
- **Semantic Querying**: Search your social memory using natural language (e.g. *"Who loves modular synths?"*) through the SDK RAG router.

### 📞 5. Reusable Social & Contact Manager
- **Dynamic Social Inputs**: Easily add or remove contact cards (Phone, Email, Instagram, Snapchat, LinkedIn, Address, Telegram, GitHub, Website) inside the modal and profile sidebar.

![New Link Modal](./docs/images/add_contact_modal.png)

---

## 🚀 Installation & Running

To run the cartridge in sandbox/development mode:

```bash
# Install dependencies
npm install

# Start the local Dev Server
npm run dev
```

The app will start at `http://localhost:5204/`. You can run it standalone or load it as an iframe cartridge inside a **Mnemosyne OS Host** instance.

---

## 🧪 Testing

The mathematical models (physics equations, RGB color blending, vector parts rendering) are validated via unit tests:

```bash
npm run test
```

---

## ⚖️ License

Distributed under the **Mnemosyne OS Cartridge License**. You are free to inspect, modify, and customize the code as long as it executes and distributes within the **Mnemosyne OS** ecosystem. 

For commercial use, redistribution outside the platform, or standalone hosting, please see the [LICENSE.md](./LICENSE.md) file.
