# Voice to LinkedIn

Transform your voice into engaging LinkedIn posts with AI-powered transcription, content generation, and image creation.

## Features

- 🎤 **Voice Recording**: Record your thoughts using your device's microphone
- 🧠 **AI Transcription**: Convert speech to text using OpenAI's Whisper API
- ✍️ **Smart Post Generation**: Transform thoughts into professional LinkedIn posts
- 🎨 **AI Image Generation**: Create compelling images for your posts using DALL-E
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

## Setup

1. **Clone and install dependencies**:
   ```bash
   git clone <your-repo-url>
   cd thoughts
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Get your OpenAI API key**:
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Create an account or sign in
   - Navigate to API Keys section
   - Create a new API key
   - Copy the key and paste it in your `.env.local` file

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

1. **Record Your Thoughts**: Click the microphone button and speak your ideas
2. **Review & Edit**: Your transcribed thoughts will appear as cards - edit them if needed
3. **Select Thoughts**: Choose which thoughts to include in your LinkedIn post
4. **Generate Post**: Click "Generate LinkedIn Post" to create a professional post
5. **Create Image**: Generate a compelling image that represents your post's core idea
6. **Copy & Share**: Copy your post and download the image to share on LinkedIn

## API Endpoints

- `POST /api/transcribe` - Transcribe audio to text
- `POST /api/generate-post` - Generate LinkedIn post from thoughts
- `POST /api/generate-image` - Generate image from post content

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenAI API** - AI services (Whisper, GPT-4, DALL-E)
- **Lucide React** - Icons
- **Radix UI** - Accessible components

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

**Note**: Voice recording requires HTTPS in production or localhost for development.

## Troubleshooting

### Voice Recording Issues
- Ensure your browser has microphone permissions
- Try refreshing the page and allowing microphone access
- Use Chrome/Chromium for best compatibility

### API Errors
- Verify your OpenAI API key is correct
- Check your OpenAI account has sufficient credits
- Ensure you have access to the required models (Whisper, GPT-4, DALL-E)

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version: `node --version` (should be 18+)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details