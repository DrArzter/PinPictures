# PinPictures

[English](README.md) | [Русский](README_RU.md)

PinPictures is a modern photo-sharing social platform built with Next.js and cutting-edge technology stack.

## 🌟 Key Features

- 📸 Photo publishing with multiple image support
- 💬 Comments and likes for content interaction
- 👥 User profiles and subscription system
- 💌 Private messaging and group chats
- 🌓 Dark and light themes
- 🔍 Smart content search
- 👑 Advanced admin panel
- 🔄 Real-time notifications
- 📱 Progressive Web App (PWA) support

## 🛠 Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, SCSS modules
- **Animations**: Framer Motion
- **Icons**: React Icons
- **State Management**: React Context
- **Real-time Features**: Socket.IO
- **Image Processing**: Sharp, ImageMagick
- **PWA**: Next-PWA
- **Analytics**: Vercel Analytics
- **Testing**: Jest, React Testing Library
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier
- **Performance**: Lighthouse CI

## 💻 System Requirements

- Node.js 18.0 or later
- npm 9.0 or later
- Git 2.0 or later
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file and configure required environment variables:
```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Authentication
JWT_SECRET=your_jwt_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Database
DATABASE_URL=your_database_url

# Storage
STORAGE_ACCOUNT=your_storage_account
STORAGE_KEY=your_storage_key

# Email Service
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
```

4. Choose how to run the project:

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Development Build
```bash
npm run build:dev
npm run start:dev
```

## 📱 Main Sections

### Posts
- Create posts with multiple images
- Likes and comments
- Detailed post view
- Hashtags and categories
- Share to social media
- Save to collections

### User Profile
- Personal information
- Post gallery
- Settings profile
- Statistics and insights
- Customizable portfolio

### Chats
- Private messages
- Group chats
- Real-time updates
- File sharing

### Admin Panel
- Platform statistics
- User management
- Content moderation
- Security system (KGB)
- Performance monitoring
- Error tracking
- User feedback system

## 🔐 Authentication

- Email verification registration
- Email/password login
- Password recovery
- Protected routes
- OAuth providers (Google, GitHub)

## 🎨 User Interface

- Responsive design
- Dark/light theme support
- Animated transitions
- Modern minimalist style
- Custom keyboard shortcuts
- Gesture controls
- Accessibility features

## 👥 User Roles

- Guest
- Registered user
- Creator
- Moderator
- Administrator
- Super Administrator

## 🛡 Security

- XSS protection
- CSRF tokens
- Secure password storage
- Rate limiting
- Input validation
- SQL injection prevention
- File upload validation
- DDOS protection
- Regular security audits

## 🚀 Performance

- Image optimization
- Lazy loading
- Code splitting
- Caching strategies
- CDN integration
- Server-side rendering
- Static page generation

## 📈 Analytics

- User behavior tracking
- Performance monitoring
- Error tracking
- A/B testing
- Conversion tracking
- Custom event tracking

## 📝 License

MIT License

Copyright (c) 2024 PinPictures

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📜 Changelog

See [CHANGELOG.md](CHANGELOG.md) for details about project updates.

## 🐛 Known Issues

See [ISSUES.md](ISSUES.md) for current known issues and their workarounds.

---

Created with ❤️ by PinPictures team
