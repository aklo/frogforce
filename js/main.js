//app.initialize();

var domain = 'http://localhost/mobile_frogforce/process/';
var domain = 'http://frogforce.com/mobile_frogforce/process/';

function init() 
{
	document.addEventListener("deviceready", deviceReady, true);
	delete init;
}

function loadMenu()
{
	$('.toggle-menu').click(function(){
		if ($('.menu-nav').hasClass('hide')) {
			$('.menu-nav').removeClass('hide');
			$('.menu-nav').addClass('show');
		} else if ($('.menu-nav').hasClass('show')) {
			$('.menu-nav').removeClass('show');	
			$('.menu-nav').addClass('hide');
		}
		return false;
	});	

	$('.toggle-settings').click(function(){
		if ($('.settings-nav').hasClass('hide')) {
			$('.settings-nav').removeClass('hide');
			$('.settings-nav').addClass('show');
		} else if ($('.settings-nav').hasClass('show')) {
			$('.settings-nav').removeClass('show');	
			$('.settings-nav').addClass('hide');
		}
		return false;				
	});
	
	$('.logout').click(function(){
		localStorage.clear();
		var url = 'http://frogforce.com/mobile_frogforce/www/index.html';
		/*
		$.mobile.changePage("http://frogforce.com/mobile_frogforce/www/index.html", {
			allowSamePageTransition: true,
			transition: 'none',
			reloadPage: true
		});
		*/
		window.location = url;
		return false;
	});
}

function bindInfoWindow(marker, map, html) 
{
	var infoWindow =  new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
} 

function initializeMap() 
{        
	$.getJSON (domain + 'main.php?callback=?', { 
		request			: 'frogforce',
		requestDetails	: 'getMapTraffic',
		user_id 		: window.localStorage["user_id"],
	}, function(data){
		if (data.status == 'success') {
			var array = data.data;
			var length = array.length;
			var	element = null;
			var contentString;
			var marker;
			var ip_address;
			var totalvisits;
			var dates_visited;
			var latitude;
			var longitude;
			
			var myOptions = {
				center: new google.maps.LatLng(data.business_location.business_latitude, data.business_location.business_longitude),
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(data.business_location.business_latitude, data.business_location.business_longitude),
				map: map,
				title: 'Drag to locate',
				draggable: true,
				icon: 'img/marker_business.png',			
			});
			
			for (var x = 0; x < length; x++) {
				element 		= array[x];
				ip_address		= element['ip_address'];
				totalvisits		= element['totalvisits'];
				dates_visited	= element['dates_visited'];
				latitude		= element['latitude'];
				longitude		= element['longitude'];
				
				marker = new google.maps.Marker({
					position	: new google.maps.LatLng(latitude, longitude),
					map			: map,
					title		: "",
					icon		: 'img/marker_visits.png',
				}); 
				
				date_visited = dates_visited.split("%");
				date_num = date_visited.length;
			
				var dates = '';	
				for (var y = 0; y < date_num; y++) {
					dates += "<span>" + date_visited[y] + "</span>";
				}
				
				contentString = "<div class='infoWindow'>"
							  + "  <div class='infoRow'>"
							  + "    <p>IP Address</p>"
							  + "    <span>" + ip_address + "</span>"
							  + "  </div>"	
							  + "  <div class='infoRow'>"
							  + "    <p>Total Page Views</p>"
							  + "    <span>" + totalvisits + "</span>"
							  + "  </div>"
							  + "  <div class='infoRow infoDates'>"
							  + "    <p>Dates Visited</p>" + dates
							  + "  </div>"
							  + '</div>';

				bindInfoWindow(marker, map, contentString);
			}
		}
	});
}
	
