// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
	// Create a map centered at a specific coordinate and zoom level
	const map = L.map("map").setView([51.505, -0.09], 13);

	// Add the base map layer (OpenStreetMap)
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
	}).addTo(map);

	// Add a marker to the map at a specific coordinate
	const marker = L.marker([51.5, -0.09]).addTo(map);

	function addMarkers(locations) {
		locations.forEach((loc) => {
			const marker = L.marker([loc.coordinates[1], loc.coordinates[0]]).addTo(map);
			marker
				.bindPopup(
					`<b>${loc.first_name}<br> ${loc.organization ? loc.organization.toUpperCase() : ""}`
				)
				.openPopup();
			marker.on("mouseover", () => {
				marker.openPopup();
			});
			marker.on("click", () => {
				onMarkerClick(loc.id); // Call onMarkerClick function with the marker ID
			});
		});
	}
	function onMarkerClick(id) {
		// Construct the URL based on the marker ID
		const url = `https://crm.devinteution.in/app/lead/${id}`;
		// Open the URL in a new tab/window
		window.open(url, "_blank");
	}

	// Add a popup to the marker
	marker.bindPopup("<b>Hello world!</b><br>This is a Leaflet map.").openPopup();
	frappe.call({
		method: "erpnext.www.near-me.index.get_locations",
		callback: function (r) {
			// console.log("223", r.message);
			// console.log(r);
			if (r.message) {
				addMarkers(r.message);
				// r.message.forEach(element => {
				//     console.log(element[0],element[1])
				//     element.forEach(cordinates => {
				//         map.setView([cordinates[0], cordinates[1]], 13);
				//         const marker = L.marker([r.message.latitude, r.message.longitude]).addTo(map);
				//     });

				//     marker.bindPopup(`<b>${r.message.title}</b><br>${r.message.description}`).openPopup();

				// });                // Set the map view to the custom location

				// Add a marker to the map at the custom location

				// Add a popup to the marker
			}
		},
	});
	var currentLocationCircle;
	
	function addCurrentLocationMarker(latitude, longitude, accuracy) {
		if (currentLocationCircle) {
			map.removeLayer(currentLocationCircle);
		}

		currentLocationCircle = L.circle([latitude, longitude], {
			color: "blue",
			fillColor: "blue",
			fillOpacity: 0.3,
			radius: accuracy ? accuracy : 10,
		}).addTo(map);

		// if (accuracy) {
		// 	currentLocationCircle.bindPopup("You are within  " + accuracy + " meters from this point").openPopup();
		// }

		return currentLocationCircle;
	}
	function calculateZoomLevel(accuracy) {
		
		const maxZoom = 18; 
		const minZoom = 1; 
		const zoomFactor = 200; 
		const zoomLevel = maxZoom - Math.log2(accuracy / zoomFactor);
		return Math.max(minZoom, Math.min(maxZoom, zoomLevel));
	}
	const currentLocationButton = L.easyButton("fa-crosshairs", currentLocator);

	currentLocationButton.addTo(map);
	function currentLocator() {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					const accuracy = position.coords.accuracy;
					addCurrentLocationMarker(latitude, longitude, accuracy);
					let zoom = calculateZoomLevel(accuracy);
					map.setView([latitude, longitude], zoom);
				},
				(error) => {
					console.error("Error getting current position:", error);
					alert("Error getting your location. Please enable location services.");
				}
			);
		} else {
			console.log("Geolocation is not supported by your browser");
			alert("Geolocation is not supported by your browser.");
		}
	}
	setTimeout(()=>{
		currentLocator();
	},1000)
	
	function searchLocation() {
        var input = document.getElementById("search-box");
        var search = input.value;
        console.log("search", search);
        frappe.call({
            method: "erpnext.www.near-me.index.search_location",
            args: {
                search_term: search,
            },
            callback: function (r) {
                console.log("223", r.message);
                // console.log(r);
                if (r.message) {
                    addMarkers(r.message);
                    // r.message.forEach(element => {
                    //     console.log(element[0],element[1])
                    //     element.forEach(cordinates => {
                    //         map.setView([cordinates[0], cordinates[1]], 13);
                    //         const marker = L.marker([r.message.latitude, r.message.longitude]).addTo(map);
                    //     });

                    //     marker.bindPopup(`<b>${r.message.title}</b><br>${r.message.description}`).openPopup();

                    // });                // Set the map view to the custom location

                    // Add a marker to the map at the custom location

                    // Add a popup to the marker
                }
            },
        });
    }
    document.getElementById("search-box").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            searchLocation();
        }
    });
});