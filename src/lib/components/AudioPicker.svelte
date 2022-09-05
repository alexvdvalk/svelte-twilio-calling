<script lang="ts">
  export let devices: MediaDeviceInfo[] = [];
  export let deviceType: "Ringtone Devices" | "Speaker Devices" =
    "Ringtone Devices";
  export let selectedDevices: MediaDeviceInfo[] = [];
</script>

{#if devices.length > 0}
  <div>
    <label for="deviceSelect">{deviceType}</label>

    <select
      name="devices"
      id="deviceSelect"
      multiple
      bind:value={selectedDevices}
    >
      {#each devices as device (device.deviceId)}
        <option value={device}>{device.label}</option>
      {/each}
    </select>
  </div>
{/if}

<style>
  div {
    text-align: center;
  }
  select {
    width: 100%;
    height: 60px;
    margin-bottom: 10px;
  }
</style>
