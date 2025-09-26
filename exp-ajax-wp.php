<?php
function project_search_form() {
  ob_start();
  ?>
    <div class="search-form-wrapper">
      <form class="uk-form-stacked" method="get" action="<?php echo get_post_type_archive_link('du-an'); ?>">
        
        <input type="hidden" name="post_type" value="du-an">

        <div class="search-input-wrapper uk-width-expand@s">
          <img src="/wp-content/uploads/2025/09/Frame-2.svg" alt="Search Icon" class="search-icon">
          <input class="uk-search-input" type="text" placeholder="Tìm dự án" name="s" 
                 value="<?php echo isset($_GET['s']) ? esc_attr($_GET['s']) : ''; ?>">
        </div>

        <div class="uk-grid-small field-wraper uk-flex-middle uk-margin-medium-top" uk-grid>
          
          <!-- Lĩnh vực -->
          <div class="uk-width-1-2 uk-width-auto@s">
            <select class="uk-select" name="linh-vuc" id="linh-vuc-select">
              <option value="">Lĩnh vực</option>
              <?php 
                $terms = get_terms(['taxonomy' => 'linh-vuc', 'hide_empty' => true]);
                foreach ($terms as $term) {
                  $selected = (isset($_GET['linh-vuc']) && $_GET['linh-vuc'] === $term->slug) ? 'selected' : '';
                  printf('<option value="%s" %s>%s</option>',
                      esc_attr($term->slug),
                      $selected,
                      esc_html($term->name)
                  );
                }
              ?>
            </select>
          </div>

          <!-- Location -->
          <div class="uk-width-1-2 uk-width-auto@s">
            <select class="uk-select" name="location" id="location-select">
              <option value="">Tỉnh/Thành phố</option>
              <?php
                $terms = get_terms(['taxonomy' => 'location', 'hide_empty' => true]);
                foreach ($terms as $term) {
                  $selected = (isset($_GET['location']) && $_GET['location'] === $term->slug) ? 'selected' : '';
                  printf('<option value="%s" %s>%s</option>',
                      esc_attr($term->slug),
                      $selected,
                      esc_html($term->name)
                  );
                }
              ?>
            </select>
          </div>

          <!-- Nút submit -->
          <div class="uk-width-auto@s uk-text-center uk-btn uk-margin-medium-top"> 
            <button class="uk-button uk-button-default" type="submit">Tìm kiếm</button>
          </div>
        </div>
      </form>
    </div>
  <?php
  return ob_get_clean();
}
add_shortcode('project_search_form', 'project_search_form');


add_action('wp_head', function() {
    if (!is_admin()) {
        echo '<script>var ajaxurl = "' . admin_url('admin-ajax.php') . '";</script>';
    }
});

function get_locations_by_linh_vuc() {
    $linh_vuc = sanitize_text_field($_POST['linh_vuc']);
    $args = [
        'post_type' => 'du-an',
        'posts_per_page' => -1,
        'tax_query' => [[
            'taxonomy' => 'linh-vuc',
            'field' => 'slug',
            'terms' => $linh_vuc,
        ]]
    ];

    $query = new WP_Query($args);
    $locations = [];

    foreach ($query->posts as $post) {
        $terms = wp_get_post_terms($post->ID, 'location');
        foreach ($terms as $term) {
            $locations[$term->slug] = $term->name;
        }
    }

    wp_send_json(array_unique($locations));
}
add_action('wp_ajax_get_locations_by_linh_vuc', 'get_locations_by_linh_vuc');
add_action('wp_ajax_nopriv_get_locations_by_linh_vuc', 'get_locations_by_linh_vuc');

function get_linh_vuc_by_location() {
    $location = sanitize_text_field($_POST['location']);

    $args = [
        'post_type' => 'du-an',
        'posts_per_page' => -1,
        'tax_query' => [[
            'taxonomy' => 'location',
            'field' => 'slug',
            'terms' => $location,
        ]]
    ];

    $query = new WP_Query($args);
    $linh_vucs = [];

    foreach ($query->posts as $post) {
        $terms = wp_get_post_terms($post->ID, 'linh-vuc');
        foreach ($terms as $term) {
            $linh_vucs[$term->slug] = $term->name;
        }
    }

    wp_send_json(array_unique($linh_vucs));
}
add_action('wp_ajax_get_linh_vuc_by_location', 'get_linh_vuc_by_location');
add_action('wp_ajax_nopriv_get_linh_vuc_by_location', 'get_linh_vuc_by_location');


function get_all_locations() {
    $terms = get_terms(['taxonomy' => 'location', 'hide_empty' => true]);
    $results = [];
    foreach ($terms as $term) {
        $results[$term->slug] = $term->name;
    }
    wp_send_json($results);
}
add_action('wp_ajax_get_all_locations', 'get_all_locations');
add_action('wp_ajax_nopriv_get_all_locations', 'get_all_locations');


