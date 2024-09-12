import { ConversationHistory } from '../global/types.js';
export declare function truncateCenterString(fullStr: string, strLen: number, separator?: string): string;
export declare function cleanString(text: string): string;
export declare function stringFormat(template: string, ...args: any[]): string;
export declare function historyToString(history: ConversationHistory[]): string;
export declare function toTitleCase(str: string): string;
