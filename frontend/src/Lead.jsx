import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "/api";

function Lead() {
  const [leads, setLeads] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("New");
  const [source, setSource] = useState("Website");
  const [editingId, setEditingId] = useState(null);

  const API = `${API_BASE}/leads`;

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

  const getLeads = async () => {
    try {
      const res = await axios.get(API);
      const leadList = Array.isArray(res.data) ? res.data : [];

      const updatedLeads = leadList.map((lead) => ({
        ...lead,
        createdDate: lead.createdDate || lead.createdAt || getTodayDate(),
        createdBy: lead.createdBy || getLoggedInUser(),
        source: lead.source || "Website",
      }));

      setLeads(updatedLeads);
    } catch (error) {
      console.log("GET LEADS ERROR:", error);
      setLeads([]);
    }
  };

  useEffect(() => {
    getLeads();
  }, []);

  const clearForm = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPhone("");
    setStatus("New");
    setSource("Website");
  };

  const validateLead = () => {
    if (!name || !email || !phone || !status || !source) {
      alert("Please fill all fields");
      return false;
    }

    if (!email.endsWith("@gmail.com")) {
      alert("Email must end with @gmail.com");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Phone number must be 10 digits");
      return false;
    }

    return true;
  };

  const addLead = async () => {
    if (!validateLead()) return;

    const duplicateLead = leads.find(
      (lead) =>
        lead.email?.toLowerCase().trim() === email.toLowerCase().trim() ||
        lead.phone?.trim() === phone.trim()
    );

    if (duplicateLead) {
      alert("Lead already exists");
      return;
    }

    try {
      await axios.post(API, {
        name,
        email,
        phone,
        status,
        source,
        createdDate: getTodayDate(),
        createdBy: getLoggedInUser(),
      });

      clearForm();
      getLeads();
    } catch (error) {
      console.log("ADD LEAD ERROR:", error);
    }
  };

  const updateLead = async () => {
    if (!validateLead()) return;

    const oldLead = leads.find((lead) => lead.id === editingId);

    try {
      await axios.put(`${API}/${editingId}`, {
        name,
        email,
        phone,
        status,
        source,
        createdDate: oldLead?.createdDate || oldLead?.createdAt || getTodayDate(),
        createdBy: oldLead?.createdBy || getLoggedInUser(),
      });

      clearForm();
      getLeads();
    } catch (error) {
      console.log("UPDATE LEAD ERROR:", error);
    }
  };

  const deleteLead = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      getLeads();
    } catch (error) {
      console.log("DELETE LEAD ERROR:", error);
    }
  };

  const editLead = (lead) => {
    setEditingId(lead.id);
    setName(lead.name || "");
    setEmail(lead.email || "");
    setPhone(lead.phone || "");
    setStatus(lead.status || "New");
    setSource(lead.source || "Website");
    const pageContainer = document.querySelector("main");

    if (pageContainer) {
      pageContainer.scrollTo({ top: 0, behavior: "smooth" });
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date not available";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return dateValue;
    return date.toLocaleDateString("en-US");
  };

  const sortedLeads = [...leads].sort(
    (a, b) =>
      getDateForSorting(a.createdDate || a.createdAt) -
      getDateForSorting(b.createdDate || b.createdAt)
  );

  const newCount = sortedLeads.filter((lead) => lead.status === "New").length;
  const contactedCount = sortedLeads.filter(
    (lead) => lead.status === "Contacted"
  ).length;
  const qualifiedCount = sortedLeads.filter(
    (lead) => lead.status === "Qualified"
  ).length;
  const lostCount = sortedLeads.filter((lead) => lead.status === "Lost").length;

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-8">
      <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800">
        Lead Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <input
          type="text"
          placeholder="Lead Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 rounded-lg"
          autoComplete="off"
        />

        <input
          type="email"
          placeholder="Lead Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded-lg"
          autoComplete="off"
        />

        <input
          type="text"
          placeholder="Lead Phone Number"
          value={phone}
          maxLength="10"
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          className="border p-3 rounded-lg"
          autoComplete="off"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-3 rounded-lg"
        >
          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
          <option>Lost</option>
        </select>

        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border p-3 rounded-lg"
        >
          <option>Website</option>
          <option>Referral</option>
          <option>Social Media</option>
          <option>Email Campaign</option>
          <option>Cold Call</option>
          <option>Event</option>
          <option>Other</option>
        </select>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 [&>button]:w-full sm:[&>button]:w-auto">
        {editingId ? (
          <button
            onClick={updateLead}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Update Lead
          </button>
        ) : (
          <button
            onClick={addLead}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Add Lead
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
          <h2 className="text-2xl sm:text-3xl font-bold">All Leads</h2>

          <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-4 text-xs sm:text-sm font-semibold">
            <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg">
              New: {newCount}
            </div>
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">
              Contacted: {contactedCount}
            </div>
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg">
              Qualified: {qualifiedCount}
            </div>
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">
              Lost: {lostCount}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {sortedLeads.length > 0 ? (
            sortedLeads.map((lead) => (
              <div key={lead.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <h2 className="text-2xl font-bold text-blue-700">
                  {lead.name}
                </h2>

                <p className="text-gray-700 mt-2">{lead.email}</p>
                <p className="text-gray-700">Phone: {lead.phone}</p>
                <p className="text-gray-700">
                  Created Date: {formatDate(lead.createdDate || lead.createdAt)}
                </p>
                <p className="text-gray-700">
                  Created By: {lead.createdBy || "admin"}
                </p>
                <p className="text-gray-700">
                  Source: {lead.source || "Website"}
                </p>

                {lead.status && (
                  <p
                    className={`mt-2 font-semibold ${
                      lead.status === "Lost"
                        ? "text-red-600"
                        : lead.status === "Qualified"
                        ? "text-green-700"
                        : lead.status === "Contacted"
                        ? "text-blue-700"
                        : "text-yellow-600"
                    }`}
                  >
                    Status: {lead.status}
                  </p>
                )}

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => editLead(lead)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteLead(lead.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No leads found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lead;
