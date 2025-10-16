window.onload = render;

/**
 * @typedef {Object} Position
 * @property {number} latitude - Latitude coordinate.
 * @property {number} longitude - Longitude coordinate.
 */

/**
 * Returns the latitude and longitude coordinates of a user.
 * Promise is rejected if the user's browser does not support the Geolocation API.
 *
 * @returns {Promise<Position>}
 */
function getUserPosition() {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject("Browser does not support the Geolocation API");
    }

    navigator.geolocation.getCurrentPosition((position) => {
      resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  });
}

function render() {
  const scene = document.querySelector("a-scene");

  getUserPosition().then((position) => {
    const entity = document.createElement("a-entity");
    console.log(`Placing entity at latitude ${position.latitude} and longitude ${position.longitude}`);

    entity.setAttribute(
      "gps-entity-place",
      `latitude: ${position.latitude}; longitude: ${position.longitude};`,
    );
    entity.setAttribute("gltf-model", "assets/dragonite/scene.gltf");
    entity.setAttribute("rotation", "0 180 0");
    entity.setAttribute("animation-mixer", "");
    entity.setAttribute("scale", "0.5 0.5 0.5");

    entity.addEventListener("loaded", () => {
      window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
    });

    scene.appendChild(entity);
  });
}
