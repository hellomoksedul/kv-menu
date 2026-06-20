/**
 * KV Menu - Frontend Widget Handler (Drilldown Mobile Flow)
 */
( function( $ ) {
	'use strict';

	var KVMenuHandler = function( $scope, $ ) {
		var $wrapper = $scope.find( '.kv-menu-wrapper' );
		var $toggleBtn = $scope.find( '.kv-menu-toggle-btn' );
		var $closeBtn = $scope.find( '.kv-menu-close-btn' );
		var $backBtn = $scope.find( '.kv-menu-back-btn' );
		var $nav = $scope.find( '.kv-menu-nav' );

		function updateBackButton() {
			var activeCount = $scope.find( '.sub-menu.is-active, .kv-menu-mega-panel.is-active' ).length;
			var $mobileLogo = $scope.find( '.kv-menu-mobile-logo-container' );
			if ( activeCount > 0 ) {
				$backBtn.show();
				$mobileLogo.hide();
			} else {
				$backBtn.hide();
				$mobileLogo.show();
			}
		}

		function closeMenu() {
			$wrapper.removeClass( 'kv-menu--open' );
			$toggleBtn.attr( 'aria-expanded', 'false' );
			$nav.attr( 'aria-hidden', 'true' );
			// Reset all drilldown submenu states
			$scope.find( '.sub-menu, .kv-menu-mega-panel' ).removeClass( 'is-active' );
			updateBackButton();
		}

		// Hamburger button toggle click
		$toggleBtn.on( 'click', function( e ) {
			e.preventDefault();
			var isExpanded = $toggleBtn.attr( 'aria-expanded' ) === 'true';

			if ( ! isExpanded ) {
				$wrapper.addClass( 'kv-menu--open' );
				$toggleBtn.attr( 'aria-expanded', 'true' );
				$nav.attr( 'aria-hidden', 'false' );
			} else {
				closeMenu();
			}
		} );

		// Close button inside drawer click
		$closeBtn.on( 'click', function( e ) {
			e.preventDefault();
			closeMenu();
		} );

		// Back button inside drawer click
		$backBtn.on( 'click', function( e ) {
			e.preventDefault();
			var $activeSubmenus = $scope.find( '.sub-menu.is-active, .kv-menu-mega-panel.is-active' );
			if ( $activeSubmenus.length > 0 ) {
				// Slide out the deepest active submenu
				$activeSubmenus.last().removeClass( 'is-active' );
			}
			updateBackButton();
		} );

		// Submenu drilldown sliding transition on parent item click
		$scope.find( '.kv-menu-list .menu-item-has-children > a, .kv-menu-list .menu-item-has-mega-menu > a' ).on( 'click', function( e ) {
			var isResponsive = $scope.find( '.kv-menu-toggle-container' ).is( ':visible' );

			if ( isResponsive ) {
				e.preventDefault();
				var $subMenu = $( this ).siblings( '.sub-menu, .kv-menu-mega-panel' ).filter( function() {
					return $( this ).css( 'display' ) !== 'none';
				} );
				
				// Slide in the child sub-menu or mega menu
				$subMenu.addClass( 'is-active' );
				updateBackButton();
			}
		} );

		// Close menu when clicking on the dark body overlay
		$wrapper.on( 'click', function( e ) {
			// If the target is the wrapper itself (which holds the overlay pseudo-element)
			if ( $( e.target ).is( $wrapper ) ) {
				closeMenu();
			}
		} );

		// Reset menu states when resizing back to desktop viewport
		$( window ).on( 'resize', function() {
			var isResponsive = $scope.find( '.kv-menu-toggle-container' ).is( ':visible' );
			if ( ! isResponsive ) {
				closeMenu();
				$nav.removeAttr( 'aria-hidden' );
			}
		} );
	};

	// Bind to Elementor frontend hooks
	$( window ).on( 'elementor/frontend/init', function() {
		elementorFrontend.hooks.addAction( 'frontend/element_ready/kv-menu.default', KVMenuHandler );
	} );

} )( jQuery );
