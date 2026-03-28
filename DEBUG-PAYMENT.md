# 🔍 PAYMENT VERIFICATION DEBUGGING GUIDE

## Step 1: Check Backend Logs
Start the backend and watch for these debug messages:
```bash
cd backend
npm start
```

Look for:
- `🔹 VERIFY PAYMENT DEBUG ===`
- `🔹 Request body: {...}`
- `🔹 User: user@example.com`

## Step 2: Test Payment Flow in Browser
1. Login to your frontend
2. Open browser console (F12)
3. Paste and run this test script:

```javascript
// Copy this entire script into browser console
async function debugPayment() {
  console.log("🚀 Starting Payment Debug ===");
  
  // Get token
  const token = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
  if (!token) {
    console.error("❌ Not logged in");
    return;
  }
  console.log("✅ Auth token found");
  
  // Fill out form first (add items to cart, go to checkout)
  // Then trigger payment and watch console logs
  
  console.log("📋 Fill checkout form and click 'Place Order' to see debug logs");
  console.log("🔹 Watch for:");
  console.log("   - 🔹 Razorpay response: {...}");
  console.log("   - 🔹 Verification response: {...}");
  console.log("   - 🔥 Verification failed: {...}");
}

debugPayment();
```

## Step 3: Common Issues & Solutions

### Issue 1: "Missing required payment data"
**Cause**: Frontend not sending proper data structure
**Fix**: Check `buildOrderPayload()` in checkout page

### Issue 2: "Invalid payment signature" 
**Cause**: Signature mismatch between Razorpay and backend
**Fix**: Check RAZORPAY_KEY_SECRET in .env

### Issue 3: "Payment not successful"
**Cause**: Razorpay payment not captured
**Fix**: Check payment status in Razorpay dashboard

### Issue 4: Orders not showing in profile
**Cause**: Order structure mismatch
**Fix**: Check `useData.tsx` transformation

## Step 4: Check Database Directly
```bash
# Connect to MongoDB
mongosh

# Check orders collection
use your_db_name
db.orders.find().pretty()

# Look for proper structure:
# - shipping.address.firstName
# - billing.address.firstName  
# - paymentDetails.transactionId
```

## Step 5: Test Individual Components

### Test Razorpay Order Creation
```javascript
fetch("http://localhost:5000/api/payments/create-order", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ amount: 100, currency: "INR" })
})
.then(res => res.json())
.then(data => console.log("Razorpay Order:", data));
```

### Test Order Fetching
```javascript
fetch("http://localhost:5000/api/orders", {
  headers: { "Authorization": `Bearer ${token}` }
})
.then(res => res.json())
.then(data => console.log("Orders:", data));
```

## Step 6: Verify Environment Variables
Check your `.env` file has:
```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

## Step 7: Check Network Tab
1. Open DevTools → Network tab
2. Complete a payment
3. Check these requests:
   - `/api/payments/create-order` (should return 200)
   - `/api/payments/verify` (should return 200)
   - `/api/orders` (should return orders with proper structure)

## Expected Successful Flow
1. ✅ Place Order → Razorpay opens
2. ✅ Payment Success → Verification request sent
3. ✅ Backend logs show "✅ Payment captured successfully"
4. ✅ Backend logs show "✅ Order saved successfully"
5. ✅ Profile page shows new order with all details

## If Still Not Working
1. Share backend console logs
2. Share browser console logs  
3. Share Network tab responses
4. Check MongoDB orders collection directly
