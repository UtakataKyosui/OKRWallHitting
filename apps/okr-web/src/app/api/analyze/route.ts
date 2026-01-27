import { NextResponse } from 'next/server';
import { analyzeOKR } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { objective, technicalKRs, softSkillsKRs, talentDevKRs } = body;

        if (!objective) {
            return NextResponse.json({ error: 'Objective is required' }, { status: 400 });
        }

        const feedback = await analyzeOKR({
            objective,
            technicalKRs: technicalKRs || [],
            softSkillsKRs: softSkillsKRs || [],
            talentDevKRs: talentDevKRs || []
        });
        return NextResponse.json({ feedback });
    } catch (error) {
        console.error('Error analyzing OKR:', error);
        return NextResponse.json({ error: 'Failed to analyze OKR' }, { status: 500 });
    }
}
