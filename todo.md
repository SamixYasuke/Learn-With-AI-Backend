# API Routes Documentation

## 1. Upload Lesson Note

### POST /api/notes/upload

- **Description**: Upload a lesson note (PDF or document).
- **Request Body**:
  - `file`: The lesson note file (PDF or document).
- **Response**:
  - `201 Created`: Returns the metadata of the uploaded lesson note (file, summary, and extracted topics).
  - `400 Bad Request`: Invalid file or file format.

### GET /api/notes/:noteId

- **Description**: Retrieve the original lesson note, summary, and extracted topics.
- **Parameters**:
  - `noteId`: The ID of the lesson note to retrieve.
- **Response**:
  - `200 OK`: Returns the lesson note details (original file, summary, topics).
  - `404 Not Found`: Lesson note not found.

### DELETE /api/notes/:noteId

- **Description**: Delete a previously uploaded lesson note.
- **Parameters**:
  - `noteId`: The ID of the lesson note to delete.
- **Response**:
  - `200 OK`: Confirmation of successful deletion.
  - `404 Not Found`: Lesson note not found.

## 2. Interactive Q&A

### POST /api/qna/ask

- **Description**: Submit a question (text or transcribed voice). Determine if the question is in-scope or out-of-scope and generate a response based on the lesson note.
- **Request Body**:
  - `question`: The text or voice-transcribed question.
- **Response**:
  - `200 OK`: The generated answer.
  - `400 Bad Request`: Invalid question or format.
  - `422 Unprocessable Entity`: Out-of-scope question, with a response like "Please stick to the scope of the note."

### GET /api/qna/logs

- **Description**: Retrieve past Q&A sessions for the current user.
- **Response**:
  - `200 OK`: A list of past Q&A sessions.
  - `404 Not Found`: No Q&A sessions found.

### DELETE /api/qna/logs/:logId

- **Description**: Delete a specific Q&A log.
- **Parameters**:
  - `logId`: The ID of the Q&A log to delete.
- **Response**:
  - `200 OK`: Confirmation of successful deletion.
  - `404 Not Found`: Q&A log not found.

## 3. Exam Mode

### POST /api/exams/generate

- **Description**: Generate an exam based on the uploaded lesson note. Allow customization parameters like question types (objective, fill-in-the-blank, theoretical), number of questions, and difficulty level.
- **Request Body**:
  - `questionType`: Type of question (objective, fill-in-the-blank, theoretical).
  - `numberOfQuestions`: Number of questions to generate.
  - `difficulty`: Difficulty level of the questions.
- **Response**:
  - `200 OK`: The generated exam questions.
  - `400 Bad Request`: Invalid parameters.

### POST /api/exams/submit

- **Description**: Submit exam answers for scoring and feedback.
- **Request Body**:
  - `answers`: The answers to the generated exam.
- **Response**:
  - `200 OK`: The exam score and feedback.
  - `400 Bad Request`: Invalid answers format.

### GET /api/exams/history

- **Description**: Retrieve a list of past exams and their scores for the user.
- **Response**:
  - `200 OK`: A list of past exams and scores.
  - `404 Not Found`: No exams found.

### GET /api/exams/:examId

- **Description**: Get detailed results for a specific exam, including feedback.
- **Parameters**:
  - `examId`: The ID of the exam to retrieve.
- **Response**:
  - `200 OK`: The detailed exam result and feedback.
  - `404 Not Found`: Exam not found.

### DELETE /api/exams/:examId

- **Description**: Delete a specific exam from the user’s history.
- **Parameters**:
  - `examId`: The ID of the exam to delete.
- **Response**:
  - `200 OK`: Confirmation of successful deletion.
  - `404 Not Found`: Exam not found.

## 4. User Management

### POST /api/auth/register

- **Description**: Register a new student account.
- **Request Body**:
  - `email`: Student's email address.
  - `password`: Student's password.
  - `name`: Student's full name.
- **Response**:
  - `201 Created`: The registered user details (without password).
  - `400 Bad Request`: Invalid input or user already exists.

### POST /api/auth/login

- **Description**: Log in with email and password.
- **Request Body**:
  - `email`: Student's email address.
  - `password`: Student's password.
- **Response**:
  - `200 OK`: User login details along with a JWT token.
  - `401 Unauthorized`: Invalid credentials.

### GET /api/auth/profile

- **Description**: Get user profile details.
- **Response**:
  - `200 OK`: The user's profile details.
  - `401 Unauthorized`: User not authenticated.

### PUT /api/auth/profile

- **Description**: Update user profile.
- **Request Body**:
  - `name`: Updated student name (optional).
  - `email`: Updated email (optional).
- **Response**:
  - `200 OK`: Updated profile details.
  - `400 Bad Request`: Invalid input.

### DELETE /api/auth/logout

- **Description**: Log out the current user.
- **Response**:
  - `200 OK`: Successful logout.
  - `401 Unauthorized`: User not authenticated.

## 5. Voice Input Support

### POST /api/voice/upload

- **Description**: Upload a voice recording for transcription and Q&A processing.
- **Request Body**:
  - `file`: The voice file to transcribe.
- **Response**:
  - `200 OK`: The transcribed text from the voice.
  - `400 Bad Request`: Invalid voice file.

### GET /api/voice/logs

- **Description**: Retrieve past transcriptions and related Q&A logs.
- **Response**:
  - `200 OK`: A list of past voice transcriptions and Q&A logs.
  - `404 Not Found`: No voice logs found.

## 6. Analytics and Recommendations

### GET /api/analytics/progress

- **Description**: Get progress data (e.g., exam scores, time spent studying).
- **Response**:
  - `200 OK`: The user's progress data.

### GET /api/analytics/recommendations

- **Description**: Provide study recommendations based on past performance.
- **Response**:
  - `200 OK`: Study recommendations for the user.

## 7. Miscellaneous

### POST /api/files/validate

- **Description**: Validate if a file (outside of the upload flow) meets lecture note criteria.
- **Request Body**:
  - `file`: The file to validate.
- **Response**:
  - `200 OK`: Confirmation if the file is a valid lecture note.
  - `400 Bad Request`: Invalid file format.

### GET /api/health

- **Description**: Check if the API service is running.
- **Response**:
  - `200 OK`: API is running.
  - `500 Internal Server Error`: API is down.
