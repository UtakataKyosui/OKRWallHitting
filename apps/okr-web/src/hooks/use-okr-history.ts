import { useState, useEffect } from 'react';
import { FormValues } from '@/lib/schema';

export interface HistoryItem {
    id: string;
    date: string;
    inputs: FormValues;
    feedback: any;
}

const STORAGE_KEY = 'okr-history';

export function useOKRHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setHistory(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse history:', e);
            }
        }
    }, []);

    const saveHistory = (inputs: FormValues, feedback: any) => {
        const newItem: HistoryItem = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            inputs,
            feedback,
        };
        const newHistory = [newItem, ...history];
        setHistory(newHistory);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    const deleteItem = (id: string) => {
        const newHistory = history.filter(item => item.id !== id);
        setHistory(newHistory);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    }

    return { history, saveHistory, clearHistory, deleteItem };
}
