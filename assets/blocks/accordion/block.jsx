(function ( wpI18n, wpBlocks, wpElement, wpBlockEditor, wpComponents ) {
    const { __ } = wpI18n;
    const { Component, Fragment } = wpElement;
    const { registerBlockType } = wpBlocks;
    const { InspectorControls, RichText, PanelColorSettings, InnerBlocks } = wpBlockEditor;
    const { RangeControl, PanelBody, BaseControl , SelectControl, ToggleControl } = wpComponents;

    const HEADER_ICONS = {
        plus: (
            <Fragment>
                <path fill="none" d="M0,0h24v24H0V0z"/>
                <path d="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z"/>
            </Fragment>
        ),
        plusCircle: (
            <Fragment>
                <path fill="none" d="M0,0h24v24H0V0z"/>
                <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M17,13h-4v4h-2v-4H7v-2h4V7h2v4h4V13z"/>
            </Fragment>
        ),
        plusCircleOutline: (
            <Fragment>
                <path fill="none" d="M0,0h24v24H0V0z"/>
                <path d="M13,7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20 c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z"/>
            </Fragment>
        ),
        plusBox: (
            <Fragment>
                <path fill="none" d="M0,0h24v24H0V0z"/>
                <path d="M19,3H5C3.89,3,3,3.9,3,5v14c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z"/>
                <polygon points="11,17 13,17 13,13 17,13 17,11 13,11 13,7 11,7 11,11 7,11 7,13 11,13"/>
            </Fragment>
        ),
        unfold: (
            <Fragment>
                <path fill="none" d="M0,0h24v24H0V0z"/>
                <path d="M12,5.83L15.17,9l1.41-1.41L12,3L7.41,7.59L8.83,9L12,5.83z M12,18.17L8.83,15l-1.41,1.41L12,21l4.59-4.59L15.17,15 L12,18.17z"/>
            </Fragment>
        ),
        threeDots: (
            <Fragment>
                <path fill="none" d="M0,0h24v24H0V0z"/>
                <path d="M6,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S7.1,10,6,10z M18,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S19.1,10,18,10z M12,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,10,12,10z"/>
            </Fragment>
        ),
        arrowDown: (
            <Fragment>
                <path opacity="0.87" fill="none" d="M24,24H0L0,0l24,0V24z"/>
                <path d="M16.59,8.59L12,13.17L7.41,8.59L6,10l6,6l6-6L16.59,8.59z"/>
            </Fragment>
        )
    };

    const COLLAPSE_ICONS = {
        remove: (
            <Fragment>
                <path d="M19 13H5v-2h14v2z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </Fragment>
        ),
        removeCircle: (
            <Fragment>
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
            </Fragment>
        ),
        removeCircleOutline: (
            <Fragment>
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </Fragment>
        ),
        close: (
            <Fragment>
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </Fragment>
        ),
        closeCircle: (
            <Fragment>
                <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </Fragment>
        ),
        closeCircleOutline: (
            <Fragment>
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </Fragment>
        ),
        closeBox: (
            <Fragment>
                <path d="M21 19.1H3V5h18v14.1zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                <path fill="none" d="M21 19.1H3V5h18v14.1zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                <path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41z"/>
                <path fill="none" d="M0 0h24v24H0z"/>
            </Fragment>
        ),
        unfoldLess: (
            <Fragment>
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M7.41 18.59L8.83 20 12 16.83 15.17 20l1.41-1.41L12 14l-4.59 4.59zm9.18-13.18L15.17 4 12 7.17 8.83 4 7.41 5.41 12 10l4.59-4.59z"/>
            </Fragment>
        ),
        arrowUp: (
            <Fragment>
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </Fragment>
        ),
        power: (
            <Fragment>
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
            </Fragment>
        ),
    };

    class AdvAccordion extends Component {
        constructor() {
            super( ...arguments );
            this.state = {
                currentAccordion: null,
            }
        }

        componentWillMount() {
            const { attributes, setAttributes } = this.props;
            const currentBlockConfig = advgbDefaultConfig['advgb-accordion'];

            // No override attributes of blocks inserted before
            if (attributes.changed !== true) {
                if (typeof currentBlockConfig === 'object' && currentBlockConfig !== null) {
                    Object.keys(currentBlockConfig).map((attribute) => {
                        if (typeof attributes[attribute] === 'boolean') {
                            attributes[attribute] = !!currentBlockConfig[attribute];
                        } else {
                            attributes[attribute] = currentBlockConfig[attribute];
                        }
                    });
                }

                // Finally set changed attribute to true, so we don't modify anything again
                setAttributes( { changed: true } );
            }
        }

        render() {
            const { isSelected, attributes, setAttributes } = this.props;
            const {
                header,
                headerBgColor,
                headerTextColor,
                headerIcon,
                headerIconColor,
                collapseIcon,
                collapseIconColor,
                bodyBgColor,
                bodyTextColor,
                borderStyle,
                borderWidth,
                borderColor,
                borderRadius,
                marginBottom,
                collapsedAll,
            } = attributes;

            return (
                <Fragment>
                    <InspectorControls>
                        <PanelBody title={ __( 'Accordion Settings' ) }>
                            <RangeControl
                                label={ __( 'Bottom spacing' ) }
                                value={ marginBottom }
                                help={ __( 'Define space to next block. This will override Block spacing option (Frontend view only)' ) }
                                min={ 0 }
                                max={ 50 }
                                onChange={ ( value ) => setAttributes( { marginBottom: value } ) }
                            />
                        </PanelBody>
                        <PanelBody title={ __( 'Header Settings' ) }>
                            <PanelBody title={ __( 'Icon styles' ) } initialOpen={ false }>
                                <BaseControl label={ __( 'Expand Icon' ) }>
                                    <div className="advgb-icon-items-wrapper">
                                        {Object.keys( HEADER_ICONS ).map( ( key, index ) => (
                                            <div className="advgb-icon-item" key={ index }>
                                                <span className={ key === headerIcon ? 'active' : '' }
                                                      onClick={ () => setAttributes( { headerIcon: key } ) }>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                        { HEADER_ICONS[key] }
                                                    </svg>
                                                </span>
                                            </div>
                                        ) ) }
                                    </div>
                                </BaseControl>
                                <BaseControl label={ __( 'Collapse Icon' ) }>
                                    <div className="advgb-icon-items-wrapper">
                                        {Object.keys( COLLAPSE_ICONS ).map( ( key, index ) => (
                                            <div className="advgb-icon-item" key={ index }>
                                                <span className={ key === collapseIcon ? 'active' : '' }
                                                      onClick={ () => setAttributes( { collapseIcon: key } ) }>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                        { COLLAPSE_ICONS[key] }
                                                    </svg>
                                                </span>
                                            </div>
                                        ) ) }
                                        <div className="advgb-icon-item">
                                                <span className={ !collapseIcon || '' === collapseIcon ? 'active' : '' }
                                                      onClick={ () => setAttributes( { collapseIcon: '' } ) } >
                                                    { __( 'None' ) }
                                                </span>
                                        </div>
                                    </div>
                                </BaseControl>
                            </PanelBody>
                            <PanelColorSettings
                                title={ __( 'Color Settings' ) }
                                initialOpen={ false }
                                colorSettings={ [
                                    {
                                        label: __( 'Background Color' ),
                                        value: headerBgColor,
                                        onChange: ( value ) => setAttributes( { headerBgColor: value === undefined ? '#000' : value } ),
                                    },
                                    {
                                        label: __( 'Text Color' ),
                                        value: headerTextColor,
                                        onChange: ( value ) => setAttributes( { headerTextColor: value === undefined ? '#eee' : value } ),
                                    },
                                    {
                                        label: __( 'Expand Icon Color' ),
                                        value: headerIconColor,
                                        onChange: ( value ) => setAttributes( { headerIconColor: value === undefined ? '#fff' : value } ),
                                    },
                                    {
                                        label: __( 'Collapse Icon Color' ),
                                        value: collapseIconColor,
                                        onChange: ( value ) => setAttributes( { collapseIconColor: value === undefined ? '#fff' : value } ),
                                    },
                                ] }
                            />
                        </PanelBody>
                        <PanelColorSettings
                            title={ __( 'Body Color Settings' ) }
                            initialOpen={ false }
                            colorSettings={ [
                                {
                                    label: __( 'Background Color' ),
                                    value: bodyBgColor,
                                    onChange: ( value ) => setAttributes( { bodyBgColor: value } ),
                                },
                                {
                                    label: __( 'Text Color' ),
                                    value: bodyTextColor,
                                    onChange: ( value ) => setAttributes( { bodyTextColor: value } ),
                                },
                            ] }
                        />
                        <PanelBody title={ __( 'Border Settings' ) } initialOpen={ false }>
                            <SelectControl
                                label={ __( 'Border Style' ) }
                                value={ borderStyle }
                                options={ [
                                    { label: __( 'Solid' ), value: 'solid' },
                                    { label: __( 'Dashed' ), value: 'dashed' },
                                    { label: __( 'Dotted' ), value: 'dotted' },
                                ] }
                                onChange={ ( value ) => setAttributes( { borderStyle: value } ) }
                            />
                            <PanelColorSettings
                                title={ __( 'Color Settings' ) }
                                initialOpen={ false }
                                colorSettings={ [
                                    {
                                        label: __( 'Border Color' ),
                                        value: borderColor,
                                        onChange: ( value ) => setAttributes( { borderColor: value } ),
                                    },
                                ] }
                            />
                            <RangeControl
                                label={ __( 'Border width' ) }
                                value={ borderWidth }
                                min={ 0 }
                                max={ 10 }
                                onChange={ ( value ) => setAttributes( { borderWidth: value } ) }
                            />
                            <RangeControl
                                label={ __( 'Border radius' ) }
                                value={ borderRadius }
                                min={ 0 }
                                max={ 100 }
                                onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
                            />
                        </PanelBody>
                        <PanelBody title={ __( 'Accordions State' ) } initialOpen={  false }>
                            <ToggleControl
                                label={ __( 'Initial Collapsed' ) }
                                help={ __( 'Make all accordions collapsed by default, enable this setting to apply to all accordions.' ) }
                                checked={ collapsedAll }
                                onChange={ () => setAttributes( { collapsedAll: !collapsedAll } ) }
                            />
                        </PanelBody>
                    </InspectorControls>
                    <div className="advgb-accordion-block">
                        <div className="advgb-accordion-header"
                             style={ {
                                 backgroundColor: headerBgColor,
                                 color: headerTextColor,
                                 borderStyle: borderStyle,
                                 borderWidth: borderWidth + 'px',
                                 borderColor: borderColor,
                                 borderRadius: borderRadius + 'px',
                             } }
                        >
                            <span className="advgb-accordion-header-icon">
                                <svg fill={ headerIconColor } xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    { HEADER_ICONS[headerIcon] }
                                </svg>
                            </span>
                            <RichText
                                tagName="h4"
                                value={ header }
                                onChange={ ( value ) => setAttributes( { header: value } ) }
                                unstableOnSplit={ () => null }
                                className="advgb-accordion-header-title"
                                placeholder={ __( 'Enter header…' ) }
                            />
                        </div>
                        <div className="advgb-accordion-body"
                             style={ {
                                 backgroundColor: bodyBgColor,
                                 color: bodyTextColor,
                                 borderStyle: borderStyle,
                                 borderWidth: borderWidth + 'px',
                                 borderColor: borderColor,
                                 borderRadius: borderRadius + 'px',
                             } }
                        >
                            <InnerBlocks />
                        </div>
                    </div>
                </Fragment>
            )
        }
    }

    const accordionBlockIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="2 2 22 22">
            <path fill="none" d="M0,0h24v24H0V0z"/>
            <rect x="3" y="17" width="18" height="2"/>
            <path d="M19,12v1H5v-1H19 M21,10H3v5h18V10L21,10z"/>
            <rect x="3" y="6" width="18" height="2"/>
        </svg>
    );

    const accordionAttrs = {
        header: {
            type: 'string',
            default: __( 'Header text' ),
        },
        headerBgColor: {
            type: 'string',
            default: '#000',
        },
        headerTextColor: {
            type: 'string',
            default: '#eee',
        },
        headerIcon: {
            type: 'string',
            default: 'unfold',
        },
        headerIconColor: {
            type: 'string',
            default: '#fff',
        },
        collapseIcon: {
            type: 'string',
        },
        collapseIconColor: {
            type: 'string',
            default: '#fff',
        },
        bodyBgColor: {
            type: 'string',
        },
        bodyTextColor: {
            type: 'string',
        },
        borderStyle: {
            type: 'string',
            default: 'solid',
        },
        borderWidth: {
            type: 'number',
            default: 0,
        },
        borderColor: {
            type: 'string',
        },
        borderRadius: {
            type: 'number',
            default: 2,
        },
        marginBottom: {
            type: 'number',
            default: 15,
        },
        collapsedAll: {
            type: 'boolean',
            default: false,
        },
        changed: {
            type: 'boolean',
            default: false,
        },
    };

    registerBlockType( 'advgb/accordion', {
        title: __( 'Accordion' ),
        description: __( 'Easy to create an accordion for your post/page.' ),
        icon: {
            src: accordionBlockIcon,
            foreground: typeof advgbBlocks !== 'undefined' ? advgbBlocks.color : undefined,
        },
        category: 'advgb-category',
        keywords: [ __( 'accordion' ), __( 'list' ), __( 'faq' ) ],
        attributes: accordionAttrs,
        edit: AdvAccordion,
        save: function ( { attributes } ) {
            const {
                header,
                headerBgColor,
                headerTextColor,
                headerIcon,
                headerIconColor,
                collapseIcon,
                collapseIconColor,
                bodyBgColor,
                bodyTextColor,
                borderStyle,
                borderWidth,
                borderColor,
                borderRadius,
                marginBottom,
                collapsedAll,
            } = attributes;

            return (
                <div className="advgb-accordion-block" style={ { marginBottom } } data-collapsed={ collapsedAll ? collapsedAll : undefined }>
                    <div className="advgb-accordion-header"
                         style={ {
                             backgroundColor: headerBgColor,
                             color: headerTextColor,
                             borderStyle: borderStyle,
                             borderWidth: borderWidth + 'px',
                             borderColor: borderColor,
                             borderRadius: borderRadius + 'px',
                         } }
                    >
                        <span className="advgb-accordion-header-icon">
                            <svg fill={ headerIconColor } xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                { HEADER_ICONS[headerIcon] }
                            </svg>
                        </span>
                        {collapseIcon && (
                            <span className="advgb-accordion-header-icon collapse-icon">
                            <svg fill={ collapseIconColor } xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                { COLLAPSE_ICONS[collapseIcon] }
                            </svg>
                        </span>
                        ) }
                        <h4 className="advgb-accordion-header-title">{ header }</h4>
                    </div>
                    <div className="advgb-accordion-body"
                         style={ {
                             backgroundColor: bodyBgColor,
                             color: bodyTextColor,
                             borderStyle: borderStyle,
                             borderWidth: borderWidth + 'px',
                             borderColor: borderColor,
                             borderRadius: borderRadius + 'px',
                         } }
                    >
                        <InnerBlocks.Content />
                    </div>
                </div>
            );
        },
    } );
})( wp.i18n, wp.blocks, wp.element, wp.blockEditor, wp.components );