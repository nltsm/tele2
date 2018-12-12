app.addModule('brands', function () {
	this.init = function () {
		var hidden = $('.brands_content a.__hidden');
		
		$('.brands_arrow').click(function () {
			hidden.toggleClass('__hidden');
			$(this).toggleClass('active')
		});
	}
});
app.addModule('characteristic', function () {
	this.init = function () {
		var nav = $('.characteristic_nav a');
		
		nav.click(function (e) {
			e.preventDefault();
			
			$('.characteristic_content').removeClass('active');
			$($(this).attr('href')).addClass('active');
			
			$('.characteristic_nav li').removeClass('active');
			$(this).closest('li').addClass('active');
		});
		
		$('.characteristic_head').click(function (e) {
			e.preventDefault();
			
			$('.characteristic_body').not($(this).next()).slideUp();
			$(this).next().slideToggle();
		});
	}
});
app.addModule('datepicker', function () {
	this.init = function () {
		$('.datepicker').datepicker({
		    format: 'dd.mm.yyyy',
			language: "ru",
			autoclose: true,
		});
	}
});
app.addModule('dealer', function () {
	var self = this;
	
	this.init = function () {
		this.initSpoiler();
		
		$('#dealer-button').click(function (e) {
			e.preventDefault();
			
			self.changeSpoiler();
		});
	};
	
	this.initSpoiler = function () {
		var items = $('#dealer-content .news_item');
		items.filter(':lt(5)').addClass('active');
		var itemsNotActive = $('.dealer-content .news_item:not(.active):lt(5)');
		
		if (itemsNotActive.length) {
			$('#dealer-button').addClass('active');
		} else {
			$('#dealer-button').removeClass('active');
		}
	};
	
	this.changeSpoiler = function () {
		var items = $('.dealer-content .news_item:not(.active):lt(5)');;
		items.addClass('active');
		var itemsNotActive = $('.dealer-content .news_item:not(.active):lt(5)');
		
		if (itemsNotActive.length) {
			$('#dealer-button').addClass('active');
		} else {
			$('#dealer-button').removeClass('active');
		}
	};
});
app.addModule('mobile-load', function () {
	this.init = function () {
		$('[data-clone-id]').each(function () {
			var element = $('#' + $(this).attr('data-clone-id'));
			
			if (element.length) {
				$(this).append(
					element.clone(true, true).removeAttr('id').addClass('__cloned')
				);
			}
			
			$(this).removeAttr('data-clone-id');
		});
	};
});
app.addModule('pdd-online', function () {
	this.init = function () {
		
		$('.pdd-online_show-link').click(function (e) {
			e.preventDefault();
			var text = $(this).closest('.pdd-online_content').find('.pdd-online_full-text');
			
			text.toggleClass('active');
			
			$(this).html(function () {
				if (text.hasClass('active')) {
					return 'Скрыть';
				} else {
					return 'Показать полностью';
				}
			});
		});
		
		$('.pdd-online_nav a[href^="#"]').click(function (e) {
			e.preventDefault();
			
			$('.pdd-online_content').removeClass('active');
			$($(this).attr('href')).addClass('active');
			
			$('.pdd-online_nav li').removeClass('active');
			$(this).closest('li').addClass('active');
		})
	}
});
app.addModule('popup', function () {
	this.init = function () {
		$('.popup').magnificPopup({
			preloader: false,
			showCloseBtn: false,
			removalDelay: 300,
			mainClass: 'mfp-fade'
		});
		
		$('.popup-image').magnificPopup({
			preloader: false,
			showCloseBtn: false,
			removalDelay: 300,
			mainClass: 'mfp-fade',
			type: 'image'
		});
		
		$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
			disableOn: 700,
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,

			fixedContentPos: false
		});
		
		$('.popup-close').click(function (e) {
			e.preventDefault();
			$.magnificPopup.close();
		});
	};
});
app.addModule('tab', function () {
	this.init = function () {
		var nav = $('.section .nav a');
		
		nav.click(function (e) {
			e.preventDefault();
			
			var block = $($(this).attr('href'));
			var section = $(this).closest('.section');
			
			var tab = section.find('.tab');
			var links = section.find('.nav li');
			
			tab.removeClass('active');
			links.removeClass('active');
			
			$(this).closest('li').addClass('active');
			$(block).addClass('active')
		})
	}
});
app.addModule('timer', function () {
	var currentSeconds;
	
	this.init = function () {
		if (!$('.timer').length) {
			return;
		}
		
		var getSeconds = localStorage.getItem('seconds');
		var seconds = 0;
		
		if (getSeconds) {
			seconds = parseInt(getSeconds);
		}
		currentSeconds = seconds;
		
		setInterval(function () {
			currentSeconds += 1;
			localStorage.setItem('seconds', currentSeconds);
		}, 1000);
		
		initTimer(seconds);
	};
	
	window.initTimer = function (seconds) {
		$('.timer').timer({
			format: '%H:%M:%S',
			seconds: seconds
		});
		currentSeconds = seconds;
	};
	window.removeTimer = function () {
		$('.timer').timer('remove');
		localStorage.removeItem('seconds');
	};
	window.resetTimer = function (seconds) {
		window.removeTimer();
		window.initTimer(seconds);
	}
});
jQuery(function () {
	app.callModules();
});