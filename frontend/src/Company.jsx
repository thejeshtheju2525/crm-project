import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "/api";

function Company() {
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactName, setContactName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const API = `${API_BASE}/companies`;
  const CONTACT_API = `${API_BASE}/contacts`;

  const getLoggedInUser = () => {
    return localStorage.getItem("crmLoggedInUser") || "admin";
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString("en-US");
  };

  const getDateForSorting = (dateValue) => {
    if (!dateValue) return Number.MAX_SAFE_INTEGER;
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return Number.MAX_SAFE_INTEGER;
    return date.getTime();
  };

  const getCompanies = async () => {
    try {
      const res = await axios.get(API);
      const companyList = Array.isArray(res.data) ? res.data : [];

      const updatedCompanies = companyList.map((company) => ({
        ...company,
        createdDate: company.createdDate || company.createdAt || getTodayDate(),
        createdBy: company.createdBy || getLoggedInUser(),
      }));

      const uniqueCompanies = updatedCompanies.filter((company, index, self) => {
        const companyName = company.name?.toLowerCase().trim();
        const companyEmail = company.email?.toLowerCase().trim();
        const companyPhone = company.phone?.trim();

        return (
          index ===
          self.findIndex(
            (item) =>
              item.name?.toLowerCase().trim() === companyName ||
              item.email?.toLowerCase().trim() === companyEmail ||
              item.phone?.trim() === companyPhone
          )
        );
      });

      setCompanies(uniqueCompanies);
    } catch (error) {
      console.log("GET COMPANIES ERROR:", error);
      setCompanies([]);
    }
  };

  const getContacts = async () => {
    try {
      const res = await axios.get(CONTACT_API);
      const contactList = Array.isArray(res.data) ? res.data : [];
      setContacts(contactList.filter((contact) => contact.name));
    } catch (error) {
      console.log("GET CONTACTS ERROR:", error);
      setContacts([]);
    }
  };

  useEffect(() => {
    getCompanies();
    getContacts();
  }, []);

  const clearForm = () => {
    setName("");
    setIndustry("");
    setEmail("");
    setPhone("");
    setContactName("");
    setEditingId(null);
  };

  const validateCompany = (isUpdate = false) => {
    if (!name || !email || !phone || !contactName) {
      alert("Please fill all fields");
      return false;
    }

    if (!isUpdate && !industry) {
      alert("Please select an industry type");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Phone number must be 10 digits");
      return false;
    }

    return true;
  };

  const addCompany = async () => {
    if (!validateCompany(false)) return;

    const duplicateCompany = companies.find(
      (company) =>
        company.name?.toLowerCase().trim() === name.toLowerCase().trim() ||
        company.email?.toLowerCase().trim() === email.toLowerCase().trim() ||
        company.phone?.trim() === phone.trim()
    );

    if (duplicateCompany) {
      alert("Company already exists");
      return;
    }

    try {
      await axios.post(API, {
        name,
        industry,
        email,
        phone,
        contactName,
        createdDate: getTodayDate(),
        createdBy: getLoggedInUser(),
      });

      clearForm();
      getCompanies();
    } catch (error) {
      console.log("ADD COMPANY ERROR:", error);
    }
  };

  const editCompany = (company) => {
    setEditingId(company.id);
    setName(company.name || "");
    setIndustry(company.industry || "");
    setEmail(company.email || "");
    setPhone(company.phone || "");
    setContactName(company.contactName || "");

    const pageContainer = document.querySelector("main");

    if (pageContainer) {
      pageContainer.scrollTo({ top: 0, behavior: "smooth" });
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateCompany = async () => {
    if (!validateCompany(true)) return;

    try {
      const existingCompany = companies.find((company) => company.id === editingId);

      await axios.put(`${API}/${editingId}`, {
        ...existingCompany,
        name,
        industry,
        email,
        phone,
        contactName,
        createdDate:
          existingCompany?.createdDate ||
          existingCompany?.createdAt ||
          getTodayDate(),
        createdBy: existingCompany?.createdBy || getLoggedInUser(),
      });

      clearForm();
      getCompanies();
    } catch (error) {
      console.log("UPDATE COMPANY ERROR:", error);
    }
  };

  const deleteCompany = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      getCompanies();
    } catch (error) {
      console.log("DELETE COMPANY ERROR:", error);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date not available";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return dateValue;
    return date.toLocaleDateString("en-US");
  };

  const sortedCompanies = [...companies].sort(
    (a, b) =>
      getDateForSorting(a.createdDate || a.createdAt) -
      getDateForSorting(b.createdDate || b.createdAt)
  );

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
          Company Management
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <input
          type="text"
          placeholder="Company Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 rounded-lg"
          autoComplete="off"
        />

        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="border p-3 rounded-lg bg-white"
        >
          <option value="">Select Industry Type</option>
          <option value="IT">IT</option>
          <option value="Education">Education</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
          <option value="Retail">Retail</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Telecom">Telecom</option>
          <option value="Real Estate">Real Estate</option>
          <option value="Logistics">Logistics</option>
          <option value="Marketing">Marketing</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded-lg"
          autoComplete="off"
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          maxLength="10"
          className="border p-3 rounded-lg"
          autoComplete="off"
        />

        <select
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          className="border p-3 rounded-lg bg-white"
        >
          <option value="">Select Contact</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.name}>
              {contact.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 [&>button]:w-full sm:[&>button]:w-auto">
        {editingId ? (
          <button
            onClick={updateCompany}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Update Company
          </button>
        ) : (
          <button
            onClick={addCompany}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Add Company
          </button>
        )}

        <button
          onClick={clearForm}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      <div className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">All Companies</h2>
          <div className="bg-blue-100 text-blue-700 font-bold px-5 py-3 rounded-lg shadow-sm">
            Total Companies: {sortedCompanies.length}
          </div>
        </div>

        {sortedCompanies.length === 0 ? (
          <p className="text-gray-500">No companies found</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {sortedCompanies.map((company) => (
              <div key={company.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <h3 className="text-xl font-bold text-blue-700">
                  {company.name}
                </h3>

                <p className="mt-2">Industry: {company.industry || "N/A"}</p>
                <p>Email: {company.email}</p>
                <p>Phone: {company.phone}</p>
                <p>Contact Name: {company.contactName || "N/A"}</p>
                <p>
                  Created Date: {formatDate(company.createdDate || company.createdAt)}
                </p>
                <p>Created By: {company.createdBy || "admin"}</p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => editCompany(company)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCompany(company.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Company;
