const API = "http://localhost:3000/companies";

describe("Company Management", () => {
  beforeEach(() => {
    // Clear all companies before each test to avoid stale data
    cy.request("GET", API).then((res) => {
      res.body.forEach((c) => cy.request("DELETE", `${API}/${c.id}`));
    });
    cy.visit("http://localhost:5173");
    cy.contains("Companies").click();
  });

  it("should display Company Management page", () => {
    cy.contains("Company Management").should("be.visible");
    cy.contains("All Companies").should("be.visible");
  });

  it("should not allow empty form submission", () => {
    cy.contains("Add Company").click();
    cy.on("window:alert", (text) => {
      expect(text).to.equal("Please fill all fields");
    });
  });

  it("should add a new company successfully", () => {
    const companyName = `Company${Date.now()}`;
    cy.get('input[placeholder="Company Name"]').type(companyName);
    cy.get('input[placeholder="Email"]').type(`${companyName}@gmail.com`);
    cy.get('input[placeholder="Phone"]').type("9876543210");
    cy.contains("Add Company").click();
    cy.contains(companyName).should("be.visible");
  });

  it("should not accept duplicate company", () => {
    cy.get('input[placeholder="Company Name"]').type("Duplicate Company");
    cy.get('input[placeholder="Email"]').type("duplicate@gmail.com");
    cy.get('input[placeholder="Phone"]').type("9876543211");
    cy.contains("Add Company").click();

    cy.on("window:alert", (text) => {
      expect(text).to.equal("Company already exists");
    });

    cy.get('input[placeholder="Company Name"]').clear().type("Duplicate Company");
    cy.get('input[placeholder="Email"]').clear().type("duplicate@gmail.com");
    cy.get('input[placeholder="Phone"]').clear().type("9876543211");
    cy.contains("Add Company").click();
  });

  it("should validate gmail email only", () => {
    cy.get('input[placeholder="Company Name"]').type("Email Test");
    cy.get('input[placeholder="Email"]').type("test@yahoo.com");
    cy.get('input[placeholder="Phone"]').type("9876543212");
    cy.contains("Add Company").click();
    cy.on("window:alert", (text) => {
      expect(text).to.equal("Email must end with @gmail.com");
    });
  });

  it("should validate phone number should be 10 digits", () => {
    cy.get('input[placeholder="Company Name"]').type("Phone Test");
    cy.get('input[placeholder="Email"]').type("phone@gmail.com");
    cy.get('input[placeholder="Phone"]').type("12345");
    cy.contains("Add Company").click();
    cy.on("window:alert", (text) => {
      expect(text).to.equal("Phone number must be 10 digits");
    });
  });

  it("should delete company successfully", () => {
    const companyName = `Dummy${Date.now()}`;
    cy.get('input[placeholder="Company Name"]').type(companyName);
    cy.get('input[placeholder="Email"]').type(`${companyName}@gmail.com`);
    cy.get('input[placeholder="Phone"]').type("9876543213");
    cy.contains("Add Company").click();

    cy.contains("h2", companyName).should("be.visible");

    cy.contains("h2", companyName)
      .parents('[data-testid^="company-card-"]')
      .find("button")
      .contains("Delete")
      .click();

    cy.contains("h2", companyName).should("not.exist");
  });
});