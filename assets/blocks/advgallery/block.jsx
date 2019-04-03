(function ( wpI18n, wpBlocks, wpElement, wpEditor, wpComponents ) {
    const { __ } = wpI18n;
    const { Component, Fragment } = wpElement;
    const { registerBlockType } = wpBlocks;
    const { InspectorControls, RichText, MediaUpload, MediaPlaceholder, BlockControls, BlockIcon } = wpEditor;
    const { SVG, Path, Toolbar, PanelBody, RangeControl, ToggleControl , SelectControl, IconButton, Button, Tooltip } = wpComponents;

    const advGalleryBlockIcon = (
        <SVG xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="2 2 22 22">
            <Path d="M0 0h24v24H0z" fill="none" />
            <Path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
        </SVG>
    );

    const MAX_COLUMNS = 8;

    class AdvGallery extends Component {
        constructor() {
            super ( ...arguments );
            this.state = {
                selectedImage: null,
                selectedCaption: null,
            }
        }

        componentDidUpdate( prevProps ) {
            const { isSelected } = this.props;
            // unselect the caption so when the user selects other image and comeback
            // the caption is not immediately selected
            if ( this.state.selectedCaption && !isSelected && prevProps.isSelected ) {
                this.setState( {
                    selectedCaption: null,
                } );
            }
        }

        render() {
            const { attributes, setAttributes, isSelected } = this.props;
            const { images, columns, layout, itemsToShow } = attributes;
            const { selectedImage, selectedCaption } = this.state;

            const controls = (
                <BlockControls>
                    {!!images.length && (
                        <Toolbar>
                            <MediaUpload
                                allowedTypes={ [ 'image' ] }
                                multiple
                                gallery
                                value={ images.map( (img) => img.id ) }
                                onSelect={ (imgs) => console.log(imgs) }
                                render={ ( { open } ) => (
                                    <IconButton
                                        className="components-toolbar__control"
                                        label={ __( 'Edit gallery' ) }
                                        icon="edit"
                                        onClick={ open }
                                    />
                                ) }
                            />
                        </Toolbar>
                    ) }
                </BlockControls>
            );

            const mediaHolder = (
                <MediaPlaceholder
                    addToGallery={ !!images.length }
                    isAppender={ !!images.length }
                    dropZoneUIOnly={ !!images.length && !isSelected }
                    icon={ !images.length && <BlockIcon icon={ advGalleryBlockIcon } /> }
                    labels={ {
                        title: !images.length && __( 'Advanced Gallery' ),
                        instructions: !images.length && __( 'Drag images, upload new ones or select from your library.' ),
                    } }
                    onSelect={ () => null }
                    accept="image/*"
                    allowedTypes={ [ 'image' ] }
                    multiple
                    value={ !!images.length ? images : undefined }
                />
            );

            if (!images.length) {
                return (
                    <Fragment>
                        {controls}
                        {mediaHolder}
                    </Fragment>
                )
            }

            return (
                <Fragment>
                    {controls}
                    <InspectorControls>
                        <PanelBody title={ __( 'Gallery Settings' ) }>
                            <SelectControl
                                label={ __( 'Layout' ) }
                                value={ layout }
                                onChange={ (value) => setAttributes( { layout: value } ) }
                                options={ [
                                    { label: __( 'Default' ), value: '' },
                                    { label: __( 'Masonry' ), value: 'masonry' },
                                ] }
                            />
                            <RangeControl
                                label={ __( 'Columns' ) }
                                value={ columns }
                                onChange={ (value) => setAttributes( { columns: value } ) }
                                min={ 1 }
                                max={ Math.min( MAX_COLUMNS, images.length ) }
                                required
                            />
                            {enableLoadMore && (
                                <RangeControl
                                    label={ __( 'Items to show' ) }
                                    help={ __( 'Number of items will be show on first load, also the number of items will be fetched with load more button.' ) }
                                    value={ itemsToShow }
                                    onChange={ (value) => setAttributes( { itemsToShow: value } ) }
                                    min={ 1 }
                                    max={ images.length }
                                />
                            ) }
                        </PanelBody>
                    </InspectorControls>
                    <div className="advgb-gallery">
                        {images.map( (img, index) => {
                            return (
                                <div className="advgb-gallery-items" key={ index }>
                                    <figure className={ selectedImage === index && 'is-selected' }>
                                        {selectedImage && (
                                            <div className="advgb-gallery-item-remove">
                                                <IconButton
                                                    icon="no-alt"
                                                    onClick={ null }
                                                    className="item-remove-icon"
                                                    label={ __( 'Remove Image' ) }
                                                />
                                            </div>
                                        ) }
                                        <img src={ img.url }
                                             alt={ img.alt }
                                             data-id={ img.id }
                                             onClick={ null }
                                        />
                                        { (!RichText.isEmpty(caption) || isSelected) && (
                                            <RichText
                                                tagName="figcaption"
                                                placeholder={ __( 'Write caption…' ) }
                                                value={ img.caption }
                                                isSelected={ selectedCaption === index }
                                                onChange={ null }
                                                unstableOnFocus={ () => this.setState( { selectedCaption: index } ) }
                                                inlineToolbar
                                            />
                                        ) }
                                    </figure>
                                </div>
                            )
                        } ) }
                    </div>
                </Fragment>
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
        enableLoadMore: {
            type: 'boolean',
            default: false,
        },
        itemsToShow: {
            type: 'number',
            default: 6,
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