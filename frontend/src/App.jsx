import { useEffect, useState } from "react";
import axios from "axios";

import Contact from "./Contact";
import Company from "./Company";
import Lead from "./Lead";
import Deal from "./Deal";

function Dashboard() {
  const [counts, setCounts] = useState({
    contacts: 0,
    companies: 0,
    leads: 0,
    deals: 0,
  });

  const getCounts = async () => {
    try {
      const [contactsRes, companiesRes, leadsRes, dealsRes] =
        await Promise.all([
          axios.get("http://localhost:3000/contacts"),
          axios.get("http://localhost:3000/companies"),
          axios.get("http://localhost:3000/leads"),
          axios.get("http://localhost:3000/deals"),
        ]);

      setCounts({
        contacts: Array.isArray(contactsRes.data) ? contactsRes.data.length : 0,
        companies: Array.isArray(companiesRes.data)
          ? companiesRes.data.length
          : 0,
        leads: Array.isArray(leadsRes.data) ? leadsRes.data.length : 0,
        deals: Array.isArray(dealsRes.data) ? dealsRes.data.length : 0,
      });
    } catch (error) {
      console.log("COUNT ERROR:", error);
    }
  };

  useEffect(() => {
    getCounts();
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        CRM Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-blue-100 p-8 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-blue-800">Contacts</h2>
          <p className="text-5xl font-bold mt-4 text-blue-900">
            {counts.contacts}
          </p>
        </div>

        <div className="bg-purple-100 p-8 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-purple-800">Companies</h2>
          <p className="text-5xl font-bold mt-4 text-purple-900">
            {counts.companies}
          </p>
        </div>

        <div className="bg-yellow-100 p-8 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-yellow-800">Leads</h2>
          <p className="text-5xl font-bold mt-4 text-yellow-900">
            {counts.leads}
          </p>
        </div>

        <div className="bg-green-100 p-8 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-green-800">Deals</h2>
          <p className="text-5xl font-bold mt-4 text-green-900">
            {counts.deals}
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const getPageFromPath = () => {
    const path = window.location.pathname;

    if (path === "/company") return "companies";
    if (path === "/contact") return "contacts";
    if (path === "/lead") return "leads";
    if (path === "/deal") return "deals";

    return "dashboard";
  };

  const [activePage, setActivePage] = useState(getPageFromPath());

  const changePage = (page, path) => {
    setActivePage(page);
    window.history.pushState(null, "", path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-screen w-64 bg-blue-900 text-white p-5 overflow-y-auto">
        <h1
          onClick={() => changePage("dashboard", "/")}
          className="text-5xl font-bold mb-10 cursor-pointer"
        >
          CRM
        </h1>

        <div className="space-y-4">
          <button
            onClick={() => changePage("contacts", "/contact")}
            className={`w-full text-left px-4 py-3 rounded-lg ${
              activePage === "contacts" ? "bg-blue-600" : "hover:bg-blue-500"
            }`}
          >
            Contacts
          </button>

          <button
            onClick={() => changePage("companies", "/company")}
            className={`w-full text-left px-4 py-3 rounded-lg ${
              activePage === "companies" ? "bg-blue-600" : "hover:bg-blue-500"
            }`}
          >
            Companies
          </button>

          <button
            onClick={() => changePage("leads", "/lead")}
            className={`w-full text-left px-4 py-3 rounded-lg ${
              activePage === "leads" ? "bg-blue-600" : "hover:bg-blue-500"
            }`}
          >
            Leads
          </button>

          <button
            onClick={() => changePage("deals", "/deal")}
            className={`w-full text-left px-4 py-3 rounded-lg ${
              activePage === "deals" ? "bg-blue-600" : "hover:bg-blue-500"
            }`}
          >
            Deals
          </button>
        </div>
      </div>

      <div className="ml-64 p-10 min-h-screen">
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "contacts" && <Contact />}
        {activePage === "companies" && <Company />}
        {activePage === "leads" && <Lead />}
        {activePage === "deals" && <Deal />}
      </div>
    </div>
  );
}

export default App;