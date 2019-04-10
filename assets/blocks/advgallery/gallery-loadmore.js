jQuery(document).ready(function ($) {
    var $masonryWrapper = $('.advgb-gallery.masonry-layout');
    if ($masonryWrapper.length) {
        $masonryWrapper.masonry({
            itemSelector: '.advgb-gallery-item',
            columnWidth: '.advgb-gallery-item',
            percentPosition: true
        });
    }

    $('.advgb-gallery-container .advgb-load-more').find('a').click(function (e) {
        e.preventDefault();
        var self = $(this);
        var galleryWrapper = self.closest('.advgb-gallery-container').find('.advgb-gallery');
        var imageIds = galleryWrapper.data('ids');
        imageIds = imageIds.split(',');
        var itemsToShow = parseInt(galleryWrapper.data('show'));
        var isMasonry = galleryWrapper.hasClass('masonry-layout');
        var currentItems = galleryWrapper.find('.advgb-gallery-item').length;
        var idsToFetch = imageIds.splice(currentItems, itemsToShow);

        if (idsToFetch.length) {
            $.ajax( {
                url: advgbGL.homeUrl + '/index.php?rest_route=/wp/v2/media',
                type: 'GET',
                data: {
                    include: idsToFetch,
                },
                beforeSend: function () {
                    self.addClass('no-text').prepend('<div class="advgb-recent-posts-loading"/>');
                },
                success: function ( images ) {
                    if (images.length) {
                        var html = '';
                        images.forEach(function ( img ) {
                            html += '<div class="advgb-gallery-item">';
                            html +=    '<figure>';
                            html +=       '<img src="'+ img.source_url +'" alt="'+ img.caption.rendered +'" data-id="'+ img.id +'" />';
                            if (img.caption.rendered.length) {
                                var caption = $(img.caption.rendered).text();
                                html += '<figcaption>'+ caption +'</figcaption>';
                            }
                            html +=    '</figure>';
                            html += '</div>';
                        } )
                    }

                    var $html = $(html);
                    if (!isMasonry) {
                        galleryWrapper.append($html.hide().fadeIn(2000));
                    } else {
                        galleryWrapper.append($html).masonry('appended', $html);
                        setTimeout(function () {
                            galleryWrapper.masonry('layout');
                        }, 300)
                    }

                    advgbGalleryLightbox();
                    self.removeClass('no-text').find('.advgb-recent-posts-loading').remove();
                },
                error: function ( xhr, error ) {
                    alert(error + ' - ' + xhr.statusText);
                    self.removeClass('no-text').find('.advgb-recent-posts-loading').remove();
                },
            } )
        } else {
            galleryWrapper.next().append('<p class="no-more">'+ advgbGL.noMoreImgs +'</p>');
            setTimeout(function () {
                galleryWrapper.next().find('.no-more').remove();
            }, 2000)
        }
    })
});