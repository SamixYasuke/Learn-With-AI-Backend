import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
import { saveNotePersona } from "../persona/save-note.persona";
import { chatWithNotePersona } from "../persona/chat-with-note.persona";

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

const userQuestionResponse = z.object({
  question: z.string(),
  answer: z.string(),
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
    response_format: zodResponseFormat(userQuestionResponse, "user_question"),
  });

  const response = completion.choices[0].message.parsed;
  return response;
};

export { aiNoteResponse, aiNoteChatResponse };
