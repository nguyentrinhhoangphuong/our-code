function setup_views_counter() {
    add_action('template_redirect', function() {

        if (!is_single()) return;

        global $post;
        if (!$post) return;

        $post_id    = $post->ID;
        $meta_key   = 'post_views_count';
        $cookie_key = 'viewed_post_' . $post_id;

        if (isset($_COOKIE[$cookie_key])) {
            return;
        }

        setcookie($cookie_key, '1', time() + 3600, '/');

        $count = get_post_meta($post_id, $meta_key, true);
        if ($count == '') {
            add_post_meta($post_id, $meta_key, 1);
        } else {
            $count++;
            update_post_meta($post_id, $meta_key, $count);
        }
    });

    add_shortcode('views-counts', function($atts = []) {
        global $post;
        if (!$post) return '0';

        $a = shortcode_atts([
            'id' => $post->ID,
        ], $atts);

        $meta_key = 'post_views_count';
        $count = get_post_meta($a['id'], $meta_key, true);

        if ($count == '') {
            add_post_meta($a['id'], $meta_key, 0);
            $count = 0;
        }

        return number_format_i18n($count);
    });
}
setup_views_counter();
