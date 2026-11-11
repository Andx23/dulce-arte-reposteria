
/*
 * DULCE ARTE - DATOS DEL PEDIDO
 *
 * Archivo: js/order.js
 * Tecnología: JavaScript nativo
 *
 * Responsabilidades:
 * - Controlar el método de entrega.
 * - Mostrar u ocultar los campos de domicilio.
 * - Validar los datos del cliente.
 * - Guardar los datos para el resumen del pedido.
 */

window.DulceArte = window.DulceArte || {};

(function (app) {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const orderForm = document.querySelector('#order-form');
        const deliveryFields = document.querySelector('#delivery-fields');
        const deliveryOptions = document.querySelectorAll(
            'input[name="deliveryMethod"]'
        );
        const addressInput = document.querySelector('#customer-address');
        const neighborhoodInput = document.querySelector(
            '#customer-neighborhood'
        );
        const referenceInput = document.querySelector(
            '#customer-reference'
        );
        const message = document.querySelector('#order-form-message');

        if (
            !orderForm ||
            !deliveryFields ||
            !message ||
            !addressInput ||
            !neighborhoodInput ||
            !referenceInput
        ) {
            console.error(
                'Dulce Arte: no se encontró la estructura del formulario de pedido.'
            );

            return;
        }

        /*
         * Muestra u oculta los campos de domicilio
         * según el método de entrega seleccionado.
         */
        const updateDeliveryFields = () => {
            const selectedOption = document.querySelector(
                'input[name="deliveryMethod"]:checked'
            );

            const requiresDelivery = selectedOption?.value === 'delivery';

            deliveryFields.hidden = !requiresDelivery;

            addressInput.disabled = !requiresDelivery;
            neighborhoodInput.disabled = !requiresDelivery;
            referenceInput.disabled = !requiresDelivery;

            addressInput.required = requiresDelivery;
            neighborhoodInput.required = requiresDelivery;

            if (!requiresDelivery) {
                addressInput.value = '';
                neighborhoodInput.value = '';
                referenceInput.value = '';
            }
        };

        /*
         * Limpia el mensaje y los datos guardados
         * cuando el cliente modifica el formulario.
         */
        const invalidateSavedData = () => {
            app.orderData = null;
            message.textContent = '';
            message.classList.remove('is-success', 'is-error');
        };

        deliveryOptions.forEach((option) => {
            option.addEventListener('change', () => {
                updateDeliveryFields();
                invalidateSavedData();
            });
        });

        orderForm.addEventListener('input', invalidateSavedData);

        /*
         * Guarda los datos cuando el formulario
         * supera las validaciones del navegador.
         */
        orderForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (!orderForm.reportValidity()) {
                return;
            }

            const formData = new FormData(orderForm);

            const deliveryMethod = formData.get('deliveryMethod');

            const orderData = {
                customerName: formData.get('customerName').trim(),
                customerPhone: formData.get('customerPhone').trim(),
                deliveryMethod,
                customerAddress: deliveryMethod === 'delivery'
                    ? formData.get('customerAddress').trim()
                    : '',
                customerNeighborhood: deliveryMethod === 'delivery'
                    ? formData.get('customerNeighborhood').trim()
                    : '',
                customerReference: deliveryMethod === 'delivery'
                    ? formData.get('customerReference').trim()
                    : '',
                orderNotes: formData.get('orderNotes').trim()
            };

            app.orderData = orderData;

            message.textContent =
                'Tus datos se guardaron correctamente. En la siguiente etapa podrás revisar el resumen completo antes de enviar tu solicitud a Dulce Arte.';

            message.classList.remove('is-error');
            message.classList.add('is-success');
        });

        /*
         * Estado inicial del formulario.
         */
        updateDeliveryFields();
        app.orderData = null;
    });

})(window.DulceArte);
