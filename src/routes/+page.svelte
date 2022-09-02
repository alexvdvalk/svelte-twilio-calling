<script lang="ts">
  import Heading from "$lib/components/Heading.svelte";
  import AudioPicker from "$lib/components/AudioPicker.svelte";
  import MakeCall from "$lib/components/MakeCall.svelte";
  import ColumnHeader from "$lib/components/ColumnHeader.svelte";
  import EventLog from "$lib/components/EventLog.svelte";
  import IncomingCall from "$lib/components/IncomingCall.svelte";
  import VolumeIndicator from "$lib/components/VolumeIndicator.svelte";

  import axios from "axios";
  import { Call, Device } from "@twilio/voice-sdk";
  import { browser } from "$app/environment";

  let device: Device;
  let devices: MediaDeviceInfo[] = [];
  let ringDevices: MediaDeviceInfo[] = [];
  let speakerDevices: MediaDeviceInfo[] = [];
  let name;
  let token;
  let logText = "";
  let activeCall: Call;

  $: ringDevices, updateSelectedDevices("ringtone");
  $: speakerDevices, updateSelectedDevices("speaker");

  const log = (e: string) => {
    logText += "> " + e + "\r";
  };

  const getToken = async () => {
    const res = await axios.get("/token");
    name = res.data.identity;
    token = res.data.token;
    await intitializeDevice();
    addListeners();
  };

  const intitializeDevice = async () => {
    await import("@twilio/voice-sdk/dist/twilio");
    const Device = window["Twilio"].Device;
    console.log("ddd", Device);
    device = new Device(token, {
      logLevel: 1,
      codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
    });

    await device.register();
    log("Device Registered");
    await navigator.mediaDevices.getUserMedia({ audio: true });
    devices = [...device.audio.availableOutputDevices].map((item) => item[1]);
    log(`Got ${devices.length} devices.`);
    ringDevices = [devices[0]];
    speakerDevices = [devices[0]];
  };

  const addListeners = () => {
    device.on("tokenWillExpire", () => {
      //     const token = getNewTokenViaAjax(); call API to get new token
      console.log("twilio token expired");
      //device.updateToken(token);
    });

    device.audio.on("deviceChange", (e) => {
      console.log("device change", e);
    });

    device.on("registered", function () {
      log("Twilio.Device Ready to make and receive calls!");
    });

    device.on("error", function (error) {
      log("Twilio.Device Error: " + error.message);
    });

    device.on("incoming", handleIncomingCall);
  };

  const updateSelectedDevices = async (type: "speaker" | "ringtone") => {
    if (!device || !browser) return;
    if (type === "speaker" && speakerDevices.length > 0) {
      const selectedDevices = speakerDevices.map((i) => i.deviceId);
      await device.audio.speakerDevices.set(selectedDevices);
      log("Updated speaker device.");
      return;
    }
    if (type === "ringtone" && ringDevices.length > 0) {
      const selectedDevices = ringDevices.map((i) => i.deviceId);
      await device.audio.ringtoneDevices.set(selectedDevices);
      log("Updated ringtone device.");
      return;
    }
  };

  async function makeOutgoingCall(e) {
    var params = {
      // get the phone number to call from the DOM
      To: e.detail,
      user: name,
    };

    try {
      log(`Attempting to call ${params.To} ...`);
      console.log("device", device);
      console.log("params", params);
      const call = await device.connect({ params });
      console.log("call", call);
      activeCall = call;
    } catch (err) {
      log("Unable to make call.");
      console.log("err", err);
    }
  }
  const handleIncomingCall = (call) => {
    console.log("incoming", call);
    log(`Incoming call from ${call.parameters.From}`);
    activeCall = call;
  };
</script>

<Heading on:click={getToken} />
{#if device}
  <section>
    <div class="row">
      <div class="col-lg-4 col-sm-12">
        <ColumnHeader>Your Device Info</ColumnHeader>
        {#if name}
          <p>Your client Name: {name}</p>
        {/if}
        <AudioPicker
          {devices}
          deviceType="Ringtone Devices"
          bind:selectedDevices={ringDevices}
        />
        <AudioPicker
          {devices}
          deviceType="Speaker Devices"
          bind:selectedDevices={speakerDevices}
        />
      </div>
      <div class="col-lg-4 col-sm-12">
        <MakeCall on:dial={makeOutgoingCall} />
        <IncomingCall bind:incomingCall={activeCall} {log} />
        <VolumeIndicator bind:call={activeCall} />
      </div>
      <div class="col-lg-4 col-sm-12">
        <EventLog {logText} />
      </div>
    </div>
  </section>
{/if}

<section class="debug">
  <ul>
    <li>Active Call: {activeCall}</li>
    <li>Device: {device}</li>
    <li>User: {name}</li>
    <li>Token: {token}</li>
  </ul>
</section>

<style>
  div {
    text-align: center;
  }
  .debug {
    border: 1px solid black;
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
  }
</style>
