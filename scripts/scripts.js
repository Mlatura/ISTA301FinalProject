// for reference... 
/* 
// when window loads
$(window).load(function() {	
    // start carousal
    startCarousal();

  	// load news into page
  	getNews();

  	// load videos into preaches page
  	getYoutubeVideos();

    // get gallery feed
    getGalleryFeed();
});
*/

function startCarousal () {
    $('.flexslider').flexslider({
        animation: "slide",
        smoothHeight: true,
        prevText: "",
        nextText: "",
    });
}

function getNews () {
	var request = new XMLHttpRequest();
	request.open("GET", "get_news.php", true);

	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200) {
			var six_news = JSON.parse(request.responseText);

			// make a div for each news post
			for(var x = 0; x < six_news.length; x++){
				var post = "<div class='post'>"+
		          "<h3 class='heading'>"+six_news[x]['title']+"</h3>"+
		          "<p class='message'>"+six_news[x]['message']+"</p>"+
		          "<div class='timestamp pull-right'>"+six_news[x]['time']+"</div>"+
		        "</div>";
			
				$(".news").append(post);
			}
		}
	}
	request.send();
}

function homePageFirstYoutubeVid () {
	var playListURL = 'http://gdata.youtube.com/feeds/mobile/users/ixoyenog/uploads?alt=json&orderby=published&format=1,6';	
	var videoURL= 'http://www.youtube.com/watch?v=';
	$.getJSON(playListURL, function(data) {
	    var list_data="";
	    $.each(data.feed.entry, function(i, item) {
	        var feedTitle = item.title.$t;
	        var feedDesc = item.media$group.media$description.$t;
	        var feedURL = item.link[1].href;
	        var fragments = feedURL.split("/");
	        var videoID = fragments[fragments.length - 2];
	        var url = videoURL + videoID;
	        var thumb = "http://img.youtube.com/vi/"+ videoID +"/hqdefault.jpg";
	        list_data += ""+
	        "<a href=" +url+ " title=" +feedTitle+ ">"+
	        	"<img class='' alt=" +feedTitle+ " src="+ thumb +">"+
	        	"<p class='flex-caption'>" +feedTitle+ "</p>"+
	        "</a>"
	        return false;
	        });
	    $("#yt").append(list_data);
	    });
}

function getYoutubeVideos () {
	var playListURL = 'http://gdata.youtube.com/feeds/mobile/users/ixoyenog/uploads?alt=json&orderby=published&format=1,6';	
	var videoURL= 'http://www.youtube.com/watch?v=';
	$.getJSON(playListURL, function(data) {
	    var list_data="";
	    $.each(data.feed.entry, function(i, item) {
	        var feedTitle = item.title.$t;
	        var feedDesc = item.media$group.media$description.$t;
	        var feedURL = item.link[1].href;
	        var fragments = feedURL.split("/");
	        var videoID = fragments[fragments.length - 2];
	        var url = videoURL + videoID;
	        var thumb = "http://img.youtube.com/vi/"+ videoID +"/default.jpg";
	        list_data += ""+

	        "<li>"+
		        "<a href=" +url+ " title=" +feedTitle+ ">"+
		        	"<img class='ui-li-has-thumb ui-shadow' alt=" +feedTitle+ " src="+ thumb +">"+
		        	"<h3>"+feedTitle+"</h3>"+
		        	"<p>"+feedDesc+"</p>"+
		        "</a>"+
	        "</li>";
	    });
	    $("#yt-list").append(list_data);
	    $("#yt-list").listview("refresh");
	});
}

function getGalleryFeed () {
    var feed = new Instafeed({
    	clientId: 'ef0bbd19aa4547dbaca0fa96ef0b30dd',
        get: 'tagged',
        tagName: 'Nog4Jesus',
        pages: instafeedPages,
        limit: 30,
        template: '<a href="{{link}}"><img class="feed-image" src="{{image}}"/></a>',
        after: function () {
		    var images = $("#instafeed").find('a');
		    $.each(images, function(index, image) {
		      var delay = (index * 75) + 'ms';
		      $(image).css('-webkit-animation-delay', delay);
		      $(image).css('-moz-animation-delay', delay);
		      $(image).css('-ms-animation-delay', delay);
		      $(image).css('-o-animation-delay', delay);
		      $(image).css('animation-delay', delay);
		      $(image).addClass('animated flipInX');
    		});
  		}
    });
    feed.run();
}

var instafeedPages = 1;
function getMoreImages () {
	instafeedPages += 1;
	$("#instafeed").empty();
	getGalleryFeed();
}

function processLogin () {
	var username = $("#user").val();
	var password = $("#pass").val();

	var request = new XMLHttpRequest();
	request.open("GET", "processlogin.php?user="+username+"&pass="+password, true);

	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200) {
			var wasSuccessful = JSON.parse(request.responseText);
			// valid login
			if (wasSuccessful == 1) {
				registerSuccess();

				// close panel & empty page content
				$(".afterNavBar").empty();
				$("#panel-right").panel("close");				

				// show form
				var form = "<div class='container'>"+
			    "  <form class='form-signin' id='newsform' action='javascript:addNews();'>"+
			    "    <h2 class='heading'>New Message!</h2>"+
			    "    <div class='alerts'></div>"+
			    "     <div class='control-group'>"+
			    "        <input type='text' id='newsTitle' class='input-block-level' name='newsTitle' placeholder='Title' required>"+
			    "        <textarea class='input-block-level' id='newsMessage' placeholder='Message' required></textarea>"+
			    "    </div>"+
			    "    <input type='submit' id='submitButton' class='btn btn-primary btn-large' value='Submit!'>"+
			    "  </form>"+
			    "</div>";				

		    	$(".afterNavBar").append(form);
			} 
			else{
				badPass();
			}
			// erase the user/pass fields
			$("#user").val("");
			$("#pass").val("");
		}
	}
	request.send();
}

function addNews () {
	var title = $("#newsTitle").val();
	var content = $("#newsMessage").val();
	var file = "add_news.php?title="+title+"&content="+content;
	
	if (title == "" || content == "") {
		return;
	}

	// jquery ajax request
	$.ajax({
        type: 'GET',
        url: file,
        success:function(data){
           registerSuccess();
        }
    });
}


function badPass () {
	$(".control-group").attr("class", "control-group error");
	var alert = $("#form-alert");
	alert.empty();
	alert.attr("class", "alert alert-block alert-error fade in");
	alert.append('<h4 class="alert-heading">Invalid Login!</h4>Bad username and password combination!');
}

function registerSuccess () {
	// reset sign in form
	$("#form-alert").empty();
	$("#form-alert").attr("class", "alerts");
	
	// all alerts
	var alert = $(".alerts");
	alert.empty();
	alert.attr("class", "alert alert-block alert-success fade in");
	alert.append('<h4 class="alert-heading">Success!</h4>Your action was completed successfully!');
}

