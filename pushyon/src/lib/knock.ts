import { Knock } from "@knocklabs/node";

const knockClient = new Knock(process.env.KNOCK_API_KEY);

export async function identifyUserInKnock(
  userId: string,
  email: string,
  name?: string
): Promise<void> {
  await knockClient.users.identify(userId, {
    email,
    name: name || email,
  });
}

export async function triggerKnockNotification(
  recipientIds: string[],
  data: Record<string, string>
): Promise<void> {
  const workflowKey = process.env.KNOCK_WORKFLOW_KEY || "test_mode";

  await knockClient.workflows.trigger(workflowKey, {
    recipients: recipientIds,
    data,
  });
}

export { knockClient };