function getReputationData() 
{	
	$.getJSON (domain + 'main.php?callback=?', { 
		request			: 'frogforce',
		requestDetails	: 'getReputationData',
		user_id 		: window.localStorage["user_id"],
	}, function(data){

		if (data.status == 'success') {
			$('#totalReview').text(data.data.totalRating);
			$('#averageRating').text(data.data.averageRating);
			
			var averageRating = Math.round(data.data.averageRating);
			var main_star = '';
			for (var x=0; x<5; x++, averageRating--){
				if (averageRating > 0) {
					main_star += "<span class='active'></span>";
				} else {
					main_star += '<span></span>';
				}
			}
			$("#reputation-main-star").html(main_star);
			
			var main_loop = '';
			for (var x=0; x<data.data.totalRating; x++) {
				var month_names = new Array ( );
				month_names[month_names.length] = "January";
				month_names[month_names.length] = "February";
				month_names[month_names.length] = "March";
				month_names[month_names.length] = "April";
				month_names[month_names.length] = "May";
				month_names[month_names.length] = "June";
				month_names[month_names.length] = "July";
				month_names[month_names.length] = "August";
				month_names[month_names.length] = "September";
				month_names[month_names.length] = "October";
				month_names[month_names.length] = "November";
				month_names[month_names.length] = "December";
				
				var string_date = data.data.ratings[x]['rep_date'];
				var a = string_date.split(/[^0-9]/);
				var rating_date = new Date (a[0],a[1]-1,a[2],a[3],a[4],a[5]);
				
				var starRating = data.data.ratings[x]['rep_rating'];
				var star = '';
				
				for (var z=0; z<5; z++, starRating--){
					if (starRating > 0) {
						star += "<span class='active'></span>";
					} else {
						star += '<span></span>';
					}
				}
				
				main_loop += "<div class='content-heading'>"
						   + "  <h3 class='ratingHeader'>" + data.data.ratings[x]['rep_author'] + "</h3>"
						   + "  <div class='content-heading-body clear'>"
						   + "    <div class='review-details'>"
						   + "      <div class='review-row'>"
						   + "        <p>Review from:</p>"
						   + "        <p>" + data.data.ratings[x]['rep_source'] + "</p>"
						   + "      </div>"
						   + "      <div class='review-row'>"
						   + "        <p>Date:</p>"
						   + "        <p>" + month_names[rating_date.getMonth()] + ' ' + rating_date.getDate() + ', ' + rating_date.getFullYear() + "</p>"
						   + "      </div>"
						   + "		<div class='review-row'>"
						   + "		  <p>Review Rating:</p>"
						   + "        <div class='stars'>" + star + "</div>"
						   + "      </div>"
						   + "    </div>"
						   + "    <div class='review-content'>" + data.data.ratings[x]['rep_text'] + "</div>"
						   + "  </div>"
						   + "</div>";
			}
			$('.reputation-data').html(main_loop);
		}
	});
}
	
function postSocialUpdate() 
{
	$('#socialSubmit').click(function(){
		$.getJSON (domain + 'main.php?callback=?', { 
			request			: 'frogforce',
			requestDetails	: 'postSocialUpdate',
			user_id 		: window.localStorage["user_id"],
			textStatus 		: $('#textStatus').val(),
			switch_fb 		: $('#switch-fb').val(),
			switch_tw 		: $('#switch-tw').val(),
			switch_li 		: $('#switch-li').val(),
		}, function(data){
			if (data.status == 'success') {
				var checked = [];
				if (data.social_result.fb == 'success') {
					getFacebookFeeds();
					checked.push('Facebook');		
				}				
				if (data.social_result.tw == 'success') {
					getTwitterFeeds();
					checked.push('Twitter');		
				}				
				if (data.social_result.li == 'success') {
					getLinkedinFeeds();
					checked.push('LinkedIn');
				}
				$('#textStatus').val('');
				var socialPages = checked.join(' and ');
				alert('Status has been updated to your ' + socialPages + ' account.');
			}
		});
		return false;	
	});
}
	
