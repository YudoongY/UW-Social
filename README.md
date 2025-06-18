# UW-Social
A website helps UW transfer students, international students, and freshmen to form and expand their social circle. Users can find friends with same interests, courses, career plan, clubs, and even dorm building. They can join all kinds of events published by different organizations to make new friends offline, and publish their own events.
### Project Overview
This document contains all necessary information about the technology stack, features, database schema, and implementation details. Future development should reference this document to maintain consistency.
### Technology Stack
- **Frontend**: Vue.js 3, TypeScript, Vue Router, Vuex/Pinia
- **Backend**: Node.js, Express.js
- **Database**: FireBase, MySQL
- **Authentication**: JWT (JSON Web Tokens), FireBase
### Core Features
1. **Event Management**
	- Create and publish events
	- Event list display
	- Event details viewing
	- Event participation
	- Event commenting
2. **User System**
	- User registration and login
	- Profile management
	- Avatar upload functionality (?)
	- User authentication and authorization
3. **Interface Display**
	- Responsive design
	- Modern UI interface
	- User-friendly navigation system
### Project Structure
- **Frontend/**
	- `src/components/`: Reusable components
	- `src/views/`: Page views
	- `src/router/`: Route configuration
	- `src/store/`: State management
	- `src/assets/`: Static assets
- **Backend/**
	- `src/controllers/`: Controllers
	- `src/models/`: Data models
	- `src/routes/`: API routes
	- `src/middleware/`: Middleware
	- `src/config/`: Configuration files
### Development Guidelines
- TypeScript for type checking
- Follow Vue.js 3 Composition API best practices
- Component-based development approach
- Consistent code style and naming conventions
### Deployment Requirements
- Node.js environment
- MySQL database
- Environment variables configuration
- CORS settings