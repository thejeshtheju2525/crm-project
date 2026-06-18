/// <reference types="cypress" />

describe("Lead Management Automation Tests", () => {
  const uniqueId = Date.now();
  const leadName = `Dummy Lead ${uniqueId}`;
  const updatedLeadName = `Updated Lead ${uniqueId}`;

  beforeEach(() => {
    cy.visit("http://localhost:5173/lead");
  });

  const addLead = (name, email, phone, status = "New") => {
    cy.get('input[placeholder="Lead Name"]').clear().type(name);
    cy.get('input[placeholder="Lead Gmail Address"]').clear().type(email);
    cy.get('input[placeholder="Lead Phone Number"]').clear().type(phone);
    cy.get("select").select(status);
    cy.contains("button", "Add Lead").click();
  };

  it("should add a new lead", () => {
    addLead(leadName, "dummylead@gmail.com", "9876543210", "New");

    cy.contains(leadName).should("be.visible");
    cy.contains("dummylead@gmail.com").should("be.visible");
    cy.contains("9876543210").should("be.visible");
    cy.contains("New").should("be.visible");
  });

  it("should not add lead with empty fields", () => {
    cy.contains("button", "Add Lead").click();

    cy.on("window:alert", (text) => {
      expect(text).to.contain("Please fill all fields");
    });
  });

  it("should edit an existing lead", () => {
    addLead(leadName, "dummylead@gmail.com", "9876543210", "New");

    cy.contains(leadName)
      .parent()
      .within(() => {
        cy.contains("button", "Edit").click();
      });

    cy.get('input[placeholder="Lead Name"]').clear().type(updatedLeadName);
    cy.get('input[placeholder="Lead Gmail Address"]').clear().type("updatedlead@gmail.com");
    cy.get('input[placeholder="Lead Phone Number"]').clear().type("9876543211");
    cy.get("select").select("Contacted");

    cy.contains("button", "Update Lead").click();

    cy.contains(updatedLeadName).should("be.visible");
    cy.contains("updatedlead@gmail.com").should("be.visible");
    cy.contains("9876543211").should("be.visible");
    cy.contains("Contacted").should("be.visible");
  });

  it("should delete an existing lead", () => {
    cy.intercept("POST", "http://localhost:3000/leads").as("addLeadRequest");
    cy.intercept("DELETE", "http://localhost:3000/leads/*").as("deleteLeadRequest");

    addLead(updatedLeadName, "updatedlead@gmail.com", "9876543211", "Contacted");
    cy.wait("@addLeadRequest");

    cy.contains("h2", updatedLeadName)
      .parent()
      .within(() => {
        cy.contains("button", "Delete").click();
      });

    cy.wait("@deleteLeadRequest").its("response.statusCode").should("eq", 200);
  });
});