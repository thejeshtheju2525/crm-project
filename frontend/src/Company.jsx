import { useEffect, useState } from "react";
import axios from "axios";

function Company() {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState(null);

  const API = "http://localhost:3000/companies";

  useEffect(() => {
    getCompanies();
  }, []);

  const getCompanies = async () => {
    try {
      const res = await axios.get(API);
      setCompanies(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("GET ERROR:", error);
      setCompanies([]);
    }
  };

  const clearForm = () => {
    setName("");
    setIndustry("");
    setEmail("");
    setPhone("");
    setEditingId(null);
  };

  const validateCompany = (isUpdate = false) => {
    if (!name || !email || !phone) {
      alert("Please fill all fields");
      return false;
    }

    if (!isUpdate && !industry) {
      alert("Please select an industry");
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

  const addCompany = async () => {
    if (!validateCompany(false)) return;

    const duplicateCompany = companies.find(
      (company) =>
        company.name.toLowerCase() === name.toLowerCase() ||
        company.email.toLowerCase() === email.toLowerCase() ||
        company.phone === phone
    );

    if (duplicateCompany) {
      alert("Company already exists");
      return;
    }

    try {
      const res = await axios.post(API, {
        name,
        industry,
        email,
        phone,
      });

      setCompanies([...companies, res.data]);
      clearForm();
    } catch (error) {
      console.log("ADD ERROR:", error);
    }
  };

  const editCompany = (company) => {
    setEditingId(company.id);
    setName(company.name || "");
    setIndustry(company.industry || "");
    setEmail(company.email || "");
    setPhone(company.phone || "");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateCompany = async () => {
    if (!validateCompany(true)) return;

    try {
      await axios.put(`${API}/${editingId}`, {
        name,
        industry,
        email,
        phone,
      });

      getCompanies();
      clearForm();
    } catch (error) {
      console.log("UPDATE ERROR:", error);
    }
  };

  const deleteCompany = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      getCompanies();
    } catch (error) {
      console.log("DELETE ERROR:", error);
    }
  };

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
        />

        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="border p-3 rounded-lg bg-white"
        >
          <option value="">Select Industry</option>
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
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-3 rounded-lg"
        />
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

        {companies.length === 0 ? (
          <p className="text-gray-500">No companies found</p>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {companies.map((company) => (
              <div key={company.id} className="bg-gray-100 p-5 rounded-lg shadow">
                <h3 className="text-xl font-bold text-blue-700">
                  {company.name}
                </h3>

                <p className="mt-2">Industry: {company.industry || "N/A"}</p>
                <p>Email: {company.email}</p>
                <p>Phone: {company.phone}</p>

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