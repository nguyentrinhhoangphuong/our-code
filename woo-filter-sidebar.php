<?php
// range filter
function custom_price_range_slider_filter_shortcode() {
    $base_url = wc_get_page_permalink('shop');
    $current_min_price = isset($_GET['min_price']) ? floatval($_GET['min_price']) : '';
    $current_max_price = isset($_GET['max_price']) ? floatval($_GET['max_price']) : '';

    ob_start();
    ?>
    <ul uk-accordion="multiple: true" class="uk-accordion">
        <li class="uk-open">
            <h3 class="uk-accordion-title">Khoảng Giá</h3>
            <div class="uk-accordion-content">
                <ul class="uk-child-width-1-2" uk-grid>
                    <?php
                    $price_ranges = [
                        ['min' => 0, 'max' => 5000000, 'label' => 'Dưới 5 triệu'],
                        ['min' => 5000000, 'max' => 10000000, 'label' => '5 - 10 triệu'],
                        ['min' => 10000000, 'max' => 15000000, 'label' => '10 - 15 triệu'],
                        ['min' => 15000000, 'max' => 0, 'label' => 'Trên 15 triệu'],
                    ];

                    foreach ($price_ranges as $range) {
                        $query_args = [];
                        if ($range['min'] > 0 || $range['max'] > 0) {
                            if ($range['min'] > 0) {
                                $query_args['min_price'] = $range['min'];
                            }
                            if ($range['max'] > 0) {
                                $query_args['max_price'] = $range['max'];
                            }
                        }

                        // Giữ các filter khác trong URL
                        if (!empty($_GET)) {
                            foreach ($_GET as $key => $value) {
                                if (strpos($key, 'filter_') === 0 || $key === 'filter_loai-san-pham') {
                                    $query_args[$key] = $value;
                                }
                            }
                        }

                        $price_url = add_query_arg($query_args, $base_url);

                        $is_active = ($current_min_price == $range['min'] && ($current_max_price == $range['max'] || ($range['max'] == 0 && $current_max_price === '')));
                        $active = $is_active ? "uk-button-primary" : 'uk-button-default';
                        if ($is_active) {
                            $price_url = remove_query_arg(['min_price', 'max_price'], $base_url);
                        } else {
                            $price_url = add_query_arg($query_args, $base_url);
                        }
                        echo '<li><button class="uk-button '.$active.' uk-width-1-1 filter-custom-button" type="button" onclick="window.location.href=\'' . esc_url($price_url) . '\'">' . esc_html($range['label']) . '</button></li>';
                    }
                    ?>
                </ul>

                <div class="price-range-container uk-margin-top">
                    <div class="uk-text-meta">Hoặc nhập giá trị phù hợp với bạn</div>
                    <form method="get" action="<?php echo esc_url($base_url); ?>" class="price_slider_wrapper" id="custom-price-filter-form">
                        <div class="price_slider_amount" data-step="10000">
                            <div class="uk-flex uk-flex-middle uk-flex-between uk-margin-small">
                                <div class="uk-width-1-2">
                                    <input type="text" class="uk-input min-price formatted-price" name="min_price_display" 
                                           value="<?php echo esc_attr($current_min_price ? number_format($current_min_price, 0, ',', '.') : ''); ?>" 
                                           placeholder="Min" data-raw-value="<?php echo esc_attr($current_min_price); ?>">
                                    <input type="hidden" name="min_price" class="min-price-raw" value="<?php echo esc_attr($current_min_price); ?>">
                                </div>
                                <div class="uk-width-auto uk-text-center">
                                    <img src="/wp-content/uploads/2025/09/tilde-svgrepo-com-1.svg" 
                                         alt="~" style="width: 20px; height: 20px; opacity: 0.6;">
                                </div>
                                <div class="uk-width-1-2">
                                    <input type="text" class="uk-input max-price formatted-price" name="max_price_display" 
                                           value="<?php echo esc_attr($current_max_price ? number_format($current_max_price, 0, ',', '.') : ''); ?>" 
                                           placeholder="Max" data-raw-value="<?php echo esc_attr($current_max_price); ?>">
                                    <input type="hidden" name="max_price" class="max-price-raw" value="<?php echo esc_attr($current_max_price); ?>">
                                </div>
                            </div>

                            <?php
                            ob_start();
                            the_widget('WC_Widget_Price_Filter', ['title' => '']);
                            $widget_content = ob_get_clean();
                            $widget_content = preg_replace('/<button[^>]*class="button"[^>]*>Filter<\/button>/i', '', $widget_content);
                            $widget_content = preg_replace('/<div[^>]*class="price_label"[^>]*>.*?<\/div>/is', '', $widget_content);
                            echo $widget_content;
                            ?>
                        </div>
                    </form>
                </div>
            </div>
        </li>
    </ul>
    <?php
    return ob_get_clean();
}
add_shortcode('price_range_slider_filter', 'custom_price_range_slider_filter_shortcode');

