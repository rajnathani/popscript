PS.compile({
    general: {
        STYLE: {
            CLASS: {
                box: 'simple-box',
                cover: 'curtain',
                cross: 'cross'
            }
        },
        ANIMATION: {
            IN: {
                box: 'flip-in',
                cover: 'fade-in',
                duration: 500
            },
            OUT: {
                box: 'zap-out ease-in',
                cover: 'fade-out',
                duration: 170
            }
        },
        POSITION: {
            x: 'auto',
            y: 'auto'
        },
        full_draggable: 'yes',
        esc: 'yup'
    },

    success: {
        STYLE: {
            CLASS: {
                box: 'success',
                cover: 'curtain'
            }
        },
        ANIMATION: {
            IN: {
                box: 'drop'
            },
            OUT: {
                box: 'undrop',
                cover: 'fade-out'
            }
        },
        POSITION: {
            y: 'top'
        },
        cross: 'no',
        full_draggable: 'naaaaoh',
        click_me_out: 'yes, tis is convenient'
    },

    error: {
        STYLE: {
            CLASS: {
                box: 'error',
                cover: 'curtain',
                cross: 'cross'
            }
        },
        ANIMATION: {
            IN: {
                box: 'short-arrive-left, fade-in'
            },
            OUT: {
                box: 'undrop',
                cover: 'fade-out'
            }
        },
        POSITION: {
            x: '!10',
            y: '10'
        },
        full_draggable: 'yes'
    },

    dropdown: {
        STYLE: {
            CLASS: {
                box: 'dropdown'
            }
        },
        ANIMATION: {
            IN: {
                box:'short-arrive-down, fade-in',
                duration: 90
            },
            OUT: {
                box: 'zap-out'
            }
        },
        POSITION: {
            z: '-1'
        },
        cross: 'no',
        cover: 'no',
        full_draggable: 'no'
    },

    context_menu: {
        STYLE: {
            CLASS: {
                box: 'context-menu'
            }
        },
        ANIMATION: {
            IN: {
                box: 'short-arrive-left, fade-in'
            },
            OUT: {
                box: 'fade-out',
                duration: 40
            }
        },
        POSITION: {
            fixed: 'no',
            z: '-1'
        },
        cover: 'no',
        cross: 'no'
    },

    tooltip: {
        STYLE: {
            CLASS: {
                box: 'popscript-tooltip'
            }
        },
        ANIMATION: {
            OUT: {
                box: 'fade-out',
                duration: 100
            }
        },
        POSITION: {
            z: '-1'
        },
        click_me_out: 'yeh',
        cross: 'no',
        cover: 'no',
        blur: 'no',
        esc: 'yes'
    },

    tip_left: {
        STYLE: {
            CLASS: {
                box: 'popscript-tooltip left'
            }
        },
        ANIMATION: {
            IN: {
                box: 'short-arrive-left, fade-in'
            }
        }
    },

    tip_right: {
        STYLE: {
            CLASS: {
                box: 'popscript-tooltip right'
            }
        },
        ANIMATION: {
            IN: {
                box: 'short-arrive-right, fade-in'
            }
        }
    },

    tip_up: {
        STYLE: {
            CLASS: {
                box: 'popscript-tooltip up'
            }
        },
        ANIMATION: {
            IN: {
                box: 'short-arrive-up, fade-in'
            }
        }
    },

    tip_down: {
        STYLE: {
            CLASS: {
                box: 'popscript-tooltip down'
            }
        },
        ANIMATION: {
            IN: {
                box: 'short-arrive-down, fade-in'
            }
        }
    },

    roller: {
        STYLE: {
            CLASS: {
                box: 'roller',
                cover: 'curtain',
                cross: 'cross'
            }
        },
        ANIMATION: {
            IN: {
                box: 'newspaper',
                cover:'fade-in',
                duration: 400
            },
            OUT: {
                box: 'zap-out',
                cover: 'fade-out',
                duration: 170
            }
        },
        POSITION: {
            x: 'auto',
            y: '8%',
            roller: 'yes'
        }
    }
});
