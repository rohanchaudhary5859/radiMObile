/**
 * aiService.js
 * - Caption generation / hashtag suggestions (calls edge functions)
 * - Medical assistant calls
 * - Request embedding generation (optional)
 */

import { SUPABASE_FUNCTIONS_URL } from '../config/supabase';

async function callFn(fnName, payload = {}) {
  const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/${fnName}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function generateCaption(text, style = 'professional') {
  return callFn('caption_generator', { text, style });
}

export async function suggestHashtags(text) {
  return callFn('hashtag_suggestor', { text });
}

export async function medicalAssistantQuery(question, context = {}) {
  return callFn('medical_assistant', { question, context });
}

export async function requestEmbeddingForContent(source, sourceId, text) {
  return callFn('generate_embedding_redacted', { source, sourceId, text });
}
