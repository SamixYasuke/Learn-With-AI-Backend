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

  const existingQuestion = await Question.findOne({ note_id, user_id });
  if (existingQuestion) {
    throw new CustomError("Questions already generated for this note.", 400);
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

  const newQuestion = new Question({
    user_id,
    note_id,
    question_type,
    number_of_questions,
    difficulty,
    questions: aiResponse.questions.map((question) => ({
      question_text: question.question,
      options: question.options,
      correct_answer: question.correct_answer,
      expected_answer: question.expected_answer,
    })),
  });
  const savedQuestion = await newQuestion.save();
  return {
    questions: savedQuestion,
  };
};

export { generateUserQuestionFromNoteService };
