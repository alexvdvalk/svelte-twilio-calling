import identity from "$lib/identityCreater";
import * as twilio from "twilio";
// import VoiceResponse from "twilio/lib/twiml/VoiceResponse";

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function GET(event) {
  console.log("event", event);
  const config = import.meta.env;
  const toNumberOrClientName = event.url.searchParams.get("To");
  const callerId = config.VITE_TWILIO_CALLER_ID as string;
  let twiml = new VoiceResponse();
  // If the request to the /voice endpoint is TO your Twilio Number,
  // then it is an incoming call towards your Twilio.Device.
  console.log("toNumberOrClientName", toNumberOrClientName);
  console.log("callerId", callerId);
  console.log("identity", identity);

  const dial = twiml.dial({ callerId });
  dial.number(toNumberOrClientName);

  console.log("res", twiml.toString());
  const resp = new Response(twiml.toString());
  resp.headers.set("Content-Type", "application/xml");
  return resp;

  if (toNumberOrClientName == callerId) {
    let dial = twiml.dial();

    const numbertoDial = identity;
    console.log("number to dial", numbertoDial);
    // This will connect the caller with your Twilio.Device/client
    dial.client(numbertoDial);
  } else if (event.url.searchParams.get("To")) {
    let dial = twiml.dial({ callerId });
    const attr = isAValidPhoneNumber(toNumberOrClientName)
      ? "number"
      : "client";
    dial[attr]({}, toNumberOrClientName);
  } else {
    twiml.say("Thanks for calling!");
  }
  console.log("twim", twiml.toString());

  return new Response(twiml.toString());
}

function isAValidPhoneNumber(number) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}
