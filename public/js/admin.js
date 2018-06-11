$(function() {
	$('.del').click(function(e){
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' + id)

		$.ajax({
			type:'DELETE',
			url:'/admin/list?id=' + id
		})
		.done(function(results) {
			if(results.success === 1) {
				if(tr.length > 0) {
					tr.remove()
				}
			}
		})
	})

	$('#movieSync').blur(function(e){
		var target = $(e.target)
		var movieId = target.val()

		if(movieId) {
			$.ajax({
				url:'https://api.douban.com/v2/movie/subject/' + movieId,
				dataType:'jsonp',
				type:'GET',
				jsonp:'callback',
				success:function(data) {
					$('#inputTitle').val(data.title)
					$('#inputDoctor').val(data.directors[0].name)
					$('#inputCountry').val(data.countries[0])
					$('#inputPoster').val(data.images.large)
					$('#inputYear').val(data.year)
					$('#inputSummary').val(data.summary)
				}
			})
		}
	})
})