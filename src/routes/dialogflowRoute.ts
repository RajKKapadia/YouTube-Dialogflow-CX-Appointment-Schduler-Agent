import { Router, Request, Response } from "express";
import { createDateRange, extractDataFromDialogflow, generateDialogflowResponse } from "../utils/utils";
import { createEvent, EventDetailsTypes } from "../utils/calendarService";

const router = Router();

const handleCreateEventWithoutNote = async (req: Request) => {
    try {
        /**
         * [1] extract the information from the request
         * [2] make sure to handle the note part
         * [3] create an event
         * [4] send back a response
         */
        const { parameters } = extractDataFromDialogflow(req.body);
        const { startDateTime, endDateTime } = createDateRange(parameters['date-time']);
        const eventDetails: EventDetailsTypes = {
            summary: `New appointment for ${parameters.name.name}`,
            description: `Here are the meeting details:
            Email: ${parameters.email}`,
            startDateTime,
            endDateTime
        }
        const eventData = await createEvent(eventDetails);
        console.log(eventData);
        const responseData = generateDialogflowResponse([
            'Thank you for calling in, your appointment has been scheduled, and someone from the team will contact you soon.',
            'Is there anything I can help you with?'
        ]);
        return responseData;
    } catch (error) {
        console.error('Error in create-event route:', error);
    }
};

const handleCreateEventWithNote = async (req: Request) => {
    try {
        /**
         * [1] extract the information from the request
         * [2] make sure to handle the note part
         * [3] create an event
         * [4] send back a response
         */
        const { parameters } = extractDataFromDialogflow(req.body);
        const { startDateTime, endDateTime } = createDateRange(parameters['date-time']);
        const eventDetails: EventDetailsTypes = {
            summary: `New appointment for ${parameters.name.name}`,
            description: `Here are the meeting details:
            Email: ${parameters.email}
            Note: ${parameters.note}`,
            startDateTime,
            endDateTime
        }
        const eventData = await createEvent(eventDetails);
        console.log(eventData);
        const responseData = generateDialogflowResponse([
            'Thank you for calling in, your appointment has been scheduled, and someone from the team will contact you soon.',
            'Is there anything I can help you with?'
        ]);
        return responseData;
    } catch (error) {
        console.error('Error in create-event route:', error);
    }
};

router.post('/webhook', async (req: Request, res: Response) => {
    console.log(JSON.stringify(req.body, null, 2));
    const tag = req.body.fulfillmentInfo.tag as string;
    let responseData = undefined;
    if (tag === 'setAppointmentWithoutNote') {
        responseData = await handleCreateEventWithoutNote(req);
    } else if (tag === 'setAppointmentWithNote') {
        responseData = await handleCreateEventWithNote(req);
    } else {
        responseData = generateDialogflowResponse([`No handler for the tag ${tag}.`]);
    }
    res.send(responseData);
});

export default router;
