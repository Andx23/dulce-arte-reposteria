
/*
 * DULCE ARTE - CATÁLOGO DE PRODUCTOS
 *
 * Archivo: js/products.js
 * Tecnología: JavaScript nativo
 *
 * Responsabilidades:
 * - Almacenar los 25 productos del catálogo.
 * - Organizar los productos por categorías.
 * - Definir presentaciones, tamaños y combinaciones.
 * - Registrar precios y adicionales.
 *
 * Todos los precios están expresados en pesos colombianos (COP).
 *
 * IMPORTANTE:
 * La propiedad "units" representa las unidades contenidas
 * en cada presentación y es utilizada por product-options.js.
 */

window.DulceArte = window.DulceArte || {};

window.DulceArte.products = [

    // ========================================
    // 1. TORTAS
    // ========================================

    {
        id: 'torta-chocolate',
        name: 'Torta de chocolate clásica',
        category: 'tortas',
        description: 'Bizcocho húmedo de chocolate con relleno cremoso.',
        image: '',
        priceLabel: 'Desde $60.000',

        pricing: {
            type: 'base-plus-options',
            base: 60000,

            sizes: [
                {
                    id: 'pequena',
                    name: 'Pequeña',
                    price: 60000,
                    units: 1
                },
                {
                    id: 'mediana',
                    name: 'Mediana',
                    price: 75000,
                    units: 1
                },
                {
                    id: 'grande',
                    name: 'Grande',
                    price: 90000,
                    units: 1
                }
            ],

            extras: [
                {
                    id: 'arequipe',
                    name: 'Relleno de arequipe',
                    price: 5000,
                    chargeType: 'fixed'
                },
                {
                    id: 'decoracion-especial',
                    name: 'Decoración especial',
                    price: 10000,
                    chargeType: 'fixed'
                }
            ]
        }
    },

    {
        id: 'torta-vainilla',
        name: 'Torta de vainilla',
        category: 'tortas',
        description: 'Bizcocho suave de vainilla con relleno a elección.',
        image: '',
        priceLabel: 'Desde $55.000',

        pricing: {
            type: 'fixed-by-size',

            sizes: [
                {
                    id: 'pequena',
                    name: 'Pequeña',
                    price: 55000,
                    units: 1
                },
                {
                    id: 'mediana',
                    name: 'Mediana',
                    price: 70000,
                    units: 1
                },
                {
                    id: 'grande',
                    name: 'Grande',
                    price: 85000,
                    units: 1
                }
            ],

            extras: [
                {
                    id: 'arequipe',
                    name: 'Relleno de arequipe',
                    price: 5000,
                    chargeType: 'fixed'
                },
                {
                    id: 'chocolate',
                    name: 'Relleno de chocolate',
                    price: 5000,
                    chargeType: 'fixed'
                },
                {
                    id: 'frutos-rojos',
                    name: 'Relleno de frutos rojos',
                    price: 5000,
                    chargeType: 'fixed'
                }
            ]
        }
    },

    {
        id: 'torta-red-velvet',
        name: 'Torta Red Velvet',
        category: 'tortas',
        description: 'Bizcocho Red Velvet con una suave crema de queso.',
        image: '',
        priceLabel: 'Desde $70.000',

        pricing: {
            type: 'base-plus-options',
            base: 70000,

            sizes: [
                {
                    id: 'pequena',
                    name: 'Pequeña',
                    price: 70000,
                    units: 1
                },
                {
                    id: 'mediana',
                    name: 'Mediana',
                    price: 90000,
                    units: 1
                },
                {
                    id: 'grande',
                    name: 'Grande',
                    price: 110000,
                    units: 1
                }
            ],

            extras: [
                {
                    id: 'decoracion-especial',
                    name: 'Decoración especial',
                    price: 12000,
                    chargeType: 'fixed'
                }
            ]
        }
    },

    {
        id: 'torta-zanahoria',
        name: 'Torta de zanahoria',
        category: 'tortas',
        description: 'Torta artesanal de zanahoria con cobertura de queso crema.',
        image: '',
        priceLabel: 'Desde $65.000',

        pricing: {
            type: 'fixed-by-size',

            sizes: [
                {
                    id: 'pequena',
                    name: 'Pequeña',
                    price: 65000,
                    units: 1
                },
                {
                    id: 'mediana',
                    name: 'Mediana',
                    price: 80000,
                    units: 1
                },
                {
                    id: 'grande',
                    name: 'Grande',
                    price: 95000,
                    units: 1
                }
            ],

            includedFeatures: [
                'Cobertura de queso crema incluida'
            ],

            extras: []
        }
    },

    {
        id: 'torta-limon',
        name: 'Torta de limón',
        category: 'tortas',
        description: 'Bizcocho de limón con un toque cítrico y fresco.',
        image: '',
        priceLabel: 'Desde $55.000',

        pricing: {
            type: 'fixed-by-size',

            sizes: [
                {
                    id: 'pequena',
                    name: 'Pequeña',
                    price: 55000,
                    units: 1
                },
                {
                    id: 'mediana',
                    name: 'Mediana',
                    price: 70000,
                    units: 1
                },
                {
                    id: 'grande',
                    name: 'Grande',
                    price: 85000,
                    units: 1
                }
            ],

            extras: [
                {
                    id: 'crema-limon',
                    name: 'Relleno de crema de limón',
                    price: 5000,
                    chargeType: 'fixed'
                }
            ]
        }
    },

    {
        id: 'torta-frutos-rojos',
        name: 'Torta de frutos rojos',
        category: 'tortas',
        description: 'Torta artesanal con frutos rojos y crema.',
        image: '',
        priceLabel: 'Desde $70.000',

        pricing: {
            type: 'fixed-by-size',

            sizes: [
                {
                    id: 'pequena',
                    name: 'Pequeña',
                    price: 70000,
                    units: 1
                },
                {
                    id: 'mediana',
                    name: 'Mediana',
                    price: 90000,
                    units: 1
                },
                {
                    id: 'grande',
                    name: 'Grande',
                    price: 110000,
                    units: 1
                }
            ],

            extras: [
                {
                    id: 'fruta-extra',
                    name: 'Decoración con fruta adicional',
                    price: 10000,
                    chargeType: 'fixed'
                }
            ]
        }
    },

    {
        id: 'torta-personalizada',
        name: 'Torta personalizada',
        category: 'tortas',
        description: 'Torta diseñada según el tamaño y la decoración elegidos.',
        image: '',
        priceLabel: 'Desde $70.000',

        pricing: {
            type: 'fixed-combinations',

            combinations: [
                {
                    id: 'pequena-basica',
                    size: 'Pequeña',
                    decoration: 'Básica',
                    name: 'Pequeña - Básica',
                    price: 70000,
                    units: 1
                },
                {
                    id: 'pequena-especial',
                    size: 'Pequeña',
                    decoration: 'Especial',
                    name: 'Pequeña - Especial',
                    price: 85000,
                    units: 1
                },
                {
                    id: 'mediana-basica',
                    size: 'Mediana',
                    decoration: 'Básica',
                    name: 'Mediana - Básica',
                    price: 90000,
                    units: 1
                },
                {
                    id: 'mediana-especial',
                    size: 'Mediana',
                    decoration: 'Especial',
                    name: 'Mediana - Especial',
                    price: 110000,
                    units: 1
                },
                {
                    id: 'grande-basica',
                    size: 'Grande',
                    decoration: 'Básica',
                    name: 'Grande - Básica',
                    price: 115000,
                    units: 1
                },
                {
                    id: 'grande-especial',
                    size: 'Grande',
                    decoration: 'Especial',
                    name: 'Grande - Especial',
                    price: 140000,
                    units: 1
                }
            ],

            extras: []
        }
    },

    {
        id: 'torta-cumpleanos',
        name: 'Torta de cumpleaños',
        category: 'tortas',
        description: 'Torta especial para celebrar momentos importantes.',
        image: '',
        priceLabel: 'Desde $65.000',

        pricing: {
            type: 'base-plus-options',
            base: 65000,

            sizes: [
                {
                    id: 'pequena',
                    name: 'Pequeña',
                    price: 65000,
                    units: 1
                },
                {
                    id: 'mediana',
                    name: 'Mediana',
                    price: 85000,
                    units: 1
                },
                {
                    id: 'grande',
                    name: 'Grande',
                    price: 105000,
                    units: 1
                }
            ],

            extras: [
                {
                    id: 'topper',
                    name: 'Topper personalizado',
                    price: 8000,
                    chargeType: 'fixed'
                },
                {
                    id: 'decoracion-tematica',
                    name: 'Decoración temática',
                    price: 15000,
                    chargeType: 'fixed'
                }
            ]
        }
    },

    {
        id: 'torta-infantil',
        name: 'Torta infantil temática',
        category: 'tortas',
        description: 'Torta personalizada con decoración infantil.',
        image: '',
        priceLabel: 'Desde $80.000',

        pricing: {
            type: 'fixed-by-size',

            sizes: [
                {
                    id: 'pequena',
                    name: 'Pequeña',
                    price: 80000,
                    units: 1
                },
                {
                    id: 'mediana',
                    name: 'Mediana',
                    price: 105000,
                    units: 1
                },
                {
                    id: 'grande',
                    name: 'Grande',
                    price: 135000,
                    units: 1
                }
            ],

            extras: [
                {
                    id: 'figura-personalizada',
                    name: 'Figura personalizada',
                    price: 15000,
                    chargeType: 'fixed'
                }
            ]
        }
    },

    {
        id: 'torta-aniversario',
        name: 'Torta de aniversario',
        category: 'tortas',
        description: 'Torta artesanal para celebraciones especiales.',
        image: '',
        priceLabel: 'Desde $75.000',

        pricing: {
            type: 'fixed-by-size',

            sizes: [
                {
                    id: 'pequena',
                    name: 'Pequeña',
                    price: 75000,
                    units: 1
                },
                {
                    id: 'mediana',
                    name: 'Mediana',
                    price: 95000,
                    units: 1
                },
                {
                    id: 'grande',
                    name: 'Grande',
                    price: 120000,
                    units: 1
                }
            ],

            includedFeatures: [
                'Mensaje personalizado incluido'
            ],

            extras: [
                {
                    id: 'decoracion-premium',
                    name: 'Decoración premium',
                    price: 15000,
                    chargeType: 'fixed'
                }
            ]
        }
    },


    // ========================================
    // 2. CHEESECAKES
    // ========================================

    {
        id: 'cheesecake-frutos-rojos',
        name: 'Cheesecake de frutos rojos',
        category: 'cheesecakes',
        description: 'Cheesecake cremoso con salsa de frutos rojos.',
        image: '',
        priceLabel: 'Desde $45.000',

        pricing: {
            type: 'fixed-by-presentation',

            presentations: [
                {
                    id: '6-porciones',
                    name: '6 porciones',
                    price: 45000,
                    units: 6
                },
                {
                    id: '10-porciones',
                    name: '10 porciones',
                    price: 65000,
                    units: 10
                },
                {
                    id: '15-porciones',
                    name: '15 porciones',
                    price: 85000,
                    units: 15
                }
            ],

            extras: [
                {
                    id: 'salsa-extra',
                    name: 'Salsa adicional',
                    price: 5000,
                    chargeType: 'fixed'
                }
            ]
        }
    },

    {
        id: 'cheesecake-maracuya',
        name: 'Cheesecake de maracuyá',
        category: 'cheesecakes',
        description: 'Cheesecake suave con sabor tropical a maracuyá.',
        image: '',
        priceLabel: 'Desde $45.000',

        pricing: {
            type: 'fixed-by-presentation',

            presentations: [
                {
                    id: '6-porciones',
                    name: '6 porciones',
                    price: 45000,
                    units: 6
                },
                {
                    id: '10-porciones',
                    name: '10 porciones',
                    price: 65000,
                    units: 10
                },
                {
                    id: '15-porciones',
                    name: '15 porciones',
                    price: 85000,
                    units: 15
                }
            ],

            extras: []
        }
    },

    {
        id: 'mini-cheesecake',
        name: 'Mini cheesecake',
        category: 'cheesecakes',
        description: 'Cheesecake individual disponible en varios sabores.',
        image: '',
        priceLabel: 'Desde $8.000',

        pricing: {
            type: 'fixed-by-presentation',

            presentations: [
                {
                    id: 'unidad',
                    name: 'Unidad',
                    price: 8000,
                    units: 1
                },
                {
                    id: 'caja-6',
                    name: 'Caja de 6',
                    price: 44000,
                    units: 6
                }
            ],

            flavors: [
                'Frutos rojos',
                'Maracuyá',
                'Chocolate'
            ],

            extras: []
        }
    },


    // ========================================
    // 3. CUPCAKES
    // ========================================

    {
        id: 'cupcakes-chocolate',
        name: 'Cupcakes de chocolate',
        category: 'cupcakes',
        description: 'Cupcakes esponjosos de chocolate.',
        image: '',
        priceLabel: 'Desde $24.000',

        pricing: {
            type: 'fixed-by-presentation',

            presentations: [
                {
                    id: 'caja-6',
                    name: 'Caja de 6',
                    price: 24000,
                    units: 6
                },
                {
                    id: 'caja-12',
                    name: 'Caja de 12',
                    price: 45000,
                    units: 12
                }
            ],

            extras: [
                {
                    id: 'decoracion-personalizada',
                    name: 'Decoración personalizada',
                    price: 1500,
                    chargeType: 'per-unit'
                }
            ]
        }
    },

    {
        id: 'cupcakes-vainilla',
        name: 'Cupcakes de vainilla',
        category: 'cupcakes',
        description: 'Cupcakes de vainilla con textura suave.',
        image: '',
        priceLabel: 'Desde $22.000',

        pricing: {
            type: 'fixed-by-presentation',

            presentations: [
                {
                    id: 'caja-6',
                    name: 'Caja de 6',
                    price: 22000,
                    units: 6
                },
                {
                    id: 'caja-12',
                    name: 'Caja de 12',
                    price: 42000,
                    units: 12
                }
            ],

            extras: [
                {
                    id: 'relleno-arequipe',
                    name: 'Relleno de arequipe',
                    price: 1000,
                    chargeType: 'per-unit'
                }
            ]
        }
    },

    {
        id: 'cupcakes-red-velvet',
        name: 'Cupcakes Red Velvet',
        category: 'cupcakes',
        description: 'Cupcakes Red Velvet con crema de queso.',
        image: '',
        priceLabel: 'Desde $27.000',

        pricing: {
            type: 'fixed-by-presentation',

            presentations: [
                {
                    id: 'caja-6',
                    name: 'Caja de 6',
                    price: 27000,
                    units: 6
                },
                {
                    id: 'caja-12',
                    name: 'Caja de 12',
                    price: 50000,
                    units: 12
                }
            ],

            extras: [
                {
                    id: 'decoracion-personalizada',
                    name: 'Decoración personalizada',
                    price: 1500,
                    chargeType: 'per-unit'
                }
            ]
        }
    },

    {
        id: 'cupcakes-personalizados',
        name: 'Cupcakes personalizados',
        category: 'cupcakes',
        description: 'Cupcakes con decoración básica o temática.',
        image: '',
        priceLabel: 'Desde $30.000',

        pricing: {
            type: 'fixed-combinations',

            combinations: [
                {
                    id: '6-basicos',
                    presentation: 'Caja de 6',
                    decoration: 'Básica',
                    name: 'Caja de 6 - Básica',
                    price: 30000,
                    units: 6
                },
                {
                    id: '6-tematicos',
                    presentation: 'Caja de 6',
                    decoration: 'Temática',
                    name: 'Caja de 6 - Temática',
                    price: 39000,
                    units: 6
                },
                {
                    id: '12-basicos',
                    presentation: 'Caja de 12',
                    decoration: 'Básica',
                    name: 'Caja de 12 - Básica',
                    price: 55000,
                    units: 12
                },
                {
                    id: '12-tematicos',
                    presentation: 'Caja de 12',
                    decoration: 'Temática',
                    name: 'Caja de 12 - Temática',
                    price: 72000,
                    units: 12
                }
            ],

            extras: []
        }
    },


    // ========================================
    // 4. BROWNIES
    // ========================================

    {
        id: 'brownies-clasicos',
        name: 'Brownies clásicos',
        category: 'brownies',
        description: 'Brownies artesanales de chocolate.',
        image: '',
        priceLabel: 'Desde $6.000',

        pricing: {
            type: 'fixed-by-presentation',

            presentations: [
                {
                    id: 'unidad',
                    name: 'Unidad',
                    price: 6000,
                    units: 1
                },
                {
                    id: 'caja-6',
                    name: 'Caja de 6',
                    price: 32000,
                    units: 6
                },
                {
                    id: 'caja-12',
                    name: 'Caja de 12',
                    price: 60000,
                    units: 12
                }
            ],

            extras: [
                {
                    id: 'arequipe-extra',
                    name: 'Arequipe adicional',
                    price: 2000,
                    chargeType: 'per-unit'
                }
            ]
        }
    },

    {
        id: 'brownies-nueces',
        name: 'Brownies con nueces',
        category: 'brownies',
        description: 'Brownies de chocolate con nueces.',
        image: '',
        priceLabel: 'Desde $7.000',

        pricing: {
            type: 'fixed-by-presentation',

            presentations: [
                {
                    id: 'unidad',
                    name: 'Unidad',
                    price: 7000,
                    units: 1
                },
                {
                    id: 'caja-6',
                    name: 'Caja de 6',
                    price: 38000,
                    units: 6
                },
                {
                    id: 'caja-12',
                    name: 'Caja de 12',
                    price: 70000,
                    units: 12
                }
            ],

            extras: []
        }
    },


    // ========================================
    // 5. GALLETAS
    // ========================================

    {
        id: 'galletas-chocolate',
        name: 'Galletas de chocolate',
        category: 'galletas',
        description: 'Galletas artesanales con trozos de chocolate.',
        image: '',
        priceLabel: 'Desde $4.000',

        pricing: {
            type: 'fixed-by-presentation',

            presentations: [
                {
                    id: 'unidad',
                    name: 'Unidad',
                    price: 4000,
                    units: 1
                },
                {
                    id: 'caja-6',
                    name: 'Caja de 6',
                    price: 21000,
                    units: 6
                },
                {
                    id: 'caja-12',
                    name: 'Caja de 12',
                    price: 40000,
                    units: 12
                }
            ],

            extras: []
        }
    },

    {
        id: 'galletas-decoradas',
        name: 'Galletas decoradas',
        category: 'galletas',
        description: 'Galletas con diseños sencillos o personalizados.',
        image: '',
        priceLabel: 'Desde $6.000',

        pricing: {
            type: 'fixed-by-decoration',

            minimumQuantity: 6,

            decorations: [
                {
                    id: 'sencilla',
                    name: 'Diseño sencillo',
                    price: 6000,
                    units: 1
                },
                {
                    id: 'personalizada',
                    name: 'Diseño personalizado',
                    price: 8000,
                    units: 1
                }
            ],

            extras: []
        }
    },


    // ========================================
    // 6. CAKE POPS
    // ========================================

    {
        id: 'cake-pops',
        name: 'Cake pops',
        category: 'cake-pops',
        description: 'Pequeños bocados de bizcocho cubiertos de chocolate.',
        image: '',
        priceLabel: 'Desde $5.000',

        pricing: {
            type: 'fixed-by-presentation',

            presentations: [
                {
                    id: 'unidad',
                    name: 'Unidad',
                    price: 5000,
                    units: 1
                },
                {
                    id: 'caja-6',
                    name: 'Caja de 6',
                    price: 27000,
                    units: 6
                },
                {
                    id: 'caja-12',
                    name: 'Caja de 12',
                    price: 50000,
                    units: 12
                }
            ],

            extras: [
                {
                    id: 'decoracion-tematica',
                    name: 'Decoración temática',
                    price: 1500,
                    chargeType: 'per-unit'
                }
            ]
        }
    },


    // ========================================
    // 7. POSTRES
    // ========================================

    {
        id: 'postre-tres-leches',
        name: 'Postre de tres leches',
        category: 'postres',
        description: 'Postre tradicional suave y cremoso.',
        image: '',
        priceLabel: 'Desde $9.000',

        pricing: {
            type: 'fixed-by-presentation',

            presentations: [
                {
                    id: 'personal',
                    name: 'Personal',
                    price: 9000,
                    units: 1
                },
                {
                    id: 'mediano',
                    name: 'Mediano',
                    price: 25000,
                    units: 1
                },
                {
                    id: 'familiar',
                    name: 'Familiar',
                    price: 45000,
                    units: 1
                }
            ],

            extras: [
                {
                    id: 'sabor-cafe',
                    name: 'Sabor café',
                    price: 3000,
                    chargeType: 'fixed'
                },
                {
                    id: 'sabor-chocolate',
                    name: 'Sabor chocolate',
                    price: 3000,
                    chargeType: 'fixed'
                }
            ]
        }
    },


    // ========================================
    // 8. COMBOS Y CAJAS DE REGALO
    // ========================================

    {
        id: 'caja-regalo',
        name: 'Caja regalo de repostería',
        category: 'combos',
        description: 'Selección de productos de repostería para regalar.',
        image: '',
        priceLabel: 'Desde $45.000',

        pricing: {
            type: 'fixed-or-quote',

            options: [
                {
                    id: 'basica',
                    name: 'Básica',
                    price: 45000,
                    units: 1
                },
                {
                    id: 'premium',
                    name: 'Premium',
                    price: 65000,
                    units: 1
                },
                {
                    id: 'personalizada',
                    name: 'Personalizada',
                    price: null,
                    startingPrice: 75000,
                    requiresQuote: true
                }
            ],

            extras: []
        }
    },

    {
        id: 'combo-celebracion',
        name: 'Combo celebración',
        category: 'combos',
        description: 'Torta pequeña o mediana acompañada de cupcakes.',
        image: '',
        priceLabel: 'Desde $95.000',

        pricing: {
            type: 'fixed-by-combination',

            combinations: [
                {
                    id: 'pequeno',
                    name: 'Torta pequeña + 6 cupcakes',
                    price: 95000,
                    units: 1
                },
                {
                    id: 'mediano',
                    name: 'Torta mediana + 12 cupcakes',
                    price: 145000,
                    units: 1
                }
            ],

            extras: [
                {
                    id: 'decoracion-tematica',
                    name: 'Decoración temática del combo',
                    price: 20000,
                    chargeType: 'fixed'
                }
            ]
        }
    }

];
