"use client";

import { useState } from "react";

export default function AdminProductsPage() {
  const [searchId, setSearchId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    sku: "",
    brand: "",
    category: "",
    supplier: "",

    pricing: {
      basePrice: "",
      comparePrice: "",
      cost: ""
    },

    inventory: {
      quantity: ""
    },

    shipping: {
      weight: ""
    },

    images: [
      { url: "", alt: "", isMain: true }
    ],

    variants: [
      {
        name: "",
        sku: "",
        price: "",
        inventory: { quantity: "" }
      }
    ],

    featured: false,
    status: "draft"
  });

  // 🔄 HANDLE INPUT
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 🔍 SEARCH
  const searchProduct = async () => {
    const res = await fetch(`http://localhost:5000/api/products/admin/${searchId}`);
    const data = await res.json();
    setFormData(data);
  };

  // ➕ ADD
const addProduct = async () => {
  const token = localStorage.getItem("token");

  const formattedData = {
    ...formData,

    category: formData.category,
    supplier: formData.supplier,

    pricing: {
      basePrice: Number(formData.pricing.basePrice),
      comparePrice: Number(formData.pricing.comparePrice),
      cost: Number(formData.pricing.cost)
    },

    inventory: {
      quantity: Number(formData.inventory.quantity)
    },

    images: [
      {
        url: formData.images[0].url,
        alt: "product image"
      }
    ],

    variants: formData.variants.map(v => ({
      name: v.name,
      sku: v.sku || `SKU-${Date.now()}`,
      price: Number(v.price),
      cost: Number(formData.pricing.cost),
      inventory: {
        quantity: Number(v.inventory?.quantity || 10)
      },
      attributes: [{ name: "Default", value: "Default" }]
    }))
  };

  const res = await fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(formattedData)
  });

  const data = await res.json();
  console.log(data);

  alert("Product Added ✅");
};

  // ✏️ UPDATE
const updateProduct = async () => {
  const token = localStorage.getItem("token");

    const formattedData = {
    ...formData,

    category: formData.category,
    supplier: formData.supplier,

    pricing: {
      basePrice: Number(formData.pricing.basePrice),
      comparePrice: Number(formData.pricing.comparePrice),
      cost: Number(formData.pricing.cost)
    },

    inventory: {
      quantity: Number(formData.inventory.quantity)
    },

    images: [
      {
        url: formData.images[0].url,
        alt: "product image"
      }
    ],

    variants: formData.variants.map(v => ({
      name: v.name,
      sku: v.sku || `SKU-${Date.now()}`,
      price: Number(v.price),
      cost: Number(formData.pricing.cost),
      inventory: {
        quantity: Number(v.inventory?.quantity || 10)
      },
      attributes: [{ name: "Default", value: "Default" }]
    }))
  };

  const res = await fetch(`http://localhost:5000/api/products/${searchId}`, {
    method: "PATCH", // ⚠️ IMPORTANT (PUT nahi, PATCH use karo)
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(formattedData) // same formattedData use karo
  });

  const data = await res.json();
  console.log(data);

  alert("Updated ✅");
};
  // ❌ DELETE
 const deleteProduct = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/api/products/${searchId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log(await res.json());

  alert("Deleted ❌");
};

  // ➕ ADD VARIANT
  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        { name: "", sku: "", price: "", inventory: { quantity: "" } }
      ]
    }));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Product CRUD</h1>

      {/* 🔍 SEARCH */}
      <div className="flex gap-2 mb-6">
        <input
          placeholder="Enter Product ID"
          className="border p-2 w-full"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={searchProduct} className="bg-blue-500 text-white px-4">
          Search
        </button>
      </div>

      {/* 📦 BASIC */}
      <h2 className="font-bold mt-4">Basic Info</h2>
      <input name="name" placeholder="Name" className="input" onChange={handleChange} value={formData.name} />
      <input name="slug" placeholder="Slug" className="input" onChange={handleChange} value={formData.slug} />
      <input name="sku" placeholder="SKU" className="input" onChange={handleChange} value={formData.sku} />
      <input name="brand" placeholder="Brand" className="input" onChange={handleChange} value={formData.brand} />

      {/* 💰 PRICING */}
      <h2 className="font-bold mt-4">Pricing</h2>
      <input name="pricing.basePrice" placeholder="Base Price" className="input" onChange={handleChange} value={formData.pricing.basePrice} />
      <input name="pricing.comparePrice" placeholder="Compare Price" className="input" onChange={handleChange} value={formData.pricing.comparePrice} />

      {/* 📊 INVENTORY */}
      <h2 className="font-bold mt-4">Inventory</h2>
      <input name="inventory.quantity" placeholder="Stock" className="input" onChange={handleChange} value={formData.inventory.quantity} />

      {/* 🚚 SHIPPING */}
      <h2 className="font-bold mt-4">Shipping</h2>
      <input name="shipping.weight" placeholder="Weight" className="input" onChange={handleChange} value={formData.shipping.weight} />

      {/* 🖼️ IMAGE */}
      <h2 className="font-bold mt-4">Image</h2>
      <input
        placeholder="Image URL"
        className="input"
        value={formData.images[0].url}
        onChange={(e) => {
          const updated = [...formData.images];
          updated[0].url = e.target.value;
          setFormData({ ...formData, images: updated });
        }}
      />

      {/* 🎨 VARIANTS */}
      <h2 className="font-bold mt-4">Variants</h2>
      {formData.variants.map((v, i) => (
        <div key={i} className="border p-2 mb-2">
          <input
            placeholder="Variant Name"
            value={v.name}
            onChange={(e) => {
              const updated = [...formData.variants];
              updated[i].name = e.target.value;
              setFormData({ ...formData, variants: updated });
            }}
          />
          <input
            placeholder="Price"
            value={v.price}
            onChange={(e) => {
              const updated = [...formData.variants];
              updated[i].price = e.target.value;
              setFormData({ ...formData, variants: updated });
            }}
          />
        </div>
      ))}

      <button onClick={addVariant} className="bg-gray-300 px-3 py-1">
        + Add Variant
      </button>

      {/* ⚡ ACTION BUTTONS */}
      <div className="flex gap-4 mt-6">
        <button onClick={addProduct} className="bg-green-500 text-white px-4 py-2">
          Add Product
        </button>

        <button onClick={updateProduct} className="bg-yellow-500 text-white px-4 py-2">
          Update Product
        </button>

        <button onClick={deleteProduct} className="bg-red-500 text-white px-4 py-2">
          Delete Product
        </button>
      </div>

      {/* STYLE */}
      <style jsx>{`
        .input {
          display: block;
          width: 100%;
          border: 1px solid #ccc;
          padding: 8px;
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
}