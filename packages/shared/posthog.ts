import { PostHog } from 'posthog-node';
import { v4 as uuidv4 } from 'uuid';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_dummy_key_for_build';

const client = new PostHog(posthogKey, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
});

export enum EVENT_TYPES {
    WORKFLOW_SUMMARY = 'workflow_summary',
}

export type PostHogEvent = {
    event: EVENT_TYPES;
    userId: string;
    properties: Record<string, any>;
};

const isEnabled = !!process.env.NEXT_PUBLIC_POSTHOG_KEY;

export const posthog = {
    capture: (event: PostHogEvent) => {
        if (!isEnabled) return;
        client.capture({
            distinctId: event?.userId || uuidv4(),
            event: event.event,
            properties: event.properties,
        });
    },
    flush: () => {
        if (!isEnabled) return;
        client.flush();
    },
};