function getLinkedinFeeds() 
{
	$.getJSON (domain + 'main.php?callback=?', { 
		request			: 'frogforce',
		requestDetails	: 'getLinkedinFeeds',
		user_id 		: window.localStorage["user_id"],
	}, function(data){

		if (data.status == 'success') {
			var main_loop = '';
		
			for(var x=0; x<data.data.length; x++){
				var picture = '';
				if 	(typeof data.data[x]['picture'] !== "undefined") {
					picture = "    <p class='picture'><img src='" + data.data[x]['picture'] + "' /></p>";
				} else {
					picture = "";
				}
				main_loop += "<div class='feed clear'>"
						   + "  <div class='feed-avatar'>"
						   + "    <img src='" + data.data[x]['avatar'] + "' />"
						   + "  </div>"
						   + "  <div class='feed-details'>"
						   + "    <p class='name'>" + data.data[x]['author'] + "</p>"
						   + "    <p class='message'>" + data.data[x]['message'] + "</p>"
						   + picture
						   + "    <p class='date-time'>" + data.data[x]['date'] + "</p>"
						   + "  </div>"
						   + "</div>";
			}
			
			$('#li-feeds').html(main_loop);
			$('#li-connections').html(data.linkedin_total);
            $('#li-page').attr('onclick', "window.open('" + data.linkedin_page + "', '_blank');");
		}
	});
}
	
function getTwitterFeeds() 
{
	$.getJSON (domain + 'main.php?callback=?', { 
		request			: 'frogforce',
		requestDetails	: 'getTwitterFeeds',
		user_id 		: window.localStorage["user_id"],
	}, function(data){

		if (data.status == 'success') {
			var main_loop = '';
			
			for(var x=0; x<data.data.length; x++){
				var picture = '';
				if 	(typeof data.data[x]['picture'] !== "undefined") {
					picture = "    <p class='picture'><img src='" + data.data[x]['picture'] + "' /></p>";
				} else {
					picture = "";
				}
				main_loop += "<div class='feed clear'>"
						   + "  <div class='feed-avatar'>"
						   + "    <img src='" + data.data[x]['avatar'] + "' />"
						   + "  </div>"
						   + "  <div class='feed-details'>"
						   + "    <p class='name'>" + data.data[x]['author'] + "</p>"
						   + "    <p class='message'>" + data.data[x]['message'] + "</p>"
						   + picture
						   + "    <p class='date-time'>" + data.data[x]['date'] + "</p>"
						   + "  </div>"
						   + "</div>";
			}
			
			$('#tw-feeds').html(main_loop);
			$('#tw-followers').html(data.followers_count);
			$('#tw-following').html(data.following_count);
			$('#tw-tweets').html(data.status_count);
            $('#tw-page').attr('onclick', "window.open('https://twitter.com/" + data.data[0]['author'] + "', '_blank');");
		}
	});
}
	
function getFacebookFeeds() 
{
	$.getJSON (domain + 'main.php?callback=?', { 
		request			: 'frogforce',
		requestDetails	: 'getFacebookFeeds',
		user_id 		: window.localStorage["user_id"],
	}, function(data){

		if (data.status == 'success') {
			var main_loop = '';
	
			for(var x=0; x<data.data.length; x++){
				picture = '';
				if 	(data.data[x]['picture'] != '' || typeof data.data[x]['picture'] !== "undefined") {
					picture = "    <p class='picture'><img src='" + data.data[x]['picture'] + "' /></p>";
				} else {
					picture = "";
				}
				main_loop += "<div class='feed clear'>"
						   + "  <div class='feed-avatar'>"
						   + "    <img src='" + data.data[x]['avatar'] + "' />"
						   + "  </div>"
						   + "  <div class='feed-details'>"
						   + "    <p class='name'>" + data.data[x]['author'] + "</p>"
						   + "    <p class='message'>" + data.data[x]['message'] + "</p>"
						   + picture
						   + "    <p class='date-time'>" + data.data[x]['date'] + "</p>"
						   + "  </div>"
						   + "</div>";
			}
			
			$('#fb-feeds').html(main_loop);
			$('#fb-likes').html(data.fb_likes);
			$('#fb-page').attr('onclick', "window.open('" + data.fb_page + "', '_blank');");
		}
	});
}
	
