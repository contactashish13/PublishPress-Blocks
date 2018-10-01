"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (wpI18n, wpBlocks, wpElement, wpEditor, wpComponents, wpData, wpHooks) {
    var __ = wpI18n.__;
    var Component = wpElement.Component,
        Fragment = wpElement.Fragment;
    var registerBlockType = wpBlocks.registerBlockType,
        getBlockContent = wpBlocks.getBlockContent,
        createBlock = wpBlocks.createBlock;
    var BlockControls = wpEditor.BlockControls,
        InspectorControls = wpEditor.InspectorControls,
        InspectorAdvancedControls = wpEditor.InspectorAdvancedControls,
        ColorPalette = wpEditor.ColorPalette,
        BlockAlignmentToolbar = wpEditor.BlockAlignmentToolbar;
    var IconButton = wpComponents.IconButton,
        Placeholder = wpComponents.Placeholder,
        Button = wpComponents.Button,
        Toolbar = wpComponents.Toolbar,
        ToggleControl = wpComponents.ToggleControl,
        TextControl = wpComponents.TextControl,
        PanelBody = wpComponents.PanelBody,
        PanelColor = wpComponents.PanelColor;
    var select = wpData.select,
        dispatch = wpData.dispatch;
    var addFilter = wpHooks.addFilter;


    var summaryBlockIcon = React.createElement(
        "svg",
        { height: "20", viewBox: "2 2 22 22", width: "20", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement("path", { d: "M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z" }),
        React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" })
    );
    var summaryBlockTitle = __('Summary');

    // Add button to insert summary inside table of contents component
    (function () {
        jQuery(window).on('load', function () {
            if (typeof dispatch('core/editor') === 'undefined') {
                return false;
            }

            var $ = jQuery;

            var _dispatch = dispatch('core/editor'),
                insertBlock = _dispatch.insertBlock;

            var summaryBlock = createBlock('advgb/summary');

            $('.gutenberg #editor').find('.table-of-contents').click(function () {
                var allBlocks = select('core/editor').getBlocks();
                var summaryBlockExist = !!allBlocks.filter(function (block) {
                    return block.name === 'advgb/summary';
                }).length;
                setTimeout(function () {
                    var summaryButton = $('<button class="button" style="position: absolute; bottom: 10px; right: 15px">' + __('Insert Summary') + '</button>');

                    $('.gutenberg #editor').find('.table-of-contents__popover').find('.document-outline').append(summaryButton);
                    summaryButton.unbind('click').click(function () {
                        insertBlock(summaryBlock, 0);
                        $('.table-of-contents__popover').hide();
                    });

                    if (summaryBlockExist) {
                        summaryButton.prop('disabled', true);
                    }
                }, 100);
            });
        });
    })();

    // Add notice for user to refresh summary if manually change heading anchor
    addFilter('editor.BlockEdit', 'advgb/addHeadingNotice', function (BlockEdit) {
        return function (props) {
            var isSelected = props.isSelected,
                blockType = props.name,
                attributes = props.attributes;


            return [React.createElement(BlockEdit, _extends({ key: "block-edit-summary" }, props)), isSelected && blockType === 'core/heading' && attributes.nodeName !== 'H1' && React.createElement(
                InspectorAdvancedControls,
                { key: "advgb-summary-controls-hint" },
                React.createElement(
                    "p",
                    { style: { color: 'red', fontStyle: 'italic' } },
                    __('After manually changing the anchor, remember to refresh summary block to make the links work!')
                )
            )];
        };
    });

    var SummaryBlock = function (_Component) {
        _inherits(SummaryBlock, _Component);

        function SummaryBlock() {
            _classCallCheck(this, SummaryBlock);

            var _this = _possibleConstructorReturn(this, (SummaryBlock.__proto__ || Object.getPrototypeOf(SummaryBlock)).apply(this, arguments));

            _this.updateSummary = _this.updateSummary.bind(_this);
            return _this;
        }

        _createClass(SummaryBlock, [{
            key: "componentWillMount",
            value: function componentWillMount() {
                var _props = this.props,
                    attributes = _props.attributes,
                    setAttributes = _props.setAttributes;

                var currentBlockConfig = advgbDefaultConfig['advgb-summary'];

                // No override attributes of blocks inserted before
                if (attributes.changed !== true) {
                    if (currentBlockConfig !== undefined && (typeof currentBlockConfig === "undefined" ? "undefined" : _typeof(currentBlockConfig)) === 'object') {
                        Object.keys(currentBlockConfig).map(function (attribute) {
                            attributes[attribute] = currentBlockConfig[attribute];
                        });

                        // Finally set changed attribute to true, so we don't modify anything again
                        setAttributes({ changed: true });
                    }
                }
            }
        }, {
            key: "componentDidMount",
            value: function componentDidMount() {
                this.updateSummary();
            }
        }, {
            key: "updateSummary",
            value: function updateSummary() {
                var headingDatas = [];
                var headingBlocks = [];
                var allBlocks = select('core/editor').getBlocks();
                var filteredBlocks = allBlocks.filter(function (block) {
                    return block.name === 'core/heading' || block.name === 'core/columns';
                });
                filteredBlocks.map(function (block) {
                    if (block.name === 'core/columns') {
                        SummaryBlock.getHeadingBlocksFromColumns(block, headingBlocks);
                    } else {
                        headingBlocks.push(block);
                    }

                    return block;
                });

                headingBlocks.map(function (heading) {
                    var thisHead = {};
                    thisHead['level'] = parseInt(heading.attributes.level);

                    // We only get heading from h2
                    if (thisHead['level'] > 1) {
                        thisHead['level'] -= 1;
                        thisHead['content'] = heading.attributes.content.length ? getBlockContent(heading).replace(/<(?:.|\n)*?>/gm, '') : '';
                        thisHead['clientId'] = heading.clientId;
                        if (heading.attributes.anchor) {
                            thisHead['anchor'] = heading.attributes.anchor;
                        } else {
                            // Generate a random anchor for headings without it
                            thisHead['anchor'] = 'advgb-toc-' + heading.clientId;
                            heading.attributes.anchor = thisHead['anchor'];
                        }

                        headingDatas.push(thisHead);
                    }

                    return heading;
                });

                this.props.setAttributes({
                    headings: headingDatas
                });
            }
        }, {
            key: "render",
            value: function render() {
                var _props2 = this.props,
                    attributes = _props2.attributes,
                    isSelected = _props2.isSelected,
                    setAttributes = _props2.setAttributes;
                var headings = attributes.headings,
                    loadMinimized = attributes.loadMinimized,
                    anchorColor = attributes.anchorColor,
                    align = attributes.align,
                    headerTitle = attributes.headerTitle;

                // No heading blocks

                var summaryContent = React.createElement(
                    Placeholder,
                    {
                        icon: summaryBlockIcon,
                        label: summaryBlockTitle,
                        instructions: __('Your current post/page has no headings. Try add some headings and update this block later')
                    },
                    React.createElement(
                        Button,
                        { onClick: this.updateSummary,
                            className: 'button'
                        },
                        __('Update')
                    )
                );

                // Having heading blocks
                if (headings.length > 0) {
                    var _dispatch2 = dispatch('core/editor'),
                        selectBlock = _dispatch2.selectBlock;

                    summaryContent = React.createElement(
                        "ul",
                        { className: 'advgb-toc' },
                        headings.map(function (heading) {
                            return React.createElement(
                                "li",
                                { className: 'toc-level-' + heading.level,
                                    style: { marginLeft: heading.level * 20 },
                                    key: heading.anchor
                                },
                                React.createElement(
                                    "a",
                                    { href: '#' + heading.anchor,
                                        onClick: function onClick() {
                                            return selectBlock(heading.clientId);
                                        }
                                    },
                                    heading.content
                                )
                            );
                        })
                    );
                }

                return React.createElement(
                    Fragment,
                    null,
                    !!headings.length && React.createElement(
                        BlockControls,
                        null,
                        React.createElement(BlockAlignmentToolbar, { value: align, onChange: function onChange(align) {
                                return setAttributes({ align: align });
                            } }),
                        React.createElement(
                            Toolbar,
                            null,
                            React.createElement(IconButton, { className: 'components-icon-button components-toolbar__control',
                                icon: 'update',
                                label: __('Update Summary'),
                                onClick: this.updateSummary
                            })
                        )
                    ),
                    React.createElement(
                        InspectorControls,
                        null,
                        React.createElement(
                            PanelBody,
                            { title: __('Summary settings') },
                            React.createElement(ToggleControl, {
                                label: __('Load minimized'),
                                checked: !!loadMinimized,
                                onChange: function onChange() {
                                    return setAttributes({ loadMinimized: !loadMinimized, postTitle: select('core/editor').getEditedPostAttribute('title') });
                                }
                            }),
                            loadMinimized && React.createElement(TextControl, {
                                label: __('Summary header title'),
                                value: headerTitle || '',
                                placeholder: __('Enter header…'),
                                onChange: function onChange(value) {
                                    return setAttributes({ headerTitle: value });
                                }
                            }),
                            React.createElement(
                                PanelColor,
                                { title: __('Anchor color'), colorValue: anchorColor, initialOpen: false },
                                React.createElement(ColorPalette, {
                                    value: anchorColor,
                                    onChange: function onChange(value) {
                                        return setAttributes({ anchorColor: value });
                                    }
                                })
                            )
                        )
                    ),
                    summaryContent,
                    anchorColor && React.createElement(
                        "style",
                        null,
                        ".advgb-toc li a {\n                        color: " + anchorColor + ";\n                    }"
                    )
                );
            }
        }], [{
            key: "getHeadingBlocksFromColumns",


            /**
             * Function to get heading blocks from columns blocks
             *
             * @param block     array Columns block to get data
             * @param storeData array Data array to store heading blocks
             *
             * @returns array   array Heading blocks from block given
             */
            value: function getHeadingBlocksFromColumns(block, storeData) {
                if (block.name === 'core/columns' || block.name === 'core/column') {
                    block.innerBlocks.map(function (bl) {
                        SummaryBlock.getHeadingBlocksFromColumns(bl, storeData);
                        return bl;
                    });
                } else if (block.name === 'core/heading') {
                    storeData.push(block);
                }

                return storeData;
            }
        }]);

        return SummaryBlock;
    }(Component);

    registerBlockType('advgb/summary', {
        title: summaryBlockTitle,
        description: __('Show the table of content of current post/page.'),
        icon: {
            src: summaryBlockIcon,
            foreground: typeof advgbBlocks !== 'undefined' ? advgbBlocks.color : undefined
        },
        category: 'formatting',
        keywords: [__('summary'), __('table of content'), __('list')],
        attributes: {
            headings: {
                type: 'array',
                default: []
            },
            loadMinimized: {
                type: 'boolean',
                default: false
            },
            anchorColor: {
                type: 'string'
            },
            align: {
                type: 'string',
                default: 'none'
            },
            postTitle: {
                type: 'string'
            },
            headerTitle: {
                type: 'string'
            },
            changed: {
                type: 'boolean',
                default: false
            }
        },
        supports: {
            multiple: false
        },
        edit: SummaryBlock,
        save: function save(_ref) {
            var attributes = _ref.attributes;
            var headings = attributes.headings,
                loadMinimized = attributes.loadMinimized,
                anchorColor = attributes.anchorColor,
                _attributes$align = attributes.align,
                align = _attributes$align === undefined ? 'none' : _attributes$align,
                postTitle = attributes.postTitle,
                headerTitle = attributes.headerTitle;
            // No heading blocks

            if (headings.length < 1) {
                return null;
            }

            var summary = React.createElement(
                "ul",
                { className: "advgb-toc align" + align, style: loadMinimized && { display: 'none' } },
                headings.map(function (heading, index) {
                    return React.createElement(
                        "li",
                        { className: 'toc-level-' + heading.level,
                            key: "summary-save-" + index,
                            style: { marginLeft: heading.level * 20 }
                        },
                        React.createElement(
                            "a",
                            { href: '#' + heading.anchor },
                            heading.content
                        )
                    );
                }),
                anchorColor && React.createElement(
                    "style",
                    null,
                    ".advgb-toc li a {\n                            color: " + anchorColor + ";\n                        }"
                )
            );

            if (loadMinimized) {
                return React.createElement(
                    "div",
                    { className: "align" + align },
                    React.createElement(
                        "div",
                        { className: 'advgb-toc-header collapsed' },
                        headerTitle || postTitle
                    ),
                    summary
                );
            }

            return summary;
        },
        getEditWrapperProps: function getEditWrapperProps(attributes) {
            var align = attributes.align;

            var props = { 'data-resized': true };

            if ('left' === align || 'right' === align || 'center' === align) {
                props['data-align'] = align;
            }

            return props;
        }
    });
})(wp.i18n, wp.blocks, wp.element, wp.editor, wp.components, wp.data, wp.hooks);
