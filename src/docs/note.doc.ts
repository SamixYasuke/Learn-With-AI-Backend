const getUserNotesDoc = `/**
 * @swagger
 * /api/v1/notes:
 *   get:
 *     summary: Retrieve all notes of a user
 *     tags:
 *       - Notes
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved notes for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notes retrieved successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     notes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "64c7f1bc2e9a4e12f89a1234"
 *                           note_name:
 *                             type: string
 *                             example: "Math Notes"
 *       404:
 *         description: No notes found for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No notes found for this user."
 *                 data:
 *                   type: object
 *                   properties:
 *                     notes:
 *                       type: array
 *                       items: []
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving the notes."
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */`;

const getUserNoteByIdDoc = `/**
 * @swagger
 * /api/v1/notes/{note_id}:
 *   get:
 *     summary: Retrieve a specific note by ID for a user
 *     tags:
 *       - Notes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: note_id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64c7f1bc2e9a4e12f89a1234
 *         description: The ID of the note to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the note
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Note retrieved successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     note:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 64c7f1bc2e9a4e12f89a1234
 *                         note_name:
 *                           type: string
 *                           example: "Math Notes"
 *                         created_at:
 *                           type: string
 *                           example: "2024-12-01T12:00:00Z"
 *                         updated_at:
 *                           type: string
 *                           example: "2024-12-02T15:00:00Z"
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Note not found"
 *       403:
 *         description: Unauthorized access to the note
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access to this note"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving the note."
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */`;

const uploadUserNoteDoc = `/**
 * @swagger
 * /api/v1/notes/upload:
 *   post:
 *     summary: Upload a user's note file and extract AI-generated content
 *     tags:
 *       - Notes
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The note file to be uploaded (doc, pdf, etc.)
 *     responses:
 *       200:
 *         description: Successfully uploaded and processed the note file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File uploaded successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     note_id:
 *                       type: string
 *                       example: "64c7f1bc2e9a4e12f89a1234"
 *                     file:
 *                       type: object
 *                       properties:
 *                         original_name:
 *                           type: string
 *                           example: "MyMathNotes.docx"
 *                     ai_note:
 *                       type: object
 *                       properties:
 *                         summary:
 *                           type: string
 *                           example: "This document contains notes on basic algebra concepts."
 *                         explanations:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Explanation of Algebra", "Equations and their solutions"]
 *                         topics:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Algebra", "Equations"]
 *       400:
 *         description: No file provided or invalid file format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No file provided for upload!"
 *       404:
 *         description: File not found or path error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File not found at path: <file_path>"
 *       500:
 *         description: Server error during file processing or AI content generation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while processing the note."
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */`;

const deleteUserNoteDoc = `/**
 * @swagger
 * /api/v1/notes/{note_id}:
 *   delete:
 *     summary: Delete a user's note by its ID
 *     tags:
 *       - Notes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: note_id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64c7f1bc2e9a4e12f89a1234
 *         description: The ID of the note to be deleted
 *     responses:
 *       200:
 *         description: Successfully deleted the note and its related data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Note Deleted successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     note_id:
 *                       type: string
 *                       example: "64c7f1bc2e9a4e12f89a1234"
 *       403:
 *         description: Unauthorized access to delete the note
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access to this note"
 *       404:
 *         description: Note not found for the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Note not found"
 *       500:
 *         description: Server error during note deletion process
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while deleting the note."
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */`;

const askAIQuestionBasedOnNoteDoc = `/**
 * @swagger
 * /api/v1/notes/{note_id}/ask:
 *   post:
 *     summary: Ask a question based on the content of a note
 *     tags:
 *       - Notes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: note_id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64c7f1bc2e9a4e12f89a1234
 *         description: The ID of the note to ask the question based on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: "What is the summary of this note?"
 *                 description: The question the user wants to ask based on the note
 *     responses:
 *       200:
 *         description: Successfully answered the question based on the note
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question Answered successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     answer:
 *                       type: string
 *                       example: "The summary of this note is about AI and machine learning."
 *       400:
 *         description: No question provided or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No question provided. Please provide a valid question."
 *       404:
 *         description: Note not found for the given ID or unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Note not found. Please ensure the note exists."
 *       500:
 *         description: Failed to generate AI response or server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to generate AI response. Please try again."
 *       403:
 *         description: Unauthorized access to the note
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access to this note."
 */`;

const getConversationsByNoteIdDoc = `/**
 * @swagger
 * /api/v1/notes/{note_id}/conversations:
 *   get:
 *     summary: Get all conversations related to a specific note
 *     tags:
 *       - Notes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: note_id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64c7f1bc2e9a4e12f89a1234
 *         description: The ID of the note to fetch conversations for
 *     responses:
 *       200:
 *         description: Successfully fetched conversations for the note
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question Fetched successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     note_id:
 *                       type: string
 *                       example: 64c7f1bc2e9a4e12f89a1234
 *                     conversations:
 *                       type: object
 *                       properties:
 *                         conversation_id:
 *                           type: string
 *                           example: 64d1a2b3c4e5f6d7c8a9b123
 *                         messages:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               sender:
 *                                 type: string
 *                                 example: "user"
 *                               message:
 *                                 type: string
 *                                 example: "What is the summary of this note?"
 *       404:
 *         description: Note not found for the given ID or unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Note not found. Please ensure the note exists."
 *       403:
 *         description: Unauthorized access to the note's conversation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized access to this note's conversation."
 */`;
