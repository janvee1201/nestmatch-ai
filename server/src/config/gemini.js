import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './env.js';

const genAI = new GoogleGenerativeAI(env.gemini.apiKey);

export default genAI;
