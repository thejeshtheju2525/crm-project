import { useEffect, useState } from "react";
import axios from "axios";

function Contact() {
  const [contacts, setContacts] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("New");

  const [editingId, setEditingId] = useState(null);

  const API = "http://localhost:3000/contacts";

  const getContacts = async () => {
    try {
      const res = await axios.get(API);
      setContacts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("GET CONTACTS ERROR:", error);
      setContacts([]);
    }
  };

  const addContact = async () => {
    if (!name || !email || !phone || !status) {
      alert("Please fill all fields");
      return;
    }

    const createdDate = new Date().toLocaleDateString("en-US");

    try {
      await axios.post(API, {
        name,
        email,
        phone,
        status,
        createdDate,
      });

      clearForm();
      getContacts();
    } catch (error) {
      console.log("ADD CONTACT ERROR:", error);
    }
  };

  const updateContact = async () => {
    const oldContact = contacts.find((contact) => contact.id === editingId);

    try {
      await axios.put(`${API}/${editingId}`, {
        name,
        email,
        phone,
        status,
        createdDate: oldContact?.createdDate,
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

  const editContact = (contact) => {
    setEditingId(contact.id);
    setName(contact.name || "");
    setEmail(contact.email || "");
    setPhone(contact.phone || "");
    setStatus(contact.status || "New");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const clearForm = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPhone("");
    setStatus("New");
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date not available";

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-US");
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Contact Management
      </h1>

      <div className="grid grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Contact Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <h2 className="text-3xl font-bold mb-6">All Contacts</h2>

        <div className="grid grid-cols-2 gap-6">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <div key={contact.id} className="bg-gray-100 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-blue-700">
                  {contact.name}
                </h2>

                <p className="text-gray-700 mt-2">{contact.email}</p>
                <p className="text-gray-700">{contact.phone}</p>
                <p className="text-gray-700">
                  Created Date: {formatDate(contact.createdDate || contact.createdAt)}
                </p>

                {contact.status && (
                  <p
                    className={`mt-2 font-semibold ${
                      contact.status === "Lost"
                        ? "text-red-600"
                        : contact.status === "Qualified"
                        ? "text-green-700"
                        : "text-yellow-600"
                    }`}
                  >
                    Status: {contact.status}
                  </p>
                )}

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
            ))
          ) : (
            <p className="text-gray-500">No contacts found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;