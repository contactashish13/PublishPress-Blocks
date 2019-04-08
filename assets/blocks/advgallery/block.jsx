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
                grid: null,
            };
        }

        componentDidMount() {
            if (this.props.attributes.layout === 'masonry') {
                const $grid = jQuery('.advgb-gallery.masonry-layout').masonry({
                    itemSelector: '.advgb-gallery-item',
                    columnWidth: '.advgb-gallery-item',
                    percentPosition: true,
                });

                $grid.on('click', '.advgb-gallery-item', function() {
                    $grid.masonry('layout');
                });

                if (!this.state.grid) {
                    this.setState( { grid: $grid } );
                }

                setTimeout(function () {
                    $grid.masonry('layout');
                }, 1000)
            }
        }

        componentDidUpdate( prevProps, prevState ) {
            const { isSelected, attributes } = this.props;
            const { grid, selectedImage } = this.state;
            const { layout } = attributes;
            const $ = jQuery;

            // unselect the caption so when the user selects other image and comeback
            // the caption is not immediately selected
            if ( !isSelected && prevProps.isSelected ) {
                this.setState( {
                    selectedCaption: null,
                    selectedImage: null,
                } );
            }

            if (selectedImage !== prevState.selectedImage) {
                this.setState( { selectedCaption: null } );
            }

            if (layout === 'masonry' && prevProps.attributes.layout !== 'masonry') {
                const $grid = $('.advgb-gallery.masonry-layout').masonry({
                    itemSelector: '.advgb-gallery-item',
                    columnWidth: '.advgb-gallery-item',
                    percentPosition: true,
                });

                $grid.on('click', '.advgb-gallery-item', function() {
                    $grid.masonry('layout');
                });

                if (!grid) {
                    this.setState( { grid: $grid } );
                }
            }

            if (layout !== 'masonry' && this.state.grid) {
                grid.masonry('destroy');
                this.setState( { grid: null } );
            }

            if (layout === 'masonry') {
                if (prevProps.attributes.images.length !== attributes.images.length
                    || prevProps.attributes.columns !== attributes.columns)
                {
                    grid.masonry('reloadItems');
                    grid.masonry('layout');
                    setTimeout(function () {
                        grid.masonry('layout');
                    }, 1000)
                }
            }
        }

        addImages( images ) {
            const { columns } = this.props.attributes;
            this.props.setAttributes( {
                images: images.map( (image) => ( {
                    url: image.url,
                    id: image.id,
                    alt: image.alt,
                    caption: image.caption,
                } ) ),
                columns: columns ? Math.min( images.length, columns ) : Math.min( images.length, 3 ),
            } )
        }

        render() {
            const { attributes, setAttributes, isSelected } = this.props;
            const { images, columns, layout, enableLoadMore, itemsToShow } = attributes;
            const { selectedImage, selectedCaption } = this.state;

            const controls = (
                <BlockControls>
                    {!!images.length && (
                        <Toolbar>
                            <MediaUpload
                                allowedTypes={ [ 'image' ] }
                                multiple
                                gallery
                                value={ images.map( ( img ) => img.id ) }
                                onSelect={ ( imgs ) => this.addImages( imgs ) }
                                render={ ( { open } ) => (
                                    <IconButton
                                        className="components-toolbar__control"
                                        label={ __( 'Edit gallery' ) }
                                        icon="edit"
                                        onClick={ open }
                                    />
                                ) }
                            />
                            {layout === 'masonry' && (
                                <IconButton
                                    className="components-toolbar__control"
                                    label={ __( 'Refresh layout' ) }
                                    icon="update"
                                    onClick={ () => this.state.grid.masonry( 'layout' ) }
                                />
                            ) }
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
                    onSelect={ ( imgs ) => this.addImages( imgs ) }
                    accept="image/*"
                    allowedTypes={ [ 'image' ] }
                    multiple
                    value={ !!images.length ? images : undefined }
                />
            );

            const blockClass = [
                'advgb-gallery',
                !layout && 'default-layout',
                layout === 'masonry' && 'masonry-layout',
                columns && `columns-${columns}`,
            ].filter( Boolean ).join( ' ' );

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
                    <div className={ blockClass }>
                        {images.map( (img, index) => {
                            return (
                                <div className="advgb-gallery-item" key={ index }>
                                    <figure className={ selectedImage === index && 'is-selected' }>
                                        {selectedImage === index && (
                                            <div className="advgb-gallery-item-remove">
                                                <IconButton
                                                    icon="no-alt"
                                                    onClick={ () => {
                                                        const newImgs = images.filter( (img, idx) => idx !== index );
                                                        this.setState( {
                                                            selectedImage: null,
                                                            selectedCaption: null,
                                                        } );
                                                        setAttributes( {
                                                            images: newImgs,
                                                            columns: columns ? Math.min( newImgs.length, columns ) : columns,
                                                        } );
                                                    } }
                                                    className="item-remove-icon"
                                                    label={ __( 'Remove Image' ) }
                                                />
                                            </div>
                                        ) }
                                        <img src={ img.url }
                                             alt={ img.alt }
                                             data-id={ img.id }
                                             onClick={ () => this.setState( { selectedImage: index } ) }
                                        />
                                        { (!RichText.isEmpty( img.caption ) || selectedImage === index) && (
                                            <RichText
                                                tagName="figcaption"
                                                placeholder={ __( 'Write caption…' ) }
                                                value={ img.caption }
                                                isSelected={ selectedCaption === index }
                                                onChange={ ( value ) => setAttributes( {
                                                    images: images.map( ( img, idx ) => {
                                                        if (idx === index) {
                                                            return {
                                                                ...img,
                                                                caption: value,
                                                            }
                                                        }

                                                        return img;
                                                    } )
                                                } ) }
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
            const { images, columns, layout, itemsToShow } = attributes;
            const blockClass = [
                'advgb-gallery',
                !layout && 'default-layout',
                layout === 'masonry' && 'masonry-layout',
                columns && `columns-${columns}`,
            ].filter( Boolean ).join( ' ' );

            return (
                <div className={ blockClass }>
                    {images.map( (img, index) => {
                        return (
                            <div className="advgb-gallery-item" key={ index }>
                                <figure>
                                    <img src={ img.url }
                                         alt={ img.alt }
                                         data-id={ img.id }
                                    />
                                    { (!RichText.isEmpty( img.caption )) && (
                                        <RichText.Content
                                            tagName="figcaption"
                                            value={ img.caption }
                                        />
                                    ) }
                                </figure>
                            </div>
                        )
                    } ) }
                </div>
            );
        },
    } )
})( wp.i18n, wp.blocks, wp.element, wp.editor, wp.components );