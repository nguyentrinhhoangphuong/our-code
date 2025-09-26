<?php
// custom đơn vị tiền
function change_existing_currency_symbol( $currency_symbol, $currency ) {
    switch( $currency ) {
        case 'VND':
            $currency_symbol = 'đ'; 
            break;
    }
    return $currency_symbol;
}
add_filter('woocommerce_currency_symbol', 'change_existing_currency_symbol', 10, 2);


// đổi sale sang %
function sale_badge_percentage() {
   global $product;
   if ( ! $product->is_on_sale() ) return;
   if ( $product->is_type( 'simple' ) ) {
      $max_percentage = ( ( $product->get_regular_price() - $product->get_sale_price() ) / $product->get_regular_price() ) * 100;
   } elseif ( $product->is_type( 'variable' ) ) {
      $max_percentage = 0;
      foreach ( $product->get_children() as $child_id ) {
         $variation = wc_get_product( $child_id );
         $price = $variation->get_regular_price();
         $sale = $variation->get_sale_price();
         if ( $price != 0 && ! empty( $sale ) ) $percentage = ( $price - $sale ) / $price * 100;
         if ( $percentage > $max_percentage ) {
            $max_percentage = $percentage;
         }
      }
   }
   if ( $max_percentage > 0 ) echo "<span class='onsale'>-" . round($max_percentage) . "%</span>";
}
add_action( 'woocommerce_sale_flash', 'sale_badge_percentage', 25 );

// lấy tên danh mục
function get_current_category_name_shortcode($atts = []) {
    $atts = shortcode_atts([
        'fallback' => 'Sản phẩm',
        'uppercase' => 'false',  
        'prefix' => '',          
        'suffix' => '',      
    ], $atts);
    
    $category_name = '';
    
    // Kiểm tra xem có đang ở product category page không
    if (is_product_category()) {
        $current_category = get_queried_object();
        
        if ($current_category && !is_wp_error($current_category)) {
            $category_name = $current_category->name;
        }
    }
    
    if (empty($category_name)) {
        $category_name = $atts['fallback'];
    }
    
    if ($atts['uppercase'] === 'true') {
        $category_name = strtoupper($category_name);
    }
    
    $result = $atts['prefix'] . $category_name . $atts['suffix'];
    
    return esc_html($result);
}
add_shortcode('current_category_name', 'get_current_category_name_shortcode');
