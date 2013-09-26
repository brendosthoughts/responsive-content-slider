/*
 * jQuery liquid carousel v1.0
 * http://www.nikolakis.net
 *
 * Copyright 2010, John Nikolakis
 * Free to use under the GPL license.
 * http://www.gnu.org/licenses/gpl.html
 *
 */
$('document').ready(function(){
	$('.content_holder').click(function() {
		$(this).children('.extra_info').dialog({
		height:600,
		width: 800,
		modal: true
		});
	});

});
var currentposition=0;
function move_next(totallis,visiblelis,currentposition,totalwidth){
					if (totallis <= visiblelis) {
						currentposition = 0;
					} else if ((currentposition + visiblelis) < totallis) {
						currentposition += 1;
					} else if ((currentposition + visiblelis) >= totallis -1) {
						currentposition = totallis - visiblelis;
					}	
					return currentposition;

}

function move_previous(currentposition){
					if ((currentposition - 1) > 0) {
						currentposition -= 1;
					} else if ((currentposition - 1) <= 0) {
						currentposition = 0;
					}
					return currentposition;
}
(function($){
	$.fn.liquidcarousel = function(options) {

	var defaults = {
		height: 150,
		duration: 100,
		hidearrows: true
	};
	var options = $.extend(defaults, options);
	var next_timer =false;
	var previous_timer = false;

    return this.each(function() {
			var divobj = $(this);

			$(divobj).height(options.height);
			$(divobj).css('overflow', 'hidden');

			$('> .wrapper', divobj).height(options.height);
			$('> .wrapper', divobj).css('overflow', 'hidden');
			$('> .wrapper', divobj).css('float', 'left');

			$('> .wrapper > ul', divobj).height(options.height);
			$('> .wrapper > ul', divobj).css('float', 'left');
			$('> .wrapper > ul', divobj).css('margin', '0');
			$('> .wrapper > ul', divobj).css('padding', '0');
			$('> .wrapper > ul', divobj).css('display', 'block');

			$('> .wrapper > ul > li', divobj).height(options.height);
			$('> .wrapper > ul > li', divobj).width(options.height/1.75);
			$('> .wrapper > ul > li', divobj).css('display', 'block');
			$('> .wrapper > ul > li', divobj).css('float', 'left');
			

			var originalmarginright = parseInt($('> .wrapper > ul > li', divobj).css('marginRight'));
			var originalmarginleft = parseInt($('> .wrapper > ul > li', divobj).css('marginLeft'));
			var visiblelis = 0;
			var totallis = $('> .wrapper > ul > li', this).length;
			var currentposition = 0;
			var ulheight = $('> .wrapper > ul', divobj).height();
			var liwidth = $('> .wrapper > ul > li:first', divobj).outerWidth(true);
			var imgwidth = $('> .wrapper > ul > li > img', divobj).outerWidth(true);
			$(' .wrapper > ul > li > div > div > img').attr("width", liwidth - 60);
			$('.vid_title').attr("width", (liwidth * 0.8));
			$('.next').attr("height", (ulheight * 0.9));
			$('.previous').attr("height", (ulheight * 0.9));
			var additionalmargin = 0;
			var totalwidth = liwidth + additionalmargin;
						

			$(window).resize(function(e){
				var divwidth = $(divobj).width();
				var availablewidth = (divwidth - $('> .previous', divobj).outerWidth(true) - $('> .next', divobj).outerWidth(true));

				previousvisiblelis = visiblelis;
				visiblelis = Math.floor((availablewidth / liwidth));

				if (visiblelis < totallis) {
					additionalmargin = Math.floor((availablewidth - (visiblelis * liwidth))/visiblelis);
				} else {
					additionalmargin = Math.floor((availablewidth - (totallis * liwidth))/totallis);
				}
				halfadditionalmargin = Math.floor(additionalmargin/2);
				totalwidth = liwidth + additionalmargin;

				$('> .wrapper > ul > li', divobj).css('marginRight', originalmarginright + halfadditionalmargin);
				$('> .wrapper > ul > li', divobj).css('marginLeft',originalmarginleft + halfadditionalmargin);

				if (visiblelis > previousvisiblelis  || totallis <= visiblelis) {
					currentposition -= (visiblelis-previousvisiblelis);
					if (currentposition < 0 || totallis <= visiblelis ) {
						currentposition = 0;
					}
				}
				$('> .wrapper > ul', divobj).css('marginLeft', -(currentposition * totalwidth));

				if (visiblelis >= totallis || ((divwidth >= (totallis * liwidth)) && options.hidearrows) ) {
					if (options.hidearrows) {
						$('> .previous', divobj).hide();
						$('> .next', divobj).hide();

						additionalmargin = Math.floor((divwidth - (totallis * liwidth))/totallis);
						halfadditionalmargin = Math.floor(additionalmargin/2);
						totalwidth = liwidth + additionalmargin;
						$('> .wrapper > ul > li', divobj).css('marginRight', originalmarginright + halfadditionalmargin);
						$('> .wrapper > ul > li', divobj).css('marginLeft', originalmarginleft + halfadditionalmargin);
					}
					$('> .wrapper', divobj).width(totallis * totalwidth);
					$('> ul', divobj).width(totallis * totalwidth);
					$('> .wrapper', divobj).css('marginLeft', 0);
					$('> .vid_title', divobj).css('width', '75' );
					currentposition = 0;
					
				} else {
					$('> .previous', divobj).show();
					$('> .next', divobj).show();
					$('> .wrapper', divobj).width(visiblelis * totalwidth);
					$('> ul', divobj).width(visiblelis * totalwidth);
				}
			});
			$('.wrapper > ul').swipe( {
				swipeStatus:function(event, phase, direction, distance, duration, fingers)
				{
					var str = "<h4>Swipe Phase : " + phase + "<br/>";
					str += "Direction from inital touch: " + direction + "<br/>";
					str += "Distance from inital touch: " + distance + "<br/>";
					str += "Duration of swipe: " + duration + "<br/>";
					str += "Fingers used: " + fingers + "<br/></h4>";
          //Here we can check the:
          //phase : 'start', 'move', 'end', 'cancel'
          //direction : 'left', 'right', 'up', 'down'
          //distance : Distance finger is from initial touch point in px
          //duration : Length of swipe in MS 
          //fingerCount : the number of fingers used
					if (phase!="cancel" && phase!="end") {
						if (duration<5000)
						str +="Under maxTimeThreshold.<h3>Swipe handler will be triggered if you release at this point.</h3>"
						else
						str +="Over maxTimeThreshold. <h3>Swipe handler will be canceled if you release at this point.</h3>"
						if (distance<100)
							str +="Not yet reached threshold.  <h3>Swipe will be canceled if you release at this point.</h3>"
						else
						str +="Threshold reached <h3>Swipe handler will be triggered if you release at this point.</h3>"
					}
					if (direction=="left"){
						currentposition = move_previous(currentposition);
						$('> .wrapper > ul', divobj).stop();
						$('> .wrapper > ul', divobj).animate({'marginLeft': -(currentposition * totalwidth)}, options.duration);
					}
					else if(direction=="right"){
						currentposition = move_previous(currentposition);
						$('> .wrapper > ul', divobj).stop();
						$('> .wrapper > ul', divobj).animate({'marginLeft': -(currentposition * totalwidth)}, options.duration);
					}
				},
				threshold:100,
				maxTimeThreshold:5000,
				fingers:'all'
			});
			$('> .next', divobj).mouseover(function(){
				next_timer = setInterval(function() {
					currentposition = move_next(totallis,visiblelis,currentposition,divobj,totalwidth,options);
					$('> .wrapper > ul', divobj).stop();
					$('> .wrapper > ul', divobj).animate({'marginLeft': -(currentposition * totalwidth)}, options.duration);
				},500);
			});
			
			$('> .next', divobj).mouseout(function(){
			clearInterval(next_timer);
			next_timer = false;
			});

			$('> .previous', divobj).mouseover(function(){
				previous_timer = setInterval(function() {
					currentposition = move_previous(currentposition);
					$('> .wrapper > ul', divobj).stop();
					$('> .wrapper > ul', divobj).animate({'marginLeft': -(currentposition * totalwidth)}, options.duration);
				},500);
			});
			
			$('> .previous', divobj).mouseout(function(){
			clearInterval(previous_timer);
			previous_timer = false;
			})

			$('> .next', divobj).dblclick(function(e){
				e.preventDefault();
				clearSelection();
			});

			$('> .previous', divobj).dblclick(function(e){
				e.preventDefault();
				clearSelection();
			});

			function clearSelection() {
				if (document.selection && document.selection.empty) {
					document.selection.empty();
				} else if (window.getSelection) {
					var sel = window.getSelection();
					sel.removeAllRanges();
				}
			}

			$(window).resize();
    });


 };
})(jQuery);
