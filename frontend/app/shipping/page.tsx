"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

export default function ShippingPage() {
  const router = useRouter();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    addressType: "home",
    landmark: "",
    notes: "",
  });

  // ✅ Load country from localStorage
  useEffect(() => {
    const savedCountry = localStorage.getItem("userCountry");
    if (savedCountry) {
      setShippingInfo((prev) => ({
        ...prev,
        country: savedCountry,
      }));
    }
  }, []);

  // ✅ Handle input
  const handleChange = (field: string, value: string) => {
    setShippingInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Validation
  const validateForm = () => {
    const required = [
      "fullName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
    ];

    for (const field of required) {
      if (!shippingInfo[field as keyof typeof shippingInfo]) {
        toast.error("Please fill all required fields");
        return false;
      }
    }

    return true;
  };

  // ✅ Continue to checkout
  const handleContinue = () => {
    if (!validateForm()) return;

    // Save to session (used in checkout)
    sessionStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));

    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow">
        
        <h1 className="text-2xl font-bold mb-6">Shipping Information</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Full Name */}
          <Input
            placeholder="Full Name *"
            value={shippingInfo.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />

          {/* Phone */}
          <Input
            placeholder="Phone Number *"
            value={shippingInfo.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />

          {/* Email */}
          <Input
            placeholder="Email *"
            value={shippingInfo.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          {/* Address */}
          <div className="md:col-span-2">
            <Input
              placeholder="Address *"
              value={shippingInfo.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          {/* City */}
          <Input
            placeholder="City *"
            value={shippingInfo.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />

          {/* State */}
          <Input
            placeholder="State *"
            value={shippingInfo.state}
            onChange={(e) => handleChange("state", e.target.value)}
          />

          {/* ZIP */}
          <Input
            placeholder="ZIP Code *"
            value={shippingInfo.zipCode}
            onChange={(e) => handleChange("zipCode", e.target.value)}
          />

          {/* Country (readonly auto) */}
          <Input
            placeholder="Country"
            value={shippingInfo.country}
            readOnly
          />

          {/* Address Type */}
          <div className="md:col-span-2 flex gap-4 mt-2">
            {["home", "work", "other"].map((type) => (
              <button
                key={type}
                onClick={() => handleChange("addressType", type)}
                className={`px-4 py-2 border rounded ${
                  shippingInfo.addressType === type
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Landmark */}
          <div className="md:col-span-2">
            <Input
              placeholder="Landmark (optional)"
              value={shippingInfo.landmark}
              onChange={(e) => handleChange("landmark", e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <Input
              placeholder="Delivery Notes (optional)"
              value={shippingInfo.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          className="w-full mt-6"
        >
          Continue to Checkout →
        </Button>

      </div>
    </div>
  );
}