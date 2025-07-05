/* eslint-disable @typescript-eslint/no-explicit-any */
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

export type GroqMode =  'general_q'| 'learning_outline' | 'learning_mcq';
// export type GroqMode = 'learning_outline' | 'learning_mcq';


export interface DayPlan {
  day: number;
  title: string;
  reading: string;
  mcq: {
    question: string;
    options: string[];
    answer: string;
  }[];
}

export interface CurrentPlan {
  topic: string;
  currentDay: number;
  plan: DayPlan[];
}

interface GroqAIParams {
  apiKey: string;
  mode: GroqMode;
  question: string;
  name: string;
}

export const callGroqAI = async ({
  apiKey,
  mode,
  question,
  name,
}: GroqAIParams) => {
  let systemPrompt = '';

  switch (mode) {

      case 'learning_outline':
  systemPrompt = `
You are an AI Teacher that only replies with strict, valid JSON.

Generate a 3-day structured learning outline for ${name} based on topic: "${question}".

Each day must include:
- day (number)
- title (string)
- reading (100-200 words)

Return **only** strict JSON. Do NOT wrap in code blocks. Do NOT explain anything. Do NOT use trailing commas.
Return like:
[
  {
    "day": 1,
    "title": "Day 1 Title",
    "reading": "..."
  }
]
`;
  break;

  case 'learning_mcq':
  systemPrompt = `
You are an AI Teacher that only replies with strict, valid JSON.

Based on the following structured 3-day plan, generate **5 MCQs** for each day. 
Each MCQ must include:
- question (string)
- options (array of 4 strings)
- answer (exact match from options array)

Structured Plan:
${question}

Return **only** valid JSON. Do NOT explain anything. Do NOT wrap in code blocks. Do NOT use trailing commas.
Return like:
[
  {
    "day": 1,
    "mcq": [
      {
        "question": "What is X?",
        "options": ["option1", "option2", "option3", "option4"],
        "answer": "option1"
      }
    ]
  }
]
`;
  break;

    default:
      throw new Error('Invalid Groq mode');
  }

  const body = {
    model: GROQ_MODEL,
    temperature: 0.7,
    max_tokens: 3000,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question },
    ],
  };

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data?.error?.message || 'Groq API Error');

    return data.choices?.[0]?.message?.content || 'No response received.';
  } catch (err: any) {
    console.error('Groq call failed:', err.message);
    return '⚠️ AI failed to respond. Try again later.';
  }
};
