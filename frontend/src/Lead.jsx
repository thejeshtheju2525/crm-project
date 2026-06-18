import { useEffect, useState } from "react";
import axios from "axios";

function Company() {
  const [companies, setCompanies] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("New");

  const [editingId, setEditingId] = useState(null);

  const API = "http://localhost:3000/companies";

  const getCompanies = async () => {
    try {
      const res = await axios.get(API);
      setCompanies(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("GET COMPANIES ERROR:", error);
      setCompanies([]);
    }
  };

  const addCompany = async () => {
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
      getCompanies();
    } catch (error) {
      console.log("ADD COMPANY ERROR:", error);
    }
  };

  const updateCompany = async () => {
    const oldCompany = companies.find((company) => company.id === editingId);

    try {
      await axios.put(`${API}/${editingId}`, {
        name,
        email,
        phone,
        status,
        createdDate: oldCompany?.createdDate,
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

  const editCompany = (company) => {
    setEditingId(company.id);
    setName(company.name || "");
    setEmail(company.email || "");
    setPhone(company.phone || "");
    setStatus(company.status || "New");

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
    getCompanies();
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Company Management
      </h1>

      <div className="grid grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Company Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 rounded-lg"
          autoComplete="off"
        />

        <input
          type="email"
          placeholder="Company Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded-lg"
          autoComplete="off"
        />

        <input
          type="text"
          placeholder="Company Phone Number"
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
        <h2 className="text-3xl font-bold mb-6">All Companies</h2>

        <div className="grid grid-cols-2 gap-6">
          {companies.length > 0 ? (
            companies.map((company) => (
              <div key={company.id} className="bg-gray-100 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-blue-700">
                  {company.name}
                </h2>

                <p className="text-gray-700 mt-2">{company.email}</p>
                <p className="text-gray-700">{company.phone}</p>
                <p className="text-gray-700">
                  Created Date: {formatDate(company.createdDate || company.createdAt)}
                </p>

                {company.status && (
                  <p
                    className={`mt-2 font-semibold ${
                      company.status === "Lost"
                        ? "text-red-600"
                        : company.status === "Qualified"
                        ? "text-green-700"
                        : "text-yellow-600"
                    }`}
                  >
                    Status: {company.status}
                  </p>
                )}

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => editCompany(company)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCompany(company.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No companies found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Company;