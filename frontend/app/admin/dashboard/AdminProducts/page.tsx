"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";


const API = "http://localhost:5000/api/products";

const tabs = ["General", "Pricing", "Inventory", "Variants", "SEO"];

export default function ProductAdminPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    sku: "",
    brand: "",
    basePrice: "",
    cost: "",
    quantity: "",
    status: "draft",
    featured: false,
    trending: false,
    seoTitle: "",
    seoDesc: "",
    images: [{ url: "", alt: "" }],
    variants: [{
      name: "",
      price: "",
      sku: "",
      quantity: ""
    }]
  });

  // 📦 FETCH PRODUCTS
  const fetchProducts = async () => {
    const res = await axios.get(API);
    setProducts(res.data.products || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔍 SEARCH FILTER
  const filtered = products.filter((p:any) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🧠 HANDLE INPUT
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    if (name === "name") {
      setForm({
        ...form,
        name: value,
        slug: value.toLowerCase().replace(/\s+/g, "-")
      });
    } else {
      setForm({
        ...form,
        [name]: type === "checkbox" ? checked : value
      });
    }
  };

  // 🖼️ IMAGE UPLOAD
  const handleImageUpload = (e: any) => {
    
    const files = Array.from(e.target.files);

    const imgs = files.map((file: any) => ({
      url: URL.createObjectURL(file),
      alt: file.name
    }));

    setForm({ ...form, images: [...(form.images as any), ...imgs] });
  };

  // 🎯 VARIANTS
  const addVariant = () => {
    setForm({
      ...form,
      variants: [
        ...form.variants,
        { name: "", price: "", sku: "", quantity: "" }
      ]
    });
  };

  const updateVariant = (i:number, field:string, value:string) => {
    const updated = [...form.variants];
    (updated[i] as any)[field] = value;
    setForm({ ...form, variants: updated });
  };

  // 📦 INVENTORY ACTION
  const updateStock = async (id:any, type:any, qty:any) => {
    await axios.post(`${API}/${id}/stock`, {
      type,
      quantity: Number(qty)
    });
    fetchProducts();
  };

  // ➕ CREATE / UPDATE
  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      sku: form.sku,
      brand: form.brand,
      pricing: {
        basePrice: Number(form.basePrice),
        cost: Number(form.cost)
      },
      inventory: {
        quantity: Number(form.quantity)
      },
      status: form.status,
      featured: form.featured,
      trending: form.trending,
      images: form.images,
      seo: {
        title: form.seoTitle,
        description: form.seoDesc
      },
      variants: form.variants.map(v => ({
        ...v,
        price: Number(v.price),
        inventory: { quantity: Number(v.quantity) }
      }))
    };

    if (editingId) {
      await axios.put(`${API}/${editingId}`, payload);
    } else {
      await axios.post(API, payload);
    }

    setForm({ ...form, name: "", slug: "" });
    setEditingId(null);
    fetchProducts();
  };

  // ✏️ EDIT
  const handleEdit = (p:any) => {
    setEditingId(p._id);

    setForm({
      ...form,
      name: p.name,
      slug: p.slug,
      basePrice: p.pricing?.basePrice,
      quantity: p.inventory?.quantity
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-black text-white p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <p className="mb-2">📦 Products</p>
        <p>📊 Analytics</p>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <input
            placeholder="Search products..."
            className="border p-2 rounded w-1/3"
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="bg-black text-white px-4 py-2 rounded">
            + Add Product
          </button>
        </div>

        {/* FORM */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">

          {/* TABS */}
          <div className="flex gap-3 mb-4">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1 rounded ${
                  activeTab === t ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* GENERAL */}
          {activeTab === "General" && (
            <>
              <input name="name" placeholder="Product Name" onChange={handleChange} className="input" />
              <textarea name="description" placeholder="Description" onChange={handleChange} className="input" />

              <input type="file" multiple onChange={handleImageUpload} />

              <div className="flex gap-2 mt-2">
                {form.images.map((img: any, i: number) => (
                  <img key={i} src={img.url} className="w-20 h-20 rounded" />
                ))}
              </div>
            </>
          )}

          {/* PRICING */}
          {activeTab === "Pricing" && (
            <div className="grid grid-cols-2 gap-2">
              <input name="basePrice" placeholder="Price" onChange={handleChange} />
              <input name="cost" placeholder="Cost" onChange={handleChange} />
            </div>
          )}

          {/* INVENTORY */}
          {activeTab === "Inventory" && (
            <>
              <input name="quantity" placeholder="Stock" onChange={handleChange} />
            </>
          )}

          {/* VARIANTS */}
          {activeTab === "Variants" && (
            <>
              <button onClick={addVariant}>+ Add Variant</button>

              {form.variants.map((v, i) => (
                <div key={i} className="grid grid-cols-4 gap-2">
                  <input placeholder="Name" onChange={(e) => updateVariant(i, "name", e.target.value)} />
                  <input placeholder="SKU" onChange={(e) => updateVariant(i, "sku", e.target.value)} />
                  <input placeholder="Price" onChange={(e) => updateVariant(i, "price", e.target.value)} />
                  <input placeholder="Stock" onChange={(e) => updateVariant(i, "quantity", e.target.value)} />
                </div>
              ))}
            </>
          )}

          {/* SEO */}
          {activeTab === "SEO" && (
            <>
              <input name="seoTitle" placeholder="SEO Title" onChange={handleChange} />
              <textarea name="seoDesc" placeholder="SEO Description" onChange={handleChange} />
            </>
          )}

          <button onClick={handleSubmit} className="bg-black text-white px-5 py-2 rounded mt-4">
            {editingId ? "Update Product" : "Create Product"}
          </button>
        </div>

        {/* PRODUCT LIST */}
        <div className="bg-white p-4 rounded-xl shadow">
          {filtered.map((p: any) => (
            <div key={p._id} className="flex justify-between border-b py-3">

              <div>
                <h3>{p.name}</h3>
                <p>₹{p.pricing?.basePrice}</p>

                {/* STOCK STATUS */}
                <span className={`px-2 py-1 text-xs rounded ${
                  p.inventory?.quantity < 10 ? "bg-red-500 text-white" : "bg-green-500 text-white"
                }`}>
                  {p.inventory?.quantity < 10 ? "Low Stock" : "In Stock"}
                </span>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)}>Edit</button>

                <button
                  onClick={() => updateStock(p._id, "ADD", 5)}
                  className="text-green-600"
                >
                  +Stock
                </button>

                <button
                  onClick={() => updateStock(p._id, "REMOVE", 5)}
                  className="text-red-600"
                >
                  -Stock
                </button>

                <button
                  onClick={() => axios.delete(`${API}/${p._id}`).then(fetchProducts)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}