function drawReputationChart() 
{
	$.getJSON (domain + 'main.php?callback=?', { 
		request			: 'frogforce',
		requestDetails	: 'getReputationChart',
		user_id 		: window.localStorage["user_id"],
	}, function(data){
		if (data.status == 'success') {
			var data = new google.visualization.DataTable(data.data);
			var options = {
				backgroundColor: "#fffbef",
			};
			var chart = new google.visualization.BarChart(document.getElementById('reputation-chart'));
			chart.draw(data, options);
		}
	});
}
	
function drawKeywordChart(keyword_id) 
{
	if (keyword_id == '') {
		var keyword_id = 0;
	}
	var return_keyword_id;
	$.getJSON (domain + 'main.php?callback=?', { 
		request			: 'frogforce',
		requestDetails	: 'getKeywordStats',
		user_id 		: window.localStorage["user_id"],
		keyword_id 		: keyword_id,
	}, function(result){
		if (result.status == 'success') {
			var data = new google.visualization.DataTable(result.data);
			var options = {
				backgroundColor: "#fffbef",
				hAxis: {slantedText: true},
			};
			var chart = new google.visualization.LineChart(document.getElementById('keyword-chart'));
			chart.draw(data, options);
			
			var options = '';
			for(var x=0; x<result.keyword_list.length; x++){
				var selected = '';
				if (result.keyword_id == result.keyword_list[x]['keyword_id']) {
					var selected = "selected='selected'";
				}
				options += "<option " + selected + " value='" + result.keyword_list[x]['keyword_id'] + "'>" + result.keyword_list[x]['keyword'] + "</option>";
			}
			$('#select_keyword').html(options).selectmenu('refresh', true);
			//getKeywordTable(result.keyword_id);
		}
	});
}
	
function getKeywordTable() 
{
	$.getJSON (domain + 'main.php?callback=?', { 
		request			: 'frogforce',
		requestDetails	: 'getKeywordTable',
		user_id 		: window.localStorage["user_id"],
	}, function(result){
		if (result.status == 'success') {
			var ranking_value	= '';
			var main_loop		= '';

			var ranking_list = "<div class='ranking-name'><ul>";
			for(var x=0; x<result.list.length; x++){
				ranking_list += "<li>" + result.list[x] + "</li>";
			}
			ranking_list += "</ul></div>";
			
			for(var x=0; x<result.data.length; x++){				
				var current = '<li>Current</li>';
				var previous = '<li>Previous</li>';
				
				for(var y=0; y<result.data[x]['current'].length; y++){
					current += "<li>" + result.data[x]['current'][y] + "</li>";
					previous += "<li>" + result.data[x]['previous'][y] + "</li>";
				}
				
				var ranking_value = "<div class='ranking-value'>"
								  + "  <ul>" + current + "</ul>"
								  + "  <ul>" + previous + "</ul>"
								  + "</div>";
				if (result.data[x]['search_engine'] == 'Google') {
					$('#tab_google').html(ranking_list + ranking_value);
				} else if (result.data[x]['search_engine'] == 'Bing') {
					$('#tab_bing').html(ranking_list + ranking_value);
				} else if (result.data[x]['search_engine'] == 'Yahoo') {
					$('#tab_yahoo').html(ranking_list + ranking_value);
				}	
			}
		}
	});
}

function drawTrafficAnalysis() 
{
	var form = $("#trafficForm");    
	
	$.getJSON (domain + 'main.php?callback=?', { 
		request			: 'frogforce',
		requestDetails	: 'getTrafficAnalysis',
		user_id 		: window.localStorage["user_id"],
		traffic_per 	: $("#traffic_per", form).val(),
		record_type 	: $("#record_type", form).val(),
	}, function(data){
		if (data.status == 'success') {
			var data = new google.visualization.DataTable(data.data);
			var options = {
				backgroundColor: "#fffbef",
				hAxis: {slantedText: true},
			};
			var chart = new google.visualization.LineChart(document.getElementById('traffic-analysis'));
			chart.draw(data, options);
		}
	});
}
	
