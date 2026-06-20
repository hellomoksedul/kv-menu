/**
 * KV Menu - Admin Menus Page Interactions
 */
( function( $ ) {
	'use strict';

	$( document ).ready( function() {
		// Toggle options wrapper visibility when checking/unchecking the box
		$( document ).on( 'change', '.kv-menu-mega-enabled-checkbox', function() {
			var $checkbox = $( this );
			var $wrapper = $checkbox.closest( '.kv-menu-mega-fields-container' ).find( '.kv-menu-mega-options-wrapper' );
			
			if ( $checkbox.is( ':checked' ) ) {
				$wrapper.slideDown( 250 );
			} else {
				$wrapper.slideUp( 250 );
			}
		} );

		// Show/hide custom width settings when width type dropdown changes
		$( document ).on( 'change', '.kv-menu-mega-width-type-select', function() {
			var $select = $( this );
			var val = $select.val();
			var $customWidthWrapper = $select.closest( '.kv-menu-mega-fields-container' ).find( '.kv-menu-mega-custom-width-wrapper' );
			
			if ( 'custom' === val ) {
				$customWidthWrapper.slideDown( 250 );
			} else {
				$customWidthWrapper.slideUp( 250 );
			}
		} );

		// Dynamic template select change: update edit button href or toggle visibility of edit/create buttons
		$( document ).on( 'change', '.kv-menu-mega-template-select', function() {
			var $select = $( this );
			var val = $select.val();
			var $container = $select.closest( '.kv-menu-mega-fields-container' );
			var $editBtn = $container.find( '.kv-menu-edit-mega-btn' );
			var $createBtn = $container.find( '.kv-menu-create-mega-btn' );

			if ( val ) {
				// We have a template selected. Build edit URL
				var editUrl = window.location.origin + window.location.pathname.replace( 'nav-menus.php', 'post.php' ) + '?post=' + val + '&action=elementor';
				$editBtn.attr( 'href', editUrl ).show();
				$createBtn.hide();
			} else {
				$editBtn.attr( 'href', '#' ).hide();
				$createBtn.show();
			}
		} );

		// AJAX template creation on click
		$( document ).on( 'click', '.kv-menu-create-mega-btn', function( e ) {
			e.preventDefault();
			var $btn = $( this );
			var itemId = $btn.data( 'item-id' );
			var $container = $btn.closest( '.kv-menu-mega-fields-container' );
			var $spinner = $container.find( '.kv-menu-mega-spinner' );
			var $select = $container.find( '.kv-menu-mega-template-select' );
			var $editBtn = $container.find( '.kv-menu-edit-mega-btn' );

			if ( ! itemId ) {
				return;
			}

			$btn.prop( 'disabled', true );
			$spinner.addClass( 'is-active' );

			$.ajax( {
				url: kvMenuAdmin.ajaxurl,
				type: 'POST',
				data: {
					action: 'kv_menu_create_mega_template',
					item_id: itemId,
					security: kvMenuAdmin.security
				},
				success: function( response ) {
					$spinner.removeClass( 'is-active' );
					$btn.prop( 'disabled', false );

					if ( response.success ) {
						var data = response.data;
						
						// Add new option to dropdown list and select it
						if ( $select.find( 'option[value="' + data.template_id + '"]' ).length === 0 ) {
							$select.append( new Option( data.title + ' (#' + data.template_id + ')', data.template_id ) );
						}
						$select.val( data.template_id );

						// Update edit button href and toggle view
						$editBtn.attr( 'href', data.edit_url ).show();
						$btn.hide();

						// Open the editor in a new window/tab
						window.open( data.edit_url, '_blank' );
					} else {
						alert( response.data || 'Failed to create template.' );
					}
				},
				error: function() {
					$spinner.removeClass( 'is-active' );
					$btn.prop( 'disabled', false );
					alert( 'Network or server error occurred. Please try again.' );
				}
			} );
		} );
	} );

} )( jQuery );
