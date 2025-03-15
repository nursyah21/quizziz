# quzziz app

## story

### Daily Log

**Day 1 – Project Initialization**  
- Set up a new Next.js project for the "quzziz app".  
- Created an initial folder structure including folders such as `app`, `components`, `lib`, and more.  
- Prepared a basic README.md outlining the project story.

**Day 2 – Firebase & Next.js Configuration**  
- Configured Firebase by creating `firebaseConfig.ts` and initializing Firebase in `firebase.ts`.  
- Updated `next.config.ts` to include necessary headers (e.g., setting `Cross-Origin-Embedder-Policy` and `Cross-Origin-Opener-Policy`) for handling authentication pop-ups.  
- Created a `.env.local` file based on the Firebase configuration.

**Day 3 – Firebase Authentication Integration**  
- Set up Firebase Authentication using Google and implemented login functionality with both pop-up and redirect approaches.  
- Developed an authentication service (or related component) along with a custom hook (`useAuth`) for managing authentication state via an Auth Provider.

**Day 4 – Firestore and Schema Setup**  
- Designed and created a data schema in `schema.ts` for quizzes and questions.  
- Added initial Firestore CRUD functions for quizzes to integrate with the Firestore database.

**Day 5 – File Upload Feature with Firebase Storage**  
- Developed a file upload function (`uploadFileFirebase`) for uploading files to Firebase Storage.  
- Integrated file upload support in the quiz creation page, complete with file input refs for audio (music) and image files, and set a file size limit (1MB).

**Day 6 – Improving User Experience**  
- Replaced browser `alert` calls with toast notifications (using the toast component from shadcn) for a smoother error display during file upload and other validations.  
- Added a loading indicator (using a Loader icon) to display while files are uploading.

**Day 7 – Displaying Media Based on Uploaded File Type**  
- Modified the quiz creation page to update the question type from `text` to either `audio` or `image` based on the file uploaded.  
- Implemented conditional rendering: a text area for text questions, an `<img>` element for image questions, and an `<audio>` player for audio questions.

**Day 8 – UI Enhancements and Media Centering**  
- Adjusted styling to center the uploaded image using CSS flexbox classes.  
- Ensured that all UI components (buttons, inputs, dialogs) maintain a consistent and polished look throughout the app.

**Day 9 – Project Structure Refactoring**  
- Reassessed your folder structure and refactored it: moved service-related code (authentication, quiz, and storage services) into a dedicated `services` folder, while keeping helpers and utilities in `lib`.  
- This change helped clarify the roles of various files and made the project easier to manage.

**Day 10 – Final Review and Documentation Updates**  
- Updated the README.md to reflect the current state and progress of the project.  
- Reviewed and tested the code for overall structure, performance, and best practices.  
- Prepared documentation detailing the design decisions, service separation, and project structure for future reference.