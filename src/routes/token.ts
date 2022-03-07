import identity from "$lib/identityCreater";
import twilio from "twilio";
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

export async function get(data) {
  const config = import.meta.env;

  const accessToken = new AccessToken(
    config.VITE_TWILIO_ACCOUNT_SID as string,
    config.VITE_TWILIO_API_KEY as string,
    config.VITE_TWILIO_API_SECRET as string
  );
  accessToken.identity = identity;
  const grant = new VoiceGrant({
    outgoingApplicationSid: config.VITE_TWILIO_TWIML_APP_SID as string,
    incomingAllow: true,
  });
  accessToken.addGrant(grant);

  return {
    body: {
      identity: identity,
      token: accessToken.toJwt(),
    },
  };
}
