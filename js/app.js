//model
var City=[
  {
    name:'Hawa mahal',
    lat:26.9239,
    lng:75.8267,
    foursquareId:'4f1d22f8e4b044fd373c32bb'
  },
  {
    name:'World Trade Park',
    lat:26.8543,
    lng:75.8050,
    foursquareId:'4d6ad44e7e3eba7a10a7ee4c'
  }

];

//viewmodel
var viewmodel= function(){
  var defaultIcon = makeMarkerIcon('0091ff');
  var highlightedIcon = makeMarkerIcon('FFFF24');
  var Infowindow = new google.maps.InfoWindow();
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }
  var self=this;
  this.locations = [];
  for(i=0;i<City.length;i++)
  {    // Initially an empty array
  var marker = new google.maps.Marker({
   position:{
       lat:City[i].lat,
        lng:City[i].lng
      },
      icon: defaultIcon,
    map: map,
    title: City[i].name,
    rating: '',
    venue:City[i].foursquareId

  });
  this.locations.push(marker);

  // get rating for each marker
  this.locations.forEach(function(m) {
    $.ajax({
     method: 'GET',
     dataType:"json",
     url:"https://api.foursquare.com/v2/venues/"+ marker.venue +"?client_id=2JYEJY5E54SCTS2TJRILIIVLFPXCLQFXF0MPWI2YS2UQCJY3&client_secret=TH4C4MYFH44B2V02JS3YZEXYTKND5IEI4CTX0U51UT4JTKZ4&v=20170303",
     success:function(data) {
        var venue = data.response.venue;
        if (venue.hasOwnProperty('rating')) {
          m.rating = venue.rating;
        }
        else {
          m.rating = '';
        }
     },
     error: function(e) {
        console.log('Ratings not available for this location!');
     }
   });

  });


  marker.addListener('mouseover',function(){
    this.setIcon(highlightedIcon)
  });
  marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
  });
  marker.addListener('click',function(){
    openInfoWindow(this,Infowindow);
  });
}

function openInfoWindow(marker,infowindow)
{
  if (infowindow.marker != marker) {

    infowindow.marker = marker;

    infowindow.setContent('<div>' + marker.title + '<br>' + marker.rating + '</div>');

    infowindow.open(map, marker);

    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
      });
  }
}

};