// danh mục
function custom_category_accordion_shortcode() {
    $categories = get_terms( array(
        'taxonomy' => 'product_cat',
        'hide_empty' => true,
    ) );

    $base_url = wc_get_page_permalink( 'shop' );
    $selected_categories = isset( $_GET['filter_loai-san-pham'] ) ? explode( ',', sanitize_text_field( $_GET['filter_loai-san-pham'] ) ) : array();

    $output = '<ul uk-accordion="multiple: true" class="uk-accordion">';
    $output .= '<li class="uk-open">';
    $output .= '<h3 class="uk-accordion-title">Loại Sản Phẩm</h3>';
    $output .= '<div class="uk-accordion-content">';
    $output .= '<ul class="uk-child-width-1-2" uk-grid>';

    if ( ! empty( $categories ) && ! is_wp_error( $categories ) ) {
        foreach ( $categories as $category ) {
            $is_selected = in_array( $category->slug, $selected_categories );

            $new_categories = $is_selected 
                ? array_diff( $selected_categories, array( $category->slug ) )
                : array_merge( $selected_categories, array( $category->slug ) ); 
            $new_categories = array_unique( $new_categories );

            $query_args = array();
            if ( ! empty( $new_categories ) ) {
                $query_args['filter_loai-san-pham'] = implode( ',', $new_categories );
            }

            if ( ! empty( $_GET ) ) {
                foreach ( $_GET as $key => $value ) {
                    if ( strpos( $key, 'filter_' ) === 0 && $key !== 'filter_loai-san-pham' ) {
                        $query_args[$key] = $value;
                    }
                }
            }

            $category_url = add_query_arg( $query_args, $base_url );

            $active = $is_selected ? 'uk-button-primary' : 'uk-button-default';
            $output .= '<li><button class="uk-button '.$active.' uk-width-1-1 filter-custom-button" uk-tooltip="'.esc_html( $category->name ).'" type="button" onclick="window.location.href=\'' . esc_url( $category_url ) . '\'">' . esc_html( $category->name ) . '</button></li>';
        }
    } else {
        $output .= '<li>Không có danh mục nào.</li>';
    }

    $output .= '</ul>';
    $output .= '</div>';
    $output .= '</li>';
    $output .= '</ul>';

    return $output;
}
add_shortcode( 'category_accordion', 'custom_category_accordion_shortcode' );

