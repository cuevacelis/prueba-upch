"use client";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

export default function NavComponent() {
  return (
    <Navbar bg="dark" expand="lg" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand className="mx-auto" href="/">
          <img
            src="https://logo.clearbit.com/clearbit.com"
            alt="Logo de la empresa"
            className="d-inline-block align-text-top"
            height="30"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
      </Container>
    </Navbar>
  );
}
