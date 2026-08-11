import { Navbar as BsNavBar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function BrandMark() {
  return (
    <span
      className="d-grid me-2"
      style={{
        placeItems: "center",
        width: 36,
        height: 36,
        borderRadius: 10,
        background: "var(--brand)",
        color: "#fff",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="1"
          y="9"
          width="4"
          height="8"
          rx="1"
          fill="currentColor"
          opacity="0.7"
        />
        <rect
          x="7"
          y="5"
          width="4"
          height="12"
          rx="1"
          fill="currentColor"
          opacity="0.85"
        />
        <rect x="13" y="1" width="4" height="16" rx="1" fill="currentColor" />
      </svg>
    </span>
  );
}

function NavBar() {
  return (
    <BsNavBar
      bg="white"
      className="border-bottom sticky-top"
      style={{ backdropFilter: "blur(8px)" }}
    >
      <Container style={{ maxWidth: 1140 }}>
        <BsNavBar.Brand className="d-flex align-items-center">
          <BrandMark />
          <span>
            <span
              className="font-display fw-bold d-block"
              style={{ lineHeight: 1.1 }}
            >
              Flowboard
            </span>
            <small className="text-secondary" style={{ fontSize: 12 }}>
              Kanban &amp; Project Dashboard
            </small>
          </span>
        </BsNavBar.Brand>
        <Nav className="ms-auto gap-1">
          <Nav.Link as={NavLink} to="/board" className="nav-tab px-3 py-2">
            Board
          </Nav.Link>
          <Nav.Link as={NavLink} to="/dashboard" className="nav-tab px-3 py-2">
            Dashboard
          </Nav.Link>
        </Nav>
      </Container>
    </BsNavBar>
  );
}
export default NavBar;
