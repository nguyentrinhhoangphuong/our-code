<?php

/**
 * @snippet       [recently_viewed_products] Shortcode - WooCommerce
 * @how-to        businessbloomer.com/woocommerce-customization
 * @author        Rodolfo Melogli, Business Bloomer
 * @compatible    WooCommerce 8
 * @community     https://businessbloomer.com/club/
 */
 
add_action( 'template_redirect', 'bbloomer_track_product_view', 9999 );
 
function bbloomer_track_product_view() {
   if ( ! is_singular( 'product' ) ) return;
   global $post;
   if ( empty( $_COOKIE['bbloomer_recently_viewed'] ) ) {
      $viewed_products = array();
   } else {
      $viewed_products = wp_parse_id_list( (array) explode( '|', wp_unslash( $_COOKIE['bbloomer_recently_viewed'] ) ) );
   }
   $keys = array_flip( $viewed_products );
   if ( isset( $keys[ $post->ID ] ) ) {
      unset( $viewed_products[ $keys[ $post->ID ] ] );
   }
   $viewed_products[] = $post->ID;
   if ( count( $viewed_products ) > 15 ) {
      array_shift( $viewed_products );
   }
   wc_setcookie( 'bbloomer_recently_viewed', implode( '|', $viewed_products ) );
}
 
add_shortcode( 'recently_viewed_products', 'bbloomer_recently_viewed_shortcode' );
  
function bbloomer_recently_viewed_shortcode() {
   $viewed_products = ! empty( $_COOKIE['bbloomer_recently_viewed'] ) ? (array) explode( '|', wp_unslash( $_COOKIE['bbloomer_recently_viewed'] ) ) : array();
   $viewed_products = array_reverse( array_filter( array_map( 'absint', $viewed_products ) ) );
   if ( empty( $viewed_products ) ) return;
   $title = '<h3>Recently Viewed Products</h3>';
   $product_ids = implode( ",", $viewed_products );
   return $title . do_shortcode("[products ids='$product_ids']");
}
