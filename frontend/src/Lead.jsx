import { useEffect, useState } from "react";
import axios from "axios";

function Lead() {

  const [leads, setLeads] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("New");

  const [editingId, setEditingId] = useState(null);

  const API = "http://localhost:3000/leads";

  // GET LEADS
  const getLeads = async () => {

    try {

      const res = await axios.get(API);

      if (Array.isArray(res.data)) {
        setLeads(res.data);
      } else {
        setLeads([]);
      }

    } catch (error) {

      console.log("GET ERROR:", error);
      setLeads([]);

    }
  };

  // ADD LEAD
  const addLead = async () => {

    if (!name || !email || !phone || !status) {
      alert("Please fill all fields");
      return;
    }

    try {

      await axios.post(API, {
        name,
        email,
        phone,
        status,
      });

      clearForm();

      getLeads();

    } catch (error) {

      console.log("ADD ERROR:", error);

    }
  };

  // DELETE LEAD
  const deleteLead = async (id) => {

    try {

      await axios.delete(`${API}/${id}`);

      getLeads();

    } catch (error) {

      console.log("DELETE ERROR:", error);

    }
  };

  // EDIT LEAD
  const editLead = (lead) => {

    setEditingId(lead.id);

    setName(lead.name);
    setEmail(lead.email);
    setPhone(lead.phone);
    setStatus(lead.status);
  };

  // UPDATE LEAD
  const updateLead = async () => {

    if (!name || !email || !phone || !status) {
      alert("Please fill all fields");
      return;
    }

    try {

      await axios.put(`${API}/${editingId}`, {
        name,
        email,
        phone,
        status,
      });

      clearForm();

      getLeads();

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
    setStatus("New");
  };

  useEffect(() => {
    getLeads();
  }, []);

  return (

    <div className="bg-white p-8 rounded-lg shadow-lg">

      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Lead Management
      </h1>

      {/* FORM */}
      <div className="grid grid-cols-2 gap-6">

        <input
          type="text"
          placeholder="Lead Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 rounded-lg"
        />

        <input
          type="email"
          placeholder="Lead Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Lead Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-3 rounded-lg"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-3 rounded-lg"
        >
          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
          <option>Closed</option>
        </select>

      </div>

      {/* BUTTONS */}
      <div className="mt-6 flex gap-4">

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

      {/* LEAD LIST */}
      <div className="mt-10">

        <h2 className="text-3xl font-bold mb-6">
          All Leads
        </h2>

        <div className="grid grid-cols-2 gap-6">

          {leads.length > 0 ? (

            leads.map((lead) => (

              <div
                key={lead.id}
                className="bg-gray-100 p-6 rounded-lg shadow"
              >

                <h2 className="text-2xl font-bold text-blue-700">
                  {lead.name}
                </h2>

                <p className="text-gray-700 mt-2">
                  {lead.email}
                </p>

                <p className="text-gray-700">
                  {lead.phone}
                </p>

                <p className="mt-2 font-semibold text-green-700">
                  Status: {lead.status}
                </p>

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

            <p className="text-gray-500">
              No leads found
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

export default Lead;