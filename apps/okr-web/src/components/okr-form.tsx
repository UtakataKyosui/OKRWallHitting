'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { submitOKR } from '@/app/actions';
import { Loader2, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { formSchema, type FormValues } from '@/lib/schema';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOKRHistory, HistoryItem } from '@/hooks/use-okr-history';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export function OKRInputForm() {
    const [feedback, setFeedback] = useState<any | null>(null);
    const { history, saveHistory, deleteItem } = useOKRHistory();
    const [activeTab, setActiveTab] = useState('new');

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            objective: '',
            performanceKRs: [
                { value: '', deadline: '', actionPlans: [{ value: '' }] },
                { value: '', deadline: '', actionPlans: [{ value: '' }] }
            ],
            technicalKRs: [
                { value: '', deadline: '', actionPlans: [{ value: '' }] },
                { value: '', deadline: '', actionPlans: [{ value: '' }] }
            ],
            softSkillsKRs: [
                { value: '', deadline: '', actionPlans: [{ value: '' }] },
                { value: '', deadline: '', actionPlans: [{ value: '' }] }
            ],
            talentDevKRs: [
                { value: '', deadline: '', actionPlans: [{ value: '' }] },
                { value: '', deadline: '', actionPlans: [{ value: '' }] }
            ],
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: FormValues) => {
            return await submitOKR(values);
        },
        onSuccess: (data, variables) => {
            setFeedback(data);
            saveHistory(variables, data);
        },
        onError: (error) => {
            console.error('Error:', error);
        }
    });

    function onSubmit(values: FormValues) {
        setFeedback(null);
        mutation.mutate(values);
    }

    const loadFromHistory = (item: HistoryItem) => {
        form.reset(item.inputs);
        setFeedback(item.feedback);
        setActiveTab('new');
    };

    return (
        <div className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="new">新規作成</TabsTrigger>
                    <TabsTrigger value="history">履歴 ({history.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="new">
                    <div className="space-y-8 mt-6">
                        <Card className="w-full max-w-[1400px] mx-auto">
                            <CardHeader>
                                <CardTitle>エンジニアリングOKRの作成</CardTitle>
                                <CardDescription>
                                    エンジニアリング成長の3つの柱（技術力、ソフトスキル、人材育成）に基づいて目標を入力してください。
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="objective"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-lg font-bold">Objective (目標)</FormLabel>
                                                    <FormControl>
                                                        <AutosizeTextarea
                                                            placeholder="例: プロダクトとチームの成長を牽引するテックリードになる"
                                                            className="resize-none"
                                                            minRows={2}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Carousel className="w-full max-w-4xl mx-auto">
                                            <CarouselContent>
                                                <CarouselItem>
                                                    <div className="p-1">
                                                        <KeyResultSection
                                                            control={form.control}
                                                            name="performanceKRs"
                                                            label="業績目標 (Business Performance)"
                                                            description="売上貢献、コスト削減、プロジェクトの成功など"
                                                            colorClass="border-l-blue-500"
                                                            feedback={feedback && typeof feedback !== 'string' ? feedback.performance : undefined}
                                                        />
                                                    </div>
                                                </CarouselItem>
                                                <CarouselItem>
                                                    <div className="p-1">
                                                        <KeyResultSection
                                                            control={form.control}
                                                            name="technicalKRs"
                                                            label="技術力 (Technical Skills)"
                                                            description="AI活用、コーディング速度・品質、アーキテクチャ設計など"
                                                            colorClass="border-l-purple-500"
                                                            feedback={feedback && typeof feedback !== 'string' ? feedback.technical : undefined}
                                                        />
                                                    </div>
                                                </CarouselItem>
                                                <CarouselItem>
                                                    <div className="p-1">
                                                        <KeyResultSection
                                                            control={form.control}
                                                            name="softSkillsKRs"
                                                            label="ソフトスキル (Soft Skills)"
                                                            description="コミュニケーション、交渉力、リーダーシップなど"
                                                            colorClass="border-l-pink-500"
                                                            feedback={feedback && typeof feedback !== 'string' ? feedback.softSkills : undefined}
                                                        />
                                                    </div>
                                                </CarouselItem>
                                                <CarouselItem>
                                                    <div className="p-1">
                                                        <KeyResultSection
                                                            control={form.control}
                                                            name="talentDevKRs"
                                                            label="人材育成 (Talent Development)"
                                                            description="メンタリング、採用、技術ブログ執筆、勉強会主催など"
                                                            colorClass="border-l-orange-500"
                                                            feedback={feedback && typeof feedback !== 'string' ? feedback.talentDevelopment : undefined}
                                                        />
                                                    </div>
                                                </CarouselItem>
                                            </CarouselContent>
                                            <CarouselPrevious />
                                            <CarouselNext />
                                        </Carousel>

                                        <Button type="submit" disabled={mutation.isPending} className="w-full">
                                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            OKRを分析する
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>

                        {feedback && (
                            <div className="space-y-4">
                                <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                                    <AlertTitle className="text-blue-700 dark:text-blue-300 font-bold">全体フィードバック</AlertTitle>
                                    <AlertDescription className="whitespace-pre-wrap text-foreground">
                                        {typeof feedback === 'string' ? feedback : feedback.general}
                                    </AlertDescription>
                                </Alert>

                                {typeof feedback !== 'string' && (
                                    <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
                                        <AlertTitle className="text-green-700 dark:text-green-300 font-bold mb-2">改善後のOKR案</AlertTitle>
                                        <AlertDescription className="whitespace-pre-wrap text-foreground font-mono text-sm">
                                            <RenderRevisedOKR content={feedback.revisedOKR} />
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="history">
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>過去のOKR分析履歴</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[600px] w-full pr-4">
                                {history.length === 0 ? (
                                    <p className="text-center text-muted-foreground p-8">履歴はありません</p>
                                ) : (
                                    <div className="space-y-4">
                                        {history.map((item) => (
                                            <div key={item.id} className="border rounded-lg p-4 space-y-2 bg-card relative group">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-sm text-muted-foreground">
                                                            {format(new Date(item.date), 'yyyy/MM/dd HH:mm', { locale: ja })}
                                                        </p>
                                                        <p className="font-semibold mt-1">{item.inputs.objective}</p>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Button variant="outline" size="sm" onClick={() => loadFromHistory(item)}>
                                                            この内容で再開
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteItem(item.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                                    <div>
                                                        <p className="font-bold mb-1">フィードバック要約:</p>
                                                        <p className="line-clamp-3 text-muted-foreground">
                                                            {typeof item.feedback === 'string' ? item.feedback : item.feedback.general}
                                                        </p>
                                                    </div>
                                                    {typeof item.feedback !== 'string' && (
                                                        <div>
                                                            <p className="font-bold mb-1">改善案:</p>
                                                            <div className="line-clamp-3 text-muted-foreground font-mono">
                                                                <RenderRevisedOKR content={item.feedback.revisedOKR} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function KeyResultSection({ control, name, label, description, colorClass, feedback }: { control: any, name: string, label: string, description: string, colorClass: string, feedback?: string }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: name,
    });

    return (
        <div className={`space-y-4 border-l-4 pl-4 ${colorClass}`}>
            <div className="flex items-center justify-between">
                <div>
                    <FormLabel className="text-base font-semibold">{label}</FormLabel>
                    <FormDescription>{description}</FormDescription>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ value: '', actionPlans: [{ value: '' }] })}
                    className="h-8"
                >
                    <Plus className="mr-2 h-4 w-4" /> KRを追加
                </Button>
            </div>
            {/* Show root error for the array (e.g. min(1) error) */}
            {/* Note: In react-hook-form/zod, errors.technicalKRs might be an array or an object with root errors depending on version/structure. 
                With simple array validation, it often puts the error on the field name property. 
                However, for field arrays, access is slightly tricky. We can check formState.errors[name]?.root?.message or similar.
            */}

            {fields.map((field, index) => (
                <Card key={field.id} className="bg-card/50">
                    <CardHeader className="pb-2">
                        <div className="flex items-start gap-2">
                            <div className="flex-1">
                                <FormField
                                    control={control}
                                    name={`${name}.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Key Result</FormLabel>
                                            <FormControl>
                                                <AutosizeTextarea
                                                    placeholder={`${label} Key Result ${index + 1}`}
                                                    minRows={1}
                                                    className="text-base font-medium"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-40 shrink-0">
                                <FormField
                                    control={control}
                                    name={`${name}.${index}.deadline`}
                                    render={({ field: dateField }) => (
                                        <FormItem>
                                            <FormLabel>期限</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...dateField}
                                                    value={dateField.value || ''}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') e.preventDefault();
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {fields.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ActionPlanList nestName={`${name}.${index}.actionPlans`} control={control} />
                    </CardContent>
                </Card>
            ))}
            <FormField
                control={control}
                name={name}
                render={() => <FormMessage />}
            />

            {feedback && (
                <Alert className="mt-4 border-blue-200 bg-blue-50 dark:bg-blue-900/10">
                    <AlertTitle className="text-sm font-bold text-blue-700 dark:text-blue-300">
                        {label}へのフィードバック
                    </AlertTitle>
                    <AlertDescription className="text-sm text-foreground whitespace-pre-wrap">
                        {feedback}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}

function RenderRevisedOKR({ content }: { content: any }) {
    if (!content) return null;
    if (typeof content === 'string') {
        return <>{content}</>;
    }
    if (typeof content === 'object') {
        return (
            <div className="space-y-2 text-left">
                {content.objective && (
                    <div className="font-semibold">Objective: {content.objective}</div>
                )}
                {content.keyResults && Array.isArray(content.keyResults) && (
                    <ul className="list-disc pl-5 space-y-1">
                        {content.keyResults.map((kr: any, i: number) => (
                            <li key={i}>
                                {typeof kr === 'string' ? kr : (kr.value || JSON.stringify(kr))}
                                {kr.deadline && <span className="text-xs text-muted-foreground ml-2">(Due: {kr.deadline})</span>}
                            </li>
                        ))}
                    </ul>
                )}
                {!content.objective && !content.keyResults && (
                    <pre className="whitespace-pre-wrap font-mono text-xs">
                        {JSON.stringify(content, null, 2)}
                    </pre>
                )}
            </div>
        );
    }
    return null;
}

function ActionPlanList({ nestName, control }: { nestName: string; control: any }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: nestName,
    });

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">アクションプラン</FormLabel>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 text-xs px-2"
                    onClick={() => append({ value: '' })}
                >
                    <Plus className="mr-1 h-3 w-3" /> 追加
                </Button>
            </div>
            {fields.map((item, k) => (
                <FormField
                    key={item.id}
                    control={control}
                    name={`${nestName}.${k}.value`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="flex items-center space-x-2">
                                    <AutosizeTextarea
                                        placeholder="アクションプランを入力..."
                                        className="text-sm min-h-[32px] py-1"
                                        minRows={1}
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive self-start mt-1"
                                        onClick={() => remove(k)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            ))}
            <FormField
                control={control}
                name={nestName}
                render={() => <FormMessage />}
            />
        </div>
    );
}