function drawTrafficSource() 
{
	$.getJSON (domain + 'main.php?callback=?', { 
		request			: 'frogforce',
		requestDetails	: 'getTrafficSource',
		user_id 		: window.localStorage["user_id"],
	}, function(data){
		if (data.status == 'success') {
			var main_website 	= data.data.rows[0]['c'][1]['v'];
			var others 			= data.data.rows[1]['c'][1]['v'];
			var search_engines	= data.data.rows[2]['c'][1]['v'];
			
			var total_view = main_website + others + search_engines;

			var percent_main 	= main_website / total_view * 100;
			var percent_others 	= others / total_view * 100;
			var percent_search 	= search_engines / total_view * 100;
			
			$('#val_main').html(main_website);
			$('#val_others').html(others);
			$('#val_search').html(search_engines);
			$('#val_total').html(total_view);
			
			$('#percent_main').html(percent_main.toFixed(2) + '%');
			$('#percent_others').html(percent_others.toFixed(2) + '%');
			$('#percent_search').html(percent_search.toFixed(2) + '%');
	
			var dataTable = new google.visualization.DataTable(data.data);
			var options = {
				backgroundColor: "#fffbef",
				fontName: 'HelveticaNeueLTProLt',
				fontSize: 15,
			};
			var chart = new google.visualization.BarChart(document.getElementById('traffic-source'));
			chart.draw(dataTable, options);
		}
	});
}
	
function drawSearchSource() 
{
	$.getJSON (domain + 'main.php?callback=?', { 
		request			: 'frogforce',
		requestDetails	: 'getSearchSource',
		user_id 		: window.localStorage["user_id"],
	}, function(data){
		if (data.status == 'success') {		
			
			var google_1		= data.data.rows[0]['c'][1]['v'];
			var yahoo			= data.data.rows[1]['c'][1]['v'];
			var bing 			= data.data.rows[2]['c'][1]['v'];
			var ask				= data.data.rows[3]['c'][1]['v'];
			var total_search 	= google_1 + ask + bing + yahoo;
			
			var percent_google 	= google_1 / total_search * 100;
			var percent_ask 	= ask / total_search * 100;
			var percent_bing 	= bing / total_search * 100;
			var percent_yahoo 	= yahoo / total_search * 100;
			
			$('#val_google').html(google_1);		
			$('#val_ask').html(ask);
			$('#val_yahoo').html(yahoo);
			$('#val_bing').html(bing);
			$('#val_search_total').html(total_search);
			
			$('#percent_google').html(percent_google.toFixed(2) + '%');
			$('#percent_ask').html(percent_ask.toFixed(2) + '%');
			$('#percent_yahoo').html(percent_yahoo.toFixed(2) + '%');
			$('#percent_bing').html(percent_bing.toFixed(2) + '%');
			
			var dataTable = new google.visualization.DataTable(data.data);
			var options = {
				backgroundColor: "#fffbef",
				fontName: 'HelveticaNeueLTProLt',
				fontSize: 15,
			};
			var chart = new google.visualization.BarChart(document.getElementById('search-source'));
			chart.draw(dataTable, options);
		}
	});
}
	
function checkPreAuth() {
	console.log("checkPreAuth");
    var form = $("#loginForm");
    if(window.localStorage["email"] != undefined && window.localStorage["password"] != undefined) {
        $("#email", form).val(window.localStorage["email"]);
        $("#password", form).val(window.localStorage["password"]);
        handleLogin();
    }
}

