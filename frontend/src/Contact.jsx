import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "/api";

function Contact() {
  const [contacts, setContacts] = useState([]);
  const [qualifiedLeads, setQualifiedLeads] = useState([]);
  const [showLeadPicker, setShowLeadPicker] = useState(false);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState(null);

  const API = `${API_BASE}/contacts`;
  const LEADS_API = `${API_BASE}/leads`;

  const getContacts = async () => {
    try {
      const res = await axios.get(API);
      setContacts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("GET CONTACTS ERROR:", error);
      setContacts([]);
    }
  };

  const getQualifiedLeads = async () => {
    try {
      const res = await axios.get(LEADS_API);
      const leadList = Array.isArray(res.data) ? res.data : [];
      setQualifiedLeads(
        leadList.filter((lead) => lead.status === "Qualified")
      );
    } catch (error) {
      console.log("GET QUALIFIED LEADS ERROR:", error);
      setQualifiedLeads([]);
    }
  };

  useEffect(() => {
    getContacts();
    getQualifiedLeads();
  }, []);

  const selectQualifiedLead = (lead) => {
    setName(lead.name || "");
    setPosition(lead.position || lead.designation || lead.role || "");
    setEmail(lead.email || "");
    setPhone(lead.phone || "");
    setShowLeadPicker(false);
  };

  const clearForm = () => {
    setName("");
    setPosition("");
    setEmail("");
    setPhone("");
    setShowLeadPicker(false);
    setEditingId(null);
  };

  const validateContact = () => {
    if (!name || !position || !email || !phone) {
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

  const addContact = async () => {
    if (!validateContact()) return;

    const createdDate = new Date().toLocaleDateString("en-US");

    try {
      await axios.post(API, {
        name,
        position,
        designation: position,
        role: position,
        email,
        phone,
        createdDate,
      });

      clearForm();
      getContacts();
    } catch (error) {
      console.log("ADD CONTACT ERROR:", error);
    }
  };

  const editContact = (contact) => {
    setEditingId(contact.id);
    setName(contact.name || "");
    setPosition(contact.position || contact.designation || contact.role || "");
    setEmail(contact.email || "");
    setPhone(contact.phone || "");
    const pageContainer = document.querySelector("main");

    if (pageContainer) {
      pageContainer.scrollTo({ top: 0, behavior: "smooth" });
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateContact = async () => {
    if (!validateContact()) return;

    const existingContact = contacts.find((contact) => contact.id === editingId);

    try {
      await axios.put(`${API}/${editingId}`, {
        ...existingContact,
        name,
        position,
        designation: position,
        role: position,
        email,
        phone,
        createdDate:
          existingContact?.createdDate ||
          existingContact?.createdAt ||
          new Date().toLocaleDateString("en-US"),
      });

      clearForm();
      getContacts();
    } catch (error) {
      console.log("UPDATE CONTACT ERROR:", error);
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      getContacts();
    } catch (error) {
      console.log("DELETE CONTACT ERROR:", error);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date not available";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return dateValue;
    return date.toLocaleDateString("en-US");
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-8">
      <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800">
        Contact Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Contact Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 pr-16 rounded-lg w-full"
            autoComplete="off"
          />

          <button
            type="button"
            onClick={() => setShowLeadPicker(!showLeadPicker)}
            className="absolute right-2 top-1/2 flex h-10 w-11 -translate-y-1/2 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-700"
            title="Show Qualified Leads"
            aria-label="Show qualified leads"
          >
            👥
          </button>

          {showLeadPicker && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
              {qualifiedLeads.length === 0 ? (
                <p className="p-3 text-gray-500 text-sm">No qualified leads found</p>
              ) : (
                qualifiedLeads.map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => selectQualifiedLead(lead)}
                    className="w-full text-left p-3 hover:bg-blue-50 border-b last:border-b-0"
                  >
                    <p className="font-bold text-blue-700">{lead.name}</p>
                    <p className="text-sm text-gray-600">{lead.email}</p>
                    <p className="text-sm text-gray-600">{lead.phone}</p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="border p-3 rounded-lg"
          autoComplete="off"
        />

        <input
          type="email"
          placeholder="Contact Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded-lg"
          autoComplete="off"
        />

        <input
          type="text"
          placeholder="Contact Phone Number"
          value={phone}
          maxLength="10"
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          className="border p-3 rounded-lg"
          autoComplete="off"
        />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 [&>button]:w-full sm:[&>button]:w-auto">
        {editingId ? (
          <button
            onClick={updateContact}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Update Contact
          </button>
        ) : (
          <button
            onClick={addContact}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Add Contact
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
          <h2 className="text-2xl sm:text-3xl font-bold">All Contacts</h2>
          <div className="bg-blue-100 text-blue-700 font-bold px-5 py-3 rounded-lg shadow-sm">
            Total Contacts: {contacts.length}
          </div>
        </div>

        {contacts.length === 0 ? (
          <p className="text-gray-500">No contacts found</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {contacts.map((contact) => (
              <div key={contact.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-xl shadow-sm"
                    aria-hidden="true"
                  >
                    👤
                  </span>
                  <h2 className="min-w-0 break-words text-2xl font-bold text-blue-700">
                    {contact.name}
                  </h2>
                </div>

                <p className="text-gray-700 mt-2">{contact.email}</p>
                <p className="text-gray-700">
                  Position: {contact.position || contact.designation || contact.role || "N/A"}
                </p>
                <p className="text-gray-700">Phone: {contact.phone}</p>
                <p className="text-gray-700">
                  Created Date: {formatDate(contact.createdDate || contact.createdAt)}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => editContact(contact)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
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

export default Contact;
