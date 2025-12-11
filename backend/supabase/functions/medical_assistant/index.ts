import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async (req) => {
  try {
    const { question } = await req.json();

    const prompt = `
You are Medigram AI — a medical assistant for doctors.
Give structured medical answers with:
• Possible causes
• Risk factors
• Recommended clinical tests
• Differential diagnosis
• Treatment options
Do NOT give instructions for self medication.
Question: ${question}
`;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return new Response(JSON.stringify({ answer: res.choices[0].message.content }), {
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
