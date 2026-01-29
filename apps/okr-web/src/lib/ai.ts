import { createOpenRouterText } from '@tanstack/ai-openrouter';
import { chat } from '@tanstack/ai';
import { env } from '@/env';

interface KeyResult {
    value: string;
    deadline?: string;
    actionPlans: string[];
}

interface OKRInputs {
    objective: string;
    technicalKRs: KeyResult[];
    softSkillsKRs: KeyResult[];
    talentDevKRs: KeyResult[];
    performanceKRs: KeyResult[];
}

export interface FeedbackObject {
    general: string;
    technical: string;
    softSkills: string;
    talentDevelopment: string;
    performance: string;
    revisedOKR: string;
}

export async function analyzeOKR(inputs: OKRInputs): Promise<FeedbackObject> {
    const formatKRs = (krs: KeyResult[], title: string) => {
        if (krs.length === 0) return '';
        const list = krs.map((kr, i) => {
            const deadlineStr = kr.deadline ? ` (Due: ${kr.deadline})` : '';
            const plans = kr.actionPlans.length > 0
                ? '\n     Action Plans:\n' + kr.actionPlans.map(ap => `     - ${ap}`).join('\n')
                : '';
            return `   ${i + 1}. ${kr.value}${deadlineStr}${plans}`;
        }).join('\n');
        return `\n ${title}:\n${list}`;
    };

    const details =
        formatKRs(inputs.performanceKRs, 'Business Performance') +
        formatKRs(inputs.technicalKRs, 'Technical Skills') +
        formatKRs(inputs.softSkillsKRs, 'Soft Skills') +
        formatKRs(inputs.talentDevKRs, 'Talent Development');

    const prompt = `
You are an expert OKR consultant specialized in Engineering Growth.
Review the following Personal OKR:

Objective: "${inputs.objective}"
${details}

Evaluate this OKR based on best practices and the engineering pillars.
The user has provided inputs categorized by Business Performance, Technical, Soft Skills, and Talent Development.

**Evaluation Criteria for Key Results:**
1.  **Binary Outcome**: It must be immediately clear whether the result was achieved or not (Yes/No).
2.  **Specificity**: Avoid vague terms like "improve" or "understand". Use concrete deliverables or metrics.

**Examples:**
*   **BAD**: "Improve coding skills" (Vague, not binary)
*   **GOOD**: "Complete 5 specific coding patterns on LeetCode" (Specific, Binary)
*   **BAD**: "Read technical books" (No outcome defined)
*   **GOOD**: "Read 'Clean Architecture' and publish a 500-word summary on the team blog" (Specific, Binary)

Ensure your feedback addresses each category specifically and checks if the items in each category meet these criteria.
If a KR is vague, suggest a specific, binary alternative in the \`revisedOKR\`.

IMPORTANT: The values of your JSON response MUST BE IN JAPANESE.

You MUST output your response in strict JSON format with the following keys:
You MUST output your response in strict JSON format with the following keys:
- "general": General feedback on the Objective and KRs quality.
- "performance": Specific feedback related to Business Performance.
- "technical": Specific feedback related to Technical Skills.
- "softSkills": Specific feedback related to Soft Skills.
- "talentDevelopment": Specific feedback related to Talent Development.
- "revisedOKR": A revised version of the OKR (Objective + KRs) in Japanese.

Ensure all values are in Japanese.
Do not include any markdown formatting (like \`\`\`json) in the response, just the raw JSON object.
`;

    const combinedPrompt = `${prompt}\n\nIMPORTANT: You are a helpful assistant specialized in OKRs. You always respond in valid JSON. The values of your JSON response MUST BE IN JAPANESE.`;

    const stream = await chat({
        adapter: createOpenRouterText('mistralai/mistral-small-3.1-24b-instruct:free', env.OPENROUTER_API_KEY),
        messages: [
            { role: 'user', content: combinedPrompt },
        ],
    });

    let fullText = '';
    for await (const chunk of stream) {
        if (chunk.type === 'content' && typeof chunk.delta === 'string') {
            fullText += chunk.delta;
        } else if (chunk.type === 'error') {
            console.error('Stream Error:', chunk.error);
        }
    }

    try {
        if (!fullText) {
            throw new Error('AI returned empty response (potential provider error)');
        }
        // Clean up potential markdown code blocks if the model ignores instructions
        let cleanText = fullText.replace(/```json\n?|```/g, '').trim();

        // Attempt to find the first '{' and last '}' to extract just the JSON object
        const firstOpen = cleanText.indexOf('{');
        const lastClose = cleanText.lastIndexOf('}');

        if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
            cleanText = cleanText.substring(firstOpen, lastClose + 1);
        }

        return JSON.parse(cleanText) as FeedbackObject;
    } catch (e: any) {
        console.error('Failed to parse AI response:', e);

        // Default error message
        let errorMessage = 'AIからの応答の解析に失敗しました。もう一度試してください。';

        // Detect specific provider errors
        if (e.message?.includes('provider error') || fullText.includes('Provider returned error')) {
            errorMessage = '現在、AIプロバイダー（OpenRouter/Google）が混雑しているか、無料枠のレート制限にかかっています。しばらく時間を置いてから再試行してください。';
        }

        return {
            general: errorMessage,
            technical: '',
            softSkills: '',
            talentDevelopment: '',
            performance: '',
            revisedOKR: '' // Do not show raw text for provider errors as it is confusing
        };
    }
}


