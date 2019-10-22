(function ( wpI18n, wpBlocks, wpEditor ) {
    const { __ } = wpI18n;
    const { registerBlockType } = wpBlocks;
    const { InnerBlocks } = wpEditor;
    const { SVG, Path } = wp.components;

    const advGalleryBlockIcon = (
        <SVG xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="2 2 22 22">
            <Path d="M0 0h24v24H0z" fill="none" />
            <Path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
        </SVG>
    );

    registerBlockType( 'advgb/gallery-loadmore', {
        title: __( 'Adv.Gallery with load more' ),
        icon: {
            src: advGalleryBlockIcon,
            foreground: typeof advgbBlocks !== 'undefined' ? advgbBlocks.color : undefined,
        },
        category: 'advgb-category',
        keywords: [ __( 'gallery', 'advanced-gutenberg' ), __( 'photos', 'advanced-gutenberg' ), __( 'masonry', 'advanced-gutenberg' ) ],
        attributes: {},
        supports: {
            align: true,
        },
        edit: function ( props ) {
            return (
                <InnerBlocks
                    template={ [
                        [ 'advgb/gallery', { enableLoadMore: true } ],
                        [ 'advgb/button', {
                            className: 'advgb-load-more',
                            text: 'Load More',
                            align: 'center',
                            disableLink: true,
                        } ]
                    ] }
                    templateLock={ true }
                />
            )
        },
        save: function ( props ) {
            return (
                <div className="advgb-gallery-container">
                    <InnerBlocks.Content />
                </div>
            )
        },
    } );
})( wp.i18n, wp.blocks, wp.editor );
