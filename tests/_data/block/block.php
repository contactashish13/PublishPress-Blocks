<?php
/*
Plugin Name: Test block
Description: Test block
Author: Joomunited
Version: 1.0
*/

function gutenberg_test_block_register_block() {
    if (!function_exists('register_block_type')) {
        return;
    }

    wp_register_script(
        'gutenberg-test-block',
        plugins_url('block.js', __FILE__ ),
        array('wp-blocks', 'wp-element')
    );

    register_block_type('gutenberg-test-block/test', array(
        'editor_script' => 'gutenberg-test-block'
    ));
}

add_action('init', 'gutenberg_test_block_register_block');
