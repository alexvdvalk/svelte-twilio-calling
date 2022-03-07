import identity from "$lib/identityCreater";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";

export async function get(event) {
  console.log(event);
  const config = import.meta.env;
  const toNumberOrClientName = event.url.searchParams.get("To");
  const callerId = config.VITE_TWILIO_CALLER_ID as string;
  let twiml = new VoiceResponse();
  // If the request to the /voice endpoint is TO your Twilio Number,
  // then it is an incoming call towards your Twilio.Device.
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
  return {
    body: twiml.toString(),
    headers: {
      "Content-type": "application/xml",
    },
  };
}

function isAValidPhoneNumber(number) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}
