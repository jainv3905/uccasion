const express = require('express');
const app = express();
const sequelize = require('./util/database');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const Service = require('./models/service');
const Category = require('./models/category');
const User = require('./models/user');
const Guest = require('./models/guest');
const { DataTypes } = require('sequelize');
const multer = require('multer');
const Category_Image = require('./models/category-image');
const Event = require('./models/event');
const Event_Service = require('./models/event-service');
const Vendor = require('./models/vendor');
const Vendor_Service = require('./models/vendor-service');

app.use(cors({
    allowedHeaders : "*",
    origin : "*"
  }));
app.use(express.json());

app.use(
  multer({ storage:multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,"images")
    },
    filename:function(req,file,cb){
      cb(null,file.fieldname+"-"+Date.now()+".jpg")
    }
  }) }).fields([
    { name: 'logo', maxCount: 1 },
    { name: 'image'}
  ])
);

Service.hasMany(Category, {
    foriegnKey: {
      type: DataTypes.UUID,
      allowNull: false
    }
  });
Category.belongsTo(Service, { constraints: true, onDelete: 'CASCADE' });

User.hasMany(Guest, {
  foriegnKey: {
    type: DataTypes.UUID,
    allowNull: false
  }
});
Guest.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

User.hasMany(Event, {
  foriegnKey: {
    type: DataTypes.UUID,
    allowNull: false
  }
});
Event.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

Category.hasMany(Category_Image, {
  foriegnKey: {
    type: DataTypes.UUID,
    allowNull: false
  }
});
Category_Image.belongsTo(Category, { constraints: true, onDelete: 'CASCADE' });

Category.hasMany(Category_Image, {
  foriegnKey: {
    type: DataTypes.UUID,
    allowNull: false
  }
});
Category_Image.belongsTo(Category, { constraints: true, onDelete: 'CASCADE' });

Event.hasMany(Event_Service, {
  foriegnKey: {
    type: DataTypes.UUID,
    allowNull: false
  }
});
Event_Service.belongsTo(Event, { constraints: true, onDelete: 'CASCADE' });

Vendor.hasMany(Vendor_Service, {
  foriegnKey: {
    type: DataTypes.UUID,
    allowNull: false
  }
});
Vendor_Service.belongsTo(Vendor, { constraints: true, onDelete: 'CASCADE' });

Vendor.hasMany(Category, {
  foriegnKey: {
    type: DataTypes.UUID,
    allowNull: false
  }
});
Category.belongsTo(Vendor, { constraints: true, onDelete: 'CASCADE' });

app.use(adminRoutes);
app.use(authRoutes);
app.use(userRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data,status:false });
  });

sequelize.sync()
.then(result => {
    app.listen(3000, ()=> {
        console.log('connected');
    })
})
.catch(err => console.log(err));