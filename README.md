# Gemini AI Content Generator 🚀

A RESTful API that uses **Google Gemini AI** to generate creative content for blogs, social media, emails, and more. Users can select content types and tones, manage prompts, and securely store their data.

## 🌟 Key Features

- AI-powered content generation with selectable type and tone
- Prompt history for easy reuse
- User authentication & authorization
- Profile management and password reset
- API rate limiting and input sanitization

## 🛠️ Tech Stack

- **Backend:** `Node.js`, `Express.js`
- **Database:** `MongoDB Atlas`, `Mongoose`
- **AI Model:** `Google Gemini AI` (`@google/generative-ai`)
- **Authentication & Security:** `JWT`, `bcrypt`, `cors`, `helmet`, `express-rate-limit`, `express-mongo-sanitize`, `hpp`, `cookie-parser`
- **Environment Management:** `dotenv`

## 📦 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- MongoDB Atlas account
- Google Cloud project with Gemini AI enabled

### Installation

```bash
git clone https://github.com/AnassEDDIG/ai-content-assistant
cd ai-content-assistant
npm install
```

Create a .env file with:

```
PORT=3000
DB_URI=<MongoDB Atlas URI>
DB_PASSWORD=<MongoDB Password>
JWT_SECRET=<JWT Secret>
JWT_EXPIRES_IN=<JWT Expiration>
GEMINI_API_KEY=<Google Gemini AI API Key>
```

Seed the database (optional):

```bash
node utils/seedToneAndType.mjs --seed
```

Start the server:

```bash
npm run dev
```

Access the API at http://localhost:3000.

## 📂 Project Structure

```
├── config/ # DB connection
├── controllers/ # Route logic
├── models/ # Mongoose models
├── routes/ # Express routes
├── utils/ # Error handling, helpers
├── app.mjs # Express setup
├── server.mjs # Server entry
└── package.json
```

## 🤝 Contributing

1. Fork the repo
2. Create a branch for your feature/bug
3. Commit changes with descriptive messages
4. Push and submit a pull request

## 👤 Author

**Anass Eddig** – [GitHub](https://github.com/AnassEDDIG)  
**Email**: [eddiganass8@gmail.com](mailto:eddiganass8@gmail.com)
