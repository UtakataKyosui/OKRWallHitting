'use server';

import { analyzeOKR } from '@/lib/ai';
import { type FormValues } from '@/lib/schema';

export async function submitOKR(values: FormValues) {
    if (!values.objective) {
        throw new Error('Objective is required');
    }

    // Helper to map KRs from FormValues (actionPlans as objects) to OKRInputs (actionPlans as strings)
    const mapKRs = (krs: any[]) => krs.map(kr => ({
        value: kr.value,
        deadline: kr.deadline,
        // Extract string values from actionPlans array of objects { value: string }
        actionPlans: kr.actionPlans?.map((ap: any) => ap.value) || []
    }));

    try {
        const feedback = await analyzeOKR({
            objective: values.objective,
            performanceKRs: mapKRs(values.performanceKRs),
            technicalKRs: mapKRs(values.technicalKRs),
            softSkillsKRs: mapKRs(values.softSkillsKRs),
            talentDevKRs: mapKRs(values.talentDevKRs),
        });

        return feedback;
    } catch (error) {
        console.error('Server Action Error:', error);
        throw new Error('Failed to analyze OKR');
    }
}
