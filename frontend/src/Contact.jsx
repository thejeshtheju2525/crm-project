import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

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
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Contact Management
      </h1>

      <div className="grid grid-cols-2 gap-6">
        <div className="relative flex gap-2">
          <input
            type="text"
            placeholder="Contact Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded-lg w-full"
            autoComplete="off"
          />

          <button
            type="button"
            onClick={() => setShowLeadPicker(!showLeadPicker)}
            className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
            title="Show Qualified Leads"
          >
            👥
          </button>

          {showLeadPicker && (
            <div className="absolute top-14 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
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

      <div className="mt-6 flex gap-4">
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">All Contacts</h2>
          <div className="bg-blue-100 text-blue-700 font-bold px-5 py-3 rounded-lg shadow-sm">
            Total Contacts: {contacts.length}
          </div>
        </div>

        {contacts.length === 0 ? (
          <p className="text-gray-500">No contacts found</p>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {contacts.map((contact) => (
              <div key={contact.id} className="bg-gray-100 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-blue-700">
                  {contact.name}
                </h2>

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
