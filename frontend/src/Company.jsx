import { useEffect, useState } from "react";
import axios from "axios";

function Company() {

  const [companies, setCompanies] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [editingId, setEditingId] = useState(null);

  const API = "http://localhost:3000/companies";

  // GET ALL COMPANIES
  const getCompanies = async () => {

    try {

      const res = await axios.get(API);

      if (Array.isArray(res.data)) {
        setCompanies(res.data);
      } else {
        setCompanies([]);
      }

    } catch (error) {

      console.log("GET ERROR:", error);
      setCompanies([]);

    }
  };

  // ADD COMPANY
  const addCompany = async () => {

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

      getCompanies();

    } catch (error) {

      console.log("ADD ERROR:", error);

    }
  };

  // DELETE COMPANY
  const deleteCompany = async (id) => {

    try {

      await axios.delete(`${API}/${id}`);

      getCompanies();

    } catch (error) {

      console.log("DELETE ERROR:", error);

    }
  };

  // EDIT COMPANY
  const editCompany = (company) => {

    setEditingId(company.id);

    setName(company.name);
    setEmail(company.email);
    setPhone(company.phone);
  };

  // UPDATE COMPANY
  const updateCompany = async () => {

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

      getCompanies();

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
    getCompanies();
  }, []);

  return (

    <div className="bg-white p-8 rounded-lg shadow-lg">

      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Company Management
      </h1>

      {/* FORM */}
      <div className="grid grid-cols-2 gap-6">

        <input
          type="text"
          placeholder="Company Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 rounded-lg"
        />

        <input
          type="email"
          placeholder="Company Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Company Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-3 rounded-lg"
        />

      </div>

      {/* BUTTONS */}
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

      {/* COMPANY LIST */}
      <div className="mt-10">

        <h2 className="text-3xl font-bold mb-6">
          All Companies
        </h2>

        <div className="grid grid-cols-2 gap-6">

          {companies.length > 0 ? (

            companies.map((company) => (

              <div
                key={company.id}
                className="bg-gray-100 p-6 rounded-lg shadow"
              >

                <h2 className="text-2xl font-bold text-blue-700">
                  {company.name}
                </h2>

                <p className="text-gray-700 mt-2">
                  {company.email}
                </p>

                <p className="text-gray-700">
                  {company.phone}
                </p>

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

            <p className="text-gray-500">
              No companies found
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

export default Company;