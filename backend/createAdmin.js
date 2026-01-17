const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Admin Schema
const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

async function createFirstAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@jobportal.com' });
    if (existingAdmin) {
      console.log('Admin already exists!');
      console.log('Email: admin@jobportal.com');
      console.log('Use your existing password');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin
    const admin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@jobportal.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('\n✅ First Admin Created Successfully!');
    console.log('================================');
    console.log('Email: admin@jobportal.com');
    console.log('Password: admin123');
    console.log('================================');
    console.log('\nYou can now login at: http://localhost:3000/admin/login\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createFirstAdmin();
