<?php
defined('ABSPATH') || die;

/**
 * Extract text from html string
 *
 * @param string  $html   HTML string to extract
 * @param integer $length Length of the string will return
 *
 * @return string Text that has been extracted
 */
function advgbExtractHtml($html, $length)
{
    if (!trim($html)) {
        return '';
    }

    $html = <<<HTML
$html
HTML;

    $dom = new DOMDocument();

    libxml_use_internal_errors(true);
    $dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));

    $scripts = $dom->getElementsByTagName('script');
    $styles = $dom->getElementsByTagName('style');
    $remove = array();

    foreach ($scripts as $item) {
        $remove[] = $item;
    }

    foreach ($styles as $item) {
        $remove[] = $item;
    }

    foreach ($remove as $item) {
        $item->parentNode->removeChild($item);
    }

    $html = $dom->saveHTML();
    $text = strip_tags($html);
    $text = trim(preg_replace('/\s\s+/', ' ', $text));

    if (!$text) {
        return '';
    }

    $text = substr($text, 0, $length);

    return $text;
}

/**
 * Render content for Recent Posts block
 *
 * @param array $attributes Attributes of the block
 *
 * @return null
 */
function advgbRenderBlockRecentPosts($attributes)
{
    global $advgb_recent_posts_saved;
    if ($advgb_recent_posts_saved) {
        return false;
    }
    $advgb_recent_posts_saved = true;

    $recent_posts = wp_get_recent_posts(
        array(
            'numberposts' => empty($attributes['numberOfPosts'])?8:$attributes['numberOfPosts'],
            'post_status' => 'publish',
            'order' => empty($attributes['order'])?'desc':$attributes['order'],
            'orderby' => empty($attributes['orderBy'])?'date':$attributes['orderBy'],
            'category' => empty($attributes['category'])?0:$attributes['category'],
        ),
        OBJECT
    );

    $postHtml = '';

    foreach ($recent_posts as $post) {
        $postThumbID = get_post_thumbnail_id($post->ID);

        $postHtml .= '<article class="advgb-recent-post">';

        if (isset($attributes['displayFeaturedImage']) && $attributes['displayFeaturedImage'] && $postThumbID) {
            $postHtml .= sprintf(
                '<div class="advgb-post-thumbnail"><a href="%1$s">%2$s</a></div>',
                get_permalink($post->ID),
                wp_get_attachment_image($postThumbID, 'large')
            );
        }

        $postHtml .= '<div class="advgb-post-wrapper">';

        $postHtml .= sprintf(
            '<h2 class="advgb-post-title"><a href="%1$s">%2$s</a></h2>',
            get_permalink($post->ID),
            get_the_title($post->ID)
        );

        $postHtml .= '<div class="advgb-post-info">';

        if (isset($attributes['displayAuthor']) && $attributes['displayAuthor']) {
            $postHtml .= sprintf(
                '<a href="%1$s" class="advgb-post-author" target="_blank">%2$s</a>',
                get_author_posts_url($post->post_author),
                get_the_author_meta('display_name', $post->post_author)
            );
        }

        if (isset($attributes['displayDate']) && $attributes['displayDate']) {
            $postHtml .= sprintf(
                '<span class="advgb-post-date">%1$s</span>',
                get_the_date('', $post->ID)
            );
        }

        $postHtml .= '</div>'; // end advgb-post-info

        $postHtml .= '<div class="advgb-post-content">';

        if (isset($attributes['displayExcerpt']) && $attributes['displayExcerpt']) {
            $introText = get_the_excerpt($post->ID);

            if (isset($attributes['displayExcerpt']) && $attributes['postTextAsExcerpt']) {
                if (!is_admin()) {
                    $postContent = apply_filters('the_content', get_post_field('post_content', $post->ID));
                    $introText = advgbExtractHtml($postContent, $attributes['postTextExcerptLength']);
                }
            }

            $postHtml .= sprintf(
                '<div class="advgb-post-excerpt">%1$s</div>',
                $introText
            );
        }

        if (isset($attributes['displayReadMore']) && $attributes['displayReadMore']) {
            $postHtml .= sprintf(
                '<div class="advgb-post-readmore"><a href="%1$s">%2$s</a></div>',
                get_permalink($post->ID),
                __('Read More', 'advanced-gutenberg')
            );
        }

        $postHtml .= '</div>'; // end advgb-post-content

        $postHtml .= '</div>'; // end advgb-post-wrapper

        $postHtml .= '</article>';
    }

    $blockClass = '';

    if ($attributes['postView'] === 'grid') {
        $blockClass = 'grid-view columns-' . $attributes['columns'];
    } elseif ($attributes['postView'] === 'list') {
        $blockClass = 'list-view';
    } elseif ($attributes['postView'] === 'slider') {
        $blockClass = 'slider-view';
    }

    if (isset($attributes['className'])) {
        $blockClass .= ' ' . $attributes['className'];
    }

    $blockHtml = sprintf(
        '<div class="advgb-recent-posts-block %2$s"><div class="advgb-recent-posts">%1$s</div></div>',
        $postHtml,
        esc_attr($blockClass)
    );

    return $blockHtml;
}

/**
 * Register block Recent Posts
 *
 * @return void
 */
function advgbRegisterBlockRecentPosts()
{
    if (!function_exists('register_block_type')) {
        return;
    }

    global $advgb_recent_posts_saved;
    $advgb_recent_posts_saved = false;

    register_block_type('advgb/recent-posts', array(
        'attributes' => array(
            'postView' => array(
                'type' => 'string',
                'default' => 'grid',
            ),
            'order' => array(
                'type' => 'string',
                'default' => 'desc',
            ),
            'orderBy'  => array(
                'type' => 'string',
                'default' => 'date',
            ),
            'category' => array(
                'type' => 'string',
            ),
            'numberOfPosts' => array(
                'type' => 'number',
                'default' => 8,
            ),
            'columns' => array(
                'type' => 'number',
                'default' => 2,
            ),
            'displayFeaturedImage' => array(
                'type' => 'boolean',
                'default' => true,
            ),
            'displayAuthor' => array(
                'type' => 'boolean',
                'default' => false,
            ),
            'displayDate' => array(
                'type' => 'boolean',
                'default' => false,
            ),
            'displayExcerpt' => array(
                'type' => 'boolean',
                'default' => true,
            ),
            'postTextAsExcerpt' => array(
                'type' => 'boolean',
                'default' => false,
            ),
            'postTextExcerptLength' => array(
                'type' => 'number',
                'default' => 150,
            ),
            'displayReadMore' => array(
                'type' => 'boolean',
                'default' => true,
            ),
            'myToken' => array(
                'type' => 'number',
            )
        ),
        'render_callback' => 'advgbRenderBlockRecentPosts',
    ));
}

add_action('init', 'advgbRegisterBlockRecentPosts');
