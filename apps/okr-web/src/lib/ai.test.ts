import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { analyzeOKR } from './ai';
import { chat } from '@tanstack/ai';

// Mock TanStack AI
vi.mock('@tanstack/ai', () => ({
    chat: vi.fn(),
}));

vi.mock('@tanstack/ai-openrouter', () => ({
    openRouterText: vi.fn(),
}));

describe('analyzeOKR', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call TanStack AI chat with correct prompt and return suggestions', async () => {
        const mockJson = JSON.stringify({
            general: 'Good OKR',
            technical: 'Tech feedback',
            softSkills: 'Soft feedback',
            talentDevelopment: 'Growth feedback',
            revisedOKR: 'Revised'
        });

        const mockStream = (async function* () {
            yield { type: 'content', delta: mockJson, content: mockJson };
        })();

        // Mock the chat function
        (chat as unknown as Mock).mockResolvedValue(mockStream);

        const inputs = {
            objective: 'Get better at coding',
            technicalKRs: [{ value: 'Write code', actionPlans: ['Practice daily'] }],
            softSkillsKRs: [{ value: 'Mentor juniors', actionPlans: [] }],
            talentDevKRs: [{ value: 'Write blog', actionPlans: [] }],
        };

        const result = await analyzeOKR(inputs);

        expect(result).toEqual({
            general: 'Good OKR',
            technical: 'Tech feedback',
            softSkills: 'Soft feedback',
            talentDevelopment: 'Growth feedback',
            revisedOKR: 'Revised'
        });

        expect(chat).toHaveBeenCalledWith(expect.objectContaining({
            // We can check if adapter is passed, but checking messages is most critical for the prompt logic
            systemPrompts: expect.arrayContaining([expect.stringContaining('JSON')]),
            messages: expect.arrayContaining([
                expect.objectContaining({
                    role: 'user',
                    content: expect.stringContaining('strict JSON format')
                })
            ])
        }));
    });
});

