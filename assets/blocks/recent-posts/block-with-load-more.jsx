(function ( wpI18n, wpBlocks, wpEditor ) {
    const { __ } = wpI18n;
    const { registerBlockType } = wpBlocks;
    const { InnerBlocks } = wpEditor;

    const advRecentPostsBlockIcon = (
        <svg width="20" height="20" viewBox="2 2 22 22">
            <path fill="none" d="M0,0h24v24H0V0z"/>
            <rect x="13" y="7.5" width="5" height="2"/>
            <rect x="13" y="14.5" width="5" height="2"/>
            <path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z"/>
            <path d="M11,6H6v5h5V6z M10,10H7V7h3V10z"/>
            <path d="M11,13H6v5h5V13z M10,17H7v-3h3V17z"/>
        </svg>
    );

    registerBlockType( 'advgb/rp-loadmore', {
        title: __( 'Recent Posts with load more' ),
        icon: {
            src: advRecentPostsBlockIcon,
            foreground: typeof advgbBlocks !== 'undefined' ? advgbBlocks.color : undefined,
        },
        category: 'advgb-category',
        keywords: [ __( 'latest posts' ), __( 'articles' ), __( 'layout' ) ],
        attributes: {},
        supports: {
            align: true,
        },
        edit: function ( props ) {
            return (
                <InnerBlocks
                    template={ [
                        [ 'advgb/recent-posts', { disableSliderView: true } ],
                        [ 'advgb/button', {
                            className: 'advgb-load-more',
                            text: 'Load More',
                            align: 'center',
                        } ]
                    ] }
                    templateLock={ true }
                />
            )
        },
        save: function ( props ) {
            return (
                <div className="advgb-recent-posts-container">
                    <InnerBlocks.Content />
                </div>
            )
        },
    } );
})( wp.i18n, wp.blocks, wp.editor );