function handleLogin() {
    var form = $("#loginForm");  
    //disable the button so we can't resubmit while we wait
	
    $("#submit",form).attr("disabled","disabled");
	var e = $("#email", form).val();
	var p = $("#password", form).val();

    if(email != '' && password!= '') {
		$.getJSON (domain + 'login.php?callback=?', { 
			email		: e,
			password	: p,
		}, function(data){
			if (data.status == 'success') {
		        //store
                window.localStorage["email"] 	= e;
                window.localStorage["password"] = p;
                window.localStorage["user_id"] 	= data.user_id;
				
				if (window.localStorage["last_visit"] == '' || typeof window.localStorage['last_visit'] === "undefined") {
					var path = 'home.html';
				} else {
					var path = window.localStorage["last_visit"];
				}

				//var home = 'http://frogforce.com/mobile_frogforce/www/' + path;
				//var home = 'http://localhost/mobile_frogforce/www/' + path;
				
				setTimeout(function() {
					if (path == 'home.html') {
						alert('Login Successful... Redirecting...');
					}                           
					$.mobile.changePage(path, {
						transition	: "slide",
					});
				}, 2000);

                //navigator.notification.alert("Your login successful", function() {});
			} else {
				alert('Login Failed: Incorrect username or password');
                //navigator.notification.alert("Your login failed", function() {});
            }
		});
    } else {
		alert('Login Failed: You must enter a username and password');
        //navigator.notification.alert("You must enter a username and password", function() {});
    }
	$("#submit").removeAttr("disabled");
}

function getHomeSocialStats() {
	$.getJSON (domain + 'main.php?callback=?', { 
		request			: 'frogforce',
		requestDetails	: 'getHomeSocialStats',
		user_id 		: window.localStorage["user_id"],
	}, function(data){
		if (data.status == 'success') {
			$('#home_fb').html(data.fb_likes);
			$('#home_twitter').html(data.followers);
		}
	});
}

function getHomeLeadStats() {
	$.getJSON (domain + 'main.php?callback=?', { 
		request			: 'frogforce',
		requestDetails	: 'getHomeLeadStats',
		user_id 		: window.localStorage["user_id"],
	}, function(data){
		if (data.status == 'success') {
			$('#home_prints').html(data.prints);
			$('#home_calls').html(data.calls);
			$('#home_emails').html(data.mails);
		}
	});
}

function getHomeDetails() {
	$.getJSON (domain + 'main.php?callback=?', { 
		request			: 'frogforce',
		requestDetails	: 'getCompanyInfo',
		user_id 		: window.localStorage["user_id"],
	}, function(data){
		if (data.status == 'success') {
			$('#business_name').html(data.data.company_name);
			$('#business_type').html(data.data.business_type);
			$('#business_address').html(data.data.business_address);
			$('#profile_phone').html(data.data.business_contact);
			$('#profile_email').html(data.data.business_email);
			$('#profile_email_2').html(data.data.business_email);
			$('#profile_website').html(data.data.domain);
		}
	});
}

function getHomeTraffic() {
	$.getJSON (domain + 'main.php?callback=?', { 
		request			: 'frogforce',
		requestDetails	: 'getVisitViews',
		user_id 		: window.localStorage["user_id"],
		record_type 	: 'visits',
	}, function(data){
		if (data.status == 'success') {
			$('#home_site_visits').html(data.total);
		}
	});	
	
	$.getJSON (domain + 'main.php?callback=?', { 
		request			: 'frogforce',
		requestDetails	: 'getVisitViews',
		user_id 		: window.localStorage["user_id"],
		record_type 	: 'page_views',
	}, function(data){
		if (data.status == 'success') {
			$('#home_page_views').html(data.total);
		}
	});
}

function getVisitViews() 
{    
	if (window.localStorage["user_id"] != undefined) {
		var form = $("#trafficForm");   
		var total = [];		
		$.getJSON (domain + 'main.php?callback=?', { 
			request			: 'frogforce',
			requestDetails	: 'getVisitViews',
			record_type 	: $("#record_type", form).val(),
			user_id 		: window.localStorage["user_id"],
		}, function(data){
			if (data.status == 'success') {
				$('.data_traffic_view').html(data.total);
				if ($("#record_type", form).val() == 'visits') {
					$('.data_traffic_label').html('Visits');
				} else if ($("#record_type", form).val() == 'page_views') {
					$('.data_traffic_label').html('Page Views');
				}
			}
		});
	}
}

function deviceReady() 
{
	console.log("deviceReady");
	//checkPreAuth();
	/*
	$("#login-page").on("pageinit",function() {
		console.log("pageinit run");
		$("#loginForm").on("submit",handleLogin);
		checkPreAuth();
	});
	*/
}

