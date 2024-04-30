// Инициализация карты
var map = L.map("map").setView([55.015428, 82.933249], 13);

// Добавление слоя с картами OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Массивы для хранения маркеров
var markers = [];
var targetMarkers = [];
var receivedMarkers = [];
var rangeCircle;

// Функция для добавления маркера на карту
function addMarker(lat, lng) {
  console.log("Новый маркер", lat, lng);
  console.log("Маркеры", markers);
  var marker = L.marker([lat, lng]).addTo(map);

  // Добавляем всплывающую подсказку с координатами маркера и кнопкой удаления
  marker
    .bindPopup(
      "<b>Координаты:</b> " +
        lat.toFixed(6) +
        ", " +
        lng.toFixed(6) +
        "<br>Маркер: " +
        (markers.length + 1) +
        "<br><button onclick='removeMarker(" +
        markers.length +
        ", markers)'>Удалить маркер</button>"
    )
    .openPopup();
  //   marker.index = markerList.length; // Присвоение индекса маркеру
  markers.push(marker);

  updateMarkerOptions(); // Обновляем список маркеров в выпадающих списках
}

// Обработчик для добавления маркера
document.getElementById("addMarker").addEventListener("click", function () {
  var coordinates = document.getElementById("coordinates").value.split(",");
  var lat = parseFloat(coordinates[0]);
  var lng = parseFloat(coordinates[1]);

  addMarker(lat, lng, markers);
});

// Обработчики для добавления маркеров цели и полученных координат
document
  .getElementById("addTargetMarker")
  .addEventListener("click", function () {
    var coordinates = document
      .getElementById("targetCoordinates")
      .value.split(",");
    var lat = parseFloat(coordinates[0]);
    var lng = parseFloat(coordinates[1]);

    addMarker(lat, lng, targetMarkers);
  });

document
  .getElementById("addReceivedMarker")
  .addEventListener("click", function () {
    var coordinates = document
      .getElementById("receivedCoordinates")
      .value.split(",");
    var lat = parseFloat(coordinates[0]);
    var lng = parseFloat(coordinates[1]);

    addMarker(lat, lng, receivedMarkers);
  });

// Функция для отрисовки диапазона
function drawRange(distance, lat, lng) {
  // Проверка на наличие диапазона перед его удалением
  if (rangeCircle && map.hasLayer(rangeCircle)) {
    map.removeLayer(rangeCircle);
  }

  // Создание нового круга
  rangeCircle = L.circle([lat, lng], {
    color: "blue",
    fillColor: "#00c3ff",
    fillOpacity: 0.25,
    radius: distance,
  }).addTo(map);
}

// Обработчик для отрисовки диапазона
document.getElementById("drawRange").addEventListener("click", function () {
  var distance = parseFloat(document.getElementById("distance").value);
  var coordinates = document.getElementById("coordinates").value.split(",");
  var lat = parseFloat(coordinates[0]);
  var lng = parseFloat(coordinates[1]);

  drawRange(distance, lat, lng);
});

// Функция для обновления списка маркеров в выпадающих списках
function updateMarkerOptions() {
  var marker1Select = document.getElementById("marker1");
  var marker2Select = document.getElementById("marker2");
  marker1Select.innerHTML = "";
  marker2Select.innerHTML = "";
  markers.forEach(function (marker, index) {
    var option1 = document.createElement("option");
    option1.value = index;
    option1.textContent = "Маркер " + (index + 1);
    marker1Select.appendChild(option1);

    var option2 = document.createElement("option");
    option2.value = index;
    option2.textContent = "Маркер " + (index + 1);
    marker2Select.appendChild(option2);
  });
}
// Функция для измерения расстояния между двумя маркерами
function measureDistance() {
  var marker1 = markers[document.getElementById("marker1").value];
  var marker2 = markers[document.getElementById("marker2").value];
  var distance = marker1.getLatLng().distanceTo(marker2.getLatLng());
  document.getElementById("length").textContent = distance.toFixed(2) + " м";
}

// Обработчик событий для кнопки измерения расстояния
document
  .getElementById("measureDistance")
  .addEventListener("click", measureDistance);

// Функция для удаления маркера по индексу
function removeMarker(markerIndex, markerArray) {
  if (markerArray[markerIndex]) {
    map.removeLayer(markerArray[markerIndex]); // Удаляем маркер с карты
    markerArray.splice(markerIndex, 1); // Удаляем маркер из массива
    updateMarkerOptions(); // Обновляем список маркеров в выпадающих списках
  }
}

map.on("click", function (e) {
  var coord = e.latlng;
  var lat = coord.lat;
  var lng = coord.lng;
  // Добавление маркера на карту в точке клика
  var marker = new L.marker(e.latlng).addTo(map);
  marker.on("click", function (e) {
    e.target.remove(); // Удаление маркера при клике на него
  });
  marker
    .bindPopup("<b>Координаты:</b> " + lat.toFixed(6) + ", " + lng.toFixed(6))
    .openPopup();
});
