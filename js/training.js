app.addModule('training', function () {
	var self = this;
	var data = [];
	var imageUrl = 'http://auto.roscontent.ru/';
	var baseUrl = '/data.json';
	var questions = {};

	this.init = function () {
		window.resetTimer();

		var categories = $('#training-question').attr("categories");

		trainingStart(categories);

		$(document).on('click', '.training_questions a', function (e) {
			e.preventDefault();
			var id = $(this).attr('href');

			changeQuestion(id);
		});

		$('#answer-button').click(function (e) {
			e.preventDefault();

			if (!$('.radiobox_input:checked').length) {
				return;
			}
			answer();
			goToNext();
			checkFinish();
		});
		$('#go-to-next').click(function (e) {
			e.preventDefault();
			goToNext();
		});
		
		$('.question_button-2').click(function () {
			$('.question_tip').slideToggle();
		});
		
		$('.training-done_watch a').click(function (e) {
			e.preventDefault();
			
			$('.training-done_all').slideToggle();
		})
	};

	function trainingStart(categories) {
		$('#training-category').addClass('__hidden');
		$('#training-question').removeClass('__hidden');

		self.fillQuestions(categories);
	}

	this.fillQuestions = function (categories) {
		fillData(categories, function () {
			initFirst();
		});
	};

	function goToNext() {
		var next = $('#training-question .training_questions a.current').next();

		if (next.hasClass('answered')) {
			next = $('#training-question .training_questions a.answered:last').next();
		}

		if (!next.length) {
			next = $('#training-question .training_questions a:not(.answered):first');
		}

		if (next.length && !next.hasClass('answered')) {
			changeQuestion(next.attr('href'));
		}
	}

	function changeQuestion(id) {
		var item = getItemById(id);

		changeHtmlData(item);
		setAnswered($('#training-question .training_questions a.current'));

		$(".question_tip").slideUp();

	}

	function fillData(categories, callback) {
		$.ajax({
			method: 'get',
			url: baseUrl,
			data: {ids: categories},
			success: function (dataV) {
				var i = 1;
				data = dataV;

				// data = data.filter(function (value) {         
				//   return value['section']['id'] in categories;
				// });

				data.forEach(function (item) {
					item.index = i++;
				});

				callback();
			}
		});
	}

	function initFirst() {
		data.forEach(function (item) {			
			var link = $('<a />');
			link.html(item.index);
			link.attr('href', item.id);
			link.attr('data-index', item.index);

			if (item.index == 1) {
				link.addClass('current');
				changeQuestion(item['id']);
			}

			$('.training_questions').append(link);
		});
	}

	function getItemById(id) {
		var arr = data.filter(function (item) {
			return item['id'] == id;
		});

		return arr[0];
	}

	function changeHtmlData(item) {
		$('#training-question .question_image img').attr('src', imageUrl + item.image.url);
		$('#training-question .question_text span').html(item.index);
		$('#training-question .question_name').html(item.title);
		$('#training-question .question_tip').html(item.hint);

		$('#training-question .training_questions a').removeClass('current');
		$('#training-question .training_questions a[href="' + item['id'] + '"]').addClass('current');

		$('#training-question .question_answers').html('');
		item.answers.forEach(function (answer) {
			var label = $('<label />').addClass('radiobox');
			var input = $('<input />')
			.attr('type', 'radio')
			.addClass('radiobox_input')
			.attr('name', 'answer')
			.attr('data-id', answer.id)
			.attr('data-correct', answer.is_correct);
			var ico = $('<div />').addClass('radiobox_ico');
			var text = $('<div />').addClass('radiobox_text').html(answer.title);

			label.append(input);
			label.append(ico);
			label.append(text);

			$('#training-question .question_answers').append(label);
		});
	}

	function answer() {
		var checked = $('.radiobox_input:checked');
		var correct = checked.attr('data-correct');
		var current = $('.training_questions a.current');

		if (correct == 'true') {
			current.addClass('valid')
		} else {
			current.addClass('invalid')
		}

		current.addClass('answered').attr('data-checked-id', checked.attr('data-id'));
		
		var currentIndex = $('.training_questions a.current').attr('data-index');
		
		setAnswered($('.training_questions a.current'));
		questions[currentIndex] = $('.question').html();
	}

	function setAnswered(current) {
		var checked = current.attr('data-checked-id');
		
		$('#training-question .radiobox_input[data-id="' + checked + '"]')
			.prop('checked', true)
			.addClass('checked')
			.attr('checked', 'checked');

		if (current.hasClass('answered')) {
			$('#training-question .radiobox_input').prop('disabled', true);
			$('#training-question .radiobox_input[data-correct="true"]')
			.closest('label')
			.addClass('__is-valid');
		}

		if (current.hasClass('invalid')) {
			$('#training-question .radiobox_input').prop('disabled', true);
			$('#training-question .radiobox_input[data-id="' + checked + '"]')
			.closest('label')
			.addClass('__is-invalid');
		}
	}

	function checkFinish() {
		var links = $('.training_questions a');

		if (!$('.training_questions a:not(.answered)').length) {
			$('#training-question').addClass('__hidden');
			$('#training-done').addClass('__show');
			
			
			$('.training-done_total').html(data.length);
			$('.training-done_valid').html(links.filter('.valid').length);
			$('.training-done_invalid').html(links.filter('.invalid').length);
			$('.training-done_time').html($('.timer').html());

			window.removeTimer();
			
			for (var item in questions) {
				var htmlData = $('<div />').addClass('training-done_item');
				htmlData.append(questions[item]);
				$('.training-done_all').append(htmlData);
			}
		}
	}
});