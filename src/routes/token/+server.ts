import identity from "$lib/identityCreater";
import * as twilio from "twilio";
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

export async function GET(data) {
  const config = import.meta.env;
  const accessToken = new AccessToken(
    config.VITE_TWILIO_ACCOUNT_SID as string,
    config.VITE_TWILIO_API_KEY as string,
    config.VITE_TWILIO_API_SECRET as string,
    {
      identity: identity,
      region: "us1",
    }
  );
  const grant = new VoiceGrant({
    outgoingApplicationSid: config.VITE_TWILIO_TWIML_APP_SID as string,
    incomingAllow: true,
    outgoingApplicationParams: {},
  });
  accessToken.addGrant(grant);

  return new Response(
    JSON.stringify({
      identity: identity,
      token: accessToken.toJwt(),
    })
  );
}
