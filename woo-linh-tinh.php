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
