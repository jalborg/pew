

      var map;

  var contentArray = [];
  var markerArray = [];
  var infowindow ;

  function initialize() {


    map = new google.maps.Map(document.getElementById('map_canvas'), {
      mapTypeId: google.maps.MapTypeId.BASE,
      zoom: 2,
      center: new google.maps.LatLng(10.8919300,8.5113300),
    });

    var styles = [
  {
    stylers: [
      { hue: "#2e2f33" },
      { saturation: -20 }
    ]
  },{
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { lightness: 50},
      { visibility: "simplified" }
    ]
  },{
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { visibility: "off" }
    ]
  }
];
map.setOptions({ minZoom: 1, maxZoom: 10 });
map.setOptions({styles: styles});
    infowindow = new google.maps.InfoWindow({
        maxWidth: 200,
        content: ''
    });
    
    var script = document.createElement('script');
    script.src = 'https://api.instagram.com/v1/tags/pewdiepiefanart/media/recent?client_id=0c97bcab30b34cee924151bea77b3cd1&callback=callbackFunction';
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  // This counter keeps track on how many times callBackFunction has been run.
  var counter = 0;
  // Loop through the results array and place a marker for each
  // set of coordinates.
  function callbackFunction(photos) {
    for (var i = 0; i < photos.data.length; i++) {
        var object = photos.data[i];
        if (object.location !== null) {
            var lat = object.location.latitude;
            var lon = object.location.longitude;
            var image = {
              url: object.images.thumbnail.url,
              origin: new google.maps.Point(0,0),
              anchor: new google.maps.Point(0,32),
              scaledSize: new google.maps.Size(45, 45)
            };
            var latLng = new google.maps.LatLng(lat ,lon );
            var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              icon : image,
              title: "click to view more"
            });
            console.log(object.link);
            console.log (object.tags);
            console.log(object);
            console.log(latLng);

            // push the data to an array.  push the marker-object to an array. 
            // contentArray & markerArray will have the same index, that makes it easy
            contentArray.push('<div id="infobox">'+ '<img src= '+object.images.thumbnail.url  + '>' + '</div>' +
                              '<div id= "link">' +' <a href = ' + object.link+'> See it on Instagram </a>'+'</div>'
                              //'<div id= "printtags">' + '<p>'+object.tags+'</p>' + '</div>'
                              );
            markerArray.push(marker);

            google.maps.event.addListener(marker, 'click', function() {         
              // determin the index.
              var index = markerArray.indexOf(this);
              var content = contentArray[index];
              infowindow.setContent(content);
              infowindow.setPosition(markerArray[index].getPosition());
              infowindow.open(map, this);
            });
        }
    }
    // If the counter is less than 5 and photos.pagination.next_url has a value then...
    if(counter < 60 && photos.pagination.next_url && photos.pagination.next_url != '') {
      //... increase the counter
      counter++;
      console.log('COUNTER: ', counter)
      //... run the "callbackFunction" for the next page url.
      var script = document.createElement('script');
      script.src = photos.pagination.next_url;
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  }
  google.maps.event.addDomListener(window, 'load', initialize);
