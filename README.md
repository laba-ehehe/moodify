# 🎵 Moodify

Generate Spotify playlists that perfectly match your mood using AI-powered sentiment analysis.

![Moodify Screenshot](screenshot.png)

## ✨ Features

- **Mood Analysis**: Analyze your mood through text descriptions or emoji selection
- **Smart Recommendations**: Get personalized Spotify track recommendations based on your emotional state
- **Spotify Integration**: Save generated playlists directly to your Spotify account
- **Audio Previews**: Listen to 30-second previews of recommended tracks
- **Beautiful UI**: Modern, Spotify-inspired dark theme with smooth animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Live Demo

Visit [Moodify](https://moodify-orpin.vercel.app) to try it out!

## 🎯 How It Works

1. **Express Your Mood**: Choose between text input or emoji selection to describe how you're feeling
2. **AI Analysis**: Our mood analyzer processes your input and maps it to audio features
3. **Smart Matching**: The app searches Spotify for tracks that match your emotional state
4. **Personalized Playlist**: Get a curated playlist with 20 tracks that fit your vibe
5. **Save & Enjoy**: Save the playlist to your Spotify account and start listening

## 🛠️ Tech Stack

### Frontend
- **React**: Modern UI framework
- **Bootstrap**: Responsive design system
- **CSS3**: Custom animations and Spotify-inspired styling
- **Axios**: HTTP client for API requests

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web application framework
- **Spotify Web API**: Music data and playlist creation
- **PKCE Authentication**: Secure OAuth 2.0 flow

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Spotify Developer Account

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/moodify.git
cd moodify/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
PORT=5000
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_REDIRECT_URI=http://localhost:3000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## 🎨 Mood Categories

Moodify supports 25+ different mood categories including:

- **Happy**: Upbeat, cheerful, joyful tracks
- **Sad**: Melancholic, emotional, reflective music
- **Energetic**: High-energy workout and pump-up songs
- **Calm**: Peaceful, relaxing, meditative tracks
- **Romantic**: Love songs and intimate ballads
- **Party**: Dance hits and celebration anthems
- **Focused**: Concentration music for work/study
- **Nostalgic**: Classic hits and throwback tracks
- **And many more!**

## 🔧 Configuration

### Spotify API Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add redirect URI: `http://localhost:5000/auth/callback` (development)
4. Copy your Client ID to the `.env` file

### Audio Features Mapping

The mood analyzer converts emotions into Spotify's audio features:

- **Energy**: How intense and powerful the track feels (0.0 - 1.0)
- **Valence**: How positive/happy the track sounds (0.0 - 1.0)  
- **Danceability**: How suitable the track is for dancing (0.0 - 1.0)
- **Acousticness**: Amount of acoustic vs electronic elements
- **Tempo**: Speed of the track in BPM

## 📱 API Endpoints

### Authentication
- `GET /auth/login` - Initiate Spotify OAuth flow
- `GET /auth/callback` - Handle OAuth callback
- `POST /auth/refresh` - Refresh access token

### Mood Analysis
- `POST /api/mood/analyze-text` - Analyze mood from text
- `POST /api/mood/analyze-emoji` - Analyze mood from emojis

### Spotify Integration
- `GET /api/spotify/me` - Get user profile
- `POST /api/spotify/recommendations` - Get track recommendations
- `POST /api/spotify/create-playlist` - Save playlist to Spotify

## 🎵 Example Requests

### Text Mood Analysis
```javascript
POST /api/mood/analyze-text
{
  "text": "feeling energetic and ready to conquer the world"
}
```

### Emoji Mood Analysis
```javascript
POST /api/mood/analyze-emoji
{
  "emojis": ["🔥", "💪", "🚀"]
}
```

## 🚀 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy the backend service

### Frontend (Vercel)
1. Connect repository to Vercel
2. Set build command: `npm run build`
3. Deploy the frontend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spotify Web API for music data
- React community for amazing tools
- Bootstrap for responsive design components
- All the amazing artists whose music makes this possible

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/moodify/issues) page
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce

---

Made with ❤️ and lots of ☕ by Lan Anh

**Happy listening! 🎧**