// các dm còn lại
function dynamic_taxonomy_filter_accordion_shortcode() {
    $taxonomies = array(
        'cong-nang'  => 'Công năng',
        'xuat-xu'    => 'Xuất xứ',
        'be-mat'     => 'Bề mặt',
    );

    $base_url = is_product_category() ? get_term_link( get_queried_object() ) : wc_get_page_permalink( 'shop' );
    $output = '<ul uk-accordion="multiple: true" class="uk-accordion">';

    foreach ( $taxonomies as $taxonomy => $title ) {
        $terms = array();
        $selected = isset( $_GET[ "filter_{$taxonomy}" ] ) 
            ? explode( ',', sanitize_text_field( $_GET[ "filter_{$taxonomy}" ] ) ) 
            : array();

        // Nếu đang ở danh mục → lọc sản phẩm trước
        if ( is_product_category() ) {
            $cat_slug = get_queried_object()->slug;

            $product_query = new WP_Query( array(
                'post_type'      => 'product',
                'posts_per_page' => -1,
                'fields'         => 'ids',
                'tax_query'      => array(
                    array(
                        'taxonomy' => 'product_cat',
                        'field'    => 'slug',
                        'terms'    => $cat_slug,
                    ),
                ),
            ) );

            $product_ids = $product_query->posts;

            if ( ! empty( $product_ids ) ) {
                $terms = wp_get_object_terms( $product_ids, $taxonomy, array(
                    'fields'     => 'all',
                    'orderby'    => 'name',
                    'hide_empty' => true,
                ) );
            }
        } else {
            // Nếu không ở danh mục → lấy toàn bộ
            $terms = get_terms( array(
                'taxonomy'   => $taxonomy,
                'hide_empty' => true,
            ) );
        }

        $output .= '<li class="uk-open">';
        $output .= '<h3 class="uk-accordion-title">' . esc_html( $title ) . '</h3>';
        $output .= '<div class="uk-accordion-content">';
        $output .= '<ul class="uk-child-width-1-2" uk-grid>';

        if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
            foreach ( $terms as $term ) {
                $is_selected = in_array( $term->slug, $selected, true );

                $new_selected = $is_selected 
                    ? array_diff( $selected, array( $term->slug ) )
                    : array_merge( $selected, array( $term->slug ) );

                $new_selected = array_unique( $new_selected );

                $query_args = array();
                if ( ! empty( $new_selected ) ) {
                    $query_args[ "filter_{$taxonomy}" ] = implode( ',', $new_selected );
                }
                
                // Giữ lại các filter khác
                if ( ! empty( $_GET ) ) {
                    foreach ( $_GET as $key => $value ) {
                        if ( strpos( $key, 'filter_' ) === 0 && $key !== "filter_{$taxonomy}" ) {
                            $query_args[$key] = sanitize_text_field( $value );
                        }
                    }
                }

                $term_url = add_query_arg( $query_args, $base_url );
                $active   = $is_selected ? 'uk-button-primary' : 'uk-button-default';

                $output .= '<li>';
                $output .= '<button class="uk-button ' . esc_attr( $active ) . ' uk-width-1-1 filter-custom-button" ';
                $output .= 'uk-tooltip="' . esc_attr( $term->name ) . '" ';
                $output .= 'type="button" onclick="window.location.href=\'' . esc_url( $term_url ) . '\'">';
                $output .= esc_html( $term->name );
                $output .= '</button>';
                $output .= '</li>';
            }
        } else {
            $output .= '<li>Không có bộ lọc phù hợp.</li>';
        }

        $output .= '</ul>';
        $output .= '</div>';
        $output .= '</li>';
    }

    $output .= '</ul>';
    return $output;
}
add_shortcode( 'dynamic_taxonomy_filter', 'dynamic_taxonomy_filter_accordion_shortcode' );

function apply_filter_loai_san_pham( $q ) {
    $tax_query = $q->get( 'tax_query' ) ?: array();

    $category_slugs = array();

    // Ưu tiên filter_loai-san-pham nếu có
    if ( isset( $_GET['filter_loai-san-pham'] ) && ! empty( $_GET['filter_loai-san-pham'] ) ) {
        $category_slugs = explode( ',', sanitize_text_field( $_GET['filter_loai-san-pham'] ) );
    }

    // Nếu không có filter và đang ở category page → dùng context
    elseif ( is_product_category() && ! isset( $_GET['filter_loai-san-pham'] ) ) {
        $current_cat = get_queried_object();
        if ( $current_cat && ! is_wp_error( $current_cat ) ) {
            $category_slugs[] = $current_cat->slug;
        }
    }

    if ( ! empty( $category_slugs ) ) {
        $tax_query[] = array(
            'taxonomy' => 'product_cat',
            'field'    => 'slug',
            'terms'    => $category_slugs,
            'operator' => 'IN',
        );
    }

    $other_taxonomies = array( 'cong-nang', 'xuat-xu', 'be-mat' );
    
    foreach ( $other_taxonomies as $taxonomy ) {
        if ( isset( $_GET["filter_{$taxonomy}"] ) && ! empty( $_GET["filter_{$taxonomy}"] ) ) {
            $terms = explode( ',', sanitize_text_field( $_GET["filter_{$taxonomy}"] ) );
            $tax_query[] = array(
                'taxonomy' => $taxonomy,
                'field'    => 'slug',
                'terms'    => $terms,
                'operator' => 'IN',
            );
        }
    }

    if ( count( $tax_query ) > 1 ) {
        $tax_query['relation'] = 'AND';
    }

    $q->set( 'tax_query', $tax_query );
}
add_action( 'woocommerce_product_query', 'apply_filter_loai_san_pham' );

add_action('wp_footer', function () {
    if (is_shop() || is_product_category()) {
        echo '<div id="hidden-category-accordion" style="display:none;">';
        echo do_shortcode('[category_accordion]');
        echo '</div>';

        echo '<div id="hidden-price-filter" style="display:none;">';
        echo do_shortcode('[price_range_slider_filter]');
        echo '</div>';

        echo '<div id="hidden-get_all_category_accordion" style="display:none;">';
        echo do_shortcode('[dynamic_taxonomy_filter]');
        echo '</div>';
    }
    ?>
    <script>
    (function() {
        console.error = function () {
            if (
                arguments[0] &&
                typeof arguments[0] === "string" &&
                arguments[0].includes("Duplicate id attribute value")
            ) {
                return;
            }
            Function.prototype.apply.call(console.__proto__.error, console, arguments);
        };
    })();
    </script>
    <?php
});

