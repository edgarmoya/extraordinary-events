import { ErrorIcon } from "../ui/icons";

export default function NotFound() {
  return (
    <section className="py-3 py-md-5 min-vh-100 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="text-center">
              <h1 className="d-flex justify-content-center align-items-center mb-4">
                <span className="display-1 fw-bold me-1">4</span>
                <i className="text-primary display-4">
                  <ErrorIcon size="4rem" />
                </i>
                <span className="display-1 fw-bold">4</span>
              </h1>
              <h2 className="mb-2">¡Vaya! Parece que estás perdido</h2>
              <p className="mb-5">
                La página que estás buscando no existe o fue movida
              </p>
              <a
                className="btn btn-primary text-white fw-semibold rounded-md px-5 fs-6 m-0"
                href="/"
                role="button"
              >
                Volver al inicio
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
