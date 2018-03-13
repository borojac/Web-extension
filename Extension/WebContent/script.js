url = "http://freegeoip.net/json/";

function _myMap(lat, lng) {

	var mapOptions = {
		center : new google.maps.LatLng(lat, lng),
		zoom : 10,
		mapTypeId : google.maps.MapTypeId.HYBRID
	}
	var map = new google.maps.Map(document.getElementById("map"), mapOptions);

	var myLatLng = {
		lat : lat,
		lng : lng
	};

	var marker = new google.maps.Marker({
		position : myLatLng,
		map : map
	});
}

function show() {
	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function(arrayOfTabs) {
		var activeTab = arrayOfTabs[0];
		renderInformation(url + url_domain(activeTab.url));
	});
}
function renderInformation(urll) {
	var lat;
	var lng;
	req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.status == 200 && req.readyState == 4) {
			resp = JSON.parse(req.responseText);

			ip = resp.ip;
			country = resp.country_name;
			city = resp.city;
			time_zone = resp.time_zone;
			lat = resp.latitude;
			lng = resp.longitude;

			preTR = "<tr>";
			preTD = "<td>";
			postTR = "</tr>";
			postTD = "</td>";
			_preTD = "<td class=\"secondColumn\">";
			noResults = "NEMA REZULTATA";

			forRender = "";
			forRender += preTR;
			forRender += preTD;
			forRender += "IP: ";
			forRender += postTD;
			forRender += _preTD;
			forRender += ip == "" ? noResults : ip;
			forRender += postTD;
			forRender += postTR;

			forRender += preTR;
			forRender += preTD;
			forRender += "Zemlja: ";
			forRender += postTD;
			forRender += _preTD;
			forRender += country == "" ? noResults : country;
			forRender += postTD;
			forRender += postTR;

			forRender += preTR;
			forRender += preTD;
			forRender += "Grad: ";
			forRender += postTD;
			forRender += _preTD;
			forRender += city == "" ? noResults : city;
			forRender += postTD;
			forRender += postTR;

			forRender += preTR;
			forRender += preTD;
			forRender += "Vremenska zona: ";
			forRender += postTD;
			forRender += _preTD;
			forRender += time_zone == "" ? noResults : time_zone;
			forRender += postTD;
			forRender += postTR;

			document.getElementById("tableInfo").innerHTML = forRender;

		} else if (req.status == 404) {
			renderInformation(url);
			return;
		}

		_myMap(lat, lng);
	}

	req.open("GET", urll, true);
	req.send(null);

}

function url_domain(data) {
	var a = document.createElement('a');
	a.href = data;
	return a.hostname;
}

document.addEventListener('DOMContentLoaded', function() {
	show();
});