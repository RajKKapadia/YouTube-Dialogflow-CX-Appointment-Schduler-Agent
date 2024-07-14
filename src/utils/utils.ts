import fs from "fs";

import moment from 'moment-timezone';
import dotenv from "dotenv";

dotenv.config();

interface DialogflowMessage {
    text: {
        text: string[];
        redactedText: string[];
    };
    responseType: string;
    source: string;
};

interface DialogflowResponse {
    fulfillmentResponse: {
        messages: DialogflowMessage[];
    };
};

export const generateDialogflowResponse = (sampleTexts: string[]): DialogflowResponse => {
    const messages: DialogflowMessage[] = sampleTexts.map(text => ({
        text: {
            text: [text],
            redactedText: [text]
        },
        responseType: "ENTRY_PROMPT",
        source: "VIRTUAL_AGENT"
    }));
    return {
        fulfillmentResponse: {
            messages: messages
        }
    };
};

interface DialogflowResponseForFunction {
    sessionInfo: {
        parameters: Record<string, any>;
    };
    messages: any[];
    [key: string]: any;
}

interface ExtractedData {
    parameters: Record<string, any>;
    fulfillmentResponse: {
        messages: any[];
    };
}

export const extractDataFromDialogflow = (response: DialogflowResponseForFunction): ExtractedData => {
    const { parameters } = response.sessionInfo;
    const { messages } = response;
    return {
        parameters,
        fulfillmentResponse: {
            messages
        }
    };
};

interface DateTime {
    year: number;
    month: number;
    day: number;
    hours: number;
    minutes: number;
    seconds: number;
    nanos: number;
};

export const createDateRange = (dateTime: DateTime, timezone: string = 'UTC'): { startDateTime: string; endDateTime: string } => {
    const startDateTime = moment.tz([
        dateTime.year,
        dateTime.month - 1,
        dateTime.day,
        dateTime.hours,
        dateTime.minutes,
        dateTime.seconds
    ], timezone);
    const endDateTime = startDateTime.clone().add(1, 'hour');
    return {
        startDateTime: startDateTime.format(),
        endDateTime: endDateTime.format()
    };
};

export const loadEnvVariables = (envPath: string = '.env'): Record<string, string> => {
    if (!fs.existsSync(envPath)) {
        throw new Error(`.env file not found at ${envPath}`);
    }
    const result = dotenv.config({ path: envPath });
    if (result.error) {
        throw result.error;
    }
    const envVariables: Record<string, string> = {};
    for (const key in process.env) {
        if (Object.prototype.hasOwnProperty.call(process.env, key)) {
            envVariables[key] = process.env[key] || '';
        }
    }
    return envVariables;
};
