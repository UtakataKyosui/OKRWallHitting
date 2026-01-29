import * as z from 'zod';

export const krSchema = z.object({
    value: z.string().min(3, { message: 'Key Resultは3文字以上で入力してください。' }),
    deadline: z.string().optional(),
    actionPlans: z.array(
        z.object({
            value: z.string().min(3, { message: 'アクションプランは3文字以上で入力してください。' }),
        })
    ).min(1, { message: '少なくとも1つのアクションプランが必要です。' }),
});

export const formSchema = z.object({
    objective: z.string().min(10, {
        message: 'Objectiveは10文字以上で入力してください。',
    }),
    technicalKRs: z.array(krSchema).min(1, { message: '技術力のOKRは少なくとも1つ必要です。' }),
    softSkillsKRs: z.array(krSchema).min(1, { message: 'ソフトスキルのOKRは少なくとも1つ必要です。' }),
    talentDevKRs: z.array(krSchema).min(1, { message: '人材育成のOKRは少なくとも1つ必要です。' }),
    performanceKRs: z.array(krSchema).min(1, { message: '業績目標のOKRは少なくとも1つ必要です。' }),
});

export type FormValues = z.infer<typeof formSchema>;
