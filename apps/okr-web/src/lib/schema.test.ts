import { describe, it, expect } from 'vitest';
import { formSchema } from './schema';

describe('OKR Form Schema Validation', () => {
    it('should pass with valid filled inputs', () => {
        const validInput = {
            objective: 'Valid Objective with sufficient length',
            technicalKRs: [{ value: 'Valid Tech KR', deadline: '2023-12-31', actionPlans: [{ value: 'Valid Plan' }] }],
            softSkillsKRs: [{ value: 'Valid Soft KR', deadline: '', actionPlans: [{ value: 'Valid Plan' }] }],
            talentDevKRs: [{ value: 'Valid Talent KR', actionPlans: [{ value: 'Valid Plan' }] }],
        };
        const result = formSchema.safeParse(validInput);
        expect(result.success).toBe(true);
    });

    it('should fail if Objective is too short', () => {
        const result = formSchema.safeParse({
            objective: 'Short',
            technicalKRs: [{ value: 'Valid Tech KR', actionPlans: [{ value: 'Valid Plan' }] }],
            softSkillsKRs: [{ value: 'Valid Soft KR', actionPlans: [{ value: 'Valid Plan' }] }],
            talentDevKRs: [{ value: 'Valid Talent KR', actionPlans: [{ value: 'Valid Plan' }] }],
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('Objectiveは10文字以上');
        }
    });

    it('should fail if any category is empty', () => {
        const result = formSchema.safeParse({
            objective: 'Valid Objective with sufficient length',
            technicalKRs: [], // Empty
            softSkillsKRs: [{ value: 'Valid Soft KR', actionPlans: [{ value: 'Valid Plan' }] }],
            talentDevKRs: [{ value: 'Valid Talent KR', actionPlans: [{ value: 'Valid Plan' }] }],
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('技術力のOKRは少なくとも1つ必要です');
        }
    });

    it('should fail if Key Result value is too short', () => {
        const result = formSchema.safeParse({
            objective: 'Valid Objective with sufficient length',
            technicalKRs: [{ value: 'No', actionPlans: [{ value: 'Valid Plan' }] }],
            softSkillsKRs: [{ value: 'Valid Soft KR', actionPlans: [{ value: 'Valid Plan' }] }],
            talentDevKRs: [{ value: 'Valid Talent KR', actionPlans: [{ value: 'Valid Plan' }] }],
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('Key Resultは3文字以上');
        }
    });

    it('should fail if Action Plans are empty', () => {
        const result = formSchema.safeParse({
            objective: 'Valid Objective with sufficient length',
            technicalKRs: [{ value: 'Valid Tech KR', actionPlans: [] }], // Empty Action Plans
            softSkillsKRs: [{ value: 'Valid Soft KR', actionPlans: [{ value: 'Valid Plan' }] }],
            talentDevKRs: [{ value: 'Valid Talent KR', actionPlans: [{ value: 'Valid Plan' }] }],
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            // Accessing nested error might be complex, simplified check
            expect(JSON.stringify(result.error.issues)).toContain('少なくとも1つのアクションプランが必要です');
        }
    });
});