function custom_ordering_select_shortcode() {
    $current_orderby = isset($_GET['orderby']) ? sanitize_text_field($_GET['orderby']) : 'menu_order';

    $labels = [
        'popularity' => 'Hàng bán chạy',
        'rating' => 'Giảm nhiều nhất',
        'date' => 'Hàng mới về',
        'price' => 'Giá tăng dần',
        'price-desc' => 'Giá giảm dần',
        'menu_order' => 'Tất cả'
    ];

    $current_label = isset($labels[$current_orderby]) ? $labels[$current_orderby] : 'Tất cả';

    ob_start();
    ?>
    <label for="orderby" class="orderby-label uk-visible@m">Sắp xếp theo</label>
    <div class="uk-inline">
        <button class="uk-button custom-dropdown-button" type="button"><?php echo esc_html($current_label); ?></button>
        <div uk-dropdown="pos: bottom-center">
            <ul class="uk-nav uk-dropdown-nav">
                <?php foreach ($labels as $value => $label): ?>
                    <li>
                        <a href="#" data-orderby="<?php echo esc_attr($value); ?>"><?php echo esc_html($label); ?></a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>

    <?php 
    // Giữ lại toàn bộ filter đang có trên URL
    foreach ($_GET as $key => $value) {
        if ($key !== 'orderby') {
            if (is_array($value)) {
                foreach ($value as $v) {
                    echo '<input type="hidden" name="'.esc_attr($key).'[]" value="'.esc_attr($v).'">';
                }
            } else {
                echo '<input type="hidden" name="'.esc_attr($key).'" value="'.esc_attr($value).'">';
            }
        }
    }
    ?>
    <?php
    return ob_get_clean();
}
add_shortcode('custom_ordering', 'custom_ordering_select_shortcode');















<script>
document.addEventListener('DOMContentLoaded', function () {
  let offcanvas = document.querySelector('#tm-element-woo-filter-offcanvas .uk-offcanvas-bar');
  let shortcodeOrder = ['hidden-get_all_category_accordion', 'hidden-price-filter', 'hidden-category-accordion', 'text-bo-loc-tim-kiem'];
  if (offcanvas) {
    shortcodeOrder.forEach(function (id) {
      let hidden = document.getElementById(id);
      if (hidden) {
        offcanvas.insertAdjacentHTML('afterbegin', hidden.innerHTML);
      }
    });
  }
});


document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('.custom-dropdown-button');
  const labels = {
    popularity: 'Hàng bán chạy',
    rating: 'Giảm nhiều nhất',
    date: 'Hàng mới về',
    price: 'Giá tăng dần',
    'price-desc': 'Giá giảm dần',
    menu_order: 'Tất cả'
  };

  const currentParams = new URLSearchParams(window.location.search);
  const currentOrderby = currentParams.get('orderby') || 'menu_order';
  if (button && labels[currentOrderby]) {
    button.textContent = labels[currentOrderby];
  }

  document.querySelectorAll('[data-orderby]').forEach(link => {
    currentParams.set('orderby', link.dataset.orderby);
    link.href = '?' + currentParams.toString();
  });
});

    
document.addEventListener('DOMContentLoaded', function () {
  const filterLists = document.querySelectorAll('.woocommerce-widget-layered-nav-list');

  filterLists.forEach(list => {
    list.classList.add('uk-grid', 'uk-child-width-1-2');
    list.setAttribute('uk-grid', '');

    const checkboxes = list.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
      const label = checkbox.closest('label');
      if (!label) return;

      const listItem = label.closest('li');
      if (!listItem) return;

      listItem.classList.add('uk-panel', 'filter-button-item');

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'uk-button uk-button-default uk-width-1-1 filter-custom-button';
      button.setAttribute('uk-tooltip', label.textContent.trim());
      button.textContent = label.textContent.trim();

      button.addEventListener('click', function () {
        checkbox.checked = !checkbox.checked;
        this.classList.toggle('uk-button-primary', checkbox.checked);
        this.classList.toggle('uk-button-default', !checkbox.checked);

        const event = new Event('change', { bubbles: true });
        checkbox.dispatchEvent(event);
      });

      label.parentNode.replaceChild(button, label);
      checkbox.style.display = 'none';
      button.parentNode.appendChild(checkbox);

      if (checkbox.checked) {
        button.classList.remove('uk-button-default');
        button.classList.add('uk-button-primary');
      }
    });
  });
});    
</script>
