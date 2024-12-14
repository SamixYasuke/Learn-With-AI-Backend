import Question from "../models/question.model";
import { CustomError } from "../errors/CustomError";
import { aiGenNoteQuestionResponse } from "../utils/ai";
import { Note } from "../models/note.model";

const generateUserQuestionFromNoteService = async (
  user_id: string,
  note_id: string,
  question_type: "multiple_choice" | "true_false" | "long_answer",
  number_of_questions: 5 | 10 | 20,
  difficulty: "easy" | "medium" | "hard"
): Promise<object> => {
  const note = await Note.findOne({ _id: note_id, user_id });
  if (!note) {
    throw new CustomError("Question generation failed: Note not found.", 404);
  }

  const existingQuestion = await Question.findOne({ note_id });
  if (existingQuestion) {
    throw new CustomError(
      "Question generation failed: Questions already generated for this note.",
      400
    );
  }

  const aiResponse = await aiGenNoteQuestionResponse(
    note.content,
    question_type,
    number_of_questions,
    difficulty
  );

  console.log("AI Response:", aiResponse);

  if (!aiResponse || aiResponse.questions.length === 0) {
    throw new CustomError(
      "Question generation failed: AI response invalid.",
      500
    );
  }

  const generatedQuestions = aiResponse.questions.map((question) => ({
    user_id,
    note_id,
    question_type,
    number_of_questions,
    difficulty,
    question_text: question.question,
    options: question.options || undefined,
    correct_answer: question.correct_answer || undefined,
    expected_answer: question.expected_answer || undefined,
  }));
  const saveAIGeneratedQuestion = await Question.insertMany(generatedQuestions);

  return {
    questions: saveAIGeneratedQuestion,
  };
};

export { generateUserQuestionFromNoteService };
