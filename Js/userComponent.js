import { html, LitElement } from 'https://cdn.skypack.dev/lit';

export class UserComponent extends LitElement {
  static properties = {
    invoiceNumber: { type: String },
  };

  constructor() {
    super();
    this.invoiceNumber = this.generateInvoiceNumber(); // Genera un número de factura único
  }

  generateInvoiceNumber() {
    return `FAC-${Math.floor(Math.random() * 1000000)}`;
  }

  handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(this.shadowRoot.querySelector('#userForm'));
    const userInfo = Object.fromEntries(formData.entries());
    userInfo.invoiceNumber = this.invoiceNumber;

    // Construir mensaje de usuario para la alerta
    const userInfoString = Object.entries(userInfo)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    alert(`Información del Usuario:\n\n${userInfoString}`);
  }

  render() {
    return html`
      <div class="container mt-4">
        <h2>Formulario de Información del Usuario</h2>
        <form id="userForm" @submit="${this.handleSubmit}">
          <div class="mb-3">
            <label for="userId" class="form-label">ID</label>
            <input
              type="text"
              class="form-control"
              id="userId"
              name="userId"
              placeholder="Ingrese su ID"
              required
            />
          </div>
          <div class="mb-3">
            <label for="userName" class="form-label">Nombre</label>
            <input
              type="text"
              class="form-control"
              id="userName"
              name="userName"
              placeholder="Ingrese su nombre"
              required
            />
          </div>
          <div class="mb-3">
            <label for="userSurname" class="form-label">Apellidos</label>
            <input
              type="text"
              class="form-control"
              id="userSurname"
              name="userSurname"
              placeholder="Ingrese sus apellidos"
              required
            />
          </div>
          <div class="mb-3">
            <label for="userAddress" class="form-label">Dirección</label>
            <input
              type="text"
              class="form-control"
              id="userAddress"
              name="userAddress"
              placeholder="Ingrese su dirección"
              required
            />
          </div>
          <div class="mb-3">
            <label for="userEmail" class="form-label">Correo Electrónico</label>
            <input
              type="email"
              class="form-control"
              id="userEmail"
              name="userEmail"
              placeholder="Ingrese su correo electrónico"
              required
            />
          </div>
          <div class="mb-3">
            <label for="invoiceNumber" class="form-label">Número de Factura</label>
            <input
              type="text"
              class="form-control"
              id="invoiceNumber"
              name="invoiceNumber"
              .value="${this.invoiceNumber}"
              readonly
            />
          </div>
          <button type="submit" class="btn btn-primary">Enviar</button>
        </form>
      </div>
    `;
  }
}

customElements.define('user-component', UserComponent);
