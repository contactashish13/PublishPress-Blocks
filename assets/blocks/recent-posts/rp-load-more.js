jQuery(document).ready(function ($) {
    $('.advgb-load-more').find('a').click(function (e) {
        e.preventDefault();
        var self = $(this);
        var postWrapper = $(this).closest('.advgb-recent-posts-container').find('.advgb-recent-posts');
        var postClone = postWrapper.find('.advgb-recent-post:last-child').clone();
        var offset = postWrapper.children().length;
        var blockAttributes = postWrapper.data('attributes');
        blockAttributes = window.atob(blockAttributes);
        blockAttributes = JSON.parse(blockAttributes);
        var requestData = {
            per_page: 5,
            offset: offset,
            categories: blockAttributes.category || undefined,
            order: blockAttributes.order,
            orderBy: blockAttributes.orderBy,
        };

        if (blockAttributes.displayCategory) {
            $.ajax( {
                url: advgbRP.homeUrl + '/index.php/wp-json/wp/v2/categories',
                type: 'GET',
                data: {
                    per_page: 100,
                    hide_empty: true,
                },
                success: function ( cat ) {
                    $.ajax({
                        url: advgbRP.homeUrl + '/index.php/wp-json/wp/v2/posts',
                        type: 'GET',
                        data: requestData,
                        beforeSend: function () {
                            self.addClass('no-text').prepend('<div class="advgb-recent-posts-loading"/>');
                        },
                        success: function ( posts ) {
                            appendPosts(postWrapper, postClone, posts, cat);
                            self.removeClass('no-text').find('.advgb-recent-posts-loading').remove();
                        },
                        error: function ( xhr, error ) {
                            alert(error + ' - ' + xhr.responseText);
                            self.removeClass('no-text').find('.advgb-recent-posts-loading').remove();
                        },
                    })
                },
                error: function ( xhr, error ) {
                    alert(error + ' - ' + xhr.responseText);
                },
            } );
        } else {
            $.ajax({
                url: advgbRP.homeUrl + '/index.php/wp-json/wp/v2/posts',
                type: 'GET',
                data: requestData,
                beforeSend: function () {
                    self.prepend('<div class="advgb-recent-posts-loading"/>');
                },
                success: function ( posts ) {
                    appendPosts(postWrapper, postClone, posts);
                    self.removeClass('no-text').find('.advgb-recent-posts-loading').remove();
                },
                error: function ( xhr, error ) {
                    alert(error + ' - ' + xhr.responseText);
                    self.removeClass('no-text').find('.advgb-recent-posts-loading').remove();
                },
            })
        }
    });

    function appendPosts( postWrapper, postClone, posts, categories = null ) {
        if (posts.length) {
            posts.forEach(function (post) {
                var dateFormat = wp.date.__experimentalGetSettings().formats.date;
                var clone = postClone.clone();
                clone.find('.advgb-post-thumbnail a').attr('href', post.link);
                clone.find('.advgb-post-thumbnail img').attr('src', post.featured_img || advgbRP.defaultThumb);
                clone.find('.advgb-post-title a').attr('href', post.link).text(post.title.rendered);
                clone.find('.advgb-post-author').attr('href', post.author_meta.author_link).text(post.author_meta.display_name);
                clone.find('.advgb-post-date').text(wp.date.dateI18n(dateFormat, post.date_gmt));
                clone.find('.advgb-post-excerpt').html(post.excerpt.rendered);
                clone.find('.advgb-post-readmore a').attr('href', post.link);

                if (categories && post.categories.length) {
                    var categoryHTML = '';
                    for (var i = 0; i < post.categories.length; i++) {
                        if (i === 5) {
                            categoryHTML += '<span class="advgb-post-category-more">'+ (post.categories.length - i) +'</span>';
                            break;
                        }

                        var catID = parseInt(post.categories[i]);
                        var idx = categories.findIndex((cat) => cat.id === catID);
                        var catName = idx > -1 ? categories[idx].name : '';

                        categoryHTML += '<span class="advgb-post-category">'+ catName +'</span>'
                    }
                    clone.find('.advgb-post-categories').html(categoryHTML);
                }

                postWrapper.append(clone);
            })
        } else {
            alert(advgbRP.noPostsFound);
        }
    }
});