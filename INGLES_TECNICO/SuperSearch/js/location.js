/*
 * Location: where distances are measured from.
 *
 * SuperSearch has no real store directory yet, so store positions are demo
 * offsets around the shopper (see data.js). Sharing the device location does
 * not reveal real supermarkets: it only switches the origin label, and the UI
 * says that distances are still illustrative.
 *
 * Future integration point: replace getDistances() with a call to a real
 * store/maps provider that receives `origin`. The rest of the app only uses
 * the { storeId: km } map this module returns.
 */
(function (SuperSearch) {
  'use strict';

  const stores = SuperSearch.data.stores;

  // Coordinates live only in this variable while the tab is open.
  // They are never written to localStorage or sent anywhere.
  let origin = null;
  let state = { source: 'demo', status: 'idle', accuracyM: null };

  const errorStatus = { 1: 'denied', 2: 'unavailable', 3: 'timeout' };

  function getState() {
    return Object.assign({}, state);
  }

  function getDistances() {
    const distances = {};
    stores.forEach((store) => {
      const [east, north] = store.offsetKm;
      distances[store.id] = Math.round(Math.hypot(east, north) * 10) / 10;
    });
    return distances;
  }

  // Only called after the user presses "Use my location".
  function requestDeviceLocation(onChange) {
    if (!('geolocation' in navigator)) {
      state = { source: 'demo', status: 'unsupported', accuracyM: null };
      onChange();
      return;
    }
    if (!window.isSecureContext) {
      state = { source: 'demo', status: 'insecure', accuracyM: null };
      onChange();
      return;
    }

    state = { source: state.source, status: 'locating', accuracyM: state.accuracyM };
    onChange();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        origin = { lat: position.coords.latitude, lon: position.coords.longitude };
        state = { source: 'device', status: 'granted', accuracyM: Math.round(position.coords.accuracy) };
        onChange();
      },
      (error) => {
        origin = null;
        // Browsers refuse location for pages opened as local files, and the user cannot
        // allow it in settings there, so explain how to run the app on localhost instead.
        const status = error.code === 1 && window.location.protocol === 'file:' ? 'insecure' : errorStatus[error.code];
        state = { source: 'demo', status: status || 'unavailable', accuracyM: null };
        onChange();
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }

  function useDemoLocation() {
    origin = null;
    state = { source: 'demo', status: 'idle', accuracyM: null };
  }

  SuperSearch.location = {
    getState,
    getDistances,
    requestDeviceLocation,
    useDemoLocation
  };
})(window.SuperSearch);
