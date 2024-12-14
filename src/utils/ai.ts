import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
import { saveNotePersona } from "../persona/save-note.persona";
import { chatWithNotePersona } from "../persona/chat-with-note.persona";
import { generateQuestionsPersona } from "../persona/generate-question.persona";

dotenv.config();
const OpenAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OpenAI_API_KEY });

const topic = z.object({
  topic: z.string(),
});
const noteResponse = z.object({
  summary: z.string(),
  explanation_one: z.string(),
  explanation_two: z.string(),
  explanation_three: z.string(),
  explanation_four: z.string(),
  topics: z.array(topic),
});

const userConversationResponse = z.object({
  question: z.string(),
  answer: z.string(),
});

const userGenQuestionResponse = z.object({
  question: z.string(),
  options: z.array(z.string()).optional(),
  correct_answer: z.string().optional(),
  expected_answer: z.string().optional(),
});

const userGenQuestionsResponse = z.object({
  questions: z.array(userGenQuestionResponse),
});

const aiNoteResponse = async (user_note: string) => {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: saveNotePersona,
      },
      { role: "user", content: user_note },
    ],
    response_format: zodResponseFormat(noteResponse, "note"),
  });

  const response = completion.choices[0].message.parsed;
  return response;
};

const aiNoteChatResponse = async (
  user_question: string,
  note_context: string
) => {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: chatWithNotePersona(note_context),
      },
      { role: "user", content: user_question },
    ],
    response_format: zodResponseFormat(
      userConversationResponse,
      "user_conversation"
    ),
  });

  const response = completion.choices[0].message.parsed;
  return response;
};

const aiGenNoteQuestionResponse = async (
  note_context: string,
  question_type: "multiple_choice" | "true_false",
  number_of_questions: 5 | 10 | 20,
  difficulty: "easy" | "medium" | "hard"
) => {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: generateQuestionsPersona(
          note_context,
          question_type,
          number_of_questions,
          difficulty
        ),
      },
    ],
    response_format: zodResponseFormat(
      userGenQuestionsResponse,
      "user_gen_question"
    ),
  });

  const response = completion.choices[0].message.parsed;
  return response;
};

export { aiNoteResponse, aiNoteChatResponse, aiGenNoteQuestionResponse };
