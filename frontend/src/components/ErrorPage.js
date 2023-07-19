import React from "react";
import { useRouteError } from "react-router-dom";
import "../styles/Error.css"

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="d-flex align-items-center justify-content-center flex-column text-center">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i className="text-muted">{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
