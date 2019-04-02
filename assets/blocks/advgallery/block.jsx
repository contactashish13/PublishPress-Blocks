(function ( wpI18n, wpBlocks, wpElement, wpEditor, wpComponents ) {
    const { __ } = wpI18n;
    const { Component, Fragment } = wpElement;
    const { registerBlockType } = wpBlocks;
    const { InspectorControls, PanelColorSettings, MediaUpload, MediaPlaceholder, BlockControls } = wpEditor;
    const { SVG, Path, Toolbar, PanelBody, RangeControl, ToggleControl , SelectControl, IconButton, Button, Tooltip } = wpComponents;

    const advGalleryBlockIcon = (
        <SVG xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="2 2 22 22">
            <Path d="M0 0h24v24H0z" fill="none" />
            <Path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
        </SVG>
    );

    class AdvGallery extends Component {
        constructor() {
            super ( ...arguments );
        }

        render() {
            return (
                <div>123</div>
            )
        }
    }

    const blockAttrs = {
        images: {
            type: 'array',
            default: [],
            source: 'query',
            selector: 'div.advgb-gallery .advgb-gallery-item',
            query: {
                url: {
                    source: 'attribute',
                    selector: 'img',
                    attribute: 'src',
                },
                id : {
                    source: 'attribute',
                    selector: 'img',
                    attribute: 'data-id',
                },
                alt: {
                    source: 'attribute',
                    selector: 'img',
                    attribute: 'alt',
                    default: '',
                },
                caption: {
                    type: 'string',
                    source: 'html',
                    selector: 'figcaption',
                },
            },
        },
        columns: {
            type: 'number',
        },
        layout: {
            type: 'string',
        },
        itemsToShow: {
            type: 'number',
            default: 0,
        },
        changed: {
            type: 'boolean',
            default: false,
        },
    };

    registerBlockType( 'advgb/gallery', {
        title: __( 'Adv Gallery' ),
        description: __( 'Advanced gallery with enhanced functions.' ),
        icon: {
            src: advGalleryBlockIcon,
            foreground: typeof advgbBlocks !== 'undefined' ? advgbBlocks.color : undefined,
        },
        category: 'advgb-category',
        keywords: [ __( 'slide' ), __( 'gallery' ), __( 'photos' ) ],
        attributes: blockAttrs,
        edit: AdvGallery,
        save: function ( { attributes } ) {
            return null;
        },
    } )
})( wp.i18n, wp.blocks, wp.element, wp.editor, wp.components );