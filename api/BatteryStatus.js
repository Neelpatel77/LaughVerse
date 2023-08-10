// BatteryStatus.js

// Check if the Battery Status API is supported
if ('getBattery' in navigator) {
    navigator.getBattery().then(function(battery) {
        // Update battery status when it changes
        function updateBatteryStatus() {
            const batteryStatus = document.getElementById("battery-status");
            batteryStatus.textContent = `Battery Level: ${Math.floor(battery.level * 100)}%`;
        }
        
        // Initial update
        updateBatteryStatus();
        
        // Update when the battery level changes
        battery.addEventListener('levelchange', updateBatteryStatus);
    });
} else {
    // The Battery Status API is not supported
    console.log("Battery Status API is not supported in this browser.");
}
