const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // Use Gmail or standard SMTP
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send email
const sendEmail = async (options) => {
  try {
    // Mock mode: just log instead of sending
    if (process.env.EMAIL_MOCK === 'true') {
      console.log('📧 MOCK EMAIL (Development Mode - no email sent)');
      console.log(`   To: ${options.email}`);
      console.log(`   Subject: ${options.subject}`);
      return { messageId: 'mock-' + Date.now(), response: 'Mock email (development mode)' };
    }

    // Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email service not configured. Set EMAIL_USER and EMAIL_PASS or set EMAIL_MOCK=true for development');
    }

    const transporter = createTransporter();
    
    if (!transporter) {
      throw new Error('Failed to create email transporter');
    }

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'Dropship Ecommerce'} <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    throw error;
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to Dropship Ecommerce</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Welcome to Dropship Ecommerce! 🎉</h1>
      </div>
      <div class="content">
        <h2>Hi ${user.firstName},</h2>
        <p>Thank you for joining Dropship Ecommerce! We're excited to have you on board.</p>
        <p>Your account has been created successfully. You can now:</p>
        <ul>
          <li>Browse our extensive product catalog</li>
          <li>Create and manage your wishlist</li>
          <li>Enjoy secure and fast checkout</li>
          <li>Track your orders in real-time</li>
        </ul>
        <a href="${process.env.FRONTEND_URL}/login" class="button">Start Shopping</a>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Happy shopping!</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Dropship Ecommerce. All rights reserved.</p>
        <p>This is an automated message, please do not reply to this email.</p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    email: user.email,
    subject: 'Welcome to Dropship Ecommerce! 🎉',
    message
  });
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (user, order) => {
  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .order-summary {
          background: white;
          padding: 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .total {
          font-weight: bold;
          font-size: 18px;
          margin-top: 10px;
        }
        .button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Order Confirmed! 🛒</h1>
      </div>
      <div class="content">
        <h2>Hi ${user.firstName},</h2>
        <p>Thank you for your order! We've received it and are processing it.</p>
        
        <div class="order-summary">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          
          <h4>Items:</h4>
          ${order.items.map(item => `
            <div class="item">
              <span>${item.productSnapshot.name} x ${item.quantity}</span>
              <span>$${item.total.toFixed(2)}</span>
            </div>
          `).join('')}
          
          <div class="item total">
            <span>Total:</span>
            <span>$${order.pricing.total.toFixed(2)}</span>
          </div>
        </div>
        
        <p>We'll send you another email when your order ships.</p>
        <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="button">View Order Details</a>
      </div>
      <div class="footer">
        <p>&copy; 2024 Dropship Ecommerce. All rights reserved.</p>
        <p>This is an automated message, please do not reply to this email.</p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    email: user.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    message
  });
};

// Send shipping confirmation email
const sendShippingConfirmationEmail = async (user, order) => {
  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Order Has Shipped!</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .tracking-info {
          background: white;
          padding: 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          background: #28a745;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Your Order Has Shipped! 🚚</h1>
      </div>
      <div class="content">
        <h2>Hi ${user.firstName},</h2>
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <div class="tracking-info">
          <h3>Tracking Information</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Carrier:</strong> ${order.shipping.tracking.carrier}</p>
          <p><strong>Tracking Number:</strong> ${order.shipping.tracking.number}</p>
          ${order.shipping.tracking.url ? `
            <a href="${order.shipping.tracking.url}" class="button">Track Package</a>
          ` : ''}
        </div>
        
        <p>Estimated delivery: ${new Date(order.shipping.estimatedDelivery).toLocaleDateString()}</p>
        <p>You can track your package status in real-time through the carrier's website.</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Dropship Ecommerce. All rights reserved.</p>
        <p>This is an automated message, please do not reply to this email.</p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    email: user.email,
    subject: `Your Order Has Shipped - ${order.orderNumber}`,
    message
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendShippingConfirmationEmail
};