function getRealContentHeight() 
{
    var header = $.mobile.activePage.find("div[data-role='header']:visible");
    var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
    var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
    var viewport_height = $(window).height();

    var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
    if((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
        content_height -= (content.outerHeight() - content.height());
    } 
    return content_height;
}

$(document).bind( "mobileinit", function() {
	// Make your jQuery Mobile framework configuration changes here!
	$.mobile.allowCrossDomainPages = true;
});

$(document).on('pageinit','#login-page', function(){
	$('#submit').click(function(){
		handleLogin();
		return false;
	});
	checkPreAuth();
	/*
	if (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0) {
		$(window).load(function(){
			$('input:-webkit-autofill').each(function(){
				var text = $(this).val();
				var name = $(this).attr('name');
				$(this).after(this.outerHTML).remove();
				$('input[name=' + name + ']').val(text);
			});
		});
	}
	checkPreAuth();
	*/
});	
/*
$('#login-page').bind('pageinit', function(event) {
	$('#submit').click(function(){
		handleLogin();
	});
	checkPreAuth();
});
*/
$(document).on('pageinit','#home-page', function(){
	getHomeDetails();
	getHomeTraffic();
	getHomeLeadStats();
	getHomeSocialStats();
});

$(document).on('pageinit','#social-page', function(){
	getFacebookFeeds();
	getTwitterFeeds();
	getLinkedinFeeds();
	postSocialUpdate();
	$('#textStatus').simplyCountable({
		counter:        '#social_counter',
		countType:      'characters',
		maxCount:       140,
		strictMax:      true,
		countDirection:	'down',
	});
	window.localStorage["last_visit"] = 'social.html';
});

$(document).on('pageinit','#reputation-page', function(){
	getReputationData();
	drawReputationChart();
	window.localStorage["last_visit"] = 'reputation.html';
});

$(document).on('pageinit','#keyword-page', function(){
	drawKeywordChart();
	getKeywordTable();
	
	$('#keywordSubmit').click(function(){
		var form = $("#keywordForm");   
		$("#keywordSubmit", form).attr("disabled","disabled");
		var keyword_id = $('#select_keyword', form).val();
		drawKeywordChart(keyword_id);
		$("#keywordSubmit").removeAttr("disabled");
		return false;
	});
	
	$("#keyword_content .tab_content").hide(); 											// Initially hide all content
    $("#keyword_tabs li:first").attr("id","current"); 									// Activate first tab
    $("#keyword_tabs").addClass("tab_google clear"); 									// Activate first tab
    $("#keyword_content .tab_content:first-child").fadeIn(); 							// Show first tab content
    
    $('#keyword_tabs a').click(function(e) {
        e.preventDefault();
        if ($(this).closest("li").attr("id") == "current") { 							//detection for current tab
			return       
        } else {             
			$("#keyword_content .tab_content").hide(); 									//Hide all content
			$("#keyword_tabs li").attr("id",""); 										//Reset id's
			$(this).parent().attr("id","current"); 										// Activate this
			$(this).parent().parent().attr('class', $(this).attr('name') + ' clear'); 	// Activate first tab
			$('#' + $(this).attr('name')).fadeIn(); 									// Show content for current tab
        }
    });
	
	window.localStorage["last_visit"] = 'keyword-stats.html';
});

$(document).on('pageinit','#traffic-page', function(){
	getVisitViews();	
	drawTrafficAnalysis();
	drawTrafficSource();
	drawSearchSource();
	initializeMap();
	$('#trafficSubmit').click(function(){
		var form = $("#trafficForm");   
		$("#trafficSubmit", form).attr("disabled","disabled");
		getVisitViews();
		drawTrafficAnalysis();
		$("#trafficSubmit").removeAttr("disabled");
		return false;
	});
	window.localStorage["last_visit"] = 'traffic.html';
});

$(document).on('pageinit','[data-role=page]', function(){
	loadMenu();
});