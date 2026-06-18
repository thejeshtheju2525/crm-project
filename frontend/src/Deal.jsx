import { useEffect, useState } from "react";
import axios from "axios";

function Deal() {
  const [deals, setDeals] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [value, setValue] = useState("");
  const [stage, setStage] = useState("Prospecting");

  const [editingId, setEditingId] = useState(null);

  const API = "http://localhost:3000/deals";
  const COMPANY_API = "http://localhost:3000/companies";

  const getDeals = async () => {
    try {
      const res = await axios.get(API);
      setDeals(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("GET DEALS ERROR:", error);
      setDeals([]);
    }
  };

  const getCompanies = async () => {
    try {
      const res = await axios.get(COMPANY_API);
      setCompanies(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("GET COMPANIES ERROR:", error);
      setCompanies([]);
    }
  };

  const addDeal = async () => {
    if (!title || !company || !value || !stage) {
      alert("Please fill all fields");
      return;
    }

    const createdDate = new Date().toLocaleDateString();

    try {
      await axios.post(API, {
        title,
        company,
        value,
        stage,
        createdDate,
      });

      clearForm();
      getDeals();
    } catch (error) {
      console.log("ADD DEAL ERROR:", error);
    }
  };

  const updateDeal = async () => {
    if (!title || !company || !value || !stage) {
      alert("Please fill all fields");
      return;
    }

    const oldDeal = deals.find((deal) => deal.id === editingId);

    try {
      await axios.put(`${API}/${editingId}`, {
        title,
        company,
        value,
        stage,
        createdDate:
          oldDeal?.createdDate || new Date().toLocaleDateString(),
      });

      clearForm();
      getDeals();
    } catch (error) {
      console.log("UPDATE DEAL ERROR:", error);
    }
  };

  const deleteDeal = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      getDeals();
    } catch (error) {
      console.log("DELETE DEAL ERROR:", error);
    }
  };

  const editDeal = (deal) => {
    setEditingId(deal.id);
    setTitle(deal.title || "");
    setCompany(deal.company || "");
    setValue(deal.value || "");
    setStage(deal.stage || "Prospecting");
     window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearForm = () => {
    setEditingId(null);
    setTitle("");
    setCompany("");
    setValue("");
    setStage("Prospecting");
  };

  useEffect(() => {
    getDeals();
    getCompanies();
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Deal Management
      </h1>

      <div className="grid grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Deal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-3 rounded-lg"
          autoComplete="off"
        />

        <select
          value={company}
          onClick={getCompanies}
          onFocus={getCompanies}
          onChange={(e) => setCompany(e.target.value)}
          className="border p-3 rounded-lg"
        >
          <option value="">Select Company</option>
          {companies.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Deal Value"
          value={value}
          pattern="[0-9]*"
          onChange={(e) => setValue(e.target.value)}
          className="border p-3 rounded-lg"
          autoComplete="off"
        />

        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="border p-3 rounded-lg"
        >
          <option>Prospecting</option>
          <option>Proposal Sent</option>
          <option>Negotiation</option>
          <option>Won</option>
          <option>Lost</option>
        </select>
      </div>

      <div className="mt-6 flex gap-4">
        {editingId ? (
          <button
            onClick={updateDeal}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Update Deal
          </button>
        ) : (
          <button
            onClick={addDeal}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Add Deal
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
        <h2 className="text-3xl font-bold mb-6">Deal Pipeline</h2>

        <div className="grid grid-cols-2 gap-6">
          {deals.length > 0 ? (
            deals.map((deal) => (
              <div
                key={deal.id}
                className="bg-gray-100 p-6 rounded-lg shadow"
              >
                <h2 className="text-2xl font-bold text-blue-700">
                  {deal.title}
                </h2>

                <p className="text-gray-700 mt-2">
                  Company: {deal.company}
                </p>

                <p className="text-gray-700">
                  Value: ${deal.value}
                </p>

                <p className="text-gray-700">
                  Date: {deal.createdDate || "No date"}
                </p>

                <p
                  className={`mt-2 font-semibold ${
                    deal.stage === "Lost"
                      ? "text-red-600"
                      : deal.stage === "Won"
                      ? "text-green-700"
                      : "text-yellow-600"
                  }`}
                >
                  Stage: {deal.stage}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => editDeal(deal)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteDeal(deal.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No deals found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Deal;