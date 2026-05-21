import { useEffect, useState } from "react";
import axios from "axios";

function Contact() {

  const [contacts, setContacts] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [editingId, setEditingId] = useState(null);

  const API = "http://localhost:3000/contacts";

  // GET CONTACTS
  const getContacts = async () => {

    try {

      const res = await axios.get(API);

      if (Array.isArray(res.data)) {
        setContacts(res.data);
      } else {
        setContacts([]);
      }

    } catch (error) {

      console.log("GET ERROR:", error);
      setContacts([]);

    }
  };

  // ADD CONTACT
  const addContact = async () => {

    if (!name || !email || !phone) {
      alert("Please fill all fields");
      return;
    }

    try {

      await axios.post(API, {
        name,
        email,
        phone,
      });

      clearForm();

      getContacts();

    } catch (error) {

      console.log("ADD ERROR:", error);

    }
  };

  // DELETE CONTACT
  const deleteContact = async (id) => {

    try {

      await axios.delete(`${API}/${id}`);

      getContacts();

    } catch (error) {

      console.log("DELETE ERROR:", error);

    }
  };

  // EDIT CONTACT
  const editContact = (contact) => {

    setEditingId(contact.id);

    setName(contact.name);
    setEmail(contact.email);
    setPhone(contact.phone);
  };

  // UPDATE CONTACT
  const updateContact = async () => {

    if (!name || !email || !phone) {
      alert("Please fill all fields");
      return;
    }

    try {

      await axios.put(`${API}/${editingId}`, {
        name,
        email,
        phone,
      });

      clearForm();

      getContacts();

    } catch (error) {

      console.log("UPDATE ERROR:", error);

    }
  };

  // CLEAR FORM
  const clearForm = () => {

    setEditingId(null);

    setName("");
    setEmail("");
    setPhone("");
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (

    <div className="bg-white p-8 rounded-lg shadow-lg">

      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Contact Management
      </h1>

      {/* FORM */}
      <div className="grid grid-cols-2 gap-6">

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 rounded-lg"
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Enter Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-3 rounded-lg"
        />

      </div>

      {/* BUTTONS */}
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

      {/* CONTACT LIST */}
      <div className="mt-10">

        <h2 className="text-3xl font-bold mb-6">
          All Contacts
        </h2>

        <div className="grid grid-cols-2 gap-6">

          {contacts.length > 0 ? (

            contacts.map((contact) => (

              <div
                key={contact.id}
                className="bg-gray-100 p-6 rounded-lg shadow"
              >

                <h2 className="text-2xl font-bold text-blue-700">
                  {contact.name}
                </h2>

                <p className="text-gray-700 mt-2">
                  {contact.email}
                </p>

                <p className="text-gray-700">
                  {contact.phone}
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

            ))

          ) : (

            <p className="text-gray-500">
              No contacts found
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

export default Contact;