function get_all_linh_vuc() {
    $terms = get_terms(['taxonomy' => 'linh-vuc', 'hide_empty' => true]);
    $results = [];
    foreach ($terms as $term) {
        $results[$term->slug] = $term->name;
    }
    wp_send_json($results);
}
add_action('wp_ajax_get_all_linh_vuc', 'get_all_linh_vuc');
add_action('wp_ajax_nopriv_get_all_linh_vuc', 'get_all_linh_vuc');


function filter_du_an_archive( $query ) {
    if ( is_admin() || ! $query->is_main_query() ) {
        return;
    }

    if ( is_post_type_archive( 'du-an' ) || ( isset( $_GET['post_type'] ) && $_GET['post_type'] === 'du-an' ) ) {
        $query->set( 'post_type', 'du-an' );

        $tax_query = ['relation' => 'AND'];

        if ( ! empty( $_GET['linh-vuc'] ) ) {
            $tax_query[] = [
                'taxonomy' => 'linh-vuc',
                'field'    => 'slug',
                'terms'    => sanitize_text_field( $_GET['linh-vuc'] ),
            ];
        }

        if ( ! empty( $_GET['location'] ) ) {
            $tax_query[] = [
                'taxonomy' => 'location',
                'field'    => 'slug',
                'terms'    => sanitize_text_field( $_GET['location'] ),
            ];
        }

        if ( count( $tax_query ) > 1 ) {
            $query->set( 'tax_query', $tax_query );
        }

        if ( ! empty( $_GET['s'] ) ) {
            $keyword = sanitize_text_field( $_GET['s'] );

            $query->set( 'meta_query', [
                [
                    'key'     => 'thong_tin_chi_tiet_ten_du_an',
                    'value'   => $keyword,
                    'compare' => 'LIKE',
                ]
            ] );

            $query->set( 's', '' );
        }

    }
}
add_action( 'pre_get_posts', 'filter_du_an_archive' );





<script>
document.addEventListener('DOMContentLoaded', function () {
  const linhVucSelect = document.getElementById('linh-vuc-select');
  const locationSelect = document.getElementById('location-select');
  if (!linhVucSelect || !locationSelect) return;

  linhVucSelect.addEventListener('change', function () {
    const selectedLinhVuc = linhVucSelect.value;
    const selectedLocation = locationSelect.value;

    if (selectedLinhVuc === '') {
      fetchAllLocations();
      fetchAllLinhVuc();
    } else {
      const formData = new FormData();
      formData.append('action', 'get_locations_by_linh_vuc');
      formData.append('linh_vuc', selectedLinhVuc);

      fetch(ajaxurl, {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          locationSelect.innerHTML = '<option value="">Tỉnh/Thành phố</option>';
          let stillValid = false;

          for (const slug in data) {
            const option = document.createElement('option');
            option.value = slug;
            option.textContent = data[slug];
            if (slug === selectedLocation) stillValid = true;
            locationSelect.appendChild(option);
          }

          if (stillValid) {
            locationSelect.value = selectedLocation;
          }
        })
        .catch(error => {
          console.error('Error fetching locations:', error);
        });
    }
  });

  locationSelect.addEventListener('change', function () {
    const selectedLocation = locationSelect.value;
    const selectedLinhVuc = linhVucSelect.value;

    if (selectedLocation === '') {
      fetchAllLocations();
      fetchAllLinhVuc();
    } else {
      const formData = new FormData();
      formData.append('action', 'get_linh_vuc_by_location');
      formData.append('location', selectedLocation);

      fetch(ajaxurl, {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          linhVucSelect.innerHTML = '<option value="">Lĩnh vực</option>';
          let stillValid = false;

          for (const slug in data) {
            const option = document.createElement('option');
            option.value = slug;
            option.textContent = data[slug];
            if (slug === selectedLinhVuc) stillValid = true;
            linhVucSelect.appendChild(option);
          }

          if (stillValid) {
            linhVucSelect.value = selectedLinhVuc;
          }
        })
        .catch(error => {
          console.error('Error fetching linh vuc:', error);
        });
    }
  });

  function fetchAllLocations() {
    const formData = new URLSearchParams();
    formData.append('action', 'get_all_locations');

    fetch(ajaxurl, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        locationSelect.innerHTML = '<option value="">Tỉnh/Thành phố</option>';
        for (const slug in data) {
          const option = document.createElement('option');
          option.value = slug;
          option.textContent = data[slug];
          locationSelect.appendChild(option);
        }
      })
      .catch(error => {
        console.error('Error in fetchAllLocations:', error);
      });
  }

  function fetchAllLinhVuc() {
    const formData = new URLSearchParams();
    formData.append('action', 'get_all_linh_vuc');

    fetch(ajaxurl, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        linhVucSelect.innerHTML = '<option value="">Lĩnh vực</option>';
        for (const slug in data) {
          const option = document.createElement('option');
          option.value = slug;
          option.textContent = data[slug];
          linhVucSelect.appendChild(option);
        }
      })
      .catch(error => {
        console.error('Error in fetchAllLinhVuc:', error);
      });
  }
});  
  
</script>
