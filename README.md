# AI Learning 🤖📚

An interactive learning platform that helps users learn anything independently using AI-generated courses. Built as part of the larger Leeveen ecosystem for individual and group self-improvement tools.

## 🎯 Vision

AI Learning empowers autonomous learning by:
- **AI-Generated Courses**: Create comprehensive, structured courses on any topic using AI
- **Interactive Learning**: Engage with exercises, QCMs, and practical problems
- **Progress Tracking**: Monitor your learning journey with detailed progress indicators
- **Self-Paced Learning**: Learn at your own speed without instructors

## ✨ Features

### 🏠 Course Management
- **Course Library**: Browse and manage your personal course collection
- **Progress Tracking**: Visual indicators showing completion status
- **Local Storage**: All data stored locally for privacy and offline access

### 📖 Interactive Course Viewer
- **Modular Learning**: Courses split into digestible modules
- **Rich Content**: Markdown support with LaTeX math expressions
- **Exercise System**: QCM (multiple choice) and practice exercises
- **Instant Feedback**: Show/hide corrections for self-assessment

### 🛠️ Course Creation
- **AI Integration**: Paste prompts to generate structured courses
- **JSON Import**: Import pre-existing course content
- **Flexible Format**: Support for various exercise types and difficulty levels

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Navigation**: Easy-to-use navbar and course navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-learning

# Install dependencies
npm install
# or
yarn install
# or
bun install
```

### Development

```bash
# Start development server
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

### Build for Production

```bash
# Build the application
npm run build
# or
yarn build
# or
bun run build
```

## 📋 Usage Guide

### Creating a Course

1. **Navigate to Homepage**: Use the main input area
2. **Generate with AI**: 
   - Paste the provided AI prompt template
   - Customize with your desired topic and level
   - Submit to your preferred AI service
3. **Import Course**: 
   - Copy the generated JSON
   - Paste into the course import field
   - Click "Load Course"

### AI Prompt Template

```xml
<styles_info>
Claude is a expert teacher in the field of the user choice. His is to search the web for informations about a specific topic on the web and provide a course following STRICTLY the format requested in the <format_guidelines></format_guidelines> tag

## Teaching style
1. Search first: Claude first searches the internet for informations, as he should provide the most up to date informations
2. Progressive learning: Claude supposes the user does not have an expertise in the domain in the course he asked. As such, any jargon should be explained explicitly with simple words. Also, the first part of the course should always be simple, and explain the prerequisites in a list before starting to make the course
3. Modularity: Instead of providing one giant course for the whole topic, Claude should try to create short and easily digestable parts for the course. 
4. Problem solving driven: When creating a module, Claude should try to introduce a problem you can solve by learning what is in the module first. That way, it won't be too theorical. When talking about theory, Claude should try to link it to the problem, so that the module is never too abstract.
5. Exercise oriented: For every module, Claude should at least create 5 exercices that checks wether or not the user managed to learn the theory and can use it to solve problems
6. Not QCM oriented: If QCMs are a good way of knowing if a user learned something, practical exercices should be prioritised if possible.
</styles_info>

<format_guidelines>
[JSON format specifications for course structure]
</format_guidelines>

<instructions>
Create a course about [YOUR TOPIC] for [SKILL LEVEL] learners
</instructions>
```

### Course Structure

Courses follow a strict JSON format:

The src/models/course.ts specifies the format of the json in typescript:

```ts
export type Course = {
    name: string
    topic: string
    done: boolean
    level: CourseLevel
    modules: Module[]
}

export type CourseLevel = "ABSOLUTE_BEGINNER" | "NOVICE" | "JUNIOR" | "MID_LEVEL" | "ADVANCED" | "EXPERT"


export type Module = {
    title: string
    description: string
    content: string
    done: boolean
    exercises: Exercise[]
}

export type Exercise = QCM | Practise

export type QCMQuestion = {
    question: string
    responses: QCMResponse[]
}

export type QCM = {
    questions: QCMQuestion
    done: boolean
}

export type QCMResponse = {
    content: string
    rightAnswer: boolean
}

export type Practise = {
    content: string
    correction: string
}
```
Which translates as this in JSON:
```json
{
  "name": "Course Title",
  "topic": "Subject Area",
  "level": "ABSOLUTE_BEGINNER|NOVICE|JUNIOR|MID_LEVEL|ADVANCED|EXPERT",
  "modules": [
    {
      "title": "Module Title",
      "description": "Brief description",
      "content": "Markdown content with LaTeX support $$formula$$",
      "exercises": [
        {
          "title": "Exercise Title",
          "type": "QCM|PRACTICE",
          "questions": [...], // For QCM
          "content": "...",   // For PRACTICE
          "correction": "..." // For PRACTICE
        }
      ]
    }
  ]
}
```


## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS with custom color palette
- **Routing**: React Router DOM
- **Content**: React Markdown + KaTeX for math
- **Build Tool**: Vite
- **Code Quality**: ESLint + TypeScript strict mode

### Project Structure

```
src/
├── components/
│   ├── common/          # Shared components (navbar, etc.)
│   ├── course/          # Course viewing components
│   ├── editor/          # Course creation/editing
│   ├── home/            # Homepage components
│   └── svg/             # Icon components
├── hooks/               # Hooks to use throughout the app
├── models/              # Types 
├── context/             # React context providers
└── assets/              # Static assets and resources
```

### Key Components

- **Course Viewer**: Interactive course display with progress tracking
- **Exercise System**: Support for QCM and practice exercises
- **Navigation**: Modular navigation between course sections
- **Progress Tracking**: Visual indicators and completion states

### Data Storage

- **Local Storage**: All course data and progress stored locally
- **Privacy First**: No external data transmission
- **Offline Ready**: Full functionality without internet connection

## 🎨 Design System

### Color Palette
- **Primary**: Red variations (#d22617, #f05545, #ff8a7d)
- **Secondary**: Orange/Gold (#d78f11, #8f7c31)
- **Accent**: Blue/Teal (#259591, #c2f0ed)
- **Success**: Joyful Green (#8dbe42)

### Typography
- **Display**: Lobster (decorative)
- **Body**: Poppins (clean, readable)

## 🔮 Future Roadmap

### Phase 1: Local Foundation ✅
- Interactive course viewer
- JSON course import
- Progress tracking
- Exercise system

### Phase 2: Enhanced UX (In Progress)
- Course library management
- Better course creation tools
- Improved navigation
- User accounts (local)

### Phase 3: Online collaborative platform
- **Git Integration**: Version control for courses
- **Branching**: Multiple course variations
- **Discussions**: Community feedback on course branches
- **Online Sync**: Cloud storage and sharing

### Phase 4: Advanced Features
- **AI Integration**: Built-in course generation
- **Adaptive Learning**: Personalized learning paths
- **Analytics**: Detailed learning insights
- **Community**: Course marketplace

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use the existing component structure
- Maintain accessibility standards
- Write descriptive commit messages
- Test on multiple screen sizes

### Code Style
- Use TypeScript strict mode
- Follow React functional component patterns
- Implement proper error boundaries
- Optimize for performance

## 📜 License

The project has an MIT License

## 🔗 Related Projects

- **Leeveen**: Closed source 
- **Future Modules**: Additional learning and productivity tools

## 💡 Philosophy

AI Learning embodies the principle that the best learning happens when individuals take control of their educational journey and share them in a community, without strict rules and hierarchical contexts. It aims, in the end, to be a sort of Wikipedia of courses. By combining AI-generated content with interactive, self-paced learning tools, we're creating a platform that adapts to learners rather than forcing learners to adapt to rigid educational structures.

---

**Built with ❤️ for autonomous learners everywhere**
