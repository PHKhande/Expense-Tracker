const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');

//Models
const Expense = require('./models/expenses');
const ExpUser = require('./models/user');
const PremOrder = require('./models/premiumOrders');
const ForgotPasswordRequest = require('./models/forgotPassword');
const DownloadedFile = require('./models/downloadedfile');

const app = express();

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', 'views');

//Routes
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expenses');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');

//Error controller
const errorController = require('./controllers/error');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);

app.use( (req, res, next) => {
  res.sendFile( path.join( __dirname, `public/${req.url}` ) );
});

app.use(errorController.get404);

Expense.belongsTo(ExpUser, { constraints: true, onDelete: 'CASCADE' });
ExpUser.hasMany(Expense);
PremOrder.belongsTo(ExpUser, { constraints: true, onDelete: 'CASCADE' });
ExpUser.hasMany(PremOrder);
ForgotPasswordRequest.belongsTo(ExpUser, { constraints: true, onDelete: 'CASCADE' });
ExpUser.hasMany(ForgotPasswordRequest);
DownloadedFile.belongsTo(ExpUser, { constraints: true, onDelete: 'CASCADE' });
ExpUser.hasMany(DownloadedFile);


sequelize
  .sync()
  // .sync({force: true})
  .then( result => {
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });
