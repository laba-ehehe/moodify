# 🎵 moodify - music That Matches Your Mood

<p align="center">
  <img src="frontend/public/logo.svg" alt="Moodify Logo" width="200"/>
</p>

<p align="center">
  <a href="https://moodify-orpin.vercel.app/">Live Demo</a> •
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#tech-stack">Tech Stack</a>
</p>

## 🌟 Overview

Moodify is a web application that generates personalized Spotify playlists based on your current mood. Simply express how you're feeling through emojis or text, and Moodify will create the perfect soundtrack for your emotional state.

**Live Application:** [https://moodify-orpin.vercel.app/](https://moodify-orpin.vercel.app/)

## ✨ Features

- 🎭 **Mood Input Options**: Express your mood through emojis or descriptive text
- 🎵 **Smart Playlist Generation**: Leverages Spotify's audio features (valence, energy, danceability) to match your mood
- 👀 **Track Preview**: Listen to 30-second previews before saving
- 💾 **One-Click Save**: Save generated playlists directly to your Spotify library
- 📊 **Mood Visualization**: See how your mood translates to audio features
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔒 **Secure Authentication**: OAuth 2.0 PKCE flow for safe Spotify integration

## 🚀 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Spotify Developer Account ([create one here](https://developer.spotify.com/))

### Setup

1. **Clone the repository**
```bash
   git clone https://github.com/laba-ehehe/moodify.git
   cd moodify
```

2. **Set up Spotify App**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Add redirect URIs:
     - `http://localhost:3000/callback` (development)
     - `https://your-domain.com/callback` (production)
   - Copy your Client ID and Client Secret

3. **Backend Setup**
```bash
   cd backend
   npm install
   
   # Create .env file
   echo "CLIENT_ID=your_spotify_client_id
   CLIENT_SECRET=your_spotify_client_secret
   REDIRECT_URI=http://localhost:3000/callback
   FRONTEND_URL=http://localhost:3001
   PORT=3000" > .env
```

4. **Frontend Setup**
```bash
   cd ../frontend
   npm install
   
   # Create .env file
   echo "REACT_APP_BACKEND_URL=http://localhost:3000" > .env
```

5. **Run the Application**
   
   In separate terminals:
```bash
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
```

   Visit `http://localhost:3001` to use the application!

## 💻 Usage

1. **Login**: Click "Login with Spotify" to authenticate
2. **Express Your Mood**: 
   - Choose from emoji options (😊 🔥 😴 😔 💪)
   - Or type a description like "calm but motivated"
3. **Generate Playlist**: Click "Generate Playlist" to create your mood-matched tracks
4. **Preview & Save**: Listen to previews and save the playlist to your Spotify library

## 🛠️ Tech Stack

### Frontend
- **React** (v18.2.0) - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Styling with animations and gradients
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Spotify Web API** - Music data and playback
- **OAuth 2.0 PKCE** - Secure authentication

### Deployment
- **Frontend**: Vercel
- **Backend**: Render

## 📊 Mood Mapping Logic

Moodify translates emotions into Spotify's audio features:

| Mood | Valence | Energy | Danceability | Acousticness |
|------|---------|--------|--------------|--------------|
| 😊 Happy | High | High | High | Low |
| 🔥 Energetic | Medium | Very High | High | Low |
| 😴 Calm | Medium | Low | Low | High |
| 😔 Sad | Low | Low | Low | Medium |
| 💪 Focused | Medium | Medium | Medium | Low |

## 🧪 Testing
```bash
# Frontend tests
cd frontend
npm test

# Backend tests (if implemented)
cd backend
npm test
```

## 📁 Project Structure
```
moodify/
├── backend/
│   ├── routes/          # API endpoints
│   ├── utils/           # Helper functions
│   └── server.js        # Express server
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # React components
│   │   └── services/    # API services
│   └── package.json
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔮 Future Enhancements

- [ ] Machine learning for improved mood classification
- [ ] Blend multiple moods for complex emotional states
- [ ] Integration with user's listening history
- [ ] Shareable playlist links
- [ ] Social features for collaborative mood playlists
- [ ] Support for Apple Music and YouTube Music

## 🙏 Acknowledgments

- **WiCSE x AmEx Shadowing Program** for the opportunity
- **UmaMaheswari Balu Gnanamoorthy** (Mentor) for guidance and support
- **Spotify Web API** for the amazing music data

## 📧 Contact

Lan Anh Do - [lananhdo2905@gmail.com](mailto:lananhdo2905@gmail.com)

Project Link: [https://github.com/laba-ehehe/moodify](https://github.com/laba-ehehe/moodify)

---

<p align="center">Made with 💜 and 🎵 by Lan Anh Do</p>
