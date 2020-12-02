const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Users = mongoose.model('Users');

router.get('/', (req, res) => {
    res.render("layouts/users/addOrEdit", {
        viewTitle: "Insert Users"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var users = new Users();
    users.firstName = req.body.firstName;
    users.lastName = req.body.lastName;
    users.email = req.body.email;
    users.mobile = req.body.mobile;
    users.city = req.body.city;
    users.save((err, doc) => {
        if (!err)
            res.redirect('views/users/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("layouts/users/addOrEdit", {
                    viewTitle: "Insert Users",
                    users: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Users.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('views/users/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("layouts/users/addOrEdit", {
                    viewTitle: 'Update Users',
                    users: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Users.find((err, docs) => {
        if (!err) {
            res.render("views/users/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'firstName':
                body['firstNameError'] = err.errors[field].message;
                break;

            case 'lastName':
                body['lastNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}
router.get('/:id', (req, res) => {
    Users.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("layouts/users/addOrEdit", {
                viewTitle: "Update Users",
                users: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Users.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('views/users/list');
        }
        else { console.log('Error in users delete :' + err); }
    });
});

module.exports = router;
