import { Twilio } from "twilio";

export const accountSid = "AC9111c97e2a2135c497d7591a405cfbb9";
export const APIKey = "SKd0b075f7b0df719d98a8b41334bdb099";
export const authToken = "rycZpGJM6erzSUQ4Z61D1G0pJZAVnD7L";
export const client = new Twilio(APIKey, authToken, {
  accountSid,
});
