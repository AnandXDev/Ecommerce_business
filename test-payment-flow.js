// Test script to debug payment flow
// Run this in browser console when logged in

async function testPaymentFlow() {
  console.log("🔹 Testing Payment Flow ===");
  
  try {
    // 1. Get auth token
    const token = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
    console.log("🔹 Token found:", !!token);
    
    if (!token) {
      console.error("❌ No auth token found");
      return;
    }
    
    // 2. Test Razorpay order creation
    console.log("🔹 Testing Razorpay order creation...");
    const razorpayRes = await fetch("http://localhost:5000/api/payments/create-order", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: 100,
        currency: "INR"
      })
    });
    
    const razorpayData = await razorpayRes.json();
    console.log("🔹 Razorpay order response:", razorpayData);
    
    if (razorpayData.success) {
      console.log("✅ Razorpay order created successfully");
      
      // 3. Test order fetching
      console.log("🔹 Testing order fetching...");
      const ordersRes = await fetch("http://localhost:5000/api/orders", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const ordersData = await ordersRes.json();
      console.log("🔹 Orders response:", ordersData);
      
      if (ordersData.success) {
        console.log("✅ Orders fetched successfully");
        console.log("🔹 Number of orders:", ordersData.data?.orders?.length);
        
        if (ordersData.data?.orders?.length > 0) {
          console.log("🔹 First order structure:", ordersData.data.orders[0]);
        }
      } else {
        console.error("❌ Failed to fetch orders:", ordersData.message);
      }
    } else {
      console.error("❌ Failed to create Razorpay order:", razorpayData.message);
    }
    
  } catch (error) {
    console.error("🔥 Test failed:", error);
  }
  
  console.log("🔹 Test Complete ===");
}

// Run the test
testPaymentFlow();
