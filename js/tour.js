var leg=0,
tour=[
['#nav','Hello','Discover stories, pictures and videos posted by our members. From the bizarre to the ridiculous, there&#8217;s lots to explore.',{bottom:'1.625em',left:0},'down',false],
['#discussions h1','Discussions','The most recent discussions appear here or you can see what&#8217;s popular. Find interesting items and join the fun with remarks of your own.',{top:'-10.125em',left:0},'down',true],
['#start-discussion','Get started','Sign up and start your first discussion in one easy step. Share your favourite stories, links, pictures and videos with us!',{top:'0.25em',right:'240px'},'right',true],
['#aside div.new-members h2','Go communal!','Browse member profiles. See who&#8217;s new, who just posted, and what they&#8217;re discussing.',{top:'-3.625em',left:'-305px'},'right',true],
['#aside div.food h2','Inspiration','We bring you the latest headlines from some of the world&#8217;s most popular sites. Start your own discussion on any news item with a single click.',{top:'-1em',left:'-305px'},'right',true],
['#aside div.feedback h2','We need your help!','New features are being tested and added all the time. Send us your feedback and keep an eye on our blog for announcements.',{top:'-1em',left:'-305px'},'right',true],
['#billboard','The End','Thanks for taking the tour! Come and join us as part of the satirical society.',{bottom:'-1.75em',right:'105px'},'right',true]
],
images=[
'img/ico20-close-tour.gif',
'img/button-continue.gif',
'img/button-tour2.gif',
'img/button-join2.gif',
'img/bg-tour-b-down.png',
'img/bg-tour-right.png'
],
viewport={
	top:function(){
		return window.pageYOffset || document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
	},
	height:function(){
		return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body.clientHeight;
	},
	bottom:function(){
		return this.top()+this.height();
	}
};

$.fn.preload=function(s,f){
	return this.each(function(){
		$(this).attr('src',s).load(f);
	});
};

function tourShow(){
	if (tour[leg][5]) {
		$(tour[leg][0]).parent().css({position:'relative'});
	}

	var markup='<div id="tour" class="'+tour[leg][4]+'" style="display:none;"><div class="tour-top"><h2>'+tour[leg][1]+'</h2><p>'+tour[leg][2]+'</p>';

	if (tour[leg][4]!='lightbox') {
		markup+='<p class="close"><a href="javascript:tourEnd();"><img src="'+images[0]+'" alt="Close tour" /></a></p>';
	}

	markup+='</div><div class="tour-bottom"><p>';

	// If not at end of tour, show continue
	if (tour[leg][4]=='lightbox') {
		markup+='<a href="javascript:tourNext();"><img src="'+images[2]+'" alt="Take tour" /></a> <a href="/rsvp"><img src="'+images[3]+'" alt="Join" /></a>';
	} else if (tour[leg+1]) {
		markup+='<a href="javascript:tourNext();"><img src="'+images[1]+'" alt="Continue tour" /></a>';
	}

	markup+='</p></div></div>';

	$(tour[leg][0]).before(markup);
	if (tour[leg][4]=='lightbox') {
		$('#tour').css({top:'10.75em',left:($(window).width()/2)-($('#tour').width()/2)});

		var yScroll=$(document).height(),
		windowHeight=$(window).height(),
		pageHeight=(yScroll<windowHeight) ? windowHeight : yScroll;

		if (!$.browser.msie || ($.browser.version > 6)) {
			$("<div>")
				.attr('id','overlay').click(function(){
					tourEnd();
					return false;
				})
				.css({display:'none',position:'absolute',top:0,left:0,width:'100%',height:pageHeight,'z-index':900,'background-image':'url(img/overlay.png)'})
				.appendTo('#masthead-wrap')
				.click(function(){
					$('#overlay').fadeOut('fast',function(){$(this).remove();});
				})
				.fadeIn('fast');
			$('#tour a').click(function(){
				$('#overlay').fadeOut('fast',function(){$(this).remove();});
			});
		}
	}

	$('#tour').css(tour[leg][3]);

	if ($.browser.msie) {
		$('#tour').show();
	} else {
		$('#tour').fadeIn('fast');
	}

	var offset=$('#tour').offset().top;
	if (offset < viewport.top() || offset + $('#tour').height() > viewport.bottom()) {
		if (tour[leg+1]) {
			offset-=40;
			$('html,body').animate({scrollTop:offset},1000,function(){
				$('#tour h2').attr('tabindex',-1).focus();
			});
			
		} else {
			$('html,body').animate({scrollTop:0},1000,function(){
				$('#tour h2').attr('tabindex',-1).focus();
			});
		}
	} else {
		$('#tour h2').attr('tabindex',-1).focus();
	}
}

function tourNext(){
	if (tour[leg+1]) {
		if ($.browser.msie) {
			$('#tour').remove();
			leg++;
			tourShow();
		} else {
			$('#tour').fadeOut('fast',function(){
				$(this).remove();
				leg++;
				tourShow();
			});
		}
	} else {
		tourEnd();
	}
}

function tourEnd(){
	if ($.browser.msie) {
		$('#tour').remove();
	} else {
		$('#tour').fadeOut('fast',function(){
			$(this).remove();
		});
	}
	leg=0;
	$('#tour-button').unbind('click').click(function(){
		tourStart();
		return false;
	});
}

function tourStart(){
	$('#tour-button').unbind('click').click(function(){return false;});

/*	$("<img>").preload(images[0],function(){
		$("<img>").preload(images[1],function(){
			$("<img>").preload(images[2],function(){
				$("<img>").preload(images[3],function(){*/

					tourShow();

/*				});
			});
		});
	});*/

}

$(document).ready(function(){
	var invitee='there';
	var inviter='your friend';
	tour=$.merge([['#masthead-wrap','Hi '+invitee+'!','Thanks for popping in! You can accept '+inviter+'&#8217;s invitation and join in straight away, take the tour before you join, or <a href="javascript:tourEnd();">just browse</a>.',{},'lightbox',false]],tour);
	$('#join-button').attr('href','/rsvp');

	if(document.location.hash=='#tour'){
		tourStart();
	}

	$('#tour-button').click(function(){
		tourStart();
		return false;
	});
});
