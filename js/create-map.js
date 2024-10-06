function createMap() {
  const map = L.map("map").setView([51.505, -0.09], 13);
  const markers = new Map();

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const getIcon = (index) => {
    const colors = [
      "green",
      "red",
      "blue",
      "gold",
      "red",
      "yellow",
      "violet",
      "black",
      "grey",
    ];
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${
        colors[index % colors.length]
      }.png`,
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  function addMarker(lat, lon, tagsList = []) {
    const cleanTagsList = tagsList
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const marker = L.marker([lat, lon], {
      icon: getIcon(cleanTagsList?.[0]?.charCodeAt(0) ?? 0),
    });

    ["all", ...cleanTagsList].forEach((tag) =>
      markers.set(tag, [...(markers.get(tag) ?? []), marker])
    );

    updateSelect();
  }

  function geoCode(adr, tags = "", max = 1) {
    if (!adr) return;

    const tagsList = tags
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const url = new URL("https://nominatim.openstreetmap.org/search.php");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("q", adr);

    fetch(url)
      .then((r) => r.json())
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          res
            .slice(0, max)
            .forEach(({ lat, lon }) => addMarker(lat, lon, tagsList));
        }
      })
      .catch(console.error);
  }

  function updateSelect() {
    const sel = document.getElementById("sel");
    sel.options.length = 0;

    const add = (m) => {
      var opt = document.createElement("option");
      opt.value = m;
      opt.innerHTML = `${m[0].toUpperCase()}${m.slice(1)}`;
      sel.appendChild(opt);
    };

    for (const m of markers.keys()) {
      add(m);
    }

    displayMarkers(["all"]);
  }

  function displayMarkers(tags = []) {
    (markers.get("all") ?? []).forEach((m) => m.remove());
    tags.forEach((tag) => {
      (markers.get(tag) ?? []).forEach((m) => {
        m.addTo(map);
      });
    });
  }

  function onSelectChange(selectObj) {
    var idx = selectObj.selectedIndex;

    // get the value of the selected option
    var selectedValue = selectObj.options[idx].value;
    displayMarkers([selectedValue]);
  }

  return {
    map,
    geoCode,
    onSelectChange,
    displayMarkers,
    addMarker,
  };
}
