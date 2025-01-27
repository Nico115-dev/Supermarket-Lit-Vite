import { LitElement, html } from 'https://cdn.skypack.dev/lit';

class SummaryComponent extends LitElement {
  static properties = {
    productsInCart: { type: Array },
    invoiceNumber: { type: String },
  };

  constructor() {
    super();
    this.productsInCart = []; // Inicializa la lista de productos
    this.invoiceNumber = this.generateInvoiceNumber(); // Generar un número de factura único
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('addToCart', (e) => this.addProductToCart(e.detail));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('addToCart', (e) => this.addProductToCart(e.detail));
  }

  generateInvoiceNumber() {
    return `FAC-${Math.floor(Math.random() * 1000000)}`;
  }

  addProductToCart({ productId, productName, productValue, productQuantity }) {
    const productValueNum = parseFloat(productValue);
    const productQuantityNum = parseInt(productQuantity, 10);

    if (isNaN(productValueNum) || isNaN(productQuantityNum)) {
      console.error('Error: Valores inválidos.');
      return;
    }

    const existingProduct = this.productsInCart.find((p) => p.productId === productId);
    if (existingProduct) {
      existingProduct.productQuantity += productQuantityNum;
      existingProduct.subtotal = existingProduct.productQuantity * existingProduct.productValue;
    } else {
      this.productsInCart = [
        ...this.productsInCart,
        {
          productId,
          productName,
          productValue: productValueNum,
          productQuantity: productQuantityNum,
          subtotal: productValueNum * productQuantityNum,
        },
      ];
    }
    this.requestUpdate();
  }

  removeProduct(productId) {
    this.productsInCart = this.productsInCart.filter((product) => product.productId !== productId);
    this.requestUpdate();
  }

  handlePay() {
    if (this.productsInCart.length === 0) {
      alert('No hay productos en el carrito para pagar.');
      return;
    }

    const subtotal = this.productsInCart.reduce((acc, product) => acc + product.subtotal, 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    const details = this.productsInCart
      .map(
        (p) =>
          `Producto: ${p.productName}, Cantidad: ${p.productQuantity}, Subtotal: $${p.subtotal.toFixed(2)}`
      )
      .join('\n');

    alert(
      `Factura: ${this.invoiceNumber}\n\n${details}\n\nSubtotal: $${subtotal.toFixed(
        2
      )}\nIVA (19%): $${iva.toFixed(2)}\nTotal: $${total.toFixed(2)}\n\n¡Gracias por su compra!`
    );

    this.productsInCart = [];
    this.requestUpdate();
  }

  render() {
    const subtotal = this.productsInCart.reduce((acc, product) => acc + product.subtotal, 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    return html`
      <div class="container mt-4">
        <h2>Resumen del Carrito</h2>
        ${this.productsInCart.length > 0
          ? html`
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Valor</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.productsInCart.map(
                    (product) => html`
                      <tr>
                        <td>${product.productId}</td>
                        <td>${product.productName}</td>
                        <td>${product.productValue}</td>
                        <td>${product.productQuantity}</td>
                        <td>${product.subtotal.toFixed(2)}</td>
                        <td>
                          <button
                            class="btn btn-danger btn-sm"
                            @click="${() => this.removeProduct(product.productId)}"
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    `
                  )}
                </tbody>
              </table>
            `
          : html`<p>No hay productos en el carrito.</p>`}
        <div class="mt-3 text-center">
          <table class="table w-50 mx-auto">
            <tbody>
              <tr>
                <td><strong>Subtotal:</strong></td>
                <td>$${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>IVA (19%):</strong></td>
                <td>$${iva.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Total:</strong></td>
                <td>$${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-success" @click="${this.handlePay}">Pagar</button>
        </div>
      </div>
    `;
  }
}

customElements.define('summary-component', SummaryComponent);
