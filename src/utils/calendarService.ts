import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { loadEnvVariables } from './utils';

export type CredentialsTypes = {
    type: string
    project_id: string
    private_key_id: string
    private_key: string
    client_email: string
    client_id: string
    auth_uri: string
    token_uri: string
    auth_provider_x509_cert_url: string
    client_x509_cert_url: string
    universe_domain: string
};

export type EventDetailsTypes = {
    summary: string
    description: string
    startDateTime: string
    endDateTime: string
};

const envVariables = loadEnvVariables()

const serviceAccount: CredentialsTypes = JSON.parse(envVariables.CREDENTIALS);
const calendarId: string = envVariables.CALENDAR_ID;

const auth = new JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

export const createEvent = async (eventDetails: EventDetailsTypes) => {
    const { summary, description, startDateTime, endDateTime } = eventDetails;
    const event = {
        summary,
        description,
        start: {
            dateTime: startDateTime,
            timeZone: 'America/New_York',
        },
        end: {
            dateTime: endDateTime,
            timeZone: 'America/New_York',
        },
    };
    try {
        const response = await calendar.events.insert({
            calendarId,
            requestBody: event,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating event: ', error);
        throw error;
    }
};
