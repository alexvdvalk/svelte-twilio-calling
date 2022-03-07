<script lang="ts">
  import { browser } from "$app/env";
  import type { Call, Device } from "@twilio/voice-sdk";
  import Heading from "$lib/components/Heading.svelte";
  import AudioPicker from "$lib/components/AudioPicker.svelte";
  import MakeCall from "$lib/components/MakeCall.svelte";
  import ColumnHeader from "$lib/components/ColumnHeader.svelte";
  import { onMount } from "svelte";
  import EventLog from "$lib/components/EventLog.svelte";
  import IncomingCall from "$lib/components/IncomingCall.svelte";
  import VolumeIndicator from "$lib/components/VolumeIndicator.svelte";

  import axios from "axios";

  let device: Device;
  let devices: MediaDeviceInfo[] = [];
  let ringDevices: MediaDeviceInfo[] = [];
  let speakerDevices: MediaDeviceInfo[] = [];
  let Twilio;
  let name;
  let token;
  let logText = "";
  let activeCall: Call;

  let loaded = false;

  $: ringDevices, updateSelectedDevices("ringtone");
  $: speakerDevices, updateSelectedDevices("speaker");

  const log = (e: string) => {
    logText += "> " + e + "\r";
  };

  if (browser) {
    onMount(async () => {
      await import("./twilio.min.js");
      Twilio = window["Twilio"];
      loaded = true;
    });
  }

  const getToken = async () => {
    let res = await axios.get("/token");
    name = res.data.identity;
    token = res.data.token;
    intitializeDevice();
    addListeners();
  };

  const intitializeDevice = async () => {
    device = new Twilio.Device(token, {
      logLevel: 1,
      codecPreferences: ["opus", "pcmu"],
    });
    device.register();
    log("Device Registered");
    await navigator.mediaDevices.getUserMedia({ audio: true });
    devices = [...device.audio.availableOutputDevices].map((item) => item[1]);
    log(`Got ${devices.length} devices.`);
    ringDevices = [devices[0]];
    speakerDevices = [devices[0]];
  };

  const addListeners = () => {
    // device.audio.on("deviceChange", updateAllAudioDevices.bind(device));
    device.audio.on("deviceChange", (e) => {
      // console.log("device Change", e);
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
      let selectedDevices = speakerDevices.map((i) => i.deviceId);
      await device.audio.speakerDevices.set(selectedDevices);
      log("Updated speaker device.");
      return;
    }
    if (type === "ringtone" && ringDevices.length > 0) {
      let selectedDevices = ringDevices.map((i) => i.deviceId);
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

    if (device) {
      log(`Attempting to call ${params.To} ...`);
      const call = await device.connect({ params });
      console.log("call", call);
      activeCall = call;
    } else {
      log("Unable to make call.");
    }
  }
  const handleIncomingCall = (call) => {
    console.log("incoming", call);
    log(`Incoming call from ${call.parameters.From}`);
    activeCall = call;
  };
</script>

{#if loaded}
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
    margin: 1rem;
    padding: 1rem;
  }
</style>
